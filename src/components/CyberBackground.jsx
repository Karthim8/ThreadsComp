import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// ============================================================
// CUSTOM GLSL MATERIAL — Gradient glow with soft edge fade
// ============================================================
class GlowCurveMaterial extends THREE.ShaderMaterial {
    constructor() {
        super({
            uniforms: {
                uTime: { value: 0 },
                uColor1: { value: new THREE.Color('#00D9FF') },
                uColor2: { value: new THREE.Color('#0044FF') },
                uColor3: { value: new THREE.Color('#8338EC') },
                uOpacity: { value: 1.0 },
                uGlowIntensity: { value: 1.5 },
                uNoiseScale: { value: 2.0 },
                uLayerDepth: { value: 0.0 },
            },
            vertexShader: `
        varying vec2 vUv;
        varying float vDepth;
        
        void main() {
          vUv = uv;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vDepth = -mvPosition.z;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
            fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform float uOpacity;
        uniform float uGlowIntensity;
        uniform float uNoiseScale;
        uniform float uLayerDepth;
        
        varying vec2 vUv;
        varying float vDepth;
        
        // simplex noise helper
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }
        
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }
        
        void main() {
          // Gradient along the curve
          float t = vUv.x;
          
          // Mix between 3 colors along the curve
          vec3 color;
          if (t < 0.5) {
            color = mix(uColor1, uColor2, t * 2.0);
          } else {
            color = mix(uColor2, uColor3, (t - 0.5) * 2.0);
          }
          
          // Noise-based opacity variation
          float n = noise(vUv * uNoiseScale + vec2(uTime * 0.1, uTime * 0.05));
          float alpha = smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
          alpha *= (0.4 + 0.6 * n);
          
          // Pulse along curve
          float pulse = sin(t * 6.2831 * 1.5 - uTime * 0.8 + uLayerDepth * 3.0) * 0.4 + 0.6;
          alpha *= pulse;
          
          // Glow intensity - focus more on the center of the tube
          float tubeGlow = pow(1.0 - abs(vUv.y - 0.5) * 2.0, 2.0);
          color *= uGlowIntensity * tubeGlow;
          
          // Depth fade
          float depthFade = smoothstep(120.0, 5.0, vDepth);
          alpha *= depthFade;
          
          // Edge softness along width
          float edgeSoft = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
          alpha *= edgeSoft;
          
          gl_FragColor = vec4(color, alpha * uOpacity);
        }
      `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide,
        });
    }
}

extend({ GlowCurveMaterial });

// ============================================================
// PROCEDURAL CURVE GENERATOR
// ============================================================
function generateCurvePoints(seed, layerIndex) {
    const points = [];
    const numPoints = 8 + Math.floor(seed * 5);
    const spreadX = 40 + layerIndex * 15;
    const spreadY = 12 + layerIndex * 4;
    const spreadZ = 60 + layerIndex * 20;

    for (let i = 0; i < numPoints; i++) {
        const t = i / (numPoints - 1);
        const x = (t - 0.5) * spreadX + Math.sin(seed * 100 + i * 1.5) * 6;
        const y = Math.sin(t * Math.PI * 2.5 + seed * 50) * spreadY * 0.5 + Math.cos(seed * 30 + i) * 3;
        const z = -t * spreadZ + Math.sin(seed * 80 + i * 2) * 8;
        points.push(new THREE.Vector3(x, y, z));
    }

    return points;
}

// ============================================================
// SINGLE FLOWING CURVE — GPU-friendly tube from spline
// ============================================================
function FlowingCurve({ seed, layerIndex, speed, colorSet }) {
    const meshRef = useRef();
    const materialRef = useRef();
    const offsetRef = useRef(Math.random() * 100);

    const { geometry, curveLength } = useMemo(() => {
        const controlPoints = generateCurvePoints(seed, layerIndex);
        const curve = new THREE.CatmullRomCurve3(controlPoints, false, 'catmullrom', 0.5);

        // Create tube geometry from the curve — reduced segments for perf
        const tubeSegments = 60;
        const radius = 0.015 + seed * 0.025;
        const radialSegments = 3;
        const geo = new THREE.TubeGeometry(curve, tubeSegments, radius, radialSegments, false);

        return { geometry: geo, curveLength: curve.getLength() };
    }, [seed, layerIndex]);

    const colors = useMemo(() => {
        const palettes = [
            { c1: '#00D9FF', c2: '#0066FF', c3: '#8338EC' },
            { c1: '#00FFCC', c2: '#00D9FF', c3: '#0066FF' },
            { c1: '#8338EC', c2: '#00D9FF', c3: '#00FFAA' },
            { c1: '#0088FF', c2: '#8338EC', c3: '#FF00AA' },
        ];
        return palettes[colorSet % palettes.length];
    }, [colorSet]);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * speed + offsetRef.current;
        }
        // Slow continuous drift
        if (meshRef.current) {
            meshRef.current.position.z += speed * 0.005;
            // Reset position when curve drifts too far forward
            if (meshRef.current.position.z > 40) {
                meshRef.current.position.z = -60;
            }
        }
    });

    return (
        <mesh ref={meshRef} geometry={geometry} position={[0, 0, -layerIndex * 12]}>
            <glowCurveMaterial
                ref={materialRef}
                uColor1={new THREE.Color(colors.c1)}
                uColor2={new THREE.Color(colors.c2)}
                uColor3={new THREE.Color(colors.c3)}
                uOpacity={0.7 - layerIndex * 0.15}
                uGlowIntensity={2.5 - layerIndex * 0.4}
                uLayerDepth={layerIndex}
            />
        </mesh>
    );
}

