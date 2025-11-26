import React from 'react';

const Highlight = ({ position, onClick }) => {
    return (
        <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} onClick={onClick}>
            <planeGeometry args={[0.8, 0.8]} />
            <meshBasicMaterial color="#00ff00" transparent opacity={0.5} />
        </mesh>
    );
};

export default Highlight;
