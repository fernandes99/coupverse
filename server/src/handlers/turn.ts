import { Server, Socket } from "socket.io";
import { Global } from "../global/global";
import { ITurn, IUser } from "../types/global";
import {
  getRandomCards,
  getSelfUser,
  getUsersFilteredByRoom,
  setLoseUser,
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
      challangeAction: null,
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
      if (data.action?.slug === "assassinate") {
        const userSelected = data.userSelected!;
        const newUsers = users.map((user) => {
          if (userSelected.id === user.id && userSelected.cards.length > 0) {
            return { ...user, cards: [userSelected.cards[0]] };
          }

          if (data.initialUser.id === user.id) {
            return {
              ...user,
              money: data.action?.transactionAmount
                ? data.initialUser?.money! + data.action?.transactionAmount!
                : data.initialUser.money,
            };
          }

          return user;
        });

        if (userSelected.cards.length < 2) {
          const filteredUsers = newUsers.filter(
            (user) => user.id !== userSelected.id
          );
          global.setState({ ...global, users: filteredUsers });
          io.in(data.roomId).emit(
            "users:update",
            getUsersFilteredByRoom(filteredUsers, data.roomId)
          );
        } else {
          global.setState({ ...global, users: newUsers });
          io.in(data.roomId).emit(
            "users:update",
            getUsersFilteredByRoom(newUsers, data.roomId)
          );
        }

        passTurn({ ...data, userSelected: null });
        return;
      }

      if (data.action?.slug === "steal") {
        const userSelected = data.userSelected!;
        const newUsers = users.map((user) => {
          if (userSelected.id === user.id) {
            return {
              ...user,
              money: data.initialUser.money - data.action?.transactionAmount!,
            };
          }

          if (data.initialUser.id === user.id) {
            return {
              ...user,
              money: data.initialUser.money + data.action?.transactionAmount!,
            };
          }

          return user;
        });

        global.setState({ ...global, users: newUsers });
        io.in(data.roomId).emit(
          "users:update",
          getUsersFilteredByRoom(newUsers, data.roomId)
        );

        passTurn({ ...data, userSelected: null });
        return;
      }

      if (data.action?.slug === "exchange") {
        const newUsers = users.map((user) => {
          if (data.initialUser.id === user.id) {
            return {
              ...user,
              money: data.initialUser.money + data.action?.transactionAmount!,
              cards: getRandomCards(),
            };
          }

          return user;
        });

        global.setState({ ...global, users: newUsers });
        io.in(data.roomId).emit(
          "users:update",
          getUsersFilteredByRoom(newUsers, data.roomId)
        );

        passTurn({ ...data, userSelected: null });
        return;
      }

      const userUpdated = {
        ...data.initialUser,
        money: data.initialUser.money + (data.action?.transactionAmount! || 0),
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
