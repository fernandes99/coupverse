export interface IAction {
    slug: 'income' | 'foreign-aid' | 'coup' | 'tax' | 'assassinate' | 'exchange' | 'steal';
    title: string;
    influence: string;
    blockableBy: string[];
    isChallengeable: boolean;
    transactionAmount: number;
}
