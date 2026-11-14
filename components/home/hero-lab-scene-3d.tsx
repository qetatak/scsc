'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, RootState } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface SceneProps {
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  scrollProgress: React.MutableRefObject<number>;
  isSoftwareGl: boolean;
}

function detectSoftwareGl(): boolean {
  if (typeof document === 'undefined') return true;
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function handleCanvasCreated(state: RootState) {
  const pmremGenerator = new THREE.PMREMGenerator(state.gl);
  const envTexture = pmremGenerator.fromScene(
    new RoomEnvironment(),
    0.04
  ).texture;
  state.scene.environment = envTexture;
  pmremGenerator.dispose();
}

function LabSculpture({ pointer, scrollProgress, isSoftwareGl }: SceneProps) {
  const rootGroup = useRef<THREE.Group>(null);
  const barsGroup = useRef<THREE.Group>(null);
  const bracketsGroup = useRef<THREE.Group>(null);

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#0A1630'),
        roughness: 0.16,
        metalness: 0.1,
        transmission: isSoftwareGl ? 0 : 0.82,
        transparent: true,
        opacity: isSoftwareGl ? 0.86 : 1,
        ior: 1.48,
        thickness: 0.9,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
      }),
    [isSoftwareGl]
  );

  const frontPlateMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#132854'),
        roughness: 0.22,
        metalness: 0.25,
        transmission: isSoftwareGl ? 0 : 0.72,
        transparent: true,
        opacity: isSoftwareGl ? 0.78 : 1,
        ior: 1.45,
        thickness: 0.6,
      }),
    [isSoftwareGl]
  );

  const electricMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#2F6BFF'),
        roughness: 0.28,
        metalness: 0.65,
      }),
    []
  );

  const navyAccentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0A1630'),
        roughness: 0.45,
        metalness: 0.8,
      }),
    []
  );

  const lineMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#2F6BFF'),
        transparent: true,
        opacity: 0.65,
      }),
    []
  );

  useEffect(() => {
    return () => {
      glassMaterial.dispose();
      frontPlateMaterial.dispose();
      electricMaterial.dispose();
      navyAccentMaterial.dispose();
      lineMaterial.dispose();
    };
  }, [
    glassMaterial,
    frontPlateMaterial,
    electricMaterial,
    navyAccentMaterial,
    lineMaterial,
  ]);

  const barHeights = [0.65, 1.05, 0.85, 1.45, 1.2, 1.75];

  useFrame((state, delta) => {
    if (!rootGroup.current) return;
    const t = state.clock.getElapsedTime();
    const targetRotY =
      -0.28 + pointer.current.x * 0.22 + scrollProgress.current * 0.35;
    const targetRotX =
      0.14 - pointer.current.y * 0.16 + scrollProgress.current * 0.15;

    rootGroup.current.rotation.y = THREE.MathUtils.damp(
      rootGroup.current.rotation.y,
      targetRotY,
      4,
      delta
    );
    rootGroup.current.rotation.x = THREE.MathUtils.damp(
      rootGroup.current.rotation.x,
      targetRotX,
      4,
      delta
    );
    rootGroup.current.position.y = Math.sin(t * 0.9) * 0.06;

    if (bracketsGroup.current) {
      bracketsGroup.current.position.z =
        0.52 + Math.sin(t * 1.4) * 0.04;
    }
  });

  return (
    <group ref={rootGroup} rotation={[0.14, -0.28, 0]}>
      {/* Layer 1: Deep Navy Architectural Backplate */}
      <mesh
        position={[0, 0, -0.45]}
        material={navyAccentMaterial}
      >
        <boxGeometry args={[3.5, 2.35, 0.08]} />
      </mesh>

      {/* Layer 2: Primary Glass Simulation Plane */}
      <mesh
        position={[0, 0, -0.05]}
        material={glassMaterial}
      >
        <boxGeometry args={[3.3, 2.15, 0.1]} />
      </mesh>

      {/* Layer 3: Elevated Glass Data Card */}
      <mesh
        position={[0.22, -0.08, 0.28]}
        material={frontPlateMaterial}
      >
        <boxGeometry args={[2.55, 1.55, 0.07]} />
      </mesh>

      {/* Horizontal Data Grid Lines on Primary Plane */}
      {[-0.6, -0.2, 0.2, 0.6].map((yPos, idx) => (
        <mesh
          key={idx}
          position={[0, yPos, 0.02]}
          material={lineMaterial}
        >
          <boxGeometry args={[2.85, 0.012, 0.01]} />
        </mesh>
      ))}

      {/* 6 Analytical Bar Chart Columns */}
      <group ref={barsGroup} position={[-0.75, -0.68, 0.36]}>
        {barHeights.map((h, i) => (
          <mesh
            key={i}
            position={[i * 0.34, h / 2, 0]}
            material={i >= 3 ? electricMaterial : navyAccentMaterial}
          >
            <boxGeometry args={[0.19, h, 0.12]} />
          </mesh>
        ))}
      </group>

      {/* Geometric Code Brackets (< and >) */}
      <group ref={bracketsGroup} position={[-1.15, 0.52, 0.52]}>
        {/* Left bracket '<' */}
        <group position={[-0.22, 0, 0]}>
          <mesh
            position={[0, 0.1, 0]}
            rotation={[0, 0, Math.PI / 4]}
            material={electricMaterial}
          >
            <boxGeometry args={[0.28, 0.06, 0.06]} />
          </mesh>
          <mesh
            position={[0, -0.1, 0]}
            rotation={[0, 0, -Math.PI / 4]}
            material={electricMaterial}
          >
            <boxGeometry args={[0.28, 0.06, 0.06]} />
          </mesh>
        </group>

        {/* Right bracket '>' */}
        <group position={[0.22, 0, 0]}>
          <mesh
            position={[0, 0.1, 0]}
            rotation={[0, 0, -Math.PI / 4]}
            material={electricMaterial}
          >
            <boxGeometry args={[0.28, 0.06, 0.06]} />
          </mesh>
          <mesh
            position={[0, -0.1, 0]}
            rotation={[0, 0, Math.PI / 4]}
            material={electricMaterial}
          >
            <boxGeometry args={[0.28, 0.06, 0.06]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default function HeroLabScene3D() {
  const pointer = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);
  const [isSoftwareGl] = useState<boolean>(() => detectSoftwareGl());

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      scrollProgress.current = Math.min(1, window.scrollY / 700);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div
      className="h-full w-full"
      aria-hidden="true"
    >
      <Canvas
        dpr={isSoftwareGl ? 1 : [1, 1.5]}
        camera={{ position: [0, 0, 4.4], fov: 40 }}
        gl={{
          antialias: !isSoftwareGl,
          powerPreference: 'high-performance',
          alpha: true,
        }}
        onCreated={handleCanvasCreated}
      >
        <hemisphereLight args={['#FAFBFC', '#0A1630', 0.9]} />
        <directionalLight position={[4, 6, 5]} intensity={1.8} color="#FAFBFC" />
        <directionalLight position={[-4, -2, 3]} intensity={1.1} color="#2F6BFF" />
        <LabSculpture
          pointer={pointer}
          scrollProgress={scrollProgress}
          isSoftwareGl={isSoftwareGl}
        />
      </Canvas>
    </div>
  );
}

