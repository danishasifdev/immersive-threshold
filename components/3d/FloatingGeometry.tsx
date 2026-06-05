'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import type { SceneControls } from '@/app/page';

const ICO_RADIUS = 1.8;

function getIcosahedronVertices(radius: number): THREE.Vector3[] {
  const geo = new THREE.IcosahedronGeometry(radius, 0);
  const pos = geo.attributes.position;
  const seen = new Set<string>();
  const verts: THREE.Vector3[] = [];
  for (let i = 0; i < pos.count; i++) {
    const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
    const key = `${v.x.toFixed(2)},${v.y.toFixed(2)},${v.z.toFixed(2)}`;
    if (!seen.has(key)) { seen.add(key); verts.push(v); }
  }
  geo.dispose();
  return verts;
}

// ---- PARTICLE SYSTEM ---- (lerp-based, single GSAP tween on progress ref)
function ParticleCloud({ phase, burstCount }: { phase: number; burstCount: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const progressRef = useRef({ value: 0 });
  const COUNT = 1000;

  const { scatterPos, homePos } = useMemo(() => {
    const verts = getIcosahedronVertices(ICO_RADIUS);
    const scatter = new Float32Array(COUNT * 3);
    const home = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      // Scatter: sphere radius 3–6, clamped z so nothing behind camera
      const r = 3 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      scatter[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      scatter[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      scatter[i * 3 + 2] = Math.min(r * Math.cos(phi), 6.5);

      // Home: at one of 12 icosahedron vertices with small jitter
      const v = verts[i % verts.length];
      home[i * 3]     = v.x + (Math.random() - 0.5) * 0.25;
      home[i * 3 + 1] = v.y + (Math.random() - 0.5) * 0.25;
      home[i * 3 + 2] = v.z + (Math.random() - 0.5) * 0.25;
    }
    return { scatterPos: scatter, homePos: home };
  }, []);

  const workingPos = useMemo(() => new Float32Array(COUNT * 3).fill(0), []);

  // Animate convergence progress
  useEffect(() => {
    gsap.to(progressRef.current, {
      value: phase >= 1 ? 1 : 0,
      duration: 2.8,
      ease: 'power2.inOut',
    });
  }, [phase]);

  // Burst: explode then re-converge
  useEffect(() => {
    if (burstCount === 0) return;
    gsap.to(progressRef.current, {
      value: -0.5,
      duration: 0.5,
      ease: 'power3.out',
      onComplete: () => {
        gsap.to(progressRef.current, { value: phase >= 1 ? 1 : 0, duration: 2.5, ease: 'power2.out' });
      },
    });
  }, [burstCount, phase]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    const p = Math.max(0, Math.min(1, progressRef.current.value));

    for (let i = 0; i < COUNT; i++) {
      const wave = Math.sin(t * 0.4 + i * 0.07) * 0.04 * (1 - p);
      workingPos[i * 3]     = scatterPos[i * 3]     * (1 - p) + homePos[i * 3]     * p;
      workingPos[i * 3 + 1] = scatterPos[i * 3 + 1] * (1 - p) + homePos[i * 3 + 1] * p + wave;
      workingPos[i * 3 + 2] = scatterPos[i * 3 + 2] * (1 - p) + homePos[i * 3 + 2] * p;
    }

    const attr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    (attr.array as Float32Array).set(workingPos);
    attr.needsUpdate = true;

    pointsRef.current.rotation.y = t * 0.02;
    pointsRef.current.rotation.x = Math.sin(t * 0.15) * 0.06;
  });

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const buf = new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3);
    buf.setUsage(THREE.DynamicDrawUsage);
    g.setAttribute('position', buf);
    return g;
  }, []);

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial
        size={0.07}
        color="#F7F5F2"
        transparent
        opacity={phase >= 3 ? 0.35 : 0.72}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ---- SHARED ICOSAHEDRON GROUP (VertexGlows + EdgeLines + SolidFaces) ----
