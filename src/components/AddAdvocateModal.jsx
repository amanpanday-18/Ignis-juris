import React, { useState } from 'react';
import { X, Upload, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdvocateService } from '../services/advocate-service';

const AddAdvocateModal = ({ isOpen, onClose, onAdd }) => {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        specialization: '',
        location: '',
        rating: '5.0',
        podcastTitle: '',
        podcastDuration: '',
        podcastUrl: '',
        phoneNumber: '',
        email: '',
        linkedinUrl: '',
        instagramUrl: '',
        websiteUrl: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newAdvocate = await AdvocateService.add(formData, imageFile);
            onAdd(newAdvocate);
            onClose();
            // Reset form
            setFormData({
                name: '',
                specialization: '',
                location: '',
                rating: '5.0',
                podcastTitle: '',
                podcastDuration: '',
                podcastUrl: '',
                phoneNumber: '',
                email: '',
                linkedinUrl: '',
                instagramUrl: '',
                websiteUrl: ''
            });
            setImageFile(null);
        } catch (error) {
            console.error('Error adding advocate:', error);
            // Show detailed error message
            alert(`Failed to add advocate: ${error.message || error.error_description || JSON.stringify(error)}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                >
                    <div className="flex justify-between items-center p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-primary">Add New Advocate</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* Image Upload */}
                        <div className="flex justify-center mb-6">
                            <div className="relative w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 hover:border-accent transition-colors">
                                {imageFile ? (
                                    <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <Upload className="h-8 w-8 mx-auto mb-1" />
                                        <span className="text-xs">Upload Photo</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                                    placeholder="e.g. Adv. John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                                <input
                                    type="text"
                                    name="specialization"
                                    required
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                                    placeholder="e.g. Criminal Law"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    required
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                                    placeholder="e.g. New Delhi"
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4">
                            <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase">Contact Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                                        placeholder="advocate@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                                    <input
                                        type="url"
                                        name="linkedinUrl"
                                        value={formData.linkedinUrl}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                                    <input
                                        type="url"
                                        name="instagramUrl"
                                        value={formData.instagramUrl}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                                        placeholder="https://instagram.com/..."
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                                    <input
                                        type="url"
                                        name="websiteUrl"
                                        value={formData.websiteUrl}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                                        placeholder="https://www.advocatewebsite.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4">
                            <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase">Podcast Details (Optional)</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        name="podcastTitle"
                                        value={formData.podcastTitle}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                                        placeholder="Episode Title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                    <input
                                        type="text"
                                        name="podcastDuration"
                                        value={formData.podcastDuration}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                                        placeholder="e.g. 15 min"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Podcast URL</label>
                                    <input
                                        type="url"
                                        name="podcastUrl"
                                        value={formData.podcastUrl}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                                        placeholder="https://spotify.com/..."
                                    />
                                </div>
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
                                        Adding Advocate...
                                    </>
                                ) : (
                                    'Add Advocate'
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AddAdvocateModal;
