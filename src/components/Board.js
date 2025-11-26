import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import Piece from './Piece';
import Highlight from './Highlight';
import { Text } from '@react-three/drei';

const Board = () => {
    const { fen, makeMove, getValidMoves, turn, lastMove } = useGame();
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [validMoves, setValidMoves] = useState([]);
    const [pieces, setPieces] = useState([]);

    // Helper to get coordinates from square string (e.g., 'e4')
    const getCoords = (square) => {
        const c = square.charCodeAt(0) - 97;
        const r = 8 - parseInt(square[1]);
        return { r, c };
    };

    // Initialize pieces from FEN
    const initPiecesFromFen = (fenString) => {
        const p = [];
        const rows = fenString.split(' ')[0].split('/');
        let idCounter = 0;
        for (let r = 0; r < 8; r++) {
            let c = 0;
            for (let char of rows[r]) {
                if (isNaN(char)) {
                    p.push({
                        type: char.toLowerCase(),
                        color: char === char.toUpperCase() ? 'w' : 'b',
                        r,
                        c,
                        id: `piece-${idCounter++}` // Stable ID
                    });
                    c++;
                } else {
                    c += parseInt(char);
                }
            }
        }
        return p;
    };

    // Initialize on mount
    useEffect(() => {
        setPieces(initPiecesFromFen(fen));
    }, []);

    // Handle moves
    useEffect(() => {
        if (!lastMove) {
            // If lastMove is null, it might be a reset or initial load
            // We should re-sync with FEN if the pieces don't match roughly
            // For now, just re-init if lastMove is null.
            setPieces(initPiecesFromFen(fen));
            return;
        }

        const { from, to, promotion, flags } = lastMove;
        const fromCoords = getCoords(from);
        const toCoords = getCoords(to);

        setPieces(prevPieces => {
            let newPieces = [...prevPieces];

            // Handle Capture
            // If there is a piece at 'to', remove it
            // Note: En passant capture is different (piece is not at 'to')
            if (lastMove.captured && !flags.includes('e')) {
                newPieces = newPieces.filter(p => !(p.r === toCoords.r && p.c === toCoords.c));
            }

            // Handle En Passant
            if (flags.includes('e')) {
                // The captured pawn is at 'to' column, but 'from' row
                const capturedR = fromCoords.r;
                const capturedC = toCoords.c;
                newPieces = newPieces.filter(p => !(p.r === capturedR && p.c === capturedC));
            }

            // Find the moving piece in the updated array
            const movingPieceIndex = newPieces.findIndex(p => p.r === fromCoords.r && p.c === fromCoords.c);
            if (movingPieceIndex === -1) {
                // This should ideally not happen if the state is consistent.
                // If it does, it means our piece tracking is out of sync with chess.js.
                // Re-initialize from FEN as a fallback.
                console.warn("Moving piece not found, re-initializing from FEN.");
                return initPiecesFromFen(fen);
            }

            // Update the moving piece's position and type (if promoted)
            newPieces[movingPieceIndex] = {
                ...newPieces[movingPieceIndex],
                r: toCoords.r,
                c: toCoords.c,
                type: promotion ? promotion : newPieces[movingPieceIndex].type
            };

            // Handle Castling
            if (flags.includes('k') || flags.includes('q')) {
                // k: kingside, q: queenside
                // We need to move the rook
                const row = fromCoords.r; // King's row (0 for white, 7 for black)
                let rookFromC, rookToC;

                if (flags.includes('k')) { // Kingside
                    rookFromC = 7; // h-file
                    rookToC = 5; // f-file
                } else { // Queenside
                    rookFromC = 0; // a-file
                    rookToC = 3; // d-file
                }

                const rookIndex = newPieces.findIndex(p => p.r === row && p.c === rookFromC);
                if (rookIndex !== -1) {
                    newPieces[rookIndex] = {
                        ...newPieces[rookIndex],
                        c: rookToC
                    };
                }
            }

            return newPieces;
        });

    }, [lastMove, fen]); // Depend on lastMove. fen is needed for re-init fallback.


    const handleSquareClick = (r, c) => {
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
        const square = `${files[c]}${ranks[r]}`;

        // If clicking a valid move
        if (selectedSquare && validMoves.find(m => m.to === square)) {
            makeMove(selectedSquare, square);
            setSelectedSquare(null);
            setValidMoves([]);
            return;
        }

        // Check if we clicked on a piece of our color
        const piece = pieces.find(p => p.r === r && p.c === c);
        if (piece) {
            const isWhiteTurn = turn === 'w';
            const isWhitePiece = piece.color === 'w';
            if ((isWhiteTurn && isWhitePiece) || (!isWhiteTurn && !isWhitePiece)) {
                setSelectedSquare(square);
                setValidMoves(getValidMoves(square));
                return;
            }
        }

        setSelectedSquare(null);
        setValidMoves([]);
    };

    // Generate board squares
    const squares = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const isLight = (r + c) % 2 === 0;
            const x = c - 3.5;
            const z = r - 3.5;

            squares.push(
                <mesh
                    key={`${r}-${c}`}
                    position={[x, 0, z]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleSquareClick(r, c);
                    }}
                >
                    <planeGeometry args={[1, 1]} />
                    <meshStandardMaterial color={isLight ? '#f0d9b5' : '#b58863'} />
                </mesh>
            );
        }
    }

    return (
        <group>
            {/* Board Squares */}
            {squares}

            {/* Pieces */}
            {pieces.map((p) => {
                const x = p.c - 3.5;
                const z = p.r - 3.5;
                const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
                const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
                const squareName = `${files[p.c]}${ranks[p.r]}`;
                const isSelected = selectedSquare === squareName;

                return (
                    <Piece
                        key={p.id}
                        type={p.type}
                        color={p.color}
                        position={[x, 0, z]}
                        isSelected={isSelected}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSquareClick(p.r, p.c);
                        }}
                    />
                );
            })}

            {/* Highlights */}
            {validMoves.map((move) => {
                const colChar = move.to[0];
                const rowChar = move.to[1];
                const c = colChar.charCodeAt(0) - 97;
                const r = 8 - parseInt(rowChar);
                const x = c - 3.5;
                const z = r - 3.5;

                return (
                    <Highlight key={move.to} position={[x, 0.01, z]} onClick={(e) => {
                        e.stopPropagation();
                        handleSquareClick(r, c);
                    }} />
                );
            })}
        </group>
    );
};

export default Board;
