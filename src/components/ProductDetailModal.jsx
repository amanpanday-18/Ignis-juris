import React, { useState } from 'react';
import { X, ShoppingCart, Star, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { productCategories } from '../data/products-data';

const ProductDetailModal = ({ product, isOpen, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    if (!isOpen || !product) return null;

    const category = productCategories.find(c => c.id === product.category);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        alert(`Added ${quantity} ${product.name} to cart!`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden my-8"
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-primary">Product Details</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Product Image */}
                        <div className="relative">
                            <img
                                src={product.image_url || 'https://via.placeholder.com/400'}
                                alt={product.name}
                                className="w-full h-96 object-cover rounded-lg"
                            />
                            {product.featured && (
                                <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-bold">
                                    Featured
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div>
                            <div className="mb-4">
                                <span className="text-xs font-bold text-accent uppercase tracking-wider">
                                    {category?.name || product.category}
                                </span>
                            </div>

                            <h3 className="text-3xl font-bold text-primary mb-4">{product.name}</h3>

                            <div className="flex items-center mb-4">
                                <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                                    <span className="ml-1 font-bold text-gray-700">{product.rating}</span>
                                </div>
                                <span className="ml-4 text-gray-600">
                                    <Package className="inline h-4 w-4 mr-1" />
                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                </span>
                            </div>

                            <div className="text-4xl font-bold text-gray-900 mb-6">
                                ₹{product.price.toLocaleString()}
                            </div>

                            {product.description && (
                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                                </div>
                            )}

                            {/* Quantity Selector */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        max={product.stock}
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
                                    />
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="w-full flex items-center justify-center py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ShoppingCart className="h-5 w-5 mr-2" />
                                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProductDetailModal;
