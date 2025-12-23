import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Star, MapPin, Phone, Mail, Plus, Trash2, Search, X, Globe, Linkedin, ArrowLeft } from 'lucide-react';
import { AdvocateService } from '../services/advocate-service';
import { useAdmin } from '../hooks/useAdmin';
import AddAdvocateModal from '../components/AddAdvocateModal';
import { Helmet } from 'react-helmet-async';

import webLogo from '../assets/web-logo.png';

const Advocates = () => {
    const [advocates, setAdvocates] = useState([]);
    const [filteredAdvocates, setFilteredAdvocates] = useState([]);
    const [selectedAdvocate, setSelectedAdvocate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [specializationFilter, setSpecializationFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const { isAdmin } = useAdmin();

    useEffect(() => {
        loadAdvocates();
    }, []);

    // Derived state for unique filters
    const uniqueSpecializations = [...new Set(advocates.map(a => a.specialization).filter(Boolean))];
    const uniqueLocations = [...new Set(advocates.map(a => a.location).filter(Boolean))];

    useEffect(() => {
        // Client-side filtering for dropdowns + search result
        let result = advocates;

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(adv =>
                adv.name?.toLowerCase().includes(q) ||
                adv.specialization?.toLowerCase().includes(q) ||
                adv.location?.toLowerCase().includes(q)
            );
        }

        if (specializationFilter) {
            result = result.filter(adv => adv.specialization === specializationFilter);
        }

        if (locationFilter) {
            result = result.filter(adv => adv.location === locationFilter);
        }

        setFilteredAdvocates(result);
    }, [advocates, searchQuery, specializationFilter, locationFilter]);

    const handleSearch = async (e) => {
        e.preventDefault();
    };

    const loadAdvocates = async () => {
        try {
            const data = await AdvocateService.getAll();
            setAdvocates(data);
        } catch (error) {
            console.error('Error loading advocates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAdvocate = (newAdvocate) => {
        setAdvocates([newAdvocate, ...advocates]);
    };

    const handleDeleteAdvocate = async (id) => {
        if (window.confirm('Are you sure you want to delete this advocate?')) {
            try {
                await AdvocateService.delete(id);
                setAdvocates(advocates.filter(adv => adv.id !== id));
            } catch (error) {
                console.error('Error deleting advocate:', error);
                alert('Failed to delete advocate.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">
            <Helmet>
                <title>Find Advocates - Legal Remedies</title>
                <meta name="description" content="Connect with top legal experts and advocates for your case." />
            </Helmet>

            {/* Hero Header */}
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white py-16 relative overflow-hidden">
                <img src={webLogo} alt="Background Logo" className="absolute inset-0 w-full h-full object-contain opacity-5 pointer-events-none transform scale-90" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400"
                    >
                        Find Your Legal Expert
                    </motion.h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Connect with top-rated advocates across India for consultation and representation.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-slate-800 rounded-xl shadow-lg border border-white/5 p-6 sticky top-24">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-white">Filters</h2>
                            {(specializationFilter || locationFilter || searchQuery) && (
                                <button
                                    onClick={() => {
                                        setSpecializationFilter('');
                                        setLocationFilter('');
                                        setSearchQuery('');
                                    }}
                                    className="text-xs text-accent hover:text-accent-hover font-medium"
                                >
                                    Reset
                                </button>
                            )}
                        </div>

                        {/* Search */}
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search advocates..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:ring-2 focus:ring-accent focus:border-transparent placeholder-slate-500"
                            />
                        </div>

                        {/* Specialization Filter */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Practice Area</h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                <label className="flex items-center cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="specialization"
                                        checked={specializationFilter === ''}
                                        onChange={() => setSpecializationFilter('')}
                                        className="h-4 w-4 text-accent border-slate-600 focus:ring-accent bg-transparent"
                                    />
                                    <span className="ml-2 text-sm text-slate-300 group-hover:text-white transition-colors">All Areas</span>
                                </label>
                                {uniqueSpecializations.map(spec => (
                                    <label key={spec} className="flex items-center cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="specialization"
                                            checked={specializationFilter === spec}
                                            onChange={() => setSpecializationFilter(spec)}
                                            className="h-4 w-4 text-accent border-slate-600 focus:ring-accent bg-transparent"
                                        />
                                        <span className="ml-2 text-sm text-slate-300 group-hover:text-white transition-colors">{spec}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Location Filter */}
                        <div>
                            <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Location</h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                <label className="flex items-center cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="location"
                                        checked={locationFilter === ''}
                                        onChange={() => setLocationFilter('')}
                                        className="h-4 w-4 text-accent border-slate-600 focus:ring-accent bg-transparent"
                                    />
                                    <span className="ml-2 text-sm text-slate-300 group-hover:text-white transition-colors">All Locations</span>
                                </label>
                                {uniqueLocations.map(loc => (
                                    <label key={loc} className="flex items-center cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="location"
                                            checked={locationFilter === loc}
                                            onChange={() => setLocationFilter(loc)}
                                            className="h-4 w-4 text-accent border-slate-600 focus:ring-accent bg-transparent"
                                        />
                                        <span className="ml-2 text-sm text-slate-300 group-hover:text-white transition-colors">{loc}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Advocates Grid */}
                <div className="flex-1">
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-slate-400 text-sm">
                            Showing <span className="font-bold text-white">{filteredAdvocates.length}</span> advocates
                        </p>
                        {isAdmin && (
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="flex items-center px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-hover transition-all shadow-md hover:shadow-lg"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add New Advocate
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                        </div>
                    ) : filteredAdvocates.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredAdvocates.map((advocate, index) => (
                                <motion.div
                                    key={advocate.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-white/5 group flex flex-col h-full hover:border-accent/30"
                                >
                                    <div className="relative h-48 overflow-hidden bg-slate-900">
                                        <img
                                            src={advocate.image_url}
                                            alt={advocate.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent flex items-end p-4">
                                            <div>
                                                <span className="inline-block px-2 py-1 bg-accent/90 backdrop-blur-sm text-white text-xs font-bold uppercase rounded-md mb-2 shadow-sm">
                                                    {advocate.specialization}
                                                </span>
                                                <h3 className="text-lg font-bold text-white leading-tight">{advocate.name}</h3>
                                            </div>
                                        </div>

                                        {/* Admin Delete */}
                                        {isAdmin && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteAdvocate(advocate.id);
                                                }}
                                                className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex items-center text-slate-400 text-sm mb-4">
                                            <MapPin className="h-4 w-4 mr-1 text-accent" />
                                            {advocate.location}
                                        </div>

                                        {(advocate.podcast_title) && (
                                            <div className="mb-4 p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                                                <div className="flex items-center mb-1">
                                                    <Mic className="h-3 w-3 text-indigo-400 mr-2" />
                                                    <span className="text-xs font-bold text-indigo-300 uppercase">Podcast</span>
                                                </div>
                                                <p className="text-sm font-medium text-indigo-100 line-clamp-1">{advocate.podcast_title}</p>
                                            </div>
                                        )}

                                        <div className="mt-auto">
                                            <button
                                                onClick={() => setSelectedAdvocate(advocate)}
                                                className="w-full px-4 py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors shadow-sm flex items-center justify-center"
                                            >
                                                Book Consultation
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-800 rounded-xl border border-dashed border-white/10">
                            <div className="bg-white/5 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="h-8 w-8 text-slate-500" />
                            </div>
                            <h3 className="text-lg font-medium text-white">No advocates found</h3>
                            <p className="text-slate-400 max-w-sm mx-auto mt-2">
                                We couldn't find any advocates matching your current filters. Try adjusting your search criteria.
                            </p>
                            <button
                                onClick={() => {
                                    setSpecializationFilter('');
                                    setLocationFilter('');
                                    setSearchQuery('');
                                }}
                                className="mt-4 text-accent hover:text-accent-hover font-medium"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Premium Profile Modal */}
            <AnimatePresence>
                {selectedAdvocate && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative border border-white/10"
                        >
                            <button
                                onClick={() => setSelectedAdvocate(null)}
                                className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full z-10 transition-colors backdrop-blur-sm"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <div className="relative h-64">
                                <div className="absolute inset-0 bg-primary/20"></div>
                                <img
                                    src={selectedAdvocate.image_url}
                                    alt={selectedAdvocate.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-black/40 to-transparent flex flex-col justify-end p-8">
                                    <h2 className="text-3xl font-bold text-white mb-2">{selectedAdvocate.name}</h2>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-accent/90 text-white text-xs font-bold rounded-lg shadow-sm">
                                            {selectedAdvocate.specialization}
                                        </span>
                                        <span className="px-3 py-1 bg-black/40 backdrop-blur-md text-white border border-white/20 text-xs font-bold rounded-lg flex items-center">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            {selectedAdvocate.location}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {selectedAdvocate.phone_number && (
                                        <a href={`tel:${selectedAdvocate.phone_number}`} className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl hover:bg-white/10 hover:scale-105 transition-all cursor-pointer border border-white/5 group">
                                            <Phone className="h-6 w-6 text-accent mb-2 group-hover:text-white transition-colors" />
                                            <span className="text-sm font-bold text-slate-300 group-hover:text-white">Call Now</span>
                                        </a>
                                    )}
                                    {selectedAdvocate.email && (
                                        <a href={`mailto:${selectedAdvocate.email}`} className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl hover:bg-white/10 hover:scale-105 transition-all cursor-pointer border border-white/5 group">
                                            <Mail className="h-6 w-6 text-accent mb-2 group-hover:text-white transition-colors" />
                                            <span className="text-sm font-bold text-slate-300 group-hover:text-white">Email</span>
                                        </a>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Connect Online</h3>

                                    {selectedAdvocate.website_url && (
                                        <a href={selectedAdvocate.website_url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-lg border border-white/10 hover:border-accent group transition-colors bg-white/5 hover:bg-white/10">
                                            <div className="flex items-center">
                                                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                                                    <Globe className="h-5 w-5 text-slate-400 group-hover:text-accent" />
                                                </div>
                                                <span className="ml-3 font-medium text-slate-300 group-hover:text-white">Visit Website</span>
                                            </div>
                                            <ArrowLeft className="h-4 w-4 text-slate-500 rotate-180 group-hover:text-white" />
                                        </a>
                                    )}
                                    {selectedAdvocate.linkedin_url && (
                                        <a href={selectedAdvocate.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-lg border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 group transition-colors bg-white/5">
                                            <div className="flex items-center">
                                                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                                                    <Linkedin className="h-5 w-5 text-slate-400 group-hover:text-blue-400" />
                                                </div>
                                                <span className="ml-3 font-medium text-slate-300 group-hover:text-white">LinkedIn Profile</span>
                                            </div>
                                            <ArrowLeft className="h-4 w-4 text-slate-500 rotate-180 group-hover:text-white" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AddAdvocateModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddAdvocate}
            />
        </div>
    );
};

export default Advocates;
