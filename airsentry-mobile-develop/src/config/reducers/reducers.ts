import { IReducer } from "../../types";
import appActions from "../actions/actions";
import appInitialState from "../initialState/initialState";

const appReducer: IReducer<any> = (state = appInitialState, action) => {
  switch (action.type) {
    case appActions.GET_SENSOR_VALUES:
      return {
        ...state,
        sensorValuesLoading: true,
      };
    case appActions.GET_SENSOR_VALUES_SUCCESS:
      return {
        ...state,
        sensorValues: action.payload,
        sensorValuesLoading: false,
      };
    case appActions.GET_SENSOR_VALUES_ERROR:
      return {
        ...state,
        sensorValuesError: action.payload,
        sensorValuesLoading: false,
      };
    case appActions.GET_DEVICES_REQUEST:
      return {
        ...state,
        devices: {
          ...state.devices,
          devicesLoading: true,
        },
      };
    case appActions.GET_DEVICES_SUCCESS:
      return {
        ...state,
        devices: {
          ...state.devices,
          devices: action.payload,
          devicesLoading: false,
        },
      };
    case appActions.GET_DEVICES_ERROR:
      return {
        ...state,
        devices: {
          ...state.devices,
          devicesError: action.payload,
          devicesLoading: false,
        },
      };
    case appActions.GET_DEVICE_DETAILS_REQUEST:
      return {
        ...state,
        deviceDetailsLoading: true,
        deviceDetailsError: {},
      };
    case appActions.GET_DEVICE_DETAILS_SUCCESS:
      return {
        ...state,
        deviceDetails: action.payload,
        deviceDetailsLoading: false,
      };
    case appActions.GET_DEVICE_DETAILS_ERROR:
      return {
        ...state,
        deviceDetailsError: action.payload,
        deviceDetailsLoading: false,
      };
    case appActions.GET_LATEST_READINGS_REQUEST:
      return {
        ...state,
        latestReadingsLoading: true,
        latestReadingsError: {},
      };
    case appActions.GET_LATEST_READINGS_SUCCESS:
      return {
        ...state,
        latestReadings: action.payload,
        latestReadingsLoading: false,
      };
    case appActions.GET_LATEST_READINGS_ERROR:
      return {
        ...state,
        latestReadingsError: action.payload,
        latestReadingsLoading: false,
      };
    case appActions.GET_TRENDS_REQUEST:
      return {
        ...state,
        trendsLoading: true,
        trendsError: {},
      };
    case appActions.GET_TRENDS_SUCCESS:
      return {
        ...state,
        trends: action.payload,
        trendsLoading: false,
      };
    case appActions.GET_TRENDS_ERROR:
      return {
        ...state,
        trendsError: action.payload,
        trendsLoading: false,
      };
    case appActions.GET_INSIGHTS_REQUEST:
      return {
        ...state,
        insightsLoading: true,
        insightsError: {},
      };
    case appActions.GET_INSIGHTS_SUCCESS:
      return {
        ...state,
        insights: action.payload,
        insightsLoading: false,
      };
    case appActions.GET_INSIGHTS_ERROR:
      return {
        ...state,
        insightsError: action.payload,
        insightsLoading: false,
      };
    case appActions.SET_LATEST_READINGS:
      return {
        ...state,
        latestReadings: action.payload,
      };

    default:
      return state;
  }
};

export default appReducer;
