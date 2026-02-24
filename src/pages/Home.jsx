import { useEffect, useState, useRef } from 'react';
import CountdownTimer from '../components/CountdownTimer';
import { motion, AnimatePresence, useInView, animate } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, Clock, Award, Users, Cpu, Zap, Code, Shield, BookOpen, FileText, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';

const FEATURES = [
    {
        icon: <Zap size={50} className="text-neon-cyan drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]" />,
        title: "Futuristic Tech",
        desc: "Experience cutting-edge technology including AI, IoT, and Cyber Security through our workshops."
    },
    {
        icon: <Code size={50} className="text-neon-purple drop-shadow-[0_0_10px_#bc13fe]" />,
        title: "Elite Coding",
        desc: "Compete with the best minds in the country in our national level hackathons and coding contests."
    },
    {
        icon: <Award size={50} className="text-neon-green drop-shadow-[0_0_10px_#00ff9d]" />,
        title: "Win Big",
        desc: "Showcase your skills and win exciting cash prizes and internship opportunities."
    }
];

const Home = () => {
    useEffect(() => {
        const timer = setTimeout(() => {
            Swal.fire({
                title: `
                    <div class="flex flex-col items-center gap-1 font-orbitron mb-2">
                        <span class="text-[9px] text-neon-cyan/60 font-black tracking-[0.4em] uppercase">Security Clearance</span>
                        <h2 class="text-xl font-black text-white tracking-widest uppercase">
                            EVENT <span class="text-neon-cyan text-glow">NOTICE</span>
                        </h2>
                    </div>
                `,
                html: `
                    <div class="flex flex-row gap-4 font-orbitron px-4 py-2">
                        <!-- Logistics Block -->
                        <div class="flex-1 p-[1px] rounded-xl bg-neon-green/30 border border-neon-green/20">
                             <div class="bg-black/80 p-4 rounded-xl flex flex-col items-center text-center gap-2 h-full">
                                <div class="bg-neon-green/10 rounded-full p-2 border border-neon-green/20 shrink-0 shadow-[0_0_10px_rgba(0,255,157,0.1)]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff9d" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="animate-pulse"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                                </div>
                                <div class="flex flex-col items-center">
                                    <p class="text-neon-green text-[9px] font-black tracking-widest mb-1">FOOD & SNACKS</p>
                                    <p class="text-white text-[10px] font-bold uppercase tracking-wide leading-tight px-1">
                                        FEE INCLUDES <br/><span class="text-neon-green">LUNCH & SNACKS</span>
                                    </p>
                                </div>
                             </div>
                        </div>

                        <!-- Advisory Block -->
                        <div class="flex-1 p-[1px] rounded-xl bg-red-500/30 border border-red-500/20">
                             <div class="bg-black/80 p-4 rounded-xl flex flex-col items-center text-center gap-2 h-full">
                                <div class="bg-red-500/10 rounded-full p-2 border border-red-500/20 shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                                </div>
                                <div class="flex flex-col items-center">
                                    <p class="text-red-500 text-[9px] font-black tracking-widest mb-1 uppercase">ADVISORY</p>
                                    <p class="text-white text-[10px] font-bold uppercase tracking-wide leading-tight">
                                        <span class="text-red-400">NO ACCOMMODATION</span><br/>PROVIDED
                                    </p>
                                </div>
                             </div>
                        </div>
                    </div>
                `,
                background: '#0a0a0a',
                padding: '2rem',
                showConfirmButton: true,
                confirmButtonText: 'ACKNOWLEDGE',
                confirmButtonColor: '#00f3ff',
                customClass: {
                    container: 'backdrop-blur-sm bg-black/60',
                    popup: 'border border-white/10 rounded-[2rem] !w-[480px] shadow-[0_0_50px_rgba(0,0,0,1)]',
                    title: 'p-0',
                    htmlContainer: 'p-0 m-0',
                    confirmButton: 'mt-2 font-orbitron font-black text-black px-12 py-3 rounded-lg !bg-neon-cyan hover:!bg-white transition-all duration-300 tracking-[0.2em] text-[10px] shadow-[0_0_20px_rgba(0,243,255,0.3)]'
                },
                buttonsStyling: false,
                allowOutsideClick: false,
                allowEscapeKey: false
            });
        }, 1200);
        return () => clearTimeout(timer);
    }, []);


    return (
        <div className="relative w-full">
            {/* Hero Section */}
            <section className="min-h-[90vh] flex flex-col justify-center items-center text-center px-4 relative overflow-hidden pt-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 mb-6 group"
                >
                    <div className="relative group">
                        <img
                            src="/logo.png"
                            alt="Threads 2026 Logo"
                            className="w-32 h-32 md:w-48 md:h-48 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                            onError={(e) => e.target.style.display = 'none'}
                        />
                    </div>
                </motion.div>



                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 flex flex-col items-center mb-8"
                >
                    <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold font-orbitron mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-neon-cyan to-neon-purple drop-shadow-[0_0_15px_rgba(0,243,255,0.5)] tracking-tighter">
                        THREADS'26
                    </h1>

                    <div className="flex flex-col items-center gap-2">
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 font-orbitron tracking-wider text-center uppercase">
                            A National Level Technical Symposium Organized By
                        </p>
                        <p className="text-neon-cyan text-base sm:text-lg md:text-2xl font-orbitron font-bold text-center uppercase tracking-[0.1em]">
                            Department Of Computer Science And Engineering
                        </p>
                        <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm font-orbitron text-center max-w-3xl px-4 uppercase tracking-[0.1em] opacity-80 leading-relaxed">

                        </p>
                        <p className="text-white text-xs sm:text-sm md:text-lg font-orbitron text-center uppercase tracking-[0.1em] opacity-90 mt-1">
                            (BE. CSE, BE. CSE(AI&ML), BE. CSD, B.TECH.CBE AND BE.CSE(SEC))
                        </p>
                    </div>
                    <div className="w-40 h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent mx-auto mt-8"></div>
                </motion.div>


                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="relative z-10 flex flex-col md:flex-row gap-6 items-center mb-0 text-gray-300 bg-white/5 p-4 rounded-xl border border-white/5 backdrop-blur-sm"
                >
                    <div className="flex items-center gap-3">
                        <Calendar className="text-neon-cyan w-5 h-5" />
                        <span className="font-orbitron text-lg">March 5 & 6 2026</span>
                    </div>
                    <div className="hidden md:block w-px h-8 bg-gray-700"></div>
                    <div className="flex items-center gap-3">
                        <MapPin className="text-neon-purple w-5 h-5" />
                        <span className="font-orbitron text-lg">Sona College of Technology</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="relative z-10 mt-8 mb-8 transform hover:scale-105 transition-transform cursor-default"
                >
                    <div className="flex flex-col items-center bg-black/40 backdrop-blur-md px-10 py-4 rounded-3xl border border-neon-purple/30 shadow-[0_0_50px_rgba(188,19,254,0.2)]">
                        <span className="text-neon-purple font-orbitron font-black text-xl md:text-3xl tracking-[0.2em] drop-shadow-[0_0_10px_#bc13fe]">
                            PRIZE POOL
                        </span>
                        <span className="text-6xl md:text-8xl font-black font-orbitron text-yellow-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)] mt-2 italic tracking-tighter">
                            <AnimatedCounter target={50} suffix="K+" />
                        </span>
                    </div>
                </motion.div>

                {/* Countdown Timer - Compact Version */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="relative z-10 mb-8"
                >
                    <CountdownTimer compact={true} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="relative z-10 flex flex-col sm:flex-row gap-6 w-full sm:w-auto px-4"
                >
                    <Link to="/register" className="group relative px-8 py-4 bg-neon-cyan text-black font-bold font-orbitron text-lg overflow-hidden transition-all hover:scale-105 clip-button">
                        <div className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        <span className="relative flex items-center gap-2">
                            REGISTER NOW <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>
                    <Link to="/events" className="group px-8 py-4 border border-neon-purple text-neon-purple font-bold font-orbitron text-lg hover:bg-neon-purple hover:text-white transition-all hover:shadow-[0_0_20px_#bc13fe] clip-button">
                        EXPLORE EVENTS
                    </Link>
                </motion.div>
            </section>





            {/* Rule Book Teaser */}
            <section className="py-12 relative z-10 border-t border-white/5">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl mx-auto p-8 rounded-3xl border border-neon-cyan/20 bg-black/40 backdrop-blur-xl shadow-[0_0_30px_rgba(0,243,255,0.05)]"
                    >
                        <BookOpen size={40} className="text-neon-cyan mx-auto mb-4 drop-shadow-[0_0_8px_#00f3ff]" />
                        <h2 className="text-2xl md:text-3xl font-orbitron font-bold text-white mb-4 uppercase tracking-wider">
                            Symposium <span className="text-neon-cyan">Rules</span>
                        </h2>
                        <p className="text-gray-400 font-mono text-sm mb-8">
                            PLEASE READ THE FULL PROTOCOL AND GUIDELINES BEFORE COMMENCING OPERATIONS.
                        </p>
                        <Link
                            to="/rulebook"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-neon-cyan text-black font-bold font-orbitron text-xs rounded-full hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,243,255,0.4)]"
                        >
                            <FileText size={16} /> VIEW RULE BOOK
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Quick Access Buttons */}
            <section className="py-12 relative z-10">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row justify-center items-center gap-6"
                    >
                        <Link
                            to="/events?tab=workshops"
                            className="w-full md:w-auto min-w-[300px] group relative flex flex-col items-center justify-center p-8 bg-neon-cyan/10 border border-neon-cyan/30 rounded-2xl hover:bg-neon-cyan/20 transition-all duration-300 shadow-[0_0_20px_rgba(0,217,255,0.1)] hover:shadow-[0_0_30px_rgba(0,217,255,0.25)]"
                        >
                            <span className="text-neon-cyan font-orbitron font-black text-3xl mb-2 tracking-tighter">DAY 1</span>
                            <span className="text-white font-orbitron font-bold text-xl tracking-wider uppercase mb-4">Workshops</span>
                            <div className="px-6 py-2 bg-neon-cyan text-black font-black font-orbitron text-xs rounded-full group-hover:scale-110 transition-transform">
                                VIEW DETAILS
                            </div>
                        </Link>

                        <div className="hidden md:block w-px h-24 bg-white/10"></div>

                        <Link
                            to="/events?tab=tech"
                            className="w-full md:w-auto min-w-[300px] group relative flex flex-col items-center justify-center p-8 bg-neon-purple/10 border border-neon-purple/30 rounded-2xl hover:bg-neon-purple/20 transition-all duration-300 shadow-[0_0_20px_rgba(131,56,236,0.1)] hover:shadow-[0_0_30px_rgba(131,56,236,0.25)]"
                        >
                            <span className="text-neon-purple font-orbitron font-black text-3xl mb-2 tracking-tighter">DAY 2</span>
                            <span className="text-white font-orbitron font-bold text-xl tracking-wider uppercase mb-4">Technical & Non-Technical</span>
                            <div className="px-6 py-2 bg-neon-purple text-white font-black font-orbitron text-xs rounded-full group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(131,56,236,0.5)]">
                                VIEW DETAILS
                            </div>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Why Attend Section */}
            <section className="py-20 bg-transparent relative z-10 border-t border-white/5">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold font-orbitron mb-4 text-white">WHY ATTEND <span className="text-neon-cyan">THREADS'26</span>?</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-neon-purple to-neon-cyan mx-auto rounded-full"></div>
                    </motion.div>

                    <div className="flex justify-center w-full">
                        <TypewriterCard features={FEATURES} />
                    </div>
                </div>
            </section>

        </div>
    );
}




