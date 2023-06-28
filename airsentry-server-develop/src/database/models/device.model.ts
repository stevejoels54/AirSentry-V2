import { Schema, model } from "mongoose";
import momentTimezone from "moment-timezone";
import envVars from "@config/envVars";
import { IDevice } from "@utils/interfaces/app/app.interface";

// Set the time zone to Ugandan Time (EAT)
momentTimezone.tz.setDefault(envVars.timezone);

const deviceSchema = new Schema<IDevice>({
  deviceName: String,
  deviceCode: String,
  deviceType: String,
  deviceLocation: String,
  deviceLat: Number,
  deviceLong: Number,
  deviceStatus: String,
  deviceImage: String,
  createdAt: {
    type: Date,
    default: momentTimezone().format("YYYY-MM-DD HH:mm:ss"),
  },
  updatedAt: {
    type: Date,
    default: momentTimezone().format("YYYY-MM-DD HH:mm:ss"),
  },
  sensors: [
    {
      type: Schema.Types.ObjectId || String,
      ref: "Sensor",
    },
  ],
});

const Device = model<IDevice>("Device", deviceSchema);

export default Device;
