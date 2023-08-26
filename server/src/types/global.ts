export interface IGlobal {
  users: IUser[];
  turns?: ITurn[]; // TODO: separar estados dos turnos e usuários (não utilizar global)
}

interface IUser {
  id: string;
  userName: string;
  roomId: string;
  isReady: boolean;
  isOwner: boolean;
  money?: number;
  cards?: ICard[];
}

export interface ICard {
  name: string;
  slug: string;
}

interface ITurn {
  roomId: string;
  currentUser: IUser | null;
}
