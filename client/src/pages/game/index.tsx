import { Socket } from 'socket.io-client';
import { S } from './styles';
import { UserBlock } from './components/UserBlock';
import { Container } from '../../styles/layout';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRandomCards } from '../../utils/general';

interface IUsers {
    id: string;
    userName: string;
    roomId: string;
    isReady: boolean;
    money: number;
    cards: {
        name: string;
        slug: string;
    }[];
}

interface IGamePage {
    socket: Socket;
}

export const GamePage = ({ socket }: IGamePage) => {
    const { roomId } = useParams();
    const [users, setUsers] = useState<IUsers[]>([]);

    useEffect(() => {
        socket.emit('game:on-start', { roomId, money: 2, cards: getRandomCards() });
        socket.on('users:update', setUsers);
    }, [socket]);

    console.log('USERS', users);

    return (
        <Container>
            <S.Content>
                <S.Title>Turno de Roberto</S.Title>
                <S.UserList>
                    {users?.map((user) => (
                        <UserBlock
                            key={user.id}
                            name={user.userName}
                            money={user.money}
                            cards={user.cards}
                        />
                    ))}
                </S.UserList>
            </S.Content>
        </Container>
    );
};
