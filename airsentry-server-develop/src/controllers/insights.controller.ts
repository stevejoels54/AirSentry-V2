// import Sensor from "@models/sensors.model";
import { ISensor } from "@utils/interfaces/app/app.interface";
import HttpResponse from "@utils/http.util";
import Device from "@models/device.model";
import { Request, Response, NextFunction } from "express";
import AppError from "@utils/appError.util";
import HttpStatusCodes from "@src/config/httpStatusCode";
import constants from "@config/constants";
import { isEmpty, map, toString } from "lodash";
import moment, { unitOfTime } from "moment";
import Reading from "@src/database/models/reading.model";
import { calculateSensorPeriodAverage } from "@src/helpers/sensorPeriod";
import Sensor from "@models/sensors.model";
import ChatBot from "@utils/chatBot.util";
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from "openai";
import { TSensorAverage } from "@src/utils/types/app.types";
import envVars from "@src/config/envVars";
import isValidJson from "@src/helpers/isJson";

const http = new HttpResponse();
const chatBot = new ChatBot("gpt-3.5-turbo");

class InsightsController {
  /**
   * get insights on average
   * @param req
   * @param res
   * @param next
   */
  async getInsightsOnAverage(req: Request, res: Response, next: NextFunction) {
    try {
      const { deviceId } = req.params;
      const { period } = req.query;
      const device = await Device.findById(deviceId).populate("sensors");

      if (!device)
        throw new AppError("Device not found", HttpStatusCodes.NOT_FOUND);

      if (!period)
        throw new AppError("Period is required", HttpStatusCodes.BAD_REQUEST);

      const trendPeriods = Object.values(constants.trendPeriods);

      if (!trendPeriods.includes(period as string))
        throw new AppError(
          "Invalid period. Period must be one of the following: " +
            trendPeriods.join(", "),
          HttpStatusCodes.BAD_REQUEST
        );

      moment.tz.setDefault(envVars.timezone);

      const currentDate = moment();

      const startSearch = currentDate
        .startOf(period as unitOfTime.StartOf)
        .toDate();
      const endSearch = currentDate
        .endOf(period as unitOfTime.StartOf)
        .toDate();

      const sensorsAverages: TSensorAverage[] = await Promise.all(
        map(
          device.sensors as ISensor[],
          async (sensor: ISensor): Promise<TSensorAverage> => {
            const readings = await Reading.find({
              sensorCode: sensor.sensorCode,
              createdAt: {
                $gte: startSearch,
                $lte: endSearch,
              },
            }).sort({ createdAt: -1 });

            const average = calculateSensorPeriodAverage(
              period as unitOfTime.StartOf,
              readings
            );

            return {
              sensor: sensor.sensorName,
              average,
              units: sensor.sensorUnits,
            };
          }
        )
      );

      const sensors: string = map(sensorsAverages, "sensor").join(", ");
      const sensorWithValues = map(
        sensorsAverages,
        (sensor) => `${sensor.sensor} of ${sensor.average}${sensor.units}`
      ).join(", ");

      const insightPrompt: ChatCompletionRequestMessage[] = [
        {
          role: constants.chatGPTRoles
            .user as ChatCompletionRequestMessageRoleEnum,
          content: constants.chatInsightQuestions.generalInsights(
            sensorWithValues,
            sensors,
            toString(device.location),
            `these are ${period}ly averages in ${moment().format("MMMM YYYY")}`
          ),
        },
      ];

      const insights = await chatBot.chatCompletion(insightPrompt);

      http.sendSuccess(
        res,
        HttpStatusCodes.OK,
        "Successfully retrieved insights",
        {
          insights: isValidJson(insights?.content as string)
            ? JSON.parse(insights?.content as string)
            : [],
          sensors,
          device,
        }
      );
    } catch (error) {
      http.sendError(next, "Unable to get insights", error);
    }
  }