// ============================================================
// FLOATING PARTICLES — Neural signal dots
// ============================================================
function NeuralParticles({ count = 200 }) {
    const meshRef = useRef();
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const particles = useMemo(() => {
        const arr = [];
        for (let i = 0; i < count; i++) {
            arr.push({
                position: new THREE.Vector3(
                    (Math.random() - 0.5) * 80,
                    (Math.random() - 0.5) * 30,
                    (Math.random() - 0.5) * 100
                ),
                speed: 0.01 + Math.random() * 0.03,
                phase: Math.random() * Math.PI * 2,
                scale: 0.02 + Math.random() * 0.06,
            });
        }
        return arr;
    }, [count]);

    useFrame((state) => {
        const time = state.clock.elapsedTime;
        particles.forEach((p, i) => {
            // Slow drift
            p.position.z += p.speed;
            if (p.position.z > 50) p.position.z = -50;

            // Subtle oscillation
            const yOff = Math.sin(time * 0.4 + p.phase) * 0.03;

            dummy.position.set(p.position.x, p.position.y + yOff, p.position.z);
            const pulse = 0.6 + Math.sin(time * 0.8 + p.phase) * 0.4;
            dummy.scale.setScalar(p.scale * pulse);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[null, null, count]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial
                color="#00D9FF"
                transparent
                opacity={0.6}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </instancedMesh>
    );
}

// ============================================================
// CAMERA RIG — slow forward + lateral drift + depth breathing
// ============================================================
function CameraRig() {
    const { camera } = useThree();
    const scrollRef = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            scrollRef.current = window.scrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // Very slow forward movement
        camera.position.z = 5 + Math.sin(time * 0.03) * 2;

        // Slight lateral drift
        camera.position.x = Math.sin(time * 0.05) * 1.5;

        // Subtle vertical breathing
        camera.position.y = Math.sin(time * 0.04) * 0.8;

        // Scroll parallax offset (tiny)
        const scrollOffset = scrollRef.current * 0.002;
        camera.position.y -= scrollOffset;

        // Always look slightly ahead
        camera.lookAt(0, 0, -10);
    });

    return null;
}

// ============================================================
// SCENE — all curve layers combined
// ============================================================
function CyberScene() {
    const curves = useMemo(() => {
        const arr = [];
        // 2 layers — lightweight for GPU stability
        const layers = [
            { count: 3, speed: 0.8, depthIndex: 0 },   // foreground
            { count: 3, speed: 0.4, depthIndex: 1 },   // background
        ];

        layers.forEach(layer => {
            for (let i = 0; i < layer.count; i++) {
                const seed = (i + layer.depthIndex * 100) * 0.1234 + 0.01;
                arr.push({
                    key: `curve-${layer.depthIndex}-${i}`,
                    seed: seed % 1,
                    layerIndex: layer.depthIndex,
                    speed: layer.speed,
                    colorSet: i % 4,
                });
            }
        });

        return arr;
    }, []);

    return (
        <>
            {/* Ambient scene light */}
            <ambientLight intensity={0.05} />

            {/* All flowing curves */}
            {curves.map(c => (
                <FlowingCurve
                    key={c.key}
                    seed={c.seed}
                    layerIndex={c.layerIndex}
                    speed={c.speed}
                    colorSet={c.colorSet}
                />
            ))}

            {/* Neural particles floating */}
            <NeuralParticles count={20} />

            {/* Camera system */}
            <CameraRig />
        </>
    );
}
// ============================================================
// MAIN EXPORT — Canvas with fixed positioning
// ============================================================
const CyberBackground = () => {
    const location = useLocation();
    const [contextLost, setContextLost] = useState(false);
    const failCountRef = useRef(0);
    const [permanentFallback, setPermanentFallback] = useState(false);

    // Automatic recovery logic — max 2 retries then permanent CSS fallback
    useEffect(() => {
        if (contextLost && !permanentFallback) {
            failCountRef.current += 1;
            if (failCountRef.current >= 2) {
                console.warn('Neural Uplink permanently severed — switching to CSS fallback.');
                setPermanentFallback(true);
                return;
            }
            const timer = setTimeout(() => {
                console.log(`Attempting Neural Re-link... (attempt ${failCountRef.current})`);
                setContextLost(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [contextLost, permanentFallback]);

    // Hide the background on the intro page to give video full resources
    if (location.pathname === '/') {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-0 pointer-events-none"
            style={{
                background: 'linear-gradient(180deg, #030014 0%, #0a0020 30%, #000510 70%, #000000 100%)',
            }}
        >
            {/* CSS Fallback — always visible as base layer */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-neon-purple/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* WebGL Canvas — only if GPU is healthy */}
            {!permanentFallback && (
                <AnimatePresence>
                    {!contextLost && (
                        <motion.div
                            key="neural-grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full"
                        >
                            <Canvas
                                gl={{
                                    antialias: false,
                                    alpha: true,
                                    powerPreference: 'default',
                                    stencil: false,
                                    depth: true,
                                }}
                                onCreated={(state) => {
                                    const gl = state.gl.getContext();
                                    const canvas = gl.canvas;

                                    const handleContextLost = (e) => {
                                        e.preventDefault();
                                        console.warn('Neural Uplink Severed: GPU Restricting Access');
                                        setContextLost(true);
                                    };

                                    canvas.addEventListener('webglcontextlost', handleContextLost, false);

                                    return () => {
                                        canvas.removeEventListener('webglcontextlost', handleContextLost);
                                    };
                                }}
                                camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 150 }}
                                dpr={[0.5, 0.75]}
                                style={{ pointerEvents: 'none' }}
                            >
                                <CyberScene />
                            </Canvas>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
};

export default CyberBackground;
