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
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden my-8 border border-[#e5e5e5]"
            >
                <div className="flex justify-between items-center p-6 border-b border-[#e5e5e5]">
                    <h2 className="text-xl font-black text-[#1c1b1b] tracking-tight">Upload New Template</h2>
                    <button onClick={onClose} className="p-2 rounded-full bg-[#f9fafb] text-[#474545] hover:text-[#1c1b1b] border border-[#e5e5e5] transition-all">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Template Title *</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                            placeholder="e.g., General Rent Agreement"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Category *</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] font-medium"
                        >
                            {templateCategories.filter(c => c.id !== 'all').map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Description</label>
                        <textarea
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium resize-none"
                            placeholder="Brief description of when to use this template..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Upload Document (Word/PDF) *</label>
                        <div className="flex items-center space-x-3">
                            <label className="flex items-center px-4 py-3 bg-[#f9fafb] text-[#1c1b1b] border border-[#e5e5e5] rounded-xl cursor-pointer hover:bg-white hover:border-[#2d3a2e] transition-all font-bold shadow-sm w-full justify-center">
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
