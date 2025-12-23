import React, { useState } from 'react';
import { X, Upload, Loader, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { TemplateService, templateCategories } from '../services/template-service';

const AddTemplateModal = ({ isOpen, onClose, onAdd }) => {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: 'affidavits',
        description: ''
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
        if (!file) {
            alert('Please upload a document file.');
            return;
        }

        setLoading(true);
        try {
            const newTemplate = await TemplateService.add(formData, file);
            onAdd(newTemplate);
            onClose();
            // Reset form
            setFormData({
                title: '',
                category: 'affidavits',
                description: ''
            });
            setFile(null);
        } catch (error) {
            console.error('Error adding template:', error);
            alert(`Failed to add template: ${error.message || JSON.stringify(error)}`);
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
                className="bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden my-8 border border-white/10"
            >
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">Upload New Template</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Template Title *</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-500"
                            placeholder="e.g., General Rent Agreement"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Category *</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white"
                        >
                            {templateCategories.filter(c => c.id !== 'all').map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                        <textarea
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-500"
                            placeholder="Brief description of when to use this template..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Upload Document (Word/PDF) *</label>
                        <div className="flex items-center space-x-3">
                            <label className="flex items-center px-4 py-2 bg-slate-800 text-gray-300 border border-white/10 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors w-full justify-center">
                                <Upload className="h-4 w-4 mr-2" />
                                {file ? file.name : 'Choose File'}
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
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

                    <div className="pt-4 flex space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors border border-white/10"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 flex items-center justify-center py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader className="animate-spin h-5 w-5 mr-2" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <FileText className="h-5 w-5 mr-2" />
                                    Upload Template
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddTemplateModal;
