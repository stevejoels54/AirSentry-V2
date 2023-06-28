import AppController from "@controllers/app/AppController";
import express from "express";
import deviceRouter from "./device.routes";
import readingRouter from "./readings.routes";
import sensorRouter from "./sensor.routes";
import trendsRouter from "./trends.routes";
import insightsRouter from "./insights.routes";

const indexRouter = express.Router();

const prefix = "/api/v1";

indexRouter.get(`/`, AppController.index);
indexRouter.use(`${prefix}/devices`, deviceRouter);
indexRouter.use(`${prefix}/readings`, readingRouter);
indexRouter.use(`${prefix}/sensors`, sensorRouter);
indexRouter.use(`${prefix}/trends`, trendsRouter);
indexRouter.use(`${prefix}/insights`, insightsRouter);

export default indexRouter;
