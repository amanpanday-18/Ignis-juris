import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart as CartIcon, Star, Plus, Trash2, Loader, BookOpen, Download, Search } from 'lucide-react';
import { ProductService } from '../services/product-service';
import { productCategories } from '../data/products-data';
import { useAdmin } from '../hooks/useAdmin';
import { useCart } from '../context/CartContext';
import AddProductModal from '../components/AddProductModal';
import ProductDetailModal from '../components/ProductDetailModal';
import ShoppingCart from '../components/ShoppingCart';
import { Helmet } from 'react-helmet-async';

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

    const getFilteredProducts = () => {
        if (selectedCategory === 'all') return products;
        return products.filter(p => p.category === selectedCategory);
    };

    const filteredProducts = getFilteredProducts();
    const cartCount = getCartCount();

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">
            <Helmet>
                <title>Legal Resources Store - Legal Remedies</title>
                <meta name="description" content="Premium legal templates, e-books, and study materials." />
            </Helmet>

            {/* Header Section */}
            <div className="bg-gradient-to-r from-indigo-900 to-black text-white pt-12 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-slate-900 to-black opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row justify-between items-end">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center space-x-2 mb-2 text-accent font-medium uppercase tracking-wider text-sm">
                            <BookOpen className="h-4 w-4" />
                            <span>Digital Marketplace</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white">Legal Resources Store</h1>
                        <p className="text-lg text-slate-300 max-w-xl">
                            Expertly curated e-books, templates, and study guides to elevate your legal practice and knowledge.
                        </p>
                    </motion.div>

                    {/* Cart Button */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white/20 transition-all shadow-xl mt-6 md:mt-0"
                    >
                        <CartIcon className="h-6 w-6" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md animate-bounce">
                                {cartCount}
                            </span>
                        )}
                    </motion.button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-20">
                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all shadow-lg ${selectedCategory === 'all'
                            ? 'bg-accent text-white transform -translate-y-1'
                            : 'bg-slate-800 text-slate-400 border border-white/5 hover:bg-white/10'
                            }`}
                    >
                        All Resources
                    </button>
                    {productCategories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-6 py-3 rounded-xl font-medium transition-all shadow-lg ${selectedCategory === category.id
                                ? 'bg-accent text-white transform -translate-y-1'
                                : 'bg-slate-800 text-slate-400 border border-white/5 hover:bg-white/10'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Admin Add Button */}
                {isAdmin && (
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add Product
                        </button>
                    </div>
                )}

                {/* Products Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
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
                                className="bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-white/5 group cursor-pointer relative flex flex-col h-full hover:shadow-2xl hover:border-accent/30 transition-all duration-300"
                                onClick={() => setSelectedProduct(product)}
                            >
                                {/* Admin Delete Button */}
                                {isAdmin && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteProduct(product.id);
                                        }}
                                        className="absolute top-4 left-4 z-20 p-2 bg-red-500/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                                        title="Delete Product"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}

                                <div className="relative h-56 overflow-hidden bg-black/20">
                                    <img
                                        src={product.image_url || 'https://via.placeholder.com/400'}
                                        alt={product.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80"></div>

                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center shadow-sm border border-white/10">
                                        <Star className="h-3.5 w-3.5 text-yellow-500 fill-current" />
                                        <span className="ml-1 text-xs font-bold text-white">{product.rating}</span>
                                    </div>

                                    {product.featured && (
                                        <div className="absolute bottom-4 left-4 bg-accent/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                            Featured
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="text-xs font-bold text-accent uppercase tracking-wider mb-2">
                                        {productCategories.find(c => c.id === product.category)?.name || product.category}
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                        {product.name}
                                    </h3>
                                    {product.description && (
                                        <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                                            {product.description}
                                        </p>
                                    )}

                                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-500 font-medium">Price</span>
                                            <span className="text-xl font-bold text-white">₹{product.price.toLocaleString()}</span>
                                        </div>
                                        <button
                                            onClick={(e) => handleQuickAdd(product, e)}
                                            disabled={product.stock === 0}
                                            className={`p-3 rounded-xl transition-all shadow-md flex items-center justify-center ${product.stock === 0
                                                ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                                                : 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:-translate-y-1'
                                                }`}
                                        >
                                            <CartIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                    {product.stock === 0 && (
                                        <div className="mt-2 text-right">
                                            <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20">Out of Stock</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-slate-800 rounded-2xl border border-dashed border-white/10">
                        <div className="bg-white/5 p-6 rounded-full mb-4">
                            <Search className="h-10 w-10 text-slate-500" />
                        </div>
                        <p className="text-slate-400 text-lg font-medium">No products found in this category.</p>
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className="mt-4 text-accent hover:underline font-medium"
                        >
                            View all resources
                        </button>
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
