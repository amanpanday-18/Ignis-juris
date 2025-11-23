import React, { useState } from 'react';
import { X, Upload, Loader, Video, FileText, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { EducationService, educationCategories, resourceTypes } from '../services/education-service';

const AddResourceModal = ({ isOpen, onClose, onAdd }) => {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        type: 'video',
        category: 'constitutional',
        description: '',
        contentUrl: '', // For YouTube or external links
        thumbnailUrl: '' // Optional for videos
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validation
            if (formData.type === 'pdf' && !file && !formData.contentUrl) {
                alert('Please upload a PDF file or provide a URL.');
                setLoading(false);
                return;
            }
            if (formData.type === 'video' && !formData.contentUrl) {
                alert('Please provide a Video URL.');
                setLoading(false);
                return;
            }

            const newResource = await EducationService.add(formData, file);
            onAdd(newResource);
            onClose();
            // Reset form
            setFormData({
                title: '',
                type: 'video',
                category: 'constitutional',
                description: '',
                contentUrl: '',
                thumbnailUrl: ''
            });
            setFile(null);
        } catch (error) {
            console.error('Error adding resource:', error);
            alert(`Failed to add resource: ${error.message || JSON.stringify(error)}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden my-8"
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-primary">Add Educational Resource</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                            placeholder="e.g., Introduction to Constitutional Law"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                            >
                                {resourceTypes.filter(t => t.id !== 'all').map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                            >
                                {educationCategories.filter(c => c.id !== 'all').map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                            placeholder="Brief summary of the content..."
                        />
                    </div>

                    {formData.type === 'video' || formData.type === 'article' ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {formData.type === 'video' ? 'Video URL (YouTube) *' : 'Article URL *'}
                            </label>
                            <input
                                type="url"
                                name="contentUrl"
                                required
                                value={formData.contentUrl}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                                placeholder="https://..."
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload PDF Document</label>
                            <div className="flex items-center space-x-3">
                                <label className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors w-full justify-center border-2 border-dashed border-gray-300">
                                    <Upload className="h-4 w-4 mr-2" />
                                    {file ? file.name : 'Choose PDF File'}
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                                {file && (
                                    <button
                                        type="button"
                                        onClick={() => setFile(null)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {formData.type === 'video' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL (Optional)</label>
                            <input
                                type="url"
                                name="thumbnailUrl"
                                value={formData.thumbnailUrl}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                                placeholder="https://..."
                            />
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader className="animate-spin h-5 w-5 mr-2" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    {formData.type === 'video' ? <Video className="h-5 w-5 mr-2" /> : <FileText className="h-5 w-5 mr-2" />}
                                    Add Resource
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddResourceModal;
