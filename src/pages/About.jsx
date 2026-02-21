import { motion } from 'framer-motion';
import { Info, Rocket, Target, Calendar, Award, Lightbulb, MapPin } from 'lucide-react';

const About = () => {
    return (
        <div className="relative w-full py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-6xl md:text-8xl font-bold font-orbitron mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-neon-cyan to-neon-purple drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]">
                        THREADS'26
                    </h1>
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-xl md:text-2xl text-gray-300 font-orbitron tracking-wider text-center">
                            A National Level Technical Symposium Organized By
                        </p>
                        <p className="text-neon-cyan text-lg md:text-xl font-orbitron font-bold text-center">
                            Department Of Computer Science And Engineering
                        </p>
                        <p className="text-gray-400 text-sm md:text-base font-orbitron text-center max-w-2xl px-4">
                            (BE. CSE,BE. CSE(AI&ML),BE. CSD,B.TECH(CBE) AND BE.CSE(SEC))<br />
                            Sona College of Technology, Salem 636005
                        </p>
                    </div>
                    <div className="w-40 h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent mx-auto mt-8"></div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AboutCard
                        title="About the Event"
                        icon={<Info className="text-neon-cyan" size={32} />}
                        content="Threads'26 is a premier technical symposium that brings together the brightest minds in technology. With a focus on innovation, creativity, and technical excellence, we provide a platform for students to showcase their skills and compete in various challenging events."
                        delay={0.1}
                    />

                    <AboutCard
                        title="What to Expect"
                        icon={<Rocket className="text-neon-purple" size={32} />}
                        content={
                            <>
                                Experience a day filled with <span className="text-neon-cyan font-bold">technical competitions</span>, <span className="text-neon-purple font-bold">workshops</span>, and <span className="text-neon-pink font-bold">non-technical events</span>. From coding challenges to project presentations, Threads'26 offers diverse opportunities for participants to excel and win exciting 50K prizes.
                            </>
                        }
                        delay={0.2}
                    />

                    <AboutCard
                        title="Theme"
                        icon={<Target className="text-neon-pink" size={32} />}
                        content={
                            <div className="flex flex-col gap-4">
                                <p>Under the banner of:</p>
                                <div className="text-xl md:text-2xl font-orbitron font-black tracking-tighter text-center py-2 bg-white/5 rounded-lg border border-white/10 text-gradient">
                                    HACK · CREATE · DOMINATE
                                </div>
                                <p>Threads'26 encourages participants to push their boundaries, innovate solutions, and emerge victorious.</p>
                            </div>
                        }
                        delay={0.3}
                    />

                    <AboutCard
                        title="Venue & Date"
                        icon={<Calendar className="text-neon-green" size={32} />}
                        content={
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-neon-green font-bold text-lg">
                                    <Calendar size={20} /> March 5-6 2026
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <MapPin size={20} className="text-neon-purple shrink-0" />
                                    <span>Sona College of Technology, Salem</span>
                                </div>
                                <p className="mt-2 text-sm text-gray-400">Experience state-of-the-art facilities and participate in events designed to challenge and inspire.</p>
                            </div>
                        }
                        delay={0.4}
                    />

                    <AboutCard
                        title="Prize Pool"
                        icon={<Award className="text-amber-400" size={32} />}
                        content={
                            <>
                                Compete for a substantial prize pool of <span className="text-amber-400 font-bold text-xl drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">₹50,000+</span> across various events. Showcase your skills and win recognition along with exciting rewards.
                            </>
                        }
                        delay={0.5}
                    />

                    <AboutCard
                        title="Why Participate"
                        icon={<Lightbulb className="text-neon-cyan" size={32} />}
                        content="Gain valuable experience, network with fellow tech enthusiasts, learn from experts, and get a chance to win attractive prizes. Threads'26 is your platform to showcase innovation and technical prowess."
                        delay={0.6}
                    />
                </div>
            </div>
        </div>
    );
};

const AboutCard = ({ title, icon, content, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-neon-cyan/50 transition-all duration-500 group flex flex-col h-full"
    >
        <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10 w-fit group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
            {icon}
        </div>
        <h3 className="text-2xl font-orbitron font-bold text-white mb-4 group-hover:text-neon-cyan transition-colors">{title}</h3>
        <div className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors flex-grow">
            {content}
        </div>
    </motion.div>
);

export default About;
