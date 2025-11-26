import React, { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';

const MoveHistory = () => {
    const { history } = useGame();
    const listRef = useRef(null);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [history]);

    // Format moves into pairs
    const movePairs = [];
    for (let i = 0; i < history.length; i += 2) {
        movePairs.push({
            number: Math.floor(i / 2) + 1,
            white: history[i],
            black: history[i + 1] || ''
        });
    }

    return (
        <div className="move-history card">
            <div className="card__header">Move History</div>
            <div className="card__body scrollable" ref={listRef}>
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>White</th>
                            <th>Black</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movePairs.map((pair) => (
                            <tr key={pair.number}>
                                <td>{pair.number}.</td>
                                <td>{pair.white}</td>
                                <td>{pair.black}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MoveHistory;
