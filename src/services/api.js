const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://threads26-2-fdem.onrender.com/api';

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const API_KEY = import.meta.env.VITE_API_KEY || '7f8e3a1b9c4d2e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f';

export const fetchAPI = async (endpoint, options = {}, retries = 5) => {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': API_KEY,
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const msg = errorData.details || errorData.message || errorData.error || 'Unknown error';
            throw new Error(`HTTP ${response.status}: ${msg}`);
        }

        return await response.json();
    } catch (error) {
        if (retries > 0 && (error.name === 'TypeError' || error.message.includes('Failed to fetch') || error.message.includes('Load failed'))) {
            console.warn(`Neural Link Busy: Retrying ${endpoint}... (${retries} attempts left)`);
            await delay(3000); // 3 second delay for Render spin-up
            return fetchAPI(endpoint, options, retries - 1);
        }
        console.error('API Protocol Failure:', error);
        throw error;
    }
};


export const loadEventDates = () => fetchAPI('/event-dates');
export const loadEvents = () => fetchAPI('/events');

export const sendOTP = (data) => fetchAPI('/send-otp', {
    method: 'POST',
    body: JSON.stringify(data)
});

export const verifyOTP = (data) => fetchAPI('/verify-otp', {
    method: 'POST',
    body: JSON.stringify(data)
});

export const submitRegistration = (data) => fetchAPI('/register', {
    method: 'POST',
    body: JSON.stringify(data)
});

export const sendSonacseOTP = (data) => fetchAPI('/sonacse/send-otp', {
    method: 'POST',
    body: JSON.stringify(data)
});

export const verifySonacseOTP = (data) => fetchAPI('/sonacse/verify-otp', {
    method: 'POST',
    body: JSON.stringify(data)
});

export const submitSonacseRegistration = (data) => fetchAPI('/sonacse/register', {
    method: 'POST',
    body: JSON.stringify(data)
});

export const verifyPayment = (data) => fetchAPI('/verify-payment', {
    method: 'POST',
    body: JSON.stringify(data)
});

export const verifySonacsePayment = (data) => fetchAPI('/sonacse/verify-payment', {
    method: 'POST',
    body: JSON.stringify(data)
});
export const loadUserProfile = (participantId) => fetchAPI(`/participant/${participantId}/all`);

export const generateUPIQRCodeUrl = (participantId, amount, eventNames) => {
    const eventShortNames = eventNames.map(name =>
        name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 6)
    );

    const upiUrl =
        `upi://pay?pa=rajikutty106@okaxis` +
        `&pn=THREADS26` +
        `&am=${amount}` +
        `&cu=INR` +
        `&tn=THREADS26|${eventShortNames.join(',')}|REF:${participantId}`;

    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;
};
