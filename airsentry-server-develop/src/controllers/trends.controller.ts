import HttpStatusCodes from "@config/httpStatusCode";
import constants from "@config/constants";
import Reading from "@models/reading.model";
import Sensor from "@models/sensors.model";
import { IReading, ISensor } from "@utils/interfaces/app/app.interface";
import HttpResponse from "@utils/http.util";
import { Request, Response, NextFunction } from "express";
import moment, { unitOfTime } from "moment-timezone";
import envVars from "@config/envVars";
import AppError from "@utils/appError.util";
import { filter, map, meanBy, range, toString } from "lodash";
import {
  calculateSensorPeriodAverage,
  sensorPeriodTrends,
} from "@src/helpers/sensorPeriod";
import { TSensorTrend } from "@utils/types/app.types";

const http = new HttpResponse();

class TrendsController {
  /**
   * get sensor reading trends
   * @param req
   * @param res
   * @param next
   */
  async getSensorReadingTrends(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { sensorId } = req.params;
      const { period } = req.query;

      const sensor = await Sensor.findById<ISensor>(sensorId);

      if (!sensor) throw new Error("Sensor not found");

      moment.tz.setDefault(envVars.timezone);

      const currentDate = moment();
      const startSearch = currentDate
        .startOf(period as unitOfTime.StartOf)
        .toDate();
      const endSearch = currentDate
        .endOf(period as unitOfTime.StartOf)
        .toDate();

      const readings: IReading[] = await Reading.find<IReading>({
        sensorCode: sensor?.sensorCode,
        createdAt: {
          $gte: startSearch,
          $lte: endSearch,
        },
      }).sort({ createdAt: -1 });

      let sensorTrends: TSensorTrend[] = [];
      let periodAverage: string | number = 0;
      const { trendPeriods } = constants;

      const now = moment();

      switch (period) {
        case trendPeriods.DAY: {
          const periodGrouping = map(
            Object.values(constants.dayPeriodGrouping),
            ({ start, end, period }) => {
              const mStart = moment(start, "HH:mm");
              const mEnd = moment(end, "HH:mm");

              const pTrends = filter(readings, ({ createdAt }) => {
                const mPeriod = moment(new Date(toString(createdAt)), "HH:mm");

                return mPeriod.isBetween(mStart, mEnd) && mPeriod.isBefore(now);
              });

              const average = meanBy(pTrends, "sensorValue") || 0;

              return {
                name: period,
                period: constants.trendPeriods.DAY,
                average,
              };
            }
          );

          sensorTrends = periodGrouping;
          periodAverage = calculateSensorPeriodAverage("D", readings);

          break;
        }

        case trendPeriods.WEEK: {
          const sensorPeriod = sensorPeriodTrends(
            trendPeriods.WEEK,
            currentDate,
            readings,
            {
              periodFormat: "ddd",
              periodSubType: "d",
              periodType: "w",
              rangeNumbers: range(0, 7),
            }
          );

          sensorTrends = sensorPeriod.periodAverageValues;
          periodAverage = sensorPeriod.averageReadings;

          break;
        }

        case trendPeriods.MONTH: {
          const sensorPeriod = sensorPeriodTrends(
            trendPeriods.MONTH,
            currentDate,
            readings,
            {
              periodFormat: "do MMM YY",
              periodSubType: "d",
              periodType: "M",
              rangeNumbers: range(0, 30),
            }
          );

          periodAverage = sensorPeriod.averageReadings;

          break;
        }
        default:
          throw new AppError("Invalid period", HttpStatusCodes.BAD_REQUEST);
      }

      http.sendSuccess(
        res,
        HttpStatusCodes.OK,
        "Reading trends retrieved successfully",
        {
          sensor,
          periodAverage,
          sensorTrends,
        }
      );
    } catch (error) {
      http.sendError(next, "Unable to get reading trends", error);
    }
  }

  /**
   * get air quality trends
   * @param req
   * @param res
   * @param next
   */
  async airQualityTrends(req: Request, res: Response, next: NextFunction) {
    try {
      const { period, deviceId } = req.query;

      moment.tz.setDefault(envVars.timezone);

      const currentDate = moment();
      const startSearch = currentDate
        .startOf(period as unitOfTime.StartOf)
        .toDate();
      const endSearch = currentDate
        .endOf(period as unitOfTime.StartOf)
        .toDate();

      const airSensors = await Sensor.find<ISensor>({
        sensorGrouping: constants.sensorGroupings.AIR,
        deviceId,
      });

      const readings = await Reading.find<IReading>({
        sensorCode: { $in: airSensors.map((s) => s.sensorCode) },
        createdAt: {
          $gte: startSearch,
          $lte: endSearch,
        },
      })
        .sort({ createdAt: -1 })
        .limit(500);

      let sensorTrends: TSensorTrend[] = [];
      let periodAverage: string | number = 0;
      const { trendPeriods } = constants;
      const now = moment();

      switch (period) {
        case trendPeriods.DAY: {
          const periodGrouping = map(
            Object.values(constants.dayPeriodGrouping),
            ({ start, end, period }) => {
              const mStart = moment(start, "HH:mm");
              const mEnd = moment(end, "HH:mm");

              const pTrends = filter(readings, ({ createdAt }) => {
                const mPeriod = moment(new Date(toString(createdAt)), "HH:mm");

                return mPeriod.isBetween(mStart, mEnd) && mPeriod.isBefore(now);
              });

              const average = meanBy(pTrends, "sensorValue") || 0;

              return {
                name: period,
                period: constants.trendPeriods.DAY,
                average,
              };
            }
          );

          sensorTrends = periodGrouping;
          periodAverage = calculateSensorPeriodAverage("D", readings);

          break;
        }

        case trendPeriods.WEEK: {
          const sensorPeriod = sensorPeriodTrends(
            trendPeriods.WEEK,
            currentDate,
            readings,
            {
              periodFormat: "ddd",
              periodSubType: "d",
              periodType: "w",
              rangeNumbers: range(0, 7),
            }
          );

          sensorTrends = sensorPeriod.periodAverageValues;
          periodAverage = sensorPeriod.averageReadings;

          break;
        }

        case trendPeriods.MONTH: {
          const sensorPeriod = sensorPeriodTrends(
            trendPeriods.MONTH,
            currentDate,
            readings,
            {
              periodFormat: "ddd do MMM",
              periodSubType: "d",
              periodType: "M",
              rangeNumbers: range(0, 30),
            }
          );

          periodAverage = sensorPeriod.averageReadings;

          break;
        }
        default:
          throw new AppError("Invalid period", HttpStatusCodes.BAD_REQUEST);
      }

      http.sendSuccess(
        res,
        HttpStatusCodes.OK,
        "Reading trends retrieved successfully",
        {
          units: "ppm",
          periodAverage,
          sensorTrends,
        }
      );
    } catch (error) {
      http.sendError(next, "Unable to get air quality trends", error);
    }
  }
}

export default TrendsController;