const TypewriterCard = ({ features }) => {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [blink, setBlink] = useState(true);


    // Blinking cursor effect
    useEffect(() => {
        const timeout2 = setTimeout(() => {
            setBlink((prev) => !prev);
        }, 500);
        return () => clearTimeout(timeout2);
    }, [blink]);

    useEffect(() => {
        if (subIndex < features[index].desc.length) {
            const timeout = setTimeout(() => {
                setSubIndex((prev) => prev + 1);
            }, Math.floor(Math.random() * 30) + 40);
            return () => clearTimeout(timeout);
        } else {
            const timeout = setTimeout(() => {
                setIndex((prev) => (prev + 1) % features.length);
                setSubIndex(0);
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [subIndex, index, features]);

    return (
        <div className="w-full max-w-4xl bg-[#0a0a0a]/80 border border-white/10 rounded-2xl p-8 backdrop-blur-xl hover:border-neon-cyan/30 transition-all duration-500 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden group min-h-[350px] flex flex-col items-center justify-center text-center">

            {/* Ambient Background Glow */}
            <div className={`absolute inset-0 opacity-10 blur-3xl transition-colors duration-700 ${index === 0 ? 'bg-neon-cyan' : index === 1 ? 'bg-neon-purple' : 'bg-neon-green'}`}></div>

            {/* Top scanning line */}
            <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${index === 0 ? 'from-transparent via-neon-cyan to-transparent' : index === 1 ? 'from-transparent via-neon-purple to-transparent' : 'from-transparent via-neon-green to-transparent'} opacity-70`}></div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mb-6 p-6 bg-white/5 rounded-full border border-white/10 relative z-10"
                >
                    {features[index].icon}
                </motion.div>
            </AnimatePresence>

            <motion.h3
                key={`title-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-3xl md:text-5xl font-bold font-orbitron mb-6 relative z-10 ${index === 0 ? 'text-neon-cyan drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]' : index === 1 ? 'text-neon-purple drop-shadow-[0_0_10px_rgba(188,19,254,0.5)]' : 'text-neon-green drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]'}`}
            >
                {features[index].title}
            </motion.h3>

            <div className="h-24 flex items-center justify-center relative w-full px-4 z-10">
                <p className="text-gray-300 text-lg md:text-2xl font-mono leading-relaxed max-w-2xl">
                    {`${features[index].desc.substring(0, subIndex)}${blink ? "|" : " "}`}
                </p>
            </div>

            {/* Progress indicators */}
            <div className="flex gap-3 mt-8 z-10">
                {features.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? (index === 0 ? 'w-16 bg-neon-cyan shadow-[0_0_10px_#00f3ff]' : index === 1 ? 'w-16 bg-neon-purple shadow-[0_0_10px_#bc13fe]' : 'w-16 bg-neon-green shadow-[0_0_10px_#00ff9d]') : 'w-2 bg-gray-800'}`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

const AnimatedCounter = ({ target, suffix }) => {
    const [count, setCount] = useState(0);
    const nodeRef = useRef(null);
    const isInView = useInView(nodeRef, { once: true, margin: "-50px" });

    useEffect(() => {
        if (isInView) {
            const controls = animate(0, target, {
                duration: 2.5,
                ease: [0.33, 1, 0.68, 1], // Custom cubic-bezier for a "tactive" feel
                onUpdate: (value) => setCount(Math.floor(value)),
            });
            return () => controls.stop();
        }
    }, [isInView, target]);

    return (
        <motion.span
            ref={nodeRef}
            className="inline-block"
            animate={count === target ? {
                scale: [1, 1.15, 1],
                textShadow: [
                    "0 0 20px rgba(251,191,36,0.8)",
                    "0 0 50px rgba(251,191,36,1)",
                    "0 0 20px rgba(251,191,36,0.8)"
                ]
            } : {}}
            transition={{
                duration: 0.6,
                ease: "circOut",
                times: [0, 0.5, 1]
            }}
        >
            {count}{suffix}
        </motion.span>
    );
};

export default Home;
