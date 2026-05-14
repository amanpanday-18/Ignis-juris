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
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-8 border border-[#e5e5e5]"
            >
                <div className="flex justify-between items-center p-6 border-b border-[#e5e5e5]">
                    <h2 className="text-xl font-black text-[#1c1b1b] tracking-tight">Add New Product</h2>
                    <button onClick={onClose} className="p-2 rounded-full bg-[#f9fafb] text-[#474545] hover:text-[#1c1b1b] border border-[#e5e5e5] transition-all">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div>
                        <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Product Name *</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                            placeholder="e.g., Constitution of India"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Description</label>
                        <textarea
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium resize-none"
                            placeholder="Product description..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Price (₹) *</label>
                            <input
                                type="number"
                                name="price"
                                required
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] font-medium"
                                placeholder="499"
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
                                {productCategories.filter(c => c.id !== 'all').map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Rating (0-5)</label>
                            <input
                                type="number"
                                name="rating"
                                min="0"
                                max="5"
                                step="0.1"
                                value={formData.rating}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                min="0"
                                value={formData.stock}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] font-medium"
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
                            className="h-4 w-4 text-[#2d3a2e] focus:ring-[#2d3a2e] border-[#e5e5e5] rounded bg-[#f9fafb]"
                        />
                        <label htmlFor="featured" className="ml-2 text-sm font-bold text-[#474545]">
                            Featured Product
                        </label>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Product Image</label>
                        <div className="flex items-center space-x-3">
                            <label className="flex items-center px-4 py-3 bg-[#f9fafb] text-[#1c1b1b] border border-[#e5e5e5] rounded-xl cursor-pointer hover:bg-white hover:border-[#2d3a2e] transition-all font-bold shadow-sm">
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
