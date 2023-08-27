export interface IUser {
    id: string;
    userName: string;
    roomId: string;
    isReady: boolean;
    money: number;
    cards: ICard[];
}

interface ICard {
    id: string;
    name: string;
    slug: string;
}
