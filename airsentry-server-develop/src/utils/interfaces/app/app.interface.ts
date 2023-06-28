import HttpStatusCodes from "@config/httpStatusCode";
import { Schema } from "mongoose";
import { Moment } from "moment-timezone";
// import express, { NextFunction } from "express"
export interface appError extends Error {
  statusCode: HttpStatusCodes;
  errorData?: object;
}

export interface ResponseData {
  [key: string]: object;
}

export interface ISensorScale extends Document {
  sensorCode: string;
  from: number;
  to: number;
  comment: string;
  colorCode: string;
  createdAt:
    | {
        type: Date;
        default: Moment;
      }
    | Date;
  updatedAt:
    | {
        type: Date;
        default: Moment;
      }
    | Date;
}

export interface ISensor extends Document {
  _id?: Schema.Types.ObjectId | string;
  sensorName: string;
  sensorCode: string;
  sensorUnits: string;
  sensorGrouping: string;
  deviceId: Schema.Types.ObjectId;
  readings: Schema.Types.ObjectId[];
  sensorIcon?: string;
  scales?: Schema.Types.ObjectId[] | ISensorScale[];
  min: number;
  max: number;
  createdAt:
    | {
        type: Date;
        default: Moment;
      }
    | Date;
  updatedAt:
    | {
        type: Date;
        default: Moment;
      }
    | Date;
}

export interface IDevice extends Document {
  deviceName: string;
  deviceCode: string;
  deviceType: string;
  deviceLocation: string;
  deviceLat: number;
  deviceLong: number;
  deviceStatus: string;
  deviceImage: string;
  createdAt:
    | {
        type: Date;
        default: Moment;
      }
    | Date;
  updatedAt:
    | {
        type: Date;
        default: Moment;
      }
    | Date;
  sensors?: Schema.Types.ObjectId[] | ISensor[];
}

export interface IReading extends Document {
  sensorCode: string;
  deviceCode: string;
  sensorValue: number | string;
  createdAt:
    | Date
    | {
        type: Date;
        default: Moment;
      };
  updatedAt: {
    type: Date;
    default: Moment;
  };
}
