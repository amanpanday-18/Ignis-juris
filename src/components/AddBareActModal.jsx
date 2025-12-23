import React, { useState } from 'react';
import { X, Upload, Loader, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { BareActService, actCategories } from '../services/bare-act-service';

const AddBareActModal = ({ isOpen, onClose, onAdd }) => {
    const [loading, setLoading] = useState(false);
    const [pdfFile, setPdfFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        actNumber: '',
        year: new Date().getFullYear(),
        category: 'criminal',
        description: '',
        contentUrl: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setPdfFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newAct = await BareActService.add(formData, pdfFile);
            onAdd(newAct);
            onClose();
            // Reset form
            setFormData({
                title: '',
                actNumber: '',
                year: new Date().getFullYear(),
                category: 'criminal',
                description: '',
                contentUrl: ''
            });
            setPdfFile(null);
        } catch (error) {
            console.error('Error adding act:', error);
            alert(`Failed to add act: ${error.message || JSON.stringify(error)}`);
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
                className="bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden my-8 border border-white/10"
            >
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">Add New Bare Act</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Act Title *</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-500"
                            placeholder="e.g., The Indian Penal Code"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Act Number</label>
                            <input
                                type="text"
                                name="actNumber"
                                value={formData.actNumber}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-500"
                                placeholder="e.g., Act No. 45 of 1860"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Year</label>
                            <input
                                type="number"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Category *</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white"
                        >
                            {actCategories.filter(c => c.id !== 'all').map(cat => (
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
                            placeholder="Brief summary of the act..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Upload PDF Document</label>
                        <div className="flex items-center space-x-3">
                            <label className="flex items-center px-4 py-2 bg-slate-800 text-gray-300 border border-white/10 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors">
                                <Upload className="h-4 w-4 mr-2" />
                                {pdfFile ? pdfFile.name : 'Choose PDF File'}
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                            {pdfFile && (
                                <button
                                    type="button"
                                    onClick={() => setPdfFile(null)}
                                    className="text-red-500 hover:text-red-400"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Or provide an external link below:</p>
                        <input
                            type="url"
                            name="contentUrl"
                            value={formData.contentUrl}
                            onChange={handleChange}
                            className="w-full mt-2 px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-500"
                            placeholder="https://example.com/act.pdf"
                        />
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
                                    Adding Act...
                                </>
                            ) : (
                                <>
                                    <FileText className="h-5 w-5 mr-2" />
                                    Add Bare Act
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddBareActModal;
