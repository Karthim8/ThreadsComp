

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft, AlertCircle, Loader2, Calendar, Zap, Shield, Info, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loadEvents, submitRegistration, sendOTP, verifyOTP, verifyPayment as verifyPaymentAPI } from '../services/api';
import Swal from 'sweetalert2';

// Zod Schema updated - removed accommodation
const schema = z.object({
    fullName: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    gender: z.enum(["Male", "Female", "Other"], { required_error: "Select gender" }),
    mobile: z.string().regex(/^[0-9]{10}$/, "Invalid mobile number"),
    college: z.string().min(3, "College name required"),
    department: z.string().min(1, "Department selection required"),
    otherDepartment: z.string().optional(),
    year: z.enum(["1", "2", "3", "4"], { required_error: "Select year" }),
    city: z.string().optional(),
    state: z.string().optional(),
    workshop_selections: z.array(z.string()).max(1, "Only one workshop allowed"),
    event_selections: z.array(z.string()).default([])
}).refine((data) => {
    if (data.department === "OTHERS" && (!data.otherDepartment || data.otherDepartment.trim() === "")) {
        return false;
    }
    return true;
}, {
    message: "Please enter your department name",
    path: ["otherDepartment"]
});

const steps = [
    { number: 1, title: 'Personal Info' },
    { number: 2, title: 'College Info' },
    { number: 3, title: 'Event Selection' },
    { number: 4, title: 'Payment' }
];

