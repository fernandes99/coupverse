import { Socket } from 'socket.io-client';
import { S } from './styles';
import { UserBlock } from './components/UserBlock';
import { Container } from '../../styles/layout';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IUser } from '../../types/users';
import { ITurn } from '../../types/turns';
import { ActionsBlock } from './components/ActionsBlock';
import { IAction } from '../../types/actions';
import { COUNTER_ACTIONS } from '../../constants/actions';
import { ICardSlug } from '../../constants/cards';

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
        currentUser: null,
        initialUser: null,
        usersSkipped: [],
        round: 0,
        title: ''
    });
    const self = useMemo(() => users.find((user) => user.id === socket.id) as IUser, [users]);

    const onAction = (action: IAction) => {
        if (action.slug === 'foreign-aid') {
            socket.emit('turn:action', {
                ...turn,
                action,
                counterAction: null,
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
                currentUser: self,
                usersSkipped: [self.id],
                title: `${self?.userName} está tentando cobrar imposto (+3 moedas).`
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
            currentUser: self,
            usersSkipped: [self.id],
            title: `${self?.userName} está tentando bloquear ${turn.currentUser?.userName}.`
        } as ITurn);
    };

    const onChallenge = () => {
        console.log('OnChallenge');
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
                    onAction={onAction}
                    onSkip={onSkip}
                    onBlock={onBlock}
                    onChallenge={onChallenge}
                />
            </S.Content>
        </Container>
    );
};
