import { IGlobal } from "../types/global";

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
