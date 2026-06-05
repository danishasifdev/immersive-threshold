'use client';

import { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import ThresholdGeometry from './FloatingGeometry';
import type { SceneControls } from '@/app/page';

const BG_COLORS: Record<number, string> = {
  0: '#0C0B09',
  1: '#F7F5F2',
  2: '#F7F5F2',
  3: '#EFECE8',
  4: '#0C0B09',
  5: '#0C0B09',
};

function SceneBackground({ phase }: { phase: number }) {
  const { scene } = useThree();
  useEffect(() => {
    const hex = BG_COLORS[phase] ?? '#0C0B09';
    scene.background = new THREE.Color(hex);
  }, [phase, scene]);
  return null;
}

interface ThresholdSceneProps {
  phase: number;
  scrollProgress: number;
  mouseX: number;
  mouseY: number;
  controls: SceneControls;
  isOnLight: boolean;
}

export default function ThresholdScene({
  phase,
  scrollProgress,
  mouseX,
  mouseY,
  controls,
  isOnLight,
}: ThresholdSceneProps) {
  return (
    <div className="canvas-container" style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 9], fov: 48 }}
        shadows
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
      >
        <Suspense fallback={null}>
          <SceneBackground phase={phase} />
          <ThresholdGeometry
            phase={phase}
            scrollProgress={scrollProgress}
            mouseX={mouseX}
            mouseY={mouseY}
            controls={controls}
          />
          <Environment preset="studio" />
          {controls.orbitEnabled && (
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              enableRotate
              rotateSpeed={0.6}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
