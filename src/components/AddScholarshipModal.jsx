import React, { useState } from 'react';
import { X, GraduationCap, Loader, Calendar, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScholarshipService } from '../services/scholarship-service';

const AddScholarshipModal = ({ isOpen, onClose, onAdd }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        provider: '',
        amount: '',
        deadline: '',
        eligibility: '',
        description: '',
        applyLink: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const newScholarship = await ScholarshipService.add(formData);
            onAdd(newScholarship);
            onClose();
            // Reset form
            setFormData({
                title: '',
                provider: '',
                amount: '',
                deadline: '',
                eligibility: '',
                description: '',
                applyLink: ''
            });
        } catch (error) {
            console.error('Error adding scholarship:', error);
            alert(`Failed to add scholarship: ${error.message || JSON.stringify(error)}`);
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
                    <h2 className="text-xl font-bold text-white">Add Scholarship</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Scholarship Title *</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-500"
                            placeholder="e.g., Rhodes Scholarship"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Provider / Organization *</label>
                        <input
                            type="text"
                            name="provider"
                            required
                            value={formData.provider}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-500"
                            placeholder="e.g., Rhodes Trust"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Amount / Benefit *</label>
                            <input
                                type="text"
                                name="amount"
                                required
                                value={formData.amount}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-500"
                                placeholder="e.g., Full Tuition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Application Deadline *</label>
                            <input
                                type="date"
                                name="deadline"
                                required
                                value={formData.deadline}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Eligibility Criteria</label>
                        <input
                            type="text"
                            name="eligibility"
                            value={formData.eligibility}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-500"
                            placeholder="e.g., Final year law students"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                        <textarea
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-500"
                            placeholder="Details about the program..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Application Link *</label>
                        <input
                            type="text"
                            name="applyLink"
                            required
                            value={formData.applyLink}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-500"
                            placeholder="https://..."
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
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <GraduationCap className="h-5 w-5 mr-2" />
                                    Add Scholarship
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddScholarshipModal;
