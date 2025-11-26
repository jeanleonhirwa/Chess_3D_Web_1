import { useState, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';

export const useGameLogic = () => {
  const chessRef = useRef(new Chess());
  const [fen, setFen] = useState(chessRef.current.fen());
  const [turn, setTurn] = useState(chessRef.current.turn());
  const [isGameOver, setIsGameOver] = useState(chessRef.current.isGameOver());
  const [inCheck, setInCheck] = useState(chessRef.current.inCheck());
  const [history, setHistory] = useState(chessRef.current.history());
  const [lastMove, setLastMove] = useState(null);

  const updateState = useCallback(() => {
    setFen(chessRef.current.fen());
    setTurn(chessRef.current.turn());
    setIsGameOver(chessRef.current.isGameOver());
    setInCheck(chessRef.current.inCheck());
    setHistory(chessRef.current.history());
  }, []);

  const makeMove = useCallback((from, to, promotion = 'q') => {
    try {
      const move = chessRef.current.move({ from, to, promotion });
      if (move) {
        setLastMove(move);
        updateState();
        return true;
      }
    } catch (e) {
      // Invalid move
      return false;
    }
    return false;
  }, [updateState]);

  const getValidMoves = useCallback((square) => {
    return chessRef.current.moves({ square, verbose: true });
  }, []);

  const resetGame = useCallback(() => {
    chessRef.current.reset();
    setLastMove(null);
    updateState();
  }, [updateState]);

  const loadFen = useCallback((newFen) => {
      try {
          chessRef.current.load(newFen);
          setLastMove(null);
          updateState();
          return true;
      } catch (e) {
          console.error("Invalid FEN:", newFen);
          return false;
      }
  }, [updateState]);


  return {
    chess: chessRef.current,
    fen,
    turn,
    isGameOver,
    inCheck,
    history,
    lastMove,
    makeMove,
    getValidMoves,
    resetGame,
    loadFen
  };
};
