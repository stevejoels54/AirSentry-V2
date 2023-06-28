import { configureStore, combineReducers } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./reducers/reducers";
import rootSaga from "./sagas/sagas";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: combineReducers({ rootReducer }),
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(rootSaga);

export default store;
