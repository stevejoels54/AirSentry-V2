import HttpStatusCodes from "@config/httpStatusCode";
import Reading from "@models/reading.model";
import Sensor from "@models/sensors.model";
import { IReading, ISensor } from "@utils/interfaces/app/app.interface";
import HttpResponse from "@utils/http.util";
import { Request, Response, NextFunction } from "express";
import { filter, inRange, map, sumBy, toNumber, toString } from "lodash";
import { Socket, Server as SocketServer } from "socket.io";
import constants from "@config/constants";
import Device from "@models/device.model";
import { latestReading } from "@utils/types/app.types";
import SensorScale from "@models/scales.model";

const { socketEvents } = constants;

const http = new HttpResponse();

class ReadingController {
  /**
   *  Get latest readings
   * @param req
   * @param res
   * @param next
   * @returns
   */
  async getLatestReadings(req: Request, res: Response, next: NextFunction) {
    try {
      const { deviceCode } = req.params;

      const device = await Device.findOne({ deviceCode });

      const sensors = await Sensor.find<ISensor>({
        deviceId: device?._id,
      });

      const latestSensorReadings = await Promise.all(
        map(sensors, async (sensor): Promise<latestReading> => {
          const [sensorReading] = await Reading.find<IReading>({
            deviceCode,
            sensorCode: sensor.sensorCode,
          })
            .sort({
              _id: -1,
            })
            .limit(1);

          const sensorScales = await SensorScale.find({
            sensorCode: sensor.sensorCode,
          });

          const sensorScale = sensorScales.find((scale) =>
            inRange(Number(sensorReading?.sensorValue), scale.from, scale.to)
          );

          return {
            sensorValue: sensorReading?.sensorValue || 0,
            deviceName: device?.deviceName,
            sensorName: sensor.sensorName,
            sensorUnits: sensor.sensorUnits,
            sensorCode: sensor.sensorCode,
            sensorGrouping: sensor.sensorGrouping,
            comment: sensorScale?.comment || "",
            colorCode: sensorScale?.colorCode || "",
            sensorId: toString(sensor?._id),
            max: sensor?.max,
            min: sensor.min,
          };
        })
      );

      const airSensors = filter(
        latestSensorReadings,
        (sensor) => sensor.sensorGrouping == constants.sensorGroupings.AIR
      );

      const airQuality = sumBy(airSensors, "sensorValue") / airSensors.length;

      return http.sendSuccess(
        res,
        HttpStatusCodes.OK,
        "Latest readings retrieved successfully",
        {
          latestSensorReadings,
          airQuality: {
            value: airQuality.toFixed(2),
            units: "ppm",
          },
        }
      );
    } catch (error) {
      return http.sendError(next, "Unable to get latest readings", error);
    }
  }

  /**
   * Create reading
   * @param req
   * @param res
   * @param next
   * @returns
   */
  async createReading(req: Request, res: Response, next: NextFunction) {
    try {
      const context = req.query;

      const { deviceCode } = context;

      const io: SocketServer = req.app.get("io");

      delete context.deviceCode;

      type Reading = {
        sensorCode: string;
        sensorValue: number | string;
        deviceCode: string;
      };
      const values: Reading[] = [];

      for (const key in context) {
        values.push({
          sensorCode: key,
          sensorValue: toNumber(context[key]),
          deviceCode: toString(deviceCode),
        });
      }

      io.emit(socketEvents.NEW_READING, values);

      const reading = await Reading.insertMany(values);

      return http.sendSuccess(
        res,
        HttpStatusCodes.CREATED,
        "Reading created successfully",
        { reading }
      );
    } catch (error) {
      return http.sendError(next, "Unable to create reading", error);
    }
  }

  /**
   *  Update reading
   * @param req
   * @param res
   * @param next
   * @returns
   */
  async updateReading(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;

      const reading = await Reading.findByIdAndUpdate(id, data, {
        new: true,
      });

      return http.sendSuccess(
        res,
        HttpStatusCodes.OK,
        "Reading updated successfully",
        { reading }
      );
    } catch (error) {
      return http.sendError(next, "Unable to update reading", error);
    }
  }

  /**
   * delete reading
   * @param req
   * @param res
   * @param next
   * @returns
   */
  async deleteReading(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await Reading.findByIdAndDelete(id);

      return http.sendSuccess(
        res,
        HttpStatusCodes.OK,
        "Reading deleted successfully",
        {}
      );
    } catch (error) {
      return http.sendError(next, "Unable to delete reading", error);
    }
  }

  /**
   * Get readings by device code
   * @param req
   * @param res
   * @param next
   * */
  static async socketReadings(socket: Socket, deviceCode: string) {
    try {
      const device = await Device.findOne({ deviceCode });

      const sensors = await Sensor.find<ISensor>({
        deviceId: device?._id,
      });

      const latestSensorReadings = await Promise.all(
        map(sensors, async (sensor): Promise<latestReading> => {
          const [sensorReading] = await Reading.find<IReading>({
            deviceCode,
            sensorCode: sensor.sensorCode,
          })
            .sort({ createdAt: -1 })
            .limit(1);

          const sensorScales = await SensorScale.find({
            sensorCode: sensor.sensorCode,
          });

          const sensorScale = sensorScales.find((scale) =>
            inRange(Number(sensorReading?.sensorValue), scale.from, scale.to)
          );

          return {
            sensorValue: sensorReading?.sensorValue || 0,
            deviceName: device?.deviceName,
            sensorName: sensor.sensorName,
            sensorUnits: sensor.sensorUnits,
            sensorCode: sensor.sensorCode,
            sensorGrouping: sensor.sensorGrouping,
            comment: sensorScale?.comment || "",
            colorCode: sensorScale?.colorCode || "",
            sensorId: toString(sensor._id),
            max: sensor?.max,
            min: sensor.min,
          };
        })
      );

      const airSensors = filter(
        latestSensorReadings,
        (sensor) => sensor.sensorGrouping == constants.sensorGroupings.AIR
      );

      const airQuality = sumBy(airSensors, "sensorValue") / airSensors.length;

      socket.emit(socketEvents.READINGS, {
        latestSensorReadings,
        airQuality: {
          value: airQuality.toFixed(2),
          units: "ppm",
        },
      });
    } catch (error) {
      socket.emit("error", error);
    }
  }
}

export default ReadingController;
