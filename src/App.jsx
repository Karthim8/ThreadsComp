import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import CyberBackground from './components/CyberBackground';
import SmoothCursor from './components/SmoothCursor';
import { Loader2 } from 'lucide-react';

// Lazy load all pages for fast initial load
const IntroPage = lazy(() => import('./pages/IntroPage'));
const Home = lazy(() => import('./pages/Home'));
const Events = lazy(() => import('./pages/Events'));
const Register = lazy(() => import('./pages/Register'));
const Success = lazy(() => import('./pages/Success'));
const Admin = lazy(() => import('./pages/Admin'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const ParticipantPortal = lazy(() => import('./pages/ParticipantPortal'));
const CSERegister = lazy(() => import('./pages/CSERegister'));
const SuperAdmin = lazy(() => import('./pages/SuperAdmin'));
const PaymentVerification = lazy(() => import('./pages/PaymentVerification'));
const CoordinatorSelect = lazy(() => import('./pages/CoordinatorSelect'));
const AttendancePortal = lazy(() => import('./pages/AttendancePortal'));
const About = lazy(() => import('./pages/About'));
const RuleBookPage = lazy(() => import('./pages/RuleBookPage'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="text-neon-cyan animate-spin" size={48} />
  </div>
);

function App() {
  return (
    <>
      <CyberBackground />
      <SmoothCursor />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Intro Landing Page */}
          <Route path="/" element={<IntroPage />} />

          {/* Main App Routes with Layout */}
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/cse" element={<CSERegister />} />
            <Route path="/portal" element={<ParticipantPortal />} />
            <Route path="/success" element={<Success />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/super" element={<SuperAdmin />} />
            <Route path="/admin/verify" element={<PaymentVerification />} />
            <Route path="/coordinator/select" element={<CoordinatorSelect />} />
            <Route path="/coordinator/attendance" element={<AttendancePortal />} />
            <Route path="/rulebook" element={<RuleBookPage />} />
          </Route>

          {/* Catch-all: redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
