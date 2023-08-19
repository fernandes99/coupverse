const express = require("express");
const WebSocket = require("ws").Server;
const HttpsServer = require("https").createServer;
const fs = require("fs");
const app = express();
const path = require("path");

const server = HttpsServer(
  {
    key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
  },
  app
);

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

server.listen(8080, () => {
  console.log("Servidor rodando na porta 8080");
});
