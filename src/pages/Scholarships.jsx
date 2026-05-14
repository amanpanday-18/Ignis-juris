import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, IndianRupee, ExternalLink, Plus, Trash2, Loader, UserCheck } from 'lucide-react';
import { ScholarshipService } from '../services/scholarship-service';
import { useAdmin } from '../hooks/useAdmin';
import AddScholarshipModal from '../components/AddScholarshipModal';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../components/PageHeader';
import bgScholar from '../assets/more_scholarships.png';

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
        <div className="w-full min-h-screen" style={{ background: '#f0ede8' }}>
            <Helmet>
                <title>Scholarships - IGNIS JURIS</title>
            </Helmet>

            <PageHeader
                label="/SCHOLARSHIPS"
                title="Scholarships & Grants"
                description="Financial aid opportunities, fellowships, and grants for law students and researchers."
                bgImage={bgScholar}
                action={isAdmin && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center px-5 py-2.5 bg-white text-[#3d4f38] rounded-full hover:bg-white/90 transition-colors font-bold text-sm"
                    >
                        <Plus className="h-4 w-4 mr-2" />Add Scholarship
                    </button>
                )}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

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
                                className="bg-white rounded-2xl shadow-sm border border-[#e5e5e5] p-8 hover:shadow-xl transition-all relative group flex flex-col hover:border-[#2d3a2e]/30"
                            >
                                {/* Admin Delete Button */}
                                {isAdmin && (
                                    <button
                                        onClick={() => handleDeleteScholarship(scholarship.id)}
                                        className="absolute top-6 right-6 p-2 bg-red-50 text-red-600 border border-red-100 rounded-full hover:bg-red-600 hover:text-white shadow-sm transition-all opacity-0 group-hover:opacity-100"
                                        title="Delete Scholarship"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}

                                <div className="flex items-start justify-between gap-4 mb-6">
                                    <div className="flex-1">
                                        <span className="text-[10px] font-black text-[#2d3a2e] uppercase tracking-widest bg-[#2d3a2e]/5 px-2 py-0.5 rounded">
                                            {scholarship.provider}
                                        </span>
                                        <h3 className="text-2xl font-black text-[#1c1b1b] mt-2 leading-tight tracking-tight">{scholarship.title}</h3>
                                    </div>
                                    <div className="bg-green-50 text-green-700 border border-green-100 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center shadow-sm">
                                        <IndianRupee className="h-3.5 w-3.5 mr-1" />
                                        {scholarship.amount}
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center text-xs font-bold text-[#474545]">
                                        <Calendar className="h-4 w-4 mr-2.5 text-[#2d3a2e]" />
                                        DEADLINE: <span className="text-red-600 ml-1.5 font-black uppercase tracking-widest">{formatDate(scholarship.deadline)}</span>
                                    </div>
                                    {scholarship.eligibility && (
                                        <div className="flex items-start text-xs font-bold text-[#474545]">
                                            <UserCheck className="h-4 w-4 mr-2.5 text-[#2d3a2e] mt-0.5" />
                                            <span>ELIGIBILITY: {scholarship.eligibility.toUpperCase()}</span>
                                        </div>
                                    )}
                                </div>

                                <p className="text-[#474545] text-sm mb-8 line-clamp-3 flex-1 leading-relaxed">
                                    {scholarship.description}
                                </p>

                                <a
                                    href={scholarship.apply_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-full px-8 py-4 bg-[#2d3a2e] text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-[#1c1b1b] transition-all shadow-lg mt-auto"
                                >
                                    Apply Now
                                    <ExternalLink className="h-4 w-4 ml-2" />
                                </a>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#e5e5e5] shadow-sm">
                        <GraduationCap className="h-16 w-16 text-[#2d3a2e]/20 mx-auto mb-6" />
                        <p className="text-[#1c1b1b] text-xl font-black uppercase tracking-tighter mb-2">No active scholarships found</p>
                        <p className="text-[#474545] text-sm">New opportunities are added weekly. Check back soon.</p>
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