function IcosahedronForm({
  phase,
  wireframeForced,
  roughness,
  metalness,
  dissolveCount,
}: {
  phase: number;
  wireframeForced: boolean;
  roughness: number;
  metalness: number;
  dissolveCount: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const edgeMatRef = useRef<THREE.LineBasicMaterial>(null);
  const solidMatRef = useRef<THREE.MeshStandardMaterial>(null);

  // All meshes share one rotation group
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.09;
    groupRef.current.rotation.x = Math.sin(t * 0.27) * 0.1;
    groupRef.current.rotation.z = Math.cos(t * 0.19) * 0.055;
  });

  // Edge opacity
  useEffect(() => {
    if (!edgeMatRef.current) return;
    gsap.to(edgeMatRef.current, {
      opacity: phase >= 2 || wireframeForced ? 0.95 : 0,
      duration: 1.2,
      ease: 'power2.out',
    });
  }, [phase, wireframeForced]);

  // Solid opacity + scale
  useEffect(() => {
    if (!solidMatRef.current || !groupRef.current) return;
    gsap.to(solidMatRef.current, {
      opacity: phase >= 3 ? 1 : 0,
      duration: 1.6,
      ease: 'power2.out',
    });
  }, [phase]);

  // Material controls from sliders
  useEffect(() => {
    if (!solidMatRef.current) return;
    gsap.to(solidMatRef.current, {
      roughness,
      metalness,
      duration: 0.5,
      ease: 'power2.out',
    });
  }, [roughness, metalness]);

  // Dissolve
  useEffect(() => {
    if (dissolveCount === 0 || !groupRef.current) return;
    gsap.to(groupRef.current.scale, {
      x: 0, y: 0, z: 0,
      duration: 1.2,
      ease: 'power3.in',
      onComplete: () => {
        setTimeout(() => {
          if (groupRef.current) {
            gsap.to(groupRef.current.scale, { x: 1, y: 1, z: 1, duration: 1.5, ease: 'back.out(1.2)', delay: 0.5 });
          }
        }, 100);
      },
    });
  }, [dissolveCount]);

  const { solidGeo, edgeGeo, vertGeo, verts } = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(ICO_RADIUS, 0);
    const edges = new THREE.EdgesGeometry(ico);
    const vertList = getIcosahedronVertices(ICO_RADIUS);
    const sphere = new THREE.SphereGeometry(0.065, 8, 8);
    return { solidGeo: ico, edgeGeo: edges, vertGeo: sphere, verts: vertList };
  }, []);

  return (
    <group ref={groupRef}>
      {/* Vertex glow dots — phase 1+ */}
      {verts.map((v, i) => (
        <VertexDot key={i} position={[v.x, v.y, v.z]} geo={vertGeo} phase={phase} index={i} />
      ))}

      {/* Wireframe edges — phase 2+ or wireframeForced */}
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial ref={edgeMatRef} color="#8B7355" transparent opacity={0} />
      </lineSegments>

      {/* Solid faces — phase 3+ */}
      <mesh geometry={solidGeo} castShadow>
        <meshStandardMaterial
          ref={solidMatRef}
          color="#C4A882"
          roughness={0.5}
          metalness={0.3}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          envMapIntensity={1.8}
        />
      </mesh>
    </group>
  );
}

function VertexDot({
  position,
  geo,
  phase,
  index,
}: {
  position: [number, number, number];
  geo: THREE.SphereGeometry;
  phase: number;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!meshRef.current) return;
    gsap.to(meshRef.current.scale, {
      x: phase >= 1 ? 1 : 0,
      y: phase >= 1 ? 1 : 0,
      z: phase >= 1 ? 1 : 0,
      duration: 0.7,
      delay: index * 0.05,
      ease: 'back.out(2)',
    });
  }, [phase, index]);

  return (
    <mesh ref={meshRef} position={position} geometry={geo} scale={0}>
      <meshBasicMaterial
        color={index % 4 === 0 ? '#8B7355' : '#F7F5F2'}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

// ---- CAMERA RIG ----
function CameraRig({
  phase,
  mouseX,
  mouseY,
  orbitEnabled,
}: {
  phase: number;
  mouseX: number;
  mouseY: number;
  orbitEnabled: boolean;
}) {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0, z: 8.5 });
  const PHASE_Z = [8.5, 8, 7, 6.5, 5.5, 10];

  useFrame(() => {
    if (orbitEnabled) return;
    const tx = mouseX * 0.9;
    const ty = mouseY * -0.65;
    const tz = PHASE_Z[phase] ?? 8;

    target.current.x += (tx - target.current.x) * 0.04;
    target.current.y += (ty - target.current.y) * 0.04;
    target.current.z += (tz - target.current.z) * 0.025;

    camera.position.set(target.current.x, target.current.y, target.current.z);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ---- LIGHTS ----
function DynamicLights({ phase }: { phase: number }) {
  const pt1 = useRef<THREE.PointLight>(null);
  const pt2 = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (pt1.current) { pt1.current.position.x = Math.sin(t * 0.4) * 5; pt1.current.position.y = Math.cos(t * 0.35) * 3.5; }
    if (pt2.current) { pt2.current.position.x = Math.cos(t * 0.3) * 4; pt2.current.position.y = Math.sin(t * 0.28) * 3; }
  });

  return (
    <>
      <ambientLight intensity={phase >= 3 ? 0.45 : 0.2} color="#F7F5F2" />
      <directionalLight position={[5, 8, 4]} intensity={1.4} color="#F7F5F2" castShadow />
      <pointLight ref={pt1} position={[4, 3, 3]} intensity={phase >= 3 ? 3.5 : 1.5} color="#B09B78" distance={20} decay={2} />
      <pointLight ref={pt2} position={[-4, -2, 2]} intensity={phase >= 3 ? 2.5 : 0.8} color="#4A5B72" distance={14} decay={2} />
    </>
  );
}

// ---- ROOT EXPORT ----
export interface ThresholdGeometryProps {
  phase: number;
  scrollProgress: number;
  mouseX: number;
  mouseY: number;
  controls: SceneControls;
}

export default function ThresholdGeometry({
  phase,
  scrollProgress,
  mouseX,
  mouseY,
  controls,
}: ThresholdGeometryProps) {
  return (
    <>
      <DynamicLights phase={phase} />
      <CameraRig phase={phase} mouseX={mouseX} mouseY={mouseY} orbitEnabled={controls.orbitEnabled} />
      <ParticleCloud phase={phase} burstCount={controls.burstCount} />
      <IcosahedronForm
        phase={phase}
        wireframeForced={controls.wireframe}
        roughness={controls.roughness}
        metalness={controls.metalness}
        dissolveCount={controls.dissolveCount}
      />
    </>
  );
}
