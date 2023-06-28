import * as http from "http";
import app from "./app";
import log from "@src/config/winston";
import socketServer from "./socket";

const normalizePort = (val: string): number => {
  const port = parseInt(val, 10);

  if (isNaN(port)) return 4000;

  return port;
};

const port = normalizePort(process.env.PORT || "4000");

/**
 * Event listener for HTTP server "error" event.
 */
// eslint-disable-next-line no-undef
const onError = (error: NodeJS.ErrnoException): void => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      log.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      log.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

app.set("port", port);

const server = http.createServer(app);

socketServer(server, app);

server.listen(port);
server.on("error", onError);
server.on("listening", () => {
  const address = server.address();
  const bind =
    typeof address === "string" ? `pipe ${address}` : `port ${address?.port}`;

  log.info(`App server running on ${bind}`);
});
