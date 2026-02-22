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
        linkedin: "https://www.linkedin.com/in/macernestantony?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
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
                        <span className="text-[10px] font-bold tracking-wider text-gray-300 group-hover:text-white transition-colors">{member.status}</span>
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
            animate={isInView
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 60, scale: 0.85 }}
            transition={{
                type: 'spring',
                stiffness: 160,
                damping: 20,
                delay: index * 0.12,
            }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            className="relative group"
            style={{ height: '390px' }}
        >
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-2xl transition-all duration-500"
                style={{
                    boxShadow: hovered
                        ? `0 0 0 1px ${c}60, 0 0 40px ${c}30, 0 0 80px ${c}15`
                        : `0 0 0 1px ${c}20`,
                    borderRadius: '16px',
                }}
            />

            {/* Card body */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden"
                style={{ background: 'linear-gradient(145deg, #050d1e, #07182e)' }}>

                {/* Animated circuit lines background */}
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

                {/* Scanline sweep on hover */}
                <motion.div
                    className="absolute inset-0 pointer-events-none z-10"
                    animate={hovered ? { y: ['0%', '100%'] } : { y: '0%' }}
                    transition={{ duration: 1.2, ease: 'linear', repeat: hovered ? Infinity : 0 }}
                    style={{
                        background: `linear-gradient(to bottom, transparent 0%, ${c}18 50%, transparent 100%)`,
                        height: '30%',
                    }}
                />

                {/* Skill badge top-left */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-orbitron text-[9px] font-black tracking-widest"
                    style={{ borderColor: `${c}50`, color: c, background: `${c}12` }}>
                    <Code2 size={9} /> {member.skill}
                </div>

                {/* DEV badge top-right */}
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-neon-cyan/30 bg-black/40 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-neon-cyan"></span>
                    <span className="text-[9px] font-bold tracking-wider text-neon-cyan font-orbitron">ONLINE</span>
                </div>

                {/* Avatar area */}
                <div className="flex items-center justify-center mt-12 mb-5 relative">
                    {/* Spinning orbit ring */}
                    <motion.div
                        className="absolute rounded-full border-2 border-dashed pointer-events-none"
                        style={{ width: 210, height: 210, borderColor: `${c}40` }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    />
                    {/* Outer pulse ring */}
                    <motion.div
                        className="absolute rounded-full pointer-events-none"
                        style={{ width: 190, height: 190 }}
                        animate={hovered
                            ? { boxShadow: [`0 0 0 0px ${c}60`, `0 0 0 10px ${c}00`] }
                            : { boxShadow: `0 0 0 0px ${c}00` }}
                        transition={{ duration: 1, repeat: hovered ? Infinity : 0 }}
                    />
                    {/* Avatar circle */}
                    <div className="relative w-40 h-40 rounded-full border-2 overflow-hidden z-10"
                        style={{ borderColor: `${c}80`, boxShadow: `0 0 20px ${c}40` }}>
                        <img src={member.image} alt={member.name}
                            className="w-full h-full object-cover" />
                        {/* Holographic overlay on hover */}
                        <motion.div
                            className="absolute inset-0 pointer-events-none"
                            animate={hovered ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ background: `linear-gradient(135deg, ${c}30, transparent 60%)` }}
                        />
                    </div>
                </div>

                {/* Info */}
                <div className="text-center px-4 pb-4">
                    <motion.p
                        className="font-mono text-[10px] tracking-[0.25em] mb-1 uppercase"
                        style={{ color: c }}
                        animate={hovered ? { letterSpacing: '0.32em' } : { letterSpacing: '0.25em' }}
                        transition={{ duration: 0.3 }}
                    >
                        {member.role}
                    </motion.p>
                    <h3 className="font-orbitron font-black text-white text-base tracking-wide mb-1 leading-tight">
                        {member.name}
                    </h3>
                    <p className="font-mono text-[10px] tracking-widest text-white/30">
                        {member.dept} <span style={{ color: c }}>·</span> {member.org}
                    </p>
                </div>

                {/* Hover reveal contact strip */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 flex gap-2 px-4 pb-3 pt-3 overflow-hidden"
                    style={{ background: `linear-gradient(to top, ${c}18, transparent)` }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={hovered || isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.3 }}
                >
                    <a href={`tel:${member.phone}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border font-orbitron text-[10px] font-bold tracking-wider transition-all"
                        style={{ borderColor: `${c}40`, color: c, background: `${c}10` }}
                        onClick={e => e.stopPropagation()}>
                        <Phone size={11} /> CALL
                    </a>
                    {member.linkedin && (
                        <a href={member.linkedin.startsWith('http') ? member.linkedin : `https://linkedin.com/in/${member.linkedin}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border font-orbitron text-[10px] font-bold tracking-wider transition-all"
                            style={{ borderColor: `${c}40`, color: c, background: `${c}10` }}
                            onClick={e => e.stopPropagation()}>
                            <Linkedin size={11} /> CONNECT
                        </a>
                    )}
                </motion.div>

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-2xl" style={{ borderColor: c }} />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-2xl" style={{ borderColor: c }} />
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
            {/* Animated outer glow */}
            <motion.div
                className="absolute inset-0 rounded-2xl transition-all duration-500"
                animate={hovered ? {
                    boxShadow: [`0 0 40px ${c}30`, `0 0 60px #8338EC40`, `0 0 40px ${c}30`],
                    border: `1px solid ${c}`
                } : {
                    boxShadow: `0 0 10px ${c}10`,
                    border: `1px solid ${c}20`
                }}
                transition={{ duration: 2, repeat: hovered ? Infinity : 0 }}
            />

            <div className="relative w-full h-full rounded-2xl overflow-hidden"
                style={{ background: 'linear-gradient(145deg, #0a0011, #1a0022)' }}>

                {/* Artistic animated background elements */}
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ color: c }}>
                    <motion.circle
                        cx="100%" cy="0" r="80"
                        fill="none" stroke="currentColor" strokeWidth="0.5"
                        animate={{ r: [80, 100, 80] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />
                    <motion.rect
                        x="-20" y="20%" width="100" height="100" rx="20"
                        fill="none" stroke="currentColor" strokeWidth="0.5"
                        transform="rotate(45)"
                        animate={{ rotate: [45, 90, 45] }}
                        transition={{ duration: 6, repeat: Infinity }}
                    />
                </svg>

                {/* Creative badge */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-orbitron text-[9px] font-black tracking-widest"
                    style={{ borderColor: `${c}50`, color: c, background: `${c}12` }}>
                    <Palette size={9} /> {member.skill}
                </div>

                {/* Creative mode badge */}
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-purple-500/30 bg-black/40 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full animate-ping bg-purple-500"></span>
                    <span className="text-[9px] font-bold tracking-wider text-purple-400 font-orbitron">CREATIVE MODE</span>
                </div>

                {/* Avatar with artistic animated frame */}
                <div className="flex items-center justify-center mt-12 mb-5 relative">
                    <motion.div
                        className="absolute pointer-events-none"
                        style={{
                            width: 220,
                            height: 220,
                            border: `1px solid ${c}30`,
                            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'
                        }}
                        animate={{
                            rotate: 360,
                            borderRadius: [
                                '30% 70% 70% 30% / 30% 30% 70% 70%',
                                '70% 30% 30% 70% / 70% 70% 30% 30%',
                                '30% 70% 70% 30% / 30% 30% 70% 70%'
                            ]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    />
                    <div className="relative w-40 h-40 rounded-full border-2 overflow-hidden z-10"
                        style={{ borderColor: `${c}80`, boxShadow: `0 0 30px ${c}30` }}>
                        <img src={member.image} alt={member.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <AnimatePresence>
                            {hovered && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-transparent mix-blend-overlay"
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Info */}
                <div className="text-center px-4 pb-4">
                    <motion.p
                        className="font-mono text-[10px] tracking-[0.25em] mb-1 uppercase"
                        style={{ color: c }}
                    >
                        {member.role}
                    </motion.p>
                    <h3 className="font-orbitron font-black text-white text-base tracking-wide mb-1 leading-tight">
                        {member.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2 opacity-60 mt-1">
                        <Layers size={10} />
                        <p className="font-mono text-[8px] tracking-widest text-white/50 uppercase">
                            Visual / Layout / Print
                        </p>
                    </div>
                </div>

                {/* Contact strip */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 flex gap-2 px-4 pb-3 pt-3 overflow-hidden"
                    style={{ background: `linear-gradient(to top, #8338EC25, transparent)` }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={hovered || isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.3 }}
                >
                    <a href={`tel:${member.phone}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border font-orbitron text-[10px] font-bold tracking-wider transition-all"
                        style={{ borderColor: `#8338EC60`, background: `#8338EC20`, color: '#fff' }}>
                        <Phone size={11} /> CALL
                    </a>
                    <a href={member.linkedin}
                        target="_blank" rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border font-orbitron text-[10px] font-bold tracking-wider transition-all"
                        style={{ borderColor: `#8338EC60`, background: `#8338EC20`, color: '#fff' }}>
                        <Linkedin size={11} /> CONNECT
                    </a>
                </motion.div>
            </div>
        </motion.div>
    );
};

/* ── Glitch title ── */
const GlitchTitle = ({ inView, text = "THE", highlight = "DEVELOPERS", delay = 0 }) => {
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay, duration: 0.5 }}
            className="relative inline-block select-none"
        >
            <h2 className="text-5xl md:text-7xl font-black font-orbitron tracking-tighter text-white relative z-10"
                style={{ textShadow: '0 0 40px rgba(0,217,255,0.4)' }}>
                {text}{' '}
                <span className="relative inline-block" style={{ color: '#00D9FF' }}>
                    {highlight}
                    {/* Glitch layers */}
                    {glitch && <>
                        <span className="absolute inset-0 text-[#FF2A6D] opacity-70"
                            style={{ clipPath: 'inset(20% 0 60% 0)', transform: 'translate(-3px, 0)' }}>
                            {highlight}
                        </span>
                        <span className="absolute inset-0 text-[#00FFA3] opacity-70"
                            style={{ clipPath: 'inset(60% 0 20% 0)', transform: 'translate(3px, 0)' }}>
                            {highlight}
                        </span>
                    </>}
                </span>
            </h2>
        </motion.div>
    );
};

/* ── BROCHURE DESIGN Title (Screenshot Style) ── */
const BrochureDesignTitle = ({ inView }) => {
    const [glitch, setGlitch] = useState(false);

    useEffect(() => {
        if (!inView) return;
        const t = setInterval(() => {
            setGlitch(true);
            setTimeout(() => setGlitch(false), 200);
        }, 4000);
        return () => clearInterval(t);
    }, [inView]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative inline-block select-none"
        >
            <h2 className="text-5xl md:text-7xl font-black font-orbitron tracking-tighter text-white relative z-10"
                style={{ textShadow: '0 0 40px rgba(255,42,109,0.4)' }}>
                BROCHURE{' '}
                <span className="relative inline-block" style={{ color: '#FF2A6D' }}>
                    DESIGNER
                    {/* Glitch layers */}
                    {glitch && <>
                        <span className="absolute inset-0 text-[#00D9FF] opacity-70"
                            style={{ clipPath: 'inset(20% 0 60% 0)', transform: 'translate(-2px, 2px)' }}>
                            DESIGNER
                        </span>
                        <span className="absolute inset-0 text-[#8338EC] opacity-70"
                            style={{ clipPath: 'inset(40% 0 40% 0)', transform: 'translate(2px, -2px)' }}>
                            DESIGNER
                        </span>
                    </>}
                </span>
            </h2>
        </motion.div>
    );
};

/* ── Terminal Banner with FAST Hacker Typing Effect ── */
const TerminalBanner = ({ inView, onComplete }) => {
    const [lines, setLines] = useState([]);
    const fullText = [
        { text: "> initializing connection...", delay: 0 },
        { text: "> verifying credentials...", delay: 100 },
        { text: "> access granted: DEV_TEAM_LEVEL_5", delay: 200, color: "text-green-400" },
        { text: "> loading modules:", delay: 300 },
        { text: "  [ react ] ........ ok", delay: 400 },
        { text: "  [ fastify ] ...... ok", delay: 500 },
        { text: "  [ postgres ] ..... ok", delay: 600 },
        { text: "> executing launch sequence...", delay: 800, color: "text-neon-cyan" }
    ];

    useEffect(() => {
        if (!inView) return;

        const timeouts = [];

        fullText.forEach((line, lineIndex) => {
            const t = setTimeout(() => {
                setLines(prev => [...prev, line]);
                if (lineIndex === fullText.length - 1) {
                    const t2 = setTimeout(onComplete, 600);
                    timeouts.push(t2);
                }
            }, line.delay);
            timeouts.push(t);
        });

        return () => timeouts.forEach(t => clearTimeout(t));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 rounded-xl overflow-hidden border border-neon-cyan/20 font-mono text-xs w-full max-w-3xl mx-auto shadow-[0_0_30px_rgba(0,234,255,0.1)]"
            style={{ background: 'rgba(9, 17, 34, 0.95)' }}
        >
            <div className="flex items-center gap-2 px-4 py-2 border-b border-neon-cyan/10 bg-black/30">
                <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
                </div>
                <span className="ml-3 text-neon-cyan/60 tracking-widest text-[10px] uppercase">
                    threads26@root:~
                </span>
            </div>
            <div className="p-4 min-h-[160px] text-gray-300 space-y-1 font-bold">
                {lines.map((line, i) => (
                    <TypewriterLine key={i} text={line.text} color={line.color} />
                ))}
            </div>
        </motion.div>
    );
};

// Sub-component for individual character typing
const TypewriterLine = ({ text, color }) => {
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        let i = 0;
        const speed = 12;
        let timeoutId;

        const typeChar = () => {
            if (i < text.length) {
                setDisplayText(text.substring(0, i + 1));
                i++;
                timeoutId = setTimeout(typeChar, speed);
            }
        };
        typeChar();
        return () => clearTimeout(timeoutId);
    }, [text]);

    return (
        <div className={`${color || ""} break-all`}>
            {displayText}
            <span className="animate-pulse inline-block w-1.5 h-3 bg-neon-cyan ml-1 align-middle opacity-70"></span>
        </div>
    );
};

const Contact = () => {
    const developersRef = useRef(null);
    const designersRef = useRef(null);
    const isDevelopersInView = useInView(developersRef, { once: true, amount: 0.15 });
    const isDesignersInView = useInView(designersRef, { once: true, amount: 0.15 });
    const [terminalDone, setTerminalDone] = useState(false);
    const [designerVisible, setDesignerVisible] = useState(false);

    // Show deferred sections after terminal sequence completes
    useEffect(() => {
        if (terminalDone) {
            const timer = setTimeout(() => {
                setDesignerVisible(true);
            }, 600);
            return () => clearTimeout(timer);
        } else {
            setDesignerVisible(false);
        }
    }, [terminalDone]);

    return (
        <div className="pt-24 pb-20 min-h-screen bg-[#0b1120] text-white">
            <style>{`
                .flip-card { perspective: 1000px; width: 100%; height: 280px; }
                .flip-card-inner {
                    position: relative; width: 100%; height: 100%;
                    text-align: center; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    transform-style: preserve-3d;
                }
                .flip-card:hover .flip-card-inner { transform: rotateY(180deg); }
                .flip-card-front, .flip-card-back {
                    position: absolute; width: 100%; height: 100%;
                    -webkit-backface-visibility: hidden; backface-visibility: hidden;
                    border-radius: 16px; overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.1);
                    background: rgba(11,17,32,0.8); backdrop-filter: blur(10px);
                }
                .flip-card-front { background: linear-gradient(145deg, rgba(15,23,42,0.9), rgba(11,17,32,0.95)); }
                .flip-card-back {
                    background: linear-gradient(145deg, rgba(11,17,32,0.95), rgba(15,23,42,0.9));
                    transform: rotateY(180deg);
                    display: flex; flex-direction: column;
                    justify-content: center; align-items: center;
                }
                .flip-card:hover .flip-card-inner { box-shadow: 0 0 25px rgba(0,234,255,0.2); }
                .flip-card:hover .flip-card-front, .flip-card:hover .flip-card-back { border-color: rgba(0,234,255,0.4); }
            `}</style>

            <div className="max-w-7xl mx-auto px-4">
                {/* Page Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
                    <h1 className="text-5xl md:text-7xl font-bold font-orbitron mb-4 tracking-tighter">
                        OUR <span className="text-neon-cyan drop-shadow-[0_0_15px_rgba(0,234,255,0.5)]">TEAM</span>
                    </h1>
                    <p className="text-gray-400 font-mono text-sm md:text-base max-w-2xl mx-auto">
                        THE MINDS BEHIND THE MACHINE. MEET THE STUDENT COORDINATORS OF THREADS'26.
                    </p>
                </motion.div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                    {TEAM_MEMBERS.map((member, index) => (
                        <TeamCard key={member.id} member={member} index={index} />
                    ))}
                </div>

                {/* ════════════════════════════════════════
                    DEVELOPER SECTION — ULTRA PREMIUM
                    ════════════════════════════════════════ */}
                <div ref={developersRef} className="mt-32 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {!terminalDone ? (
                            <motion.div
                                key="terminal"
                                exit={{
                                    scale: 2,
                                    opacity: 0,
                                    filter: "blur(10px)",
                                    transition: { duration: 0.5, ease: "easeIn" }
                                }}
                                className="w-full flex justify-center items-center"
                            >
                                <TerminalBanner
                                    inView={isDevelopersInView}
                                    onComplete={() => setTerminalDone(true)}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="content"
                                initial={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
                                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                transition={{
                                    duration: 0.8,
                                    ease: "easeOut",
                                    scale: {
                                        type: "spring",
                                        visualDuration: 0.5,
                                        bounce: 0.3
                                    }
                                }}
                            >
                                {/* ── Glitch Header ── */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="text-center mb-4 mt-8"
                                >
                                    <GlitchTitle inView={true} />
                                </motion.div>

                                {/* ── Subtext ── */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                    className="text-center mb-16"
                                >
                                    <div className="relative h-px max-w-xs mx-auto mb-6 mt-4 overflow-hidden">
                                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent, #00D9FF, #8338EC, transparent)' }} />
                                        <motion.div
                                            className="absolute inset-0"
                                            animate={{ x: ['-100%', '200%'] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 1 }}
                                            style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.8), transparent)', width: '40%' }}
                                        />
                                    </div>
                                    <p className="text-gray-400 font-mono text-sm tracking-widest">
                                        THE ARCHITECTS OF THIS DIGITAL EXPERIENCE
                                    </p>
                                    <div className="flex items-center justify-center gap-6 mt-4">
                                        {[
                                            { icon: <Globe size={14} />, label: 'WEB' },
                                            { icon: <Cpu size={14} />, label: 'BACKEND' },
                                            { icon: <Zap size={14} />, label: 'DEPLOY' },
                                        ].map((item, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.6 + i * 0.1, type: 'spring' }}
                                                className="flex items-center gap-1.5 text-neon-cyan/60 font-orbitron text-[10px] tracking-widest"
                                            >
                                                {item.icon} {item.label}
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* ── Developer Cards Grid ── */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                                    {DEVELOPER_MEMBERS.map((member, index) => (
                                        <DevCard key={member.id} member={member} index={index} />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ════════════════════════════════════════
                    DESIGNER & MAP SECTION — DEFERRED LOADING
                    ════════════════════════════════════════ */}
                <AnimatePresence>
                    {designerVisible && (
                        <motion.div
                            key="deferred-sections-wrapper"
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            transition={{
                                duration: 1.2,
                                ease: [0.22, 1, 0.36, 1],
                                opacity: { duration: 0.8 }
                            }}
                        >
                            {/* Brochure Designer Section */}
                            <motion.div
                                ref={designersRef}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-24"
                            >
                                <div className="text-center mb-12">
                                    <BrochureDesignTitle inView={true} />
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ delay: 0.6, duration: 0.8 }}
                                        className="h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-[#FF2A6D] to-transparent mt-8"
                                    />
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.8 }}
                                        className="text-gray-400 font-mono text-xs tracking-widest mt-4"
                                    >
                                        THE CREATIVE VISION BEHIND OUR VISUAL IDENTITY
                                    </motion.p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                                    <div className="lg:col-start-2">
                                        {DESIGNER_MEMBERS.map((member, index) => (
                                            <DesignerCard key={member.id} member={member} index={index} />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Location with Updated Map */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mt-32 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm"
                            >
                                <div className="p-8 md:p-12 flex flex-col justify-center">
                                    <h3 className="text-3xl font-orbitron font-bold text-white mb-8 flex items-center gap-3">
                                        <MapPin className="text-neon-cyan" size={32} />
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">HQ LOCATION</span>
                                    </h3>
                                    <address className="not-italic text-gray-400 space-y-6 text-lg font-mono">
                                        <div>
                                            <p className="font-bold text-white text-xl mb-1">Sona College of Technology</p>
                                            <p>Junction Main Road, Salem - 636005</p>
                                            <p>Tamil Nadu, India</p>
                                        </div>
                                        <div className="pt-4 border-t border-white/10">
                                            <p className="flex items-center gap-3 text-white mb-2">
                                                <Mail size={18} className="text-neon-cyan" />
                                                <a href="mailto:threads26.cse@gmail.com" className="hover:text-neon-cyan transition-colors">
                                                    threads26.cse@gmail.com
                                                </a>
                                            </p>
                                        </div>
                                    </address>
                                </div>
                                <div className="bg-[#090011]/50 min-h-[350px] relative filter grayscale contrast-125 hover:filter-none transition-all duration-500">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3739.340757703201!2d78.12186387480286!3d11.678139141915262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babf065115b5f7d%3A0x1d08f4d05518b24d!2sSona%20College%20of%20Technology!5e1!3m2!1sen!2sin!4v1771744074113!5m2!1sen!2sin"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        className="absolute inset-0 opacity-80 hover:opacity-100 transition-opacity"
                                    ></iframe>
                                    <div className="absolute inset-0 pointer-events-none border border-neon-cyan/20"></div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Contact;