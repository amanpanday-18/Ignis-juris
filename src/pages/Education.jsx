import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, FileText, Link as LinkIcon, Plus, Trash2, Loader, PlayCircle, Download, ExternalLink } from 'lucide-react';
import { EducationService, educationCategories, resourceTypes } from '../services/education-service';
import { useAdmin } from '../hooks/useAdmin';
import AddResourceModal from '../components/AddResourceModal';
import { Helmet } from 'react-helmet-async';

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
        <div className="w-full py-12 text-slate-100">
            <Helmet>
                <title>Education - IGNIS JURIS</title>
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 relative">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-primary/20 p-3 rounded-full mr-3">
                            <Video className="h-8 w-8 text-primary-light" />
                        </div>
                        <h1 className="text-4xl font-bold text-white">Educational Resources</h1>
                    </div>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Curated study materials, video tutorials, and legal articles to enhance your knowledge.
                    </p>

                    {/* Admin Add Button */}
                    {isAdmin && (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="absolute top-0 right-0 flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors shadow-lg"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add Resource
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-white"
                    >
                        {educationCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-white"
                    >
                        {resourceTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                    </select>
                </div>

                {/* Resources Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader className="animate-spin h-12 w-12 text-accent" />
                    </div>
                ) : resources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resources.map((resource, index) => (
                            <motion.div
                                key={resource.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-slate-800 rounded-xl shadow-md border border-white/5 overflow-hidden hover:shadow-lg transition-all relative group flex flex-col hover:border-accent/30"
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
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mr-2 ${resource.type === 'video' ? 'bg-red-500/20 text-red-400' :
                                            resource.type === 'pdf' ? 'bg-primary-light/20 text-blue-400' :
                                                'bg-green-500/20 text-green-400'
                                            }`}>
                                            {resourceTypes.find(t => t.id === resource.type)?.name}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            {educationCategories.find(c => c.id === resource.category)?.name}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{resource.title}</h3>
                                    <p className="text-slate-400 mb-4 text-sm line-clamp-3 flex-1">{resource.description}</p>

                                    <a
                                        href={resource.content_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center w-full px-4 py-2 bg-white/5 text-slate-300 font-bold rounded-lg hover:bg-primary hover:text-white transition-colors text-sm mt-auto"
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
                    <div className="text-center py-12 bg-slate-800 rounded-xl border border-dashed border-white/10">
                        <div className="bg-white/5 p-4 rounded-full inline-block mb-4">
                            <Video className="h-8 w-8 text-slate-500" />
                        </div>
                        <p className="text-slate-500 text-lg">No resources found matching your filters.</p>
                        {isAdmin && (
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="mt-4 text-accent hover:underline font-medium"
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
