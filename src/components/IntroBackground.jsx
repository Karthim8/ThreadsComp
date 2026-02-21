import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import * as THREE from 'three';

// Custom shader material for the zooming particle effect
class IntroShaderMaterial extends THREE.ShaderMaterial {
    constructor() {
        super({
            uniforms: {
                u_time: { value: 0 },
                u_resolution: { value: new THREE.Vector2() },
            },
            vertexShader: `
                void main() {
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec2 u_resolution;
                uniform float u_time;

                #define PI 3.141592653589793
                #define TAU 6.283185307179586

                const float multiplier = 40.0;
                const float zoomSpeed = 2.5;
                const int layers = 8;

                mat2 rotate2d(float _angle) {
                    return mat2(cos(_angle), sin(_angle),
                               -sin(_angle), cos(_angle));
                }

                float hash(vec2 p) {
                    vec3 p3 = fract(vec3(p.xyx) * vec3(443.897, 441.423, 437.195));
                    p3 += dot(p3, p3.yzx + 19.19);
                    return fract((p3.x + p3.y) * p3.z);
                }

                vec2 hash2(vec2 p) {
                    return vec2(hash(p), hash(p + vec2(37.0, 17.0)));
                }

                vec3 render(vec2 uv, float scale) {
                    vec2 id = floor(uv);
                    vec2 subuv = fract(uv);
                    vec2 rand = hash2(id);
                    float bokeh = abs(scale) * 1.5;

                    float particle = 0.0;

                    // Lower threshold = more particles appear
                    if (length(rand) > 0.8) {
                        vec2 pos = subuv - 0.5;
                        float field = length(pos);

                        // Bright core
                        particle = smoothstep(0.5, 0.0, field) * 1.5;
                        // Soft glow halo
                        particle += smoothstep(0.3, 0.3 * bokeh, field) * 0.8;
                        // Extra bright center sparkle
                        particle += smoothstep(0.08, 0.0, field) * 3.0;
                    }
                    return vec3(particle);
                }

                vec3 renderLayer(int layer, int layers, vec2 uv, inout float opacity) {
                    float scale = mod((u_time + zoomSpeed / float(layers) * float(layer)) / zoomSpeed, -1.0);
                    uv *= 18.0;
                    uv *= scale * scale;
                    uv = rotate2d(u_time / 8.0 + float(layer) * 0.3) * uv;
                    uv += vec2(20.0 + sin(u_time * 0.15 + float(layer)) * 0.5) * float(layer);

                    vec3 pass = render(uv * multiplier, scale) * 0.3;

                    opacity = 1.0 + scale;
                    float _opacity = opacity;

                    float endOpacity = smoothstep(0.0, 0.5, scale * -1.0);
                    opacity += endOpacity;

                    return pass * _opacity * endOpacity;
                }

                void main() {
                    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);

                    vec4 fragcolour = vec4(0.0);

                    uv *= rotate2d(u_time * 0.3);

                    float opacity_sum = 0.5;

                    for (int i = 1; i <= layers; i++) {
                        float layerOpacity = 0.0;
                        vec3 layerColor = renderLayer(i, layers, uv, layerOpacity);

                        // Color tint per layer: cycle through cyan → blue → purple → pink
                        float t = float(i) / float(layers);
                        vec3 tint;
                        if (t < 0.33) {
                            tint = mix(vec3(0.0, 1.0, 1.0), vec3(0.0, 0.5, 1.0), t * 3.0);
                        } else if (t < 0.66) {
                            tint = mix(vec3(0.0, 0.5, 1.0), vec3(0.51, 0.22, 0.93), (t - 0.33) * 3.0);
                        } else {
                            tint = mix(vec3(0.51, 0.22, 0.93), vec3(1.0, 0.0, 0.43), (t - 0.66) * 3.0);
                        }

                        fragcolour += vec4(layerColor * tint * 8.0, 1.0);
                        fragcolour = clamp(fragcolour, 0.0, 8.0);
                        opacity_sum += layerOpacity;
                    }

                    fragcolour *= 1.0 / opacity_sum;

                    // Cinematic bloom: boost bright areas
                    vec3 bloom = max(fragcolour.rgb - 0.3, 0.0) * 1.5;
                    fragcolour.rgb += bloom;

                    // Cinematic vignette (darker at edges)
                    float dist = length(uv);
                    float vignette = 1.0 - smoothstep(0.3, 1.5, dist);
                    fragcolour.rgb *= vignette;

                    // Subtle film grain
                    float grain = hash(uv * u_time * 100.0) * 0.03;
                    fragcolour.rgb += grain;

                    // Slight warm tone shift for cinematic feel
                    fragcolour.r *= 1.05;
                    fragcolour.b *= 1.1;

                    gl_FragColor = fragcolour;
                }
            `,
            depthWrite: false,
            depthTest: false,
        });
    }
}

extend({ IntroShaderMaterial });

function ShaderPlane() {
    const materialRef = useRef();
    const { size } = useThree();

    useEffect(() => {
        if (materialRef.current) {
            materialRef.current.uniforms.u_resolution.value.set(
                size.width * window.devicePixelRatio,
                size.height * window.devicePixelRatio
            );
        }
    }, [size]);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.u_time.value = state.clock.elapsedTime * 0.5;
        }
    });

    return (
        <mesh>
            <planeGeometry args={[2, 2]} />
            <introShaderMaterial ref={materialRef} />
        </mesh>
    );
}

const IntroBackground = () => {
    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
            }}
        >
            <Canvas
                gl={{
                    antialias: false,
                    alpha: false,
                    powerPreference: 'high-performance',
                    stencil: false,
                    depth: false,
                }}
                camera={{ position: [0, 0, 1] }}
                dpr={[0.75, 1.5]}
                style={{ pointerEvents: 'none' }}
            >
                <ShaderPlane />
            </Canvas>
        </div>
    );
};

export default IntroBackground;
