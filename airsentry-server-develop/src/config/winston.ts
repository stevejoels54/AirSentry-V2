import winston, { transports, LoggerOptions, Logger } from "winston";

let level = "info";

if (process.env.NODE_ENV === "production") level = "warn";

const colors = {
  error: "red",
  warn: "yellow",
  info: "blue",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const { combine, timestamp, printf, label } = winston.format;

// Define the log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const options: LoggerOptions = {
  silent: false,
  level: level,
  exitOnError: false,
  transports: [
    new winston.transports.Console({
      format: combine(
        label({ label: "Air Sentry" }),
        timestamp(),
        logFormat,
        winston.format.colorize({ all: true })
      ),
    }),
    new transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    new transports.File({
      filename: "logs/combined.log",
    }),
  ],
};

const log: Logger = winston.createLogger(options);

export default log;
