import { useState } from 'react';
import { Users, DollarSign, Calendar, Activity } from 'lucide-react';

const Admin = () => {
    return (
        <div className="pt-24 px-4 md:px-8 min-h-screen max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold font-orbitron text-white">
                    ADMIN <span className="text-neon-cyan">DASHBOARD</span>
                </h1>
                <button className="bg-red-500/20 text-red-500 border border-red-500/50 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition-colors">
                    LOGOUT
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Registrations" value="1,245" color="text-neon-cyan" icon={<Users size={24} />} />
                <StatCard title="Total Revenue" value="₹4,50,200" color="text-neon-green" icon={<DollarSign size={24} />} />
                <StatCard title="Workshop Seats" value="85%" color="text-neon-purple" icon={<Calendar size={24} />} />
                <StatCard title="Live Visitors" value="42" color="text-neon-blue" icon={<Activity size={24} />} />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-8">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#090011]/40">
                    <h3 className="font-orbitron text-white">Recent Registrations</h3>
                    <button className="text-neon-cyan text-sm hover:underline">Export CSV</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-400">
                        <thead className="bg-white/5 text-neon-purple font-orbitron text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Reg ID</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">College</th>
                                <th className="p-4">Events</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {[1, 2, 3, 4, 5].map(i => (
                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-mono text-neon-cyan text-sm">THREADS26-100{i}</td>
                                    <td className="p-4 text-white font-medium">Student Name {i}</td>
                                    <td className="p-4 text-sm">Sona College of Technology</td>
                                    <td className="p-4 text-sm">Workshop, CodeWar</td>
                                    <td className="p-4 text-white">₹450</td>
                                    <td className="p-4"><span className="bg-neon-green/10 text-neon-green border border-neon-green/30 px-2 py-1 rounded text-xs font-bold">PAID</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

const StatCard = ({ title, value, color, icon }) => (
    <div className="bg-[#0f0f13] p-6 rounded-xl border border-white/10 hover:border-neon-cyan/50 transition-colors group shadow-lg">
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 text-sm font-orbitron uppercase tracking-wider">{title}</h3>
            <div className={`p-2 rounded-lg bg-white/5 ${color} group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
        </div>
        <p className={`text-3xl font-bold ${color} drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]`}>{value}</p>
    </div>
)

export default Admin;
