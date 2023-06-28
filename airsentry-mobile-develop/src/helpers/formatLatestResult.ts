import { filter, find, inRange, map, meanBy } from "lodash";

type TDeviceDetails = {
  device: {
    deviceName: string;
  };
  sensors: {
    sensor: {
      sensorCode: string;
      sensorName: string;
      sensorUnits: string;
      sensorGrouping: string;
      _id: string;
      min: number;
      max: number;
    };
    scales: {
      from: number;
      to: number;
      colorCode: string;
      comment: string;
    }[];
  }[];
};

type TReading = {
  sensorCode: string;
  sensorValue: number;
  deviceCode: string;
};

type TSensor = {
  sensorCode: string;
  sensorName: string;
  sensorUnits: string;
  sensorGrouping: string;
  _id: string;
};

type TScale = {
  from: number;
  to: number;
  colorCode: string;
  comment: string;
};

const formatLatestResult = (
  latestReadings: TReading,
  deviceDetails: TDeviceDetails
) => {
  const readings = map(latestReadings, (item: TReading) => {
    const sensor = find(
      deviceDetails?.sensors,
      (s) => s.sensor.sensorCode === item.sensorCode
    );
    const sensorScale = sensor?.scales.find((scale: TScale) =>
      inRange(Number(item.sensorValue), scale.from, scale.to)
    );

    return {
      colorCode: sensorScale?.colorCode,
      comment: sensorScale?.comment || "No Comment",
      deviceName: deviceDetails?.device?.deviceName,
      sensorCode: sensor?.sensor?.sensorCode,
      sensorId: sensor?.sensor?._id,
      sensorName: sensor?.sensor?.sensorName,
      sensorValue: Number(item?.sensorValue),
      sensorUnits: sensor?.sensor?.sensorUnits,
      sensorGrouping: sensor?.sensor?.sensorGrouping,
      min: sensor?.sensor.min,
      max: sensor?.sensor?.max,
    };
  });

  const airSensors = filter(
    readings,
    (sensor: TSensor) => sensor.sensorGrouping == "air"
  );

  const airQuality = meanBy(airSensors, "sensorValue");

  return {
    latestSensorReadings: readings,
    airQuality: {
      value: Number(airQuality.toFixed(2)),
      units: "ppm",
    },
  };
};

export default formatLatestResult;
