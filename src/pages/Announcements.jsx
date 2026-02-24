import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Calendar, ChevronRight } from 'lucide-react';
import { fetchAPI } from '../services/api';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const data = await fetchAPI('/announcements');
                setAnnouncements(data);
            } catch (error) {
                console.error('Error fetching announcements:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-4 flex items-center gap-4">
                    <Megaphone className="text-neon-cyan animate-pulse" size={40} />
                    ANNOUNCEMENTS
                </h1>
                <p className="text-gray-400 font-body text-lg">Stay updated with the latest news and events from THREADS '26.</p>
                <div className="h-1 w-32 bg-neon-cyan mt-6 shadow-[0_0_15px_#00f3ff]"></div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-16 h-16 border-4 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin mb-4"></div>
                    <p className="text-neon-cyan font-orbitron animate-pulse">EXTRACTING DATA...</p>
                </div>
            ) : announcements.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                    <p className="text-gray-400 font-orbitron text-xl">NO ACTIVE ANNOUNCEMENTS AT THE MOMENT.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {announcements.map((announcement, index) => (
                        <motion.div
                            key={announcement.id || index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-panel p-6 sm:p-8 rounded-2xl group hover:border-neon-cyan/50 transition-all duration-500"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4 text-xs font-orbitron tracking-widest">
                                        <span className="bg-neon-cyan/20 text-neon-cyan px-3 py-1 rounded-full border border-neon-cyan/30">
                                            NEW
                                        </span>
                                        <div className="flex items-center gap-1 text-gray-500">
                                            <Calendar size={14} />
                                            {announcement.created_at ? new Date(announcement.created_at).toLocaleDateString() : 'RECENT'}
                                        </div>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-orbitron font-bold text-amber-400 mb-3 group-hover:text-amber-300 transition-colors">
                                        {announcement.title || 'Official Update'}
                                    </h3>
                                    <p className="text-gray-300 font-body leading-relaxed max-w-4xl">
                                        {announcement.content}
                                    </p>
                                </div>
                                <div className="hidden md:block">
                                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-neon-cyan/50 transition-colors">
                                        <ChevronRight className="text-gray-500 group-hover:text-neon-cyan transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Announcements;
