import { IAction } from "../../types";

const appActions = {
  GET_SENSOR_VALUES: "GET_SENSOR_VALUES",
  GET_SENSOR_VALUES_SUCCESS: "GET_SENSOR_VALUES_SUCCESS",
  GET_SENSOR_VALUES_ERROR: "GET_SENSOR_VALUES_ERROR",

  GET_DEVICES_REQUEST: "GET_DEVICES_REQUEST",
  GET_DEVICES_SUCCESS: "GET_DEVICES_SUCCESS",
  GET_DEVICES_ERROR: "GET_DEVICES_ERROR",

  GET_DEVICE_DETAILS_REQUEST: "GET_DEVICE_DETAILS_REQUEST",
  GET_DEVICE_DETAILS_SUCCESS: "GET_DEVICE_DETAILS_SUCCESS",
  GET_DEVICE_DETAILS_ERROR: "GET_DEVICE_DETAILS_ERROR",

  GET_LATEST_READINGS_REQUEST: "GET_LATEST_READINGS_REQUEST",
  GET_LATEST_READINGS_SUCCESS: "GET_LATEST_READINGS_SUCCESS",
  GET_LATEST_READINGS_ERROR: "GET_LATEST_READINGS_ERROR",

  GET_TRENDS_REQUEST: "GET_TRENDS_REQUEST",
  GET_TRENDS_SUCCESS: "GET_TRENDS_SUCCESS",
  GET_TRENDS_ERROR: "GET_TRENDS_ERROR",

  GET_INSIGHTS_REQUEST: "GET_INSIGHTS_REQUEST",
  GET_INSIGHTS_SUCCESS: "GET_INSIGHTS_SUCCESS",
  GET_INSIGHTS_ERROR: "GET_INSIGHTS_ERROR",

  SET_LATEST_READINGS: "SET_LATEST_READINGS",

  getSensorValues: (): IAction => ({
    type: appActions.GET_SENSOR_VALUES,
    payload: null,
  }),
  getDevices: () => ({
    type: appActions.GET_DEVICES_REQUEST,
  }),
  getDeviceDetails: (deviceCode: string) => ({
    type: appActions.GET_DEVICE_DETAILS_REQUEST,
    payload: deviceCode,
  }),
  getLatestReadings: (deviceCode: string) => ({
    type: appActions.GET_LATEST_READINGS_REQUEST,
    payload: deviceCode,
  }),
  getTrends: (deviceCode: string, urlPath: string, period: string) => ({
    type: appActions.GET_TRENDS_REQUEST,
    payload: { deviceCode, urlPath, period },
  }),
  getInsights: (deviceCode: string, urlPath: string, period: string) => ({
    type: appActions.GET_INSIGHTS_REQUEST,
    payload: { deviceCode, urlPath, period },
  }),
  setLatestReadings: (latestReadings: Object) => ({
    type: appActions.SET_LATEST_READINGS,
    payload: latestReadings,
  }),
};

export default appActions;
