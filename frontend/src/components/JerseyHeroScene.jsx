import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

const JerseyModel = ({ pointer }) => {
  const group = useRef(null);
  const stripes = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, '#0b1224');
    gradient.addColorStop(0.55, '#163dff');
    gradient.addColorStop(1, '#7a0f1f');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    for (let i = 0; i < 16; i += 1) {
      ctx.fillRect(i * 36, 0, 16, 512);
    }

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = 'bold 64px Arial';
    ctx.fillText('JERSEY HUB', 120, 270);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  useFrame((state) => {
    if (!group.current) return;

    group.current.rotation.y += 0.004;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.current.y * 0.25, 0.08);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, group.current.rotation.y + pointer.current.x * 0.005, 0.08);
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.06;
  });

  return (
    <Float speed={1.8} rotationIntensity={0.5} floatIntensity={1.2}>
      <group ref={group}>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[1.65, 2.1, 0.5]} />
          <meshPhysicalMaterial map={stripes} roughness={0.34} metalness={0.22} clearcoat={0.5} />
        </mesh>
        <mesh position={[-1.2, 0.45, 0]} rotation={[0, 0, 0.35]}>
          <boxGeometry args={[0.7, 1, 0.5]} />
          <meshPhysicalMaterial color="#121212" roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh position={[1.2, 0.45, 0]} rotation={[0, 0, -0.35]}>
          <boxGeometry args={[0.7, 1, 0.5]} />
          <meshPhysicalMaterial color="#121212" roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh position={[0, 1.45, 0.1]}>
          <torusGeometry args={[0.28, 0.07, 20, 50]} />
          <meshStandardMaterial color="#f4f6ff" emissive="#1a4bff" emissiveIntensity={0.35} />
        </mesh>
      </group>
    </Float>
  );
};

const JerseyHeroScene = () => {
  const pointer = useRef({ x: 0, y: 0 });

  return (
    <div
      className="h-[420px] w-full"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        pointer.current.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        pointer.current.y = -((event.clientY - rect.top) / rect.height - 0.5) * 2;
      }}
    >
      <Canvas camera={{ position: [0, 1.1, 5], fov: 42 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 3, 2]} intensity={2.2} color="#2f6bff" />
        <pointLight position={[-2, 1.5, 2]} intensity={12} color="#ff3355" distance={8} />
        <spotLight position={[0, 3.5, 2]} intensity={16} angle={0.35} penumbra={0.6} color="#68c8ff" />
        <JerseyModel pointer={pointer} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default JerseyHeroScene;
