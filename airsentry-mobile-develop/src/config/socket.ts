import io from "socket.io-client";
import constants from "./constants";

const socket = io(constants.socketServer);

socket.on("connect", () => {
  console.log("connected");
});

export default socket;
