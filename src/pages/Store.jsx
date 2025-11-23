import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart as CartIcon, Star, Plus, Trash2, Loader } from 'lucide-react';
import { ProductService } from '../services/product-service';
import { productCategories } from '../data/products-data';
import { useAdmin } from '../hooks/useAdmin';
import { useCart } from '../context/CartContext';
import AddProductModal from '../components/AddProductModal';
import ProductDetailModal from '../components/ProductDetailModal';
import ShoppingCart from '../components/ShoppingCart';

const Store = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { isAdmin } = useAdmin();
    const { getCartCount, addToCart } = useCart();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await ProductService.getAll();
            setProducts(data);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = (newProduct) => {
        setProducts([newProduct, ...products]);
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await ProductService.delete(id);
                setProducts(products.filter(p => p.id !== id));
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Failed to delete product.');
            }
        }
    };

    const handleQuickAdd = (product, e) => {
        e.stopPropagation();
        addToCart(product, 1);
        alert(`Added ${product.name} to cart!`);
    };

    // Filter products
    const getFilteredProducts = () => {
        if (selectedCategory === 'all') return products;
        return products.filter(p => p.category === selectedCategory);
    };

    const filteredProducts = getFilteredProducts();
    const cartCount = getCartCount();

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl font-bold text-primary mb-4">Legal Store</h1>
                        <p className="text-gray-600">Premium resources for legal professionals</p>
                    </motion.div>

                    <div className="flex items-center space-x-4">
                        {/* Cart Button */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-3 bg-accent text-white rounded-full hover:bg-accent-hover transition-colors shadow-lg"
                        >
                            <CartIcon className="h-6 w-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Admin Add Button */}
                        {isAdmin && (
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors shadow-lg"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Add Product
                            </button>
                        )}
                    </div>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {productCategories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === category.id
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader className="animate-spin h-12 w-12 text-accent" />
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow border border-gray-100 group cursor-pointer relative"
                                onClick={() => setSelectedProduct(product)}
                            >
                                {/* Admin Delete Button */}
                                {isAdmin && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteProduct(product.id);
                                        }}
                                        className="absolute top-4 left-4 z-10 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        title="Delete Product"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}

                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={product.image_url || 'https://via.placeholder.com/400'}
                                        alt={product.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full flex items-center shadow-sm">
                                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                        <span className="ml-1 text-sm font-bold text-gray-700">{product.rating}</span>
                                    </div>
                                    {product.featured && (
                                        <div className="absolute bottom-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-xs font-bold">
                                            Featured
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <div className="text-xs font-bold text-accent uppercase tracking-wider mb-2">
                                        {productCategories.find(c => c.id === product.category)?.name || product.category}
                                    </div>
                                    <h3 className="text-lg font-bold text-primary mb-2 line-clamp-2">{product.name}</h3>
                                    {product.description && (
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                                    )}
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                                        <button
                                            onClick={(e) => handleQuickAdd(product, e)}
                                            className="p-2 bg-primary text-white rounded-full hover:bg-accent transition-colors"
                                            disabled={product.stock === 0}
                                        >
                                            <CartIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                    {product.stock === 0 && (
                                        <p className="text-red-500 text-sm mt-2">Out of Stock</p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No products found in this category.</p>
                    </div>
                )}
            </div>

            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddProduct}
            />

            <ProductDetailModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />

            <AnimatePresence>
                {isCartOpen && (
                    <ShoppingCart
                        isOpen={isCartOpen}
                        onClose={() => setIsCartOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Store;
