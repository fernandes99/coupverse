import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { Socket } from 'socket.io-client';
import { Logo } from '../../components/Logo';
import { Container } from '../../styles/layout';
import { S } from './styles';
import { storage } from '../../utils/storage';

interface IUsers {
    id: string;
    userName: string;
    isReady: boolean;
}

interface ILobbyPage {
    socket: Socket;
}

export const LobbyPage = ({ socket }: ILobbyPage) => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const userName = storage.get('username') || `Anônimo${Math.floor(Math.random() * 1000)}`;
    const [connectedUsers, setConnectedUsers] = useState<IUsers[]>([]);
    const [isReady, setIsReady] = useState(false);

    useMemo(() => socket.emit('user:on-ready', { roomId, isReady }), [isReady]);

    useEffect(() => {
        if (!connectedUsers.length) return;
        if (connectedUsers?.every((user) => user.isReady)) {
            navigate(`/sala/${roomId}`);
        }
    }, [connectedUsers]);

    useEffect(() => {
        socket.on('room:connected-user', setConnectedUsers);
        socket.on('users:update', setConnectedUsers);
    }, [socket]);

    useEffect(() => {
        if (!roomId) return;
        socket.emit('room:connect', { roomId, userName });
    }, [roomId]);

    return (
        <Container>
            <S.Content>
                <Logo />
                <p>Usuários na sala:</p>
                <S.UserList>
                    <>
                        {connectedUsers?.map((user) => (
                            <li key={user.userName}>
                                <p>{user.userName}</p>
                                <S.Tag ready={!!user.isReady}>
                                    {user.isReady ? 'Pronto' : 'Não está pronto'}
                                </S.Tag>
                            </li>
                        ))}
                    </>
                </S.UserList>
                <S.Button isReady={isReady} onClick={() => setIsReady(!isReady)}>
                    {isReady ? 'Cancelar' : 'Pronto'}
                </S.Button>
                <S.SmallText>Quando todos estiverem pronto, o jogo irá iniciar.</S.SmallText>
            </S.Content>
        </Container>
    );
};
