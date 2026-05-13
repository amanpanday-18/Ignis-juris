import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, IndianRupee, Calendar, ExternalLink, Plus, Trash2, Loader } from 'lucide-react';
import { InternshipService, internshipTypes } from '../services/internship-service';
import { useAdmin } from '../hooks/useAdmin';
import AddInternshipModal from '../components/AddInternshipModal';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../components/PageHeader';
import bgInternships from '../assets/more_internships.png';

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
        <div className="w-full min-h-screen" style={{ background: '#f0ede8' }}>
            <Helmet>
                <title>Internships - IGNIS JURIS</title>
            </Helmet>

            <PageHeader
                label="/INTERNSHIPS"
                title="Internship Opportunities"
                description="Find the perfect legal internship to kickstart your career. Top firms, NGOs, and advocates."
                bgImage={bgInternships}
                action={isAdmin && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center px-5 py-2.5 bg-white text-[#3d4f38] rounded-full hover:bg-white/90 transition-colors font-bold text-sm"
                    >
                        <Plus className="h-4 w-4 mr-2" />Post Internship
                    </button>
                )}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Filter */}
                <div className="flex mb-8">
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-[#e5e5e5] rounded-full focus:ring-2 focus:ring-[#1c1b1b] focus:outline-none text-[#1c1b1b] text-sm font-semibold"
                    >
                        {internshipTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader className="animate-spin h-10 w-10 text-[#2d3a2e]" />
                    </div>
                ) : internships.length > 0 ? (
                    <div className="space-y-4">
                        {internships.map((internship, index) => (
                            <motion.div
                                key={internship.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-2xl shadow-card hover:shadow-card-hover border border-[#e5e5e5] p-6 transition-all duration-300 relative group hover:-translate-y-1"
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
                                            <h3 className="text-xl font-bold text-[#1c1b1b] mr-3">{internship.title}</h3>
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[#e5e5e5] text-[#474545] bg-[#f3f3f3]">
                                                {internship.type}
                                            </span>
                                        </div>
                                        <p className="text-base text-[#1c1b1b] font-semibold mb-2">{internship.organization}</p>

                                        <div className="flex flex-wrap gap-4 text-sm text-[#474545] mb-4">
                                            <div className="flex items-center"><MapPin className="h-4 w-4 mr-1" />{internship.location}</div>
                                            <div className="flex items-center"><IndianRupee className="h-4 w-4 mr-1" />{internship.stipend || 'Unpaid'}</div>
                                            <div className="flex items-center"><Clock className="h-4 w-4 mr-1" />{internship.duration}</div>
                                            <div className="flex items-center"><Calendar className="h-4 w-4 mr-1 text-[#2d3a2e]" />Deadline: <span className="text-[#1c1b1b] ml-1 font-semibold">{formatDate(internship.deadline)}</span></div>
                                        </div>

                                        <p className="text-[#474545] text-sm line-clamp-2 mb-4 md:mb-0">
                                            {internship.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center">
                                        <a
                                            href={internship.apply_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center w-full md:w-auto px-6 py-2.5 bg-[#1c1b1b] text-white font-bold rounded-full hover:bg-[#474545] transition-all text-sm"
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
                    <div className="text-center py-12 bg-white rounded-2xl border border-[#e5e5e5]">
                        <Briefcase className="h-12 w-12 text-[#474545] mx-auto mb-3" />
                        <p className="text-[#474545] text-lg">No internships found matching your criteria.</p>
                        {isAdmin && (
                            <button onClick={() => setIsAddModalOpen(true)} className="mt-4 text-[#1c1b1b] font-bold hover:text-[#474545] underline">
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
