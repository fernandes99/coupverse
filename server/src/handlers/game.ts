import { Server, Socket } from "socket.io";
import { Global } from "../global/global";
import { getUsersFilteredByRoom } from "../utils/general";

interface IOnStartGame {
  roomId: string;
}

export const registerGameHandlers = (io: Server, socket: Socket) => {
  const global = Global.getInstance();

  const onStartGame = ({ roomId }: IOnStartGame) => {
    const users = global.getState().users;

    socket.emit("turn:update", {
      roomId,
      currentUser: users.find((user) => user.isOwner),
    });
    socket.emit("users:update", getUsersFilteredByRoom(users, roomId));
  };

  socket.on("game:on-start", onStartGame);
};
