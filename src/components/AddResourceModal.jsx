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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden my-8 border border-[#e5e5e5]"
            >
                <div className="flex justify-between items-center p-6 border-b border-[#e5e5e5]">
                    <h2 className="text-xl font-black text-[#1c1b1b] tracking-tight">Add Educational Resource</h2>
                    <button onClick={onClose} className="p-2 rounded-full bg-[#f9fafb] text-[#474545] hover:text-[#1c1b1b] border border-[#e5e5e5] transition-all">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div>
                        <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Title *</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                            placeholder="e.g., Introduction to Constitutional Law"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Type *</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] font-medium"
                            >
                                {resourceTypes.filter(t => t.id !== 'all').map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Category *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] font-medium"
                            >
                                {educationCategories.filter(c => c.id !== 'all').map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Description</label>
                        <textarea
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium resize-none"
                            placeholder="Brief summary of the content..."
                        />
                    </div>

                    {formData.type === 'video' || formData.type === 'article' ? (
                        <div>
                            <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">
                                {formData.type === 'video' ? 'Video URL (YouTube) *' : 'Article URL *'}
                            </label>
                            <input
                                type="url"
                                name="contentUrl"
                                required
                                value={formData.contentUrl}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                                placeholder="https://..."
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Upload PDF Document</label>
                            <div className="flex items-center space-x-3">
                                <label className="flex items-center px-4 py-3 bg-[#f9fafb] text-[#1c1b1b] border border-[#e5e5e5] rounded-xl cursor-pointer hover:bg-white hover:border-[#2d3a2e] transition-all w-full justify-center font-bold shadow-sm">
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
                                        className="text-red-500 hover:text-red-400"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {formData.type === 'video' && (
                        <div>
                            <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Thumbnail URL (Optional)</label>
                            <input
                                type="url"
                                name="thumbnailUrl"
                                value={formData.thumbnailUrl}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                                placeholder="https://..."
                            />
                        </div>
                    )}

                    <div className="pt-6 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-white text-[#474545] font-bold rounded-xl hover:bg-[#f9fafb] transition-all border border-[#e5e5e5] shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 flex items-center justify-center py-3 bg-[#2d3a2e] hover:bg-[#1c1b1b] text-white font-black rounded-xl transition-all shadow-lg disabled:opacity-50"
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
