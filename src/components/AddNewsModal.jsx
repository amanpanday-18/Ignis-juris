import React, { useState } from 'react';
import { X, Upload, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NewsService } from '../services/news-service';
import { newsCategories } from '../data/news-data';

const AddNewsModal = ({ isOpen, onClose, onAdd }) => {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: 'supreme-court',
        author: ''
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
            const newArticle = await NewsService.add(formData, imageFile);
            onAdd(newArticle);
            onClose();
            // Reset form
            setFormData({
                title: '',
                excerpt: '',
                content: '',
                category: 'supreme-court',
                author: ''
            });
            setImageFile(null);
        } catch (error) {
            console.error('Error adding news:', error);
            alert(`Failed to add news: ${error.message || error.error_description || JSON.stringify(error)}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-8 border border-[#e5e5e5]"
                >
                    <div className="flex justify-between items-center p-6 border-b border-[#e5e5e5]">
                        <h2 className="text-xl font-black text-[#1c1b1b] tracking-tight">Add News Article</h2>
                        <button onClick={onClose} className="p-2 rounded-full bg-[#f9fafb] text-[#474545] hover:text-[#1c1b1b] border border-[#e5e5e5] transition-all">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* Image Upload */}
                        <div className="flex justify-center mb-6">
                            <div className="relative w-full h-48 bg-[#f9fafb] rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-[#e5e5e5] hover:border-[#2d3a2e] transition-all">
                                {imageFile ? (
                                    <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center text-[#474545]">
                                        <Upload className="h-10 w-10 mx-auto mb-2 text-[#474545]" />
                                        <span className="text-xs font-black uppercase tracking-widest">Upload Header Image</span>
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

                        <div>
                            <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                                placeholder="Article Headline"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] font-medium"
                                >
                                    {newsCategories.filter(c => c.id !== 'all').map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Author</label>
                                <input
                                    type="text"
                                    name="author"
                                    required
                                    value={formData.author}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                                    placeholder="Author Name"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Excerpt (Short Summary)</label>
                            <textarea
                                name="excerpt"
                                required
                                rows="2"
                                value={formData.excerpt}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium resize-none"
                                placeholder="Brief summary for the card view..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Full Content</label>
                            <textarea
                                name="content"
                                required
                                rows="8"
                                value={formData.content}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium resize-none"
                                placeholder="Full article content..."
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
                                        Publishing...
                                    </>
                                ) : (
                                    'Publish Article'
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AddNewsModal;
