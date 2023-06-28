import express from "express";
import SensorController from "@controllers/sensor.controller";

const sensorRouter = express.Router();
const sensorController = new SensorController();

sensorRouter.get("/", sensorController.index);
sensorRouter.post("/", sensorController.createSensor);
sensorRouter.put("/:id", sensorController.updateSensor);
sensorRouter.get("/:id", sensorController.getSensorDetails);
sensorRouter.delete("/:id", sensorController.deleteSensor);
sensorRouter.post("/scales", sensorController.bulkCreateSensorScales);
sensorRouter.put("/scales/:id", sensorController.updateSensorScale);
sensorRouter.delete("/scales/:id", sensorController.deleteSensorScales);

export default sensorRouter;
