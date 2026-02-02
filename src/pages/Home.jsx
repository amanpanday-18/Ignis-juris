import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Scale, FileText, Users, Search, ChevronLeft, ChevronRight, Clock, User, Plus, Sparkles, X, Calendar } from 'lucide-react';
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
                        <Link to="/ai-drafting">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-accent hover:bg-accent-hover text-white text-lg font-bold rounded-full shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all flex items-center mx-auto"
                            >
                                <Sparkles className="h-5 w-5 mr-2" />
                                Start AI Drafting
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Glassmorphism Feature Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link to="/judgements">
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-slate-800/50 backdrop-blur-md border border-white/5 p-8 rounded-2xl hover:bg-slate-800/80 transition-all shadow-xl group h-full"
                        >
                            <div className="bg-blue-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors duration-300">
                                <Search className="h-7 w-7 text-blue-400 group-hover:text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Smart Judgements</h3>
                            <p className="text-slate-400 group-hover:text-slate-200 transition-colors">Search thousands of case laws with natural language queries.</p>
                        </motion.div>
                    </Link>

                    <Link to="/ai-drafting">
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-slate-800/50 backdrop-blur-md border border-white/5 p-8 rounded-2xl hover:bg-slate-800/80 transition-all shadow-xl group h-full"
                        >
                            <div className="bg-indigo-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
                                <FileText className="h-7 w-7 text-indigo-400 group-hover:text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">AI Drafting</h3>
                            <p className="text-slate-400 group-hover:text-slate-200 transition-colors">Generate contracts and legal documents in seconds.</p>
                        </motion.div>
                    </Link>

                    <Link to="/advocates">
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-slate-800/50 backdrop-blur-md border border-white/5 p-8 rounded-2xl hover:bg-slate-800/80 transition-all shadow-xl group h-full"
                        >
                            <div className="bg-pink-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-pink-500 transition-colors duration-300">
                                <Users className="h-7 w-7 text-pink-400 group-hover:text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Find Advocates</h3>
                            <p className="text-slate-400 group-hover:text-slate-200 transition-colors">Connect with top-rated legal experts for advice.</p>
                        </motion.div>
                    </Link>
                </div>
            </div>

            {/* Latest Legal News - Masonry Grid */}
            <div id="news-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Latest Legal News
                    </h2>

                    {/* Admin Actions */}
                    <div className="flex items-center space-x-4">
                        {isAdmin && (
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="flex items-center px-4 py-2 bg-accent/20 text-accent border border-accent/50 rounded-full hover:bg-accent hover:text-white transition-all text-sm font-bold"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add News
                            </button>
                        )}
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="mb-10 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search news..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-white/5 text-white rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent placeholder-slate-500"
                        />
                    </div>
                    <div className="flex space-x-2 overflow-x-auto pb-2 w-full md:w-auto custom-scrollbar">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === 'all' ? 'bg-white text-black' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-white/5'
                                }`}
                        >
                            All
                        </button>
                        {newsCategories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === cat.id ? 'bg-white text-black' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-white/5'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-80 bg-slate-800 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : filteredNews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[250px] grid-flow-dense">
                        {filteredNews.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className={`group relative overflow-hidden rounded-2xl cursor-pointer border border-white/5 hover:border-accent/50 transition-colors ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                                    }`}
                                onClick={() => setSelectedNews(item)}
                            >
                                <img
                                    src={item.image_url}
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent p-6 flex flex-col justify-end">
                                    <span className="inline-block px-3 py-1 bg-accent/90 backdrop-blur-sm text-white text-xs font-bold uppercase rounded-full mb-3 w-fit shadow-lg">
                                        {item.category}
                                    </span>
                                    <h3 className={`font-bold text-white mb-2 leading-tight ${index === 0 ? 'text-2xl md:text-3xl' : 'text-lg'
                                        }`}>
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center text-slate-300 text-xs md:text-sm">
                                        <Clock className="h-3 w-3 mr-1" />
                                        <span>{new Date(item.date).toLocaleDateString()}</span>
                                    </div>

                                    {isAdmin && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteNews(item.id); }}
                                            className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-dashed border-white/10">
                        <Search className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-300">No news found</h3>
                        <p className="text-slate-500">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </div>

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
        </div>
    );
};

export default Home;
