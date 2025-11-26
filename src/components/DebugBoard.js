import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

const DebugBoard = () => {
    const { fen, makeMove, getValidMoves, turn, isGameOver, inCheck, resetGame } = useGame();
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [validMoves, setValidMoves] = useState([]);

    // Helper to parse FEN into a 2D array
    const board = [];
    const rows = fen.split(' ')[0].split('/');
    for (let r = 0; r < 8; r++) {
        const row = [];
        let file = 0;
        for (let char of rows[r]) {
            if (isNaN(char)) {
                row.push(char);
                file++;
            } else {
                const emptyCount = parseInt(char);
                for (let i = 0; i < emptyCount; i++) {
                    row.push(null);
                    file++;
                }
            }
        }
        board.push(row);
    }

    const handleSquareClick = (row, col) => {
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
        const square = `${files[col]}${ranks[row]}`;

        // If clicking a valid move for the selected piece
        if (selectedSquare && validMoves.find(m => m.to === square)) {
            makeMove(selectedSquare, square);
            setSelectedSquare(null);
            setValidMoves([]);
            return;
        }

        // If clicking a piece
        const piece = board[row][col];
        if (piece) {
            // Check if it's the current player's turn
            const isWhitePiece = piece === piece.toUpperCase();
            const isWhiteTurn = turn === 'w';

            if ((isWhitePiece && isWhiteTurn) || (!isWhitePiece && !isWhiteTurn)) {
                setSelectedSquare(square);
                const moves = getValidMoves(square);
                setValidMoves(moves);
                return;
            }
        }

        // Deselect
        setSelectedSquare(null);
        setValidMoves([]);
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Debug Board</h2>
            <div>Turn: {turn === 'w' ? 'White' : 'Black'}</div>
            <div>Status: {isGameOver ? 'Game Over' : inCheck ? 'Check!' : 'Playing'}</div>
            <button onClick={resetGame}>Reset Game</button>

            <div className="debug-board">
                {board.map((row, r) => (
                    row.map((piece, c) => {
                        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
                        const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
                        const squareName = `${files[c]}${ranks[r]}`;
                        const isSelected = selectedSquare === squareName;
                        const isValidMove = validMoves.find(m => m.to === squareName);
                        const isLight = (r + c) % 2 === 0;

                        return (
                            <div
                                key={squareName}
                                className={`square ${isLight ? 'light' : 'dark'} ${isSelected ? 'selected' : ''} ${isValidMove ? 'valid-move' : ''}`}
                                onClick={() => handleSquareClick(r, c)}
                            >
                                {piece}
                            </div>
                        );
                    })
                ))}
            </div>
        </div>
    );
};

export default DebugBoard;
