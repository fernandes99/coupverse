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
      currentAction: null,
      currentUser: usersFiltered[currentTurnUserIndex + 1] ?? usersFiltered[0],
    };

    io.in(data.roomId).emit("turn:update", newTurn);
  };

  const onActionTurn = (data: ITurn) => {
    io.in(data.roomId).emit("turn:update", data);
  };

  const onSkipAction = (data: ITurn) => {
    const users = global.getState().users;
    const usersFiltered = getUsersFilteredByRoom(users, data.roomId);
    const countSkipped = data.currentAction?.countSkipped! + 1;
    const isLastSkipped = countSkipped + 1 >= usersFiltered.length;

    if (isLastSkipped) {
      return passTurn(data);
    }

    io.in(data.roomId).emit("turn:update", {
      ...data,
      currentAction: {
        ...data.currentAction,
        countSkipped: countSkipped,
      },
    });
  };

  socket.on("turn:pass", passTurn);
  socket.on("turn:action", onActionTurn);
  socket.on("turn:skip-action", onSkipAction);
};
