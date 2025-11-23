import React, { useState } from 'react';
import { X, Upload, Loader, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { JudgementService } from '../services/judgement-service';
import { courts, categories } from '../data/judgements-data';

const AddJudgementModal = ({ isOpen, onClose, onAdd }) => {
    const [loading, setLoading] = useState(false);
    const [pdfFile, setPdfFile] = useState(null);
    const [formData, setFormData] = useState({
        caseNumber: '',
        caseTitle: '',
        court: courts[0],
        bench: '',
        dateOfJudgement: '',
        category: 'civil',
        summary: '',
        fullText: '',
        keywords: ''
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
            // Convert keywords string to array
            const keywordsArray = formData.keywords
                ? formData.keywords.split(',').map(k => k.trim()).filter(k => k)
                : [];

            const newJudgement = await JudgementService.add(
                { ...formData, keywords: keywordsArray },
                pdfFile
            );
            onAdd(newJudgement);
            onClose();
            // Reset form
            setFormData({
                caseNumber: '',
                caseTitle: '',
                court: courts[0],
                bench: '',
                dateOfJudgement: '',
                category: 'civil',
                summary: '',
                fullText: '',
                keywords: ''
            });
            setPdfFile(null);
        } catch (error) {
            console.error('Error adding judgement:', error);
            alert(`Failed to add judgement: ${error.message || JSON.stringify(error)}`);
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
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden my-8"
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-primary">Add New Judgement</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Case Number *</label>
                            <input
                                type="text"
                                name="caseNumber"
                                required
                                value={formData.caseNumber}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                                placeholder="e.g., Civil Appeal No. 1234/2023"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Judgement *</label>
                            <input
                                type="date"
                                name="dateOfJudgement"
                                required
                                value={formData.dateOfJudgement}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Case Title *</label>
                        <input
                            type="text"
                            name="caseTitle"
                            required
                            value={formData.caseTitle}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                            placeholder="e.g., ABC vs XYZ"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Court *</label>
                            <select
                                name="court"
                                value={formData.court}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                            >
                                {courts.map(court => (
                                    <option key={court} value={court}>{court}</option>
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
                                {categories.filter(c => c.id !== 'all').map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bench</label>
                        <input
                            type="text"
                            name="bench"
                            value={formData.bench}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                            placeholder="e.g., Hon'ble Justice ABC, Hon'ble Justice XYZ"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                        <textarea
                            name="summary"
                            rows="3"
                            value={formData.summary}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                            placeholder="Brief summary of the judgement..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Text</label>
                        <textarea
                            name="fullText"
                            rows="6"
                            value={formData.fullText}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                            placeholder="Full judgement text..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Keywords (comma-separated)</label>
                        <input
                            type="text"
                            name="keywords"
                            value={formData.keywords}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                            placeholder="e.g., contract, breach, damages"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload PDF (Optional)</label>
                        <div className="flex items-center space-x-3">
                            <label className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
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
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader className="animate-spin h-5 w-5 mr-2" />
                                    Adding Judgement...
                                </>
                            ) : (
                                'Add Judgement'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddJudgementModal;
