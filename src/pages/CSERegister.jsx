



// import { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Shield, Check, Info, ArrowRight, Zap, Loader2, Calendar, User, Mail, Phone, MapPin, Grid, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
// import Swal from 'sweetalert2';
// import QRCode from 'qrcode';
// import { useNavigate } from 'react-router-dom';
// import { submitSonacseRegistration, verifySonacsePayment, loadEvents as loadEventsAPI, sendSonacseOTP, verifySonacseOTP } from '../services/api';

// const BASE_URL = 'https://threads26-2-fdem.onrender.com'; // Production (Render)
// // const BASE_URL = 'http://localhost:3000'; // Local dev

// const CSERegister = () => {
//     const [currentStep, setCurrentStep] = useState(1);
//     const [events, setEvents] = useState([]);
//     const [workshops, setWorkshops] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [submitting, setSubmitting] = useState(false);
//     const navigate = useNavigate();

//     // Form State
//     const [formData, setFormData] = useState({
//         roll_number: '',
//         admission_number: '', // New field for first year students
//         email: '',
//         gender: '',
//         phone: '',
//         year_of_study: '',
//         city: 'Salem',
//         state: 'Tamil Nadu',
//         workshop_selections: [],
//         event_selections: []
//     });

//     const [errors, setErrors] = useState({});
//     const [isOTPSent, setIsOTPSent] = useState(false);
//     const [isVerified, setIsVerified] = useState(false);
//     const [otp, setOtp] = useState('');
//     const [verificationToken, setVerificationToken] = useState('');
//     const [maskedEmail, setMaskedEmail] = useState('');
//     const [verifiedName, setVerifiedName] = useState('');
//     const [verifying, setVerifying] = useState(false);
//     const [isPaymentPending, setIsPaymentPending] = useState(false);


//     /* ── Prevent Refresh & Back Navigation ── */
//     const formDataRef = useRef(formData);
//     const submittingRef = useRef(submitting);
//     const stepRef = useRef(currentStep);

//     useEffect(() => { formDataRef.current = formData; }, [formData]);
//     useEffect(() => { submittingRef.current = submitting; }, [submitting]);
//     useEffect(() => { stepRef.current = currentStep; }, [currentStep]);

//     useEffect(() => {
//         const handleBeforeUnload = (e) => {
//             const data = formDataRef.current;
//             const isSubmitting = submittingRef.current;
//             const step = stepRef.current;

//             const isDirty = data.email || data.roll_number || data.admission_number || data.phone;
//             const shouldWarn = step > 1 || isSubmitting || (isDirty && isDirty.length > 0);

//             if (shouldWarn) {
//                 e.preventDefault();
//                 e.returnValue = '';
//                 return '';
//             }
//         };

//         const handlePopState = (e) => {
//             const data = formDataRef.current;
//             const isSubmitting = submittingRef.current;
//             const step = stepRef.current;

//             const isDirty = data.email || data.roll_number || data.admission_number || data.phone;
//             const shouldWarn = step > 1 || isSubmitting || (isDirty && isDirty.length > 0);

//             if (shouldWarn) {
//                 window.history.pushState(null, document.title, window.location.href);
//                 Swal.fire({
//                     icon: 'warning',
//                     title: 'Registration in Progress',
//                     text: 'If you leave now, your progress will be lost.',
//                     showCancelButton: true,
//                     confirmButtonText: 'Stay Here',
//                     cancelButtonText: 'Leave',
//                     confirmButtonColor: '#00f3ff',
//                     cancelButtonColor: '#dc2626',
//                     background: '#1a1a1a',
//                     color: '#fff'
//                 });
//             }
//         };

//         window.addEventListener('beforeunload', handleBeforeUnload);

//         // Push initial state to allow trapping
//         window.history.pushState(null, document.title, window.location.href);
//         window.addEventListener('popstate', handlePopState);

//         return () => {
//             window.removeEventListener('beforeunload', handleBeforeUnload);
//             window.removeEventListener('popstate', handlePopState);
//         };
//     }, []);

//     useEffect(() => {
//         loadEvents();
//     }, []);

//     const loadEvents = async () => {
//         try {
//             const data = await loadEventsAPI();

//             if (data.events && Array.isArray(data.events)) {
//                 setWorkshops(data.events.filter(e => e.event_type === 'workshop'));
//                 setEvents(data.events.filter(e => e.event_type !== 'workshop'));

