import { motion } from 'framer-motion';
import { User, CreditCard, CheckCircle, QrCode, Calendar, ArrowRight, Loader2, Download, RefreshCw, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { loadUserProfile, generateUPIQRCodeUrl, verifySonacsePayment } from '../services/api';

const ParticipantPortal = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [qrUrl, setQrUrl] = useState(null);
    const [offlineCache, setOfflineCache] = useState(null); // local-cache fallback
    const [txnId, setTxnId] = useState('');
    const navigate = useNavigate();

    const fetchProfile = async () => {
        const pid = localStorage.getItem('threads26_participant_id');
        if (!pid) {
            setLoading(false);
            return;
        }

        try {
            const data = await loadUserProfile(pid);
            if (!data) throw new Error("Entity data not found in neural buffers.");
            setProfile(data);

            // Build QR from local cache (threads26_last_reg_response) so the
            // exact amount & payment_ref from the backend are always used.
            if (data.verification_status === 'NOT_VERIFIED' && data.registrations) {
                // First priority: pre-saved QR URL (fastest, no re-computation)
                const savedQrUrl = localStorage.getItem('threads26_payment_qr_url');
                if (savedQrUrl) {
                    setQrUrl(savedQrUrl);
                } else {
                    // Second priority: rebuild from local cache using exact backend fields
                    try {
                        const cached = JSON.parse(localStorage.getItem('threads26_last_reg_response') || '{}');
                        const amount = cached.total_amount || data.payment_summary?.total_amount || 0;
                        const ref = cached.payment_ref || cached.payment_reference || `THREADS26-${pid}`;
                        const upiUrl = `upi://pay?pa=rajikutty106@okaxis&pn=THREADS26&am=${amount}&cu=INR&tn=${encodeURIComponent(ref)}`;
                        const generatedQr = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;
                        // Save for next load so we don't rebuild every time
                        localStorage.setItem('threads26_payment_qr_url', generatedQr);
                        localStorage.setItem('threads26_payment_amount', String(amount));
                        setQrUrl(generatedQr);
                    } catch {
                        // Last resort: generic QR
                        const eventNames = (data.registrations || []).map(r => r.event_name);
                        const url = generateUPIQRCodeUrl(pid, data.payment_summary?.total_amount || 0, eventNames);
                        setQrUrl(url);
                    }
                }
            }

        } catch (err) {
            console.error(err);
            // ── Offline fallback: try to reconstruct from local cache ──
            try {
                const raw = localStorage.getItem('threads26_last_reg_response');
                if (raw) {
                    const cached = JSON.parse(raw);
                    if (cached && cached.participant_id) {
                        // Build a UPI QR from the cached amount + payment_ref
                        const amount = cached.total_amount || 0;
                        const ref = cached.payment_ref || cached.payment_reference || `THREADS26-${cached.participant_id}`;
                        const upiUrl = `upi://pay?pa=rajikutty106@okaxis&pn=THREADS26&am=${amount}&cu=INR&tn=${encodeURIComponent(ref)}`;
                        const savedQrUrl = localStorage.getItem('threads26_payment_qr_url') ||
                            `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;
                        setOfflineCache({ ...cached, _qrUrl: savedQrUrl });
                        setLoading(false);
                        return; // skip error state
                    }
                }
            } catch { }
            setError(err.message || 'Failed to sync with central command. Check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyClick = async () => {
        const pid = profile.participant.participant_id;
        const totalAmount = profile.payment_summary?.total_amount || 0;

        let transactionId = txnId;

        if (!transactionId) {
            const { value: result } = await Swal.fire({
                title: 'Verify Payment',
                html: `
                    <p class="text-[10px] text-neon-cyan/80 mb-4 italic">(Enter valid transaction id and It will verified soon and displayed on portal page )</p>
                    <p class="text-xs text-gray-400 mb-2">Enter your UPI Transaction ID (UTR)</p>
                `,
                input: 'text',
                inputPlaceholder: 'Enter Transaction ID...',
                showCancelButton: true,
                confirmButtonText: 'Verify Now',
                confirmButtonColor: '#00f3ff',
                cancelButtonColor: '#27272a',
                background: '#0a0a0a',
                color: '#fff',
                customClass: {
                    popup: 'border border-white/10 rounded-2xl font-orbitron',
                    title: 'text-white font-orbitron',
                    input: 'bg-black/40 border-white/10 text-white font-mono rounded-xl',
                },
                preConfirm: async (id) => {
                    if (!id || id.length < 5) {
                        Swal.showValidationMessage('Please enter a valid Transaction ID (min 5 characters)');
                        return false;
                    }
                    return id;
                }
            });
            if (!result) return;
            transactionId = result;
        }

        // Show loading
        Swal.fire({
            title: 'Verifying Payment...',
            html: 'Please wait while we confirm your payment.',
            didOpen: () => Swal.showLoading(),
            background: '#0a0a0a',
            color: '#fff',
            allowOutsideClick: false
        });

        try {
            const data = await verifySonacsePayment({
                participant_id: pid,
                transaction_id: transactionId,
                amount: Math.round(parseFloat(totalAmount) * 100) / 100
            });

            if (data.success || data.verified) {
                if (data.qr_code) {
                    localStorage.setItem('threads26_qr_code', data.qr_code);
                }
                localStorage.setItem('threads26_verification_status', 'VERIFIED');

                await Swal.fire({
                    icon: 'success',
                    title: 'Transaction id will be verified soon',
                    text: 'Your registration is now being processed.',
                    timer: 2000,
                    showConfirmButton: false,
                    background: '#0a0a0a',
                    color: '#fff'
                });
                fetchProfile();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Verification Failed',
                    text: data.details || data.error || 'Payment could not be verified. Please try again.',
                    confirmButtonColor: '#dc2626',
                    background: '#0a0a0a',
                    color: '#fff'
                });
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Verification Error',
                text: err.message || 'Network error. Please try again.',
                confirmButtonColor: '#dc2626',
                background: '#0a0a0a',
                color: '#fff'
            });
        }
    };

    const handleManualVerification = async () => {
        const pid = profile.participant.participant_id;

        // Get stored registration response if available
        const storedResponse = localStorage.getItem('threads26_last_reg_response');
        let defaultAmount = profile.payment_summary.total_amount;
        let defaultReference = `THREADS26-${pid}`;
        let upiId = 'rajikutty106@okaxis'; // Default UPI ID

        if (storedResponse) {
            try {
                const parsed = JSON.parse(storedResponse);
                // Actual backend fields: total_amount, payment_reference (or payment_ref), payment_options.upi_id
                defaultAmount = (parsed.payment_options && parsed.payment_options.amount) || parsed.total_amount || defaultAmount;
                defaultReference = parsed.payment_reference || parsed.payment_ref || defaultReference;
                upiId = (parsed.payment_options && parsed.payment_options.upi_id) || upiId;
            } catch (e) {
                console.error('Failed to parse stored response:', e);
            }
        }

        // Generate UPI QR Code
        const upiUrl = `upi://pay?pa=${upiId}&pn=THREADS26&am=${defaultAmount}&cu=INR&tn=${encodeURIComponent(defaultReference)}`;
        const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUrl)}`;

        const result = await Swal.fire({
            title: 'Manual Payment Verification',
            html: `
                <div class="text-left space-y-4 mb-4">
                    <div class="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <p class="font-bold text-white mb-2">Scan & Pay (UPI)</p>
                        <img src="${qrImage}" alt="UPI QR Code" class="mx-auto rounded-lg mb-2 border-4 border-white" style="max-width: 180px;" />
                        <p class="text-xl font-bold text-amber-400">₹${defaultAmount}</p>
                        <p class="text-xs text-gray-400 break-all">${upiId}</p>
                    </div>

                    <div>
                        <p class="text-sm text-gray-400 mb-1">Payment Reference <span class="text-red-500">*</span></p>
                        <input id="swal-ref" class="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-neon-cyan" value="${defaultReference}" placeholder="THREADS26-XXXX-XXXXXX">
                        <p class="text-xs text-gray-500 mt-1">Use the reference from your registration response</p>
                    </div>

                    <div>
                        <p class="text-sm text-gray-400 mb-1">Amount <span class="text-red-500">*</span></p>
                        <input id="swal-amount" type="number" class="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-neon-cyan" value="${defaultAmount}" placeholder="Enter amount">
                    </div>

                    <div>
                        <p class="text-[10px] text-amber-400/80 mb-2 italic">(Enter valid transaction id and It will verified soon and displayed on portal page )</p>
                        <p class="text-sm text-gray-400 mb-1">Transaction ID <span class="text-red-500">*</span></p>
                        <input id="swal-txn-id" class="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-neon-cyan" placeholder="Enter UPI / Transaction ID">
                        <p class="text-xs text-gray-500 mt-1">Min. 5 characters from your payment app</p>
                    </div>

                    <div class="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded text-yellow-400 text-xs">
                        <strong>Note:</strong> First complete the payment using the QR code above, then enter your transaction ID to verify.
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Verify Payment',
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#374151',
            background: '#1a1a1a',
            color: '#fff',
            width: '32rem',
            preConfirm: () => {
                const txnId = document.getElementById('swal-txn-id').value;
                const ref = document.getElementById('swal-ref').value;
                const amount = document.getElementById('swal-amount').value;

                if (!txnId || txnId.length < 5) {
                    Swal.showValidationMessage('Please enter a valid Transaction ID');
                    return false;
                }
                if (!ref || ref.length < 5) {
                    Swal.showValidationMessage('Please enter a valid Payment Reference');
                    return false;
                }
                if (!amount || parseFloat(amount) <= 0) {
                    Swal.showValidationMessage('Please enter a valid amount');
                    return false;
                }
                return { txnId, ref, amount };
            }
        });

        if (result.isConfirmed) {
            const { txnId, ref, amount } = result.value;

            Swal.fire({
                title: 'Verifying...',
                didOpen: () => Swal.showLoading(),
                background: '#1a1a1a',
                color: '#fff'
            });

            try {
                const data = await verifySonacsePayment({
                    participant_id: pid,
                    transaction_id: txnId,
                    payment_method: 'UPI',
                    payment_reference: ref,
                    amount: Math.round(parseFloat(amount) * 100) / 100
                });

                if (data.success || data.verified) {
                    if (data.qr_code) {
                        localStorage.setItem('threads26_qr_code', data.qr_code);
                    }
                    localStorage.setItem('threads26_verification_status', 'VERIFIED');

                    await Swal.fire({
                        icon: 'success',
                        title: 'Transaction id will be verified soon',
                        text: 'Your registration is now being processed.',
                        timer: 2000,
                        showConfirmButton: false,
                        background: '#0a0a0a',
                        color: '#fff'
                    });
                    fetchProfile();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Verification Failed',
                        text: data.message || 'Payment could not be verified.',
                        confirmButtonColor: '#dc2626',
                        background: '#1a1a1a',
                        color: '#fff'
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Verification Failed',
                    text: error.message || 'Network error occurred.',
                    background: '#1a1a1a',
                    color: '#fff'
                });
            }
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleDownloadPass = async () => {
        const pid = profile?.participant?.participant_id;
        const name = profile?.participant?.full_name;
        const college = profile?.participant?.college_name;
        const dept = profile?.participant?.department;
        const qrUrl = profile?.participant?.qr_code || localStorage.getItem('threads26_qr_code') || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=THREADS26_${pid}`;

        Swal.fire({
            title: 'Generating Pass...',
            html: 'Engaging neural printers...',
            didOpen: () => Swal.showLoading(),
            background: '#0a0a0a',
            color: '#fff'
        });

        try {
            const canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 920;
            const ctx = canvas.getContext('2d');

            // --- BACKGROUND LAYER ---
            ctx.fillStyle = '#05000a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Tech Grid (Subtle lines)
            ctx.strokeStyle = 'rgba(0, 243, 255, 0.08)';
            ctx.lineWidth = 1;
            for (let i = 0; i < canvas.width; i += 40) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
            }
            for (let i = 0; i < canvas.height; i += 40) {
                ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
            }

            // --- DECORATIVE BORDERS ---
            ctx.strokeStyle = '#00f3ff';
            ctx.lineWidth = 2;
            ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

            // Neon Glow Overlay
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00f3ff';
            ctx.strokeStyle = 'rgba(0, 243, 255, 0.5)';
            ctx.strokeRect(25, 25, canvas.width - 50, canvas.height - 50);
            ctx.shadowBlur = 0; // Reset glow

            // Corner Brackets
            const drawBracket = (x, y, w, h, rotation) => {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(rotation);
                ctx.fillStyle = '#bc13fe';
                ctx.fillRect(0, 0, w, 6);
                ctx.fillRect(0, 0, 6, h);
                ctx.restore();
            };
            drawBracket(20, 20, 50, 50, 0);
            drawBracket(canvas.width - 20, 20, 50, 50, Math.PI / 2);
            drawBracket(canvas.width - 20, canvas.height - 20, 50, 50, Math.PI);
            drawBracket(20, canvas.height - 20, 50, 50, -Math.PI / 2);

            // --- HEADER SECTION ---
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 65px Orbitron, sans-serif';
            ctx.fillText('THREADS\'26', canvas.width / 2, 110);

            ctx.fillStyle = '#00f3ff';
            ctx.font = 'bold 18px Orbitron, sans-serif';
            ctx.fillText('SONA COLLEGE OF TECHNOLOGY', canvas.width / 2, 145);

            // Decorative line
            const grad = ctx.createLinearGradient(100, 0, 500, 0);
            grad.addColorStop(0, 'transparent');
            grad.addColorStop(0.5, 'rgba(0, 243, 255, 0.5)');
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.fillRect(100, 170, 400, 2);

            // --- DATA SECTION ---
            const startY = 240;
            const lineSpacing = 100;

            const drawField = (label, value, y, large = false) => {
                // Background box for each field
                ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
                ctx.fillRect(70, y - 40, 460, 80);

                // Left border accent
                ctx.fillStyle = '#bc13fe';
                ctx.fillRect(70, y - 40, 4, 80);

                ctx.textAlign = 'left';
                ctx.fillStyle = 'rgba(0, 243, 255, 0.8)';
                ctx.font = 'bold 12px Orbitron, sans-serif';
                ctx.fillText(label, 90, y - 15);

                ctx.fillStyle = '#ffffff';
                ctx.font = `bold ${large ? 36 : 24}px Orbitron, sans-serif`;
                const displayValue = String(value || "N/A").toUpperCase();
                // Text truncation
                const maxW = 420;
                let text = displayValue;
                if (ctx.measureText(text).width > maxW) {
                    while (ctx.measureText(text + "...").width > maxW) {
                        text = text.slice(0, -1);
                    }
                    text += "...";
                }
                ctx.fillText(text, 90, y + 25);
            };

            drawField('PARTICIPANT ID', pid, startY, true);
            drawField('FULL NAME', name, startY + lineSpacing);
            drawField('COLLEGE', college, startY + lineSpacing * 2);
            drawField('DEPARTMENT', dept, startY + lineSpacing * 3);

            // --- FOOTER / QR SECTION ---
            const qrImg = new Image();
            qrImg.crossOrigin = "anonymous";
            qrImg.onload = () => {
                // QR Container
                const size = 220;
                const qrx = (canvas.width - size) / 2;
                const qry = 640;

                // Outer glow for QR
                ctx.shadowBlur = 20;
                ctx.shadowColor = 'rgba(0, 243, 255, 0.3)';
                ctx.fillStyle = '#ffffff';
                // Rounded rect for QR background
                const r = 20;
                ctx.beginPath();
                ctx.moveTo(qrx + r, qry);
                ctx.lineTo(qrx + size - r, qry);
                ctx.quadraticCurveTo(qrx + size, qry, qrx + size, qry + r);
                ctx.lineTo(qrx + size, qry + size - r);
                ctx.quadraticCurveTo(qrx + size, qry + size, qrx + size - r, qry + size);
                ctx.lineTo(qrx + r, qry + size);
                ctx.quadraticCurveTo(qrx, qry + size, qrx, qry + size - r);
                ctx.lineTo(qrx, qry + r);
                ctx.quadraticCurveTo(qrx, qry, qrx + r, qry);
                ctx.closePath();
                ctx.fill();
                ctx.shadowBlur = 0;

                // Draw QR Code
                const padding = 15;
                ctx.drawImage(qrImg, qrx + padding, qry + padding, size - padding * 2, size - padding * 2);

                // Pass info footer
                ctx.textAlign = 'center';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.font = '8px Orbitron, sans-serif';
                ctx.fillText('THREADS\'26 OFFICIAL ENTRY DOSSIER - SECURITY ENCRYPTED', canvas.width / 2, 895);

                const dataUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = `THREADS26_PASS_${pid}.png`;
                link.href = dataUrl;
                link.click();
                Swal.close();
            };
            qrImg.onerror = () => {
                throw new Error("Neural link to assets failed.");
            };
            qrImg.src = qrUrl;

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Dossier Error',
                text: 'System failure during pass generation. Please screenshot your portal.',
                background: '#0a0a0a',
                color: '#fff'
            });
        }
    };

    const logout = () => {
        localStorage.removeItem('threads26_participant_id');
        localStorage.removeItem('threads26_payment_ref');
        localStorage.removeItem('threads26_verification_status');
        localStorage.removeItem('threads26_last_reg_response');
        localStorage.removeItem('threads26_payment_qr_url');
        localStorage.removeItem('threads26_payment_amount');
        navigate('/home');
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="text-neon-cyan animate-spin" size={48} />
            </div>
        );
    }

    // ── Offline / cache-only view ──────────────────────────────────────────────
    if (!profile && offlineCache) {
        const c = offlineCache;
        const isVerified = (c.needs_payment === false);
        const isPendingLocal = localStorage.getItem('threads26_verification_status') === 'VERIFIED';
        const displayQr = (isVerified || isPendingLocal)
            ? (localStorage.getItem('threads26_qr_code') || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=THREADS26_${c.participant_id}`)
            : c._qrUrl;

        return (
            <div className="pt-24 px-4 md:px-8 min-h-screen max-w-5xl mx-auto pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl font-bold font-orbitron text-white mb-2">
                            PARTICIPANT <span className="text-neon-cyan">PORTAL</span>
                        </h1>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-3 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                                ⚠ OFFLINE MODE — LOCAL CACHE
                            </span>
                            <span className="text-gray-600 font-orbitron text-[10px]">ID: {c.participant_id}</span>
                        </div>
                    </motion.div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => { setOfflineCache(null); setLoading(true); fetchProfile(); }}
                            className="px-5 py-2 bg-neon-cyan text-black font-bold font-orbitron text-xs rounded-xl shadow-[0_0_10px_#00f3ff]"
                        >
                            RETRY SYNC
                        </button>
                        <button
                            onClick={logout}
                            className="px-5 py-2 bg-red-500/10 text-red-500 border border-red-500/30 rounded-xl font-bold font-orbitron text-xs"
                        >
                            LOGOUT
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: registrations + details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Event / Workshop breakdown */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
                            <h3 className="text-xl font-bold font-orbitron text-white mb-6 flex items-center gap-3">
                                <Calendar className="text-neon-cyan" /> REGISTERED EVENTS
                            </h3>
                            <div className="space-y-3">
                                {(c.breakdown?.events || []).map((ev, i) => (
                                    <div key={`ev-${i}`} className="flex justify-between items-center p-4 bg-black/20 border border-white/5 rounded-xl">
                                        <div>
                                            <div className="text-white font-bold font-orbitron text-sm">{ev.name}</div>
                                            <div className="text-[10px] text-gray-500 uppercase tracking-widest">EVENT</div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-[10px] font-black tracking-[0.2em] uppercase ${ev.status === 'Success' ? 'text-neon-green' : 'text-yellow-500'}`}>{ev.status}</div>
                                            <div className="text-[11px] text-gray-400 font-mono">₹{ev.amount}</div>
                                        </div>
                                    </div>
                                ))}
                                {(c.breakdown?.workshops || []).map((ws, i) => (
                                    <div key={`ws-${i}`} className="flex justify-between items-center p-4 bg-black/20 border border-white/5 rounded-xl">
                                        <div>
                                            <div className="text-white font-bold font-orbitron text-sm">{ws.name}</div>
                                            <div className="text-[10px] text-gray-500 uppercase tracking-widest">WORKSHOP</div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-[10px] font-black tracking-[0.2em] uppercase ${ws.status === 'Success' ? 'text-neon-green' : 'text-yellow-500'}`}>{ws.status}</div>
                                            <div className="text-[11px] text-gray-400 font-mono">₹{ws.amount}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Participant details */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
                            <h3 className="text-xl font-bold font-orbitron text-white mb-6">ENTITY DETAILS</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                <div>
                                    <label className="text-gray-500 uppercase text-[10px] font-black tracking-widest block mb-1">Full Name</label>
                                    <div className="text-white font-orbitron">{c.name}</div>
                                </div>
                                <div>
                                    <label className="text-gray-500 uppercase text-[10px] font-black tracking-widest block mb-1">Roll Number</label>
                                    <div className="text-white font-orbitron">{c.roll_number}</div>
                                </div>
                                <div>
                                    <label className="text-gray-500 uppercase text-[10px] font-black tracking-widest block mb-1">Year of Study</label>
                                    <div className="text-white font-orbitron">{c.year} Year</div>
                                </div>
                                <div>
                                    <label className="text-gray-500 uppercase text-[10px] font-black tracking-widest block mb-1">Events / Workshops</label>
                                    <div className="text-white font-orbitron">{c.events} event(s) · {c.workshops} workshop(s)</div>
                                </div>
                            </div>
                        </div>

                        {/* Server message */}
                        {c.message && (
                            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-300 text-xs font-mono">
                                ℹ {c.message}
                            </div>
                        )}
                    </div>

                    {/* Right sidebar: QR + amount */}
                    <div className="space-y-6">
                        <div className="bg-[#0f0f13] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500"></div>

                            {(isVerified || isPendingLocal) ? (
                                <div className="text-center">
                                    <h4 className="font-orbitron font-bold text-white mb-6 uppercase tracking-widest animate-pulse">Event Entry Pass</h4>
                                    <div className="bg-white p-4 rounded-2xl inline-block mb-6">
                                        <img src={displayQr} alt="Entry QR" className="w-48 h-48" />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <h4 className="font-orbitron font-bold text-yellow-500 mb-4 uppercase tracking-widest">Payment Required</h4>
                                    <div className="bg-white p-3 rounded-2xl inline-block mb-5 shadow-[0_0_25px_rgba(253,200,0,0.12)]">
                                        <img src={displayQr} alt="UPI QR" className="w-44 h-44" />
                                    </div>
                                    <div className="text-left bg-black/40 p-4 rounded-xl mb-5 font-mono text-xs border border-yellow-500/10">
                                        <p className="text-yellow-400 font-bold mb-3 text-[10px] uppercase tracking-widest">SCAN &amp; PAY</p>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-500">Amount:</span>
                                            <span className="text-neon-green font-bold text-sm">₹{c.total_amount}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-500">UPI ID:</span>
                                            <span className="text-white">rajikutty106@okaxis</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Ref:</span>
                                            <span className="text-neon-cyan truncate ml-2 font-bold max-w-[160px]">{c.payment_ref || c.payment_reference}</span>
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-gray-500 italic mb-3">Portal offline — reconnect to verify payment</p>
                                </div>
                            )}
                        </div>

                        {/* Financial snapshot */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h4 className="font-orbitron font-bold text-neon-cyan mb-4 text-xs uppercase tracking-[0.2em]">Financial Snapshot</h4>
                            <div className="space-y-3 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Events ({c.events}):</span>
                                    <span className="text-white font-bold">₹{c.events_amount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Workshops ({c.workshops}):</span>
                                    <span className="text-white font-bold">₹{c.workshops_amount}</span>
                                </div>
                                <div className="border-t border-white/10 pt-3 flex justify-between">
                                    <span className="text-gray-400 font-bold">Total Due:</span>
                                    <span className="text-neon-green font-bold text-sm">₹{c.total_amount}</span>
                                </div>
                            </div>
                        </div>

                        {/* Raw cache reference */}
                        <div className="bg-white/5 border border-dashed border-white/20 rounded-2xl p-6">
                            <h4 className="font-orbitron font-bold text-gray-500 mb-3 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                                LOCAL CACHE REFERENCE
                            </h4>
                            <p className="text-[10px] text-gray-400 italic mb-3">Stored copy of your last server response. Show this to coordinators if you face any issues.</p>
                            <div className="bg-black/40 p-3 rounded-lg border border-white/5 overflow-hidden">
                                <pre className="text-[9px] text-gray-500 font-mono break-all whitespace-pre-wrap max-h-40 overflow-y-auto">
                                    {JSON.stringify(c, null, 2)}
                                </pre>
                            </div>
                            <button
                                onClick={() => { navigator.clipboard.writeText(JSON.stringify(c, null, 2)); alert('Reference data copied to clipboard!'); }}
                                className="w-full text-[9px] font-bold text-neon-cyan hover:text-white transition-colors uppercase tracking-widest mt-3"
                            >
                                Copy Reference Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pt-32 px-4 min-h-screen flex flex-col items-center justify-center text-center">
                <AlertTriangle className="text-red-500 mb-6" size={64} />
                <h1 className="text-4xl font-bold font-orbitron text-white mb-6 tracking-tighter">PORTAL <span className="text-red-500">ERROR</span></h1>
                <p className="text-gray-400 mb-8 max-w-md italic">{error}</p>
                <div className="flex gap-4">
                    <button onClick={() => { localStorage.removeItem('threads26_participant_id'); window.location.reload(); }} className="px-8 py-3 bg-red-500/20 text-red-500 border border-red-500/30 font-bold font-orbitron rounded">RESET DATA</button>
                    <button onClick={() => window.location.reload()} className="px-8 py-3 bg-neon-cyan text-black font-bold font-orbitron rounded shadow-[0_0_15px_#00f3ff]">RETRY SYNC</button>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="pt-32 px-4 min-h-screen flex flex-col items-center justify-center text-center">
                <h1 className="text-4xl font-bold font-orbitron text-white mb-6">PORTAL <span className="text-neon-cyan">LOCKED</span></h1>
                <p className="text-gray-400 mb-8 max-w-md italic">No active registration found on this device. Please register or enter your ID.</p>
                <div className="flex gap-4">
                    <Link to="/register" className="px-8 py-3 bg-neon-cyan text-black font-bold font-orbitron rounded shadow-[0_0_15px_#00f3ff]">REGISTER NOW</Link>
                    <button
                        onClick={() => {
                            const pid = prompt('Enter Participant ID:');
                            if (pid) {
                                localStorage.setItem('threads26_participant_id', pid);
                                fetchProfile();
                            }
                        }}
                        className="px-8 py-3 border border-white/20 text-white font-bold font-orbitron rounded hover:bg-white/5"
                    >
                        ENTER ID
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="pt-24 px-4 md:px-8 min-h-screen max-w-7xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold font-orbitron text-white mb-2">
                        PARTICIPANT <span className="text-neon-cyan">PORTAL</span>
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase ${profile.verification_status === 'ADMIN_VERIFIED' ? 'bg-neon-green/10 text-neon-green border border-neon-green/30' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'}`}>
                            {profile.verification_status === 'ADMIN_VERIFIED'
                                ? 'VERIFIED'
                                : (profile.verification_status === 'AUTO_VERIFIED' || profile.verification_status === 'VERIFIED' || localStorage.getItem('threads26_verification_status') === 'VERIFIED'
                                    ? 'Transaction id will be verified soon'
                                    : profile.verification_status)}
                        </span>
                        <span className="text-gray-600 font-orbitron text-[10px]">ID: {profile.participant.participant_id}</span>
                    </div>
                </motion.div>

                <div className="flex gap-4">
                    <button onClick={fetchProfile} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:text-neon-cyan transition-colors">
                        <RefreshCw size={20} />
                    </button>
                    <button onClick={logout} className="px-6 py-2 bg-red-500/10 text-red-500 border border-red-500/30 rounded-xl hover:bg-red-500 hover:text-white transition-all font-bold font-orbitron text-xs">
                        LOGOUT
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Flow */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Event Registrations */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
                        <h3 className="text-xl font-bold font-orbitron text-white mb-6 flex items-center gap-3">
                            <Calendar className="text-neon-cyan" /> REGISTERED EVENTS
                        </h3>

                        <div className="space-y-4">
                            {profile.registrations.map((reg, idx) => (
                                <div key={idx} className="flex justify-between items-center p-4 bg-black/20 border border-white/5 rounded-xl group hover:border-neon-cyan/30 transition-all">
                                    <div>
                                        <div className="text-white font-bold font-orbitron text-sm">{reg.event_name}</div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">{reg.event_type} • Day {reg.day}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-[10px] font-black tracking-[0.2em] uppercase ${reg.payment_status === 'Success' ? 'text-neon-green' : 'text-yellow-500'}`}>
                                            {reg.payment_status}
                                        </div>
                                        <div className="text-[11px] text-gray-400 font-mono">
                                            {reg.amount_paid > 0 ? `₹${reg.amount_paid}` : ''}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Personal Info */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
                        <h3 className="text-xl font-bold font-orbitron text-white mb-6">ENTITY DETAILS</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                            <div>
                                <label className="text-gray-500 uppercase text-[10px] font-black tracking-widest block mb-1">Full Name</label>
                                <div className="text-white font-orbitron">{profile.participant.full_name}</div>
                            </div>
                            <div>
                                <label className="text-gray-500 uppercase text-[10px] font-black tracking-widest block mb-1">College</label>
                                <div className="text-white font-orbitron">{profile.participant.college_name}</div>
                            </div>
                            <div>
                                <label className="text-gray-500 uppercase text-[10px] font-black tracking-widest block mb-1">Department</label>
                                <div className="text-white font-orbitron">{profile.participant.department} ({profile.participant.year_of_study} Year)</div>
                            </div>
                            <div>
                                <label className="text-gray-500 uppercase text-[10px] font-black tracking-widest block mb-1">Communication</label>
                                <div className="text-white font-orbitron">{profile.participant.email}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Flow */}
                <div className="space-y-6">
                    {/* Payment/QR Logic */}
                    <div className="bg-[#0f0f13] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan to-neon-purple"></div>

                        {profile.verification_status === 'ADMIN_VERIFIED' ||
                            profile.verification_status === 'AUTO_VERIFIED' ||
                            profile.verification_status === 'VERIFIED' ||
                            localStorage.getItem('threads26_verification_status') === 'VERIFIED' ||
                            (profile.payment_summary?.total_amount === 0 && profile.registrations?.length > 0) ? (
                            <div className="text-center">
                                <h4 className="font-orbitron font-bold text-white mb-6 uppercase tracking-widest animate-pulse">Event Entry Pass</h4>
                                <div className="bg-white p-4 rounded-2xl inline-block mb-6 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                                    <img
                                        src={profile.participant.qr_code || localStorage.getItem('threads26_qr_code') || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=THREADS26_${profile.participant.participant_id}`}
                                        alt="Entry QR"
                                        className="w-48 h-48"
                                    />
                                </div>
                                <button
                                    onClick={handleDownloadPass}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-neon-cyan text-black font-bold font-orbitron text-xs hover:bg-neon-purple hover:text-white transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                                >
                                    <Download size={14} /> DOWNLOAD PASS
                                </button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <h4 className="font-orbitron font-bold text-yellow-500 mb-6 uppercase tracking-widest">Payment Required</h4>
                                {qrUrl && (
                                    <div className="bg-white p-4 rounded-2xl inline-block mb-6 shadow-[0_0_30px_rgba(253,200,0,0.1)]">
                                        <img src={qrUrl} alt="UPI QR" className="w-44 h-44" />
                                    </div>
                                )}
                                {/* Payment details — pulled from local cache for accuracy */}
                                {(() => {
                                    let amount = profile.payment_summary?.total_amount || 0;
                                    let ref = `THREADS26-${profile.participant?.participant_id}`;
                                    try {
                                        const cached = JSON.parse(localStorage.getItem('threads26_last_reg_response') || '{}');
                                        if (cached.total_amount) amount = cached.total_amount;
                                        if (cached.payment_ref) ref = cached.payment_ref;
                                        else if (cached.payment_reference) ref = cached.payment_reference;
                                    } catch { }
                                    return (
                                        <div className="text-left bg-black/40 p-4 rounded-xl mb-6 font-mono text-xs border border-yellow-500/10">
                                            <p className="text-yellow-400 font-bold mb-3 text-[10px] uppercase tracking-widest">SCAN &amp; PAY</p>
                                            {amount > 0 && (
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-gray-500">Amount:</span>
                                                    <span className="text-neon-green font-bold text-sm">₹{amount}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-500">UPI ID:</span>
                                                <span className="text-white">rajikutty106@okaxis</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Ref:</span>
                                                <span className="text-neon-cyan truncate ml-2 font-bold max-w-[160px]">{ref}</span>
                                            </div>
                                        </div>
                                    );
                                })()}

                                <div className="mb-6">
                                    <p className="text-xs text-gray-400 mb-2 text-left font-orbitron uppercase tracking-widest">Transaction ID <span className="text-red-500">*</span></p>
                                    <input
                                        type="text"
                                        value={txnId}
                                        onChange={(e) => setTxnId(e.target.value)}
                                        className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-neon-cyan transition-all font-mono text-sm placeholder:text-gray-700"
                                        placeholder="Enter UPI Transaction ID"
                                    />
                                    <p className="text-[10px] text-gray-600 mt-2 text-left italic">Enter the 12-digit UTR from your payment app</p>
                                </div>
                                <button
                                    onClick={handleVerifyClick}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-neon-cyan text-black font-bold font-orbitron text-xs hover:bg-neon-purple hover:text-white transition-all uppercase tracking-widest shadow-[0_0_15px_rgba(0,243,255,0.2)]"
                                >
                                    <ShieldCheck size={16} /> Verify Transaction
                                </button>

                                <p className="text-[9px] text-gray-500 text-center italic">Use manual verification if you face any payment issues</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h4 className="font-orbitron font-bold text-neon-cyan mb-4 text-xs uppercase tracking-[0.2em]">Financial Snapshot</h4>
                        <div className="space-y-4">
                            {profile.payment_summary.total_amount > 0 && (
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500">Total Due:</span>
                                    <span className="text-white font-bold">₹{profile.payment_summary.total_amount}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-500">Status:</span>
                                <span className={(profile.verification_status === 'ADMIN_VERIFIED' || profile.verification_status === 'VERIFIED') ? 'text-neon-green font-bold' : 'text-yellow-500 font-bold'}>
                                    {profile.verification_status === 'ADMIN_VERIFIED' || profile.verification_status === 'VERIFIED'
                                        ? 'VERIFIED'
                                        : (profile.verification_status === 'AUTO_VERIFIED' || localStorage.getItem('threads26_verification_status') === 'VERIFIED'
                                            ? 'Verified soon'
                                            : profile.verification_status)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Reference Information */}
                    {localStorage.getItem('threads26_last_reg_response') && (
                        <div className="bg-white/5 border border-dashed border-white/20 rounded-2xl p-6">
                            <h4 className="font-orbitron font-bold text-gray-500 mb-4 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                                LOCAL CACHE REFERENCE
                            </h4>
                            <div className="space-y-2">
                                <p className="text-[10px] text-gray-400 italic leading-tight">
                                    Stored copy of your last server response. Show this to coordinators if you face any issues.
                                </p>
                                <div className="bg-black/40 p-3 rounded-lg border border-white/5 overflow-hidden">
                                    <pre className="text-[9px] text-gray-500 font-mono break-all whitespace-pre-wrap max-h-40 overflow-y-auto">
                                        {(() => {
                                            try {
                                                const raw = localStorage.getItem('threads26_last_reg_response');
                                                const parsed = JSON.parse(raw);
                                                return JSON.stringify(parsed, null, 2);
                                            } catch (e) {
                                                return "Data corrupted";
                                            }
                                        })()}
                                    </pre>
                                </div>
                                <button
                                    onClick={() => {
                                        const raw = localStorage.getItem('threads26_last_reg_response');
                                        navigator.clipboard.writeText(raw);
                                        alert('Reference data copied to clipboard!');
                                    }}
                                    className="w-full text-[9px] font-bold text-neon-cyan hover:text-white transition-colors uppercase tracking-widest mt-2"
                                >
                                    Copy Reference ID
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const PortalCard = ({ title, desc, icon, link }) => (
    <Link to={link || "#"} className="group relative bg-[#0f0f13] border border-white/10 p-6 rounded-2xl hover:border-neon-cyan/50 hover:shadow-[0_0_20px_rgba(0,243,255,0.1)] transition-all overflow-hidden">
        <div className="mb-4 p-3 rounded-xl bg-white/5 w-fit group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-lg font-bold font-orbitron text-white mb-2 group-hover:text-neon-cyan transition-colors">{title}</h3>
        <p className="text-sm text-gray-500 leading-tight">{desc}</p>
    </Link>
);

export default ParticipantPortal;
