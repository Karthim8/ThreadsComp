import { useState, useRef, useEffect } from 'react';
import { Mail, Phone, Linkedin, MapPin, Code2, Cpu, Zap, Globe, Palette, Layers } from 'lucide-react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const TEAM_MEMBERS = [
    {
        id: 1,
        name: "VEDAPRAKASH S",
        role: "CHAIRPERSON",
        dept: "CSE",
        status: "ACTIVE",
        org: "THREADS'26",
        phone: "+91 7806854324",
        image: "/teampics/Vedaprakash S.png",
        linkedin: "vedaprakash-s-a726472bb"
    },
    {
        id: 2,
        name: "ROSHANKUMAR B",
        role: "CHAIRPERSON",
        dept: "CSD",
        status: "ACTIVE",
        org: "THREADS'26",
        phone: "+91 9345739239",
        image: "/teampics/Roshan CSD Chairperson.jpeg",
        linkedin: "roshankumar186"
    },
    {
        id: 3,
        name: "SHANMUGESHWARAN B",
        role: "CHAIRPERSON",
        dept: "AI&ML",
        status: "ACTIVE",
        org: "THREADS'26",
        phone: "+91 9345664388",
        image: "/teampics/Sanmugash AI&ML Chairpersion.jpeg",
        linkedin: "shanmugeshwaran-b-ba0a26302"
    },
    {
        id: 4,
        name: "KREESHAB",
        role: "LEAD CO-ORDINATOR",
        dept: "CSE",
        status: "ACTIVE",
        org: "WEB TEAM LEAD",
        phone: "+91 9360757400",
        image: "/teampics/Kreeshab Leading Co-ordinator.jpeg",
        linkedin: "kreeshab"
    },
    {
        id: 5,
        name: "KAMALESH S",
        role: "SECRETARY",
        dept: "CSE",
        status: "ACTIVE",
        org: "THREADS'26",
        phone: "+91 7305406953",
        image: "/teampics/Kamalesh CSE Secretary.jpeg",
        linkedin: "kamalesh-s-4025a82a7"
    },
    {
        id: 6,
        name: "DINESH KUMAR S M",
        role: "SECRETARY",
        dept: "CSD",
        status: "ACTIVE",
        org: "THREADS'26",
        phone: "+91 6379853092",
        image: "/teampics/Dinesh Kumar CSD Secretary.jpeg",
        linkedin: "dineshkumar-s-m"
    },
    {
        id: 7,
        name: "NAVEENKUMAR",
        role: "SECRETARY",
        dept: "AIML",
        status: "ACTIVE",
        org: "THREADS'26",
        phone: "+91 9159824141",
        image: "/teampics/Naveenkumar AIML Secretary.jpeg",
        linkedin: "naveenkumar-t-a9314b32b"
    },
];

const DEVELOPER_MEMBERS = [
    {
        id: 8,
        name: "SUBASH CHANDRA BOSE",
        role: "WEB DESIGNER",
        dept: "CSE",
        org: "TECH TEAM",
        phone: "+91 9092799440",
        image: "/teampics/Subash Chandra bose WebDesignjpg.jpeg",
        linkedin: "https://www.linkedin.com/in/subash-chandra-bose-s-35310932b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        skill: "DEVELOPER",
        color: "#8338EC",
    },
    {
        id: 9,
        name: "SRI VIMALRAJ",
        role: "WEB DEVELOPER",
        dept: "CSE",
        org: "TECH TEAM",
        phone: "+91 8807099288",
        image: "/teampics/vimal.jpeg",
        linkedin: "https://www.linkedin.com/in/vimal-raj-s-b83b42324?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        skill: "DEVELOPER",
        color: "#FF2A6D",
    },
    {
        id: 10,
        name: "KARTHIKEYAN",
        role: "WEB DEVELOPER",
        dept: "CSE",
        org: "TECH TEAM",
        phone: "+91 8606525261",
        image: "/teampics/Karthikeyan.jpeg",
        linkedin: "https://www.linkedin.com/in/karthikeyanramesh02?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        skill: "DEVELOPER",
        color: "#00FFA3",
    },
    {
        id: 11,
        name: "MACERNESTANTONY",
        role: "WEB DEVELOPER",
        dept: "CSE",
        org: "TECH TEAM",
        phone: "+91 7904722052",
        image: "/teampics/mac.jpg.jpeg",
        linkedin: "macernestantony",
        skill: "DEVELOPER",
        color: "#FF9500",
    },
    {
        id: 12,
        name: "MOURIYA",
        role: "WEB DEVELOPER",
        dept: "CSE",
        org: "TECH TEAM",
        phone: "+91 7339246951",
        image: "/teampics/Mouriya CSE.jpeg",
        linkedin: "https://www.linkedin.com/in/mouriya-v-k-5963b5334?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        skill: "DEVELOPER",
        color: "#8338EC",
    }
];

