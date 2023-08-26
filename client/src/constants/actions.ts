import { IAction } from '../types/actions';
import { EnumNameCards, EnumSlugCards } from './cards';

export const ACTIONS = [
    {
        slug: 'income',
        title: 'Renda',
        influence: 'all',
        blockableBy: [],
        isChallengeable: false,
        transactionAmount: 1
    },
    {
        slug: 'foreign-aid',
        title: 'Ajuda externa',
        influence: 'all',
        blockableBy: [EnumSlugCards.DUKE],
        isChallengeable: false,
        transactionAmount: 2
    },
    {
        slug: 'coup',
        title: 'Golpe',
        influence: 'all',
        blockableBy: [],
        isChallengeable: false,
        transactionAmount: -7
    },
    {
        slug: 'tax',
        title: EnumNameCards.DUKE,
        influence: EnumSlugCards.DUKE,
        blockableBy: [],
        isChallengeable: true,
        transactionAmount: 3
    },
    {
        slug: 'assassinate',
        title: EnumNameCards.ASSASSIN,
        influence: EnumSlugCards.ASSASSIN,
        blockableBy: [EnumSlugCards.CONTESSA],
        isChallengeable: true,
        transactionAmount: -3
    },
    {
        slug: 'exchange',
        title: EnumNameCards.AMBASSADOR,
        influence: EnumSlugCards.AMBASSADOR,
        blockableBy: [],
        isChallengeable: true,
        transactionAmount: 0
    },
    {
        slug: 'steal',
        title: EnumNameCards.CAPTAIN,
        influence: EnumSlugCards.CAPTAIN,
        blockableBy: [EnumSlugCards.AMBASSADOR, EnumSlugCards.AMBASSADOR],
        isChallengeable: true,
        transactionAmount: 2
    }
] as IAction[];

// const COUNTER_ACTIONS = [
//     {
//         slug: 'block_foreign_aid',
//         influences: [EnumSlugCards.DUKE]
//     },
//     {
//         slug: 'block_foreign_aid',
//         influences: [EnumSlugCards.AMBASSADOR, EnumSlugCards.CAPTAIN]
//     },
//     {
//         slug: 'block_assassinate',
//         influences: [EnumSlugCards.CONTESSA]
//     }
// ];
