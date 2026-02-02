import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Scale, ChevronLeft, ChevronRight, Clock, User, Plus, Sparkles, X, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { newsCategories } from '../data/news-data';
import { NewsService } from '../services/news-service';
import { useAdmin } from '../hooks/useAdmin';
import AddNewsModal from '../components/AddNewsModal';
import { Helmet } from 'react-helmet-async';

const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNews, setSelectedNews] = useState(null);
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const { isAdmin } = useAdmin();
    const { user } = useAuth();

    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async () => {
        try {
            const data = await NewsService.getAll();
            setNews(data);
        } catch (error) {
            console.error('Error loading news:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNews = (newArticle) => {
        setNews([newArticle, ...news]);
    };

    const handleDeleteNews = async (id) => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            try {
                await NewsService.delete(id);
                setNews(news.filter(art => art.id !== id));
            } catch (error) {
                console.error('Error deleting news:', error);
                alert('Failed to delete article.');
            }
        }
    };

    const filteredNews = news.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <>
            <div className="min-h-screen bg-slate-900 text-white selection:bg-accent selection:text-white">
                <Helmet>
                    <title>IGNIS JURIS - Justice Simplified</title>
                    <meta name="description" content="Your comprehensive legal platform for news, resources, and AI-powered document drafting." />
                </Helmet>

                {/* Hero Section */}
                <div className="relative overflow-hidden bg-slate-900 min-h-[600px] flex items-center">
                    {/* Radial Gradient Background */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900"></div>

                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center max-w-4xl mx-auto"
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="flex justify-center mb-6"
                            >
                                <Scale className="h-20 w-20 text-accent drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                            </motion.div>
                            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 tracking-tight">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white to-indigo-400">
                                    JUSTICE SIMPLIFIED
                                </span>
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-300 mb-10 leading-relaxed font-light">
                                Empowering your legal journey with AI-driven insights, expert connections, and seamless drafting.
                            </p>

                        </motion.div>
                    </div>
                </div>

                {/* Feature Cards Removed */}

                {/* Latest Legal News - Removed */}

                {/* News Modal */}
                <AnimatePresence>
                    {selectedNews && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 text-white">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="bg-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl border border-white/10"
                            >
                                <button
                                    onClick={() => setSelectedNews(null)}
                                    className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-10 transition-colors backdrop-blur-sm"
                                >
                                    <X className="h-6 w-6" />
                                </button>

                                <div className="h-80 md:h-96 relative">
                                    <img
                                        src={selectedNews.image_url}
                                        alt={selectedNews.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-slate-800/60 to-transparent flex flex-col justify-end p-8 md:p-12">
                                        <span className="bg-accent/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase w-fit mb-4 shadow-lg">
                                            {selectedNews.category}
                                        </span>
                                        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                                            {selectedNews.title}
                                        </h2>
                                    </div>
                                </div>

                                <div className="p-8 md:p-12">
                                    <div className="flex items-center text-slate-400 mb-10 border-b border-white/5 pb-8 gap-8">
                                        <div className="flex items-center">
                                            <div className="bg-white/5 p-3 rounded-full mr-4">
                                                <User className="h-5 w-5 text-slate-300" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Author</p>
                                                <p className="text-base font-bold text-slate-200">{selectedNews.author}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="bg-white/5 p-3 rounded-full mr-4">
                                                <Calendar className="h-5 w-5 text-slate-300" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Published</p>
                                                <p className="text-base font-bold text-slate-200">{new Date(selectedNews.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="prose prose-lg prose-invert max-w-none text-slate-300 leading-relaxed">
                                        {selectedNews.content.split('\n\n').map((paragraph, idx) => (
                                            <p key={idx} className="mb-6">{paragraph}</p>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <AddNewsModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAddNews}
                />

                Disclaimer
            </motion.button>
        </div >
            </div >

    {/* Disclaimer Toggle - Fixed at bottom right */ }
    < div className = "fixed bottom-4 right-8 z-[9999] flex flex-col items-end" >
                <AnimatePresence>
                    {showDisclaimer && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="bg-slate-800/95 backdrop-blur-md p-4 rounded-xl border border-white/10 text-[10px] text-slate-400 shadow-2xl leading-relaxed max-w-sm mb-4"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <strong className="text-slate-300">Disclaimer</strong>
                                <button onClick={() => setShowDisclaimer(false)} className="text-slate-500 hover:text-white">
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                            <p className="mb-2">This website is for educational purposes only and is intended to share legal knowledge. The content provided here does not constitute professional legal advice, and no attorney-client relationship is formed by your use of this site. As I am a law student, the information provided may not reflect the most current legal developments. For specific legal issues, please consult a licensed legal professional.</p>
                            <p>We do not take responsibility for any information provided on the website. This entire website is for educational purposes only, and no responsibility will be taken for its authenticity.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDisclaimer(!showDisclaimer)}
                    className="bg-accent/90 hover:bg-accent text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-sm transition-colors flex items-center justify-center group font-bold text-xs tracking-wide"
                    title="Read Disclaimer"
                >
                    Disclaimer
                </motion.button>
            </div >
        </>
    );
};

export default Home;
