import { IReading } from "@utils/interfaces/app/app.interface";
import { TSensorTrend } from "@utils/types/app.types";
import { filter, map, meanBy, toString } from "lodash";
import moment, { Moment, unitOfTime } from "moment-timezone";

type TSensorPeriodOptions = {
  rangeNumbers: number[];
  periodType: unitOfTime.StartOf;
  periodSubType: unitOfTime.DurationConstructor;
  periodFormat: string;
};

export const sensorPeriodTrends = (
  period: string,
  currentDate: Moment,
  readings: IReading[],
  config: TSensorPeriodOptions
) => {
  const averageReadings =
    meanBy(
      filter(readings, (reading) => {
        const now = moment();
        const createdAt = moment(toString(reading.createdAt));

        return Number(reading.sensorValue) > 0 && createdAt.isBefore(now);
      }),
      "sensorValue"
    ) || 0;

  const periodAverageValues = map(config.rangeNumbers, (day): TSensorTrend => {
    const currentDay = currentDate
        .clone()
        .startOf(config.periodType)
        .add(day, config.periodSubType)
        .format(config.periodFormat),
      dayReadings = filter(readings, (reading) => {
        const isoDate = new Date(toString(reading.createdAt)).toISOString();

        const readingDate = moment(toString(isoDate));

        return (
          readingDate.isBetween(
            currentDate
              .clone()
              .startOf(config.periodType)
              .add(day, config.periodSubType),
            currentDate
              .clone()
              .startOf(config.periodType)
              .add(day + 1, config.periodSubType)
          ) && readingDate.isBefore(currentDate)
        );
      }),
      averageCalc = meanBy(dayReadings, "sensorValue");

    return {
      average: isNaN(averageCalc) ? 0 : Number(averageCalc.toFixed(2)),
      name: currentDay,
      period: period,
    };
  });

  return {
    averageReadings: isNaN(averageReadings)
      ? 0
      : Number(averageReadings.toFixed(2)),
    periodAverageValues,
  };
};

export const calculateSensorPeriodAverage = (
  periodType: unitOfTime.StartOf,
  readings: IReading[]
): number | string => {
  const average = meanBy(
    filter(readings, (reading) => {
      const now = moment();
      const createdAt = moment(
        new Date(toString(reading.createdAt)).toISOString()
      );

      return Number(reading.sensorValue) > 0 && createdAt.isBefore(now);
    }),
    "sensorValue"
  );

  return isNaN(average) ? 0 : Number(average.toFixed(2));
};
