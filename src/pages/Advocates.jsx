import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Star, MapPin, Phone, Mail, Plus, Trash2, Search } from 'lucide-react';
import { AdvocateService } from '../services/advocate-service';
import { useAdmin } from '../hooks/useAdmin';
import AddAdvocateModal from '../components/AddAdvocateModal';

const Advocates = () => {
    const [advocates, setAdvocates] = useState([]);
    const [filteredAdvocates, setFilteredAdvocates] = useState([]);
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
        // The useEffect handles the filtering based on searchQuery state.
        // If we wanted server-side search, we would call AdvocateService.search(searchQuery) here.
        // But since we have filters, hybrid approach or client-side is smoother for small datasets.
        // Let's stick to client-side filtering of the loaded 'advocates' for now as it's faster and supports the dropdowns easily.
        // If the user explicitly hits search, we can also trigger a server fetch if needed, but client-side is fine.
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center relative"
            >
                <h1 className="text-4xl font-bold text-primary mb-4">Top Advocates</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Connect with India's leading legal experts. Listen to their insights and book consultations directly.
                </p>



                {/* Search Section */}
                <div className="mt-10 bg-white p-4 rounded-lg shadow-md border border-gray-100 max-w-4xl mx-auto">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-grow relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or specialization (work)..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-sm"
                        >
                            Search
                        </button>
                    </form>

                    {/* Filters */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Specialization</label>
                            <select
                                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                value={specializationFilter}
                                onChange={(e) => setSpecializationFilter(e.target.value)}
                            >
                                <option value="">All Specializations</option>
                                {uniqueSpecializations.map(spec => (
                                    <option key={spec} value={spec}>{spec}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Location</label>
                            <select
                                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                            >
                                <option value="">All Locations</option>
                                {uniqueLocations.map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Admin Add Button */}
                {isAdmin && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="absolute top-0 right-0 flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors shadow-lg"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Advocate
                    </button>
                )}
            </motion.div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredAdvocates.map((advocate, index) => (
                        <motion.div
                            key={advocate.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow border border-gray-100 relative group"
                        >
                            {/* Admin Delete Button */}
                            {isAdmin && (
                                <button
                                    onClick={() => handleDeleteAdvocate(advocate.id)}
                                    className="absolute top-2 left-2 z-10 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                    title="Delete Advocate"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}

                            <div className="relative h-64">
                                <img
                                    src={advocate.image_url}
                                    alt={advocate.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-primary mb-1">{advocate.name}</h3>
                                <p className="text-accent font-medium mb-3">{advocate.specialization}</p>

                                <div className="flex items-center text-gray-500 text-sm mb-4">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {advocate.location}
                                </div>

                                {(advocate.podcast_title || advocate.podcast_duration) && (
                                    advocate.podcast_url ? (
                                        <a
                                            href={advocate.podcast_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block bg-gray-50 p-3 rounded-lg mb-4 border border-gray-200 hover:border-accent hover:bg-purple-50 transition-colors group/podcast"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-bold text-gray-500 uppercase group-hover/podcast:text-accent">Featured Podcast</span>
                                                <Mic className="h-4 w-4 text-accent" />
                                            </div>
                                            <p className="text-sm font-medium text-gray-800 line-clamp-1 group-hover/podcast:text-primary">{advocate.podcast_title}</p>
                                            <p className="text-xs text-gray-500">{advocate.podcast_duration}</p>
                                        </a>
                                    ) : (
                                        <div className="bg-gray-50 p-3 rounded-lg mb-4 border border-gray-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-bold text-gray-500 uppercase">Featured Podcast</span>
                                                <Mic className="h-4 w-4 text-accent" />
                                            </div>
                                            <p className="text-sm font-medium text-gray-800 line-clamp-1">{advocate.podcast_title}</p>
                                            <p className="text-xs text-gray-500">{advocate.podcast_duration}</p>
                                        </div>
                                    )
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    <button className="flex items-center justify-center px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-sm font-medium">
                                        <Mail className="h-4 w-4 mr-2" />
                                        Message
                                    </button>
                                    <button className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors text-sm font-medium">
                                        <Phone className="h-4 w-4 mr-2" />
                                        Book
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <AddAdvocateModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddAdvocate}
            />
        </div>
    );
};

export default Advocates;
