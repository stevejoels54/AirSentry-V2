import HttpStatusCodes from "@config/httpStatusCode";
import Sensor from "@models/sensors.model";
import { ISensor } from "@utils/interfaces/app/app.interface";
import HttpResponse from "@utils/http.util";
import { Request, Response, NextFunction } from "express";
import SensorScale from "@src/database/models/scales.model";
import Device from "@src/database/models/device.model";
import { Schema } from "mongoose";

const http = new HttpResponse();

class SensorController {
  /**
   * Get all sensors
   * @param req
   * @param res
   * @param next
   * @returns
   */
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const sensors = await Sensor.find().populate({
        path: "deviceId",
        select: "deviceName",
      });

      http.sendSuccess(
        res,
        HttpStatusCodes.OK,
        "Sensors retrieved successfully",
        { sensors }
      );
    } catch (error) {
      return http.sendError(next, "Unable to get sensors", error);
    }
  }

  /**
   *  Get sensor details
   * @param req
   * @param res
   * @param next
   * @returns
   */
  async createSensor(req: Request, res: Response, next: NextFunction) {
    try {
      const data: ISensor = req.body;
      const sensor = await Sensor.create(data);

      const device = await Device.findById(sensor.deviceId).populate("sensors");

      if (device?.sensors) {
        const sensors = [...device.sensors, sensor._id];

        device.sensors = sensors as Schema.Types.ObjectId[];

        await device.save();
      }

      http.sendSuccess(
        res,
        HttpStatusCodes.CREATED,
        "Sensor created successfully",
        { sensor }
      );
    } catch (error) {
      return http.sendError(next, "Unable to create sensor", error);
    }
  }

  /**
   *  Get sensor details
   * @param req
   * @param res
   * @param next
   * @returns
   */
  async updateSensor(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data: ISensor = req.body;
      const sensor = await Sensor.findByIdAndUpdate(id, data, {
        new: true,
      });

      http.sendSuccess(res, HttpStatusCodes.OK, "Sensor updated successfully", {
        sensor,
      });
    } catch (error) {
      return http.sendError(next, "Unable to update sensor", error);
    }
  }

  /**
   *  Get sensor details
   * @param req
   * @param res
   * @param next
   * @returns
   */
  async getSensorDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const sensor = await Sensor.findById(id)
        .populate("device")
        .populate("readings");

      return http.sendSuccess(
        res,
        HttpStatusCodes.OK,
        "Sensor details retrieved successfully",
        { sensor }
      );
    } catch (error) {
      return http.sendError(next, "Unable to get sensor details", error);
    }
  }

  /**
   * delete sensor
   * @param req
   * @param res
   * @param next
   * @returns
   */
  async deleteSensor(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const sensor = await Sensor.findByIdAndDelete(id);

      return http.sendSuccess(
        res,
        HttpStatusCodes.OK,
        "Sensor deleted successfully",
        { sensor }
      );
    } catch (error) {
      return http.sendError(next, "Unable to delete sensor", error);
    }
  }

  /**
   * bulk create sensor scales
   * @param req
   * @param res
   * @param next
   * @returns
   */
  async bulkCreateSensorScales(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { sensorScales } = req.body;

      const scales = await SensorScale.insertMany(sensorScales);

      return http.sendSuccess(
        res,
        HttpStatusCodes.OK,
        "Sensor scales created successfully",
        { scales }
      );
    } catch (error) {
      return http.sendError(next, "Unable to create sensor scales", error);
    }
  }

  /**
   * delete sensor scale
   * @param req
   * @param res
   * @param next
   * @returns
   */
  async deleteSensorScales(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const scales = await SensorScale.findByIdAndDelete(id);

      return http.sendSuccess(
        res,
        HttpStatusCodes.OK,
        "Sensor scales deleted successfully",
        { scales }
      );
    } catch (error) {
      return http.sendError(next, "Unable to delete sensor scales", error);
    }
  }

  /**
   * update sensor scale
   * @param req
   * @param res
   * @param next
   * @returns
   */
  async updateSensorScale(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const data = req.body;

      const updatedSensorScale = await SensorScale.findByIdAndUpdate(id, data, {
        new: true,
      });

      return http.sendSuccess(
        res,
        HttpStatusCodes.OK,
        "Sensor scale updated successfully",
        { updatedSensorScale }
      );
    } catch (error) {
      return http.sendError(next, "Unable to update sensor scale", error);
    }
  }
}

export default SensorController;
