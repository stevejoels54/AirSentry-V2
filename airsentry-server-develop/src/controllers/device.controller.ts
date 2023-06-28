import Device from "@models/device.model";
import HttpStatusCodes from "@config/httpStatusCode";
import HttpResponse from "@utils/http.util";
import { Request, Response, NextFunction } from "express";
import Sensor from "@models/sensors.model";
import {
  IDevice,
  ISensor,
  ISensorScale,
} from "@utils/interfaces/app/app.interface";
import { filter, map } from "lodash";
import { Schema } from "mongoose";
import SensorScale from "@src/database/models/scales.model";

const http = new HttpResponse();

class DeviceController {
  /**
   * Get all devices
   * @param req
   * @param res
   * @param next
   */
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const devices = await Device.find().populate("sensors");

      http.sendSuccess(
        res,
        HttpStatusCodes.OK,
        "Devices retrieved successfully",
        { devices }
      );
    } catch (error) {
      return http.sendError(next, "Unable to get devices", error);
    }
  }

  /**
   * Get device details
   * @param req
   * @param res
   * @param next
   */
  async getDeviceDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const device = await Device.findById(id).populate("sensors");

      type TSensorWithScale = {
        scales?: ISensorScale[];
        sensor: ISensor;
      };

      let sensors: TSensorWithScale[] = [];

      if (device?.sensors) {
        const sensorScales = await SensorScale.find({
          sensorCode: { $in: map(device.sensors as ISensor[], "sensorCode") },
        });

        sensors = map(
          device.sensors as ISensor[],
          (sensor: ISensor): TSensorWithScale => {
            const scales = filter(
              sensorScales,
              (scale: ISensorScale) => scale.sensorCode === sensor.sensorCode
            );

            return {
              sensor,
              scales,
            };
          }
        );
      }

      return http.sendSuccess(
        res,
        HttpStatusCodes.OK,
        "Device details retrieved successfully",
        { device, sensors }
      );
    } catch (error) {
      return http.sendError(next, "Unable to get device details", error);
    }
  }

  /**
   * Create device
   * @param req
   * @param res
   * @param next
   * @returns
   */
  async createDevice(req: Request, res: Response, next: NextFunction) {
    try {
      const data: IDevice = req.body;

      let { sensors } = data;

      delete data.sensors;

      const device = await Device.create(data);

      sensors = map(
        sensors as ISensor[],
        (sensor: ISensor): ISensor => ({
          ...sensor,
          deviceId: device._id as unknown as Schema.Types.ObjectId,
        })
      );

      const newSensors = await Sensor.insertMany(sensors);

      device.sensors = newSensors;
      device.save();

      return http.sendSuccess(
        res,
        HttpStatusCodes.CREATED,
        "Device created successfully",
        { device, newSensors }
      );
    } catch (error) {
      http.sendError(next, "Unable to create device", error);
    }
  }

  /**
   *  Update device
   * @param req
   * @param res
   * @param next
   * @returns
   */
  async updateDevice(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const { body } = req;

      const device = await Device.findByIdAndUpdate(id, body);

      return http.sendSuccess(
        res,
        HttpStatusCodes.OK,
        "Device updated successfully",
        { device }
      );
    } catch (error) {
      http.sendError(next, "Unable to update device", error);
    }
  }

  /**
   * Delete device
   * @param req
   * @param res
   * @param next
   * @returns
   */
  async deleteDevice(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await Sensor.deleteMany({ device: id });
      await Device.findByIdAndDelete(id);

      return http.sendSuccess(
        res,
        HttpStatusCodes.OK,
        "Device deleted successfully",
        {}
      );
    } catch (error) {
      http.sendError(next, "Unable to delete device", error);
    }
  }
}

export default DeviceController;
