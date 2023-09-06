import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { Socket } from 'socket.io-client';
import { Logo } from '../../components/Logo';
import { Container } from '../../styles/layout';
import { S } from './styles';
import { storage } from '../../utils/storage';
import { IUser } from '../../types/users';
import { getRandomCards } from '../../utils/general';
import { useGlobalContext } from '../../context/global';
import { BiCopy } from 'react-icons/bi';
import useCopyToClipboard from '../../utils/hooks/useClipboard';
import { toast } from 'react-hot-toast';

interface ILobbyPage {
    socket: Socket;
}

export const LobbyPage = ({ socket }: ILobbyPage) => {
    const { setLoading } = useGlobalContext();
    const { roomId } = useParams();
    const navigate = useNavigate();
    const userName = storage.get('username') || `Anônimo${Math.floor(Math.random() * 1000)}`;
    const [connectedUsers, setConnectedUsers] = useState<IUser[]>([]);
    const [isReady, setIsReady] = useState(false);
    const [, copyToClipboard] = useCopyToClipboard('', 3000);

    const copyRoomId = () => {
        copyToClipboard(roomId);
        toast.success('Código da sala copiado');
    };

    useMemo(() => {
        if (connectedUsers?.length < 2 && isReady) {
            toast('É necessário 2 jogadores ou mais para iniciar', {
                icon: '🥲'
            });
        }

        socket.emit('user:on-ready', { roomId, isReady });
    }, [isReady]);

    useEffect(() => {
        setLoading(!connectedUsers.length);

        if (connectedUsers?.length < 2) return;
        if (connectedUsers.every((user) => user.isReady)) {
            navigate(`/sala/${roomId}`);
        }
    }, [connectedUsers]);

    useEffect(() => {
        socket.on('room:connected-user', setConnectedUsers);
        socket.on('users:update', setConnectedUsers);
    }, [socket]);

    useEffect(() => {
        if (!roomId) return;
        socket.emit('room:connect', { roomId, userName, money: 2, cards: getRandomCards() });
    }, [roomId]);

    console.log('lobby > connectedUsers', connectedUsers);

    return (
        <Container>
            <S.Content>
                <Logo />
                <S.Head>
                    <p>Usuários na sala:</p>
                    <S.Flex>
                        <S.CopyBlock onClick={copyRoomId}>
                            <span>Código:</span>
                            <S.CodeRoom>{roomId}</S.CodeRoom>
                            <BiCopy />
                        </S.CopyBlock>
                    </S.Flex>
                </S.Head>
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
