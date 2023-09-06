import { ICardSlug } from '../constants/cards';

export interface IUser {
    id: string;
    userName: string;
    roomId: string;
    isReady: boolean;
    money: number;
    cards: ICard[] | [];
}

export interface ICard {
    id: string;
    name: string;
    slug: ICardSlug;
}
