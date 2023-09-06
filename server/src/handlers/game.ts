import { Server, Socket } from "socket.io";
import { Global } from "../global/global";
import { getUsersFilteredByRoom } from "../utils/general";
import { ITurn } from "../types/global";

interface IOnStartGame {
  roomId: string;
}

export const registerGameHandlers = (io: Server, socket: Socket) => {
  const global = Global.getInstance();

  const onStartGame = ({ roomId }: IOnStartGame) => {
    const users = global.getState().users;
    const userFiltered = getUsersFilteredByRoom(users, roomId);
    const turnData = {
      action: null,
      counterAction: null,
      challangeAction: null,
      currentUser: userFiltered[0],
      initialUser: userFiltered[0],
      roomId: roomId,
      round: 0,
      title: "",
      usersSkipped: [],
    } as ITurn;

    socket.emit("turn:update", turnData);
    socket.emit("users:update", getUsersFilteredByRoom(users, roomId));
  };

  socket.on("game:on-start", onStartGame);
};
