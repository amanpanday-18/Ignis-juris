import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, IndianRupee, Calendar, ExternalLink, Plus, Trash2, Loader } from 'lucide-react';
import { InternshipService, internshipTypes } from '../services/internship-service';
import { useAdmin } from '../hooks/useAdmin';
import AddInternshipModal from '../components/AddInternshipModal';
import { Helmet } from 'react-helmet-async';

const Internships = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { isAdmin } = useAdmin();

    useEffect(() => {
        loadInternships();
    }, [selectedType]);

    const loadInternships = async () => {
        setLoading(true);
        try {
            const filters = { type: selectedType };
            const data = await InternshipService.getAll(filters);
            setInternships(data);
        } catch (error) {
            console.error('Error loading internships:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddInternship = (newInternship) => {
        setInternships([newInternship, ...internships]);
    };

    const handleDeleteInternship = async (id) => {
        if (window.confirm('Are you sure you want to delete this listing?')) {
            try {
                await InternshipService.delete(id);
                setInternships(internships.filter(i => i.id !== id));
            } catch (error) {
                console.error('Error deleting internship:', error);
                alert('Failed to delete internship.');
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'ASAP';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-slate-900 py-12 text-slate-100">
            <Helmet>
                <title>Internships - Legal Remedies</title>
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 relative">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-green-500/20 p-3 rounded-full mr-3">
                            <Briefcase className="h-8 w-8 text-green-400" />
                        </div>
                        <h1 className="text-4xl font-bold text-white">Internship Opportunities</h1>
                    </div>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Find the perfect legal internship to kickstart your career. Top firms, NGOs, and advocates.
                    </p>

                    {/* Admin Add Button */}
                    {isAdmin && (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="absolute top-0 right-0 flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors shadow-lg"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Post Internship
                        </button>
                    )}
                </div>

                {/* Filter */}
                <div className="flex justify-center mb-8">
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="px-4 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-white shadow-sm"
                    >
                        {internshipTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                    </select>
                </div>

                {/* Internships List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader className="animate-spin h-12 w-12 text-accent" />
                    </div>
                ) : internships.length > 0 ? (
                    <div className="space-y-4">
                        {internships.map((internship, index) => (
                            <motion.div
                                key={internship.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-slate-800 rounded-xl shadow-md border border-white/5 p-6 hover:shadow-lg transition-shadow relative group hover:border-accent/30"
                            >
                                {/* Admin Delete Button */}
                                {isAdmin && (
                                    <button
                                        onClick={() => handleDeleteInternship(internship.id)}
                                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Delete Listing"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                )}

                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center mb-2">
                                            <h3 className="text-xl font-bold text-white mr-3">{internship.title}</h3>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${internship.type === 'remote' ? 'bg-purple-500/20 text-purple-400' :
                                                internship.type === 'in-office' ? 'bg-blue-500/20 text-blue-400' :
                                                    'bg-orange-500/20 text-orange-400'
                                                }`}>
                                                {internship.type}
                                            </span>
                                        </div>
                                        <p className="text-lg text-slate-300 font-medium mb-2">{internship.organization}</p>

                                        <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
                                            <div className="flex items-center">
                                                <MapPin className="h-4 w-4 mr-1 text-slate-400" />
                                                {internship.location}
                                            </div>
                                            <div className="flex items-center">
                                                <IndianRupee className="h-4 w-4 mr-1 text-slate-400" />
                                                {internship.stipend || 'Unpaid'}
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 mr-1 text-slate-400" />
                                                {internship.duration}
                                            </div>
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-1 text-red-400" />
                                                Deadline: <span className="text-red-400 ml-1 font-medium">{formatDate(internship.deadline)}</span>
                                            </div>
                                        </div>

                                        <p className="text-slate-400 text-sm line-clamp-2 mb-4 md:mb-0">
                                            {internship.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center">
                                        <a
                                            href={internship.apply_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center w-full md:w-auto px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
                                        >
                                            Apply Now
                                            <ExternalLink className="h-4 w-4 ml-2" />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-800 rounded-xl border border-dashed border-white/10">
                        <Briefcase className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                        <p className="text-slate-400 text-lg">No internships found matching your criteria.</p>
                        {isAdmin && (
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="mt-4 text-accent hover:underline font-medium"
                            >
                                Post the first internship
                            </button>
                        )}
                    </div>
                )}
            </div>

            <AddInternshipModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddInternship}
            />
        </div>
    );
};

export default Internships;
