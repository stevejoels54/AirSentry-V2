import HttpStatusCodes from "@config/httpStatusCode";
import AppError from "@utils/appError.util";
import { validationErrorItem } from "@utils/types/app.types";
import HttpResponse from "@utils/http.util";
import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import { isEmpty, map, replace } from "lodash";

const http = new HttpResponse();

/**
 * Validate Request body against the schema
 *
 * @param {Object} req Http Request body
 * @param {Object} res Http Response
 * @param {Function} next
 * @param {Object} schema Schema to validate
 */
const JoiValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
  schema: Schema
) => {
  const { body } = req;
  const validation = await schema.validate(body, { abortEarly: false });
  // If validation returns error, return invalid response else proceed with the request

  if (!isEmpty(validation) && validation.error) {
    const errors: validationErrorItem[] = [];

    map(validation.error.details, (e) =>
      errors.push({
        field: e?.context?.key,
        message: replace(e.message, '"', ""),
      })
    );

    return http.sendError(
      next,
      "Invalid request payload",
      new AppError("", HttpStatusCodes.UNPROCESSABLE_ENTITY, errors)
    );
  }

  return next();
};

export default JoiValidator;
