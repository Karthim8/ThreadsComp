import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, Users, ArrowRight, X, Calendar, MapPin, Trophy, DollarSign, Loader2, Zap, Shield, Phone, Mail, ChevronRight, RotateCcw } from 'lucide-react';
import { loadEvents } from '../services/api';
import CyberBackground from '../components/CyberBackground';

const CARD_THEMES = [
    {
        accent: '#00f3ff',
        glow: 'shadow-[0_0_20px_rgba(0,243,255,0.3)]',
        border: 'border-neon-cyan/20',
        bg: 'bg-neon-cyan/5',
        gradient: 'from-neon-cyan/20 to-transparent',
    },
    {
        accent: '#bc13fe',
        glow: 'shadow-[0_0_20px_rgba(188,19,254,0.3)]',
        border: 'border-neon-purple/20',
        bg: 'bg-neon-purple/5',
        gradient: 'from-neon-purple/20 to-transparent',
    },
    {
        accent: '#0aff00',
        glow: 'shadow-[0_0_20px_rgba(10,255,0,0.3)]',
        border: 'border-neon-green/20',
        bg: 'bg-neon-green/5',
        gradient: 'from-neon-green/20 to-transparent',
    },
    {
        accent: '#ffb800',
        glow: 'shadow-[0_0_20px_rgba(255,184,0,0.3)]',
        border: 'border-amber-500/20',
        bg: 'bg-amber-500/5',
        gradient: 'from-amber-500/20 to-transparent',
    }
];

const WORKSHOP_DATA = [
    {
        keywords: ['quantum'],
        title: "Quantum Leap: Understanding Qubits, Gates and Superposition",
        organizers: ["Surabhi - IV CSE D", "Devesh - IV CSE A", "Sandeep Rishi J B - IV CSE C"]
    },
    {
        keywords: ['llm', 'large language'],
        title: "Decoding Large Language Models: Theory to Implementation",
        organizers: ["Shobhanaa R - IV CSE C", "Akshaya S D K -IV CSE A", "Rahul C - IV CSE C"]
    },
    {
        keywords: ['flutter', 'firebase'],
        title: "Flutter App Development with Firebase Backend",
        organizers: ["Bharath S - III CSD A", "Bhuvaneshwaran R - III CSD A"]
    },
    {
        keywords: ['cyber', 'hacking', 'security'],
        title: "Introduction to Cybersecurity and Ethical Hacking",
        organizers: ["Arnold Philip - III CSE A", "Megashree - III CSE B", "Mouriya - III CSE B", "Deepak P - III CSE A"]
    },
    {
        keywords: ['game', 'unity', 'development'],
        title: "Unity Game Development",
        organizers: ["Sidharth K - IV CSD", "Mithun K - IV CSD", "Sahana V - IV CSD", "Sudhipti M - III CSD"]
    }
];

