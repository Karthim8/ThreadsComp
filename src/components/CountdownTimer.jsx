import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Zap } from 'lucide-react';

const CountdownTimer = ({ targetDate = '2026-03-05T00:00:00', compact = false }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const target = new Date(targetDate).getTime();
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = target - now;
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000),
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    const totalDays = 60;
    const progress = Math.max(0, Math.min(100, ((totalDays - timeLeft.days) / totalDays) * 100));

    if (compact) {
        return (
            <div className="w-full max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="uiverse-card relative w-full p-8 md:p-12 overflow-hidden rounded-[20px]"
                >
                    <div className="relative z-10">
                        <div className="text-center mb-3">
                            <h3 className="text-sm md:text-lg font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-[#FF006E] flex items-center justify-center gap-2">
                                <Zap className="text-[#00D9FF]" size={16} />
                                Registration Ends In
                                <Zap className="text-[#FF006E]" size={16} />
                            </h3>
                        </div>
                        <div className="grid grid-cols-4 gap-2 md:gap-4">
                            <CompactHUDUnit value={timeLeft.days} label="DAYS" variant={0} />
                            <CompactHUDUnit value={timeLeft.hours} label="HRS" variant={1} />
                            <CompactHUDUnit value={timeLeft.minutes} label="MIN" variant={2} />
                            <CompactHUDUnit value={timeLeft.seconds} label="SEC" variant={3} />
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto py-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex items-center justify-center gap-3 bg-gradient-to-r from-red-500/20 via-red-500/10 to-red-500/20 border border-red-500/50 rounded-lg px-6 py-3 backdrop-blur-sm"
            >
                <Calendar className="text-red-400" size={20} />
                <span className="text-red-300 font-orbitron text-sm md:text-base tracking-wider">
                    5th & 6th March, 2026
                </span>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="uiverse-card relative w-full p-8 md:p-12 overflow-hidden rounded-[20px]"
            >
                <div className="relative z-10">
                    <div className="text-center mb-10">
                        <h3 className="text-2xl md:text-3xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-[#FF006E] flex items-center justify-center gap-3">
                            <Zap className="text-[#00D9FF]" size={28} />
                            Registration Ends In
                            <Zap className="text-[#FF006E]" size={28} />
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-10">
                        {/* Style 1: Rotating Ring Dial */}
                        <HUDRingUnit value={timeLeft.days} label="DAYS" />
                        {/* Style 2: Grid Frame Box */}
                        <HUDGridUnit value={timeLeft.hours} label="HOURS" />
                        {/* Style 3: Crosshair Reticle */}
                        <HUDCrosshairUnit value={timeLeft.minutes} label="MINUTES" />
                        {/* Style 4: Scan-line Glitch */}
                        <HUDGlitchUnit value={timeLeft.seconds} label="SECONDS" />
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2 max-w-3xl mx-auto">
                        <div className="flex justify-between items-center text-sm font-orbitron">
                            <span className="text-[#00D9FF]">Event Progress</span>
                            <span className="text-white font-bold">{progress.toFixed(0)}%</span>
                        </div>
                        <div className="h-3 bg-[#001a2e] rounded-full border border-[#00D9FF]/30 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-[#00D9FF] via-[#8338EC] to-[#FF006E] relative"
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </motion.div>
                        </div>
                    </div>
                </div>
                <style>{`
                    .uiverse-card {
                        position: relative;
                        background: #07182E;
                        display: flex;
                        place-content: center;
                        place-items: center;
                    }

                    .uiverse-card::before {
                        content: '';
                        position: absolute;
                        width: 150px;
                        background-image: linear-gradient(180deg, rgb(0, 183, 255), rgb(255, 48, 255));
                        height: 500%;
                        animation: rotBGimg 3s linear infinite;
                        transition: all 0.2s linear;
                        z-index: 0;
                    }

                    @keyframes rotBGimg {
                        from {
                            transform: rotate(0deg);
                        }
                        to {
                            transform: rotate(360deg);
                        }
                    }

                    .uiverse-card::after {
                        content: '';
                        position: absolute;
                        background: #07182E;
                        inset: 4px;
                        border-radius: 16px;
                        z-index: 1;
                    }

                    .uiverse-card > * {
                        position: relative;
                        z-index: 2;
                    }
                `}</style>
            </motion.div>
        </div>
    );
};

