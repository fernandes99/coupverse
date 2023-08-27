import { Server, Socket } from "socket.io";
import { Global } from "../global/global";
import { getUsersFilteredByRoom } from "../utils/general";
import { ICard, IGlobal, IUser } from "../types/global";

interface IConnectRoom {
  roomId: string;
  userName: string;
  money: number;
  cards: ICard[];
}

export const registerRoomHandlers = (io: Server, socket: Socket) => {
  const global = Global.getInstance();

  const connectRoom = (props: IConnectRoom) => {
    const users = global.getState().users;
    const newUsers = [
      ...users.filter((user) => user.id !== socket.id),
      {
        id: socket.id,
        userName: props.userName,
        roomId: props.roomId,
        money: props.money,
        cards: props.cards,
        isReady: false,
      } as IUser,
    ];

    socket.join(props.roomId);
    socket.data.roomId = props.roomId;

    global.setState({ ...global, users: newUsers });
    io.in(props.roomId).emit(
      "room:connected-user",
      getUsersFilteredByRoom(newUsers, props.roomId)
    );
  };

  socket.on("room:connect", connectRoom);
};
