import { Server } from "socket.io";
import { IGlobal, IUser } from "../types/global";

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

export const getSelfUser = (users: IUser[], id: string) => {
  return users.filter((user) => user.id === id);
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
