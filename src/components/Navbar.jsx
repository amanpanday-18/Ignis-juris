import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, ShoppingBag, LogOut, Search } from 'lucide-react';
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
            setScrolled(window.scrollY > 20);
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
        { name: 'Education', path: '/education' },
        { name: 'Internships', path: '/internships' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-4 md:px-8 py-4 ${scrolled ? 'mt-0' : 'mt-2'}`}>
                <div className={`max-w-7xl mx-auto rounded-2xl transition-all duration-500 ${scrolled ? 'glass-dark shadow-2xl py-2 px-6' : 'bg-transparent py-4 px-2'}`}>
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <img src={logo} alt="IGNIS JURIS" className="h-10 w-10 rounded-full object-cover border-2 border-accent/20 group-hover:border-accent transition-colors duration-500" />
                                <div className="absolute inset-0 rounded-full bg-accent/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <span className="font-serif font-black text-xl md:text-2xl text-white tracking-tighter group-hover:text-accent transition-colors">
                                IGNIS<span className="text-accent">JURIS</span>
                            </span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${location.pathname === link.path ? 'bg-white/10 text-accent' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            
                            <div className="h-6 w-px bg-white/10 mx-2"></div>

                            <Link to="/store" className="p-2 rounded-xl hover:bg-white/5 text-slate-300 hover:text-accent transition-all">
                                <ShoppingBag className="h-5 w-5" />
                            </Link>
                            
                            <Link to="/more" className="px-4 py-2 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                                More
                            </Link>

                            {user ? (
                                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/10">
                                    <Link to="/profile" className="flex items-center gap-2 group">
                                        <div className="h-8 w-8 rounded-full border-2 border-accent bg-slate-800 flex items-center justify-center text-white font-bold overflow-hidden">
                                            {user.user_metadata?.avatar_url ? (
                                                <img src={user.user_metadata.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                                            ) : (
                                                <span>{user.user_metadata?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}</span>
                                            )}
                                        </div>
                                        <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors max-w-[100px] truncate">
                                            {user.user_metadata?.name || user.email.split('@')[0]}
                                        </span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="ml-4 px-6 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl text-sm font-black transition-all duration-300 shadow-lg shadow-accent/20 active:scale-95"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>

                        {/* Mobile controls */}
                        <div className="md:hidden flex items-center gap-2">
                            {!user && (
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="px-4 py-2 bg-accent text-white rounded-lg text-xs font-black"
                                >
                                    Sign In
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="p-2 rounded-xl bg-white/5 text-slate-300 hover:text-white transition-all"
                            >
                                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="md:hidden mt-4 px-2"
                        >
                            <div className="glass-dark rounded-2xl p-4 shadow-2xl border border-white/10 max-h-[75vh] overflow-y-auto">
                                <div className="flex flex-col gap-2">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            onClick={() => setIsOpen(false)}
                                            className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${location.pathname === link.path ? 'bg-primary/20 text-accent' : 'text-slate-300 hover:bg-white/5'}`}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                    <div className="h-px bg-white/5 my-2"></div>
                                    <Link to="/store" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-xl text-sm font-bold text-slate-300 flex items-center gap-3 hover:bg-white/5 transition-all">
                                        <ShoppingBag className="h-5 w-5" /> Store
                                    </Link>
                                    <Link to="/more" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-xl text-sm font-bold text-slate-300 hover:bg-white/5 transition-all">
                                        More Resources
                                    </Link>
                                    
                                    {user && (
                                        <>
                                            <div className="h-px bg-white/5 my-2"></div>
                                            <Link 
                                                to="/profile" 
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all"
                                            >
                                                <div className="h-8 w-8 rounded-full border border-accent bg-slate-800 flex items-center justify-center text-white font-bold overflow-hidden">
                                                    {user.user_metadata?.avatar_url ? (
                                                        <img src={user.user_metadata.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <span>{user.user_metadata?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-white">{user.user_metadata?.name || 'Profile'}</span>
                                                    <span className="text-xs text-slate-500">{user.email}</span>
                                                </div>
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setIsOpen(false);
                                                }}
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-bold"
                                            >
                                                <LogOut className="h-5 w-5" /> Sign Out
                                            </button>
                                        </>
                                    )}
                                </div>
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

