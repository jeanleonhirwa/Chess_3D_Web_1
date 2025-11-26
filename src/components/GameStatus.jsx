import React from 'react';
import { useGame } from '../context/GameContext';

const GameStatus = () => {
    const { turn, isGameOver, inCheck, resetGame } = useGame();

    let statusText = '';
    if (isGameOver) {
        // We need to know why (checkmate, stalemate, etc.)
        // chess.js has methods for this, but we only exposed isGameOver.
        // Let's just say "Game Over".
        statusText = 'Game Over';
        if (inCheck) statusText = 'Checkmate!';
        else statusText = 'Stalemate / Draw';
    } else {
        statusText = turn === 'w' ? "White's Turn" : "Black's Turn";
        if (inCheck) statusText += ' (Check!)';
    }

    return (
        <div className="game-status card">
            <div className="card__header">Game Status</div>
            <div className="card__body">
                <div className="status-text">{statusText}</div>
                <button className="button button--primary" onClick={resetGame}>New Game</button>
            </div>
        </div>
    );
};

export default GameStatus;
