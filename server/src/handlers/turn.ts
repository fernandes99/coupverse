import { Server, Socket } from "socket.io";
import { Global } from "../global/global";
import { getUsersFilteredByRoom } from "../utils/general";

export const registerTurnHandlers = (io: Server, socket: Socket) => {
  const global = Global.getInstance();

  //   const connectRoom = (data: any) => {
  //     const users = global.getState().users;
  //     const newUsers = [
  //       ...users.filter((user) => user.id !== socket.id),
  //       {
  //         id: socket.id,
  //         userName: data.userName,
  //         roomId: data.roomId,
  //         isReady: false,
  //       },
  //     ];

  //     global.setState({ ...global, users: newUsers });
  //   };

  // socket.on("turn:", updateTurn);
};
