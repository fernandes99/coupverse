import { useEffect, useState } from 'react';
import { S } from './styles';
import { Logo } from '../../components/Logo';
import { Socket } from 'socket.io-client';
import { getRandomString } from '../../utils/general';
import { Container } from '../../styles/layout';
import { useNavigate } from 'react-router-dom';
import { storage } from '../../utils/storage';
import { toast } from 'react-hot-toast';

interface IWelcomePage {
    socket: Socket;
}

export const WelcomePage = ({ socket }: IWelcomePage) => {
    const navigate = useNavigate();
    const [creatingRoom, setCreatingRoom] = useState(false);
    const [roomId, setRoomId] = useState('');
    const [userName, setUserName] = useState('');

    const createRoom = () => {
        const randomString = getRandomString();

        storage.set('username', userName || `Anônimo${Math.random().toFixed(5)}`);
        socket.emit('connect_room', { roomId, userName });
        setRoomId(randomString);
        navigate(`/sala/${randomString}/lobby`);
    };

    const enterRoom = () => {
        if (!roomId) {
            return toast('Insira o código da sala', {
                icon: '🔑'
            });
        }

        storage.set('username', userName || `Anônimo${Math.random().toFixed(5)}`);
        socket.emit('connect_room', { roomId, userName });
        navigate(`/sala/${roomId}/lobby`);
    };

    useEffect(() => {
        setUserName(storage.get('username') || '');
    }, [storage]);

    return (
        <Container>
            <S.Content>
                <S.Info>
                    <p>Bem vindo ao</p>
                    <Logo />
                </S.Info>

                {creatingRoom ? (
                    <S.Form>
                        <input
                            placeholder='Digite seu nome'
                            defaultValue={userName}
                            onChange={(event) => setUserName(event.target.value)}
                        />
                        <button onClick={createRoom}>Criar na sala</button>
                        <a href='javascript:void(0)' onClick={() => setCreatingRoom(false)}>
                            Entre em uma sala
                        </a>
                    </S.Form>
                ) : (
                    <S.Form>
                        <input
                            placeholder='Digite seu nome'
                            defaultValue={userName}
                            onChange={(event) => setUserName(event.target.value)}
                        />
                        <input
                            placeholder='Digite o código da sala'
                            onChange={(event) => setRoomId(event.target.value)}
                            onKeyDown={(event) => event.key === 'Enter' && enterRoom()}
                        />
                        <button onClick={enterRoom}>Entrar na sala</button>
                        <a href='javascript:void(0)' onClick={() => setCreatingRoom(true)}>
                            Crie uma sala
                        </a>
                    </S.Form>
                )}
            </S.Content>
        </Container>
    );
};
