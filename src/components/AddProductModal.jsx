import React, { useState } from 'react';
import { X, Upload, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductService } from '../services/product-service';
import { productCategories } from '../data/products-data';

const AddProductModal = ({ isOpen, onClose, onAdd }) => {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'books',
        rating: '0',
        stock: '0',
        featured: false
    });

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newProduct = await ProductService.add(formData, imageFile);
            onAdd(newProduct);
            onClose();
            // Reset form
            setFormData({
                name: '',
                description: '',
                price: '',
                category: 'books',
                rating: '0',
                stock: '0',
                featured: false
            });
            setImageFile(null);
        } catch (error) {
            console.error('Error adding product:', error);
            alert(`Failed to add product: ${error.message || JSON.stringify(error)}`);
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
                    <h2 className="text-xl font-bold text-white">Add New Product</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Product Name *</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-500"
                            placeholder="e.g., Constitution of India"
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
                            placeholder="Product description..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Price (₹) *</label>
                            <input
                                type="number"
                                name="price"
                                required
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-500"
                                placeholder="499"
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
                                {productCategories.filter(c => c.id !== 'all').map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Rating (0-5)</label>
                            <input
                                type="number"
                                name="rating"
                                min="0"
                                max="5"
                                step="0.1"
                                value={formData.rating}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                min="0"
                                value={formData.stock}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="featured"
                            id="featured"
                            checked={formData.featured}
                            onChange={handleChange}
                            className="h-4 w-4 text-accent focus:ring-accent border-gray-600 rounded bg-slate-800"
                        />
                        <label htmlFor="featured" className="ml-2 text-sm text-gray-300">
                            Featured Product
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Product Image</label>
                        <div className="flex items-center space-x-3">
                            <label className="flex items-center px-4 py-2 bg-slate-800 text-gray-300 border border-white/10 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors">
                                <Upload className="h-4 w-4 mr-2" />
                                {imageFile ? imageFile.name : 'Choose Image'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                            {imageFile && (
                                <button
                                    type="button"
                                    onClick={() => setImageFile(null)}
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
                                    Adding Product...
                                </>
                            ) : (
                                'Add Product'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddProductModal;
