import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, IndianRupee, ExternalLink, Plus, Trash2, Loader, Building } from 'lucide-react';
import { JobService, experienceLevels } from '../services/job-service';
import { useAdmin } from '../hooks/useAdmin';
import AddJobModal from '../components/AddJobModal';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../components/PageHeader';
import bgJobs from '../assets/more_job_openings.png';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedExperience, setSelectedExperience] = useState('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { isAdmin } = useAdmin();

    useEffect(() => {
        loadJobs();
    }, [selectedExperience]);

    const loadJobs = async () => {
        setLoading(true);
        try {
            const filters = { experience: selectedExperience };
            const data = await JobService.getAll(filters);
            setJobs(data);
        } catch (error) {
            console.error('Error loading jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddJob = (newJob) => {
        setJobs([newJob, ...jobs]);
    };

    const handleDeleteJob = async (id) => {
        if (window.confirm('Are you sure you want to delete this job listing?')) {
            try {
                await JobService.delete(id);
                setJobs(jobs.filter(j => j.id !== id));
            } catch (error) {
                console.error('Error deleting job:', error);
                alert('Failed to delete job.');
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Recently';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="w-full min-h-screen" style={{ background: '#f0ede8' }}>
            <Helmet>
                <title>Job Openings - IGNIS JURIS</title>
            </Helmet>

            <PageHeader
                label="/CAREERS"
                title="Legal Job Openings"
                description="Explore career opportunities with top law firms, corporate legal teams, and senior advocates."
                bgImage={bgJobs}
                action={isAdmin && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center px-5 py-2.5 bg-white text-[#3d4f38] rounded-full hover:bg-white/90 transition-colors font-bold text-sm"
                    >
                        <Plus className="h-4 w-4 mr-2" />Post Job
                    </button>
                )}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {experienceLevels.map((exp) => (
                        <button
                            key={exp.id}
                            onClick={() => setSelectedExperience(exp.id)}
                            className={`px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-wider transition-all shadow-md border ${selectedExperience === exp.id
                                ? 'bg-[#2d3a2e] text-white border-[#2d3a2e] shadow-lg'
                                : 'bg-white text-[#474545] border-[#e5e5e5] hover:bg-[#f3f3f3]'
                                }`}
                        >
                            {exp.name}
                        </button>
                    ))}
                </div>

                {/* Jobs List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader className="animate-spin h-12 w-12 text-accent" />
                    </div>
                ) : jobs.length > 0 ? (
                    <div className="space-y-4">
                        {jobs.map((job, index) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-2xl shadow-sm border border-[#e5e5e5] p-8 hover:shadow-xl transition-all relative group hover:border-[#2d3a2e]/30"
                            >
                                {/* Admin Delete Button */}
                                {isAdmin && (
                                    <button
                                        onClick={() => handleDeleteJob(job.id)}
                                        className="absolute top-6 right-6 p-2 bg-red-50 text-red-600 border border-red-100 rounded-full hover:bg-red-600 hover:text-white shadow-sm transition-all opacity-0 group-hover:opacity-100"
                                        title="Delete Job"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}

                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <h3 className="text-2xl font-black text-[#1c1b1b] tracking-tight">{job.title}</h3>
                                            <span className="px-3 py-1 bg-[#f9fafb] text-[#474545] border border-[#e5e5e5] rounded-full text-[10px] font-black uppercase tracking-widest">
                                                {job.type}
                                            </span>
                                        </div>
                                            <div className="flex items-center text-lg text-[#1c1b1b] font-bold mb-4">
                                                <Building className="h-5 w-5 mr-2.5 text-[#2d3a2e]" />
                                                {job.organization}
                                            </div>

                                            <div className="flex flex-wrap gap-6 text-xs font-bold text-[#474545] mb-6">
                                                <div className="flex items-center">
                                                    <MapPin className="h-4 w-4 mr-1.5 text-[#2d3a2e]" />
                                                    {job.location}
                                                </div>
                                                <div className="flex items-center">
                                                    <Briefcase className="h-4 w-4 mr-1.5 text-[#2d3a2e]" />
                                                    {job.experience}
                                                </div>
                                                <div className="flex items-center">
                                                    <IndianRupee className="h-4 w-4 mr-1.5 text-[#2d3a2e]" />
                                                    {job.salary || 'NOT DISCLOSED'}
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="h-4 w-4 mr-1.5 text-[#2d3a2e]" />
                                                    POSTED: {formatDate(job.posted_date).toUpperCase()}
                                                </div>
                                            </div>

                                        <p className="text-[#474545] text-sm line-clamp-2 leading-relaxed mb-6 md:mb-0">
                                            {job.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center">
                                        <a
                                            href={job.apply_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center w-full md:w-auto px-8 py-4 bg-[#2d3a2e] text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-[#1c1b1b] transition-all shadow-lg"
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
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#e5e5e5] shadow-sm">
                        <Briefcase className="h-16 w-16 text-[#2d3a2e]/20 mx-auto mb-6" />
                        <p className="text-[#1c1b1b] text-xl font-black uppercase tracking-tighter mb-2">No job openings found</p>
                        <p className="text-[#474545] text-sm">We're constantly updating our listings. Check back soon.</p>
                        {isAdmin && (
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="mt-4 text-accent hover:underline font-medium"
                            >
                                Post the first job
                            </button>
                        )}
                    </div>
                )}
            </div>

            <AddJobModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddJob}
            />
        </div>
    );
};

export default Jobs;
