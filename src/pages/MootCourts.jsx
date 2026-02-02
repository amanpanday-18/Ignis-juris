import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, MapPin, ExternalLink, Plus, Trash2, Loader, Clock } from 'lucide-react';
import { MootCourtService } from '../services/moot-court-service';
import { useAdmin } from '../hooks/useAdmin';
import AddMootCourtModal from '../components/AddMootCourtModal';
import { Helmet } from 'react-helmet-async';

const MootCourts = () => {
    const [competitions, setCompetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('upcoming'); // 'upcoming' or 'past'
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { isAdmin } = useAdmin();

    useEffect(() => {
        loadCompetitions();
    }, [filter]);

    const loadCompetitions = async () => {
        setLoading(true);
        try {
            const data = await MootCourtService.getAll(filter);
            setCompetitions(data);
        } catch (error) {
            console.error('Error loading competitions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCompetition = (newMoot) => {
        // Only add to list if it matches current filter (simple check)
        const today = new Date().toISOString().split('T')[0];
        const isUpcoming = newMoot.event_date >= today;

        if ((filter === 'upcoming' && isUpcoming) || (filter === 'past' && !isUpcoming)) {
            setCompetitions([newMoot, ...competitions]);
        } else {
            // If added to the other list, maybe switch view or just alert
            if (window.confirm('Competition added! Switch view to see it?')) {
                setFilter(isUpcoming ? 'upcoming' : 'past');
            }
        }
    };

    const handleDeleteCompetition = async (id) => {
        if (window.confirm('Are you sure you want to delete this competition?')) {
            try {
                await MootCourtService.delete(id);
                setCompetitions(competitions.filter(c => c.id !== id));
            } catch (error) {
                console.error('Error deleting competition:', error);
                alert('Failed to delete competition.');
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'TBA';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-slate-900 py-12 text-slate-100">
            <Helmet>
                <title>Moot Courts - IGNIS JURIS</title>
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 relative">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-yellow-500/20 p-3 rounded-full mr-3">
                            <Trophy className="h-8 w-8 text-yellow-400" />
                        </div>
                        <h1 className="text-4xl font-bold text-white">Moot Courts & Competitions</h1>
                    </div>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Discover upcoming moot court competitions, debates, and legal hackathons across India.
                    </p>

                    {/* Admin Add Button */}
                    {isAdmin && (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="absolute top-0 right-0 flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors shadow-lg"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add Competition
                        </button>
                    )}
                </div>

                {/* Filter Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-slate-800 p-1 rounded-xl shadow-sm border border-white/10 inline-flex">
                        <button
                            onClick={() => setFilter('upcoming')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'upcoming'
                                ? 'bg-primary text-white shadow-md'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Upcoming Events
                        </button>
                        <button
                            onClick={() => setFilter('past')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'past'
                                ? 'bg-primary text-white shadow-md'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Past Events
                        </button>
                    </div>
                </div>

                {/* Competitions Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader className="animate-spin h-12 w-12 text-accent" />
                    </div>
                ) : competitions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {competitions.map((comp, index) => (
                            <motion.div
                                key={comp.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-slate-800 rounded-xl shadow-md border border-white/5 overflow-hidden hover:shadow-lg transition-all relative group flex flex-col hover:border-accent/30"
                            >
                                {/* Admin Delete Button */}
                                {isAdmin && (
                                    <button
                                        onClick={() => handleDeleteCompetition(comp.id)}
                                        className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                                        title="Delete Competition"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                )}

                                {/* Banner Image (if available) */}
                                {comp.image_url && (
                                    <div className="h-40 overflow-hidden">
                                        <img src={comp.image_url} alt={comp.title} className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <span className="text-xs font-bold text-accent uppercase tracking-wider">
                                            {comp.organizer}
                                        </span>
                                        <h3 className="text-xl font-bold text-white mt-1 mb-2 line-clamp-2">{comp.title}</h3>
                                    </div>

                                    <div className="space-y-2 mb-4 text-sm text-slate-400">
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                                            <span>Event: <span className="font-medium text-slate-300">{formatDate(comp.event_date)}</span></span>
                                        </div>
                                        {comp.registration_deadline && (
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 mr-2 text-red-400" />
                                                <span>Deadline: <span className="font-medium text-red-400">{formatDate(comp.registration_deadline)}</span></span>
                                            </div>
                                        )}
                                        <div className="flex items-center">
                                            <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                                            <span>{comp.location}</span>
                                        </div>
                                    </div>

                                    <p className="text-slate-400 text-sm mb-6 line-clamp-3 flex-1">
                                        {comp.description}
                                    </p>

                                    {comp.official_link ? (
                                        <a
                                            href={comp.official_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center w-full px-4 py-2 bg-white/5 text-slate-300 font-bold rounded-lg hover:bg-primary hover:text-white transition-colors text-sm mt-auto"
                                        >
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            Visit Official Website
                                        </a>
                                    ) : (
                                        <button disabled className="w-full px-4 py-2 bg-white/5 text-slate-600 font-bold rounded-lg text-sm mt-auto cursor-not-allowed">
                                            Details Not Available
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-800 rounded-xl border border-dashed border-white/10">
                        <Trophy className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                        <p className="text-slate-400 text-lg">No {filter} competitions found.</p>
                        {isAdmin && (
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="mt-4 text-accent hover:underline font-medium"
                            >
                                Add a new competition
                            </button>
                        )}
                    </div>
                )}
            </div>

            <AddMootCourtModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddCompetition}
            />
        </div>
    );
};

export default MootCourts;
