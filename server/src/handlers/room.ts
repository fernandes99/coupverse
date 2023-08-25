import { Server, Socket } from "socket.io";
import { Global } from "../global/global";
import { getUsersFilteredByRoom } from "../utils/general";

export const registerRoomHandlers = (io: Server, socket: Socket) => {
  const global = Global.getInstance();

  const connectRoom = (data: any) => {
    const users = global.getState().users;
    const newUsers = [
      ...users.filter((user) => user.id !== socket.id),
      {
        id: socket.id,
        userName: data.userName,
        roomId: data.roomId,
        isReady: false,
      },
    ];

    socket.join(data.roomId);
    socket.data.roomId = data.roomId;

    global.setState({ ...global, users: newUsers });
    io.in(data.roomId).emit(
      "room:connected-user",
      getUsersFilteredByRoom(newUsers, data.roomId)
    );
  };

  socket.on("room:connect", connectRoom);
};
