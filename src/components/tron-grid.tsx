"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as React from "react";
import * as THREE from "three";
import { useTheme } from "@/components/theme/theme-provider";

// Convert hex to THREE.Color
function hexToThreeColor(hex: string): THREE.Color {
  return new THREE.Color(hex);
}

// Main 3D scene component
interface TronGrid3DProps {
  className?: string;
  enableParticles?: boolean;
  enableBeams?: boolean;
  cameraAnimation?: boolean;
  entropy?: number;
}

// Update sub-components to handle entropy
function GridFloor({
  color,
  entropy = 0,
}: {
  color: string;
  entropy?: number;
}) {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const materialRef = React.useRef<THREE.ShaderMaterial>(null);

  const colorRef = React.useRef(color);
  colorRef.current = color;

  const uniforms = React.useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: hexToThreeColor(color) },
      uEntropy: { value: 0 },
    }),
    [color],
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uColor.value.set(colorRef.current);
      materialRef.current.uniforms.uEntropy.value = entropy / 100;
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float uTime;
    uniform float uEntropy;

    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Glitch distortion based on entropy
      if (uEntropy > 0.5) {
        float noise = sin(pos.x * 10.0 + uTime * 5.0) * cos(pos.z * 10.0 + uTime * 3.0);
        pos.y += noise * (uEntropy - 0.5) * 2.0;
      }
      
      vPosition = pos;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uEntropy;
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      vec2 grid = abs(fract(vPosition.xz * 0.5 - 0.5) - 0.5) / fwidth(vPosition.xz * 0.5);
      
      // Distort grid lines as entropy increases
      if (uEntropy > 0.3) {
        grid.x += sin(vPosition.z * 0.5 + uTime) * (uEntropy - 0.3);
      }

      float line = min(grid.x, grid.y);
      float gridLine = 1.0 - min(line, 1.0);

      float dist = length(vPosition.xz) / 50.0;
      float fade = 1.0 - smoothstep(0.0, 1.0, dist);

      float pulse = sin(uTime * 2.0 - length(vPosition.xz) * 0.3) * 0.2 + 0.8;
      
      // Intensity increases with entropy
      float intensity = 0.6 + (uEntropy * 0.4);

      float alpha = gridLine * fade * pulse * intensity;

      gl_FragColor = vec4(uColor, alpha);
    }
  `;

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[100, 100, 100, 100]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// Floating particles
function Particles({ color, count = 100 }: { color: string; count?: number }) {
  const pointsRef = React.useRef<THREE.Points>(null);
  const geometryRef = React.useRef<THREE.BufferGeometry>(null);

  const particlesPosition = React.useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = Math.random() * 20 - 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return positions;
  }, [count]);

  React.useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.setAttribute(
        "position",
        new THREE.BufferAttribute(particlesPosition, 3),
      );
    }
  }, [particlesPosition]);

  useFrame((state) => {
    if (pointsRef.current && geometryRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      const positionAttr = geometryRef.current.attributes.position;
      if (positionAttr) {
        const positions = positionAttr.array as Float32Array;
        for (let i = 0; i < count; i++) {
          positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002;
        }
        positionAttr.needsUpdate = true;
      }
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef} />
      <pointsMaterial
        color={color}
        size={0.05}
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// Light beam effect
function LightBeam({
  color,
  position,
}: {
  color: string;
  position: [number, number, number];
}) {
  const beamRef = React.useRef<THREE.Mesh>(null);
  const materialRef = React.useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.opacity =
        0.3 + Math.sin(state.clock.elapsedTime * 3 + position[0]) * 0.2;
    }
  });

  return (
    <mesh ref={beamRef} position={position}>
      <cylinderGeometry args={[0.02, 0.02, 20, 8]} />
      <meshBasicMaterial
        ref={materialRef}
        color={color}
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

function CameraController({ entropy = 0 }: { entropy?: number }) {
  const { camera } = useThree();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const entropyFactor = entropy / 100;

    // Camera gets more jittery with entropy
    const jitter =
      entropyFactor > 0.7
        ? (Math.random() - 0.5) * (entropyFactor - 0.7) * 2
        : 0;

    camera.position.x = Math.sin(time * 0.1) * 2 + jitter;
    camera.position.y = 5 + Math.sin(time * 0.2) * (1 + entropyFactor * 2);
    camera.position.z = 10 + Math.cos(time * 0.1) * 2 + jitter;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export function TronGrid3D({
  className,
  enableParticles = true,
  enableBeams = true,
  cameraAnimation = true,
  entropy = 0,
}: TronGrid3DProps) {
  const { theme } = useTheme();

  const themeColors: Record<string, string> = {
    ares: "#ff3333",
    tron: "#00d4ff",
    clu: "#ff6600",
    athena: "#ffd700",
    aphrodite: "#ff1493",
    poseidon: "#0066ff",
  };

  const color = themeColors[theme] || themeColors.ares;

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 5, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent", pointerEvents: "none" }}
      >
        <fog attach="fog" args={["#000", 10, 50]} />

        {cameraAnimation && <CameraController entropy={entropy} />}

        <GridFloor color={color} entropy={entropy} />

        {enableParticles && (
          <Particles color={color} count={150 + Math.floor(entropy)} />
        )}

        {enableBeams && (
          <>
            <LightBeam color={color} position={[-8, 8, -5]} />
            <LightBeam color={color} position={[8, 8, -8]} />
            <LightBeam color={color} position={[0, 8, -12]} />
            <LightBeam color={color} position={[-5, 8, 5]} />
            <LightBeam color={color} position={[5, 8, 3]} />
          </>
        )}

        <ambientLight intensity={0.1} />
        <pointLight
          position={[0, 10, 0]}
          color={color}
          intensity={2 + entropy / 20}
        />
      </Canvas>
    </div>
  );
}
