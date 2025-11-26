import React, { useMemo } from 'react';
import { useSpring, animated } from '@react-spring/three';

const Piece = ({ type, color, position, onClick, isSelected }) => {
    const isWhite = color === 'w';
    const materialColor = isWhite ? '#ffffff' : '#333333';
    const emissive = isSelected ? '#ff0000' : '#000000'; // Highlight selected piece

    const { pos } = useSpring({
        pos: position,
        config: { mass: 1, tension: 170, friction: 26 }
    });

    const geometry = useMemo(() => {
        switch (type) {
            case 'p': // Pawn
                return (
                    <group>
                        <mesh position={[0, 0.5, 0]}>
                            <cylinderGeometry args={[0.3, 0.4, 1, 16]} />
                            <meshStandardMaterial color={materialColor} emissive={emissive} />
                        </mesh>
                        <mesh position={[0, 1.1, 0]}>
                            <sphereGeometry args={[0.3, 16, 16]} />
                            <meshStandardMaterial color={materialColor} emissive={emissive} />
                        </mesh>
                    </group>
                );
            case 'r': // Rook
                return (
                    <group>
                        <mesh position={[0, 0.6, 0]}>
                            <cylinderGeometry args={[0.4, 0.4, 1.2, 16]} />
                            <meshStandardMaterial color={materialColor} emissive={emissive} />
                        </mesh>
                    </group>
                );
            case 'n': // Knight
                return (
                    <group>
                        <mesh position={[0, 0.6, 0]}>
                            <boxGeometry args={[0.5, 1.2, 0.5]} />
                            <meshStandardMaterial color={materialColor} emissive={emissive} />
                        </mesh>
                        <mesh position={[0, 1.0, 0.3]} rotation={[0.5, 0, 0]}>
                            <boxGeometry args={[0.4, 0.6, 0.4]} />
                            <meshStandardMaterial color={materialColor} emissive={emissive} />
                        </mesh>
                    </group>
                );
            case 'b': // Bishop
                return (
                    <group>
                        <mesh position={[0, 0.6, 0]}>
                            <cylinderGeometry args={[0.3, 0.4, 1.2, 16]} />
                            <meshStandardMaterial color={materialColor} emissive={emissive} />
                        </mesh>
                        <mesh position={[0, 1.3, 0]}>
                            <coneGeometry args={[0.3, 0.6, 16]} />
                            <meshStandardMaterial color={materialColor} emissive={emissive} />
                        </mesh>
                    </group>
                );
            case 'q': // Queen
                return (
                    <group>
                        <mesh position={[0, 0.75, 0]}>
                            <cylinderGeometry args={[0.35, 0.45, 1.5, 16]} />
                            <meshStandardMaterial color={materialColor} emissive={emissive} />
                        </mesh>
                        <mesh position={[0, 1.6, 0]}>
                            <sphereGeometry args={[0.35, 16, 16]} />
                            <meshStandardMaterial color={materialColor} emissive={emissive} />
                        </mesh>
                    </group>
                );
            case 'k': // King
                return (
                    <group>
                        <mesh position={[0, 0.85, 0]}>
                            <cylinderGeometry args={[0.4, 0.5, 1.7, 16]} />
                            <meshStandardMaterial color={materialColor} emissive={emissive} />
                        </mesh>
                        <mesh position={[0, 1.8, 0]}>
                            <boxGeometry args={[0.3, 0.3, 0.3]} />
                            <meshStandardMaterial color={materialColor} emissive={emissive} />
                        </mesh>
                    </group>
                );
            default:
                return null;
        }
    }, [type, materialColor, emissive]);

    return (
        <animated.group position={pos} onClick={onClick}>
            {geometry}
        </animated.group>
    );
};

export default Piece;
