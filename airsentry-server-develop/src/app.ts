import dotenv from "dotenv";
// import rateLimit from "express-rate-limit";
import path from "path";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import morgan from "morgan";
import AppError from "@utils/appError.util";
import hpp from "hpp";
import errorhandler from "@middleware/error/errorhandler";
import dbConnection from "@src/database/connection";
import indexRouter from "./routes/index.routes";
import HttpStatusCodes from "@config/httpStatusCode";
dotenv.config();

const app = express();
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: "Too many requests from this IP, please try again in an hour!",
// });

dbConnection();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  hpp({
    whitelist: ["", ""],
  })
);
// app.use("/api", limiter);
app.use(morgan("dev"));
app.use("/assets", express.static("assets"));
app.use(indexRouter);
app.use("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Cant find ${req.originalUrl}`, HttpStatusCodes.NOT_FOUND));
});
app.use(errorhandler);

export default app;
