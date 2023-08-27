import { Server, Socket } from "socket.io";
import { Global } from "./global/global";
import { registerRoomHandlers } from "./handlers/room";
import { registerUserHandlers } from "./handlers/user";
import { registerGameHandlers } from "./handlers/game";
import { registerTurnHandlers } from "./handlers/turn";

const express = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();

app.use(cors());

const ENV_DEV = false;
const options = {
  key: fs.readFileSync(path.join(__dirname, "cert", "private.key")),
  cert: fs.readFileSync(path.join(__dirname, "cert", "certificate.crt")),
};

const global = Global.getInstance();

const server = ENV_DEV
  ? http.createServer(app)
  : https.createServer(options, app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
}) as Server;

const onConnection = (socket: Socket) => {
  console.log("User Connected: ", socket.id);

  registerRoomHandlers(io, socket);
  registerUserHandlers(io, socket);
  registerGameHandlers(io, socket);
  registerTurnHandlers(io, socket);

  socket.on("disconnect", () => {
    console.log("User Disconnected: ", socket.id);

    const roomId = socket.data.roomId;
    const users = global.getState().users;
    const usersFiltered = users.filter((user) => user.id !== socket.id);

    global.setState({
      ...global,
      users: usersFiltered,
    });

    io.in(roomId).emit("users:update", usersFiltered);
  });
};

io.on("connection", onConnection);

app.get("/", (req: any, res: any) => {
  console.log('Acesso à rota "/"');
  res.send("Olá, mundo!");
});

server.listen(8080, () => {
  console.log("Servidor rodando na porta 8080");
});
