import { Server, Socket } from "socket.io";
import { registerRoomHandlers } from "./handlers/room";
import { Global } from "./global/global";
import { registerUserHandlers } from "./handlers/user";
import { registerGameHandlers } from "./handlers/game";

const express = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");
const app = express();
const cors = require("cors");
const path = require("path");

const ENV_DEV = true;
const options = {
  key: fs.readFileSync(path.join(__dirname, "cert", "private.key")),
  cert: fs.readFileSync(path.join(__dirname, "cert", "certificate.crt")),
};

const global = Global.getInstance();

app.use(cors());

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
  registerRoomHandlers(io, socket);
  registerUserHandlers(io, socket);
  registerGameHandlers(io, socket);

  socket.on("disconnect", () => {
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
