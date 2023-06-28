import { IAppState } from "../../types";

const appInitialState: IAppState = {
  sensorValues: {},
  sensorValuesLoading: false,
  sensorValuesError: {},

  devices: {
    devices: [],
    devicesError: {},
    devicesLoading: false,
  },
  deviceDetails: {},
  deviceDetailsLoading: false,
  deviceDetailsError: {},

  latestReadings: {},
  latestReadingsLoading: false,
  latestReadingsError: {},

  trends: {},
  trendsLoading: false,
  trendsError: {},

  insights: {},
  insightsLoading: false,
  insightsError: {},
};

export default appInitialState;
