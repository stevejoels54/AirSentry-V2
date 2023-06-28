import TrendsController from "@controllers/trends.controller";
import { Router } from "express";

const trendsRouter = Router();
const trendsController = new TrendsController();

trendsRouter.get("/sensors/:sensorId", trendsController.getSensorReadingTrends);
trendsRouter.get("/air-quality", trendsController.airQualityTrends);

export default trendsRouter;
