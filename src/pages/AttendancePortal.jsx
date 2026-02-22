import { motion } from 'framer-motion';
import { Camera, Users, CheckCircle, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AttendancePortal = () => {
    return (
        <div className="pt-24 px-4 md:px-8 min-h-screen max-w-7xl mx-auto pb-20">
            <div className="flex items-center gap-4 mb-12">
                <Link to="/coordinator/select" className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors text-gray-400">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl md:text-5xl font-bold font-orbitron text-white">
                        ATTENDANCE <span className="text-neon-cyan">SCANNER</span>
                    </h1>
                    <p className="text-neon-purple font-orbitron text-[10px] uppercase tracking-[0.3em] font-black italic">Live Event Monitoring</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Scanner Interface */}
                <div className="lg:col-span-2">
                    <div className="bg-black/60 border border-white/10 rounded-3xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>

                        <div className="aspect-video flex items-center justify-center relative bg-[#090011]">
                            <div className="absolute top-0 left-0 w-full h-0.5 bg-neon-cyan/50 animate-[scan_2s_ease-in-out_infinite]"></div>

                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                                className="z-20 flex flex-col items-center gap-6"
                            >
                                <div className="w-32 h-32 border-2 border-neon-cyan/30 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(0,243,255,0.1)] relative overflow-hidden">
                                    <div className="absolute -inset-2 border-2 border-neon-cyan animate-pulse"></div>
                                    <Camera className="text-neon-cyan opacity-50" size={48} />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-white font-orbitron font-bold text-xl mb-2">INITIALIZING SENSORS</h3>
                                    <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Awaiting Video Input Signal...</p>
                                </div>
                            </motion.div>

                            {/* Scanning UI Elements */}
                            <div className="absolute top-4 left-4 z-20 flex gap-2">
                                <span className="bg-red-500 w-2 h-2 rounded-full animate-ping"></span>
                                <span className="text-red-500 font-mono text-[10px] uppercase font-black">Recording</span>
                            </div>
                        </div>

                        <div className="p-8 relative z-20 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex gap-4">
                                <div className="text-center">
                                    <div className="text-neon-cyan text-2xl font-black font-orbitron">0</div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">Present</div>
                                </div>
                                <div className="w-px h-10 bg-white/10"></div>
                                <div className="text-center">
                                    <div className="text-white text-2xl font-black font-orbitron">45</div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">Registry</div>
                                </div>
                            </div>

                            <button className="px-12 py-3 bg-neon-cyan text-black font-bold font-orbitron text-xs hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,243,255,0.3)] uppercase">
                                Manual Entry Modality
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-6">
                    <div className="bg-[#0f0f13] border border-white/10 p-6 rounded-3xl">
                        <h3 className="font-orbitron font-bold text-white mb-6 uppercase tracking-widest text-sm border-b border-white/5 pb-4">Recent Access Logs</h3>

                        <div className="space-y-4">
                            <LogEntry
                                name="Waiting for scan..."
                                id="ID-XXXX-XXXX"
                                time="--:--"
                                status="STANDBY"
                            />
                            <div className="p-8 text-center border border-dashed border-white/5 rounded-2xl">
                                <Users className="text-white/5 mx-auto mb-4" size={32} />
                                <p className="text-xs text-gray-600 font-orbitron uppercase">Logs cleared</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-neon-purple/5 border border-neon-purple/20 p-6 rounded-3xl flex items-start gap-4">
                        <AlertTriangle className="text-neon-purple flex-shrink-0" size={20} />
                        <div>
                            <h4 className="text-white font-bold text-xs font-orbitron uppercase mb-1">System Health</h4>
                            <p className="text-[10px] text-gray-500 leading-relaxed font-mono">Sensors active. Neural engine ready for ID pattern matching. Ensure high contrast lighting.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LogEntry = ({ name, id, time, status }) => (
    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
        <div>
            <div className="text-white text-xs font-bold font-orbitron">{name}</div>
            <div className="text-[10px] text-gray-500 font-mono">{id}</div>
        </div>
        <div className="text-right">
            <div className="text-neon-cyan text-[10px] font-bold font-mono">{time}</div>
            <div className="text-[10px] text-gray-600 font-black tracking-widest uppercase">{status}</div>
        </div>
    </div>
);

export default AttendancePortal;
