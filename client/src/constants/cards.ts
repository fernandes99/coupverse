export type ICardSlug = 'duke' | 'ambassador' | 'captain' | 'assassin' | 'contessa';

export enum EnumSlugCards {
    DUKE = 'duke',
    AMBASSADOR = 'ambassador',
    CAPTAIN = 'captain',
    ASSASSIN = 'assassin',
    CONTESSA = 'contessa'
}

export enum EnumNameCards {
    DUKE = 'Duque',
    AMBASSADOR = 'Embaixadora',
    CAPTAIN = 'Capitão',
    ASSASSIN = 'Assassino',
    CONTESSA = 'Contessa'
}

export const CARDS = [
    {
        id: '',
        name: EnumNameCards.DUKE,
        slug: EnumSlugCards.DUKE
    },
    {
        id: '',
        name: EnumNameCards.AMBASSADOR,
        slug: EnumSlugCards.AMBASSADOR
    },
    {
        id: '',
        name: EnumNameCards.CAPTAIN,
        slug: EnumSlugCards.CAPTAIN
    },
    {
        id: '',
        name: EnumNameCards.ASSASSIN,
        slug: EnumSlugCards.ASSASSIN
    },
    {
        id: '',
        name: EnumNameCards.CONTESSA,
        slug: EnumSlugCards.CONTESSA
    }
];
