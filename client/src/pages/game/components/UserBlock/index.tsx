import { S } from './styles';
import { BsSuitHeartFill } from 'react-icons/bs';
import CoinImage from '../../../../assets/img/coin.png';

interface IUserBlock {
    name: string;
    money: number;
    showCards: boolean;
    cards: {
        id: string;
        name: string;
        slug: string;
    }[];
}

export const UserBlock = ({ name, money, cards, showCards }: IUserBlock) => {
    console.log('cards', cards);

    return (
        <S.Box>
            <S.Title>{name}</S.Title>
            <S.Status>
                <S.LifeBlock>
                    <BsSuitHeartFill size={22} />
                    <BsSuitHeartFill size={22} />
                </S.LifeBlock>
                <S.MoneyBlock>
                    <span>{money}</span>
                    <img src={CoinImage} width={22} height={22} />
                </S.MoneyBlock>
            </S.Status>
            <S.CardBlock>
                <p>{showCards ? 'Suas cartas' : `Cartas de ${name}`}</p>
                {cards?.map((card) => (
                    <S.Card key={card.id} show={showCards}>
                        {showCards ? card.name : ''}
                    </S.Card>
                ))}
            </S.CardBlock>
        </S.Box>
    );
};
