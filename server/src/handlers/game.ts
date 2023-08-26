import { Server, Socket } from "socket.io";
import { Global } from "../global/global";
import { getUsersFilteredByRoom } from "../utils/general";

export const registerGameHandlers = (io: Server, socket: Socket) => {
  const global = Global.getInstance();

  const onStartGame = (data: any) => {
    const users = global.getState().users;
    const newUsers = users.map((user) => {
      if (user.id === socket.id) {
        console.log("TESTE");
        return {
          ...user,
          cards: data.cards,
          money: data.money,
        };
      }

      return user;
    });

    global.setState({ ...global, users: [...newUsers] });
    socket.emit("users:update", getUsersFilteredByRoom(newUsers, data.roomId));
  };

  socket.on("game:on-start", onStartGame);
};