const Register = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false); // Controls visibility of the main form
    const [otpSent, setOtpSent] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [verificationToken, setVerificationToken] = useState(null);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [isPaymentPending, setIsPaymentPending] = useState(false);
    const navigate = useNavigate();

    const { register, handleSubmit, watch, formState: { errors }, setValue, getValues, trigger } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            workshop_selections: [],
            event_selections: []
        }
    });

    const formData = watch();

    /* ── Refs for Robust Event Handling ── */
    const formDataRef = useRef({});
    const submittingRef = useRef(submitting);
    const stepRef = useRef(currentStep);

    useEffect(() => { formDataRef.current = formData; }, [formData]);
    useEffect(() => { submittingRef.current = submitting; }, [submitting]);
    useEffect(() => { stepRef.current = currentStep; }, [currentStep]);

    /* ── Prevent Refresh & Back Navigation ── */
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            const data = formDataRef.current;
            const isSubmitting = submittingRef.current;
            const step = stepRef.current;

            const isDirty = data.fullName || data.email || data.mobile || data.college;
            const shouldWarn = step > 1 || isSubmitting || (isDirty && String(isDirty).length > 0);

            if (shouldWarn) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        };

        const handlePopState = (e) => {
            const data = formDataRef.current;
            const isSubmitting = submittingRef.current;
            const step = stepRef.current;

            const isDirty = data.fullName || data.email || data.mobile || data.college;
            const shouldWarn = step > 1 || isSubmitting || (isDirty && String(isDirty).length > 0);

            if (shouldWarn) {
                window.history.pushState(null, document.title, window.location.href);
                Swal.fire({
                    icon: 'warning',
                    title: 'Registration in Progress',
                    text: 'If you leave now, your progress will be lost.',
                    showCancelButton: true,
                    confirmButtonText: 'Stay Here',
                    cancelButtonText: 'Leave',
                    confirmButtonColor: '#00f3ff',
                    cancelButtonColor: '#dc2626',
                    background: '#1a1a1a',
                    color: '#fff'
                });
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.history.pushState(null, document.title, window.location.href);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await loadEvents();
            setEvents(data.events || []);
        } catch (err) {
            console.error('Failed to load events:', err);
            setError('The registration server is taking a moment to wake up. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (localStorage.getItem('threads26_participant_id')) {
            navigate('/portal');
            return;
        }
        fetchEvents();
    }, []);

    const workshops = events.filter(e => e.event_type === 'workshop');
    const technicalEvents = events.filter(e => e.event_type !== 'workshop' && e.event_type?.toLowerCase() === 'technical');
    const nonTechnicalEvents = events.filter(e => e.event_type !== 'workshop' && (e.event_type?.toLowerCase() === 'non technical' || e.event_type?.toLowerCase() === 'non-technical'));

    const calculateTotal = () => {
        let total = 0;
        // Workshop fee: ₹400 per workshop
        total += formData.workshop_selections.length * 400;
        // Event fee: flat ₹300 for ALL events combined (regardless of how many)
        if (formData.event_selections.length > 0) {
            total += 300;
        }
        return total;
    };

    const validateStep3 = () => {
        // Check if user has selected any non-technical events without technical events
        const hasTechnicalSelected = formData.event_selections.some(id => {
            const event = events.find(e => e.event_id.toString() === id.toString());
            return event?.event_type?.toLowerCase() === 'technical';
        });

        const hasNonTechnicalSelected = formData.event_selections.some(id => {
            const event = events.find(e => e.event_id.toString() === id.toString());
            return event?.event_type?.toLowerCase() === 'non technical' ||
                event?.event_type?.toLowerCase() === 'non-technical';
        });

        // If user has non-technical events but no technical events
        if (hasNonTechnicalSelected && !hasTechnicalSelected) {
            Swal.fire({
                icon: 'warning',
                title: 'Technical Event Required',
                text: 'To register for Non-Technical events, you must select at least one Technical event.',
                confirmButtonColor: '#a855f7',
                background: '#1a1a1a',
                color: '#fff'
            });
            return false;
        }

        return true;
    };

    const handleSendOTP = async () => {
        const { fullName, email } = getValues();
        setVerifyingOtp(true);
        try {
            await sendOTP({ name: fullName, email });
            setOtpSent(true);
            Swal.fire({
                icon: 'success',
                title: 'OTP Sent',
                text: 'Please check your email for the verification code.',
                toast: true,
                position: 'top-end',
                timer: 3000,
                showConfirmButton: false,
                background: '#1a1a1a',
                color: '#fff'
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Failed to send OTP',
                text: error.message,
                confirmButtonColor: '#00f3ff',
                background: '#1a1a1a',
                color: '#fff'
            });
        } finally {
            setVerifyingOtp(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otpValue || otpValue.length !== 6) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid OTP',
                text: 'Please enter a 6-digit code.',
                toast: true,
                position: 'top-end',
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }

        setVerifyingOtp(true);
        try {
            const { email } = getValues();
            const result = await verifyOTP({ email, otp: otpValue });
            setVerificationToken(result.verification_token);
            setIsOtpVerified(true);
            setOtpSent(false);
            setCurrentStep(2);
            Swal.fire({
                icon: 'success',
                title: 'Email Verified',
                text: 'You can now proceed with registration.',
                toast: true,
                position: 'top-end',
                timer: 2000,
                showConfirmButton: false,
                background: '#1a1a1a',
                color: '#fff'
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Verification Failed',
                text: error.message,
                confirmButtonColor: '#00f3ff',
                background: '#1a1a1a',
                color: '#fff'
            });
        } finally {
            setVerifyingOtp(false);
        }
    };

    const nextStep = async () => {
        let fieldsValidate = [];
        if (currentStep === 1) fieldsValidate = ['fullName', 'email', 'gender', 'mobile'];
        if (currentStep === 2) fieldsValidate = ['college', 'department', 'year'];

        const isValid = await trigger(fieldsValidate);
        if (!isValid) return;

        if (currentStep === 1 && !isOtpVerified) {
            handleSendOTP();
            return;
        }

        if (currentStep === 3) {
            if (validateStep3()) {
                setCurrentStep(prev => prev + 1);
            }
            return;
        }

        setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => setCurrentStep(prev => prev - 1);

    const handleSuccess = async (data) => {
        const pid = data.participant_id;
        const name = data.participant_name || data.name || getValues('fullName');

        if (pid) {
            localStorage.setItem('threads26_participant_id', String(pid));
            localStorage.setItem('threads26_last_reg_response', JSON.stringify(data));
        }

        if (data.qr) {
            localStorage.setItem('threads26_qr_code', data.qr);
        }

        await Swal.fire({
            icon: 'success',
            title: 'Registration Successful!',
            html: `
                <div class="text-left space-y-2">
                    <p><strong class="text-neon-cyan">Name:</strong> ${name}</p>
                    <p><strong class="text-neon-cyan">ID:</strong> ${pid}</p>
                    <div class="mt-4 p-3 bg-green-900/30 border border-green-500/30 rounded text-green-400 text-sm">
                        Registration complete! Redirecting to your portal...
                    </div>
                </div>
            `,
            confirmButtonColor: '#10b981',
            confirmButtonText: 'Go to Portal',
            background: '#1a1a1a',
            color: '#fff',
            width: '32rem',
            timer: 3000,
            timerProgressBar: true
        });

        navigate('/portal');
    };

    const handlePaymentRequired = async (data) => {
        const participantId = data.participant_id;
        const amount = (data.payment_options && data.payment_options.amount) || data.total_amount || 0;
        const reference = data.payment_reference || data.payment_ref || ('THREADS26-' + participantId);
        const upiId = 'rajikutty106@okaxis';
        const payeeName = "THREADS'26";

        const upiUrl = 'upi://pay?pa=' + upiId + '&pn=' + encodeURIComponent(payeeName) + '&am=' + amount + '&cu=INR&tn=' + encodeURIComponent(reference);
        const qrImage = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=' + encodeURIComponent(upiUrl);

        let isVerifiedLocally = false;

        while (!isVerifiedLocally) {
            const result = await Swal.fire({
                title: 'Payment Required - Rs.' + amount,
                html: '<div class="text-left space-y-4 mb-4">' +
                    '<div class="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">' +
                    '<p class="font-bold text-white mb-2">Scan and Pay (UPI)</p>' +
                    '<img src="' + qrImage + '" alt="UPI QR Code" class="mx-auto rounded-lg mb-2 border-4 border-white" style="max-width: 180px;" />' +
                    '<p class="text-2xl font-bold text-amber-400">Rs.' + amount + '</p>' +
                    '<p class="text-xs text-gray-400 mt-1">Ref: ' + reference + '</p>' +
                    '</div>' +
                    '<div>' +
                    '<p class="text-[10px] text-amber-400/80 mb-2 italic">(Enter valid transaction id and It will verified soon and displayed on portal page )</p>' +
                    '<p class="text-sm text-gray-400 mb-1">Transaction ID <span class="text-red-500">*</span></p>' +
                    '<input id="swal-txn-id" class="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white" placeholder="Enter UPI / Transaction ID">' +
                    '<p class="text-xs text-gray-500 mt-1">Min. 5 characters from your payment app</p>' +
                    '</div>' +
                    '</div>',
                showCancelButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: 'Verify Payment',
                confirmButtonColor: '#10b981',
                background: '#1a1a1a',
                color: '#fff',
                width: '32rem',
                preConfirm: () => {
                    const txnId = document.getElementById('swal-txn-id').value.trim();
                    if (!txnId || txnId.length < 5) {
                        Swal.showValidationMessage('Please enter a valid Transaction ID (min 5 characters)');
                        return false;
                    }
                    return { txnId };
                }
            });

            if (result.isConfirmed) {
                const { txnId } = result.value;
                const verifyPayload = {
                    participant_id: participantId,
                    transaction_id: txnId,
                    amount: amount
                };

                try {
                    const verified = await localVerifyPayment(verifyPayload);
                    if (verified) {
                        isVerifiedLocally = true;
                        setIsPaymentPending(false);
                    }
                } catch (e) {
                    console.error('Verify loop error:', e);
                }
            }
        }
    };

    const localVerifyPayment = async (paymentDetails) => {
        Swal.fire({
            title: 'Verifying Payment...',
            html: 'Please wait while we confirm your payment.',
            didOpen: () => Swal.showLoading(),
            background: '#1a1a1a',
            color: '#fff',
            allowOutsideClick: false
        });

        try {
            const data = await verifyPaymentAPI({
                participant_id: paymentDetails.participant_id,
                transaction_id: paymentDetails.transaction_id,
                amount: paymentDetails.amount,
                payment_method: 'UPI'
            });

            if (data.success || data.verified) {
                if (data.qr_code) {
                    localStorage.setItem('threads26_qr_code', data.qr_code);
                }
                localStorage.setItem('threads26_verification_status', 'VERIFIED');

                await Swal.fire({
                    icon: 'success',
                    title: 'Transaction id will be verified soon',
                    html: `
                        <div class="text-left space-y-2">
                            <p><strong class="text-green-400">Name:</strong> ${data.name || 'Confirmed'}</p>
                            <p><strong class="text-green-400">ID:</strong> ${data.participant_id || paymentDetails.participant_id}</p>
                            <p><strong class="text-green-400">Amount Paid:</strong> ₹${data.amount_paid || paymentDetails.amount}</p>
                            <div class="mt-4 p-3 bg-green-900/30 border border-green-500/30 rounded text-green-400 text-sm">
                                Redirecting to your portal...
                            </div>
                        </div>
                    `,
                    confirmButtonColor: '#10b981',
                    confirmButtonText: 'Go to Portal',
                    background: '#1a1a1a',
                    color: '#fff',
                    timer: 3000,
                    timerProgressBar: true
                });
                navigate('/portal');
                return true;
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Verification Failed',
                    text: data.details || data.error || 'Payment could not be verified.',
                    confirmButtonColor: '#dc2626',
                    background: '#1a1a1a',
                    color: '#fff'
                });
                return false;
            }
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Verification Error',
                text: error.message || 'Network error occurred.',
                confirmButtonColor: '#dc2626',
                background: '#1a1a1a',
                color: '#fff'
            });
            return false;
        }
    };

    const onSubmit = async (data) => {
        setSubmitting(true);

        // Clear previous registration session data to prevent test overlap
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('threads26_')) {
                localStorage.removeItem(key);
            }
        });
        try {
            const payload = {
                full_name: data.fullName,
                email: data.email,
                gender: data.gender,
                phone: data.mobile,
                college_name: data.college,
                department: data.department === 'OTHERS' ? data.otherDepartment : data.department,
                year_of_study: parseInt(data.year),
                city: data.city || '',
                state: data.state || '',
                workshop_selections: data.workshop_selections,
                event_selections: data.event_selections,
                verification_token: verificationToken
            };

            const result = await submitRegistration(payload);

            // Store registration info — use actual backend field names
            localStorage.setItem('threads26_participant_id', String(result.participant_id));
            localStorage.setItem('threads26_payment_ref', result.payment_ref || result.payment_reference || '');
            localStorage.setItem('threads26_last_reg_response', JSON.stringify(result));

            // ✅ Store payment amount so it survives an accidental page refresh
            const totalAmount = result.total_amount || result.amount || 0;
            localStorage.setItem('threads26_payment_amount', String(totalAmount));
            setSubmitting(false);

            if (totalAmount === 0) {
                await handleSuccess(result);
            } else {
                setIsPaymentPending(true);
                await handlePaymentRequired(result);
            }
        } catch (error) {
            setSubmitting(false);
            console.error('Registration error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: error.message,
                confirmButtonColor: '#00f3ff',
                background: '#1a1a1a',
                color: '#fff'
            });
        }
    };

    const handleToggle = (id, type) => {
        const field = type === 'workshop' ? 'workshop_selections' : 'event_selections';
        const current = getValues(field) || [];
        const stringId = id.toString();

        // Find the selected event from the events array
        const selectedEvent = events.find(event => event.event_id.toString() === stringId);

        // Check if it's a non-technical event
        const isNonTechnical = selectedEvent?.event_type?.toLowerCase() === 'non technical' ||
            selectedEvent?.event_type?.toLowerCase() === 'non-technical';

        // Check if user has any technical events selected
        const hasTechnicalSelected = getValues('event_selections')?.some(id => {
            const event = events.find(e => e.event_id.toString() === id.toString());
            return event?.event_type?.toLowerCase() === 'technical';
        });

        if (type === 'workshop') {
            setValue(field, [stringId]);
            return;
        }

        if (type === 'event') {
            // If trying to select non-technical but no technical selected
            if (!current.includes(stringId) && isNonTechnical && !hasTechnicalSelected) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Technical Event Required',
                    text: 'Please select at least one Technical event before selecting Non-Technical events.',
                    confirmButtonColor: '#a855f7',
                    background: '#1a1a1a',
                    color: '#fff',
                    toast: true,
                    position: 'top-end',
                    timer: 3000,
                    showConfirmButton: false
                });
                return;
            }
        }

        if (current.includes(stringId)) {
            setValue(field, current.filter(e => e !== stringId));
        } else {
            setValue(field, [...current, stringId]);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <Loader2 className="text-neon-cyan animate-spin" size={48} />
                <p className="text-gray-400 font-orbitron animate-pulse">Initializing Portal...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl max-w-md">
                    <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
                    <h2 className="text-xl font-orbitron text-white mb-2">Connection Issues</h2>
                    <p className="text-gray-400 text-sm mb-6">{error}</p>
                    <button
                        onClick={fetchEvents}
                        className="px-8 py-3 bg-neon-cyan text-black font-bold font-orbitron hover:shadow-[0_0_15px_#00f3ff] transition-all"
                    >
                        RETRY CONNECTION
                    </button>
                </div>
            </div>
        );
    }

    const SelectionScreen = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-[60vh] w-full"
        >
            <h1 className="text-4xl md:text-6xl font-black font-orbitron text-center mb-16 uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]">
                Choose Your Path
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* General Registration Card */}
                <div
                    onClick={() => {
                        if (localStorage.getItem('threads26_participant_id')) {
                            navigate('/portal');
                        } else {
                            setShowForm(true);
                        }
                    }}
                    className="group relative h-64 md:h-80 bg-black/40 border border-white/10 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:border-neon-cyan hover:shadow-[0_0_30px_rgba(0,243,255,0.3)] hover:-translate-y-2 flex flex-col items-center justify-center gap-6"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:border-neon-cyan group-hover:bg-neon-cyan/10 transition-all duration-500">
                        <User size={40} className="text-gray-400 group-hover:text-neon-cyan transition-colors" />
                    </div>
                    <div className="text-center z-10">
                        <h2 className="text-2xl font-bold font-orbitron text-white mb-2 group-hover:text-neon-cyan transition-colors tracking-wider">REGISTER</h2>
                        <p className="text-gray-400 text-sm font-mono group-hover:text-gray-300">Open to All Colleges</p>
                    </div>
                </div>

                {/* Sona CSE Registration Card */}
                <div
                    onClick={() => {
                        if (localStorage.getItem('threads26_participant_id')) {
                            navigate('/portal');
                        } else {
                            navigate('/register/cse');
                        }
                    }}
                    className="group relative h-64 md:h-80 bg-black/40 border border-white/10 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:border-neon-purple hover:shadow-[0_0_30px_rgba(188,19,254,0.3)] hover:-translate-y-2 flex flex-col items-center justify-center gap-6"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:border-neon-purple group-hover:bg-neon-purple/10 transition-all duration-500">
                        <Shield size={40} className="text-gray-400 group-hover:text-neon-purple transition-colors" />
                    </div>
                    <div className="text-center z-10">
                        <h2 className="text-2xl font-bold font-orbitron text-white mb-2 group-hover:text-neon-purple transition-colors tracking-wider">SONA CSE REGISTER</h2>
                        <p className="text-gray-400 text-sm font-mono group-hover:text-gray-300">Department Exclusive</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
                {!showForm ? (
                    <SelectionScreen key="selection" />
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="max-w-4xl mx-auto"
                    >
                        <button
                            onClick={() => setShowForm(false)}
                            className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-orbitron text-sm uppercase tracking-widest group"
                        >
                            <ChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Selection
                        </button>

                        <div className="mb-12">
                            <div className="flex justify-between relative mb-8">
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -z-10 transform -translate-y-1/2"></div>
                                <div className="absolute top-1/2 left-0 h-1 bg-neon-cyan -z-10 transform -translate-y-1/2 transition-all duration-500" style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}></div>

                                {steps.map((step) => (
                                    <div key={step.number} className={`flex flex-col items-center gap-2 ${currentStep >= step.number ? 'text-neon-cyan' : 'text-gray-500'}`}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold transition-all duration-300 bg-[#0a0a0a] ${currentStep >= step.number ? 'border-neon-cyan text-neon-cyan shadow-[0_0_10px_#00f3ff]' : 'border-gray-700 text-gray-500'}`}>
                                            {step.number < currentStep ? <Check size={20} /> : step.number}
                                        </div>
                                        <span className="text-sm font-orbitron hidden sm:block">{step.title}</span>
                                    </div>
                                ))}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold font-orbitron text-center mb-2 uppercase">Step into Thread'S</h1>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="bg-white/5 border border-white/10 p-8 rounded-2xl relative overflow-hidden backdrop-blur-md">
                            <AnimatePresence mode="wait">
                                {currentStep === 1 && (
                                    <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                                        <Input label="Full Name" name="fullName" register={register} error={errors.fullName} placeholder="Enter your Name" disabled={isOtpVerified} />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input label="Email Address" name="email" type="email" register={register} error={errors.email} placeholder="Enter your Email Id" disabled={isOtpVerified} />
                                            <Select label="Gender" name="gender" register={register} error={errors.gender} options={['Male', 'Female', 'Other']} disabled={isOtpVerified} />
                                        </div>
                                        <Input label="Mobile Number" name="mobile" type="tel" register={register} error={errors.mobile} placeholder="Mobile Number" disabled={isOtpVerified} />

                                        {isOtpVerified && (
                                            <div className="flex items-center gap-2 text-green-400 font-bold font-orbitron text-xs uppercase tracking-widest bg-green-400/10 p-3 rounded-lg border border-green-400/20">
                                                <Check size={16} /> Email Verified Successfully
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {otpSent && (
                                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl max-w-sm w-full space-y-6 shadow-[0_0_50px_rgba(0,243,255,0.1)]"
                                        >
                                            <div className="text-center">
                                                <Shield className="text-neon-cyan mx-auto mb-4" size={48} />
                                                <h3 className="text-xl font-bold font-orbitron text-white uppercase tracking-widest">Verify Email</h3>
                                                <p className="text-gray-400 text-sm font-orbitron">
                                                    Enter the 6-digit code sent to your email.
                                                </p>
                                                <p className="text-yellow-400/80 text-xs font-orbitron mt-1">
                                                    ⚠️ Can't find it? Check your <span className="font-bold text-yellow-400">spam or junk</span> folder.
                                                </p>
                                            </div>

                                            <div className="space-y-4">
                                                <input
                                                    type="text"
                                                    maxLength={6}
                                                    value={otpValue}
                                                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                                                    placeholder="000000"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-center text-3xl font-black tracking-[0.5em] text-neon-cyan focus:border-neon-cyan focus:outline-none transition-all font-mono"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={handleVerifyOTP}
                                                    disabled={verifyingOtp || otpValue.length !== 6}
                                                    className="w-full py-4 bg-neon-cyan text-black font-bold font-orbitron uppercase tracking-widest hover:shadow-[0_0_20px_#00f3ff] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                                >
                                                    {verifyingOtp ? <Loader2 className="animate-spin" /> : 'Verify Code'}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setOtpSent(false)}
                                                    className="w-full text-gray-500 hover:text-white text-xs font-orbitron uppercase tracking-widest transition-colors py-2"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </motion.div>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                                        <Input label="College Name" name="college" register={register} error={errors.college} placeholder="Enter your College Name" />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Select
                                                label="Department"
                                                name="department"
                                                register={register}
                                                error={errors.department}
                                                options={['CSE', 'ECE', 'IT', 'EEE', 'CIVIL', 'MECH', 'MCT', 'AIML', 'ADS', 'CSD', 'BME', 'CYBERSECURITY', 'OTHERS']}
                                            />
                                            <Select label="Year of Study" name="year" register={register} error={errors.year} options={['1', '2', '3', '4']} />
                                        </div>

                                        {watch('department') === 'OTHERS' && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                                                <Input
                                                    label="Specify Department"
                                                    name="otherDepartment"
                                                    register={register}
                                                    error={errors.otherDepartment}
                                                    placeholder="Enter your department name"
                                                />
                                            </motion.div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input label="City (Optional)" name="city" register={register} />
                                            <Input label="State (Optional)" name="state" register={register} />
                                        </div>
                                        {/* Accommodation section removed */}
                                    </motion.div>
                                )}

                                {currentStep === 3 && (
                                    <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-8">
                                        {/* Refreshments Info */}
                                        <div className="bg-amber-400/10 border border-amber-400/30 p-4 rounded-xl flex items-center gap-3">
                                            <Info size={20} className="text-amber-400 shrink-0" />
                                            <p className="text-amber-200 text-sm font-bold font-orbitron uppercase tracking-wider">
                                                Registration fee includes lunch. Morning and afternoon refreshments will be provided.
                                            </p>
                                        </div>
                                        {/* Workshops */}
                                        <div>
                                            <h3 className="text-xl font-orbitron text-amber-400 mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                                                <Zap size={20} /> Workshops (Day 1)
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {workshops.map(ws => (
                                                    <div
                                                        key={ws.event_id}
                                                        onClick={() => handleToggle(ws.event_id, 'workshop')}
                                                        className={`p-4 border rounded-xl cursor-pointer transition-all ${watch('workshop_selections')?.includes(ws.event_id.toString())
                                                            ? 'border-amber-400 bg-amber-400/10'
                                                            : 'border-white/10 hover:border-white/30'
                                                            }`}
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${watch('workshop_selections')?.includes(ws.event_id.toString())
                                                                ? 'bg-amber-400 border-amber-400'
                                                                : 'border-gray-500'
                                                                }`}>
                                                                {watch('workshop_selections')?.includes(ws.event_id.toString()) && (
                                                                    <div className="w-2.5 h-2.5 bg-black rounded-full" />
                                                                )}
                                                            </div>
                                                            <span className="text-amber-300 font-bold">₹400</span>
                                                        </div>
                                                        <h4 className="font-bold text-white mb-1">{ws.event_name}</h4>
                                                        <div className="text-xs text-gray-400 mt-2">
                                                            <p><Calendar size={12} className="inline mr-1" /> Day {ws.day}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {errors.workshop_selections && (
                                                <p className="text-red-500 text-xs mt-2">{errors.workshop_selections.message}</p>
                                            )}
                                        </div>

                                        {/* Events Section - Split into Technical and Non-Technical */}
                                        <div>
                                            <h3 className="text-xl font-orbitron text-neon-cyan mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                                                <Shield size={20} /> Events (Day 2) - ₹300 for all events
                                            </h3>

                                            <div className="space-y-6">
                                                {/* Technical Events */}
                                                {technicalEvents.length > 0 && (
                                                    <div className="bg-blue-500/5 rounded-xl p-4 border border-blue-500/20">
                                                        <h4 className="text-md font-bold text-blue-400 mb-3 flex items-center gap-2">
                                                            <Zap size={18} className="text-blue-400" /> TECHNICAL EVENTS
                                                        </h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {technicalEvents.map(event => (
                                                                <div
                                                                    key={event.event_id}
                                                                    onClick={() => handleToggle(event.event_id, 'event')}
                                                                    className={`p-4 border rounded-xl cursor-pointer transition-all ${watch('event_selections')?.includes(event.event_id.toString())
                                                                        ? 'border-blue-400 bg-blue-400/10'
                                                                        : 'border-white/10 hover:border-white/30'
                                                                        }`}
                                                                >
                                                                    <div className="flex justify-between items-start mb-2">
                                                                        <div className={`w-5 h-5 border rounded flex items-center justify-center ${watch('event_selections')?.includes(event.event_id.toString())
                                                                            ? 'bg-blue-400 border-blue-400'
                                                                            : 'border-gray-500'
                                                                            }`}>
                                                                            {watch('event_selections')?.includes(event.event_id.toString()) && (
                                                                                <Check size={14} className="text-black" />
                                                                            )}
                                                                        </div>

                                                                    </div>
                                                                    <h4 className="font-bold text-white mb-1">{event.event_name}</h4>
                                                                    <div className="text-xs text-gray-400 mt-2">
                                                                        <p><Calendar size={12} className="inline mr-1" /> Day {event.day}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Non-Technical Events */}
                                                {nonTechnicalEvents.length > 0 && (
                                                    <div className="bg-purple-500/5 rounded-xl p-4 border border-purple-500/20">
                                                        <h4 className="text-md font-bold text-purple-400 mb-3 flex items-center gap-2">
                                                            <Zap size={18} className="text-purple-400" /> NON-TECHNICAL EVENTS
                                                        </h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {nonTechnicalEvents.map(event => {
                                                                const hasTechnicalSelected = watch('event_selections')?.some(id => {
                                                                    const e = events.find(ev => ev.event_id.toString() === id.toString());
                                                                    return e?.event_type?.toLowerCase() === 'technical';
                                                                });

                                                                const isDisabled = !hasTechnicalSelected && !watch('event_selections')?.includes(event.event_id.toString());

                                                                return (
                                                                    <div
                                                                        key={event.event_id}
                                                                        onClick={() => {
                                                                            if (isDisabled) {
                                                                                Swal.fire({
                                                                                    icon: 'info',
                                                                                    title: 'Technical Event Required',
                                                                                    text: 'Please select at least one Technical event before selecting Non-Technical events.',
                                                                                    confirmButtonColor: '#a855f7',
                                                                                    background: '#1a1a1a',
                                                                                    color: '#fff',
                                                                                    toast: true,
                                                                                    position: 'top-end',
                                                                                    timer: 3000,
                                                                                    showConfirmButton: false
                                                                                });
                                                                                return;
                                                                            }
                                                                            handleToggle(event.event_id, 'event');
                                                                        }}
                                                                        className={`p-4 border rounded-xl cursor-pointer transition-all ${watch('event_selections')?.includes(event.event_id.toString())
                                                                            ? 'border-purple-400 bg-purple-400/10'
                                                                            : isDisabled
                                                                                ? 'border-gray-700 opacity-50 bg-gray-800/30 cursor-not-allowed'
                                                                                : 'border-white/10 hover:border-white/30'
                                                                            }`}
                                                                    >
                                                                        <div className="flex justify-between items-start mb-2">
                                                                            <div className={`w-5 h-5 border rounded flex items-center justify-center ${watch('event_selections')?.includes(event.event_id.toString())
                                                                                ? 'bg-purple-400 border-purple-400'
                                                                                : isDisabled
                                                                                    ? 'border-gray-600 bg-gray-800'
                                                                                    : 'border-gray-500'
                                                                                }`}>
                                                                                {watch('event_selections')?.includes(event.event_id.toString()) && (
                                                                                    <Check size={14} className="text-black" />
                                                                                )}
                                                                            </div>

                                                                        </div>
                                                                        <h4 className="font-bold text-white mb-1">{event.event_name}</h4>
                                                                        <div className="text-xs text-gray-400 mt-2">
                                                                            <p><Calendar size={12} className="inline mr-1" /> Day {event.day}</p>
                                                                        </div>
                                                                        {isDisabled && (
                                                                            <p className="text-[10px] text-purple-400/70 mt-2 flex items-center gap-1">
                                                                                <Info size={10} /> Requires at least one Technical event
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 4 && (
                                    <motion.div key="step4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                                        <h3 className="text-xl font-orbitron text-white mb-6 text-center">Registration Summary</h3>

                                        <div className="bg-[#090011]/40 p-6 rounded-xl border border-white/10 space-y-4 font-mono text-sm shadow-inner">
                                            <div className="flex justify-between border-b border-white/10 pb-2">
                                                <span className="text-gray-400">Participant</span>
                                                <span className="text-white text-right font-bold">{formData.fullName}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-white/10 pb-2">
                                                <span className="text-gray-400">Workshops</span>
                                                <div className="text-right text-white">
                                                    {formData.workshop_selections?.map(id => (
                                                        <div key={id}>{events.find(e => e.event_id.toString() === id)?.event_name} (₹400)</div>
                                                    ))}
                                                    {formData.workshop_selections?.length === 0 && 'None'}
                                                </div>
                                            </div>
                                            <div className="flex justify-between border-b border-white/10 pb-2">
                                                <span className="text-gray-400">Events</span>
                                                <div className="text-right text-white">
                                                    <span>(₹300)</span>
                                                    {formData.event_selections?.map(id => (
                                                        <div key={id}>{events.find(e => e.event_id.toString() === id)?.event_name}</div>
                                                    ))}
                                                    {formData.event_selections?.length === 0 && 'None'}
                                                </div>
                                            </div>

                                            <div className="flex justify-between text-xl font-bold pt-4 text-neon-cyan">
                                                <span>TOTAL FEE</span>
                                                <span className="text-glow">₹{calculateTotal()}</span>
                                            </div>
                                            <div className="pt-2 border-t border-white/5">
                                                <p className="text-[10px] text-amber-400 uppercase tracking-[0.2em] font-bold text-center">
                                                    Fee includes lunch & refreshments
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 p-4 bg-neon-purple/10 border border-neon-purple/30 rounded-lg text-white text-sm italic">
                                            <AlertCircle size={20} className="text-neon-purple" />
                                            <span>Verify all details before locking in your registration.</span>
                                        </div>

                                        {!isPaymentPending ? (
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="w-full py-4 bg-neon-cyan text-black font-bold font-orbitron text-lg hover:bg-neon-purple hover:text-white transition-all shadow-[0_0_20px_#00f3ff] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                            >
                                                {submitting ? <Loader2 className="animate-spin" /> : 'FINALIZE REGISTRATION'}
                                            </button>
                                        ) : (
                                            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center">
                                                <p className="text-amber-400 font-bold font-orbitron text-sm uppercase tracking-widest animate-pulse">
                                                    Payment Verification in Progress
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">Complete the verification in the popup box.</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Navigation Buttons for all steps including step 4 */}
                            <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                                {currentStep > 1 ? (
                                    <button type="button" onClick={prevStep} className="flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors font-orbitron text-sm uppercase tracking-widest">
                                        <ChevronLeft size={20} /> Previous
                                    </button>
                                ) : <div></div>}

                                {currentStep < 4 && (
                                    <button type="button" onClick={nextStep} className="flex items-center gap-2 px-8 py-2 bg-white/10 border border-white/20 text-white font-bold rounded hover:bg-neon-cyan hover:text-black transition-all font-orbitron uppercase text-xs tracking-[0.2em">
                                        Next Phase <ChevronRight size={20} />
                                    </button>
                                )}
                            </div>
                        </form>

                        {/* Loading Overlay */}
                        {submitting && (
                            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
                                <Loader2 size={64} className="text-neon-cyan animate-spin mb-8" />
                                <h2 className="text-3xl font-orbitron font-bold text-white mb-4 text-center px-4 animate-pulse">
                                    PROCESSING REGISTRATION
                                </h2>
                                <p className="text-red-500 font-bold text-xl uppercase tracking-widest animate-bounce">
                                    DO NOT REFRESH OR GO BACK
                                </p>
                                <p className="text-gray-500 mt-4 text-sm max-w-md text-center">
                                    This may take a few moments. Please wait while we secure your spot.
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Input = ({ label, name, type = "text", register, error, placeholder, disabled = false }) => (
    <div className="flex flex-col gap-2">
        <label className="text-gray-400 text-xs font-orbitron uppercase tracking-widest">{label}</label>
        <input
            type={type}
            {...register(name)}
            placeholder={placeholder}
            disabled={disabled}
            className={`bg-black/40 border ${error ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors text-sm ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        {error && <span className="text-red-500 text-[10px] font-bold uppercase">{error.message}</span>}
    </div>
);

const Select = ({ label, name, register, error, options, disabled = false }) => (
    <div className="flex flex-col gap-2">
        <label className="text-gray-400 text-xs font-orbitron uppercase tracking-widest">{label}</label>
        <select
            {...register(name)}
            disabled={disabled}
            className={`bg-black/40 border ${error ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors text-sm appearance-none outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <option value="" className="bg-[#090011] text-gray-500">Select...</option>
            {options.map(opt => (
                <option key={opt} value={opt} className="bg-[#090011] text-white">{opt}</option>
            ))}
        </select>
        {error && <span className="text-red-500 text-[10px] font-bold uppercase">{error.message}</span>}
    </div>
);

export default Register;