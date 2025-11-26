import React, { createContext, useContext } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const gameLogic = useGameLogic();

    return (
        <GameContext.Provider value={gameLogic}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
