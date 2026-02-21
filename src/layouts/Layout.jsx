import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CyberBackground from '../components/CyberBackground';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const Layout = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="flex flex-col min-h-screen bg-transparent relative overflow-hidden" style={{ position: 'relative', zIndex: 1 }}>
            <Navbar />
            <main className="flex-grow pt-20 pb-20 md:pb-0 w-full relative z-10">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
