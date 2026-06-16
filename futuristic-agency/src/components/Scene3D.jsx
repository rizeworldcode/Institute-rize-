'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';

// 1. Robot Head & Neck procedurally built
function HumanoidRobot({ mouse }) {
  const headGroupRef = useRef();
  const eyesRef = useRef();
  const leftAntennaRef = useRef();
  const rightAntennaRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Subtle breathing/floating
    if (headGroupRef.current) {
      // Mouse tracking head rotation
      const targetX = (mouse.x * Math.PI) / 8;
      const targetY = (mouse.y * Math.PI) / 8;

      headGroupRef.current.rotation.y = THREE.MathUtils.lerp(headGroupRef.current.rotation.y, targetX, 0.1);
      headGroupRef.current.rotation.x = THREE.MathUtils.lerp(headGroupRef.current.rotation.x, -targetY, 0.1);
      headGroupRef.current.position.y = Math.sin(t * 1.5) * 0.08;
    }

    // Glowing eyes pulse
    if (eyesRef.current) {
      eyesRef.current.material.emissiveIntensity = 1.5 + Math.sin(t * 5) * 0.5;
    }
  });

  return (
    <group ref={headGroupRef} position={[0, 0, 0]}>
      {/* Neck */}
      <mesh position={[0, -1.0, -0.1]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.25, 0.6, 32]} />
        <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Neck Joint Ring */}
      <mesh position={[0, -0.7, -0.1]}>
        <torusGeometry args={[0.22, 0.05, 16, 32]} />
        <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Head / Skull */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.6, 64, 64]} />
        <meshStandardMaterial color="#f3f4f6" metalness={0.8} roughness={0.1} />
      </mesh>

      {/* Glossy Black Face Panel */}
      <mesh position={[0, 0.05, 0.35]} scale={[1, 1.2, 0.8]} castShadow>
        <sphereGeometry args={[0.45, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
        <meshStandardMaterial color="#050505" metalness={0.95} roughness={0.02} />
      </mesh>

      {/* Glowing Neon Blue Visor / Eyes */}
      <mesh ref={eyesRef} position={[0, 0.15, 0.68]}>
        <boxGeometry args={[0.4, 0.05, 0.06]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Ear Mechanical Plates */}
      <mesh position={[0.6, 0, -0.05]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.08, 32]} />
        <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[-0.6, 0, -0.05]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.08, 32]} />
        <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Futuristic Collar Bone / Shoulders */}
      <mesh position={[0, -1.3, -0.1]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.5, 0.25, 0.6]} />
        <meshStandardMaterial color="#e5e7eb" metalness={0.85} roughness={0.1} />
      </mesh>
    </group>
  );
}

// 2. Neon Infinity Loop (using mathematical curve and glowing particle points)
function InfinityLoop() {
  const pointsCount = 200;
  const meshRef = useRef();

  const [positions, colorArray] = useMemo(() => {
    const pos = new Float32Array(pointsCount * 3);
    const colors = new Float32Array(pointsCount * 3);
    
    for (let i = 0; i < pointsCount; i++) {
      // Calculate coordinates on an lemniscate of Gerono (figure-8 curve)
      const t = (i / pointsCount) * Math.PI * 2;
      
      const x = 1.8 * Math.sin(t);
      const y = 0.9 * Math.sin(t) * Math.cos(t);
      const z = 0.8 * Math.cos(t);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Color gradient (neon crimson red to soft purple)
      const ratio = i / pointsCount;
      colors[i * 3] = 1.0; // Red
      colors[i * 3 + 1] = 0.0; // Green
      colors[i * 3 + 2] = 0.3 + ratio * 0.7; // Blue
    }

    return [pos, colors];
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.15;
      meshRef.current.rotation.z = Math.sin(t * 0.5) * 0.1;
      
      // Pulsing energy effect
      const sizes = meshRef.current.geometry.attributes.size;
      if (sizes) {
        const arr = sizes.array;
        for (let i = 0; i < pointsCount; i++) {
          arr[i] = (2 + Math.sin(t * 4 + i * 0.15)) * 0.15;
        }
        sizes.needsUpdate = true;
      }
    }
  });

  const sizeArray = useMemo(() => new Float32Array(pointsCount).fill(0.1), []);

  return (
    <points ref={meshRef} position={[0, 0.1, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colorArray, 3]}
        />
        <bufferAttribute
          ref={(self) => {
            if (self) self.needsUpdate = true;
          }}
          attach="attributes-size"
          args={[sizeArray, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// 3. Dynamic Dust/Floating Particles
function DustParticles() {
  const count = 150;
  const meshRef = useRef();

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sp = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
      sp[i] = 0.05 + Math.random() * 0.1;
    }
    return [pos, sp];
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      const posArr = meshRef.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        // Drift particles slowly upwards
        posArr[i * 3 + 1] += speeds[i] * 0.02;
        // Wrap around boundary
        if (posArr[i * 3 + 1] > 4) {
          posArr[i * 3 + 1] = -4;
        }
        // Small horizontal sway
        posArr[i * 3] += Math.sin(t + i) * 0.002;
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#00f0ff"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Main Canvas Scene Container
export default function Scene3D() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-[10]">
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        shadows
      >
        {/* Futuristic dark ambiance lighting */}
        <ambientLight intensity={0.4} />
        
        {/* Soft cool front light */}
        <pointLight position={[2, 3, 2]} intensity={1.8} color="#00f0ff" />
        
        {/* Soft neon pink backlight for outline highlights */}
        <pointLight position={[-2, -2, -2]} intensity={2.5} color="#ff0055" />
        
        {/* Spotlight highlighting robot skull details */}
        <spotLight
          position={[0, 4, 2]}
          angle={0.3}
          penumbra={1}
          intensity={3}
          castShadow
          shadow-bias={-0.0001}
        />

        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
          <HumanoidRobot mouse={mouse} />
          <InfinityLoop />
        </Float>

        <DustParticles />
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0.5} fade speed={1} />
        
        {/* Add minimal orbit controls only in background space if user interacts directly */}
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}
