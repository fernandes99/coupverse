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
        name: EnumNameCards.DUKE,
        slug: EnumSlugCards.DUKE
    },
    {
        name: EnumNameCards.AMBASSADOR,
        slug: EnumSlugCards.AMBASSADOR
    },
    {
        name: EnumNameCards.CAPTAIN,
        slug: EnumSlugCards.CAPTAIN
    },
    {
        name: EnumNameCards.ASSASSIN,
        slug: EnumSlugCards.ASSASSIN
    },
    {
        name: EnumNameCards.CONTESSA,
        slug: EnumSlugCards.CONTESSA
    }
];
