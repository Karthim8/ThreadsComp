import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Info, LayoutDashboard, Calendar, Zap, Image, Phone, Instagram, Linkedin, Github, Youtube, UserPlus, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Close mobile menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    // Navigation Variants
    const menuVariants = {
        closed: {
            opacity: 0,
            x: "100%",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40,
                staggerChildren: 0.1,
                staggerDirection: -1
            }
        },
        open: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40,
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        closed: { opacity: 0, x: 50 },
        open: { opacity: 1, x: 0 }
    };

    return (
        <>
            <nav className="fixed w-full z-50 left-0 border-b backdrop-blur-md" style={{ background: 'var(--bg-nav)', borderColor: 'var(--border-normal)', top: 'var(--announcement-offset, 0px)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <Link to="/home" className="text-2xl font-bold font-orbitron tracking-wider text-white flex items-center gap-2 group z-50 relative shrink-0">
                            <span className="text-neon-cyan group-hover:animate-pulse">&lt;</span>
                            THREADS<span className="text-neon-purple">'26</span>
                            <span className="text-neon-cyan group-hover:animate-pulse">/&gt;</span>
                        </Link>

                        {/* Desktop Menu */}
                        {/* Desktop Menu */}
                        <div className="hidden md:flex flex-1 justify-center px-4">
                            <div className="flex items-baseline space-x-4 lg:space-x-8">
                                <NavLink to="/home">Home</NavLink>
                                <NavLink to="/events">Events</NavLink>
                                <NavLink to="/portal" className="text-neon-green hover:text-neon-green/80">Portal</NavLink>
                                <NavLink to="/contact">Contact</NavLink>
                                <NavLink to="/gallery">Gallery</NavLink>
                                <NavLink to="/about">About Us</NavLink>
                                <NavLink to="/rulebook">
                                    <span className="flex items-center gap-1"><BookOpen size={13} />Rules</span>
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center gap-3 shrink-0">

                            <Link to="/register" className="bg-transparent border border-neon-cyan text-neon-cyan px-6 py-2 rounded font-bold font-orbitron hover:bg-neon-cyan hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(0,243,255,0.3)] hover:shadow-[0_0_20px_#00f3ff] whitespace-nowrap">
                                REGISTER NOW
                            </Link>
                        </div>

                        {/* Mobile Toggle */}
                        <div className="-mr-2 flex md:hidden z-50 relative">
                            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-neon-cyan p-2 transition-colors">
                                {isOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Right-Side Drawer Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                            />

                            {/* Drawer */}
                            <motion.div
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="fixed top-0 right-0 h-screen w-[75%] max-w-sm border-l z-50 md:hidden flex flex-col shadow-2xl"
                                style={{ background: 'var(--bg-drawer)', borderColor: 'var(--border-normal)' }}
                            >
                                {/* Drawer Header */}
                                <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: 'var(--border-normal)' }}>
                                    <span className="font-orbitron font-bold text-xl" style={{ color: 'var(--text-primary)' }}>MENU</span>
                                    <div className="flex items-center gap-3">

                                        <button onClick={() => setIsOpen(false)} className="transition-colors" style={{ color: 'var(--text-muted)' }}>
                                            <X size={24} />
                                        </button>
                                    </div>
                                </div>

                                {/* Glider Navigation Container */}
                                <div className="flex-1 overflow-y-auto p-6 flex flex-col">
                                    <div className="radio-container relative flex flex-col pl-4 mb-auto">
                                        {/* Glider visual track */}
                                        <div className="glider-container absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#1b1b1b] to-transparent">
                                            <div
                                                className="glider absolute w-[2px] bg-gradient-to-b from-transparent via-neon-cyan to-transparent transition-all duration-300 ease-out has-glow"
                                                style={{
                                                    height: '60px',
                                                    transform: `translateY(${getGliderPosition(location.pathname)}px)`
                                                }}
                                            ></div>
                                        </div>

                                        {/* Navigation Links with Icons */}
                                        <MobileGliderLink to="/home" label="HOME" icon={<Home size={20} />} index={0} onClick={() => setIsOpen(false)} />
                                        <MobileGliderLink to="/portal" label="PORTAL" icon={<LayoutDashboard size={20} />} index={1} onClick={() => setIsOpen(false)} />
                                        <MobileGliderLink to="/events" label="EVENTS" icon={<Calendar size={20} />} index={2} onClick={() => setIsOpen(false)} />
                                        <MobileGliderLink to="/gallery" label="GALLERY" icon={<Image size={20} />} index={4} onClick={() => setIsOpen(false)} />
                                        <MobileGliderLink to="/contact" label="CONTACT" icon={<Phone size={20} />} index={5} onClick={() => setIsOpen(false)} />
                                        <MobileGliderLink to="/about" label="ABOUT US" icon={<Info size={20} />} index={6} onClick={() => setIsOpen(false)} />
                                        <MobileGliderLink to="/rulebook" label="RULE BOOK" icon={<BookOpen size={20} />} index={7} onClick={() => setIsOpen(false)} />
                                    </div>

                                    <div className="mb-18 border-t pt-8 space-y-6" style={{ borderColor: 'var(--border-normal)' }}>
                                        <Link
                                            to="/register"
                                            onClick={() => setIsOpen(false)}
                                            className="block w-full bg-neon-cyan text-blue text-center py-3 font-bold font-orbitron rounded hover:bg-white hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                                        >
                                            REGISTER NOW
                                        </Link>


                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </nav>
            <BottomNav />
        </>
    );
};

