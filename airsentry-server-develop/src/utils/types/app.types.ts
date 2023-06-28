export type serverResponse = {
  server: {
    status: boolean;
    message?: string | null;
  };
};

export type validationErrorItem = {
  field: string | undefined;
  message: string;
};

export type latestReading = {
  sensorValue: string | number;
  deviceName: string | undefined;
  sensorName: string;
  sensorUnits: string;
  sensorCode: string;
  sensorGrouping: string;
  comment?: string;
  colorCode?: string;
  sensorId: string;
  min: number;
  max: number;
};

export type TSensorTrend = {
  average: number | string;
  name: string;
  period: string;
};

export type TSensorAverage = {
  sensor: string;
  average: number | string;
  units: string;
};
