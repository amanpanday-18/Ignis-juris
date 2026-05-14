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
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-8 border border-[#e5e5e5]"
            >
                <div className="flex justify-between items-center p-6 border-b border-[#e5e5e5]">
                    <h2 className="text-xl font-black text-[#1c1b1b] tracking-tight">Add New Bare Act</h2>
                    <button onClick={onClose} className="p-2 rounded-full bg-[#f9fafb] text-[#474545] hover:text-[#1c1b1b] border border-[#e5e5e5] transition-all">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div>
                        <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Act Title *</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                            placeholder="e.g., The Indian Penal Code"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Act Number</label>
                            <input
                                type="text"
                                name="actNumber"
                                value={formData.actNumber}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                                placeholder="e.g., Act No. 45 of 1860"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Year</label>
                            <input
                                type="number"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] font-medium"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Category *</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] font-medium"
                        >
                            {actCategories.filter(c => c.id !== 'all').map(cat => (
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
                            placeholder="Brief summary of the act..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Upload PDF Document</label>
                        <div className="flex items-center space-x-3">
                            <label className="flex items-center px-4 py-3 bg-[#f9fafb] text-[#1c1b1b] border border-[#e5e5e5] rounded-xl cursor-pointer hover:bg-white hover:border-[#2d3a2e] transition-all font-bold shadow-sm">
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
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#474545] mt-4 mb-2">Or provide an external link below:</p>
                        <input
                            type="url"
                            name="contentUrl"
                            value={formData.contentUrl}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                            placeholder="https://example.com/act.pdf"
                        />
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
