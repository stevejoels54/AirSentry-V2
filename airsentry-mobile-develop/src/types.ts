export interface IAppState {
  sensorValues: ISensorValues;
  sensorValuesLoading: boolean;
  sensorValuesError: ISensorValuesError;
  devices: Object;
  deviceDetails: Object;
  deviceDetailsLoading: boolean;
  deviceDetailsError: Object;
  latestReadings: Object;
  latestReadingsLoading: boolean;
  latestReadingsError: Object;
  trends: Object;
  trendsLoading: boolean;
  trendsError: Object;
  insights: Object;
  insightsLoading: boolean;
  insightsError: Object;
}

interface ISensorValues {
  [key: string]: any;
}

interface ISensorValuesError {
  [key: string]: any;
}

export interface IAction {
  type: string;
  payload: any;
}

export interface IReducer<T> {
  (state: T, action: IAction): T;
}

export interface ICondition {
  name: string;
  value: number | string;
  comment: string;
  progress: number;
  color: string;
}
