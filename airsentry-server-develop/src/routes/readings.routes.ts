import express from "express";
import ReadingController from "@controllers/readings.controller";

const readingRouter = express.Router();
const readingController = new ReadingController();

readingRouter.get("/latest/:deviceCode", readingController.getLatestReadings);
readingRouter.get("/", readingController.createReading);
readingRouter.put("/:id", readingController.updateReading);
readingRouter.delete("/:id", readingController.deleteReading);

export default readingRouter;