//                 if (data.registration_open === false) {
//                     Swal.fire({
//                         icon: 'warning',
//                         title: 'Registration Closed',
//                         text: 'Registration period has ended. Please contact organizers.',
//                         confirmButtonColor: '#dc2626',
//                         confirmButtonText: 'OK',
//                         background: '#1a1a1a',
//                         color: '#fff'
//                     });
//                 }
//             }
//         } catch (error) {
//             console.error('Error loading events:', error);
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Failed to Load Events',
//                 text: 'Please refresh the page to try again.',
//                 className: 'bg-gray-900 text-white',
//                 background: '#1a1a1a',
//                 color: '#fff'
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const validateStep1 = () => {
//         const newErrors = {};

//         if (!isVerified) {
//             newErrors.verification = 'Please verify your Roll Number with OTP first';
//             Swal.fire({
//                 icon: 'warning',
//                 title: 'Verification Required',
//                 text: 'Please verify your Roll Number via OTP before proceeding.',
//                 background: '#1a1a1a',
//                 color: '#fff'
//             });
//             setErrors(newErrors);
//             return false;
//         }

//         if (!formData.gender) newErrors.gender = 'Gender is required';

//         if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
//         else if (formData.phone.length !== 10) newErrors.phone = 'Must be 10 digits';

//         if (!formData.year_of_study) newErrors.year_of_study = 'Year is required';

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSendOTP = async () => {
//         if (!formData.roll_number?.trim()) {
//             setErrors(prev => ({ ...prev, roll_number: 'Roll number is required' }));
//             return;
//         }

//         setVerifying(true);
//         try {
//             const data = await sendSonacseOTP({
//                 roll_number: formData.roll_number.trim().toUpperCase()
//             });

//             if (data.success) {
//                 setIsOTPSent(true);
//                 setMaskedEmail(data.email);
//                 setVerifiedName(data.name);
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'OTP Sent',
//                     html: `Verification code sent to <strong>${data.email}</strong><br/><span style="font-size:12px;color:#facc15;">⚠️ Can't find it? Check your <strong>spam or junk</strong> folder too.</span>`,
//                     background: '#1a1a1a',
//                     color: '#fff'
//                 });
//             } else {
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Failed to send OTP',
//                     text: data.message || 'Error occurred',
//                     background: '#1a1a1a',
//                     color: '#fff'
//                 });
//             }
//         } catch (error) {
//             console.error('Send OTP Error:', error);
//             Swal.fire({
//                 icon: 'error',
//                 title: error.message.includes('HTTP') ? 'Error' : 'Network Error',
//                 text: error.message || 'Failed to connect to the server',
//                 background: '#1a1a1a',
//                 color: '#fff'
//             });
//         } finally {
//             setVerifying(false);
//         }
//     };

//     const handleVerifyOTP = async () => {
//         if (!otp || otp.length !== 6) {
//             Swal.fire({
//                 icon: 'warning',
//                 title: 'Invalid OTP',
//                 text: 'Please enter a valid 6-digit OTP',
//                 background: '#1a1a1a',
//                 color: '#fff'
//             });
//             return;
//         }

//         setVerifying(true);
//         try {
//             const data = await verifySonacseOTP({
//                 roll_number: formData.roll_number.trim().toUpperCase(),
//                 otp: otp.trim()
//             });

//             if (data.success) {
//                 setIsVerified(true);
//                 setVerificationToken(data.verification_token);
//                 // Pre-fill year if possible, but let user select
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'Verified',
//                     text: 'Roll number verified successfully!',
//                     background: '#1a1a1a',
//                     color: '#fff',
//                     timer: 1500,
//                     showConfirmButton: false
//                 });
//             } else {
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Verification Failed',
//                     text: data.message || 'Invalid OTP',
//                     background: '#1a1a1a',
//                     color: '#fff'
//                 });
//             }
//         } catch (error) {
//             console.error('Verify OTP Error:', error);
//             Swal.fire({
//                 icon: 'error',
//                 title: error.message.includes('HTTP') ? 'Error' : 'Network Error',
//                 text: error.message || 'Failed to connect to the server',
//                 background: '#1a1a1a',
//                 color: '#fff'
//             });
//         } finally {
//             setVerifying(false);
//         }
//     };

//     const validateStep2 = () => {
//         // Check if user has selected any non-technical events without technical events
//         const hasTechnicalSelected = formData.event_selections.some(id => {
//             const event = events.find(e => e.event_id.toString() === id.toString());
//             return event?.event_type?.toLowerCase() === 'technical';
//         });

//         const hasNonTechnicalSelected = formData.event_selections.some(id => {
//             const event = events.find(e => e.event_id.toString() === id.toString());
//             return event?.event_type?.toLowerCase() === 'non technical' ||
//                 event?.event_type?.toLowerCase() === 'non-technical';
//         });

//         // If user has non-technical events but no technical events
//         if (hasNonTechnicalSelected && !hasTechnicalSelected) {
//             Swal.fire({
//                 icon: 'warning',
//                 title: 'Technical Event Required',
//                 text: 'To register for Non-Technical events, you must select at least one Technical event.',
//                 confirmButtonColor: '#a855f7',
//                 background: '#1a1a1a',
//                 color: '#fff'
//             });
//             return false;
//         }

//         return true;
//     };

//     const nextStep = () => {
//         if (currentStep === 1 && validateStep1()) setCurrentStep(2);
//         else if (currentStep === 2 && validateStep2()) setCurrentStep(3);
//     };

//     const prevStep = () => setCurrentStep(prev => prev - 1);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;

//         // Handle different input types
//         if (name === 'roll_number') {
//             setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
//         } else if (name === 'phone') {
//             const numericValue = value.replace(/\D/g, '').slice(0, 10);
//             setFormData(prev => ({ ...prev, [name]: numericValue }));
//         } else {
//             setFormData(prev => ({ ...prev, [name]: value }));
//         }

//         // Clear error when typing
//         if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
//     };

//     const handleCheckboxChange = (e, type) => {
//         const { value, checked } = e.target;
//         const fieldName = type === 'workshop' ? 'workshop_selections' : 'event_selections';

//         // Find the selected event from the events array
//         const selectedEvent = events.find(event => event.event_id.toString() === value.toString());

//         // Check if it's a non-technical event
//         const isNonTechnical = selectedEvent?.event_type?.toLowerCase() === 'non technical' ||
//             selectedEvent?.event_type?.toLowerCase() === 'non-technical';

//         // Check if user has any technical events selected
//         const hasTechnicalSelected = formData.event_selections.some(id => {
//             const event = events.find(e => e.event_id.toString() === id.toString());
//             return event?.event_type?.toLowerCase() === 'technical';
//         });

//         setFormData(prev => {
//             const currentSelections = prev[fieldName];

//             if (type === 'workshop') {
//                 // Radio button behavior for workshops (Select only one)
//                 if (checked) {
//                     return { ...prev, [fieldName]: [value] };
//                 } else {
//                     return { ...prev, [fieldName]: [] };
//                 }
//             } else {
//                 // Checkbox behavior for events with Technical/Non-Technical logic
//                 if (checked) {
//                     // If trying to select non-technical but no technical selected
//                     if (isNonTechnical && !hasTechnicalSelected) {
//                         // Show warning message
//                         Swal.fire({
//                             icon: 'warning',
//                             title: 'Technical Event Required',
//                             text: 'Please select at least one Technical event before selecting Non-Technical events.',
//                             confirmButtonColor: '#00f3ff',
//                             background: '#1a1a1a',
//                             color: '#fff'
//                         });
//                         return prev; // Don't update state
//                     }

//                     // Allow selection
//                     return { ...prev, [fieldName]: [...currentSelections, value] };
//                 } else {
//                     // Allow deselection
//                     return { ...prev, [fieldName]: currentSelections.filter(id => id !== value) };
//                 }
//             }
//         });
//     };

//     const calculateTotal = () => {
//         let total = 0;

//         // Add workshop fee if any workshop selected (₹300 for all)
//         if (formData.workshop_selections.length > 0) {
//             total += 300;
//         }

//         // Add event fee for FIRST YEAR students only (₹250 flat rate regardless of count)
//         if (formData.year_of_study === '1' && formData.event_selections.length > 0) {
//             total += 250; // Flat rate for students no matter how many events
//         }

//         return total;
//     };

//     const handleSubmit = async () => {
//         setSubmitting(true);

//         // Clear previous registration session data to prevent test overlap
//         Object.keys(localStorage).forEach(key => {
//             if (key.startsWith('threads26_')) {
//                 localStorage.removeItem(key);
//             }
//         });

//         // Prepare payload with verification token
//         const payload = {
//             verification_token: verificationToken,
//             roll_number: formData.roll_number.trim().toUpperCase(),
//             phone: formData.phone,
//             year_of_study: formData.year_of_study,
//             gender: formData.gender,
//             workshop_selections: formData.workshop_selections,
//             event_selections: formData.event_selections
//         };


//         try {
//             console.log('%c[SONACSE] Registration Payload Sent:', 'color:#00f3ff;font-weight:bold', payload);
//             const data = await submitSonacseRegistration(payload);
//             console.log('%c[SONACSE] Registration Response:', 'color:#10b981;font-weight:bold', data);

//             if (data.success) {
//                 // Backend returns participant_id at top level (no participant_details)
//                 if (data.participant_id) {
//                     localStorage.setItem('threads26_participant_id', String(data.participant_id));
//                     localStorage.setItem('threads26_last_reg_response', JSON.stringify(data));
//                 }

//                 if (!data.needs_payment) {
//                     await handleSuccess(data);
//                 } else {
//                     setIsPaymentPending(true);
//                     await handlePaymentRequired(data);
//                 }
//             } else {
//                 handleError(data);
//             }
//         } catch (error) {
//             console.error('Registration error:', error);
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Network Error',
//                 text: 'Please check your connection and try again.',
//                 background: '#1a1a1a',
//                 color: '#fff'
//             });
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleSuccess = async (data) => {
//         // Backend fields: participant_id and name at top level
//         const pid = data.participant_id;
//         const name = data.participant_name || data.name;

//         console.log('%c[SONACSE] handleSuccess called:', 'color:#10b981;font-weight:bold', {
//             participant_id: pid,
//             name,
//             qr: data.qr ? '[QR BASE64 PRESENT]' : null,
//             full_response: data
//         });

//         if (pid) {
//             localStorage.setItem('threads26_participant_id', String(pid));
//             localStorage.setItem('threads26_last_reg_response', JSON.stringify(data));
//         }

//         // For free registrations, qr is returned as `data.qr`
//         if (data.qr) {
//             localStorage.setItem('threads26_qr_code', data.qr);
//         }

//         await Swal.fire({
//             icon: 'success',
//             title: 'Registration Successful!',
//             html: `
//                 <div class="text-left space-y-2">
//                     <p><strong class="text-neon-cyan">Name:</strong> ${name || 'N/A'}</p>
//                     <p><strong class="text-neon-cyan">ID:</strong> ${pid || 'N/A'}</p>
//                     <div class="mt-4 p-3 bg-green-900/30 border border-green-500/30 rounded text-green-400 text-sm">
//                         Registration complete! Redirecting to your portal...
//                     </div>
//                 </div>
//             `,
//             confirmButtonColor: '#10b981',
//             confirmButtonText: 'Go to Portal',
//             background: '#1a1a1a',
//             color: '#fff',
//             width: '32rem',
//             timer: 3000,
//             timerProgressBar: true
//         });

//         navigate('/portal');
//     };

//     const handlePaymentRequired = async (data) => {
//         // Backend response fields at TOP LEVEL: participant_id, participant_name, total_amount
//         const participantId = data.participant_id;        // integer from DB
//         // Use payment_options.amount for exact match with DB (avoids any rounding mismatch)
//         const amount = (data.payment_options && data.payment_options.amount) || data.total_amount || 0;
//         // Backend uses payment_reference or payment_ref
//         const reference = data.payment_reference || data.payment_ref || ('SONA-' + participantId);
//         // Get UPI ID from backend payment_options
//         const upiId = 'rajikutty106@okaxis';
//         const payeeName = 'SONA CSE';

//         console.log('%c[SONACSE] handlePaymentRequired called:', 'color:#f59e0b;font-weight:bold', {
//             participant_id: participantId,
//             amount,
//             reference,
//             upi_id: upiId,
//             full_response: data
//         });

//         // UPI payment URL
//         const upiUrl = 'upi://pay?pa=' + upiId + '&pn=' + encodeURIComponent(payeeName) + '&am=' + amount + '&cu=INR&tn=' + encodeURIComponent(reference);

//         // Backend only sends qr for FREE registrations; for paid we generate QR from UPI URL
//         const qrImage = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=' + encodeURIComponent(upiUrl);

//         let isVerifiedLocally = false;

//         while (!isVerifiedLocally) {
//             const result = await Swal.fire({
//                 title: 'Payment Required - Rs.' + amount,
//                 html: '<div class="text-left space-y-4 mb-4">' +
//                     '<div class="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">' +
//                     '<p class="font-bold text-white mb-2">Scan and Pay (UPI)</p>' +
//                     '<img src="' + qrImage + '" alt="UPI QR Code" class="mx-auto rounded-lg mb-2 border-4 border-white" style="max-width: 180px;" />' +
//                     '<p class="text-2xl font-bold text-amber-400">Rs.' + amount + '</p>' +

//                     '<p class="text-xs text-gray-400 mt-1">Ref: ' + reference + '</p>' +
//                     '</div>' +
//                     '<div>' +
//                     '<p class="text-[10px] text-amber-400/80 mb-2 italic">(Enter valid transaction id and It will verified soon and displayed on portal page )</p>' +
//                     '<p class="text-sm text-gray-400 mb-1">Transaction ID <span class="text-red-500">*</span></p>' +
//                     '<input id="swal-txn-id" class="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white" placeholder="Enter UPI / Transaction ID">' +
//                     '<p class="text-xs text-gray-500 mt-1">Min. 5 characters from your payment app</p>' +
//                     '</div>' +
//                     '</div>',
//                 showCancelButton: false,
//                 allowOutsideClick: false,
//                 allowEscapeKey: false,
//                 confirmButtonText: 'Verify Payment',
//                 confirmButtonColor: '#10b981',
//                 background: '#1a1a1a',
//                 color: '#fff',
//                 width: '32rem',
//                 preConfirm: () => {
//                     const txnId = document.getElementById('swal-txn-id').value.trim();
//                     if (!txnId || txnId.length < 5) {
//                         Swal.showValidationMessage('Please enter a valid Transaction ID (min 5 characters)');
//                         return false;
//                     }
//                     return { txnId };
//                 }
//             });

//             if (result.isConfirmed) {
//                 const { txnId } = result.value;
//                 const verifyPayload = {
//                     participant_id: participantId,
//                     transaction_id: txnId,
//                     amount: amount
//                 };

//                 try {
//                     const verified = await verifyPayment(verifyPayload);
//                     if (verified) {
//                         isVerifiedLocally = true;
//                         setIsPaymentPending(false);
//                     }
//                 } catch (e) {
//                     console.error('Verify loop error:', e);
//                 }
//             }
//         }
//     };


//     const verifyPayment = async (paymentDetails) => {
//         Swal.fire({
//             title: 'Verifying Payment...',
//             html: 'Please wait while we confirm your payment.',
//             didOpen: () => Swal.showLoading(),
//             background: '#1a1a1a',
//             color: '#fff',
//             allowOutsideClick: false
//         });

//         try {
//             // Verify endpoint only needs: participant_id, transaction_id, amount
//             const data = await verifySonacsePayment({
//                 participant_id: paymentDetails.participant_id,
//                 transaction_id: paymentDetails.transaction_id,
//                 amount: paymentDetails.amount
//             });

//             if (data.success) {
//                 console.log('%c[SONACSE] Verify Payment Response (SUCCESS):', 'color:#10b981;font-weight:bold', data);
//                 // Verify response has qr_code at top level
//                 if (data.qr_code) {
//                     localStorage.setItem('threads26_qr_code', data.qr_code);
//                 }
//                 localStorage.setItem('threads26_verification_status', 'VERIFIED');

//                 await Swal.fire({
//                     icon: 'success',
//                     title: 'Transaction id will be verified soon',
//                     html: `
//                         <div class="text-left space-y-2">
//                             <p><strong class="text-green-400">Name:</strong> ${data.name || 'Confirmed'}</p>
//                             <p><strong class="text-green-400">ID:</strong> ${data.participant_id || paymentDetails.participant_id}</p>
//                             <p><strong class="text-green-400">Amount Paid:</strong> ₹${data.amount_paid || paymentDetails.amount}</p>
//                             <div class="mt-4 p-3 bg-green-900/30 border border-green-500/30 rounded text-green-400 text-sm">
//                                 Redirecting to your portal...
//                             </div>
//                         </div>
//                     `,
//                     confirmButtonColor: '#10b981',
//                     confirmButtonText: 'Go to Portal',
//                     background: '#1a1a1a',
//                     color: '#fff',
//                     timer: 3000,
//                     timerProgressBar: true
//                 });
//                 navigate('/portal');
//                 return true;
//             } else {
//                 console.warn('%c[SONACSE] Verify Payment Response (FAILED):', 'color:#ef4444;font-weight:bold', data);
//                 await Swal.fire({
//                     icon: 'error',
//                     title: 'Verification Failed',
//                     text: data.details || data.error || 'Payment could not be verified.',
//                     confirmButtonColor: '#dc2626',
//                     background: '#1a1a1a',
//                     color: '#fff',
//                     allowOutsideClick: false,
//                     allowEscapeKey: false
//                 });
//                 return false;
//             }
//         } catch (error) {
//             console.error('%c[SONACSE] Verify Payment Error:', 'color:#ef4444;font-weight:bold', error);
//             await Swal.fire({
//                 icon: 'error',
//                 title: 'Verification Error',
//                 text: error.message || 'Network error occurred.',
//                 confirmButtonColor: '#dc2626',
//                 background: '#1a1a1a',
//                 color: '#fff',
//                 allowOutsideClick: false,
//                 allowEscapeKey: false
//             });
//             return false;
//         }
//     };

//     const handleError = (data) => {
//         let errorMsg = data.message || 'Registration failed';
//         if (errorMsg.includes('INVALID_SONACSE_ROLL')) errorMsg = 'Invalid SONACSE Roll/Admission Number';
//         else if (errorMsg.includes('EMAIL_EXISTS')) errorMsg = 'Email Already Registered';
//         else if (errorMsg.includes('SEAT_UNAVAILABLE')) errorMsg = 'Seats Unavailable';

//         Swal.fire({
//             icon: 'error',
//             title: 'Error',
//             text: errorMsg,
//             confirmButtonColor: '#dc2626',
//             background: '#1a1a1a',
//             color: '#fff'
//         });
//     };

//     const generateQRCode = async (data) => {
//         if (data.qr_code) return data.qr_code;

//         try {
//             const qrData = JSON.stringify({
//                 id: data.participant_details?.participant_id,
//                 name: data.participant_details?.participant_name,
//                 event: "THREADS'26",
//                 type: "SONACSE"
//             });
//             return await QRCode.toDataURL(qrData, {
//                 errorCorrectionLevel: 'H',
//                 margin: 1,
//                 width: 250,
//                 color: { dark: '#00f3ff', light: '#00000000' } // Neon cyan on transparent
//             });
//         } catch (err) {
//             console.error(err);
//             return null;
//         }
//     };

//     const steps = [
//         { number: 1, title: 'Personal Info' },
//         { number: 2, title: 'Event Selection' },
//         { number: 3, title: 'Confirm' }
//     ];

//     return (
//         <div className="pt-24 px-4 md:px-8 min-h-screen max-w-4xl mx-auto pb-20 relative z-20">
//             {/* Steps Indicator */}
//             <div className="mb-12">
//                 <div className="flex justify-between relative mb-8">
//                     <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -z-10 transform -translate-y-1/2"></div>
//                     <div className="absolute top-1/2 left-0 h-1 bg-neon-cyan -z-10 transform -translate-y-1/2 transition-all duration-500" style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}></div>

//                     {steps.map((step) => (
//                         <div key={step.number} className={`flex flex-col items-center gap-2 ${currentStep >= step.number ? 'text-neon-cyan' : 'text-gray-500'}`}>
//                             <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold transition-all duration-300 bg-[#0a0a0a] ${currentStep >= step.number ? 'border-neon-cyan text-neon-cyan shadow-[0_0_10px_#00f3ff]' : 'border-gray-700 text-gray-500'}`}>
//                                 {step.number < currentStep ? <Check size={20} /> : step.number}
//                             </div>
//                             <span className="text-sm font-orbitron hidden sm:block">{step.title}</span>
//                         </div>
//                     ))}
//                 </div>

//                 <h1 className="text-3xl md:text-5xl font-bold font-orbitron text-center mb-2 uppercase">
//                     SONACSE <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">REGISTRATION</span>
//                 </h1>
//                 <p className="text-center text-gray-400">Exclusive Portal for Department Students</p>
//             </div>

//             {/* Main Form Container */}
//             <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
//                 <AnimatePresence mode="wait">

//                     {/* STEP 1: PERSONAL DETAILS */}
//                     {currentStep === 1 && (
//                         <motion.div
//                             key="step1"
//                             initial={{ x: 20, opacity: 0 }}
//                             animate={{ x: 0, opacity: 1 }}
//                             exit={{ x: -20, opacity: 0 }}
//                             className="space-y-6"
//                         >
//                             <h3 className="text-xl font-bold font-orbitron text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
//                                 <User className="text-neon-cyan" /> Personal Details
//                             </h3>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 {/* STEP 1a: UNVERIFIED STATE */}
//                                 {!isVerified ? (
//                                     <div className="col-span-1 md:col-span-2 space-y-6">
//                                         <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
//                                             <p className="text-sm text-blue-300 flex items-center gap-2">
//                                                 <Info size={16} /> Select your year and enter your ID to receive a verification OTP.
//                                             </p>
//                                         </div>

//                                         {/* Year Selection FIRST */}
//                                         <div className="space-y-4">
//                                             <label className="block text-sm font-medium text-gray-400">Year of Study <span className="text-red-500">*</span></label>
//                                             <div className="relative">
//                                                 <select
//                                                     name="year_of_study"
//                                                     value={formData.year_of_study}
//                                                     onChange={handleInputChange}
//                                                     disabled={isOTPSent}
//                                                     className={`w-full bg-white/5 border ${errors.year_of_study ? 'border-red-500' : 'border-white/10'} rounded-lg py-3 px-4 pl-12 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all appearance-none`}
//                                                 >
//                                                     <option value="" className="bg-black text-gray-500">Select Year of Study</option>
//                                                     <option value="1" className="bg-black">First Year</option>
//                                                     <option value="2" className="bg-black">Second Year</option>
//                                                     <option value="3" className="bg-black">Third Year</option>

//                                                 </select>
//                                                 <Grid className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
//                                             </div>
//                                             {errors.year_of_study && <p className="text-red-500 text-xs mt-1">{errors.year_of_study}</p>}
//                                         </div>

//                                         {formData.year_of_study && !isOTPSent && (
//                                             <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
//                                                 <label className="block text-sm font-medium text-gray-400">
//                                                     {formData.year_of_study === '1' ? 'Admission Number' : 'Register Number'} <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <div className="relative">
//                                                     <input
//                                                         type="text"
//                                                         name="roll_number"
//                                                         value={formData.roll_number}
//                                                         onChange={handleInputChange}
//                                                         placeholder={formData.year_of_study === '1' ? "e.g. 24CSE001" : "e.g. 727622BCS001"}
//                                                         className={`w-full bg-white/5 border ${errors.roll_number ? 'border-red-500' : 'border-white/10'} rounded-lg py-3 px-4 pl-12 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all uppercase`}
//                                                     />
//                                                     <Shield className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
//                                                 </div>
//                                                 <button
//                                                     onClick={handleSendOTP}
//                                                     disabled={verifying || !formData.roll_number}
//                                                     className="w-full bg-gradient-to-r from-neon-cyan to-blue-600 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all font-orbitron"
//                                                 >
//                                                     {verifying ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
//                                                     SEND VERIFICATION CODE
//                                                 </button>
//                                             </div>
//                                         )}

//                                         {isOTPSent && !isVerified && (
//                                             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
//                                                 <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-white/5">
//                                                     <p className="text-sm text-gray-400 mb-1">Verification code sent to:</p>
//                                                     <p className="text-neon-cyan font-bold text-lg">{maskedEmail}</p>
//                                                     <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter italic">Check your Sona Mail / Personal Email</p>
//                                                 </div>

//                                                 <label className="block text-sm font-medium text-gray-400">Enter 6-Digit OTP <span className="text-red-500">*</span></label>
//                                                 <div className="relative">
//                                                     <input
//                                                         type="text"
//                                                         value={otp}
//                                                         onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                                                         placeholder="000000"
//                                                         className="w-full bg-white/5 border border-white/10 rounded-lg py-4 text-center text-3xl tracking-[1rem] text-neon-cyan focus:outline-none focus:border-neon-cyan transition-all font-mono"
//                                                     />
//                                                 </div>

//                                                 <button
//                                                     onClick={handleVerifyOTP}
//                                                     disabled={verifying || otp.length !== 6}
//                                                     className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all font-orbitron"
//                                                 >
//                                                     {verifying ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
//                                                     VERIFY & CONTINUE
//                                                 </button>

//                                                 <button
//                                                     onClick={() => setIsOTPSent(false)}
//                                                     className="w-full text-gray-500 text-sm hover:text-white transition-colors"
//                                                 >
//                                                     Change Details
//                                                 </button>
//                                             </div>
//                                         )}
//                                     </div>
//                                 ) : (
//                                     /* STEP 1b: VERIFIED STATE - PROFILE DETAILS */
//                                     <>
//                                         <div className="col-span-1 md:col-span-2">
//                                             <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg flex items-center justify-between">
//                                                 <div>
//                                                     <p className="text-xs text-green-500 uppercase font-bold tracking-wider">Verified {formData.year_of_study} Year Student</p>
//                                                     <p className="text-xl font-bold text-white">{verifiedName}</p>
//                                                     <p className="text-sm text-gray-400 font-mono uppercase">{formData.roll_number} • {maskedEmail}</p>
//                                                 </div>
//                                                 <div className="bg-green-500 rounded-full p-1 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
//                                                     <Check size={24} className="text-black" />
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         {/* Gender */}
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-400 mb-1">Gender <span className="text-red-500">*</span></label>
//                                             <div className="relative">
//                                                 <select
//                                                     name="gender"
//                                                     value={formData.gender}
//                                                     onChange={handleInputChange}
//                                                     className={`w-full bg-white/5 border ${errors.gender ? 'border-red-500' : 'border-white/10'} rounded-lg py-3 px-4 pl-12 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all appearance-none`}
//                                                 >
//                                                     <option value="" className="bg-black text-gray-500">Select Gender</option>
//                                                     <option value="Male" className="bg-black">Male</option>
//                                                     <option value="Female" className="bg-black">Female</option>
//                                                     <option value="Other" className="bg-black">Other</option>
//                                                 </select>
//                                                 <User className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
//                                             </div>
//                                             {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
//                                         </div>

//                                         {/* Phone */}
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number <span className="text-red-500">*</span></label>
//                                             <div className="relative">
//                                                 <input
//                                                     type="tel"
//                                                     name="phone"
//                                                     value={formData.phone}
//                                                     onChange={handleInputChange}
//                                                     maxLength={10}
//                                                     placeholder="Enter 10-digit mobile number"
//                                                     className={`w-full bg-white/5 border ${errors.phone ? 'border-red-500' : 'border-white/10'} rounded-lg py-3 px-4 pl-12 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all`}
//                                                 />
//                                                 <Phone className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
//                                             </div>
//                                             {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
//                                         </div>
//                                     </>
//                                 )}
//                             </div>
//                         </motion.div>
//                     )}

//                     {/* STEP 2: EVENT SELECTION */}
//                     {currentStep === 2 && (
//                         <motion.div
//                             key="step2"
//                             initial={{ x: 20, opacity: 0 }}
//                             animate={{ x: 0, opacity: 1 }}
//                             exit={{ x: -20, opacity: 0 }}
//                             className="space-y-8"
//                         >
//                             <h3 className="text-xl font-bold font-orbitron text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
//                                 <Calendar className="text-neon-cyan" /> Event Selection
//                             </h3>

//                             {/* Workshops */}
//                             <div className="mb-8">
//                                 <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
//                                     <Zap className="text-amber-400" /> Workshops (Paid - Select One)
//                                 </h4>
//                                 {loading ? (
//                                     <div className="text-center py-8 text-gray-500"><Loader2 className="animate-spin inline mr-2" /> Loading workshops...</div>
//                                 ) : (
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         {workshops.map(workshop => {
//                                             // Use CSE specific seat counts
//                                             const totalSeats = workshop.cse_seats || workshop.total_seats;
//                                             const availableSeats = workshop.cse_available_seats !== undefined ? workshop.cse_available_seats : workshop.available_seats;

//                                             const isSoldOut = availableSeats <= 0;
//                                             const isSelected = formData.workshop_selections.includes(workshop.event_id.toString());

//                                             return (
//                                                 <div
//                                                     key={workshop.event_id}
//                                                     onClick={() => !isSoldOut && handleCheckboxChange({ target: { value: workshop.event_id.toString(), checked: !isSelected } }, 'workshop')}
//                                                     className={`cursor-pointer border rounded-xl p-4 transition-all ${isSoldOut ? 'border-red-500/30 opacity-60 bg-red-500/5' : isSelected ? 'border-amber-400 bg-amber-400/10' : 'bg-white/5 border-white/10 hover:border-amber-500/50 hover:bg-amber-500/5'}`}
//                                                 >
//                                                     <div className="flex justify-between items-start mb-2">
//                                                         <div>
//                                                             <h5 className="font-bold text-white text-sm">{workshop.event_name}</h5>
//                                                             <span className="text-[10px] text-gray-400 border border-gray-700 rounded px-1.5 py-0.5 uppercase tracking-wider mt-1 inline-block">{workshop.event_type}</span>
//                                                         </div>
//                                                         <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded font-mono">
//                                                             ₹300 {/* Fixed price for all CSE students */}
//                                                         </span>
//                                                     </div>
//                                                     <div className="text-xs text-gray-400 mb-3 space-y-1">

//                                                     </div>
//                                                     <div className="flex items-center">
//                                                         <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${isSelected ? 'bg-amber-400 border-amber-400' : 'border-gray-500'}`}>
//                                                             {isSelected && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
//                                                         </div>
//                                                         <span className={`text-sm ${isSoldOut ? 'text-red-400' : 'text-gray-300'}`}>
//                                                             {isSoldOut ? 'Sold Out' : (isSelected ? 'Selected' : 'Select Workshop')}
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                             );
//                                         })}
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Events */}
//                             {/* Events */}
//                             <div>
//                                 <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
//                                     <Shield className="text-neon-green" />
//                                     Events {formData.year_of_study === '1' ? '(₹250 for all events)' : '(Free for SONACSE)'}
//                                 </h4>
//                                 {loading ? (
//                                     <div className="text-center py-8 text-gray-500"><Loader2 className="animate-spin inline mr-2" /> Loading events...</div>
//                                 ) : (
//                                     <div className="space-y-6">
//                                         {/* Technical Events Section */}
//                                         {events.filter(event => event.event_type?.toLowerCase() === 'technical').length > 0 && (
//                                             <div className="bg-blue-500/5 rounded-xl p-4 border border-blue-500/20">
//                                                 <h5 className="text-md font-bold text-blue-400 mb-3 flex items-center gap-2">
//                                                     <Zap size={18} className="text-blue-400" /> TECHNICAL EVENTS
//                                                 </h5>
//                                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                                     {events
//                                                         .filter(event => event.event_type?.toLowerCase() === 'technical')
//                                                         .map(event => {
//                                                             const totalSeats = event.cse_seats || event.total_seats;
//                                                             const availableSeats = event.cse_available_seats !== undefined ? event.cse_available_seats : event.available_seats;
//                                                             const isSoldOut = availableSeats <= 0;
//                                                             const isSelected = formData.event_selections.includes(event.event_id.toString());

//                                                             return (
//                                                                 <div
//                                                                     key={event.event_id}
//                                                                     onClick={() => !isSoldOut && handleCheckboxChange({ target: { value: event.event_id.toString(), checked: !isSelected } }, 'event')}
//                                                                     className={`cursor-pointer border rounded-xl p-4 transition-all 
//                                                                         ${isSoldOut ? 'border-red-500/30 opacity-60 bg-red-500/5' :
//                                                                             isSelected ? 'border-blue-400 bg-blue-400/10' :
//                                                                                 'bg-white/5 border-white/10 hover:border-blue-400/50 hover:bg-blue-400/5'}`}
//                                                                 >
//                                                                     <div className="flex justify-between items-start mb-2">
//                                                                         <div>
//                                                                             <h5 className="font-bold text-white text-sm">{event.event_name}</h5>
//                                                                             <span className="text-[10px] text-gray-400 border border-gray-700 rounded px-1.5 py-0.5 uppercase tracking-wider mt-1 inline-block">
//                                                                                 TECHNICAL
//                                                                             </span>
//                                                                         </div>

//                                                                     </div>
//                                                                     <div className="text-xs text-gray-400 mb-3 space-y-1">
//                                                                         <p><Calendar size={12} className="inline mr-1" /> Day {event.day}</p>
//                                                                     </div>
//                                                                     <div className="flex items-center">
//                                                                         <div className={`w-5 h-5 rounded border flex items-center justify-center mr-2 
//                                                                             ${isSelected ? 'bg-blue-400 border-blue-400' : 'border-gray-500'}`}>
//                                                                             {isSelected && <Check size={14} className="text-black" />}
//                                                                         </div>
//                                                                         <span className={`text-sm ${isSoldOut ? 'text-red-400' : 'text-gray-300'}`}>
//                                                                             {isSoldOut ? 'Sold Out' : (isSelected ? 'Selected' : 'Select Event')}
//                                                                         </span>
//                                                                     </div>
//                                                                 </div>
//                                                             );
//                                                         })}
//                                                 </div>
//                                             </div>
//                                         )}

//                                         {/* Non-Technical Events Section */}
//                                         {events.filter(event => event.event_type?.toLowerCase() === 'non technical' || event.event_type?.toLowerCase() === 'non-technical').length > 0 && (
//                                             <div className="bg-purple-500/5 rounded-xl p-4 border border-purple-500/20">
//                                                 <h5 className="text-md font-bold text-purple-400 mb-3 flex items-center gap-2">
//                                                     <Zap size={18} className="text-purple-400" /> NON-TECHNICAL EVENTS
//                                                 </h5>
//                                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                                     {events
//                                                         .filter(event => event.event_type?.toLowerCase() === 'non technical' || event.event_type?.toLowerCase() === 'non-technical')
//                                                         .map(event => {
//                                                             const totalSeats = event.cse_seats || event.total_seats;
//                                                             const availableSeats = event.cse_available_seats !== undefined ? event.cse_available_seats : event.available_seats;
//                                                             const isSoldOut = availableSeats <= 0;
//                                                             const isSelected = formData.event_selections.includes(event.event_id.toString());

//                                                             // Check if user has any technical events selected
//                                                             const hasTechnicalSelected = formData.event_selections.some(id => {
//                                                                 const e = events.find(ev => ev.event_id.toString() === id.toString());
//                                                                 return e?.event_type?.toLowerCase() === 'technical';
//                                                             });

//                                                             const isDisabled = !hasTechnicalSelected && !isSoldOut;

//                                                             return (
//                                                                 <div
//                                                                     key={event.event_id}
//                                                                     onClick={() => {
//                                                                         if (isSoldOut) return;
//                                                                         if (isDisabled) {
//                                                                             Swal.fire({
//                                                                                 icon: 'info',
//                                                                                 title: 'Technical Event Required',
//                                                                                 text: 'Please select at least one Technical event before selecting Non-Technical events.',
//                                                                                 confirmButtonColor: '#a855f7',
//                                                                                 background: '#1a1a1a',
//                                                                                 color: '#fff',
//                                                                                 toast: true,
//                                                                                 position: 'top-end',
//                                                                                 timer: 3000,
//                                                                                 showConfirmButton: false
//                                                                             });
//                                                                             return;
//                                                                         }
//                                                                         handleCheckboxChange({ target: { value: event.event_id.toString(), checked: !isSelected } }, 'event');
//                                                                     }}
//                                                                     className={`cursor-pointer border rounded-xl p-4 transition-all 
//                                                                         ${isSoldOut ? 'border-red-500/30 opacity-60 bg-red-500/5' :
//                                                                             isSelected ? 'border-purple-400 bg-purple-400/10' :
//                                                                                 isDisabled ? 'border-gray-700 opacity-50 bg-gray-800/30 cursor-not-allowed' :
//                                                                                     'bg-white/5 border-white/10 hover:border-purple-400/50 hover:bg-purple-400/5'}`}
//                                                                 >
//                                                                     <div className="flex justify-between items-start mb-2">
//                                                                         <div>
//                                                                             <h5 className="font-bold text-white text-sm">{event.event_name}</h5>
//                                                                             <span className="text-[10px] text-gray-400 border border-gray-700 rounded px-1.5 py-0.5 uppercase tracking-wider mt-1 inline-block">
//                                                                                 NON-TECHNICAL
//                                                                             </span>
//                                                                         </div>

//                                                                     </div>
//                                                                     <div className="text-xs text-gray-400 mb-3 space-y-1">
//                                                                         <p><Calendar size={12} className="inline mr-1" /> Day {event.day}</p>
//                                                                     </div>
//                                                                     <div className="flex items-center">
//                                                                         <div className={`w-5 h-5 rounded border flex items-center justify-center mr-2 
//                                                                             ${isSelected ? 'bg-purple-400 border-purple-400' :
//                                                                                 isDisabled ? 'border-gray-600 bg-gray-800' : 'border-gray-500'}`}>
//                                                                             {isSelected && <Check size={14} className="text-black" />}
//                                                                         </div>
//                                                                         <span className={`text-sm ${isSoldOut ? 'text-red-400' :
//                                                                             isDisabled ? 'text-gray-500' : 'text-gray-300'}`}>
//                                                                             {isSoldOut ? 'Sold Out' :
//                                                                                 isDisabled ? 'Select Technical First' :
//                                                                                     (isSelected ? 'Selected' : 'Select Event')}
//                                                                         </span>
//                                                                     </div>
//                                                                     {isDisabled && (
//                                                                         <p className="text-[10px] text-purple-400/70 mt-2 flex items-center gap-1">
//                                                                             <Info size={10} /> Requires at least one Technical event
//                                                                         </p>
//                                                                     )}
//                                                                 </div>
//                                                             );
//                                                         })}
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         </motion.div>
//                     )}

//                     {/* STEP 3: SUMMARY */}
//                     {currentStep === 3 && (
//                         <motion.div
//                             key="step3"
//                             initial={{ x: 20, opacity: 0 }}
//                             animate={{ x: 0, opacity: 1 }}
//                             exit={{ x: -20, opacity: 0 }}
//                             className="space-y-6"
//                         >
//                             <h3 className="text-xl font-bold font-orbitron text-white mb-6 text-center">Registration Summary</h3>

//                             <div className="bg-[#090011]/40 p-6 rounded-xl border border-white/10 space-y-4 font-mono text-sm shadow-inner">
//                                 <div className="flex justify-between border-b border-white/10 pb-2">
//                                     <span className="text-gray-400">Student Name</span>
//                                     <span className="text-white text-right">{verifiedName}</span>
//                                 </div>
//                                 <div className="flex justify-between border-b border-white/10 pb-2">
//                                     <span className="text-gray-400">
//                                         {formData.year_of_study === '1' ? 'Admission Number' : 'Register Number'}
//                                     </span>
//                                     <span className="text-white text-right font-mono uppercase">{formData.roll_number}</span>
//                                 </div>
//                                 <div className="flex justify-between border-b border-white/10 pb-2">
//                                     <span className="text-gray-400">Verified Email</span>
//                                     <span className="text-white text-right">{maskedEmail}</span>
//                                 </div>
//                                 <div className="flex justify-between border-b border-white/10 pb-2">
//                                     <span className="text-gray-400">Year of Study</span>
//                                     <span className="text-white text-right">
//                                         {formData.year_of_study} Year
//                                     </span>
//                                 </div>
//                                 <div className="flex justify-between border-b border-white/10 pb-2">
//                                     <span className="text-gray-400">Workshops</span>
//                                     <div className="text-right text-white">
//                                         {formData.workshop_selections?.map(id => (
//                                             <div key={id}>{workshops.find(e => e.event_id.toString() === id.toString())?.event_name}</div>
//                                         ))}
//                                         {formData.workshop_selections?.length === 0 && 'None'}
//                                     </div>
//                                 </div>
//                                 <div className="flex justify-between border-b border-white/10 pb-2">
//                                     <span className="text-gray-400">Events</span>
//                                     <div className="text-right text-white">
//                                         {formData.event_selections?.map(id => (
//                                             <div key={id}>{events.find(e => e.event_id.toString() === id.toString())?.event_name}</div>
//                                         ))}
//                                         {formData.event_selections?.length === 0 && 'None'}
//                                     </div>
//                                 </div>

//                                 <div className="flex justify-between text-xl font-bold pt-4 text-neon-cyan">
//                                     <span>TOTAL FEE</span>
//                                     <span className="text-glow">₹{calculateTotal()}</span>
//                                 </div>
//                             </div>

//                             {!isPaymentPending ? (
//                                 <button
//                                     onClick={handleSubmit}
//                                     disabled={submitting}
//                                     className="w-full bg-gradient-to-r from-neon-cyan to-blue-600 text-black font-bold font-orbitron py-4 rounded-xl hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                     {submitting ? <Loader2 className="animate-spin" /> : <><Check className="w-5 h-5" /> FINALIZE REGISTRATION</>}
//                                 </button>
//                             ) : (
//                                 <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center">
//                                     <p className="text-amber-400 font-bold font-orbitron text-sm uppercase tracking-widest animate-pulse">
//                                         Payment Verification in Progress
//                                     </p>
//                                     <p className="text-xs text-gray-400 mt-1">Complete the verification in the popup box.</p>
//                                 </div>
//                             )}
//                         </motion.div>
//                     )}
//                 </AnimatePresence>

//                 {/* Navigation Buttons */}
//                 {!isPaymentPending && (
//                     <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
//                         {currentStep > 1 ? (
//                             <button onClick={prevStep} className="flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors font-orbitron text-sm uppercase tracking-widest">
//                                 <ChevronLeft size={20} /> Previous
//                             </button>
//                         ) : <div></div>}

//                         {currentStep < 3 && (
//                             <button onClick={nextStep} className="flex items-center gap-2 px-8 py-2 bg-white/10 border border-white/20 text-white font-bold rounded hover:bg-neon-cyan hover:text-black transition-all font-orbitron uppercase text-xs tracking-[0.2em]">
//                                 Next Phase <ChevronRight size={20} />
//                             </button>
//                         )}
//                     </div>
//                 )}
//             </div>

//             {/* Loading Overlay */}
//             {
//                 submitting && (
//                     <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
//                         <Loader2 size={64} className="text-neon-cyan animate-spin mb-8" />
//                         <h2 className="text-3xl font-orbitron font-bold text-white mb-4 text-center px-4 animate-pulse">
//                             PROCESSING REGISTRATION
//                         </h2>
//                         <p className="text-red-500 font-bold text-xl uppercase tracking-widest animate-bounce">
//                             DO NOT REFRESH OR GO BACK
//                         </p>
//                         <p className="text-gray-500 mt-4 text-sm max-w-md text-center">
//                             This may take a few moments. Please wait while we secure your spot.
//                         </p>
//                     </div>
//                 )
//             }
//         </div >
//     );
// };

// export default CSERegister;


import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Check, Info, ArrowRight, Zap, Loader2, Calendar, User, Mail, Phone, MapPin, Grid, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';
import QRCode from 'qrcode';
import { useNavigate } from 'react-router-dom';
import { submitSonacseRegistration, verifySonacsePayment, loadEvents as loadEventsAPI, sendSonacseOTP, verifySonacseOTP } from '../services/api';

const BASE_URL = 'https://threads26-2-fdem.onrender.com'; // Production (Render)
// const BASE_URL = 'http://localhost:3000'; // Local dev

const CSERegister = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [events, setEvents] = useState([]);
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        roll_number: '',
        admission_number: '', // New field for first year students
        email: '',
        gender: '',
        phone: '',
        year_of_study: '',
        city: 'Salem',
        state: 'Tamil Nadu',
        workshop_selections: [],
        event_selections: []
    });

    const [errors, setErrors] = useState({});
    const [isOTPSent, setIsOTPSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [otp, setOtp] = useState('');
    const [verificationToken, setVerificationToken] = useState('');
    const [maskedEmail, setMaskedEmail] = useState('');
    const [verifiedName, setVerifiedName] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [isPaymentPending, setIsPaymentPending] = useState(false);


    /* ── Prevent Refresh & Back Navigation ── */
    const formDataRef = useRef(formData);
    const submittingRef = useRef(submitting);
    const stepRef = useRef(currentStep);

    useEffect(() => { formDataRef.current = formData; }, [formData]);
    useEffect(() => { submittingRef.current = submitting; }, [submitting]);
    useEffect(() => { stepRef.current = currentStep; }, [currentStep]);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            const data = formDataRef.current;
            const isSubmitting = submittingRef.current;
            const step = stepRef.current;

            const isDirty = data.email || data.roll_number || data.admission_number || data.phone;
            const shouldWarn = step > 1 || isSubmitting || (isDirty && isDirty.length > 0);

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

            const isDirty = data.email || data.roll_number || data.admission_number || data.phone;
            const shouldWarn = step > 1 || isSubmitting || (isDirty && isDirty.length > 0);

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

        // Push initial state to allow trapping
        window.history.pushState(null, document.title, window.location.href);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    useEffect(() => {
        if (localStorage.getItem('threads26_participant_id')) {
            navigate('/portal');
            return;
        }
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const data = await loadEventsAPI();

            if (data.events && Array.isArray(data.events)) {
                setWorkshops(data.events.filter(e => e.event_type === 'workshop'));
                setEvents(data.events.filter(e => e.event_type !== 'workshop'));

                if (data.registration_open === false) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Registration Closed',
                        text: 'Registration period has ended. Please contact organizers.',
                        confirmButtonColor: '#dc2626',
                        confirmButtonText: 'OK',
                        background: '#1a1a1a',
                        color: '#fff'
                    });
                }
            }
        } catch (error) {
            console.error('Error loading events:', error);
            Swal.fire({
                icon: 'error',
                title: 'Failed to Load Events',
                text: 'Please refresh the page to try again.',
                className: 'bg-gray-900 text-white',
                background: '#1a1a1a',
                color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    };

    const validateStep1 = () => {
        const newErrors = {};

        if (!isVerified) {
            newErrors.verification = 'Please verify your Roll Number with OTP first';
            Swal.fire({
                icon: 'warning',
                title: 'Verification Required',
                text: 'Please verify your Roll Number via OTP before proceeding.',
                background: '#1a1a1a',
                color: '#fff'
            });
            setErrors(newErrors);
            return false;
        }

        if (!formData.gender) newErrors.gender = 'Gender is required';

        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        else if (formData.phone.length !== 10) newErrors.phone = 'Must be 10 digits';

        if (!formData.year_of_study) newErrors.year_of_study = 'Year is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendOTP = async () => {
        if (!formData.roll_number?.trim()) {
            setErrors(prev => ({ ...prev, roll_number: 'Roll number is required' }));
            return;
        }

        // --- NEW VALIDATION FOR FIRST YEAR STUDENTS ---
        if (formData.year_of_study === '1') {
            const admissionNumber = formData.roll_number.trim().toUpperCase();
            if (admissionNumber.length !== 10) {
                setErrors(prev => ({ ...prev, roll_number: 'Admission number must be exactly 10 characters' }));
                Swal.fire({
                    icon: 'warning',
                    title: 'Invalid Admission Number',
                    text: 'First year admission number must be exactly 10 characters long.',
                    background: '#1a1a1a',
                    color: '#fff'
                });
                return;
            }
            if (!/[A-Z]/.test(admissionNumber)) {
                setErrors(prev => ({ ...prev, roll_number: 'Admission number must contain at least one letter' }));
                Swal.fire({
                    icon: 'warning',
                    title: 'Invalid Admission Number',
                    text: 'First year admission number must contain at least one alphabet.',
                    background: '#1a1a1a',
                    color: '#fff'
                });
                return;
            }
        }

        setVerifying(true);
        try {
            const data = await sendSonacseOTP({
                roll_number: formData.roll_number.trim().toUpperCase()
            });

            if (data.success) {
                setIsOTPSent(true);
                setMaskedEmail(data.email);
                setVerifiedName(data.name);
                Swal.fire({
                    icon: 'success',
                    title: 'OTP Sent',
                    html: `Verification code sent to <strong>${data.email}</strong><br/><span style="font-size:12px;color:#facc15;">⚠️ Can't find it? Check your <strong>spam or junk</strong> folder too.</span>`,
                    background: '#1a1a1a',
                    color: '#fff'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to send OTP',
                    text: data.message || 'Error occurred',
                    background: '#1a1a1a',
                    color: '#fff'
                });
            }
        } catch (error) {
            console.error('Send OTP Error:', error);
            Swal.fire({
                icon: 'error',
                title: error.message.includes('HTTP') ? 'Error' : 'Network Error',
                text: error.message || 'Failed to connect to the server',
                background: '#1a1a1a',
                color: '#fff'
            });
        } finally {
            setVerifying(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp || otp.length !== 6) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid OTP',
                text: 'Please enter a valid 6-digit OTP',
                background: '#1a1a1a',
                color: '#fff'
            });
            return;
        }

        setVerifying(true);
        try {
            const data = await verifySonacseOTP({
                roll_number: formData.roll_number.trim().toUpperCase(),
                otp: otp.trim()
            });

            if (data.success) {
                setIsVerified(true);
                setVerificationToken(data.verification_token);
                // Pre-fill year if possible, but let user select
                Swal.fire({
                    icon: 'success',
                    title: 'Verified',
                    text: 'Roll number verified successfully!',
                    background: '#1a1a1a',
                    color: '#fff',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Verification Failed',
                    text: data.message || 'Invalid OTP',
                    background: '#1a1a1a',
                    color: '#fff'
                });
            }
        } catch (error) {
            console.error('Verify OTP Error:', error);
            Swal.fire({
                icon: 'error',
                title: error.message.includes('HTTP') ? 'Error' : 'Network Error',
                text: error.message || 'Failed to connect to the server',
                background: '#1a1a1a',
                color: '#fff'
            });
        } finally {
            setVerifying(false);
        }
    };

    const validateStep2 = () => {
        // For second/third year students, events must be empty
        // if (formData.year_of_study !== '1' && formData.event_selections.length > 0) {
        //     Swal.fire({
        //         icon: 'warning',
        //         title: 'Invalid Selection',
        //         text: 'Second and third year students cannot register for events.',
        //         confirmButtonColor: '#a855f7',
        //         background: '#1a1a1a',
        //         color: '#fff'
        //     });
        //     return false;
        // }

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

    const nextStep = () => {
        if (currentStep === 1 && validateStep1()) setCurrentStep(2);
        else if (currentStep === 2 && validateStep2()) setCurrentStep(3);
    };

    const prevStep = () => setCurrentStep(prev => prev - 1);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Handle different input types
        if (name === 'roll_number') {
            setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
        } else if (name === 'phone') {
            const numericValue = value.replace(/\D/g, '').slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: numericValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Clear error when typing
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleCheckboxChange = (e, type) => {
        const { value, checked } = e.target;
        const fieldName = type === 'workshop' ? 'workshop_selections' : 'event_selections';

        // For event checkboxes, only first-year students are allowed
        // if (type === 'event' && formData.year_of_study !== '1') {Event registration will be available on the spot.
        //     Swal.fire({
        //         icon: 'info',
        //         title: 'Events Not Available',
        //         text: 'Only first-year students can register for the events. Second-year and third-year students can register on the spot for events (Both Technical and Non Technical)',
        //         confirmButtonColor: '#a855f7',
        //         background: '#1a1a1a',
        //         color: '#fff',
        //         toast: true,
        //         position: 'top-end',
        //         timer: 3000,
        //         showConfirmButton: false
        //     });
        //     return; // Don't update state
        // }

        // Find the selected event from the events array
        const selectedEvent = events.find(event => event.event_id.toString() === value.toString());

        // Check if it's a non-technical event
        const isNonTechnical = selectedEvent?.event_type?.toLowerCase() === 'non technical' ||
            selectedEvent?.event_type?.toLowerCase() === 'non-technical';

        // Check if user has any technical events selected
        const hasTechnicalSelected = formData.event_selections.some(id => {
            const event = events.find(e => e.event_id.toString() === id.toString());
            return event?.event_type?.toLowerCase() === 'technical';
        });

        setFormData(prev => {
            const currentSelections = prev[fieldName];

            if (type === 'workshop') {
                // Radio button behavior for workshops (Select only one)
                if (checked) {
                    return { ...prev, [fieldName]: [value] };
                } else {
                    return { ...prev, [fieldName]: [] };
                }
            } else {
                // Checkbox behavior for events with Technical/Non-Technical logic
                if (checked) {
                    // If trying to select non-technical but no technical selected
                    if (isNonTechnical && !hasTechnicalSelected) {
                        // Show warning message
                        Swal.fire({
                            icon: 'warning',
                            title: 'Technical Event Required',
                            text: 'Please select at least one Technical event before selecting Non-Technical events.',
                            confirmButtonColor: '#00f3ff',
                            background: '#1a1a1a',
                            color: '#fff'
                        });
                        return prev; // Don't update state
                    }

                    // Allow selection
                    return { ...prev, [fieldName]: [...currentSelections, value] };
                } else {
                    // Allow deselection
                    return { ...prev, [fieldName]: currentSelections.filter(id => id !== value) };
                }
            }
        });
    };

    const calculateTotal = () => {
        let total = 0;

        // Add workshop fee if any workshop selected (₹300 for all)
        if (formData.workshop_selections.length > 0) {
            total += 300;
        }

        // Add event fee for FIRST YEAR students only (₹250 flat rate regardless of count)
        if (formData.year_of_study === '1' && formData.event_selections.length > 0) {
            total += 250; // Flat rate for students no matter how many events
        }

        return total;
    };

    const handleSubmit = async () => {
        setSubmitting(true);

        // Clear previous registration session data to prevent test overlap
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('threads26_')) {
                localStorage.removeItem(key);
            }
        });

        // Prepare payload with verification token
        const payload = {
            verification_token: verificationToken,
            roll_number: formData.roll_number.trim().toUpperCase(),
            phone: formData.phone,
            year_of_study: formData.year_of_study,
            gender: formData.gender,
            workshop_selections: formData.workshop_selections,
            event_selections: formData.event_selections
        };


        try {
            console.log('%c[SONACSE] Registration Payload Sent:', 'color:#00f3ff;font-weight:bold', payload);
            const data = await submitSonacseRegistration(payload);
            console.log('%c[SONACSE] Registration Response:', 'color:#10b981;font-weight:bold', data);

            if (data.success) {
                // Backend returns participant_id at top level (no participant_details)
                if (data.participant_id) {
                    localStorage.setItem('threads26_participant_id', String(data.participant_id));
                    localStorage.setItem('threads26_last_reg_response', JSON.stringify(data));
                }

                if (!data.needs_payment) {
                    await handleSuccess(data);
                } else {
                    setIsPaymentPending(true);
                    await handlePaymentRequired(data);
                }
            } else {
                handleError(data);
            }
        } catch (error) {
            console.error('Registration error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Network Error',
                text: 'Please check your connection and try again.',
                background: '#1a1a1a',
                color: '#fff'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleSuccess = async (data) => {
        // Backend fields: participant_id and name at top level
        const pid = data.participant_id;
        const name = data.participant_name || data.name;

        console.log('%c[SONACSE] handleSuccess called:', 'color:#10b981;font-weight:bold', {
            participant_id: pid,
            name,
            qr: data.qr ? '[QR BASE64 PRESENT]' : null,
            full_response: data
        });

        if (pid) {
            localStorage.setItem('threads26_participant_id', String(pid));
            localStorage.setItem('threads26_last_reg_response', JSON.stringify(data));
        }

        // For free registrations, qr is returned as `data.qr`
        if (data.qr) {
            localStorage.setItem('threads26_qr_code', data.qr);
        }

        await Swal.fire({
            icon: 'success',
            title: 'Registration Successful!',
            html: `
                <div class="text-left space-y-2">
                    <p><strong class="text-neon-cyan">Name:</strong> ${name || 'N/A'}</p>
                    <p><strong class="text-neon-cyan">ID:</strong> ${pid || 'N/A'}</p>
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
        // Backend response fields at TOP LEVEL: participant_id, participant_name, total_amount
        const participantId = data.participant_id;        // integer from DB
        // Use payment_options.amount for exact match with DB (avoids any rounding mismatch)
        const amount = (data.payment_options && data.payment_options.amount) || data.total_amount || 0;
        // Backend uses payment_reference or payment_ref
        const reference = data.payment_reference || data.payment_ref || ('SONA-' + participantId);
        // Get UPI ID from backend payment_options
        const upiId = 'rajikutty106@okaxis';
        const payeeName = 'SONA CSE';

        console.log('%c[SONACSE] handlePaymentRequired called:', 'color:#f59e0b;font-weight:bold', {
            participant_id: participantId,
            amount,
            reference,
            upi_id: upiId,
            full_response: data
        });

        // UPI payment URL
        const upiUrl = 'upi://pay?pa=' + upiId + '&pn=' + encodeURIComponent(payeeName) + '&am=' + amount + '&cu=INR&tn=' + encodeURIComponent(reference);

        // Backend only sends qr for FREE registrations; for paid we generate QR from UPI URL
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
                    const verified = await verifyPayment(verifyPayload);
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


    const verifyPayment = async (paymentDetails) => {
        Swal.fire({
            title: 'Verifying Payment...',
            html: 'Please wait while we confirm your payment.',
            didOpen: () => Swal.showLoading(),
            background: '#1a1a1a',
            color: '#fff',
            allowOutsideClick: false
        });

        try {
            // Verify endpoint only needs: participant_id, transaction_id, amount
            const data = await verifySonacsePayment({
                participant_id: paymentDetails.participant_id,
                transaction_id: paymentDetails.transaction_id,
                amount: paymentDetails.amount
            });

            if (data.success) {
                console.log('%c[SONACSE] Verify Payment Response (SUCCESS):', 'color:#10b981;font-weight:bold', data);
                // Verify response has qr_code at top level
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
                console.warn('%c[SONACSE] Verify Payment Response (FAILED):', 'color:#ef4444;font-weight:bold', data);
                await Swal.fire({
                    icon: 'error',
                    title: 'Verification Failed',
                    text: data.details || data.error || 'Payment could not be verified.',
                    confirmButtonColor: '#dc2626',
                    background: '#1a1a1a',
                    color: '#fff',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
                return false;
            }
        } catch (error) {
            console.error('%c[SONACSE] Verify Payment Error:', 'color:#ef4444;font-weight:bold', error);
            await Swal.fire({
                icon: 'error',
                title: 'Verification Error',
                text: error.message || 'Network error occurred.',
                confirmButtonColor: '#dc2626',
                background: '#1a1a1a',
                color: '#fff',
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            return false;
        }
    };

    const handleError = (data) => {
        let errorMsg = data.message || 'Registration failed';
        if (errorMsg.includes('INVALID_SONACSE_ROLL')) errorMsg = 'Invalid SONACSE Roll/Admission Number';
        else if (errorMsg.includes('EMAIL_EXISTS')) errorMsg = 'Email Already Registered';
        else if (errorMsg.includes('SEAT_UNAVAILABLE')) errorMsg = 'Seats Unavailable';

        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMsg,
            confirmButtonColor: '#dc2626',
            background: '#1a1a1a',
            color: '#fff'
        });
    };

    const generateQRCode = async (data) => {
        if (data.qr_code) return data.qr_code;

        try {
            const qrData = JSON.stringify({
                id: data.participant_details?.participant_id,
                name: data.participant_details?.participant_name,
                event: "THREADS'26",
                type: "SONACSE"
            });
            return await QRCode.toDataURL(qrData, {
                errorCorrectionLevel: 'H',
                margin: 1,
                width: 250,
                color: { dark: '#00f3ff', light: '#00000000' } // Neon cyan on transparent
            });
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    const steps = [
        { number: 1, title: 'Personal Info' },
        { number: 2, title: 'Event Selection' },
        { number: 3, title: 'Confirm' }
    ];

    return (
        <div className="pt-24 px-4 md:px-8 min-h-screen max-w-4xl mx-auto pb-20 relative z-20">
            {/* Steps Indicator */}
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

                <h1 className="text-3xl md:text-5xl font-bold font-orbitron text-center mb-2 uppercase">
                    SONACSE <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">REGISTRATION</span>
                </h1>
                <p className="text-center text-gray-400">Exclusive Portal for Department Students</p>
            </div>

            {/* Main Form Container */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                <AnimatePresence mode="wait">

                    {/* STEP 1: PERSONAL DETAILS */}
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-6"
                        >
                            <h3 className="text-xl font-bold font-orbitron text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                                <User className="text-neon-cyan" /> Personal Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* STEP 1a: UNVERIFIED STATE */}
                                {!isVerified ? (
                                    <div className="col-span-1 md:col-span-2 space-y-6">
                                        <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                                            <p className="text-sm text-blue-300 flex items-center gap-2">
                                                <Info size={16} /> Select your year and enter your ID to receive a verification OTP.
                                            </p>
                                        </div>

                                        {/* Year Selection FIRST */}
                                        <div className="space-y-4">
                                            <label className="block text-sm font-medium text-gray-400">Year of Study <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <select
                                                    name="year_of_study"
                                                    value={formData.year_of_study}
                                                    onChange={handleInputChange}
                                                    disabled={isOTPSent}
                                                    className={`w-full bg-white/5 border ${errors.year_of_study ? 'border-red-500' : 'border-white/10'} rounded-lg py-3 px-4 pl-12 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all appearance-none`}
                                                >
                                                    <option value="" className="bg-black text-gray-500">Select Year of Study</option>
                                                    <option value="1" className="bg-black">First Year</option>
                                                    <option value="2" className="bg-black">Second Year</option>
                                                    <option value="3" className="bg-black">Third Year</option>

                                                </select>
                                                <Grid className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
                                            </div>
                                            {errors.year_of_study && <p className="text-red-500 text-xs mt-1">{errors.year_of_study}</p>}
                                        </div>

                                        {formData.year_of_study && !isOTPSent && (
                                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                                <label className="block text-sm font-medium text-gray-400">
                                                    {formData.year_of_study === '1' ? 'Admission Number' : 'Register Number'} <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        name="roll_number"
                                                        value={formData.roll_number}
                                                        onChange={handleInputChange}
                                                        placeholder={formData.year_of_study === '1' ? "e.g. 24CSE001" : "e.g. 727622BCS001"}
                                                        className={`w-full bg-white/5 border ${errors.roll_number ? 'border-red-500' : 'border-white/10'} rounded-lg py-3 px-4 pl-12 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all uppercase`}
                                                    />
                                                    <Shield className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
                                                </div>
                                                <button
                                                    onClick={handleSendOTP}
                                                    disabled={verifying || !formData.roll_number}
                                                    className="w-full bg-gradient-to-r from-neon-cyan to-blue-600 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all font-orbitron"
                                                >
                                                    {verifying ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                                                    SEND VERIFICATION CODE
                                                </button>
                                            </div>
                                        )}

                                        {isOTPSent && !isVerified && (
                                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                                <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-white/5">
                                                    <p className="text-sm text-gray-400 mb-1">Verification code sent to:</p>
                                                    <p className="text-neon-cyan font-bold text-lg">{maskedEmail}</p>
                                                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter italic">Check your Sona Mail / Personal Email</p>
                                                </div>

                                                <label className="block text-sm font-medium text-gray-400">Enter 6-Digit OTP <span className="text-red-500">*</span></label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                        placeholder="000000"
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-4 text-center text-3xl tracking-[1rem] text-neon-cyan focus:outline-none focus:border-neon-cyan transition-all font-mono"
                                                    />
                                                </div>

                                                <button
                                                    onClick={handleVerifyOTP}
                                                    disabled={verifying || otp.length !== 6}
                                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all font-orbitron"
                                                >
                                                    {verifying ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                                                    VERIFY & CONTINUE
                                                </button>

                                                <button
                                                    onClick={() => setIsOTPSent(false)}
                                                    className="w-full text-gray-500 text-sm hover:text-white transition-colors"
                                                >
                                                    Change Details
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* STEP 1b: VERIFIED STATE - PROFILE DETAILS */
                                    <>
                                        <div className="col-span-1 md:col-span-2">
                                            <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs text-green-500 uppercase font-bold tracking-wider">Verified {formData.year_of_study} Year Student</p>
                                                    <p className="text-xl font-bold text-white">{verifiedName}</p>
                                                    <p className="text-sm text-gray-400 font-mono uppercase">{formData.roll_number} • {maskedEmail}</p>
                                                </div>
                                                <div className="bg-green-500 rounded-full p-1 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                                                    <Check size={24} className="text-black" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Gender */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Gender <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <select
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleInputChange}
                                                    className={`w-full bg-white/5 border ${errors.gender ? 'border-red-500' : 'border-white/10'} rounded-lg py-3 px-4 pl-12 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all appearance-none`}
                                                >
                                                    <option value="" className="bg-black text-gray-500">Select Gender</option>
                                                    <option value="Male" className="bg-black">Male</option>
                                                    <option value="Female" className="bg-black">Female</option>
                                                    <option value="Other" className="bg-black">Other</option>
                                                </select>
                                                <User className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
                                            </div>
                                            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    maxLength={10}
                                                    placeholder="Enter 10-digit mobile number"
                                                    className={`w-full bg-white/5 border ${errors.phone ? 'border-red-500' : 'border-white/10'} rounded-lg py-3 px-4 pl-12 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all`}
                                                />
                                                <Phone className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
                                            </div>
                                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: EVENT SELECTION */}
                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-8"
                        >
                            <h3 className="text-xl font-bold font-orbitron text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                                <Calendar className="text-neon-cyan" /> Event Selection
                            </h3>

                            {/* Refreshments Info */}
                            <div className="bg-amber-400/10 border border-amber-400/30 p-4 rounded-xl flex items-center gap-3">
                                <Info size={20} className="text-amber-400 shrink-0" />
                                <p className="text-amber-200 text-sm font-bold font-orbitron uppercase tracking-wider">
                                    Registration fee includes lunch. Morning and afternoon refreshments will be provided.
                                </p>
                            </div>

                            {/* Workshops */}
                            <div className="mb-8">
                                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Zap className="text-amber-400" /> Workshops (Paid - Select One)
                                </h4>
                                {loading ? (
                                    <div className="text-center py-8 text-gray-500"><Loader2 className="animate-spin inline mr-2" /> Loading workshops...</div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {workshops.map(workshop => {
                                            // Use CSE specific seat counts
                                            const totalSeats = workshop.cse_seats || workshop.total_seats;
                                            const availableSeats = workshop.cse_available_seats !== undefined ? workshop.cse_available_seats : workshop.available_seats;

                                            const isSoldOut = availableSeats <= 0;
                                            const isSelected = formData.workshop_selections.includes(workshop.event_id.toString());

                                            return (
                                                <div
                                                    key={workshop.event_id}
                                                    onClick={() => !isSoldOut && handleCheckboxChange({ target: { value: workshop.event_id.toString(), checked: !isSelected } }, 'workshop')}
                                                    className={`cursor-pointer border rounded-xl p-4 transition-all ${isSoldOut ? 'border-red-500/30 opacity-60 bg-red-500/5' : isSelected ? 'border-amber-400 bg-amber-400/10' : 'bg-white/5 border-white/10 hover:border-amber-500/50 hover:bg-amber-500/5'}`}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h5 className="font-bold text-white text-sm">{workshop.event_name}</h5>
                                                            <span className="text-[10px] text-gray-400 border border-gray-700 rounded px-1.5 py-0.5 uppercase tracking-wider mt-1 inline-block">{workshop.event_type}</span>
                                                        </div>
                                                        <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded font-mono">
                                                            ₹300 {/* Fixed price for all CSE students */}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-gray-400 mb-3 space-y-1">

                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${isSelected ? 'bg-amber-400 border-amber-400' : 'border-gray-500'}`}>
                                                            {isSelected && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                                                        </div>
                                                        <span className={`text-sm ${isSoldOut ? 'text-red-400' : 'text-gray-300'}`}>
                                                            {isSoldOut ? 'Sold Out' : (isSelected ? 'Selected' : 'Select Workshop')}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Events */}
                            {/* {formData.year_of_study !== '1' && (
                                <h5>Event registration will be available on the spot.</h5>
                            )} */}
                            <div>
                                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Shield className="text-neon-green" />
                                    Events {formData.year_of_study === '1' ? '(₹250 for all events)' : '(Free for SONACSE)'}
                                </h4>
                                {loading ? (
                                    <div className="text-center py-8 text-gray-500"><Loader2 className="animate-spin inline mr-2" /> Loading events...</div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Technical Events Section */}
                                        {events.filter(event => event.event_type?.toLowerCase() === 'technical').length > 0 && (
                                            <div className="bg-blue-500/5 rounded-xl p-4 border border-blue-500/20">
                                                <h5 className="text-md font-bold text-blue-400 mb-3 flex items-center gap-2">
                                                    <Zap size={18} className="text-blue-400" /> TECHNICAL EVENTS
                                                </h5>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {events
                                                        .filter(event => event.event_type?.toLowerCase() === 'technical')
                                                        .map(event => {
                                                            const totalSeats = event.cse_seats || event.total_seats;
                                                            const availableSeats = event.cse_available_seats !== undefined ? event.cse_available_seats : event.available_seats;
                                                            const isSoldOut = availableSeats <= 0;
                                                            const isSelected = formData.event_selections.includes(event.event_id.toString());

                                                            return (
                                                                <div
                                                                    key={event.event_id}
                                                                    onClick={() => !isSoldOut && handleCheckboxChange({ target: { value: event.event_id.toString(), checked: !isSelected } }, 'event')}
                                                                    className={`cursor-pointer border rounded-xl p-4 transition-all 
                                                                        ${isSoldOut ? 'border-red-500/30 opacity-60 bg-red-500/5' :
                                                                            isSelected ? 'border-blue-400 bg-blue-400/10' :
                                                                                'bg-white/5 border-white/10 hover:border-blue-400/50 hover:bg-blue-400/5'}`}
                                                                >
                                                                    <div className="flex justify-between items-start mb-2">
                                                                        <div>
                                                                            <h5 className="font-bold text-white text-sm">{event.event_name}</h5>
                                                                            <span className="text-[10px] text-gray-400 border border-gray-700 rounded px-1.5 py-0.5 uppercase tracking-wider mt-1 inline-block">
                                                                                TECHNICAL
                                                                            </span>
                                                                        </div>

                                                                    </div>
                                                                    <div className="text-xs text-gray-400 mb-3 space-y-1">
                                                                        <p><Calendar size={12} className="inline mr-1" /> Day {event.day}</p>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <div className={`w-5 h-5 rounded border flex items-center justify-center mr-2 
                                                                            ${isSelected ? 'bg-blue-400 border-blue-400' : 'border-gray-500'}`}>
                                                                            {isSelected && <Check size={14} className="text-black" />}
                                                                        </div>
                                                                        <span className={`text-sm ${isSoldOut ? 'text-red-400' : 'text-gray-300'}`}>
                                                                            {isSoldOut ? 'Sold Out' : (isSelected ? 'Selected' : 'Select Event')}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Non-Technical Events Section */}
                                        {events.filter(event => event.event_type?.toLowerCase() === 'non technical' || event.event_type?.toLowerCase() === 'non-technical').length > 0 && (
                                            <div className="bg-purple-500/5 rounded-xl p-4 border border-purple-500/20">
                                                <h5 className="text-md font-bold text-purple-400 mb-3 flex items-center gap-2">
                                                    <Zap size={18} className="text-purple-400" /> NON-TECHNICAL EVENTS
                                                </h5>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {events
                                                        .filter(event => event.event_type?.toLowerCase() === 'non technical' || event.event_type?.toLowerCase() === 'non-technical')
                                                        .map(event => {
                                                            const totalSeats = event.cse_seats || event.total_seats;
                                                            const availableSeats = event.cse_available_seats !== undefined ? event.cse_available_seats : event.available_seats;
                                                            const isSoldOut = availableSeats <= 0;
                                                            const isSelected = formData.event_selections.includes(event.event_id.toString());

                                                            // Check if user has any technical events selected
                                                            const hasTechnicalSelected = formData.event_selections.some(id => {
                                                                const e = events.find(ev => ev.event_id.toString() === id.toString());
                                                                return e?.event_type?.toLowerCase() === 'technical';
                                                            });

                                                            const isDisabled = !hasTechnicalSelected && !isSoldOut;

                                                            return (
                                                                <div
                                                                    key={event.event_id}
                                                                    onClick={() => {
                                                                        if (isSoldOut) return;
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
                                                                        handleCheckboxChange({ target: { value: event.event_id.toString(), checked: !isSelected } }, 'event');
                                                                    }}
                                                                    className={`cursor-pointer border rounded-xl p-4 transition-all 
                                                                        ${isSoldOut ? 'border-red-500/30 opacity-60 bg-red-500/5' :
                                                                            isSelected ? 'border-purple-400 bg-purple-400/10' :
                                                                                isDisabled ? 'border-gray-700 opacity-50 bg-gray-800/30 cursor-not-allowed' :
                                                                                    'bg-white/5 border-white/10 hover:border-purple-400/50 hover:bg-purple-400/5'}`}
                                                                >
                                                                    <div className="flex justify-between items-start mb-2">
                                                                        <div>
                                                                            <h5 className="font-bold text-white text-sm">{event.event_name}</h5>
                                                                            <span className="text-[10px] text-gray-400 border border-gray-700 rounded px-1.5 py-0.5 uppercase tracking-wider mt-1 inline-block">
                                                                                NON-TECHNICAL
                                                                            </span>
                                                                        </div>

                                                                    </div>
                                                                    <div className="text-xs text-gray-400 mb-3 space-y-1">
                                                                        <p><Calendar size={12} className="inline mr-1" /> Day {event.day}</p>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <div className={`w-5 h-5 rounded border flex items-center justify-center mr-2 
                                                                            ${isSelected ? 'bg-purple-400 border-purple-400' :
                                                                                isDisabled ? 'border-gray-600 bg-gray-800' : 'border-gray-500'}`}>
                                                                            {isSelected && <Check size={14} className="text-black" />}
                                                                        </div>
                                                                        <span className={`text-sm ${isSoldOut ? 'text-red-400' :
                                                                            isDisabled ? 'text-gray-500' : 'text-gray-300'}`}>
                                                                            {isSoldOut ? 'Sold Out' :
                                                                                isDisabled ? 'Select Technical First' :
                                                                                    (isSelected ? 'Selected' : 'Select Event')}
                                                                        </span>
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
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: SUMMARY */}
                    {currentStep === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-6"
                        >
                            <h3 className="text-xl font-bold font-orbitron text-white mb-6 text-center">Registration Summary</h3>

                            <div className="bg-[#090011]/40 p-6 rounded-xl border border-white/10 space-y-4 font-mono text-sm shadow-inner">
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-gray-400">Student Name</span>
                                    <span className="text-white text-right">{verifiedName}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-gray-400">
                                        {formData.year_of_study === '1' ? 'Admission Number' : 'Register Number'}
                                    </span>
                                    <span className="text-white text-right font-mono uppercase">{formData.roll_number}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-gray-400">Verified Email</span>
                                    <span className="text-white text-right">{maskedEmail}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-gray-400">Year of Study</span>
                                    <span className="text-white text-right">
                                        {formData.year_of_study} Year
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-gray-400">Workshops</span>
                                    <div className="text-right text-white">
                                        {formData.workshop_selections?.map(id => (
                                            <div key={id}>{workshops.find(e => e.event_id.toString() === id.toString())?.event_name}</div>
                                        ))}
                                        {formData.workshop_selections?.length === 0 && 'None'}
                                    </div>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-gray-400">Events</span>
                                    <div className="text-right text-white">
                                        {formData.event_selections?.map(id => (
                                            <div key={id}>{events.find(e => e.event_id.toString() === id.toString())?.event_name}</div>
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

                            {!isPaymentPending ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="w-full bg-gradient-to-r from-neon-cyan to-blue-600 text-black font-bold font-orbitron py-4 rounded-xl hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? <Loader2 className="animate-spin" /> : <><Check className="w-5 h-5" /> FINALIZE REGISTRATION</>}
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

                {/* Navigation Buttons */}
                {!isPaymentPending && (
                    <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                        {currentStep > 1 ? (
                            <button onClick={prevStep} className="flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors font-orbitron text-sm uppercase tracking-widest">
                                <ChevronLeft size={20} /> Previous
                            </button>
                        ) : <div></div>}

                        {currentStep < 3 && (
                            <button onClick={nextStep} className="flex items-center gap-2 px-8 py-2 bg-white/10 border border-white/20 text-white font-bold rounded hover:bg-neon-cyan hover:text-black transition-all font-orbitron uppercase text-xs tracking-[0.2em]">
                                Next Phase <ChevronRight size={20} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Loading Overlay */}
            {
                submitting && (
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
                )
            }
        </div >
    );
};

export default CSERegister;
















