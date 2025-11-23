import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, Trash2, Calendar, Scale, FileText, Loader } from 'lucide-react';
import { JudgementService } from '../services/judgement-service';
import { courts, categories } from '../data/judgements-data';
import { useAdmin } from '../hooks/useAdmin';
import AddJudgementModal from '../components/AddJudgementModal';
import JudgementDetailModal from '../components/JudgementDetailModal';

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
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 relative">
                    <div className="flex items-center justify-center mb-4">
                        <Scale className="h-10 w-10 text-accent mr-3" />
                        <h1 className="text-4xl font-bold text-primary">Legal Judgements Database</h1>
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Search and browse comprehensive database of court judgements from Indian courts
                    </p>

                    {/* Admin Add Button */}
                    {isAdmin && (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="absolute top-0 right-0 flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors shadow-lg"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add Judgement
                        </button>
                    )}
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by case number, title, or keywords..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleSearch}
                            className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors font-medium"
                        >
                            Search
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Court</label>
                            <select
                                value={selectedCourt}
                                onChange={(e) => setSelectedCourt(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                            >
                                <option value="">All Courts</option>
                                {courts.map(court => (
                                    <option key={court} value={court}>{court}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader className="animate-spin h-12 w-12 text-accent" />
                    </div>
                ) : filteredJudgements.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredJudgements.map((judgement) => (
                            <motion.div
                                key={judgement.id}
                                whileHover={{ scale: 1.01 }}
                                className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 cursor-pointer hover:border-accent transition-all relative group"
                                onClick={() => setSelectedJudgement(judgement)}
                            >
                                {/* Admin Delete Button */}
                                {isAdmin && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteJudgement(judgement.id);
                                        }}
                                        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        title="Delete Judgement"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}

                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-primary mb-2">{judgement.case_title}</h3>
                                        <p className="text-sm text-gray-600 mb-2">{judgement.case_number}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Scale className="h-4 w-4 mr-2 text-accent" />
                                        {judgement.court}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="h-4 w-4 mr-2 text-accent" />
                                        {formatDate(judgement.date_of_judgement)}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FileText className="h-4 w-4 mr-2 text-accent" />
                                        {categories.find(c => c.id === judgement.category)?.name || judgement.category}
                                    </div>
                                    {judgement.pdf_url && (
                                        <div className="flex items-center text-sm text-accent font-medium">
                                            <FileText className="h-4 w-4 mr-2" />
                                            PDF Available
                                        </div>
                                    )}
                                </div>

                                {judgement.summary && (
                                    <p className="text-gray-700 line-clamp-2">{judgement.summary}</p>
                                )}

                                {judgement.keywords && judgement.keywords.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {judgement.keywords.slice(0, 5).map((keyword, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium"
                                            >
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No judgements found matching your criteria.</p>
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
