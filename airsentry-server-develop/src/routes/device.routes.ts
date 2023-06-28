import express from "express";
import DeviceController from "@controllers/device.controller";
import { validateCreateDevice } from "@src/validators";

const deviceRouter = express.Router();
const deviceController = new DeviceController();

deviceRouter.get("/", deviceController.index);
deviceRouter.get("/:id", deviceController.getDeviceDetails);
deviceRouter.post("/", [validateCreateDevice], deviceController.createDevice);
deviceRouter.put("/:id", deviceController.updateDevice);
deviceRouter.delete("/:id", deviceController.deleteDevice);

export default deviceRouter;
