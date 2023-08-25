import { Server, Socket } from "socket.io";
import { Global } from "../global/global";
import { getUsersFilteredByRoom } from "../utils/general";

export const registerUserHandlers = (io: Server, socket: Socket) => {
  const global = Global.getInstance();

  const onReadyUser = (data: any) => {
    const users = global.getState().users;
    const newUsers = users.map((user) => {
      if (user.id === data.id) {
        return {
          ...user,
          isReady: data.isReady,
        };
      }

      return user;
    });

    global.setState({ ...global, users: [...newUsers] });
    io.in(data.roomId).emit(
      "users:update",
      getUsersFilteredByRoom(newUsers, data.roomId)
    );
  };

  socket.on("user:on-ready", onReadyUser);
};
