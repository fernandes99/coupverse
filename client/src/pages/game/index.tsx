import { Socket } from 'socket.io-client';
import { S } from './styles';
import { UserBlock } from './components/UserBlock';
import { Container } from '../../styles/layout';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ICard, IUser } from '../../types/users';
import { ITurn } from '../../types/turns';
import { ActionsBlock } from './components/ActionsBlock';
import { IAction } from '../../types/actions';
import { COUNTER_ACTIONS } from '../../constants/actions';
import { ICardSlug } from '../../constants/cards';
import { getRandomCards } from '../../utils/general';

interface IGamePage {
    socket: Socket;
}

export const GamePage = ({ socket }: IGamePage) => {
    const { roomId } = useParams();

    const [users, setUsers] = useState<IUser[]>([]);
    const [turn, setTurn] = useState<ITurn>({
        roomId: roomId!,
        action: null,
        counterAction: null,
        challangeAction: null,
        currentUser: null,
        initialUser: null,
        usersSkipped: [],
        round: 0,
        title: ''
    });
    const self = useMemo(() => users.find((user) => user.id === socket.id) as IUser, [users]);

    const onAction = (action: IAction, userSelected?: IUser) => {
        if (action.slug === 'foreign-aid') {
            socket.emit('turn:action', {
                ...turn,
                action,
                counterAction: null,
                challangeAction: null,
                currentUser: self,
                usersSkipped: [self.id],
                title: `${self.userName} pediu ajuda externa.`
            } as ITurn);
            return;
        }

        if (action.slug === 'tax') {
            socket.emit('turn:action', {
                ...turn,
                action,
                counterAction: null,
                challangeAction: null,
                currentUser: self,
                usersSkipped: [self.id],
                title: `${self?.userName} está tentando cobrar imposto (+3 moedas).`
            } as ITurn);
            return;
        }

        if (action.slug === 'exchange') {
            socket.emit('turn:action', {
                ...turn,
                action,
                counterAction: null,
                challangeAction: null,
                currentUser: self,
                usersSkipped: [self.id],
                title: `${self?.userName} está tentando trocar suas cartas.`
            } as ITurn);
            return;
        }

        if (action.slug === 'steal' && userSelected) {
            socket.emit('turn:action', {
                ...turn,
                action,
                counterAction: null,
                challangeAction: null,
                currentUser: self,
                usersSkipped: [self.id],
                userSelected: userSelected,
                title: `${self?.userName} está tentando roubar ${userSelected.userName}.`
            } as ITurn);
            return;
        }

        if (action.slug === 'coup' && userSelected) {
            return onDiscard(
                { ...userSelected, money: self!.money + action.transactionAmount },
                userSelected.cards[0]
            );
        }

        if (action.slug === 'assassinate' && userSelected) {
            socket.emit('turn:action', {
                ...turn,
                action,
                counterAction: null,
                challangeAction: null,
                currentUser: self,
                usersSkipped: [self.id],
                userSelected: userSelected,
                title: `${self?.userName} está tentando assasinar ${userSelected.userName}.`
            } as ITurn);
            return;
        }

        if (action.slug === 'income') {
            socket.emit('user:update', { ...self, money: self!.money + action.transactionAmount });
        }

        if (!action.blockableBy.length && !action.isChallengeable) {
            socket.emit('turn:pass', {
                ...turn,
                currentUser: { ...self, money: self!.money + action.transactionAmount }
            } as ITurn);
        }
    };

    const onSkip = () => {
        socket.emit('turn:skip-action', turn);
    };

    const onBlock = (influenceSlug: ICardSlug) => {
        socket.emit('turn:action', {
            ...turn,
            action: null,
            counterAction: COUNTER_ACTIONS.find((counterAction) =>
                counterAction.influences.includes(influenceSlug)
            )!,
            challangeAction: null,
            currentUser: self,
            usersSkipped: [self.id],
            title: `${self?.userName} está tentando bloquear ${turn.currentUser?.userName}.`
        } as ITurn);
    };

    const onChallenge = () => {
        const isSuccessful = !turn.currentUser?.cards?.some(
            (card) =>
                turn.counterAction?.influences.includes(card.slug) ||
                turn.action?.influence.includes(card.slug)
        );

        socket.emit('turn:action', {
            ...turn,
            action: null,
            counterAction: null,
            challangeAction: {
                isSuccessful: isSuccessful,
                userChallenger: self,
                userTarget: turn.currentUser
            },
            currentUser: isSuccessful ? turn.currentUser : self,
            usersSkipped: [self.id],
            title: `${self?.userName} desafiou ${
                isSuccessful ? 'com sucesso' : 'sem sucesso'
            } ${turn.currentUser?.userName}. ${
                isSuccessful
                    ? `${turn.currentUser?.userName} perde 1 carta.`
                    : `${self?.userName} perde 1 carta.`
            }`
        } as ITurn);

        if (!isSuccessful) {
            socket.emit('user:update', {
                ...turn.currentUser,
                cards: getRandomCards()
            });
        }
    };

    const onDiscard = (user: IUser, cardSelected: ICard) => {
        const cardsFiltered = user.cards?.filter((card) => card.id !== cardSelected.id);

        if (!cardsFiltered.length) {
            socket.emit('user:on-lose', user);
        } else {
            socket.emit('user:update', {
                ...user,
                cards: user.cards?.filter((card) => card.id !== cardSelected.id)
            });
        }

        socket.emit('turn:pass', turn);
    };

    useEffect(() => {
        socket.emit('game:on-start', { roomId });
        socket.on('users:update', setUsers);
        socket.on('turn:update', setTurn);
    }, [socket]);

    console.log('turn', turn);
    console.log('users', users);

    return (
        <Container>
            <S.Content>
                <S.Title>
                    {turn?.title || (
                        <>
                            Turno de <strong>{turn?.currentUser?.userName}</strong>
                        </>
                    )}
                </S.Title>
                <S.UserList>
                    {users?.map((user) => (
                        <UserBlock
                            key={user.id}
                            name={user.userName}
                            money={user.money!}
                            cards={user.cards!}
                            showCards={user.id === socket.id}
                        />
                    ))}
                </S.UserList>

                <ActionsBlock
                    turn={turn}
                    userSelf={self!}
                    users={users}
                    onAction={onAction}
                    onSkip={onSkip}
                    onBlock={onBlock}
                    onChallenge={onChallenge}
                    onDiscard={onDiscard}
                />
            </S.Content>
        </Container>
    );
};
