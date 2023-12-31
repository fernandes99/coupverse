import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import * as io from 'socket.io-client';

import { WelcomePage } from './pages/welcome';
import './styles/reset.css';
import './styles/global.css';
import { LobbyPage } from './pages/lobby';
import { GamePage } from './pages/game';
import { LoadingBlock } from './components/Loading';
import { Toaster, toast } from 'react-hot-toast';
import { SECOND } from './constants/times';
import { GlobalContext, IGlobalContext } from './context/global';

// const localhost = 'http://localhost:8080'; // inserir em config env
const coupverse = 'https://coupverse.one:8080'; // inserir em config env
const socket = io.connect(coupverse);

const App = () => {
    const [loading, setLoading] = useState<IGlobalContext['loading']>(false);

    useEffect(() => {
        socket.on('connect', () => setLoading(false));

        const timeout = setTimeout(() => {
            if (loading) {
                toast.error('Erro ao se conectar.');
                setLoading(false);
            }
        }, SECOND * 30);

        return () => {
            clearTimeout(timeout);
        };
    }, [socket]);

    return (
        <GlobalContext.Provider value={{ loading, setLoading }}>
            {loading && <LoadingBlock />}

            <Router>
                <Routes>
                    <Route path='/' element={<Navigate to='/bem-vindo' replace />} />
                    <Route path='/bem-vindo' element={<WelcomePage socket={socket} />} />
                    <Route path='/sala/:roomId/lobby' element={<LobbyPage socket={socket} />} />
                    <Route path='/sala/:roomId' element={<GamePage socket={socket} />} />
                </Routes>
            </Router>

            <Toaster />
        </GlobalContext.Provider>
    );
};

export default App;
