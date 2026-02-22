import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { fetchDriveGallery } from '../services/galleryService';
import { Loader2, Maximize2, X, Play, Image as ImageIcon } from 'lucide-react';

const GalleryItem = ({ img, index }) => {
    const isVideo = img.isVideo;
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.9, rotateX: 10 }}
            whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            viewport={{ once: true, amount: 0.1, margin: "0px 0px -50px 0px" }}
            transition={{
                duration: 1,
                delay: (index % 6) * 0.1,
                ease: [0.22, 1, 0.36, 1]
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative group overflow-hidden rounded-3xl bg-[#0a0510] border border-white/5 cursor-pointer transform-gpu
                ${index % 7 === 0 ? 'md:col-span-2 md:row-span-2 md:aspect-square' :
                    index % 5 === 0 ? 'md:col-span-1 md:row-span-2 md:aspect-[9/16]' :
                        ''} aspect-[4/5] md:aspect-[4/3]
            `}
        >


            {isVideo ? (
                <div className="w-full h-full relative flex items-center justify-center bg-black">
                    {/* Background Blur for a premium look when containing */}
                    <img
                        src={img.thumbnail}
                        className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-110"
                        alt=""
                        loading="lazy"
                        decoding="async"
                    />
                    {/* Large files won't play via direct link, so fallback to image */}
                    {img.isLargeFile ? (
                        <div className="relative w-full h-full">
                            <img
                                src={img.thumbnail}
                                className="w-full h-full object-cover opacity-60"
                                alt={img.name}
                                loading={index < 6 ? "eager" : "lazy"}
                                decoding="async"
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-neon-cyan text-[10px] font-orbitron tracking-widest border border-neon-cyan/30 px-2 py-1 bg-black/50 backdrop-blur-sm rounded">
                                    LARGE FILE (PREVIEW ONLY)
                                </span>
                            </div>
                        </div>
                    ) : (
                        <video
                            src={img.src}
                            muted
                            loop
                            playsInline
                            poster={img.thumbnail}
                            className="w-full h-full object-contain relative z-10 transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                            onMouseOver={e => e.target.play()}
                            onMouseOut={e => { e.target.pause(); e.target.currentTime = 0; }}
                        />
                    )}
                    <div className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-neon-cyan/10 backdrop-blur-xl flex items-center justify-center border border-neon-cyan/30 text-neon-cyan shadow-[0_0_20px_rgba(0,217,255,0.2)]">
                        <Play size={20} fill="currentColor" />
                    </div>
                </div>
            ) : (
                <div className="w-full h-full relative flex items-center justify-center bg-[#080112]">
                    {/* Background Blur for a premium look when containing */}
                    <img
                        src={img.src}
                        className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-110"
                        alt=""
                        loading="lazy"
                        decoding="async"
                    />
                    <img
                        src={img.src}
                        alt={img.name}
                        loading={index < 6 ? "eager" : "lazy"}
                        decoding="async"
                        className="w-full h-full object-contain relative z-10 transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                    />
                </div>
            )}

            {/* Scanning Line Animation on Hover */}


            {/* Content Overlay */}


            {/* Corner Bracket Decorations */}

        </motion.div>
    );
};

const Gallery = () => {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);

    useEffect(() => {
        const loadMedia = async () => {
            const data = await fetchDriveGallery();
            setMedia(data);
            setLoading(false);
        };
        loadMedia();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050012]">
                <div className="relative">
                    <div className="w-24 h-24 border-4 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-neon-purple/20 border-b-neon-purple rounded-full animate-spin-slow"></div>
                    </div>
                </div>
                <p className="mt-12 font-orbitron text-neon-cyan tracking-[0.8em] text-[10px] animate-pulse">ACCESSING ENCRYPTED MEDIA VAULT...</p>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="pt-32 pb-40 min-h-screen bg-[#050012] text-white selection:bg-neon-cyan selection:text-black">
            {/* Background Tech Mesh */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:40px_40px]"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#050012] via-transparent to-[#050012]"></div>
            </div>

            {/* Header Content */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-32 relative z-10 px-4"
            >
                <div className="inline-block px-4 py-1 border border-neon-cyan/30 rounded-full mb-8 backdrop-blur-md">
                    <span className="text-[10px] font-orbitron font-bold text-neon-cyan tracking-[0.3em] uppercase">Archive Portal: {media.length} Units Found</span>
                </div>

                <h1 className="text-3xl md:text-5xl lg:text-7xl font-orbitron font-black mb-8 tracking-tighter uppercase">
                    CAPTURE THE <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-neon-cyan to-neon-purple drop-shadow-[0_0_30px_rgba(0,217,255,0.3)]">MEMORIES</span>
                </h1>

                <p className="text-gray-400 max-w-3xl mx-auto font-light text-lg md:text-xl tracking-[0.05em] px-4 leading-relaxed font-orbitron opacity-70">
                    Decrypting the visual timeline of <span className="text-white border-b border-neon-cyan">Threads'26</span> legacy.
                </p>
            </motion.div>

            {/* Dynamic Bento Grid */}
            <div className="container mx-auto px-4 md:px-12 max-w-[1600px] relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {media.map((img, idx) => (
                        <GalleryItem key={img.id} img={img} index={idx} />
                    ))}
                </div>
            </div>

            <style>{`
                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Gallery;


