import { Server, Socket } from "socket.io";
import { Global } from "../global/global";
import { ITurn, IUser } from "../types/global";
import {
  getSelfUser,
  getUsersFilteredByRoom,
  updateUser,
} from "../utils/general";

export const registerTurnHandlers = (io: Server, socket: Socket) => {
  const global = Global.getInstance();

  const passTurn = (data: ITurn) => {
    const users = global.getState().users;
    const usersFiltered = getUsersFilteredByRoom(users, data.roomId);
    const currentTurnUserIndex = usersFiltered.findIndex(
      (user) => user.id === data.initialUser?.id
    );
    const newTurnData = {
      ...data,
      action: null,
      counterAction: null,
      round: data.round + 1,
      title: "",
      usersSkipped: [],
      currentUser: usersFiltered[currentTurnUserIndex + 1] ?? usersFiltered[0],
      initialUser: usersFiltered[currentTurnUserIndex + 1] ?? usersFiltered[0],
    } as ITurn;

    io.in(data.roomId).emit("turn:update", newTurnData);
  };

  const onActionTurn = (data: ITurn) => {
    io.in(data.roomId).emit("turn:update", data);
  };

  const onSkipAction = (data: ITurn) => {
    const users = global.getState().users;
    const usersFiltered = getUsersFilteredByRoom(users, data.roomId);
    const userSelf = getSelfUser(users, socket.id);
    const newSkippedUsers = [...data.usersSkipped, userSelf];
    const isLastSkipped = newSkippedUsers.length >= usersFiltered.length;

    if (isLastSkipped) {
      const userUpdated = {
        ...data.initialUser,
        money: data.action?.transactionAmount
          ? data.initialUser?.money! + data.action?.transactionAmount!
          : data.initialUser.money,
      } as IUser;

      updateUser(userUpdated, io, global);
      passTurn(data);
      return;
    }

    const turnData = {
      ...data,
      usersSkipped: newSkippedUsers,
    } as ITurn;

    io.in(data.roomId).emit("turn:update", turnData);
  };

  socket.on("turn:pass", passTurn);
  socket.on("turn:action", onActionTurn);
  socket.on("turn:skip-action", onSkipAction);
};
