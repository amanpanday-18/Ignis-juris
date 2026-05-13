import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, FileText, Link as LinkIcon, Plus, Trash2, Loader, PlayCircle, Download, ExternalLink } from 'lucide-react';
import { EducationService, educationCategories, resourceTypes } from '../services/education-service';
import { useAdmin } from '../hooks/useAdmin';
import AddResourceModal from '../components/AddResourceModal';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../components/PageHeader';
import bgEducation from '../assets/more_education.png';

const Education = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { isAdmin } = useAdmin();

    useEffect(() => {
        loadResources();
    }, [selectedCategory, selectedType]);

    const loadResources = async () => {
        setLoading(true);
        try {
            const filters = {
                category: selectedCategory,
                type: selectedType
            };
            const data = await EducationService.getAll(filters);
            setResources(data);
        } catch (error) {
            console.error('Error loading resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddResource = (newResource) => {
        setResources([newResource, ...resources]);
    };

    const handleDeleteResource = async (id) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            try {
                await EducationService.delete(id);
                setResources(resources.filter(r => r.id !== id));
            } catch (error) {
                console.error('Error deleting resource:', error);
                alert('Failed to delete resource.');
            }
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'video': return <Video className="h-6 w-6" />;
            case 'pdf': return <FileText className="h-6 w-6" />;
            case 'article': return <LinkIcon className="h-6 w-6" />;
            default: return <FileText className="h-6 w-6" />;
        }
    };

    const getActionLabel = (type) => {
        switch (type) {
            case 'video': return 'Watch Video';
            case 'pdf': return 'Download PDF';
            case 'article': return 'Read Article';
            default: return 'View';
        }
    };

    return (
        <div className="w-full min-h-screen" style={{ background: '#f0ede8' }}>
            <Helmet>
                <title>Education - IGNIS JURIS</title>
            </Helmet>

            <PageHeader
                label="/EDUCATION"
                title="Educational Resources"
                description="Curated study materials, video tutorials, and legal articles to enhance your knowledge."
                bgImage={bgEducation}
                action={isAdmin && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center px-5 py-2.5 bg-white text-[#3d4f38] rounded-full hover:bg-white/90 transition-colors font-bold text-sm"
                    >
                        <Plus className="h-4 w-4 mr-2" />Add Resource
                    </button>
                )}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-[#e5e5e5] rounded-full focus:ring-2 focus:ring-[#1c1b1b] focus:outline-none text-[#1c1b1b] text-sm font-semibold"
                    >
                        {educationCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-[#e5e5e5] rounded-full focus:ring-2 focus:ring-[#1c1b1b] focus:outline-none text-[#1c1b1b] text-sm font-semibold"
                    >
                        {resourceTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                    </select>
                </div>

                {/* Resources Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader className="animate-spin h-10 w-10 text-[#2d3a2e]" />
                    </div>
                ) : resources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resources.map((resource, index) => (
                            <motion.div
                                key={resource.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-1 border border-[#e5e5e5] overflow-hidden transition-all duration-300 relative group flex flex-col"
                            >
                                {/* Admin Delete Button */}
                                {isAdmin && (
                                    <button
                                        onClick={() => handleDeleteResource(resource.id)}
                                        className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                                        title="Delete Resource"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                )}

                                {/* Thumbnail for Videos */}
                                {resource.type === 'video' && (
                                    <div className="relative h-48 bg-black/40 flex items-center justify-center overflow-hidden">
                                        {resource.thumbnail_url ? (
                                            <img src={resource.thumbnail_url} alt={resource.title} className="w-full h-full object-cover opacity-80" />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-black opacity-80"></div>
                                        )}
                                        <PlayCircle className="absolute h-16 w-16 text-white opacity-80 group-hover:scale-110 transition-transform" />
                                    </div>
                                )}

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center mb-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mr-2 ${
                                            resource.type === 'video' ? 'bg-[#f3f3f3] text-[#1c1b1b] border border-[#e5e5e5]' :
                                            resource.type === 'pdf' ? 'bg-[#f3f3f3] text-[#1c1b1b] border border-[#e5e5e5]' :
                                            'bg-[#f3f3f3] text-[#1c1b1b] border border-[#e5e5e5]'
                                        }`}>
                                            {resourceTypes.find(t => t.id === resource.type)?.name}
                                        </span>
                                        <span className="text-xs text-[#888]">
                                            {educationCategories.find(c => c.id === resource.category)?.name}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-[#1c1b1b] mb-2 line-clamp-2">{resource.title}</h3>
                                    <p className="text-[#474545] mb-4 text-sm line-clamp-3 flex-1">{resource.description}</p>

                                    <a
                                        href={resource.content_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center w-full px-4 py-2.5 bg-[#1c1b1b] text-white font-bold rounded-full hover:bg-[#474545] transition-colors text-sm mt-auto"
                                    >
                                        {resource.type === 'video' ? <PlayCircle className="h-4 w-4 mr-2" /> :
                                            resource.type === 'pdf' ? <Download className="h-4 w-4 mr-2" /> :
                                                <ExternalLink className="h-4 w-4 mr-2" />}
                                        {getActionLabel(resource.type)}
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl border border-[#e5e5e5]">
                        <div className="w-12 h-12 rounded-full bg-[#f3f3f3] border border-[#e5e5e5] flex items-center justify-center mx-auto mb-4">
                            <Video className="h-6 w-6 text-[#474545]" />
                        </div>
                        <p className="text-[#474545] text-lg">No resources found matching your filters.</p>
                        {isAdmin && (
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="mt-4 text-[#1c1b1b] font-bold hover:text-[#474545] underline"
                            >
                                Add the first resource
                            </button>
                        )}
                    </div>
                )}
            </div>

            <AddResourceModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddResource}
            />
        </div>
    );
};

export default Education;
