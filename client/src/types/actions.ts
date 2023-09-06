import { ICardSlug } from '../constants/cards';
import { IUser } from './users';

export interface IAction {
    slug: 'income' | 'foreign-aid' | 'coup' | 'tax' | 'assassinate' | 'exchange' | 'steal';
    title: string;
    influence: ICardSlug;
    blockableBy: ICardSlug[];
    isChallengeable: boolean;
    transactionAmount: number;
}

export interface ICounterAction {
    slug: 'block-foreign-aid' | 'block-steal' | 'block-assassinate';
    influences: ICardSlug[];
}

export interface IChallangeAction {
    userTarget: IUser;
    userChallenger: IUser;
    isSuccessful: boolean;
}
