export interface IGlobal {
  users: IUsers[];
}

interface IUsers {
  id: string;
  userName: string;
  roomId: string;
  isReady: boolean;
  money?: number;
  cards?: ICards[];
}

interface ICards {
  name: string;
  slug: string;
}
