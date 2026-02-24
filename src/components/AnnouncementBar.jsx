import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, ExternalLink, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchAPI } from '../services/api';

const AnnouncementBar = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const data = await fetchAPI('/announcements');

                setAnnouncements(data);
                if (data.length > 0) {
                    document.documentElement.style.setProperty('--announcement-offset', '36px');
                } else {
                    document.documentElement.style.setProperty('--announcement-offset', '0px');
                }
            } catch (error) {
                console.error('Error fetching announcements:', error);
                document.documentElement.style.setProperty('--announcement-offset', '0px');
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    if (loading || announcements.length === 0 || !isVisible) return null;

    const combinedText = announcements.map(a => a.content).join('   •   ');

    return (
        <div className="fixed top-0 left-0 w-full z-[60] h-9 bg-black/90 backdrop-blur-xl border-b border-white/5 flex items-center overflow-hidden">
            {/* Background Texture/Effects */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,170,0,0.1),transparent_70%)]" />
                <div className="absolute inset-0 animate-scanline bg-gradient-to-b from-transparent via-white/5 to-transparent h-1/2" />
            </div>

            {/* Left Label */}
            <div className="relative h-full flex items-center px-4 bg-black border-r border-white/10 z-[62] shadow-[4px_0_10px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Bell size={13} className="text-amber-500 animate-pulse" />
                        <div className="absolute inset-0 blur-sm bg-amber-500/50 animate-pulse scale-150 rounded-full" />
                    </div>
                    <span className="font-orbitron text-[9px] font-black italic tracking-[0.2em] text-white/90 whitespace-nowrap">
                        LIVE<span className="text-amber-500 ml-1">FEED</span>
                    </span>
                </div>
            </div>

            {/* Scrolling Content */}
            <div className="flex-1 overflow-hidden relative h-full flex items-center">
                <div className="marquee-wrapper w-full overflow-hidden">
                    <motion.div
                        className="flex whitespace-nowrap items-center"
                        animate={{ x: [0, -50 + '%'] }}
                        transition={{
                            duration: Math.max(15, combinedText.length * 0.15),
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        <div className="flex whitespace-nowrap">
                            <span className="font-orbitron text-[10px] sm:text-xs text-amber-400 font-bold tracking-[0.25em] uppercase drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                                {combinedText}
                                <span className="mx-12 opacity-50">•</span>
                                {combinedText}
                                <span className="mx-12 opacity-50">•</span>
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Edge Fades */}
                <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black via-black/50 to-transparent z-[61] pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black via-black/50 to-transparent z-[61] pointer-events-none" />
            </div>

            {/* See All Button */}
            <button
                onClick={() => navigate('/announcements')}
                className="relative h-full px-5 bg-black border-l border-white/10 flex items-center gap-2 transition-all duration-300 group z-[62] overflow-hidden hover:bg-amber-500/10"
            >
                <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-colors" />
                <span className="font-orbitron text-[9px] font-bold tracking-[0.2em] text-white/70 group-hover:text-amber-400 transition-colors relative z-10">SEE ALL</span>
                <ExternalLink size={11} className="text-white/40 group-hover:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all relative z-10" />
            </button>
        </div>
    );
};

export default AnnouncementBar;
