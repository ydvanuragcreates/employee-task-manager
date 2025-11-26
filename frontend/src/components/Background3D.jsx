import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Particle Network Component
function ParticleNetwork() {
  const groupRef = useRef();
  const linesRef = useRef();
  
  // Generate particle positions
  const particles = useMemo(() => {
    const count = 120;
    const positions = new Float32Array(count * 3);
    const spread = 15;
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
    }
    
    return { positions, count };
  }, []);

  // Animation loop
  useFrame((state) => {
    if (groupRef.current) {
      // Slow rotation
      groupRef.current.rotation.y += 0.0005;
      groupRef.current.rotation.x += 0.0002;
    }

    // Update particle connections
    if (linesRef.current) {
      const positions = particles.positions;
      const linePositions = [];
      const maxDistance = 3.5;

      for (let i = 0; i < particles.count; i++) {
        for (let j = i + 1; j < particles.count; j++) {
          const dx = positions[i * 3] - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < maxDistance) {
            linePositions.push(
              positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
              positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
            );
          }
        }
      }

      linesRef.current.geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array(linePositions), 3)
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.count}
            array={particles.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#94a3b8"
          sizeAttenuation={true}
          transparent={true}
          opacity={0.6}
        />
      </points>

      {/* Connection Lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial
          color="#cbd5e1"
          transparent={true}
          opacity={0.15}
        />
      </lineSegments>
    </group>
  );
}

// Main Background3D Component
export default function Background3D() {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <ParticleNetwork />
      </Canvas>
    </div>
  );
}
