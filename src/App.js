import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { GameProvider } from './context/GameContext';
import Board from './components/Board';
import './styles/App.css';

function App() {
    return (
        <GameProvider>
            <div className="App">
                <Canvas camera={{ position: [0, 10, 5], fov: 45 }}>
                    <Suspense fallback={null}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
                        <pointLight position={[-10, -10, -5]} intensity={0.5} />
                        <Stars />
                        <Board />
                        <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
                    </Suspense>
                </Canvas>

                {/* Overlay UI will go here later */}
                <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', pointerEvents: 'none' }}>
                    <h1>LLM Chess 3D</h1>
                </div>
            </div>
        </GameProvider>
    );
}

export default App;
