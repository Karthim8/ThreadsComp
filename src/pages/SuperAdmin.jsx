import { motion } from 'framer-motion';
import { Users, DollarSign, BarChart3, Settings, ShieldAlert, Download, Search, Filter } from 'lucide-react';

const SuperAdmin = () => {
    return (
        <div className="pt-24 px-4 md:px-8 min-h-screen max-w-7xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold font-orbitron text-white">
                        SUPER <span className="text-neon-purple">ADMIN</span>
                    </h1>
                    <p className="text-gray-400 font-orbitron tracking-widest text-xs mt-2 uppercase">Central Command Center</p>
                </motion.div>

                <div className="flex gap-4">
                    <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-white">
                        <Settings size={20} />
                    </button>
                    <button className="px-6 py-2 bg-red-500/10 text-red-500 border border-red-500/30 rounded-xl hover:bg-red-500 hover:text-white transition-all font-bold font-orbitron text-sm">
                        SECURE LOGOUT
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <AdminStatCard title="Total Registrations" value="2,458" color="text-neon-cyan" icon={<Users />} />
                <AdminStatCard title="Overall Revenue" value="₹12.4L" color="text-neon-green" icon={<DollarSign />} />
                <AdminStatCard title="System Health" value="OPTIMAL" color="text-neon-blue" icon={<BarChart3 />} />
                <AdminStatCard title="Alerts" value="0" color="text-neon-purple" icon={<ShieldAlert />} />
            </div>

            <div className="bg-[#0f0f13] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl">
                <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center bg-[#1a1a24]/40 gap-4">
                    <h3 className="font-orbitron font-bold text-white uppercase tracking-tighter text-xl">Participant Management</h3>
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search UUID / Name..."
                                className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-neon-cyan outline-none transition-colors"
                            />
                        </div>
                        <button className="p-2 border border-white/10 rounded-lg hover:bg-white/5 text-gray-400">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#090011]/80 text-neon-purple font-orbitron text-[10px] uppercase tracking-[0.2em] font-black">
                            <tr>
                                <th className="p-6">System ID</th>
                                <th className="p-6">Participant</th>
                                <th className="p-6">College / Dept</th>
                                <th className="p-6">Metrics</th>
                                <th className="p-6">Status</th>
                                <th className="p-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {[1, 2, 3, 4, 5].map(i => (
                                <tr key={i} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-6 font-mono text-neon-cyan text-xs">TR-26-X80{i}</td>
                                    <td className="p-6">
                                        <div className="text-white font-bold">Cyber Entity {i}</div>
                                        <div className="text-xs text-gray-500">entity_{i}@domain.com</div>
                                    </td>
                                    <td className="p-6">
                                        <div className="text-gray-300">Sona Institute</div>
                                        <div className="text-xs text-neon-purple">CSE Neural Flow</div>
                                    </td>
                                    <td className="p-6">
                                        <div className="text-white">₹{i * 100 + 500}</div>
                                        <div className="text-[10px] text-gray-500">{i} Events Selected</div>
                                    </td>
                                    <td className="p-6">
                                        <span className="bg-neon-green/10 text-neon-green border border-neon-green/30 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">Validated</span>
                                    </td>
                                    <td className="p-6">
                                        <button className="text-gray-500 hover:text-white transition-colors">
                                            <Download size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 border-t border-white/10 bg-[#090011]/20 flex justify-center">
                    <button className="text-neon-cyan text-xs font-orbitron hover:underline flex items-center gap-2">
                        FETCH MORE RECORDS <BarChart3 size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const AdminStatCard = ({ title, value, color, icon }) => (
    <div className="bg-[#0f0f13] p-8 rounded-2xl border border-white/5 hover:border-white/20 transition-all group overflow-hidden relative">
        <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform duration-700 ${color}`}>
            {icon && <div className="p-8 scale-[3]">{icon}</div>}
        </div>
        <div className="relative z-10">
            <h3 className="text-gray-500 text-xs font-orbitron uppercase tracking-[0.2em] mb-4">{title}</h3>
            <div className={`text-4xl font-bold font-orbitron ${color} tracking-tighter`}>{value}</div>
        </div>
    </div>
);

export default SuperAdmin;
