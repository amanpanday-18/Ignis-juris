import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/ignis_juris_logo.jpg';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (location.state?.openLogin) {
            setIsAuthModalOpen(true);
        }
    }, [location.state]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    // Close mobile menu on outside click
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => {
            if (!e.target.closest('nav')) setIsOpen(false);
        };
        document.addEventListener('mousedown', handler);
        document.addEventListener('touchstart', handler);
        return () => {
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('touchstart', handler);
        };
    }, [isOpen]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Education', path: '/education' },
        { name: 'Internships', path: '/internships' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 bg-white ${
                    scrolled ? 'shadow-[0_1px_0_0_#e5e5e5]' : 'border-b border-[#e5e5e5]'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-between h-16 md:h-[68px]">

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-4 group shrink-0 py-1">
                            <img
                                src={logo}
                                alt="IGNIS JURIS"
                                className="h-14 w-14 rounded-full object-cover border-2 border-[#e5e5e5] shadow-md"
                            />
                            <span
                                className="font-black text-2xl md:text-3xl text-[#1c1b1b] tracking-tighter group-hover:text-[#474545] transition-colors"
                                style={{ fontFamily: "'Source Sans Pro', sans-serif" }}
                            >
                                /IGNIS JURIS
                            </span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                        location.pathname === link.path
                                            ? 'text-[#1c1b1b] bg-[#f3f3f3]'
                                            : 'text-[#474545] hover:text-[#1c1b1b] hover:bg-[#f3f3f3]'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <Link
                                to="/store"
                                className="px-4 py-2 rounded-lg text-sm font-semibold text-[#474545] hover:text-[#1c1b1b] hover:bg-[#f3f3f3] transition-all duration-200 flex items-center gap-1.5"
                            >
                                <ShoppingBag className="h-4 w-4" />
                                Store
                            </Link>

                            <Link
                                to="/more"
                                className="px-4 py-2 rounded-lg text-sm font-semibold text-[#474545] hover:text-[#1c1b1b] hover:bg-[#f3f3f3] transition-all"
                            >
                                More
                            </Link>
                        </div>

                        {/* Right — Auth Buttons */}
                        <div className="hidden md:flex items-center gap-3">
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <Link to="/profile" className="flex items-center gap-2 group">
                                        <div className="h-8 w-8 rounded-full border border-[#e5e5e5] bg-[#f3f3f3] flex items-center justify-center text-[#1c1b1b] font-bold overflow-hidden text-sm">
                                            {user.user_metadata?.avatar_url ? (
                                                <img src={user.user_metadata.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                                            ) : (
                                                <span>{user.user_metadata?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}</span>
                                            )}
                                        </div>
                                        <span className="text-sm font-semibold text-[#474545] group-hover:text-[#1c1b1b] transition-colors max-w-[100px] truncate">
                                            {user.user_metadata?.name || user.email.split('@')[0]}
                                        </span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 rounded-lg hover:bg-[#f3f3f3] text-[#474545] hover:text-[#1c1b1b] transition-all"
                                        title="Sign out"
                                    >
                                        <LogOut className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* Contact Us — filled dark pill */}
                                    <button
                                        onClick={() => setIsAuthModalOpen(true)}
                                        className="px-5 py-2 bg-[#1c1b1b] text-white text-sm font-bold rounded-full hover:bg-[#474545] transition-all duration-200 active:scale-95"
                                    >
                                        Contact Us
                                    </button>
                                    {/* Sign In — outlined pill */}
                                    <button
                                        onClick={() => setIsAuthModalOpen(true)}
                                        className="px-5 py-2 border border-[#1c1b1b] text-[#1c1b1b] text-sm font-bold rounded-full hover:bg-[#1c1b1b] hover:text-white transition-all duration-200 active:scale-95"
                                    >
                                        Sign In
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Mobile controls */}
                        <div className="md:hidden flex items-center gap-2">
                            {!user && (
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="px-4 py-1.5 bg-[#1c1b1b] text-white rounded-full text-xs font-bold"
                                >
                                    Sign In
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="p-2 rounded-lg bg-[#f3f3f3] text-[#1c1b1b] hover:bg-[#e5e5e5] transition-all"
                            >
                                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden border-t border-[#e5e5e5] bg-white"
                        >
                            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                            location.pathname === link.path
                                                ? 'bg-[#f3f3f3] text-[#1c1b1b]'
                                                : 'text-[#474545] hover:bg-[#f3f3f3] hover:text-[#1c1b1b]'
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <div className="h-px bg-[#e5e5e5] my-2" />
                                <Link
                                    to="/store"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-3 rounded-xl text-sm font-semibold text-[#474545] hover:bg-[#f3f3f3] hover:text-[#1c1b1b] transition-all flex items-center gap-3"
                                >
                                    <ShoppingBag className="h-4 w-4" /> Store
                                </Link>
                                <Link
                                    to="/more"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-3 rounded-xl text-sm font-semibold text-[#474545] hover:bg-[#f3f3f3] hover:text-[#1c1b1b] transition-all"
                                >
                                    More Resources
                                </Link>

                                {user && (
                                    <>
                                        <div className="h-px bg-[#e5e5e5] my-2" />
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#f3f3f3] transition-all"
                                        >
                                            <div className="h-8 w-8 rounded-full border border-[#e5e5e5] bg-[#f3f3f3] flex items-center justify-center text-[#1c1b1b] font-bold overflow-hidden text-sm">
                                                {user.user_metadata?.avatar_url ? (
                                                    <img src={user.user_metadata.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                                                ) : (
                                                    <span>{user.user_metadata?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}</span>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-[#1c1b1b]">{user.user_metadata?.name || 'Profile'}</span>
                                                <span className="text-xs text-[#888]">{user.email}</span>
                                            </div>
                                        </Link>
                                        <button
                                            onClick={() => { handleLogout(); setIsOpen(false); }}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#474545] hover:bg-[#f3f3f3] transition-all text-sm font-semibold"
                                        >
                                            <LogOut className="h-4 w-4" /> Sign Out
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    );
};

export default Navbar;
