import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, XCircle, Loader2, Search, ArrowRight, DollarSign } from 'lucide-react';
import { verifySonacsePayment } from '../services/api';

const PaymentVerification = () => {
    const navigate = useNavigate();
    const [participantId, setParticipantId] = useState(localStorage.getItem('threads26_participant_id') || '');
    const [transactionId, setTransactionId] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!participantId || !transactionId) return;

        setVerifying(true);
        setError(null);
        setResult(null);

        try {
            const data = await verifySonacsePayment({
                participant_id: participantId,
                transaction_id: transactionId,
                payment_method: 'UPI' // Default for portal
            });
            setResult(data);
            if (data.qr_code) {
                localStorage.setItem('threads26_qr_code', data.qr_code);
            }
            // Auto-navigate to portal after 3 seconds
            localStorage.setItem('threads26_verification_status', 'VERIFIED');
            setTimeout(() => navigate('/portal'), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="pt-32 px-4 pb-20 max-w-4xl mx-auto min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl md:text-5xl font-bold font-orbitron text-white mb-4 uppercase tracking-tighter">
                    Payment <span className="text-neon-cyan">Verification</span>
                </h1>
                <p className="text-gray-500 font-orbitron text-sm italic">Enter your transaction details to unlock your entry pass.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                    <form onSubmit={handleVerify} className="space-y-6 relative">
                        <div>
                            <label className="text-gray-400 text-[10px] font-black tracking-widest uppercase mb-2 block">Participant ID</label>
                            <input
                                type="text"
                                value={participantId}
                                onChange={(e) => setParticipantId(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-all font-mono"
                                placeholder="e.g. TH26_12345"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-gray-400 text-[10px] font-black tracking-widest uppercase mb-2 block">Transaction ID / UTR</label>
                            <input
                                type="text"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-all font-mono"
                                placeholder="12-digit UPI Ref Number"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={verifying}
                            className="w-full py-4 bg-neon-cyan text-black font-bold font-orbitron text-xs hover:bg-neon-purple hover:text-white transition-all shadow-[0_0_20px_rgba(0,243,255,0.2)] flex items-center justify-center gap-3 uppercase tracking-[0.2em]"
                        >
                            {verifying ? <Loader2 className="animate-spin" size={18} /> : 'Verify Payment'}
                        </button>
                    </form>
                </div>

                {/* Result Section */}
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl flex flex-col items-center justify-center relative overflow-hidden">
                    {!result && !error && !verifying && (
                        <div className="text-center space-y-4 opacity-50">
                            <Search size={48} className="mx-auto text-gray-500" />
                            <p className="text-xs font-orbitron text-gray-400 uppercase tracking-widest">Awaiting Input Signal...</p>
                        </div>
                    )}

                    {verifying && (
                        <div className="text-center space-y-4 animate-pulse">
                            <Loader2 size={48} className="mx-auto text-neon-cyan animate-spin" />
                            <p className="text-xs font-orbitron text-neon-cyan uppercase tracking-widest">Scanning Blockchain...</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center space-y-4">
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-full inline-block">
                                <XCircle size={48} className="text-red-500" />
                            </div>
                            <h3 className="text-white font-orbitron font-bold">Verification Failed</h3>
                            <p className="text-red-400 text-xs italic max-w-[200px] mx-auto">{error}</p>
                            <button onClick={() => setError(null)} className="text-neon-cyan text-[10px] font-bold uppercase tracking-widest hover:underline">Try Again</button>
                        </div>
                    )}

                    {result && (
                        <div className="text-center space-y-6 w-full">
                            <div className="p-4 bg-neon-green/10 border border-neon-green/30 rounded-full inline-block">
                                <CheckCircle size={48} className="text-neon-green" />
                            </div>
                            <div>
                                <h3 className="text-white font-orbitron font-bold text-lg mb-1 uppercase tracking-tighter">PAYMENT VERIFIED</h3>
                                <p className="text-gray-500 text-[10px] font-mono">ID: {participantId} | UTR: {transactionId}</p>
                            </div>

                            <div className="p-4 bg-neon-cyan/5 border border-neon-cyan/20 rounded-xl">
                                <p className="text-[10px] text-neon-cyan leading-relaxed font-orbitron italic">
                                    Payment verified! Redirecting to your portal in 3 seconds...
                                </p>
                            </div>

                            <div className="bg-black/40 p-4 rounded-xl border border-white/5 text-left space-y-2">
                                <div className="flex justify-between text-[10px]">
                                    <span className="text-gray-500">PAYMENT ID:</span>
                                    <span className="text-white font-mono">{result.payment_details?.payment_id || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                    <span className="text-gray-500">AMOUNT:</span>
                                    <span className="text-neon-green font-bold">₹{result.payment_details?.amount || 'N/A'}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    localStorage.setItem('threads26_verification_status', 'VERIFIED');
                                    window.location.href = '/portal';
                                }}
                                className="w-full py-4 bg-neon-cyan text-black font-bold font-orbitron text-xs hover:bg-neon-purple hover:text-white transition-all shadow-[0_0_20px_rgba(0,243,255,0.4)] flex items-center justify-center gap-2 uppercase tracking-[0.2em]"
                            >
                                GO TO PORTAL <ArrowRight size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Verification Info */}
            <div className="mt-12 p-8 bg-neon-purple/5 border border-neon-purple/20 rounded-3xl">
                <h4 className="text-xs font-black font-orbitron text-neon-purple uppercase tracking-[0.3em] mb-6">Verification Protocol</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <InfoStep number="01" text="Submit your unique Transaction ID from Google Pay/PhonePe." />
                    <InfoStep number="02" text="Our system cross-references with bank statements in real-time." />
                    <InfoStep number="03" text="Once confirmed, your Entry QR code will be generated instantly." />
                </div>
            </div>
        </div>
    );
};

const InfoStep = ({ number, text }) => (
    <div className="flex gap-4 items-start">
        <span className="text-neon-purple font-orbitron font-black text-xl opacity-30">{number}</span>
        <p className="text-gray-400 text-xs leading-relaxed">{text}</p>
    </div>
);

export default PaymentVerification;
