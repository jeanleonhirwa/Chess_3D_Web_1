import React from 'react';
import { GameProvider } from './context/GameContext';
import DebugBoard from './components/DebugBoard';
import './styles/App.css';

function App() {
    return (
        <GameProvider>
            <div className="App">
                <h1>LLM Chess 3D</h1>
                <DebugBoard />
            </div>
        </GameProvider>
    );
}

export default App;
