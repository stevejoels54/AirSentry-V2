import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import log from "@config/winston";
import { Express } from "express";
import ReadingController from "./controllers/readings.controller";
import constants from "@config/constants";

const { socketEvents } = constants;

const socketServer = (server: HttpServer, app: Express) => {
  const io = new SocketServer(server, {
    cors: {
      origin: "*",
    },
  });

  io.on(socketEvents.CONNECT, (socket) => {
    try {
      log.info("A user connected");
      socket.on(socketEvents.READINGS, async (deviceCode: string) => {
        await ReadingController.socketReadings(socket, deviceCode);
      });
      socket.on(socketEvents.DISCONNECT, () => {
        log.info("user disconnected");
      });
    } catch (error) {
      socket.emit(socketEvents.ERROR, { error });
    }
  });

  app.set("io", io);
};

export default socketServer;
