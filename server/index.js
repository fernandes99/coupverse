const express = require("express");
const cors = require("cors");
const https = require("https");
const WebSocket = require("ws").Server;
const HttpsServer = require("https").createServer;
const fs = require("fs");
const app = express();
const path = require("path");

app.use(cors());

const options = HttpsServer({
  cert: fs.readFileSync("server.crt", "utf8"),
  key: fs.readFileSync("key.pem", "utf8"),
});

const server = https.createServer(options, app);

const io = new WebSocket({
  server: server,
});

let users = [];

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("connect_room", (data) => {
    users = users.filter((user) => user.id !== socket.id);
    users = [
      ...users,
      {
        id: socket.id,
        roomId: data.roomId,
        userName: data.userName,
        ready: false,
      },
    ];

    socket.join(data.roomId);
    socket.data.roomId = data.roomId;
    io.in(data.roomId).emit("user_connected_room", users);
  });

  socket.on("leave_room", (data) => {});

  socket.on("disconnect", () => {
    const roomId = socket.data.roomId;
    users = users.filter((user) => user.id !== socket.id);

    io.in(roomId).emit("update_users", users);
  });

  socket.on("on_user_ready", (data, isReady) => {
    users = users.map((user) => {
      if (user.id === data.id) {
        return {
          ...user,
          ready: isReady,
        };
      }

      return user;
    });

    io.in(data.roomId).emit("update_users", users);
  });
});

app.get("/", (req, res) => {
  console.log('Acesso à rota "/"');
  res.send("Olá, mundo!");
});

server.listen(40, () => {
  console.log("SERVER IS RUNNING ON PORT 40");
});
