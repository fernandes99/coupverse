export interface IUser {
    id: string;
    userName: string;
    roomId: string;
    isReady: boolean;
    isOwner: boolean;
    money?: number;
    cards?: ICard[];
}

interface ICard {
    name: string;
    slug: string;
}
