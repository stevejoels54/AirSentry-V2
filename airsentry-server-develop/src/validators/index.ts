import JoiValidator from "@middleware/app/joiValidator";
import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validateCreateDevice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sensorsPayload = Joi.object({
    sensorName: Joi.string().required(),
    sensorCode: Joi.string().required(),
    sensorUnits: Joi.string().required(),
  });

  return await JoiValidator(
    req,
    res,
    next,
    Joi.object({
      deviceName: Joi.string().required(),
      deviceCode: Joi.string().required(),
      deviceType: Joi.string().required(),
      deviceLocation: Joi.string().required(),
      deviceLat: Joi.number(),
      deviceLong: Joi.number(),
      deviceStatus: Joi.string(),
      deviceImage: Joi.string(),
      sensors: Joi.array().items(sensorsPayload).required(),
    })
  );
};

export const validateCreateSensors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await JoiValidator(
    req,
    res,
    next,
    Joi.object({
      sensorName: Joi.string().required(),
      sensorCode: Joi.string().required(),
      sensorUnits: Joi.string().required(),
      deviceId: Joi.string().required(),
    })
  );
};
