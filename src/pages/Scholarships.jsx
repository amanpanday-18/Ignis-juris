import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, IndianRupee, ExternalLink, Plus, Trash2, Loader, UserCheck } from 'lucide-react';
import { ScholarshipService } from '../services/scholarship-service';
import { useAdmin } from '../hooks/useAdmin';
import AddScholarshipModal from '../components/AddScholarshipModal';
import { Helmet } from 'react-helmet-async';

const Scholarships = () => {
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { isAdmin } = useAdmin();

    useEffect(() => {
        loadScholarships();
    }, []);

    const loadScholarships = async () => {
        setLoading(true);
        try {
            const data = await ScholarshipService.getAll();
            setScholarships(data);
        } catch (error) {
            console.error('Error loading scholarships:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddScholarship = (newScholarship) => {
        setScholarships([...scholarships, newScholarship].sort((a, b) => new Date(a.deadline) - new Date(b.deadline)));
    };

    const handleDeleteScholarship = async (id) => {
        if (window.confirm('Are you sure you want to delete this scholarship?')) {
            try {
                await ScholarshipService.delete(id);
                setScholarships(scholarships.filter(s => s.id !== id));
            } catch (error) {
                console.error('Error deleting scholarship:', error);
                alert('Failed to delete scholarship.');
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
                <title>Scholarships - IGNIS JURIS</title>
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 relative">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-red-500/20 p-3 rounded-full mr-3">
                            <GraduationCap className="h-8 w-8 text-red-500" />
                        </div>
                        <h1 className="text-4xl font-bold text-white">Scholarships & Grants</h1>
                    </div>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Financial aid opportunities, fellowships, and grants for law students and researchers.
                    </p>

                    {/* Admin Add Button */}
                    {isAdmin && (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="absolute top-0 right-0 flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors shadow-lg"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add Scholarship
                        </button>
                    )}
                </div>

                {/* Scholarships List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader className="animate-spin h-12 w-12 text-accent" />
                    </div>
                ) : scholarships.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {scholarships.map((scholarship, index) => (
                            <motion.div
                                key={scholarship.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-slate-800 rounded-xl shadow-md border border-white/5 p-6 hover:shadow-lg transition-all relative group flex flex-col hover:border-accent/30"
                            >
                                {/* Admin Delete Button */}
                                {isAdmin && (
                                    <button
                                        onClick={() => handleDeleteScholarship(scholarship.id)}
                                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Delete Scholarship"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                )}

                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <span className="text-xs font-bold text-accent uppercase tracking-wider">
                                            {scholarship.provider}
                                        </span>
                                        <h3 className="text-xl font-bold text-white mt-1">{scholarship.title}</h3>
                                    </div>
                                    <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg text-sm font-bold flex items-center">
                                        <IndianRupee className="h-4 w-4 mr-1" />
                                        {scholarship.amount}
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6 text-sm text-slate-400">
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2 text-red-500" />
                                        Deadline: <span className="text-red-500 ml-1 font-medium">{formatDate(scholarship.deadline)}</span>
                                    </div>
                                    {scholarship.eligibility && (
                                        <div className="flex items-start">
                                            <UserCheck className="h-4 w-4 mr-2 text-slate-500 mt-0.5" />
                                            <span>Eligibility: {scholarship.eligibility}</span>
                                        </div>
                                    )}
                                </div>

                                <p className="text-slate-400 text-sm mb-6 line-clamp-3 flex-1">
                                    {scholarship.description}
                                </p>

                                <a
                                    href={scholarship.apply_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-full px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors mt-auto"
                                >
                                    Apply Now
                                    <ExternalLink className="h-4 w-4 ml-2" />
                                </a>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-800 rounded-xl border border-dashed border-white/10">
                        <GraduationCap className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                        <p className="text-slate-400 text-lg">No active scholarships found.</p>
                        {isAdmin && (
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="mt-4 text-accent hover:underline font-medium"
                            >
                                Add a scholarship
                            </button>
                        )}
                    </div>
                )}
            </div>

            <AddScholarshipModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddScholarship}
            />
        </div>
    );
};

export default Scholarships;
