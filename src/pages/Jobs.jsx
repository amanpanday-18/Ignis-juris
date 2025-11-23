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
    <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12 relative">
                <div className="flex items-center justify-center mb-4">
                    <div className="bg-purple-100 p-3 rounded-full mr-3">
                        <Briefcase className="h-8 w-8 text-purple-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-primary">Legal Job Openings</h1>
                </div>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Explore career opportunities with top law firms, corporate legal teams, and senior advocates.
                </p>

                {/* Admin Add Button */}
                {isAdmin && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="absolute top-0 right-0 flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors shadow-lg"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Post Job
                    </button>
                )}
            </div>

            {/* Filter */}
            <div className="flex justify-center mb-8">
                <select
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent bg-white shadow-sm"
                >
                    {experienceLevels.map(exp => (
                        <option key={exp.id} value={exp.id}>{exp.name}</option>
                    ))}
                </select>
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
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative group"
                        >
                            {/* Admin Delete Button */}
                            {isAdmin && (
                                <button
                                    onClick={() => handleDeleteJob(job.id)}
                                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete Job"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            )}

                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <h3 className="text-xl font-bold text-gray-900 mr-3">{job.title}</h3>
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-bold uppercase tracking-wider">
                                            {job.type}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-lg text-gray-700 font-medium mb-2">
                                        <Building className="h-4 w-4 mr-2 text-gray-400" />
                                        {job.organization}
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                                        <div className="flex items-center">
                                            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                            {job.location}
                                        </div>
                                        <div className="flex items-center">
                                            <Briefcase className="h-4 w-4 mr-1 text-gray-400" />
                                            {job.experience}
                                        </div>
                                        <div className="flex items-center">
                                            <IndianRupee className="h-4 w-4 mr-1 text-gray-400" />
                                            {job.salary || 'Not Disclosed'}
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                            Posted: {formatDate(job.posted_date)}
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-sm line-clamp-2 mb-4 md:mb-0">
                                        {job.description}
                                    </p>
                                </div>

                                <div className="flex items-center">
                                    <a
                                        href={job.apply_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center w-full md:w-auto px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg"
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
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-lg">No job openings found.</p>
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
