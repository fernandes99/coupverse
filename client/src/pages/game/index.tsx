import { Socket } from 'socket.io-client';
import { S } from './styles';
import { UserBlock } from './components/UserBlock';
import { Container } from '../../styles/layout';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IUser } from '../../types/users';
import { ITurn } from '../../types/turns';

interface IGamePage {
    socket: Socket;
}

export const GamePage = ({ socket }: IGamePage) => {
    const { roomId } = useParams();
    const [users, setUsers] = useState<IUser[]>([]);
    const [turn, setTurn] = useState<ITurn>({ roomId: roomId!, currentUser: null });

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
                    Turno de <strong>{turn?.currentUser?.userName}</strong>
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
            </S.Content>
        </Container>
    );
};
