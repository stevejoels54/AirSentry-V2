// import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";
import momentTimezone from "moment-timezone";
import envVars from "@config/envVars";
import { ISensor } from "@utils/interfaces/app/app.interface";

// Set the time zone to Ugandan Time (EAT)
momentTimezone.tz.setDefault(envVars.timezone);

const SensorSchema = new Schema<ISensor>({
  sensorName: String,
  sensorCode: {
    type: String,
    unique: true,
    required: true,
  },
  sensorGrouping: String,
  sensorUnits: String,
  sensorIcon: String,
  min: Number,
  max: Number,
  deviceId: {
    type: Schema.Types.ObjectId,
    ref: "Device",
  },
  readings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Reading",
    },
  ],
  createdAt: {
    type: Date,
    default: momentTimezone().format("YYYY-MM-DD HH:mm:ss"),
  },
  updatedAt: {
    type: Date,
    default: momentTimezone().format("YYYY-MM-DD HH:mm:ss"),
  },
});
const Sensor = model("Sensor", SensorSchema);

export default Sensor;
