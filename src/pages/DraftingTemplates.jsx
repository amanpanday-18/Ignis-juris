import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Plus, Trash2, Loader, Search } from 'lucide-react';
import { TemplateService, templateCategories } from '../services/template-service';
import { ActivityService } from '../services/activity-service';
import { useAdmin } from '../hooks/useAdmin';
import AddTemplateModal from '../components/AddTemplateModal';
import { Helmet } from 'react-helmet-async';

const DraftingTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { isAdmin } = useAdmin();

    useEffect(() => {
        loadTemplates();
    }, [selectedCategory]);

    const loadTemplates = async () => {
        setLoading(true);
        try {
            const data = await TemplateService.getAll(selectedCategory);
            setTemplates(data);
        } catch (error) {
            console.error('Error loading templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTemplate = (newTemplate) => {
        setTemplates([newTemplate, ...templates]);
    };

    const handleDeleteTemplate = async (id) => {
        if (window.confirm('Are you sure you want to delete this template?')) {
            try {
                await TemplateService.delete(id);
                setTemplates(templates.filter(t => t.id !== id));
            } catch (error) {
                console.error('Error deleting template:', error);
                alert('Failed to delete template.');
            }
        }
    };

    const handleDownload = async (template) => {
        try {
            await TemplateService.incrementDownloads(template.id);

            // Log to Dashboard
            await ActivityService.logActivity('Download', template.title, 'Downloaded Template', null, template.file_url);

            // Open file in new tab
            window.open(template.file_url, '_blank');

            // Update local state to reflect download count increment
            setTemplates(templates.map(t =>
                t.id === template.id ? { ...t, downloads: t.downloads + 1 } : t
            ));
        } catch (error) {
            console.error('Error downloading:', error);
        }
    };

    return (
        <div className="w-full py-12 text-slate-100">
            <Helmet>
                <title>Drafting Templates - IGNIS JURIS</title>
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 relative">
                    <div className="flex items-center justify-center mb-4">
                        <FileText className="h-10 w-10 text-accent mr-3" />
                        <h1 className="text-4xl font-bold text-white">Legal Drafting Templates</h1>
                    </div>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Professional legal formats for Affidavits, Agreements, Notices, and more. Ready to download and customize.
                    </p>

                    {/* Admin Add Button */}
                    {isAdmin && (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="absolute top-0 right-0 flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors shadow-lg"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Upload Template
                        </button>
                    )}
                </div>

                {/* Category Filter */}
                <div className="flex overflow-x-auto pb-4 mb-8 gap-2 custom-scrollbar">
                    {templateCategories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat.id
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Templates Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader className="animate-spin h-12 w-12 text-accent" />
                    </div>
                ) : templates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map((template, index) => (
                            <motion.div
                                key={template.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-slate-800 rounded-xl shadow-md border border-white/5 p-6 hover:shadow-lg transition-all relative group flex flex-col hover:border-accent/30"
                            >
                                {/* Admin Delete Button */}
                                {isAdmin && (
                                    <button
                                        onClick={() => handleDeleteTemplate(template.id)}
                                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Delete Template"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                )}

                                <div className="flex-1">
                                    <div className="flex items-center mb-3">
                                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">
                                            {templateCategories.find(c => c.id === template.category)?.name || template.category}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{template.title}</h3>
                                    <p className="text-slate-400 mb-4 text-sm line-clamp-3">{template.description}</p>
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                                    <span className="text-xs text-slate-500 font-medium">
                                        {template.downloads} Downloads
                                    </span>
                                    <button
                                        onClick={() => handleDownload(template)}
                                        className="flex items-center px-4 py-2 bg-white/5 text-slate-300 font-bold rounded-lg hover:bg-primary hover:text-white transition-colors text-sm"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-800 rounded-xl border border-dashed border-white/10">
                        <FileText className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                        <p className="text-slate-400 text-lg">No templates found in this category.</p>
                        {isAdmin && (
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="mt-4 text-accent hover:underline font-medium"
                            >
                                Upload the first template
                            </button>
                        )}
                    </div>
                )}
            </div>

            <AddTemplateModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddTemplate}
            />
        </div>
    );
};

export default DraftingTemplates;
