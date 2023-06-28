import { takeLatest, fork, put } from "redux-saga/effects";
import axios from "axios";
import appActions from "../actions/actions";
import { AxiosResponse } from "axios";

function* getSensorValues(): Generator<any, void, AxiosResponse> {
  try {
    const response: AxiosResponse = yield axios.get("/api/sensors");
    yield put({
      type: appActions.GET_SENSOR_VALUES_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({
      type: appActions.GET_SENSOR_VALUES_ERROR,
      payload: error,
    });
  }
}

function* watchGetSensorValues() {
  yield takeLatest(appActions.GET_SENSOR_VALUES, getSensorValues);
}

function* getDevices(): Generator<any, void, AxiosResponse> {
  try {
    const response = yield axios.get("/devices");
    yield put({
      type: appActions.GET_DEVICES_SUCCESS,
      payload: response.data.devices,
    });
  } catch (error) {
    yield put({
      type: appActions.GET_DEVICES_ERROR,
      payload: error,
    });
  }
}

function* watchGetDevices() {
  yield takeLatest(appActions.GET_DEVICES_REQUEST, getDevices);
}

function* getDeviceDetails(action: any): Generator<any, void, AxiosResponse> {
  try {
    const response = yield axios.get(`/devices/${action.payload}`);
    yield put({
      type: appActions.GET_DEVICE_DETAILS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({
      type: appActions.GET_DEVICE_DETAILS_ERROR,
      payload: error,
    });
  }
}

function* watchGetDeviceDetails() {
  yield takeLatest(appActions.GET_DEVICE_DETAILS_REQUEST, getDeviceDetails);
}

function* getLatestReadings(action: any): Generator<any, void, AxiosResponse> {
  try {
    const response = yield axios.get(`/readings/latest/${action.payload}`);
    yield put({
      type: appActions.GET_LATEST_READINGS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({
      type: appActions.GET_LATEST_READINGS_ERROR,
      payload: error,
    });
  }
}

function* watchGetLatestReadings() {
  yield takeLatest(appActions.GET_LATEST_READINGS_REQUEST, getLatestReadings);
}

function* getTrends(action: any): Generator<any, void, AxiosResponse> {
  try {
    const response = yield axios.get(`/trends/${action.payload.urlPath}`, {
      params: {
        period: action.payload.period,
      },
    });
    yield put({
      type: appActions.GET_TRENDS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({
      type: appActions.GET_TRENDS_ERROR,
      payload: error,
    });
  }
}

function* watchGetTrends() {
  yield takeLatest(appActions.GET_TRENDS_REQUEST, getTrends);
}

function* getInsights(action: any): Generator<any, void, AxiosResponse> {
  try {
    const response = yield axios.get(`/insights/${action.payload.urlPath}`, {
      params: {
        period: action.payload.period,
      },
    });
    yield put({
      type: appActions.GET_INSIGHTS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({
      type: appActions.GET_INSIGHTS_ERROR,
      payload: error,
    });
  }
}

function* watchGetInsights() {
  yield takeLatest(appActions.GET_INSIGHTS_REQUEST, getInsights);
}

export default function* rootSaga() {
  yield fork(watchGetSensorValues);
  yield fork(watchGetDevices);
  yield fork(watchGetDeviceDetails);
  yield fork(watchGetLatestReadings);
  yield fork(watchGetTrends);
  yield fork(watchGetInsights);
}
