import { Server, Socket } from "socket.io";
import { Global } from "../global/global";
import { ITurn } from "../types/global";
import { getUsersFilteredByRoom } from "../utils/general";

export const registerTurnHandlers = (io: Server, socket: Socket) => {
  const global = Global.getInstance();

  const passTurn = (data: ITurn) => {
    const users = global.getState().users;
    const usersFiltered = getUsersFilteredByRoom(users, data.roomId);
    const currentTurnUserIndex = usersFiltered.findIndex(
      (user) => user.id === data.currentUser?.id
    );

    const newTurn = {
      ...data,
      currentUser: usersFiltered[currentTurnUserIndex + 1] ?? usersFiltered[0],
    };

    io.in(data.roomId).emit("turn:update", newTurn);
  };

  socket.on("turn:pass", passTurn);
};
