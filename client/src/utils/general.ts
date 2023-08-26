import { CARDS } from '../constants/cards';

export const getRandomString = () => {
    return (Math.random() + 1).toString(36).substring(7);
};

export const getRandomIntFromInterval = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getRandomCards = () => {
    return [
        CARDS[getRandomIntFromInterval(0, CARDS.length - 1)],
        CARDS[getRandomIntFromInterval(0, CARDS.length - 1)]
    ];
};
