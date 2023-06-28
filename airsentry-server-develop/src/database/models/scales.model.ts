import { model, Schema } from "mongoose";
import momentTimezone from "moment-timezone";
import envVars from "@config/envVars";

import { ISensorScale } from "@utils/interfaces/app/app.interface";

// Set the time zone to Ugandan Time (EAT)
momentTimezone.tz.setDefault(envVars.timezone);

const SensorScaleSchema = new Schema<ISensorScale>({
  sensorCode: {
    type: String,
    ref: "Sensor",
    index: true,
  },
  from: Number,
  to: Number,
  comment: String,
  colorCode: String,
  createdAt: {
    type: Date,
    default: momentTimezone().format("YYYY-MM-DD HH:mm:ss"),
  },
  updatedAt: {
    type: Date,
    default: momentTimezone().format("YYYY-MM-DD HH:mm:ss"),
  },
});

const SensorScale = model("SensorScale", SensorScaleSchema);

export default SensorScale;
