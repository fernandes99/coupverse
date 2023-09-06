import { Server } from "socket.io";
import { IGlobal, IUser } from "../types/global";
import { CARDS } from "../constants/cards";

export const getUsersFilteredByRoom = (
  users: IGlobal["users"],
  roomId: string
) => {
  return users.filter((user) => user.roomId === roomId);
};

export const verifyUserOwner = (users: IGlobal["users"]) => {
  return (
    users.length === 1 ? { ...users, isOwner: true } : users
  ) as IGlobal["users"];
};

export const getSelfUser = (users: IUser[], socketId: string) => {
  return users.filter((user) => user.id === socketId);
};

export const updateUser = (user: IUser, io: Server, global: any) => {
  const users = global.getState().users as IUser[];
  const newUsers = users.map((u) => (u.id === user.id ? user : u));

  global.setState({ ...global, users: newUsers });

  io.in(user.roomId).emit(
    "users:update",
    getUsersFilteredByRoom(newUsers, user.roomId)
  );
};

export const setLoseUser = (user: IUser, io: Server, global: any) => {
  const users = global.getState().users as IUser[];
  const newUsers = users.filter((u) => u.id !== user.id);

  global.setState({ ...global, users: newUsers });
  io.in(user.roomId).emit(
    "users:update",
    getUsersFilteredByRoom(newUsers, user.roomId)
  );
};

export const getRandomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getRandomCards = () => {
  const randomCards = [
    CARDS[getRandomIntFromInterval(0, CARDS.length - 1)],
    CARDS[getRandomIntFromInterval(0, CARDS.length - 1)],
  ];

  return randomCards.map((card) => {
    return { ...card, id: `${Math.random()}` };
  });
};
