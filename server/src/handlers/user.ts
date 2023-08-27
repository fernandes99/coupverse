import { Server, Socket } from "socket.io";
import { Global } from "../global/global";
import {
  getSelfUser,
  getUsersFilteredByRoom,
  updateUser,
} from "../utils/general";
import { IUser } from "../types/global";

export const registerUserHandlers = (io: Server, socket: Socket) => {
  const global = Global.getInstance();

  const onReadyUser = (data: any) => {
    const users = global.getState().users;
    const newUsers = users.map((user) => {
      if (user.id === socket.id) {
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

  const onUpdateUser = (user: IUser) => {
    updateUser(user, io, global);
  };

  socket.on("user:on-ready", onReadyUser);
  socket.on("user:update", onUpdateUser);
};
