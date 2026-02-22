import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, QrCode, CreditCard, ExternalLink, Loader2, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { generateUPIQRCodeUrl, verifyPayment } from '../services/api';

const Success = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const result = state?.result || (() => {
        try {
            return JSON.parse(localStorage.getItem('threads26_last_reg_response') || '{}');
        } catch { return {}; }
    })();

    const total = parseFloat(state?.total || result?.total_amount || result?.amount || localStorage.getItem('threads26_payment_amount') || 0);
    const participantId = result.participant_id || localStorage.getItem('threads26_participant_id') || "NOT-FOUND";
    const [verificationResult, setVerificationResult] = useState(null);

    // Auto-trigger verification popup and protect page
    useEffect(() => {
        if (!verificationResult) {
            const handleBeforeUnload = (e) => {
                e.preventDefault();
                e.returnValue = '';
            };
            window.addEventListener('beforeunload', handleBeforeUnload);

            // Short delay to let animations settle
            const timer = setTimeout(() => {
                handleVerifyClick();
            }, 1000);

            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload);
                clearTimeout(timer);
            };
        }
    }, [verificationResult]);


    const handleVerifyClick = async () => {
        const { value: txnId } = await Swal.fire({
            title: 'Verify Payment',
            html: `
                <p class="text-[10px] text-neon-cyan/80 mb-4 italic">(Enter valid transaction id and It will verified soon and displayed on portal page )</p>
                <p class="text-xs text-gray-400 mb-2">Enter your 12-digit UPI Transaction ID (UTR)</p>
            `,
            input: 'text',
            inputPlaceholder: 'Enter Transaction ID...',
            showCancelButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: 'Verify Now',
            confirmButtonColor: '#00f3ff',
            background: '#0a0a0a',
            color: '#fff',
            customClass: {
                popup: 'border border-white/10 rounded-2xl font-orbitron',
                title: 'text-white',
                input: 'bg-black/40 border-white/10 text-white font-mono',
            },
            preConfirm: async (id) => {
                if (!id || id.length < 5) {
                    Swal.showValidationMessage('Please enter a valid Transaction ID');
                    return false;
                }

                Swal.showLoading();
                try {
                    const data = await verifyPayment({
                        participant_id: participantId,
                        transaction_id: id,
                        payment_method: 'UPI',
                        amount: Math.round(parseFloat(total) * 100) / 100
                    });
                    return data;
                } catch (err) {
                    Swal.showValidationMessage(err.message || 'Verification failed');
                    return false;
                }
            }
        });

        if (txnId) {
            setVerificationResult(txnId);
            if (txnId.qr_code) {
                localStorage.setItem('threads26_qr_code', txnId.qr_code);
            }
            localStorage.setItem('threads26_verification_status', 'VERIFIED');
            localStorage.setItem('threads26_participant_id', participantId);

            await Swal.fire({
                icon: 'success',
                title: 'Transaction id will be verified soon',
                text: 'Your registration is now locked in. Redirecting to portal...',
                timer: 2000,
                showConfirmButton: false,
                background: '#0a0a0a',
                color: '#fff'
            });
            navigate('/portal');
        }
    };

    // Generate UPI QR code for immediate payment — use saved one if available (survives refresh)
    const paymentQr = localStorage.getItem('threads26_payment_qr_url') || generateUPIQRCodeUrl(
        participantId,
        total,
        result.event_names || []
    );


    return (
        <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-24 h-24 bg-neon-green/20 rounded-full flex items-center justify-center mb-8 border border-neon-green shadow-[0_0_30px_#0aff00]"
            >
                <CheckCircle size={48} className="text-neon-green" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold font-orbitron text-white mb-4 tracking-tighter">REGISTRATION <span className="text-neon-cyan">CONFIRMED</span></h1>
            <p className="text-gray-400 mb-8 max-w-lg italic">
                Your dossier has been uploaded. Participant ID: <span className="text-neon-cyan font-bold">{participantId}</span>.
            </p>

            <div className="max-w-md w-full">
                {/* Immediate Payment Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-[#0f0011]/60 border border-neon-purple/30 p-8 rounded-2xl relative overflow-hidden shadow-2xl backdrop-blur-xl"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-neon-purple"></div>

                    <div className="mb-6 text-center">
                        <p className="text-gray-500 text-[10px] uppercase font-black tracking-[0.5em] font-orbitron mb-2">Participant ID</p>
                        <p className="text-3xl font-bold font-mono text-neon-cyan tracking-widest drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">{participantId}</p>
                    </div>

                    <h3 className="text-white font-orbitron font-bold mb-6 flex items-center justify-center gap-2 uppercase tracking-widest text-sm">
                        <CreditCard size={18} className="text-neon-purple" /> PAY REGISTRATION FEE (₹{total})
                    </h3>

                    <div className="flex justify-center mb-6 bg-white p-4 rounded-xl w-max mx-auto shadow-[0_0_30px_rgba(188,19,254,0.1)]">
                        <img src={paymentQr} alt="Payment QR" className="w-[180px] h-[180px]" />
                    </div>

                    <div className="space-y-4">
                        <div className="bg-black/40 p-4 rounded-xl border border-white/5 text-left font-mono text-[10px]">
                            <p className="text-gray-500 mb-1 font-bold italic">SCAN WITH GOOGLE PAY / PHONEPE</p>
                            <div className="flex justify-between mt-2">
                                <span className="text-gray-500">UPI ID:</span>
                                <span className="text-white uppercase">{result.payment_options?.upi_id || 'rajikutty106@okaxis'}</span>
                            </div>
                            <div className="flex justify-between mt-1">
                                <span className="text-gray-500">REF:</span>
                                <span className="text-neon-purple truncate ml-2 font-bold">{result.payment_ref || result.payment_options?.payment_reference || result.payment_reference || `THREADS26-${participantId}`}</span>
                            </div>
                        </div>

                        {verificationResult ? (
                            <div className="text-center space-y-4 py-4">
                                <div className="p-3 bg-neon-green/10 border border-neon-green/30 rounded-full inline-block">
                                    <CheckCircle size={32} className="text-neon-green" />
                                </div>
                                <h4 className="text-white font-orbitron font-bold text-xs uppercase tracking-widest">TRANSACTION RECORDED</h4>
                                <p className="text-[10px] text-gray-500 italic">Access your entry pass in the portal.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                    <p className="text-[10px] text-gray-400 leading-relaxed font-orbitron italic text-center">
                                        Pay first, then click below to verify your Transaction ID and unlock your portal.
                                    </p>
                                </div>

                                <button
                                    onClick={handleVerifyClick}
                                    className="w-full flex items-center justify-center gap-3 py-4 bg-neon-cyan text-black font-bold font-orbitron text-xs hover:bg-neon-purple hover:text-white transition-all uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(0,243,255,0.3)]"
                                >
                                    VERIFY PAYMENT NOW <ShieldCheck size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {verificationResult && (
                <div className="flex gap-4 mt-12">
                    <button
                        onClick={() => navigate('/portal')}
                        className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-bold transition-colors font-orbitron text-xs uppercase tracking-widest"
                    >
                        <Download size={20} /> ENTRY TICKET
                    </button>

                    <Link to="/" className="px-6 py-3 bg-neon-cyan text-black rounded-lg font-bold hover:bg-neon-purple hover:text-white transition-all font-orbitron text-xs shadow-[0_0_10px_#00f3ff] uppercase tracking-widest">
                        BACK TO HOME
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Success;
