export interface IGlobal {
  users: IUser[];
  turns?: ITurn[]; // TODO: separar estados dos turnos e usuários (não utilizar global)
}

export interface IUser {
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

export interface ITurn {
  roomId: string;
  currentUser: IUser | null;
  currentAction: {
    action: IAction;
    message: string;
    countSkipped: number;
  } | null;
}

export interface IAction {
  slug:
    | "income"
    | "foreign-aid"
    | "coup"
    | "tax"
    | "assassinate"
    | "exchange"
    | "steal";
  title: string;
  influence: string;
  blockableBy: string[];
  isChallengeable: boolean;
  transactionAmount: number;
}