/* ==========================================
   STYLE 1: Rotating Ring Dial (Days)
   ========================================== */
const HUDRingUnit = ({ value, label }) => {
    const displayVal = String(value).padStart(2, '0');

    return (
        <motion.div whileHover={{ scale: 1.05 }} className="relative flex flex-col items-center">
            <div className="relative w-32 h-32 md:w-40 md:h-40">
                {/* Outer rotating ring */}
                <svg className="absolute inset-0 w-full h-full animate-[spin_20s_linear_infinite]" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="92" fill="none" stroke="#00D9FF" strokeWidth="1" strokeDasharray="8 6" opacity="0.4" />
                    {/* Tick marks */}
                    {Array.from({ length: 60 }).map((_, i) => {
                        const angle = (i * 6) * Math.PI / 180;
                        const r1 = i % 5 === 0 ? 82 : 86;
                        const r2 = 90;
                        return (
                            <line key={i}
                                x1={100 + r1 * Math.cos(angle)} y1={100 + r1 * Math.sin(angle)}
                                x2={100 + r2 * Math.cos(angle)} y2={100 + r2 * Math.sin(angle)}
                                stroke="#00D9FF" strokeWidth={i % 5 === 0 ? 2 : 0.5} opacity={i % 5 === 0 ? 0.8 : 0.3}
                            />
                        );
                    })}
                </svg>

                {/* Inner counter-rotating ring */}
                <svg className="absolute inset-0 w-full h-full animate-[spin_15s_linear_infinite_reverse]" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="75" fill="none" stroke="#00D9FF" strokeWidth="1.5" strokeDasharray="20 10 5 10" opacity="0.3" />
                </svg>

                {/* Static inner circle */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="65" fill="none" stroke="#00D9FF" strokeWidth="0.5" opacity="0.2" />
                    <circle cx="100" cy="100" r="55" fill="rgba(0,217,255,0.03)" stroke="none" />
                    {/* "COUNTDOWN NUMBER" arc text simulation */}
                    <text x="100" y="58" textAnchor="middle" fill="#00D9FF" fontSize="7" fontFamily="monospace" opacity="0.5" letterSpacing="2">
                        COUNTDOWN
                    </text>
                </svg>

                {/* Number */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl md:text-5xl font-bold font-orbitron text-white"
                        style={{
                            textShadow: '0 0 20px rgba(0,217,255,0.8), 0 0 40px rgba(0,217,255,0.4), 0 0 80px rgba(0,217,255,0.2)',
                        }}>
                        {displayVal}
                    </span>
                </div>
                {/* Corner Decorations */}
                <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-[#00D9FF] flex items-start justify-start p-1">
                    <div className="w-1 h-1 bg-[#00D9FF]"></div>
                </div>
                <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-[#00D9FF] flex items-start justify-end p-1">
                    <div className="w-1 h-1 bg-[#00D9FF]"></div>
                </div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-[#00D9FF] flex items-end justify-start p-1">
                    <div className="w-1 h-1 bg-[#00D9FF]"></div>
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-[#00D9FF] flex items-end justify-end p-1">
                    <div className="w-1 h-1 bg-[#00D9FF]"></div>
                </div>

                {/* Cyberpunk Background Grid */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(0, 217, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 217, 255, 0.3) 1px, transparent 1px)',
                        backgroundSize: '30px 30px'
                    }}
                ></div>

                {/* System Status Text */}
                <div className="absolute top-4 left-0 w-full flex justify-between px-8 text-[8px] md:text-[10px] font-mono text-[#00D9FF]/40 tracking-widest pointer-events-none select-none">
                    <span>SYS.STATUS: ONLINE</span>
                    <span>SECURE_CONN: <span className="text-neon-green">ACTIVE</span></span>
                    <span>ID: T-26-X</span>
                </div>
            </div>
            <span className="mt-3 text-xs font-orbitron tracking-[0.3em] text-[#00D9FF]/60">{label}</span>
        </motion.div>
    );
};

/* ==========================================
   STYLE 2: Grid Frame Box (Hours)
   ========================================== */
const HUDGridUnit = ({ value, label }) => {
    const displayVal = String(value).padStart(2, '0');

    return (
        <motion.div whileHover={{ scale: 1.05 }} className="relative flex flex-col items-center">
            <div className="relative w-32 h-32 md:w-40 md:h-40">
                {/* Grid background */}
                <div className="absolute inset-4 opacity-10"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(0,217,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,0.5) 1px, transparent 1px)',
                        backgroundSize: '12px 12px',
                    }}
                />

                {/* Outer octagon frame */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                    <polygon
                        points="60,10 140,10 190,60 190,140 140,190 60,190 10,140 10,60"
                        fill="none" stroke="#00D9FF" strokeWidth="1.5" opacity="0.3"
                    />
                    <polygon
                        points="70,25 130,25 175,70 175,130 130,175 70,175 25,130 25,70"
                        fill="none" stroke="#00D9FF" strokeWidth="0.5" opacity="0.15"
                    />
                </svg>

                {/* Corner brackets */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                    {/* Top-left */}
                    <polyline points="20,50 20,20 50,20" fill="none" stroke="#00D9FF" strokeWidth="2.5" opacity="0.8" />
                    {/* Top-right */}
                    <polyline points="150,20 180,20 180,50" fill="none" stroke="#00D9FF" strokeWidth="2.5" opacity="0.8" />
                    {/* Bottom-right */}
                    <polyline points="180,150 180,180 150,180" fill="none" stroke="#00D9FF" strokeWidth="2.5" opacity="0.8" />
                    {/* Bottom-left */}
                    <polyline points="50,180 20,180 20,150" fill="none" stroke="#00D9FF" strokeWidth="2.5" opacity="0.8" />

                    {/* Small corner dots */}
                    <circle cx="20" cy="20" r="2" fill="#00D9FF" opacity="0.6" />
                    <circle cx="180" cy="20" r="2" fill="#00D9FF" opacity="0.6" />
                    <circle cx="180" cy="180" r="2" fill="#00D9FF" opacity="0.6" />
                    <circle cx="20" cy="180" r="2" fill="#00D9FF" opacity="0.6" />
                </svg>

                {/* Number */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl md:text-5xl font-bold font-orbitron text-white"
                        style={{
                            textShadow: '0 0 15px rgba(0,217,255,0.6), 0 0 30px rgba(0,217,255,0.3)',
                        }}>
                        {displayVal}
                    </span>
                </div>
            </div>
            <span className="mt-3 text-xs font-orbitron tracking-[0.3em] text-[#00D9FF]/60">{label}</span>
        </motion.div>
    );
};

/* ==========================================
   STYLE 3: Crosshair Reticle (Minutes)
   ========================================== */
const HUDCrosshairUnit = ({ value, label }) => {
    const displayVal = String(value).padStart(2, '0');

    return (
        <motion.div whileHover={{ scale: 1.05 }} className="relative flex flex-col items-center">
            <div className="relative w-32 h-32 md:w-40 md:h-40">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                    {/* Crosshair lines */}
                    <line x1="100" y1="10" x2="100" y2="70" stroke="#00D9FF" strokeWidth="1" opacity="0.5" />
                    <line x1="100" y1="130" x2="100" y2="190" stroke="#00D9FF" strokeWidth="1" opacity="0.5" />
                    <line x1="10" y1="100" x2="70" y2="100" stroke="#00D9FF" strokeWidth="1" opacity="0.5" />
                    <line x1="130" y1="100" x2="190" y2="100" stroke="#00D9FF" strokeWidth="1" opacity="0.5" />

                    {/* Center crosshair gap extensions */}
                    <line x1="90" y1="100" x2="80" y2="100" stroke="#00D9FF" strokeWidth="1.5" opacity="0.8" />
                    <line x1="110" y1="100" x2="120" y2="100" stroke="#00D9FF" strokeWidth="1.5" opacity="0.8" />
                    <line x1="100" y1="90" x2="100" y2="80" stroke="#00D9FF" strokeWidth="1.5" opacity="0.8" />
                    <line x1="100" y1="110" x2="100" y2="120" stroke="#00D9FF" strokeWidth="1.5" opacity="0.8" />

                    {/* End markers on crosshair lines */}
                    <line x1="95" y1="10" x2="105" y2="10" stroke="#00D9FF" strokeWidth="1.5" opacity="0.6" />
                    <line x1="95" y1="190" x2="105" y2="190" stroke="#00D9FF" strokeWidth="1.5" opacity="0.6" />
                    <line x1="10" y1="95" x2="10" y2="105" stroke="#00D9FF" strokeWidth="1.5" opacity="0.6" />
                    <line x1="190" y1="95" x2="190" y2="105" stroke="#00D9FF" strokeWidth="1.5" opacity="0.6" />

                    {/* Diagonal lines */}
                    <line x1="30" y1="30" x2="60" y2="60" stroke="#00D9FF" strokeWidth="0.5" opacity="0.3" />
                    <line x1="170" y1="30" x2="140" y2="60" stroke="#00D9FF" strokeWidth="0.5" opacity="0.3" />
                    <line x1="30" y1="170" x2="60" y2="140" stroke="#00D9FF" strokeWidth="0.5" opacity="0.3" />
                    <line x1="170" y1="170" x2="140" y2="140" stroke="#00D9FF" strokeWidth="0.5" opacity="0.3" />

                    {/* Small measurement marks */}
                    {[30, 50, 150, 170].map(pos => (
                        <g key={`h-${pos}`}>
                            <line x1={pos} y1="98" x2={pos} y2="102" stroke="#00D9FF" strokeWidth="0.5" opacity="0.4" />
                        </g>
                    ))}
                    {[30, 50, 150, 170].map(pos => (
                        <g key={`v-${pos}`}>
                            <line x1="98" y1={pos} x2="102" y2={pos} stroke="#00D9FF" strokeWidth="0.5" opacity="0.4" />
                        </g>
                    ))}
                </svg>

                {/* Number */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl md:text-5xl font-bold font-orbitron text-white"
                        style={{
                            textShadow: '0 0 15px rgba(0,217,255,0.6), 0 0 30px rgba(0,217,255,0.3)',
                        }}>
                        {displayVal}
                    </span>
                </div>
            </div>
            <span className="mt-3 text-xs font-orbitron tracking-[0.3em] text-[#00D9FF]/60">{label}</span>
        </motion.div>
    );
};

/* ==========================================
   STYLE 4: Scan-line Glitch (Seconds)
   ========================================== */
const HUDGlitchUnit = ({ value, label }) => {
    const displayVal = String(value).padStart(2, '0');
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        let animId;
        const draw = () => {
            ctx.clearRect(0, 0, w, h);

            // Vertical scan lines
            for (let x = 0; x < w; x += 3) {
                const alpha = 0.03 + Math.random() * 0.04;
                ctx.strokeStyle = `rgba(0, 217, 255, ${alpha})`;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }

            // Horizontal glitch bars
            const barCount = 2 + Math.floor(Math.random() * 3);
            for (let i = 0; i < barCount; i++) {
                const y = Math.random() * h;
                const barH = 1 + Math.random() * 2;
                ctx.fillStyle = `rgba(0, 217, 255, ${0.05 + Math.random() * 0.08})`;
                ctx.fillRect(0, y, w, barH);
            }

            animId = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(animId);
    }, []);

    return (
        <motion.div whileHover={{ scale: 1.05 }} className="relative flex flex-col items-center">
            <div className="relative w-32 h-32 md:w-40 md:h-40 overflow-hidden">
                {/* Scan-line canvas background */}
                <canvas ref={canvasRef} width={160} height={160}
                    className="absolute inset-0 w-full h-full" />

                {/* Vertical border lines */}
                <div className="absolute left-2 top-4 bottom-4 w-[1px] bg-gradient-to-b from-transparent via-[#00D9FF]/40 to-transparent"></div>
                <div className="absolute right-2 top-4 bottom-4 w-[1px] bg-gradient-to-b from-transparent via-[#00D9FF]/40 to-transparent"></div>

                {/* Number with glitch offset */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Glitch shadow layers */}
                    <span className="absolute text-4xl md:text-5xl font-bold font-orbitron text-[#00D9FF]/20"
                        style={{
                            transform: 'translate(2px, -1px)',
                            filter: 'blur(1px)',
                        }}>
                        {displayVal}
                    </span>
                    <span className="absolute text-4xl md:text-5xl font-bold font-orbitron text-[#FF006E]/15"
                        style={{
                            transform: 'translate(-2px, 1px)',
                            filter: 'blur(1px)',
                        }}>
                        {displayVal}
                    </span>
                    {/* Main number */}
                    <span className="relative text-4xl md:text-5xl font-bold font-orbitron text-[#00D9FF]"
                        style={{
                            textShadow: '0 0 10px rgba(0,217,255,0.8), 0 0 20px rgba(0,217,255,0.4), 0 0 60px rgba(0,217,255,0.2)',
                            animation: 'hud-flicker 3s infinite',
                        }}>
                        {displayVal}
                    </span>
                </div>

                {/* Top/bottom data lines */}
                <div className="absolute top-2 left-4 right-4 flex justify-between">
                    <span className="text-[6px] font-mono text-[#00D9FF]/30">SYS.TIME</span>
                    <span className="text-[6px] font-mono text-[#00D9FF]/30">0x{value.toString(16).toUpperCase()}</span>
                </div>
                <div className="absolute bottom-2 left-4 right-4 flex justify-between">
                    <span className="text-[6px] font-mono text-[#00D9FF]/30">SYNC</span>
                    <span className="text-[6px] font-mono text-[#00D9FF]/30 animate-pulse">●</span>
                </div>
            </div>
            <span className="mt-3 text-xs font-orbitron tracking-[0.3em] text-[#00D9FF]/60">{label}</span>

            <style>{`
                @keyframes hud-flicker {
                    0%, 100% { opacity: 1; }
                    92% { opacity: 1; }
                    93% { opacity: 0.7; }
                    94% { opacity: 1; }
                    96% { opacity: 0.8; }
                    97% { opacity: 1; }
                }
            `}</style>
        </motion.div>
    );
};

/* ==========================================
   Compact HUD Units (for hero section)
   ========================================== */
const CompactHUDUnit = ({ value, label, variant }) => {
    const displayVal = String(value).padStart(2, '0');

    const styles = [
        // Ring style
        { border: '2px solid rgba(0,217,255,0.3)', borderRadius: '50%' },
        // Grid style
        { border: '1px solid rgba(0,217,255,0.2)', clipPath: 'polygon(10% 0,90% 0,100% 10%,100% 90%,90% 100%,10% 100%,0 90%,0 10%)' },
        // Crosshair style
        { border: '1px solid rgba(0,217,255,0.2)' },
        // Glitch style
        { border: '1px solid rgba(0,217,255,0.15)', background: 'linear-gradient(180deg, rgba(0,217,255,0.05) 0%, transparent 100%)' },
    ];

    return (
        <div className="relative flex flex-col items-center">
            <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center"
                style={styles[variant]}>
                {/* Compact decorations */}
                {variant === 0 && (
                    <svg className="absolute inset-0 w-full h-full animate-[spin_20s_linear_infinite]" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="36" fill="none" stroke="#00D9FF" strokeWidth="0.5" strokeDasharray="4 3" opacity="0.4" />
                    </svg>
                )}
                {variant === 2 && (
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 80">
                        <line x1="40" y1="2" x2="40" y2="18" stroke="#00D9FF" strokeWidth="0.5" opacity="0.3" />
                        <line x1="40" y1="62" x2="40" y2="78" stroke="#00D9FF" strokeWidth="0.5" opacity="0.3" />
                        <line x1="2" y1="40" x2="18" y2="40" stroke="#00D9FF" strokeWidth="0.5" opacity="0.3" />
                        <line x1="62" y1="40" x2="78" y2="40" stroke="#00D9FF" strokeWidth="0.5" opacity="0.3" />
                    </svg>
                )}

                <span className="text-xl md:text-2xl font-bold font-orbitron text-white relative z-10"
                    style={{ textShadow: '0 0 10px rgba(0,217,255,0.6)' }}>
                    {displayVal}
                </span>
            </div>
            <span className="text-[7px] md:text-[9px] font-orbitron tracking-widest text-[#00D9FF]/50 mt-1.5">{label}</span>
        </div>
    );
};

export default CountdownTimer;
