import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import * as io from 'socket.io-client';

import { WelcomePage } from './pages/welcome';
import './styles/reset.css';
import './styles/global.css';
import { LobbyPage } from './pages/lobby';
import { GamePage } from './pages/game';

// const localhost = 'http://localhost:8080'; // inserir em config env
const coupverse = 'https://coupverse.one:8080'; // inserir em config env
const socket = io.connect(coupverse);

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path='/' element={<Navigate to='/bem-vindo' replace />} />
                    <Route path='/bem-vindo' element={<WelcomePage socket={socket} />} />
                    <Route path='/sala/:roomId/lobby' element={<LobbyPage socket={socket} />} />
                    <Route path='/sala/:roomId' element={<GamePage socket={socket} />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
