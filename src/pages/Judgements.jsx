import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, Trash2, Calendar, Scale, Loader, ArrowRight, X } from 'lucide-react';
import { JudgementService } from '../services/judgement-service';
import { courts, categories } from '../data/judgements-data';
import { useAdmin } from '../hooks/useAdmin';
import AddJudgementModal from '../components/AddJudgementModal';
import JudgementDetailModal from '../components/JudgementDetailModal';
import { Helmet } from 'react-helmet-async';
import webLogo from '../assets/web-logo.png';

const Judgements = () => {
    const [judgements, setJudgements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCourt, setSelectedCourt] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedJudgement, setSelectedJudgement] = useState(null);
    const { isAdmin } = useAdmin();

    useEffect(() => {
        loadJudgements();
    }, []);

    const loadJudgements = async () => {
        try {
            const data = await JudgementService.getAll();
            setJudgements(data);
        } catch (error) {
            console.error('Error loading judgements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddJudgement = (newJudgement) => {
        setJudgements([newJudgement, ...judgements]);
    };

    const handleDeleteJudgement = async (id) => {
        if (window.confirm('Are you sure you want to delete this judgement?')) {
            try {
                await JudgementService.delete(id);
                setJudgements(judgements.filter(j => j.id !== id));
            } catch (error) {
                console.error('Error deleting judgement:', error);
                alert('Failed to delete judgement.');
            }
        }
    };

    const handleSearch = async () => {
        if (searchQuery.trim()) {
            try {
                setLoading(true);
                const results = await JudgementService.search(searchQuery);
                setJudgements(results);
            } catch (error) {
                console.error('Error searching:', error);
            } finally {
                setLoading(false);
            }
        } else {
            loadJudgements();
        }
    };

    // Filter judgements
    const getFilteredJudgements = () => {
        let filtered = judgements;

        if (selectedCourt) {
            filtered = filtered.filter(j => j.court === selectedCourt);
        }

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(j => j.category === selectedCategory);
        }

        return filtered;
    };

    const filteredJudgements = getFilteredJudgements();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">
            <Helmet>
                <title>Judgements Database - IGNIS JURIS</title>
                <meta name="description" content="Search and browse thousands of legal judgements." />
            </Helmet>

            {/* Hero Header with Search */}
            {/* Hero Header with Search */}
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white py-16 relative overflow-hidden">
                <img src={webLogo} alt="Background Logo" className="absolute inset-0 w-full h-full object-contain opacity-5 pointer-events-none transform scale-90" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Scale className="h-16 w-16 text-accent mx-auto mb-6" />
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            Legal Judgements Database
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-light">
                            Access a comprehensive repository of case laws, legal precedents, and court orders.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto relative group">
                            <div className="relative flex items-center bg-slate-800 border border-white/10 rounded-xl shadow-2xl p-2">
                                <Search className="h-6 w-6 text-slate-400 ml-3" />
                                <input
                                    type="text"
                                    placeholder="Search by case title, number, or keywords..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className="w-full px-4 py-3 bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 text-lg focus:outline-none"
                                />
                                <button
                                    onClick={handleSearch}
                                    className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors font-medium shadow-md"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-20">

                {/* Filters & Actions Bar */}
                <div className="bg-slate-800 rounded-xl shadow-xl p-6 mb-8 border border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:flex-1 md:min-w-0 items-center">
                        {/* Court Filter */}
                        <div className="relative w-full sm:w-auto min-w-[200px] shrink-0">
                            <select
                                value={selectedCourt}
                                onChange={(e) => setSelectedCourt(e.target.value)}
                                className="w-full appearance-none pl-4 pr-10 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-slate-300 cursor-pointer hover:bg-black/30 transition-colors"
                            >
                                <option value="">All Courts</option>
                                {courts.map(court => (
                                    <option key={court} value={court}>{court}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                                <Filter className="h-4 w-4" />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0 custom-scrollbar w-full sm:w-auto sm:flex-1 sm:min-w-0 md:max-w-none">
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0 ${selectedCategory === 'all'
                                    ? 'bg-accent text-white shadow-md'
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                    }`}
                            >
                                All
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0 ${selectedCategory === cat.id
                                        ? 'bg-accent text-white shadow-md'
                                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Admin Action */}
                    {isAdmin && (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md font-medium whitespace-nowrap shrink-0 w-full sm:w-auto justify-center"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add Judgement
                        </button>
                    )}
                </div>

                {/* Results Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader className="animate-spin h-12 w-12 text-accent" />
                    </div>
                ) : filteredJudgements.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredJudgements.map((judgement, index) => (
                            <motion.div
                                key={judgement.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className="bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl border border-white/5 overflow-hidden cursor-pointer group hover:border-accent/30"
                                onClick={() => setSelectedJudgement(judgement)}
                            >
                                <div className="p-6 md:p-8 relative">
                                    {isAdmin && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteJudgement(judgement.id);
                                            }}
                                            className="absolute top-6 right-6 p-2 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                                            title="Delete Judgement"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    )}

                                    <div className="flex items-center space-x-3 mb-4">
                                        <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold uppercase rounded-full tracking-wider border border-accent/20">
                                            {categories.find(c => c.id === judgement.category)?.name || judgement.category}
                                        </span>
                                        <span className="text-slate-600 text-sm">•</span>
                                        <span className="text-slate-400 text-sm font-medium">{judgement.case_number}</span>
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                                        {judgement.case_title}
                                    </h3>

                                    <p className="text-slate-400 mb-6 line-clamp-2 leading-relaxed">
                                        {judgement.summary || "No summary available for this judgement."}
                                    </p>

                                    <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/5">
                                        <div className="flex flex-wrap gap-6 text-sm text-slate-500">
                                            <div className="flex items-center">
                                                <Scale className="h-4 w-4 mr-2 text-accent" />
                                                {judgement.court}
                                            </div>
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-2 text-primary" />
                                                {formatDate(judgement.date_of_judgement)}
                                            </div>
                                        </div>

                                        <div className="flex items-center text-accent font-bold group-hover:translate-x-1 transition-transform">
                                            Read Judgement
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-800 rounded-xl border border-dashed border-white/10">
                        <div className="bg-white/5 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="h-10 w-10 text-slate-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-300 mb-2">No judgements found</h3>
                        <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                    </div>
                )}
            </div>

            <AddJudgementModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddJudgement}
            />

            <JudgementDetailModal
                judgement={selectedJudgement}
                isOpen={!!selectedJudgement}
                onClose={() => setSelectedJudgement(null)}
            />
        </div>
    );
};

export default Judgements;
