export interface IGlobal {
  users: IUser[];
  turns?: ITurn[]; // TODO: split states (remove on global)
}

export interface IUser {
  id: string;
  userName: string;
  roomId: string;
  isReady: boolean;
  money: number;
  cards: ICard[];
}

export interface ICard {
  id: string;
  name: string;
  slug: string;
}

export interface ITurn {
  roomId: string;
  title: string;
  action: IAction | null;
  counterAction: ICounterAction | null;
  usersSkipped: string[];
  initialUser: IUser;
  currentUser: IUser;
  round: number;
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

export type ICardSlug =
  | "duke"
  | "ambassador"
  | "captain"
  | "assassin"
  | "contessa";

export interface ICounterAction {
  slug: "block_foreign_aid" | "block_steal" | "block_assassinate";
  influences: ICardSlug[];
}
