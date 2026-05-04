import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, ShoppingBag, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';


import logo from '../assets/ignis_juris_logo.jpg';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const { user, logout } = useAuth();

    const navigate = useNavigate();
    const location = useLocation(); // Add useLocation

    // Check for openLogin state from redirect
    React.useEffect(() => {
        if (location.state?.openLogin) {
            setIsAuthModalOpen(true);
            // Optional: Clear state so it doesn't reopen on refresh (though refresh clears state anyway usually)
            // But we want to keep 'from' state if we want to redirect back
        }
    }, [location.state]);



    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
    ];

    const handleNavClick = (link, e) => {
        if (link.scrollTo) {
            e.preventDefault();
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(link.scrollTo);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        } else if (link.path === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };



    return (
        <>
            <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg border-b border-white/5">
                <div className="w-full px-2 sm:px-4 lg:px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <img src={logo} alt="IGNIS JURIS Logo" className="h-10 w-10 rounded-full object-cover border border-accent/20" />
                            <span className="font-bold text-xl md:text-2xl text-accent tracking-wider whitespace-nowrap">
                                IGNIS JURIS
                            </span>
                        </Link>

                        {/* Desktop Search removed */}
                        <div className="hidden md:flex flex-1 mx-4"></div>

                        {/* Desktop Menu */}
                        <div className="hidden md:block">
                            <div className="ml-2 flex items-center space-x-1">

                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={(e) => handleNavClick(link, e)}
                                        className="px-2 py-2 rounded-md text-sm font-medium hover:text-accent transition-colors whitespace-nowrap"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <Link to="/store" className="p-2 rounded-full hover:bg-primary-light transition-colors">
                                    <ShoppingBag className="h-5 w-5" />
                                </Link>
                                <Link
                                    to="/more"
                                    className="px-2 py-2 rounded-md text-sm font-medium hover:text-accent transition-colors whitespace-nowrap"
                                >
                                    More
                                </Link>

                                {user ? (
                                    <div className="flex items-center space-x-2 ml-2">
                                        <Link to="/profile" className="flex items-center space-x-2 hover:text-accent transition-colors">
                                            <div className="h-8 w-8 rounded-full border-2 border-accent bg-slate-700 flex items-center justify-center text-white font-bold overflow-hidden">
                                                {user.user_metadata?.avatar_url ? (
                                                    <img src={user.user_metadata.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                                                ) : (
                                                    <span>{user.user_metadata?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}</span>
                                                )}
                                            </div>
                                            <span className="text-sm font-medium">{user.user_metadata?.name || user.email}</span>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="p-2 rounded-full hover:bg-primary-light text-gray-400 hover:text-white transition-colors"
                                            title="Logout"
                                        >
                                            <LogOut className="h-5 w-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsAuthModalOpen(true)}
                                        className="flex items-center space-x-2 bg-accent hover:bg-accent-hover px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                                    >
                                        <User className="h-5 w-5" />
                                        <span>Sign In</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-primary-light focus:outline-none"
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
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-slate-900 border-b border-white/5"
                        >
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">

                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className="block px-3 py-2 rounded-md text-base font-medium hover:text-accent hover:bg-primary transition-colors"
                                        onClick={(e) => {
                                            handleNavClick(link, e);
                                            setIsOpen(false);
                                        }}
                                    >
                                        {link.name}
                                    </Link>
                                ))}


                                {user ? (
                                    <>
                                        <Link
                                            to="/profile"
                                            className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:text-accent hover:bg-primary transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {user.user_metadata?.avatar_url ? (
                                                <img src={user.user_metadata.avatar_url} alt="Profile" className="h-6 w-6 rounded-full object-cover mr-2 border border-accent/50" />
                                            ) : (
                                                <User className="h-5 w-5 mr-2" />
                                            )}
                                            Profile ({user.user_metadata?.name || user.email})
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsOpen(false);
                                            }}
                                            className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-primary transition-colors"
                                        >
                                            <LogOut className="h-5 w-5 mr-2" />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            setIsAuthModalOpen(true);
                                        }}
                                        className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-accent hover:bg-primary transition-colors"
                                    >
                                        Sign In
                                    </button>
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
