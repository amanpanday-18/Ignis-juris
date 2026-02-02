import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Trash2, FileText, Download, ExternalLink, Loader, Scale } from 'lucide-react';
import { BareActService, actCategories } from '../services/bare-act-service';
import { ActivityService } from '../services/activity-service';
import { useAdmin } from '../hooks/useAdmin';
import AddBareActModal from '../components/AddBareActModal';
import { Helmet } from 'react-helmet-async';

const BareActs = () => {
    const [acts, setActs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { isAdmin } = useAdmin();

    useEffect(() => {
        loadActs();
    }, [selectedCategory]);

    const loadActs = async () => {
        setLoading(true);
        try {
            const filters = {
                category: selectedCategory,
                search: searchTerm
            };
            const data = await BareActService.getAll(filters);
            setActs(data);
        } catch (error) {
            console.error('Error loading acts:', error);
        } finally {
            setLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            loadActs();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleAddAct = (newAct) => {
        setActs([newAct, ...acts]);
    };

    const handleDeleteAct = async (id) => {
        if (window.confirm('Are you sure you want to delete this act?')) {
            try {
                await BareActService.delete(id);
                setActs(acts.filter(a => a.id !== id));
            } catch (error) {
                console.error('Error deleting act:', error);
                alert('Failed to delete act.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 py-12 text-slate-100">
            <Helmet>
                <title>Bare Acts - IGNIS JURIS</title>
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 relative">
                    <div className="flex items-center justify-center mb-4">
                        <Scale className="h-10 w-10 text-accent mr-3" />
                        <h1 className="text-4xl font-bold text-white">Bare Acts Database</h1>
                    </div>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Comprehensive library of Indian Laws, Acts, and Rules. Search and download legal texts.
                    </p>

                    {/* Admin Add Button */}
                    {isAdmin && (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="absolute top-0 right-0 flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors shadow-lg"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add Act
                        </button>
                    )}
                </div>

                {/* Search and Filter */}
                <div className="bg-slate-800 rounded-xl shadow-lg p-6 mb-8 border border-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search by title or act number..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-white placeholder-slate-500"
                            />
                        </div>
                        <div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-white"
                            >
                                {actCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Acts List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader className="animate-spin h-12 w-12 text-accent" />
                    </div>
                ) : acts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {acts.map((act, index) => (
                            <motion.div
                                key={act.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-slate-800 rounded-xl shadow-md border border-white/5 p-6 hover:shadow-lg transition-all relative group hover:border-accent/30"
                            >
                                {/* Admin Delete Button */}
                                {isAdmin && (
                                    <button
                                        onClick={() => handleDeleteAct(act.id)}
                                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Delete Act"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                )}

                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                    <div className="flex-1">
                                        <div className="flex items-center mb-2">
                                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider mr-3">
                                                {actCategories.find(c => c.id === act.category)?.name || act.category}
                                            </span>
                                            <span className="text-sm text-slate-500 font-mono">
                                                {act.year}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">{act.title}</h3>
                                        {act.act_number && (
                                            <p className="text-sm text-slate-400 font-medium mb-2">{act.act_number}</p>
                                        )}
                                        <p className="text-slate-400 mb-4 line-clamp-2">{act.description}</p>
                                    </div>

                                    <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
                                        {act.content_url ? (
                                            <button
                                                onClick={async () => {
                                                    // Log activity
                                                    await ActivityService.logActivity('Bare Act', act.title, 'Viewed/Downloaded', null, act.content_url);
                                                    // Open link
                                                    window.open(act.content_url, '_blank');
                                                }}
                                                className="flex items-center px-4 py-2 bg-white/5 text-slate-300 font-medium rounded-lg hover:bg-accent hover:text-white transition-colors"
                                            >
                                                <FileText className="h-4 w-4 mr-2" />
                                                View / Download
                                            </button>
                                        ) : (
                                            <span className="text-slate-500 text-sm italic">No document available</span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-800 rounded-xl border border-dashed border-white/10">
                        <p className="text-slate-500 text-lg">No acts found matching your search.</p>
                    </div>
                )}
            </div>

            <AddBareActModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddAct}
            />
        </div>
    );
};

export default BareActs;
