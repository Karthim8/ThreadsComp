import { Github, Twitter, Linkedin, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#090011]/90 border-t border-neon-purple/30 pt-16 pb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-purple-500 to-neon-purple"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-3xl font-bold font-orbitron text-white mb-4 block">
                            THREADS<span className="text-neon-cyan">'26</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            A National Level Technical Symposium organized by the Department of Computer Science & Engineering.
                        </p>
                        <div className="flex space-x-4">
                            <SocialLink href="https://www.instagram.com/cse.sona?igsh=MXhycmVzNzhqaWx1bA==" icon={<Instagram size={20} />} />
                            <SocialLink href="https://www.linkedin.com/company/sona-cse-department/" icon={<Linkedin size={20} />} />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-neon-purple font-orbitron font-bold text-lg mb-6">Explore</h4>
                        <ul className="space-y-3">
                            <FooterLink to="/events">Technical Events</FooterLink>
                            <FooterLink to="/gallery">Gallery</FooterLink>
                            <FooterLink to="/register">Register</FooterLink>
                            <FooterLink to="/about">About Us</FooterLink>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="col-span-1 md:col-span-2">
                        <h4 className="text-neon-cyan font-orbitron font-bold text-lg mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-400">
                                <MapPin className="text-neon-purple shrink-0 mt-1" size={18} />
                                <span>
                                    Sona College of Technology,<br />
                                    Junction Main Road, Salem - 636005,<br />
                                    Tamil Nadu, India.
                                </span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Mail className="text-neon-purple shrink-0" size={18} />
                                <a href="mailto:threads26.cse@gmail.com" className="hover:text-neon-cyan transition-colors">threads26.cse@gmail.com</a>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Phone className="text-neon-purple shrink-0" size={18} />
                                <span>+917806854324(Student Coordinator)</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm text-center md:text-left">
                        &copy; 2026 THREADS Symposium. All rights reserved.
                    </p>
                    <p className="text-gray-600 text-xs flex items-center gap-1">
                        Designed with <span className="text-neon-purple">⚡</span> by CSE Web Team
                    </p>
                </div>
            </div>
        </footer>
    );
};

const SocialLink = ({ href, icon }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-neon-cyan hover:text-black transition-all duration-300">
        {icon}
    </a>
);

const FooterLink = ({ to, children }) => (
    <li>
        <Link to={to} className="text-gray-400 hover:text-neon-cyan transition-colors flex items-center gap-2 group">
            <span className="w-1 h-1 bg-neon-purple rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            {children}
        </Link>
    </li>
);

export default Footer;
