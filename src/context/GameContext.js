import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { getLLMMove } from '../services/llmService';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const gameLogic = useGameLogic();
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('chessSettings');
        return saved ? JSON.parse(saved) : { apiKey: '', whiteModel: 'gemini-2.0-flash-exp', blackModel: 'gemini-2.0-flash-exp' };
    });
    const [isThinking, setIsThinking] = useState(false);

    useEffect(() => {
        localStorage.setItem('chessSettings', JSON.stringify(settings));
    }, [settings]);

    const requestLLMMove = useCallback(async () => {
        if (!settings.apiKey) {
            alert("Please set your API Key in Settings.");
            return;
        }
        setIsThinking(true);
        try {
            const move = await getLLMMove(gameLogic.fen, settings.apiKey, gameLogic.turn === 'w' ? settings.whiteModel : settings.blackModel);

            // Parse move string to from/to
            // move is like 'e2e4' or 'e2e4q'
            const from = move.substring(0, 2);
            const to = move.substring(2, 4);
            const promotion = move.length > 4 ? move.substring(4, 5) : undefined;

            gameLogic.makeMove(from, to, promotion);
        } catch (error) {
            console.error("LLM Error:", error);
            alert(`LLM Error: ${error.message}`);
        } finally {
            setIsThinking(false);
        }
    }, [gameLogic, settings]);

    return (
        <GameContext.Provider value={{ ...gameLogic, settings, setSettings, isThinking, requestLLMMove }}>
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
