import { motion } from 'framer-motion';
import { LogIn, Target, ChevronRight, UserCheck } from 'lucide-react';

const CoordinatorSelect = () => {
    return (
        <div className="pt-24 px-4 md:px-8 min-h-screen flex items-center justify-center pb-20">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-neon-cyan font-black font-orbitron text-xs uppercase tracking-[0.4em] mb-4 block">Access Restricted</span>
                    <h1 className="text-5xl md:text-6xl font-bold font-orbitron text-white leading-tight mb-6">
                        COORDINATOR <span className="text-neon-cyan">PORTAL</span>
                    </h1>
                    <p className="text-gray-400 text-lg font-light leading-relaxed mb-8">
                        Select your assigned event flow to begin participant management and attendance tracking.
                    </p>

                    <div className="flex gap-4">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                            <div className="w-10 h-10 bg-neon-cyan/20 rounded-full flex items-center justify-center text-neon-cyan">
                                <UserCheck size={20} />
                            </div>
                            <div>
                                <div className="text-white font-bold text-sm">Auth Level 2</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Verified Staff</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="bg-[#0f0f13] border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-white to-neon-purple opacity-50"></div>

                    <h2 className="text-2xl font-bold font-orbitron text-white mb-8 flex items-center gap-3 uppercase tracking-tighter">
                        <LogIn className="text-neon-cyan" /> Secure Entry
                    </h2>

                    <div className="space-y-4">
                        <CoordOption
                            title="Workshop Flow"
                            color="border-neon-cyan"
                            glow="shadow-[0_0_15px_#00f3ff22]"
                            count="3 Events"
                        />
                        <CoordOption
                            title="Technical Flow"
                            color="border-neon-purple"
                            glow="shadow-[0_0_15px_#bc13fe22]"
                            count="5 Events"
                        />
                        <CoordOption
                            title="Non-Tech Flow"
                            color="border-neon-green"
                            glow="shadow-[0_0_15px_#39ff1422]"
                            count="4 Events"
                        />
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <button className="text-gray-500 hover:text-white transition-colors text-xs font-orbitron uppercase tracking-widest">
                            Switch to SuperAdmin &rarr;
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const CoordOption = ({ title, color, glow, count }) => (
    <div className={`p-4 bg-white/5 border-l-4 ${color} ${glow} rounded-r-xl cursor-not-allowed group transition-all`}>
        <div className="flex justify-between items-center">
            <div>
                <h4 className="text-white font-bold font-orbitron text-sm uppercase">{title}</h4>
                <p className="text-[10px] text-gray-500 font-bold">{count} • Assignable</p>
            </div>
            <div className="text-white/10 group-hover:text-neon-cyan group-hover:translate-x-1 transition-all">
                <ChevronRight size={20} />
            </div>
        </div>
    </div>

);

export default CoordinatorSelect;