  /**
   * sensor insights
   * @param req
   * @param res
   * @param next
   */
  async insightsBySensor(req: Request, res: Response, next: NextFunction) {
    try {
      const { sensorId } = req.params;
      const { period } = req.query;

      if (!sensorId || !period)
        throw new AppError(
          "SensorId and period are required",
          HttpStatusCodes.BAD_REQUEST
        );

      const sensor = await Sensor.findById<ISensor>(sensorId);

      if (!sensor)
        throw new AppError("Sensor not found", HttpStatusCodes.NOT_FOUND);

      const device = await Device.findById(sensor.deviceId);

      if (!device)
        throw new AppError("Device not found", HttpStatusCodes.NOT_FOUND);

      moment.tz.setDefault(envVars.timezone);

      const currentDate = moment();

      const startSearch = currentDate
        .startOf(period as unitOfTime.StartOf)
        .toDate();
      const endSearch = currentDate
        .endOf(period as unitOfTime.StartOf)
        .toDate();

      const readings = await Reading.find({
        sensorCode: sensor.sensorCode,
        createdAt: {
          $gte: startSearch,
          $lte: endSearch,
        },
      }).sort({ createdAt: -1 });

      const average = calculateSensorPeriodAverage(
        period as unitOfTime.StartOf,
        readings
      );

      const insightPrompt: ChatCompletionRequestMessage[] = [
        {
          role: constants.chatGPTRoles
            .user as ChatCompletionRequestMessageRoleEnum,
          content: constants.chatInsightQuestions.generalInsights(
            `${sensor.sensorName} of ${average}${sensor.sensorUnits}`,
            sensor.sensorName,
            toString(device.location),
            `these are ${period}ly averages in ${moment().format("MMMM YYYY")}`
          ),
        },
      ];

      const insights = await chatBot.chatCompletion(insightPrompt);

      http.sendSuccess(
        res,
        HttpStatusCodes.OK,
        "Successfully retrieved insights",
        {
          average,
          insights: isValidJson(insights?.content as string)
            ? JSON.parse(insights?.content as string)
            : [],
        }
      );
    } catch (error) {
      http.sendError(next, "Unable to get insights", error);
    }
  }

  /**
   * air quality insights
   * @param req
   * @param res
   * @param next
   */
  async airQualityInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const { period, deviceId } = req.query;

      if (!period || !deviceId)
        throw new AppError(
          "Period and deviceId are required",
          HttpStatusCodes.BAD_REQUEST
        );

      const device = await Device.findById(deviceId);

      if (!device)
        throw new AppError("Device not found", HttpStatusCodes.NOT_FOUND);

      const airSensors = await Sensor.find<ISensor>({
        sensorGrouping: constants.sensorGroupings.AIR,
        deviceId,
      });

      if (isEmpty(airSensors))
        throw new AppError("No air sensors found", HttpStatusCodes.NOT_FOUND);

      moment.tz.setDefault(envVars.timezone);

      const currentDate = moment();

      const startSearch = currentDate
        .startOf(period as unitOfTime.StartOf)
        .toDate();
      const endSearch = currentDate
        .endOf(period as unitOfTime.StartOf)
        .toDate();

      const sensorsAverages: TSensorAverage[] = await Promise.all(
        map(
          airSensors as ISensor[],
          async (sensor: ISensor): Promise<TSensorAverage> => {
            const readings = await Reading.find({
              sensorCode: sensor.sensorCode,
              createdAt: {
                $gte: startSearch,
                $lte: endSearch,
              },
            }).sort({ createdAt: -1 });

            const average = calculateSensorPeriodAverage(
              period as unitOfTime.StartOf,
              readings
            );

            return {
              sensor: sensor.sensorName,
              average,
              units: sensor.sensorUnits,
            };
          }
        )
      );

      const sensors: string = map(sensorsAverages, "sensor").join(", ");
      const sensorWithValues = map(
        sensorsAverages,
        (sensor) => `${sensor.sensor} of ${sensor.average}${sensor.units}`
      ).join(", ");

      const insightPrompt: ChatCompletionRequestMessage[] = [
        {
          role: constants.chatGPTRoles
            .user as ChatCompletionRequestMessageRoleEnum,
          content: constants.chatInsightQuestions.generalInsights(
            sensorWithValues,
            sensors,
            toString(device?.location),
            `these are ${period}ly averages in ${moment().format("MMMM YYYY")}`
          ),
        },
      ];

      const insights = await chatBot.chatCompletion(insightPrompt);

      http.sendSuccess(
        res,
        HttpStatusCodes.OK,
        "Successfully retrieved air quality insights",
        {
          insights: isValidJson(insights?.content as string)
            ? JSON.parse(insights?.content as string)
            : [],
          sensors,
          device,
        }
      );
    } catch (error) {
      http.sendError(next, "Unable to get insights", error);
    }
  }
}

export default InsightsController;