const NavLink = ({ to, children, className }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    const defaultColorClass = isActive ? 'text-neon-cyan' : 'text-gray-300 hover:text-white';

    return (
        <Link to={to} className={`px-3 py-2 text-sm font-medium font-orbitron tracking-wide transition-colors relative group ${className || defaultColorClass}`}>
            {children}
            <span className={`absolute bottom-0 left-0 h-0.5 bg-neon-cyan transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
        </Link>
    );
};

// Mobile Link Component
const MobileGliderLink = ({ to, label, icon, index, onClick, isSpecial }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <label className="relative cursor-pointer p-4 py-3 flex items-center group mb-2 hover:bg-white/5 rounded-r-lg transition-colors border-l-2 border-transparent w-full" onClick={onClick}>
            <Link to={to} className="w-full flex items-center gap-4 pointer-events-auto z-10">
                <span className={`transition-colors duration-300 ${isActive ? 'text-neon-cyan' : isSpecial ? 'text-amber-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
                    {icon}
                </span>
                <span className={`font-orbitron font-bold tracking-widest text-lg transition-colors duration-300 flex-1 ${isActive ? 'text-neon-cyan' : isSpecial ? 'text-amber-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
                    {label}
                </span>
                {isActive && (
                    <motion.div
                        layoutId="activeDot"
                        className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_8px_#00f3ff]"
                    />
                )}
            </Link>
        </label>
    );
};

const getGliderPosition = (pathname) => {
    // Height match based on padding/margins in MobileGliderLink (approx 68px per item)
    const itemHeight = 68;

    switch (pathname) {
        case '/home': return 0;
        case '/portal': return itemHeight * 1;
        case '/events': return itemHeight * 2;
        case '/register/cse': return itemHeight * 3;
        case '/gallery': return itemHeight * 4;
        case '/contact': return itemHeight * 5;
        case '/about': return itemHeight * 6;
        default: return -100; // Hide if not fond
    }
};

// Import Bootstrap Icons
import { BiHomeAlt, BiCalendarEvent, BiUserPlus, BiUser } from 'react-icons/bi';

// Bottom Navigation Bar for Mobile
const BottomNav = () => {
    const location = useLocation();

    const navItems = [
        {
            path: '/home',
            icon: <BiHomeAlt size={24} />,
            label: 'HOME',
            textClass: 'text-neon-cyan',
            bgClass: 'bg-neon-cyan',
            shadowClass: 'shadow-[0_0_20px_#00D9FF]'
        },
        {
            path: '/events',
            icon: <BiCalendarEvent size={24} />,
            label: 'EVENTS',
            textClass: 'text-neon-purple',
            bgClass: 'bg-neon-purple',
            shadowClass: 'shadow-[0_0_20px_#8338EC]'
        },
        {
            path: '/register',
            icon: <BiUserPlus size={24} />,
            label: 'REGISTER',
            textClass: 'text-amber-400',
            bgClass: 'bg-amber-400',
            shadowClass: 'shadow-[0_0_20px_#fbbf24]'
        },
        {
            path: '/portal',
            icon: <BiUser size={24} />,
            label: 'MY PROFILE',
            textClass: 'text-neon-green',
            bgClass: 'bg-neon-green',
            shadowClass: 'shadow-[0_0_20px_#00FFA3]'
        }
    ];

    return (
        <div className="md:hidden fixed bottom-4 left-4 right-4 h-16 backdrop-blur-xl rounded-2xl border shadow-[0_5px_20px_rgba(0,0,0,0.3)] z-50 flex justify-between items-center px-2" style={{ background: 'var(--bg-bottom-nav)', borderColor: 'var(--border-normal)' }}>
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <div key={item.path} className="relative flex-1 flex justify-center items-center h-full">
                        <Link to={item.path} className="relative z-10 w-full h-full flex flex-col items-center justify-center">

                            {/* Visual Icon (Always present, but changes style) */}
                            <span className={`transition-all duration-300 ${isActive ? '-translate-y-8 opacity-0' : 'text-gray-500'}`}>
                                {item.icon}
                            </span>

                            {/* Label (Only visible when active, takes space of icon) */}
                            {isActive && (
                                <motion.span
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`absolute bottom-3 text-[10px] font-bold font-orbitron tracking-wider ${item.textClass}`}
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </Link>

                        {/* The Floating Circle (Layout Shared) */}
                        {isActive && (
                            <motion.div
                                layoutId="active-pill"
                                className={`absolute -top-6 w-14 h-14 rounded-full ${item.bgClass} ${item.shadowClass} flex items-center justify-center border-[4px] z-20`}
                                style={{ borderColor: 'var(--bg-bottom-nav)' }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            >
                                {/* Icon inside the floating circle */}
                                <div className="text-black drop-shadow-md">
                                    {item.icon}
                                </div>
                            </motion.div>
                        )}
                    </div>
                )
            })}
        </div>
    );
};

export default Navbar;
export { BottomNav }; // Valid export for potential external reuse if needed, or keep internal. 
// Default export handles the main Navbar which will now include BottomNav.
