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

interface IGamePage {
    socket: Socket;
}

export const GamePage = ({ socket }: IGamePage) => {
    const { roomId } = useParams();

    const [users, setUsers] = useState<IUser[]>([]);
    const [turn, setTurn] = useState<ITurn>({
        roomId: roomId!,
        currentUser: null,
        currentAction: null
    });
    const self = useMemo(() => users.find((user) => user.id === socket.id) || null, [users]);

    const onAction = (action: IAction) => {
        if (action.slug === 'foreign-aid') {
            socket.emit('turn:action', {
                ...turn,
                currentAction: {
                    action,
                    countSkipped: 1,
                    message: `${self?.userName} pediu ajuda externa.`
                }
            });
            return;
        }

        if (action.slug === 'income') {
            socket.emit('user:update', { ...self, money: self!.money + action.transactionAmount });
        }

        if (!action.blockableBy.length && !action.isChallengeable) {
            socket.emit('turn:pass', {
                ...turn,
                currentUser: { ...self, money: self!.money + action.transactionAmount }
            });
        }
    };

    const onSkip = () => {
        socket.emit('turn:skip-action', turn);
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
                    {turn.currentAction?.message || (
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

                <ActionsBlock turn={turn} userSelf={self!} onAction={onAction} onSkip={onSkip} />
            </S.Content>
        </Container>
    );
};
