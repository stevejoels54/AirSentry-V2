import { Schema, model } from "mongoose";
import momentTimezone from "moment-timezone";
import envVars from "@config/envVars";
import { IReading } from "@utils/interfaces/app/app.interface";

// Set the time zone to Ugandan Time (EAT)
momentTimezone.tz.setDefault(envVars.timezone);

const ReadingSchema = new Schema<IReading>({
  sensorCode: {
    type: String,
    ref: "Sensor",
    index: true,
  },
  deviceCode: {
    type: String,
    ref: "Device",
    index: true,
  },
  sensorValue: Schema.Types.Number,
  createdAt: {
    type: Date,
    default: momentTimezone().format("YYYY-MM-DD HH:mm:ss"),
  },
  updatedAt: {
    type: Date,
    default: momentTimezone().format("YYYY-MM-DD HH:mm:ss"),
  },
});

const Reading = model("Reading", ReadingSchema);

export default Reading;
