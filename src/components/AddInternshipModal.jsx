import React, { useState } from 'react';
import { X, Briefcase, Loader, MapPin, Calendar, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { InternshipService, internshipTypes } from '../services/internship-service';

const AddInternshipModal = ({ isOpen, onClose, onAdd }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        organization: '',
        location: '',
        type: 'in-office',
        stipend: '',
        duration: '',
        deadline: '',
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
            const newInternship = await InternshipService.add(formData);
            onAdd(newInternship);
            onClose();
            // Reset form
            setFormData({
                title: '',
                organization: '',
                location: '',
                type: 'in-office',
                stipend: '',
                duration: '',
                deadline: '',
                description: '',
                applyLink: ''
            });
        } catch (error) {
            console.error('Error adding internship:', error);
            alert(`Failed to add internship: ${error.message || JSON.stringify(error)}`);
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
                    <h2 className="text-xl font-bold text-primary">Post Internship Opportunity</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role Title *</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                            placeholder="e.g., Legal Intern"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Organization *</label>
                        <input
                            type="text"
                            name="organization"
                            required
                            value={formData.organization}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                            placeholder="e.g., Khaitan & Co"
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
                                {internshipTypes.filter(t => t.id !== 'all').map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                            <input
                                type="text"
                                name="location"
                                required
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                                placeholder="e.g., Mumbai / Remote"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stipend</label>
                            <input
                                type="text"
                                name="stipend"
                                value={formData.stipend}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                                placeholder="e.g., ₹5,000/month"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                            <input
                                type="text"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                                placeholder="e.g., 2 Months"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline *</label>
                        <input
                            type="date"
                            name="deadline"
                            required
                            value={formData.deadline}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                        <textarea
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                            placeholder="Responsibilities, requirements..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Application Link / Email *</label>
                        <input
                            type="text"
                            name="applyLink"
                            required
                            value={formData.applyLink}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                            placeholder="https://... or mailto:hr@example.com"
                        />
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
                                    Posting...
                                </>
                            ) : (
                                <>
                                    <Briefcase className="h-5 w-5 mr-2" />
                                    Post Internship
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddInternshipModal;