const DESIGNER_MEMBERS = [
    {
        id: 13,
        name: "Sailekha M",
        role: "BROCHURE DESIGNER",
        dept: "CSE",
        org: "DESIGN TEAM",
        phone: "+91 84849 36599",
        image: "/teampics/Sailekha M.jpeg",
        linkedin: "https://www.linkedin.com/in/sailekha-matheswaran-181062285?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        skill: "DESIGNER",
        color: "#FF2A6D",
    }
];

/* ── Regular flip card (Enhanced) ── */
const TeamCard = ({ member, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flip-card group"
        >
            <div className="flip-card-inner transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
                {/* Front Side */}
                <div className="flip-card-front flex flex-col p-5 relative overflow-hidden rounded-[20px] border border-white/10 bg-[#0f172a] shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/20 blur-[60px] rounded-full pointer-events-none" />

                    <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/40 border border-white/10 px-2.5 py-1 rounded-full backdrop-blur-md z-10 transition-colors group-hover:border-neon-cyan/30">
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                        <span className="text-[10px] font-bold tracking-wider text-gray-300 group-hover:text-white transition-colors">ACTIVE</span>
                    </div>

                    <div className="w-full flex-grow flex items-center justify-center mb-2 mt-4 relative z-10">
                        <div className="w-42 h-42 md:w-36 md:h-36 rounded-full p-[3px] relative overflow-hidden bg-gradient-to-br from-neon-cyan/50 to-purple-600/50 group-hover:from-neon-cyan group-hover:to-purple-500 transition-all duration-500 shadow-2xl">
                            <div className="w-full h-full rounded-full overflow-hidden bg-black relative">
                                <img src={member.image} alt={member.name} decoding="async"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-auto pb-2 relative z-10">
                        <p className="text-neon-cyan font-mono text-[10px] tracking-[0.2em] mb-2 uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                            {member.role} // {member.dept}
                        </p>
                        <h3 className="text-lg md:text-xl font-bold font-orbitron text-white mb-2 tracking-wide group-hover:text-neon-cyan transition-colors duration-300">
                            {member.name}
                        </h3>
                        <div className="w-8 h-0.5 bg-gray-700 mx-auto mt-3 mb-3 group-hover:w-16 group-hover:bg-neon-cyan transition-all duration-500 rounded-full"></div>
                        <p className="text-[10px] text-gray-500 font-mono tracking-widest group-hover:text-gray-400 transition-colors">
                            {member.org}
                        </p>
                    </div>
                </div>

                {/* Back Side */}
                <div className="flip-card-back p-6 relative rounded-[20px] border border-neon-cyan/30 bg-[#0b1120] shadow-[0_0_30px_rgba(0,217,255,0.15)] flex flex-col justify-center items-center overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 blur-[80px] rounded-full"></div>

                    <h3 className="text-lg font-bold font-orbitron text-white mb-6 tracking-wider border-b border-white/10 pb-2 w-full text-center">
                        CONTACT INFO
                    </h3>

                    <div className="w-full space-y-4 relative z-10">
                        <a href={`tel:${member.phone}`} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-4 hover:bg-neon-cyan/10 hover:border-neon-cyan/50 transition-all duration-300 group/item">
                            <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-neon-cyan shadow-lg group-hover/item:scale-110 transition-transform">
                                <Phone size={18} />
                            </div>
                            <div className="text-left flex-1">
                                <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-0.5">Mobile</p>
                                <p className="text-white font-mono text-xs md:text-sm group-hover/item:text-neon-cyan transition-colors">{member.phone}</p>
                            </div>
                        </a>

                        {member.linkedin && (
                            <a href={member.linkedin.startsWith('http') ? member.linkedin : `https://linkedin.com/in/${member.linkedin}`}
                                target="_blank" rel="noopener noreferrer"
                                className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-4 hover:bg-purple-500/10 hover:border-purple-500/50 transition-all duration-300 group/item">
                                <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-purple-400 shadow-lg group-hover/item:scale-110 transition-transform">
                                    <Linkedin size={18} />
                                </div>
                                <div className="text-left flex-1 overflow-hidden">
                                    <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-0.5">LinkedIn</p>
                                    <p className="text-white font-mono text-xs md:text-sm truncate group-hover/item:text-purple-300 transition-colors">
                                        @{member.linkedin.startsWith('http') ? (member.linkedin.split('/in/')[1]?.split('/')[0]?.split('?')[0] || 'profile') : member.linkedin}
                                    </p>
                                </div>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

/* ── Developer card — holographic design ── */
const DevCard = ({ member, index }) => {
    const [hovered, setHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });

    const c = member.color;

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 60, scale: 0.85 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 160, damping: 20, delay: index * 0.12 }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            className="relative group h-[390px]"
        >
            <div className="absolute inset-0 rounded-2xl transition-all duration-500"
                style={{
                    boxShadow: hovered ? `0 0 0 1px ${c}60, 0 0 40px ${c}30, 0 0 80px ${c}15` : `0 0 0 1px ${c}20`,
                    borderRadius: '16px',
                }}
            />

            <div className="relative w-full h-full rounded-2xl overflow-hidden"
                style={{ background: 'linear-gradient(145deg, #050d1e, #07182e)' }}>

                <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" style={{ color: c }}>
                    <line x1="0" y1="60" x2="40" y2="60" stroke="currentColor" strokeWidth="1" />
                    <line x1="40" y1="60" x2="40" y2="20" stroke="currentColor" strokeWidth="1" />
                    <line x1="40" y1="20" x2="80" y2="20" stroke="currentColor" strokeWidth="1" />
                    <circle cx="80" cy="20" r="3" fill="currentColor" />
                    <line x1="100%" y1="0" x2="100%" y2="30" stroke="currentColor" strokeWidth="1" transform="translate(-20,0)" />
                    <line x1="100%" y1="30" x2="60%" y2="30" stroke="currentColor" strokeWidth="1" transform="translate(-20,0)" />
                    <circle r="3" fill="currentColor" transform="translate(calc(60% - 20px), 30)" />
                    <line x1="0" y1="100%" x2="30" y2="100%" stroke="currentColor" strokeWidth="1" transform="translate(0,-20)" />
                    <line x1="30" y1="100%" x2="30" y2="70%" stroke="currentColor" strokeWidth="1" transform="translate(0,-20)" />
                    <circle cx="30" r="3" fill="currentColor" transform="translate(0,calc(70% - 20px))" />
                </svg>

                <motion.div
                    className="absolute inset-0 pointer-events-none z-10"
                    animate={hovered ? { y: ['0%', '100%'] } : { y: '0%' }}
                    transition={{ duration: 1.2, ease: 'linear', repeat: hovered ? Infinity : 0 }}
                    style={{ background: `linear-gradient(to bottom, transparent 0%, ${c}18 50%, transparent 100%)`, height: '30%' }}
                />

                <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-orbitron text-[9px] font-black tracking-widest"
                    style={{ borderColor: `${c}50`, color: c, background: `${c}12` }}>
                    <Code2 size={9} /> {member.skill}
                </div>

                <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-neon-cyan/30 bg-black/40 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-neon-cyan"></span>
                    <span className="text-[9px] font-bold tracking-wider text-neon-cyan font-orbitron">ONLINE</span>
                </div>

                <div className="flex items-center justify-center mt-12 mb-5 relative">
                    <motion.div
                        className="absolute rounded-full border-2 border-dashed pointer-events-none"
                        style={{ width: 210, height: 210, borderColor: `${c}40` }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    />
                    <div className="relative w-40 h-40 rounded-full border-2 overflow-hidden z-10"
                        style={{ borderColor: `${c}80`, boxShadow: `0 0 20px ${c}40` }}>
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                </div>

                <div className="text-center px-4 pb-4">
                    <motion.p className="font-mono text-[10px] tracking-[0.25em] mb-1 uppercase" style={{ color: c }}>
                        {member.role}
                    </motion.p>
                    <h3 className="font-orbitron font-black text-white text-base tracking-wide mb-1 leading-tight">{member.name}</h3>
                    <p className="font-mono text-[10px] tracking-widest text-white/30">{member.dept} <span>·</span> {member.org}</p>
                </div>

                <motion.div
                    className="absolute bottom-0 left-0 right-0 flex gap-2 px-4 pb-3 pt-3 overflow-hidden"
                    style={{ background: `linear-gradient(to top, ${c}18, transparent)` }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={hovered || isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                >
                    <a href={`tel:${member.phone}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border font-orbitron text-[10px] font-bold tracking-wider"
                        style={{ borderColor: `${c}40`, color: c }}>
                        <Phone size={11} /> CALL
                    </a>
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border font-orbitron text-[10px] font-bold tracking-wider"
                        style={{ borderColor: `${c}40`, color: c }}>
                        <Linkedin size={11} /> CONNECT
                    </a>
                </motion.div>
            </div>
        </motion.div>
    );
};

/* ── Designer card — artistic holographic design ── */
const DesignerCard = ({ member, index }) => {
    const [hovered, setHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });

    const c = member.color;

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 60, scale: 0.85 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 160, damping: 20, delay: index * 0.12 }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            className="relative group h-[390px]"
        >
            <motion.div className="absolute inset-0 rounded-2xl transition-all duration-500"
                animate={hovered ? {
                    boxShadow: [`0 0 40px ${c}30`, `0 0 60px #8338EC40`, `0 0 40px ${c}30`],
                    border: `1px solid ${c}`
                } : {
                    boxShadow: `0 0 10px ${c}10`,
                    border: `1px solid ${c}20`
                }}
                transition={{ duration: 2, repeat: Infinity }}
            />

            <div className="relative w-full h-full rounded-2xl overflow-hidden"
                style={{ background: 'linear-gradient(145deg, #0a0011, #1a0022)' }}>

                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ color: c }}>
                    <motion.circle cx="100%" cy="0" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" animate={{ r: [80, 100, 80] }} transition={{ duration: 4, repeat: Infinity }} />
                    <motion.rect x="-20" y="20%" width="100" height="100" rx="20" fill="none" stroke="currentColor" strokeWidth="0.5" transform="rotate(45)" animate={{ rotate: [45, 90, 45] }} transition={{ duration: 6, repeat: Infinity }} />
                </svg>

                <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-orbitron text-[9px] font-black tracking-widest"
                    style={{ borderColor: `${c}50`, color: c, background: `${c}12` }}>
                    <Palette size={9} /> {member.skill}
                </div>

                <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-purple-500/30 bg-black/40 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full animate-ping bg-purple-500"></span>
                    <span className="text-[9px] font-bold tracking-wider text-purple-400 font-orbitron">CREATIVE MODE</span>
                </div>

                <div className="flex items-center justify-center mt-12 mb-5 relative">
                    <motion.div
                        className="absolute pointer-events-none"
                        style={{ width: 220, height: 220, border: `1px solid ${c}30`, borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}
                        animate={{ rotate: 360, borderRadius: ['30% 70% 70% 30% / 30% 30% 70% 70%', '70% 30% 30% 70% / 70% 70% 30% 30%', '30% 70% 70% 30% / 30% 30% 70% 70%'] }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    />
                    <div className="relative w-40 h-40 rounded-full border-2 overflow-hidden z-10"
                        style={{ borderColor: `${c}80`, boxShadow: `0 0 30px ${c}30` }}>
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <AnimatePresence>
                            {hovered && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-transparent mix-blend-overlay" />
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="text-center px-4 pb-4">
                    <motion.p className="font-mono text-[10px] tracking-[0.25em] mb-1 uppercase" style={{ color: c }}>{member.role}</motion.p>
                    <h3 className="font-orbitron font-black text-white text-base tracking-wide mb-1 leading-tight">{member.name}</h3>
                    <div className="flex items-center justify-center gap-2 opacity-30 mt-1">
                        <Layers size={10} /><p className="font-mono text-[9px] tracking-widest text-white uppercase">Visual / Layout / Print</p>
                    </div>
                </div>

                <motion.div
                    className="absolute bottom-0 left-0 right-0 flex gap-2 px-4 pb-3 pt-3 overflow-hidden"
                    style={{ background: `linear-gradient(to top, #8338EC25, transparent)` }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={hovered || isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.3 }}
                >
                    <a href={`tel:${member.phone}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border font-orbitron text-[10px] font-bold tracking-wider"
                        style={{ borderColor: `#8338EC60`, background: `#8338EC20` }}><Phone size={11} /> CALL</a>
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border font-orbitron text-[10px] font-bold tracking-wider"
                        style={{ borderColor: `#8338EC60`, background: `#8338EC20` }}><Linkedin size={11} /> CONNECT</a>
                </motion.div>
            </div>
        </motion.div>
    );
};

/* ── Glitch title ── */
const GlitchTitle = ({ inView, text = "THE", highlight = "DEVELOPERS" }) => {
    const [glitch, setGlitch] = useState(false);
    useEffect(() => {
        if (!inView) return;
        const t = setInterval(() => {
            setGlitch(true);
            setTimeout(() => setGlitch(false), 200);
        }, 3000);
        return () => clearInterval(t);
    }, [inView]);

    return (
        <div className="relative inline-block select-none">
            <h2 className="text-5xl md:text-7xl font-black font-orbitron tracking-tighter text-white relative z-10"
                style={{ textShadow: '0 0 40px rgba(0,217,255,0.4)' }}>
                {text}{' '}
                <span className="relative inline-block" style={{ color: '#00D9FF' }}>
                    {highlight}
                    {glitch && <>
                        <span className="absolute inset-0 text-[#FF2A6D] opacity-70" style={{ clipPath: 'inset(20% 0 60% 0)', transform: 'translate(-3px, 0)' }}>{highlight}</span>
                        <span className="absolute inset-0 text-[#00FFA3] opacity-70" style={{ clipPath: 'inset(60% 0 20% 0)', transform: 'translate(3px, 0)' }}>{highlight}</span>
                    </>}
                </span>
            </h2>
        </div>
    );
};

/* ── Terminal Banner ── */
const TerminalBanner = ({ inView, onComplete }) => {
    const [lines, setLines] = useState([]);
    const fullText = [
        { text: "> initializing connection...", delay: 0 },
        { text: "> verifying credentials...", delay: 100 },
        { text: "> access granted: DEV_TEAM_LEVEL_5", delay: 200, color: "text-green-400" },
        { text: "> loading modules:", delay: 300 },
        { text: "  [ react ] ........ ok", delay: 400 },
        { text: "  [ fastify ] ...... ok", delay: 800, color: "text-neon-cyan" }
    ];

    useEffect(() => {
        if (!inView) return;
        fullText.forEach((line, lineIndex) => {
            setTimeout(() => {
                setLines(prev => [...prev, line]);
                if (lineIndex === fullText.length - 1) setTimeout(onComplete, 400);
            }, line.delay);
        });
    }, [inView]);

    return (
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}} className="mb-8 rounded-xl overflow-hidden border border-neon-cyan/20 font-mono text-xs w-full max-w-3xl mx-auto shadow-[0_0_30px_rgba(0,234,255,0.1)] bg-black/90">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-neon-cyan/10 bg-black/30">
                <div className="flex gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span><span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span><span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span></div>
                <span className="ml-3 text-neon-cyan/60 tracking-widest text-[10px] uppercase">threads26@root:~</span>
            </div>
            <div className="p-4 min-h-[160px] text-gray-300 space-y-1 font-bold">
                {lines.map((line, i) => <TypewriterLine key={i} text={line.text} color={line.color} />)}
            </div>
        </motion.div>
    );
};

const TypewriterLine = ({ text, color }) => {
    const [displayText, setDisplayText] = useState('');
    useEffect(() => {
        let i = 0;
        const typeChar = () => {
            if (i < text.length) { setDisplayText(text.substring(0, i + 1)); i++; setTimeout(typeChar, 15); }
        };
        typeChar();
    }, [text]);
    return <div className={`${color || ""} break-all`}>{displayText}<span className="animate-pulse inline-block w-1.5 h-3 bg-neon-cyan ml-1 align-middle op-70"></span></div>;
};

const Contact = () => {
    const developersRef = useRef(null);
    const designersRef = useRef(null);
    const isDevelopersInView = useInView(developersRef, { once: true, amount: 0.15 });
    const isDesignersInView = useInView(designersRef, { once: true, amount: 0.15 });
    const [terminalDone, setTerminalDone] = useState(false);

    return (
        <div className="pt-24 pb-20 min-h-screen bg-[#0b1120] text-white overflow-x-hidden">
            <style>{`
                .flip-card { perspective: 1000px; width: 100%; height: 280px; }
                .flip-card-inner { position: relative; width: 100%; height: 100%; text-align: center; transition: transform 0.6s; transform-style: preserve-3d; }
                .flip-card:hover .flip-card-inner { transform: rotateY(180deg); }
                .flip-card-front, .flip-card-back { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
                .flip-card-front { background: rgba(15,23,42,0.9); }
                .flip-card-back { background: rgba(11,17,32,0.95); transform: rotateY(180deg); display: flex; flex-direction: column; justify-content: center; align-items: center; }
            `}</style>
            <div className="max-w-7xl mx-auto px-4">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
                    <h1 className="text-5xl md:text-7xl font-bold font-orbitron mb-4 tracking-tighter">OUR <span className="text-neon-cyan">TEAM</span></h1>
                    <p className="text-gray-400 font-mono text-sm max-w-2xl mx-auto uppercase">The minds behind the machine. Meet the student coordinators.</p>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">{TEAM_MEMBERS.map((m, i) => <TeamCard key={m.id} member={m} index={i} />)}</div>
                <div ref={developersRef} className="mt-32 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {!terminalDone ? <TerminalBanner inView={isDevelopersInView} onComplete={() => setTerminalDone(true)} /> : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="text-center mb-16">
                                    <GlitchTitle inView={true} text="THE" highlight="DEVELOPERS" />
                                    <p className="text-gray-400 font-mono text-sm tracking-widest mt-8">THE ARCHITECTS OF THIS DIGITAL EXPERIENCE</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">{DEVELOPER_MEMBERS.map((m, i) => <DevCard key={m.id} member={m} index={i} />)}</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div ref={designersRef} className="mt-24">
                    <div className="text-center mb-12">
                        <GlitchTitle inView={isDesignersInView} text="BROCHURE" highlight="DESIGNER" />
                        <div className="h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-neon-cyan to-transparent mt-8" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                        <div className="lg:col-start-2">{DESIGNER_MEMBERS.map((m, i) => <DesignerCard key={m.id} member={m} index={i} />)}</div>
                    </div>
                </div>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-32 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                        <h3 className="text-3xl font-orbitron font-bold text-white mb-8 flex items-center gap-3"><MapPin className="text-neon-cyan" size={32} />LOCATION</h3>
                        <address className="not-italic text-gray-400 space-y-6 text-lg font-mono">
                            <p className="font-bold text-white text-xl">Sona College of Technology</p>
                            <p>Junction Main Road, Salem - 636005</p>
                            <p className="flex items-center gap-3 text-white"><Mail size={18} className="text-neon-cyan" /><a href="mailto:threads26.cse@gmail.com">threads26.cse@gmail.com</a></p>
                        </address>
                    </div>
                    <div className="bg-[#090011]/50 min-h-[350px] relative"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3907.643329938661!2d78.1182413148126!3d11.64835699173204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babf06f7b1b3b1b%3A0x6c6d05f0b0676b0!2sSona%20College%20of%20Technology!5e0!3m2!1sen!2sin!4v1645520868541!5m2!1sen!2sin" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe></div>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;