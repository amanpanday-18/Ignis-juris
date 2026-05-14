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
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-[#e5e5e5]"
                >
                    <div className="flex justify-between items-center p-6 border-b border-[#e5e5e5]">
                        <h2 className="text-xl font-black text-[#1c1b1b] tracking-tight">Add New Advocate</h2>
                        <button onClick={onClose} className="p-2 rounded-full bg-[#f9fafb] text-[#474545] hover:text-[#1c1b1b] border border-[#e5e5e5] transition-all">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* Image Upload */}
                        <div className="flex justify-center mb-6">
                            <div className="relative w-32 h-32 bg-[#f9fafb] rounded-full flex items-center justify-center overflow-hidden border-2 border-dashed border-[#e5e5e5] hover:border-[#2d3a2e] transition-all shadow-sm">
                                {imageFile ? (
                                    <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center text-[#474545]">
                                        <Upload className="h-8 w-8 mx-auto mb-1 text-[#474545]" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Upload Photo</span>
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
                                <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                                    placeholder="e.g. Adv. John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Specialization</label>
                                <input
                                    type="text"
                                    name="specialization"
                                    required
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                                    placeholder="e.g. Criminal Law"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    required
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                                    placeholder="e.g. New Delhi"
                                />
                            </div>
                        </div>

                        <div className="border-t border-[#e5e5e5] pt-4">
                            <h3 className="text-xs font-black text-[#474545] mb-4 uppercase tracking-widest">Contact Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                                        placeholder="advocate@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">LinkedIn URL</label>
                                    <input
                                        type="url"
                                        name="linkedinUrl"
                                        value={formData.linkedinUrl}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Instagram URL</label>
                                    <input
                                        type="url"
                                        name="instagramUrl"
                                        value={formData.instagramUrl}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                                        placeholder="https://instagram.com/..."
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Website URL</label>
                                    <input
                                        type="url"
                                        name="websiteUrl"
                                        value={formData.websiteUrl}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                                        placeholder="https://www.advocatewebsite.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-[#e5e5e5] pt-4">
                            <h3 className="text-xs font-black text-[#474545] mb-4 uppercase tracking-widest">Podcast Details (Optional)</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Title</label>
                                    <input
                                        type="text"
                                        name="podcastTitle"
                                        value={formData.podcastTitle}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                                        placeholder="Episode Title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Duration</label>
                                    <input
                                        type="text"
                                        name="podcastDuration"
                                        value={formData.podcastDuration}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                                        placeholder="e.g. 15 min"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Podcast URL</label>
                                    <input
                                        type="url"
                                        name="podcastUrl"
                                        value={formData.podcastUrl}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                                        placeholder="https://spotify.com/..."
                                    />
                                </div>
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
                                        Adding...
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
