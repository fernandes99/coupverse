import { IGlobal } from "../types/global";

export const getUsersFilteredByRoom = (
  users: IGlobal["users"],
  roomId: string
) => {
  return users.filter((user) => user.roomId === roomId);
};
