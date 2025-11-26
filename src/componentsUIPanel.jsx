import React from 'react';
import GameStatus from './GameStatus';
import MoveHistory from './MoveHistory';

const UIPanel = () => {
    return (
        <div className="ui-panel">
            <GameStatus />
            <MoveHistory />
        </div>
    );
};

export default UIPanel;
