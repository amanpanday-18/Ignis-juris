import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, ShoppingBag, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';

import { SearchService } from '../services/search-service';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState({ advocates: [], judgements: [], bareActs: [], news: [] });
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const { user, logout } = useAuth();

    const navigate = useNavigate();
    const searchInputRef = React.useRef(null);
    const mobileSearchInputRef = React.useRef(null);

    // Debounce search suggestions
    React.useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length >= 2) {
                try {
                    const results = await SearchService.searchAll(searchQuery);
                    setSuggestions(results);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                }
            } else {
                setSuggestions({ advocates: [], judgements: [], bareActs: [], news: [] });
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Close suggestions when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSuggestionClick = (path) => {
        navigate(path);
        setShowSuggestions(false);
        setSearchQuery('');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'News', path: '/', scrollTo: 'news-section' },
        { name: 'Advocates', path: '/advocates' },
        { name: 'Judgements', path: '/judgements' },
        { name: 'Drafting', path: '/drafting' },
        { name: 'AI Drafting', path: '/ai-drafting' },
        { name: 'More', path: '/more' },
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
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSearch = (e, isMobile = false) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        } else {
            // Focus input if query is empty
            if (isMobile && mobileSearchInputRef.current) {
                mobileSearchInputRef.current.focus();
            } else if (!isMobile && searchInputRef.current) {
                searchInputRef.current.focus();
            }
        }
    };

    return (
        <>
            <nav className="bg-primary text-white sticky top-0 z-50 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 font-bold text-2xl text-accent tracking-wider">
                            THE LEGAL REMEDIES
                        </Link>

                        {/* Desktop Search */}
                        <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
                            <form onSubmit={(e) => handleSearch(e, false)} className="w-full">
                                <div className="relative w-full">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer hover:text-accent transition-colors"
                                        onClick={(e) => handleSearch(e, false)}
                                    >
                                        <Search className="h-5 w-5 text-gray-500 hover:text-accent" />
                                    </div>
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent sm:text-sm transition duration-150 ease-in-out shadow-sm"
                                        placeholder="Search for advocates, judgements, bare acts..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => setShowSuggestions(true)}
                                    />
                                </div>
                            </form>

                            {/* Search Suggestions Dropdown */}
                            <AnimatePresence>
                                {showSuggestions && searchQuery.trim() && (suggestions.advocates?.length > 0 || suggestions.judgements?.length > 0 || suggestions.bareActs?.length > 0 || suggestions.news?.length > 0) && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50 max-h-96 overflow-y-auto"
                                    >
                                        {suggestions.advocates?.length > 0 && (
                                            <div className="p-2">
                                                <div className="text-xs font-semibold text-gray-500 uppercase px-2 mb-1">Advocates</div>
                                                {suggestions.advocates.slice(0, 3).map(item => (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => handleSuggestionClick(`/advocates`)}
                                                        className="flex items-center px-2 py-2 hover:bg-gray-50 cursor-pointer rounded-md group"
                                                    >
                                                        <Search className="h-4 w-4 text-gray-400 mr-2 group-hover:text-accent" />
                                                        <span className="text-sm text-gray-700 group-hover:text-primary">{item.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {suggestions.judgements?.length > 0 && (
                                            <div className="p-2 border-t border-gray-100">
                                                <div className="text-xs font-semibold text-gray-500 uppercase px-2 mb-1">Judgements</div>
                                                {suggestions.judgements.slice(0, 3).map(item => (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => handleSuggestionClick(`/judgements`)}
                                                        className="flex items-center px-2 py-2 hover:bg-gray-50 cursor-pointer rounded-md group"
                                                    >
                                                        <Search className="h-4 w-4 text-gray-400 mr-2 group-hover:text-accent" />
                                                        <span className="text-sm text-gray-700 group-hover:text-primary">{item.title || item.case_title}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {suggestions.bareActs?.length > 0 && (
                                            <div className="p-2 border-t border-gray-100">
                                                <div className="text-xs font-semibold text-gray-500 uppercase px-2 mb-1">Bare Acts</div>
                                                {suggestions.bareActs.slice(0, 3).map(item => (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => handleSuggestionClick(`/bare-acts`)}
                                                        className="flex items-center px-2 py-2 hover:bg-gray-50 cursor-pointer rounded-md group"
                                                    >
                                                        <Search className="h-4 w-4 text-gray-400 mr-2 group-hover:text-accent" />
                                                        <span className="text-sm text-gray-700 group-hover:text-primary">{item.title}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div
                                            onClick={(e) => handleSearch(e, false)}
                                            className="p-3 bg-gray-50 text-center cursor-pointer hover:bg-gray-100 border-t border-gray-100"
                                        >
                                            <span className="text-sm font-medium text-accent">View all results for "{searchQuery}"</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:block">
                            <div className="ml-4 flex items-center space-x-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={(e) => handleNavClick(link, e)}
                                        className="px-3 py-2 rounded-md text-sm font-medium hover:text-accent transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <Link to="/store" className="p-2 rounded-full hover:bg-primary-light transition-colors">
                                    <ShoppingBag className="h-5 w-5" />
                                </Link>

                                {user ? (
                                    <div className="flex items-center space-x-4 ml-2">
                                        <Link to="/profile" className="flex items-center space-x-2 hover:text-accent transition-colors">
                                            <div className="h-8 w-8 rounded-full border-2 border-accent bg-accent flex items-center justify-center text-white font-bold">
                                                {user.user_metadata?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
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
                                        className="flex items-center space-x-2 bg-accent hover:bg-accent-hover px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        <User className="h-4 w-4" />
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
                            className="md:hidden bg-primary-light"
                        >
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                                <div className="mb-4 px-2">
                                    <form onSubmit={(e) => { handleSearch(e, true); setIsOpen(false); }} className="w-full">
                                        <div className="relative w-full">
                                            <div
                                                className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer hover:text-white transition-colors"
                                                onClick={(e) => { handleSearch(e, true); }}
                                            >
                                                <Search className="h-5 w-5 text-gray-400 hover:text-white" />
                                            </div>
                                            <input
                                                ref={mobileSearchInputRef}
                                                type="text"
                                                className="block w-full pl-10 pr-3 py-2 rounded-md leading-5 bg-primary text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-white focus:text-gray-900 sm:text-sm"
                                                placeholder="Search..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                    </form>
                                </div>
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
                                            <User className="h-5 w-5 mr-2" />
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
