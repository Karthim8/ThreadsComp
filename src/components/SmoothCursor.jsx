import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ShootingStarCursor = () => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const mouseRef = useRef({ x: -100, y: -100 });
    const prevMouseRef = useRef({ x: -100, y: -100 });
    const animFrameRef = useRef(null);
    const [cursorPos, setCursorPos] = useState({ x: -100, y: -100, visible: false });
    const [isMobile, setIsMobile] = useState(false);

    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            // Check if device has a coarse pointer (touch) or is small screen
            const isTouch = window.matchMedia('(pointer: coarse)').matches;
            const isSmall = window.innerWidth < 768;
            setIsMobile(isTouch || isSmall);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        // if (isMobile) return; // Allow running on mobile for particles

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const COLORS = [
            { r: 0, g: 217, b: 255 },
            { r: 0, g: 150, b: 255 },
            { r: 131, g: 56, b: 236 },
            { r: 255, g: 0, b: 110 },
            { r: 0, g: 255, b: 163 },
        ];

        class Particle {
            constructor(x, y, speed) {
                const color = COLORS[Math.floor(Math.random() * COLORS.length)];
                this.x = x;
                this.y = y;
                this.r = color.r;
                this.g = color.g;
                this.b = color.b;
                const angle = Math.random() * Math.PI * 2;
                const magnitude = Math.random() * speed * 2 + 0.5;
                this.vx = Math.cos(angle) * magnitude;
                this.vy = Math.sin(angle) * magnitude;
                this.life = 1.0;
                this.decay = Math.random() * 0.02 + 0.015;
                this.size = Math.random() * 3 + 1;
                this.glow = Math.random() * 0.5 + 0.5;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vx *= 0.97;
                this.vy *= 0.97;
                this.vy += 0.02;
                this.life -= this.decay;
            }

            draw(ctx) {
                if (this.life <= 0) return;
                const alpha = this.life * this.glow;
                const size = this.size * this.life;

                ctx.beginPath();
                ctx.arc(this.x, this.y, size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${alpha * 0.15})`;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${alpha})`;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(this.x, this.y, size * 0.4, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
                ctx.fill();
            }
        }

        const spawnParticles = (x, y, px, py) => {
            const dx = x - px;
            const dy = y - py;
            const speed = Math.sqrt(dx * dx + dy * dy);
            const count = Math.min(Math.floor(speed * 0.8) + 2, 25);
            for (let i = 0; i < count; i++) {
                const t = i / count;
                const ppx = px + dx * t;
                const ppy = py + dy * t;
                particlesRef.current.push(new Particle(ppx, ppy, speed * 0.15));
            }
            if (particlesRef.current.length > 1500) {
                particlesRef.current = particlesRef.current.slice(-1200);
            }
        };

        // Mouse events (desktop)
        const handleMouseMove = (e) => {
            if (isMobile) return; // Skip mouse logic on mobile to avoid conflicts
            prevMouseRef.current = { ...mouseRef.current };
            mouseRef.current = { x: e.clientX, y: e.clientY };
            setCursorPos({ x: e.clientX, y: e.clientY, visible: true });
            spawnParticles(e.clientX, e.clientY, prevMouseRef.current.x, prevMouseRef.current.y);
        };

        const handleMouseLeave = () => {
            if (isMobile) return;
            setCursorPos(p => ({ ...p, visible: false }));
        };

        const handleMouseEnter = () => {
            if (isMobile) return;
            setCursorPos(p => ({ ...p, visible: true }));
        };

        // Touch events (mobile) - ADDED BACK
        const handleTouchStart = (e) => {
            const touch = e.touches[0];
            mouseRef.current = { x: touch.clientX, y: touch.clientY };
            prevMouseRef.current = { ...mouseRef.current };
            // Don't set visible: true for the SVG cursor
        };

        const handleTouchMove = (e) => {
            const touch = e.touches[0];
            prevMouseRef.current = { ...mouseRef.current };
            mouseRef.current = { x: touch.clientX, y: touch.clientY };
            // Trigger particles on touch move
            spawnParticles(touch.clientX, touch.clientY, prevMouseRef.current.x, prevMouseRef.current.y);
        };

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particlesRef.current = particlesRef.current.filter(p => p.life > 0);
            for (const p of particlesRef.current) {
                p.update();
                p.draw(ctx);
            }
            animFrameRef.current = requestAnimationFrame(animate);
        };

        const handleClick = (e) => {
            if (isMobile) return;
            // Create a burst of particles on click
            for (let i = 0; i < 20; i++) {
                particlesRef.current.push(new Particle(e.clientX, e.clientY, 12));
            }
        };

        const handleMouseOver = (e) => {
            if (isMobile) return;
            const target = e.target;
            const isClickable = target.closest('a, button, [role="button"], input, select, textarea, .cursor-pointer');
            setIsHovering(!!isClickable);
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('click', handleClick, { passive: true });
        window.addEventListener('mouseover', handleMouseOver, { passive: true });
        document.body.addEventListener('mouseleave', handleMouseLeave);
        document.body.addEventListener('mouseenter', handleMouseEnter);

        // Add Touch Listeners
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });

        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('click', handleClick);
            window.removeEventListener('mouseover', handleMouseOver);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
            document.body.removeEventListener('mouseenter', handleMouseEnter);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animFrameRef.current);
        };
    }, [isMobile]);



    // if (isMobile) return null; // Removed early return

    return (
        <>
            {/* Hide default cursor only on Desktop */}
            {!isMobile && <style>{`* { cursor: none !important; }`}</style>}

            {/* Particle trail canvas - Visible on all devices */}
            <canvas
                ref={canvasRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 99999,
                    pointerEvents: 'none',
                }}
            />

            {/* Cursor arrow - Visible only on Desktop */}
            {!isMobile && cursorPos.visible && (
                <div
                    style={{
                        position: 'fixed',
                        left: cursorPos.x,
                        top: cursorPos.y,
                        zIndex: 100000,
                        pointerEvents: 'none',
                        transform: `translate(-4px, -4px) scale(${isHovering ? 1.5 : 1})`,
                        transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    }}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{
                            filter: isHovering
                                ? 'drop-shadow(0 0 8px rgba(0,217,255,0.8)) drop-shadow(0 0 16px rgba(0,217,255,0.6))'
                                : 'drop-shadow(0 0 6px rgba(0,217,255,0.6)) drop-shadow(0 0 12px rgba(0,217,255,0.4))',
                        }}
                    >
                        <path
                            d="M5 3L19 12L12 13L9 20L5 3Z"
                            fill={isHovering ? "#00F3FF" : "#00D9FF"}
                            stroke="white"
                            strokeWidth={isHovering ? "1.5" : "1"}
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            )}
        </>
    );
};

export default ShootingStarCursor;
