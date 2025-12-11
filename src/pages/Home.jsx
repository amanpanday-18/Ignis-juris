import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Scale, FileText, Users, BookOpen, Search, X, Calendar, User, Plus } from 'lucide-react';
import NewsCard from '../components/NewsCard';
import { newsCategories } from '../data/news-data';
import { NewsService } from '../services/news-service';
import { useAdmin } from '../hooks/useAdmin';
import AddNewsModal from '../components/AddNewsModal';

import { Helmet } from 'react-helmet-async';

const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { isAdmin } = useAdmin();

    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async () => {
        try {
            const data = await NewsService.getAll();
            setArticles(data);
        } catch (error) {
            console.error('Error loading news:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNews = (newArticle) => {
        setArticles([newArticle, ...articles]);
    };

    const handleDeleteNews = async (id) => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            try {
                await NewsService.delete(id);
                setArticles(articles.filter(art => art.id !== id));
            } catch (error) {
                console.error('Error deleting news:', error);
                alert('Failed to delete article.');
            }
        }
    };

    const features = [
        { icon: Scale, title: 'Legal Judgements', description: 'Access comprehensive database of court judgements', link: '/judgements' },
        { icon: FileText, title: 'AI Drafting', description: 'Generate legal documents with AI assistance', link: '/ai-drafting' },
        { icon: Users, title: 'Find Advocates', description: 'Connect with experienced legal professionals', link: '/advocates' },
        { icon: BookOpen, title: 'Legal Resources', description: 'Educational materials and legal guides', link: '/store' },
    ];

    // Filter articles based on category and search
    const getFilteredArticles = () => {
        let filtered = articles;

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(article => article.category === selectedCategory);
        }

        if (searchQuery.trim()) {
            filtered = filtered.filter(article =>
                article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    };

    const filteredArticles = getFilteredArticles();

    return (
        <div className="min-h-screen">
            <Helmet>
                <title>Legal Remedies - Home</title>
                <meta name="description" content="Your comprehensive legal platform for news, resources, and AI-powered document drafting." />
            </Helmet>
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary via-primary-light to-primary text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-bold mb-6"
                    >
                        Justice, <span className="text-accent">Simplified</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto"
                    >
                        Your comprehensive legal platform for news, resources, and AI-powered document drafting
                    </motion.p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <Link key={index} to={feature.link}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center cursor-pointer hover:border-accent transition-all"
                                >
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
                                        <feature.icon className="h-8 w-8 text-accent" />
                                    </div>
                                    <h3 className="text-lg font-bold text-primary mb-2">{feature.title}</h3>
                                    <p className="text-gray-600 text-sm">{feature.description}</p>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Legal News Section */}
            <section id="news-section" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 relative">
                        <h2 className="text-4xl font-bold text-primary mb-4">Latest Legal News</h2>
                        <p className="text-lg text-gray-600">Stay updated with the latest developments in Indian legal landscape</p>

                        {/* Admin Add Button */}
                        {isAdmin && (
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="absolute top-0 right-0 flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors shadow-lg"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Add News
                            </button>
                        )}
                    </div>

                    {/* Search Bar */}
                    <div className="mb-8 max-w-2xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search legal news..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                            />
                        </div>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {newsCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === category.id
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {/* News Grid */}
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                        </div>
                    ) : filteredArticles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredArticles.map((article) => (
                                <NewsCard
                                    key={article.id}
                                    article={article}
                                    onClick={() => setSelectedArticle(article)}
                                    onDelete={handleDeleteNews}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Article Detail Modal */}
            <AnimatePresence>
                {selectedArticle && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
                        onClick={() => setSelectedArticle(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8 overflow-hidden"
                        >
                            {/* Header Image */}
                            <div className="relative h-64 md:h-96">
                                <img
                                    src={selectedArticle.image_url}
                                    alt={selectedArticle.title}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => setSelectedArticle(null)}
                                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                                >
                                    <X className="h-6 w-6 text-gray-700" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                <div className="mb-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${newsCategories.find(c => c.id === selectedArticle.category)?.color || 'bg-gray-100 text-gray-800'}`}>
                                        {newsCategories.find(c => c.id === selectedArticle.category)?.name || selectedArticle.category}
                                    </span>
                                </div>

                                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                                    {selectedArticle.title}
                                </h1>

                                <div className="flex items-center space-x-6 text-gray-600 mb-6 pb-6 border-b border-gray-200">
                                    <div className="flex items-center">
                                        <Calendar className="h-5 w-5 mr-2" />
                                        {new Date(selectedArticle.date).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </div>
                                    <div className="flex items-center">
                                        <User className="h-5 w-5 mr-2" />
                                        {selectedArticle.author}
                                    </div>
                                </div>

                                <div className="prose prose-lg max-w-none">
                                    {selectedArticle.content.split('\n\n').map((paragraph, index) => (
                                        <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
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