const WorkshopCard = ({ event, onRegister }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    // Find matching details or use fallback
    const details = WORKSHOP_DATA.find(d =>
        d.keywords.some(k => event.event_name.toLowerCase().includes(k))
    ) || {
        title: event.description || "Deep Dive Workshop",
        organizers: ["Dept. Experts"]
    };

    const handleFlip = () => setIsFlipped(!isFlipped);

    return (
        <div className="flex items-center justify-center p-2 mb-4">
            <div
                className={`book ${isFlipped ? 'flipped' : ''}`}
                onClick={handleFlip}
                onMouseEnter={() => setIsFlipped(true)}
                onMouseLeave={() => setIsFlipped(false)}
            >
                {/* INSIDE CONTENT (Revealed on flip) */}
                <div className="w-full h-full flex flex-col p-5 bg-[#0f172a] rounded-[10px] border border-white/10 relative z-0 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,243,255,0.05)_0%,transparent_70%)]"></div>

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="mb-3 text-center border-b border-white/10 pb-2">
                            <h4 className="text-neon-purple font-orbitron text-[10px] font-bold uppercase tracking-widest">Workshop Intel</h4>
                        </div>

                        <div className="flex-grow overflow-y-auto custom-scrollbar mb-4 pr-1">
                            <p className="text-[11px] leading-relaxed text-gray-400 italic font-mono mb-4">
                                {event.description || "Deep dive into advanced technical concepts and hands-on implementation strategies."}
                            </p>
                        </div>

                        <div className="mt-auto pt-3 border-t border-white/10">
                            <button
                                onClick={(e) => { e.stopPropagation(); onRegister(); }}
                                className="w-full py-2 bg-neon-cyan text-black text-[10px] font-black uppercase tracking-widest rounded hover:bg-white transition-all shadow-[0_0_10px_rgba(0,243,255,0.3)]"
                            >
                                Register Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* COVER (Front side) */}
                <div className="cover bg-[#1e293b] border border-neon-cyan/30">
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-transparent to-neon-purple/10"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                    <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/50 to-transparent"></div>

                    <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 h-full w-full">
                        <div className="w-16 h-16 mb-4 rounded-full bg-black/30 border border-white/10 flex items-center justify-center backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                            <Zap size={32} className="text-neon-cyan drop-shadow-[0_0_5px_rgba(0,243,255,1)]" />
                        </div>

                        <h3 className="text-lg font-black font-orbitron text-white tracking-widest uppercase mb-4 drop-shadow-md leading-tight text-center px-2">
                            {event.event_name}
                        </h3>

                        <div className="px-5 py-1.5 bg-neon-cyan text-black rounded-full text-sm font-black mb-4 shadow-[0_0_15px_rgba(0,243,255,0.4)]">
                            ₹{event.fee}
                        </div>

                        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-neon-purple to-transparent mb-4"></div>

                        <div className="mt-auto">
                            <p className="text-[9px] text-neon-cyan/60 uppercase tracking-[0.3em] font-black animate-pulse">Tap to reveal info</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TechCard = ({ event, navigate }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className={`uiverse-flip-card ${isFlipped ? 'flipped' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
        >
            <div className="uiverse-flip-card-inner">
                <div className="uiverse-flip-card-front">
                    <div className="p-4 bg-neon-cyan/10 rounded-2xl border border-neon-cyan/30 mb-2">
                        <Trophy size={48} className="text-neon-cyan" />
                    </div>
                    <p className="uiverse-title text-neon-cyan drop-shadow-[0_0_8px_#00f3ff]">{event.event_name}</p>
                    <p className="text-gray-400 font-bold tracking-widest text-[10px] uppercase animate-pulse">Tap to reveal intel</p>
                </div>
                <div className="uiverse-flip-card-back">
                    <div>
                        <p className="font-black text-neon-purple uppercase tracking-[0.2em] mb-4 text-xs border-b border-neon-purple/20 pb-2 flex items-center gap-2">
                            <Zap size={14} /> Mission Protocol
                        </p>
                        <p className="text-sm text-gray-300 leading-relaxed line-clamp-[8] font-mono italic">
                            {event.description}
                        </p>
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); navigate('/register'); }}
                        className="w-full py-3 bg-neon-purple text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-all shadow-[0_0_15px_#bc13fe]"
                    >
                        Register Now
                    </button>
                </div>
            </div>
        </div>
    );
};

const Events = () => {
    const [activeCategory, setActiveCategory] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('tab') || 'workshops';
    });
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab && (tab === 'workshops' || tab === 'tech')) {
            setActiveCategory(tab);
        }
    }, [location]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await loadEvents();
                setEvents(data.events || []);
            } catch (err) {
                setError('Failed to load events. Neural link unstable.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const workshops = events.filter(e => e.day === 1 || e.day === '1');
    const day2Events = events.filter(e => e.day === 2 || e.day === '2');

    const technicalEvents = day2Events.filter(e => {
        const type = (e.event_type || '').toLowerCase();
        return type.includes('technical') && !type.includes('non');
    }).sort((a, b) => {
        const aName = a.event_name?.toUpperCase() || '';
        const bName = b.event_name?.toUpperCase() || '';
        const aIsCTF = aName.includes('CTF') || aName.includes('CAPTURE THE FLAG');
        const bIsCTF = bName.includes('CTF') || bName.includes('CAPTURE THE FLAG');
        if (aIsCTF && !bIsCTF) return -1;
        if (!aIsCTF && bIsCTF) return 1;
        return aName.localeCompare(bName);
    });

    const nonTechnicalEvents = day2Events.filter(e => {
        const type = (e.event_type || '').toLowerCase();
        return !type.includes('technical') || type.includes('non');
    }).sort((a, b) => (a.event_name || '').localeCompare(b.event_name || ''));

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b1120]">
                <Loader2 className="text-neon-cyan animate-spin mb-4" size={48} />
                <p className="text-neon-cyan font-orbitron animate-pulse">BlockChain Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b1120] relative overflow-hidden">
            <style>{`
                .uiverse-flip-card {
                    background-color: transparent;
                    width: 100%;
                    height: 380px;
                    perspective: 1000px;
                    font-family: 'Orbitron', sans-serif;
                }

                .uiverse-flip-card-inner {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    text-align: center;
                    transition: transform 0.8s;
                    transform-style: preserve-3d;
                }

                .uiverse-flip-card:hover .uiverse-flip-card-inner,
                .uiverse-flip-card.flipped .uiverse-flip-card-inner {
                    transform: rotateY(180deg);
                }
                .uiverse-flip-card-front, .uiverse-flip-card-back {
                    box-shadow: 0 8px 32px 0 rgba(0,0,0,0.8);
                    position: absolute;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                    -webkit-backface-visibility: hidden;
                    backface-visibility: hidden;
                    border-radius: 1.5rem;
                    padding: 2rem;
                }

                .uiverse-flip-card-front {
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    border: 1px solid rgba(0, 243, 255, 0.3);
                    color: #fff;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                }

                .uiverse-flip-card-back {
                    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                    color: white;
                    transform: rotateY(180deg);
                    border: 1px solid rgba(188, 19, 254, 0.3);
                    text-align: left;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }

                .uiverse-title {
                    font-size: 1.8em;
                    font-weight: 900;
                    text-align: center;
                    margin: 0;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }

                /* 3D Book Flip Styles */
                .book {
                    position: relative;
                    border-radius: 10px;
                    width: 280px;
                    max-width: 90vw;
                    height: 380px;
                    background-color: #000;
                    box-shadow: 1px 1px 12px #000;
                    transform-style: preserve-3d;
                    perspective: 2000px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                }

                .cover {
                    top: 0;
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
                    transform-origin: 0;
                    box-shadow: 1px 1px 12px #000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    z-index: 2;
                }

                .book:hover .cover, .book.flipped .cover {
                    transform: rotateY(-110deg);
                }

                /* Ensure smooth text rendering */
                .book h3, .book p {
                    backface-visibility: hidden; /* Prevent flickering */
                }
            `}</style>

            <div className="fixed inset-0 pointer-events-none opacity-40">
                <CyberBackground />
            </div>

            <div className="relative z-10 pt-24 pb-20 px-4 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-5xl md:text-7xl font-black font-orbitron mb-6 text-white tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple">COMPENDIUM</span>
                    </h1>
                    {error && <p className="text-red-500 font-orbitron text-sm bg-red-500/10 py-2 border border-red-500/20 inline-block px-10 rounded-full">{error}</p>}
                </motion.div>

                {/* CATEGORY SELECTOR TABS */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-20">
                    <TabButton
                        active={activeCategory === 'workshops'}
                        onClick={() => setActiveCategory('workshops')}
                    >
                        DAY1 WORKSHOPS
                    </TabButton>
                    <div className="hidden sm:block h-10 w-px bg-white/10"></div>
                    <TabButton
                        active={activeCategory === 'tech'}
                        onClick={() => setActiveCategory('tech')}
                    >
                        DAY2 TECHNICAL & NON-TECHNICAL
                    </TabButton>
                </div>

                <AnimatePresence mode="wait">
                    {activeCategory === 'workshops' ? (
                        <motion.section
                            key="workshops"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="mb-24"
                        >
                            <div className="flex items-center gap-4 mb-12">
                                <div className="h-px flex-grow bg-gradient-to-r from-transparent to-neon-cyan/30"></div>
                                <h2 className="text-4xl md:text-6xl font-black font-orbitron text-neon-cyan tracking-[0.2em] uppercase text-center">DAY1 WORKSHOPS</h2>
                                <div className="h-px flex-grow bg-gradient-to-l from-transparent to-neon-cyan/30"></div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {workshops.map((event, idx) => (
                                    <WorkshopCard
                                        key={event.event_id}
                                        event={event}
                                        onRegister={() => navigate('/register')}
                                    />
                                ))}
                            </div>
                        </motion.section>
                    ) : (
                        <motion.section
                            key="tech"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {/* TECHNICAL SECTION */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-px flex-grow bg-gradient-to-r from-transparent to-neon-purple/30"></div>
                                <h2 className="text-3xl md:text-5xl font-black font-orbitron text-neon-purple tracking-[0.2em] uppercase text-center">TECHNICAL EVENTS</h2>
                                <div className="h-px flex-grow bg-gradient-to-l from-transparent to-neon-purple/30"></div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                                {technicalEvents.map((event) => (
                                    <TechCard key={event.event_id} event={event} navigate={navigate} />
                                ))}
                            </div>

                            {/* NON-TECHNICAL SECTION */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-px flex-grow bg-gradient-to-r from-transparent to-neon-purple/30"></div>
                                <h2 className="text-3xl md:text-5xl font-black font-orbitron text-neon-purple tracking-[0.2em] uppercase text-center">NON-TECHNICAL EVENTS</h2>
                                <div className="h-px flex-grow bg-gradient-to-l from-transparent to-neon-purple/30"></div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {nonTechnicalEvents.map((event) => (
                                    <TechCard key={event.event_id} event={event} navigate={navigate} />
                                ))}
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};


const EventFlipCard = ({ event, theme, onRegister }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="relative h-[480px] w-full [perspective:1500px] group">
            <motion.div
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.8, type: 'spring', stiffness: 200, damping: 25 }}
                className="relative w-full h-full [transform-style:preserve-3d]"
            >
                {/* FRONT SIDE */}
                <div
                    onClick={() => setIsFlipped(true)}
                    className={`absolute inset-0 w-full h-full [backface-visibility:hidden] bg-[#0f172a]/40 backdrop-blur-xl border-t ${theme.border} rounded-2xl p-8 overflow-hidden shadow-2xl cursor-pointer group`}
                >
                    <div className="relative z-10 h-full flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black tracking-widest text-white/50 uppercase`}>
                                {event.event_type}
                            </div>
                            <div className={`px-3 py-1 ${event.available_seats > 0 ? 'bg-neon-green/10 text-neon-green border-neon-green/20' : 'bg-red-500/10 text-red-500 border-red-500/20'} rounded-full text-[10px] font-bold border uppercase tracking-wider`}>
                                {event.seat_status}
                            </div>
                        </div>

                        <h3 className="text-3xl font-black font-orbitron text-white mb-4 leading-tight group-hover:text-glow transition-all duration-300" style={{ '--glow-color': theme.accent }}>
                            {event.event_name}
                        </h3>

                        <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-4">
                            {event.description}
                        </p>

                        <div className="mt-auto flex justify-end pt-6 border-t border-white/5">
                            <span className="inline-flex items-center gap-2 text-[10px] font-black font-orbitron tracking-widest uppercase transition-transform group-hover:translate-x-1" style={{ color: theme.accent }}>
                                EXPLORE <ArrowRight size={14} />
                            </span>
                        </div>
                    </div>
                    {/* Background Trophy Icon */}
                    <div className="absolute bottom-[-10%] right-[-5%] opacity-[0.05] rotate-[-15deg] group-hover:opacity-[0.1] transition-opacity duration-500">
                        <Trophy size={160} />
                    </div>
                </div>

                {/* BACK SIDE */}
                <div
                    className={`absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#0b1120] border-t-2 ${theme.border} rounded-2xl p-8 shadow-2xl flex flex-col`}
                >
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
                        <h4 className="text-[10px] font-black font-orbitron text-white/40 uppercase tracking-[0.4em]">MISSION INTEL</h4>
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all border border-white/10"
                        >
                            <RotateCcw size={14} />
                        </button>
                    </div>

                    <div className="space-y-6 flex-grow">
                        <DetailItem icon={<Calendar size={16} />} label="TIMELINE" value={`DAY 0${event.day}`} accent={theme.accent} />
                        <DetailItem icon={<Clock size={16} />} label="INTENSITY" value={event.duration || '09:00 - 16:00'} accent={theme.accent} />
                        <DetailItem icon={<MapPin size={16} />} label="VECTOR" value="SONA OCTAGON" accent={theme.accent} />
                    </div>

                    <div className="space-y-4 pt-8">
                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                                <Shield size={10} /> PROTOCOL
                            </p>
                            <p className="text-[10px] text-gray-400 italic">Advanced neural patterns & real-world simulation data encrypted for this session.</p>
                        </div>

                        <motion.button
                            whileHover={{ y: -3, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={(e) => { e.stopPropagation(); onRegister(); }}
                            className="w-full py-4 rounded-xl font-black font-orbitron text-black shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-widest h-14"
                            style={{
                                backgroundColor: theme.accent,
                                boxShadow: `0 0 25px -5px ${theme.accent}aa`
                            }}
                        >
                            ESTABLISH LINK <ChevronRight size={16} />
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const DetailItem = ({ icon, label, value, accent }) => (
    <div className="flex items-center gap-4 group">
        <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-gray-400 group-hover:border-glow transition-colors" style={{ '--glow-color': accent }}>
            {icon}
        </div>
        <div>
            <p className="text-[8px] font-black font-orbitron text-gray-600 uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-sm font-black text-white uppercase tracking-tighter">{value}</p>
        </div>
    </div>
);

const TabButton = ({ active, children, onClick }) => (
    <button
        onClick={onClick}
        className={`px-8 py-3 rounded-xl font-orbitron font-bold text-xs tracking-[0.2em] transition-all duration-300 ${active
            ? 'bg-neon-cyan text-black shadow-[0_0_20px_#00f3ff]'
            : 'bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/40' // Made text white and increased contrast
            }`}
    >
        {children}
    </button>
);

export default Events;
