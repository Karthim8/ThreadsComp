import { useEffect, useRef } from 'react';

const MechaBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        let robots = [];
        let hexagons = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        };

        // Particle class for floating dots
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.color = ['#00D9FF', '#FF006E', '#8338EC', '#00FFA3'][Math.floor(Math.random() * 4)];
                this.opacity = Math.random() * 0.5 + 0.3;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }

        // Robot silhouette class
        class Robot {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 60 + 40;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.01;
                this.opacity = Math.random() * 0.15 + 0.05;
                this.color = ['#00D9FF', '#FF006E', '#8338EC'][Math.floor(Math.random() * 3)];
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.rotation += this.rotationSpeed;

                if (this.x < -this.size) this.x = canvas.width + this.size;
                if (this.x > canvas.width + this.size) this.x = -this.size;
                if (this.y < -this.size) this.y = canvas.height + this.size;
                if (this.y > canvas.height + this.size) this.y = -this.size;
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.globalAlpha = this.opacity;
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 2;

                // Simple robot shape (geometric)
                const s = this.size;

                // Head
                ctx.strokeRect(-s * 0.2, -s * 0.4, s * 0.4, s * 0.3);

                // Body
                ctx.strokeRect(-s * 0.3, -s * 0.05, s * 0.6, s * 0.5);

                // Arms
                ctx.beginPath();
                ctx.moveTo(-s * 0.3, 0);
                ctx.lineTo(-s * 0.5, s * 0.2);
                ctx.moveTo(s * 0.3, 0);
                ctx.lineTo(s * 0.5, s * 0.2);
                ctx.stroke();

                // Legs
                ctx.beginPath();
                ctx.moveTo(-s * 0.15, s * 0.45);
                ctx.lineTo(-s * 0.15, s * 0.7);
                ctx.moveTo(s * 0.15, s * 0.45);
                ctx.lineTo(s * 0.15, s * 0.7);
                ctx.stroke();

                ctx.globalAlpha = 1;
                ctx.restore();
            }
        }

        // Hexagon class
        class Hexagon {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 30 + 20;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.02;
                this.opacity = Math.random() * 0.2 + 0.05;
                this.color = ['#00D9FF', '#8338EC'][Math.floor(Math.random() * 2)];
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.rotation += this.rotationSpeed;

                if (this.x < -this.size) this.x = canvas.width + this.size;
                if (this.x > canvas.width + this.size) this.x = -this.size;
                if (this.y < -this.size) this.y = canvas.height + this.size;
                if (this.y > canvas.height + this.size) this.y = -this.size;
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.globalAlpha = this.opacity;
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 1.5;

                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI / 3) * i;
                    const x = this.size * Math.cos(angle);
                    const y = this.size * Math.sin(angle);
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.stroke();

                ctx.globalAlpha = 1;
                ctx.restore();
            }
        }

        const init = () => {
            particles = [];
            robots = [];
            hexagons = [];

            // Create particles
            const particleCount = Math.min(window.innerWidth / 8, 150);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }

            // Create robots
            const robotCount = Math.min(window.innerWidth / 200, 8);
            for (let i = 0; i < robotCount; i++) {
                robots.push(new Robot());
            }

            // Create hexagons
            const hexCount = Math.min(window.innerWidth / 100, 15);
            for (let i = 0; i < hexCount; i++) {
                hexagons.push(new Hexagon());
            }
        };

        const animate = () => {
            // Clear with gradient background
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#090011');
            gradient.addColorStop(0.5, '#0a0520');
            gradient.addColorStop(1, '#050010');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add radial glow spots
            const glow1 = ctx.createRadialGradient(canvas.width * 0.2, canvas.height * 0.3, 0, canvas.width * 0.2, canvas.height * 0.3, canvas.width * 0.4);
            glow1.addColorStop(0, 'rgba(0, 217, 255, 0.05)');
            glow1.addColorStop(1, 'transparent');
            ctx.fillStyle = glow1;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const glow2 = ctx.createRadialGradient(canvas.width * 0.8, canvas.height * 0.7, 0, canvas.width * 0.8, canvas.height * 0.7, canvas.width * 0.4);
            glow2.addColorStop(0, 'rgba(255, 0, 110, 0.05)');
            glow2.addColorStop(1, 'transparent');
            ctx.fillStyle = glow2;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw and update hexagons (background layer)
            hexagons.forEach(hex => {
                hex.update();
                hex.draw();
            });

            // Draw and update robots (middle layer)
            robots.forEach(robot => {
                robot.update();
                robot.draw();
            });

            // Draw connections between nearby particles
            particles.forEach((p, i) => {
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.beginPath();
                        const opacity = (1 - distance / 120) * 0.3;
                        ctx.strokeStyle = `rgba(0, 217, 255, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });

            // Draw and update particles (foreground layer)
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 bg-[#090011]" />;
};

export default MechaBackground;
