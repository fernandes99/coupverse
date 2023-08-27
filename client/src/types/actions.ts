import { ICardSlug } from '../constants/cards';

export interface IAction {
    slug: 'income' | 'foreign-aid' | 'coup' | 'tax' | 'assassinate' | 'exchange' | 'steal';
    title: string;
    influence: ICardSlug;
    blockableBy: ICardSlug[];
    isChallengeable: boolean;
    transactionAmount: number;
}

export interface ICounterAction {
    slug: 'block_foreign_aid' | 'block_steal' | 'block_assassinate';
    influences: ICardSlug[];
}
