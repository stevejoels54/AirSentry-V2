import InsightsController from "@controllers/insights.controller";
import { Router } from "express";

const insightsRouter = Router();

const controller = new InsightsController();

insightsRouter.get("/air-quality", controller.airQualityInsights);
insightsRouter.get("/:deviceId", controller.getInsightsOnAverage);
insightsRouter.get("/sensor/:sensorId", controller.insightsBySensor);

export default insightsRouter;
