import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';

const Store = () => {
    const products = [
        {
            id: 1,
            name: 'Constitution of India (Hardcover)',
            price: '₹499',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            category: 'Books',
        },
        {
            id: 2,
            name: 'Legal Drafting Kit',
            price: '₹1,299',
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            category: 'Software',
        },
        {
            id: 3,
            name: 'Advocate Diary 2025',
            price: '₹899',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            category: 'Stationery',
        },
        {
            id: 4,
            name: 'Law Firm Management Course',
            price: '₹2,499',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            category: 'Courses',
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h1 className="text-4xl font-bold text-primary mb-4">Legal Store</h1>
                <p className="text-gray-600">Premium resources for legal professionals.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow border border-gray-100 group"
                    >
                        <div className="relative h-64 overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full flex items-center shadow-sm">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="ml-1 text-sm font-bold text-gray-700">{product.rating}</span>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="text-xs font-bold text-accent uppercase tracking-wider mb-2">{product.category}</div>
                            <h3 className="text-lg font-bold text-primary mb-2">{product.name}</h3>
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-xl font-bold text-gray-900">{product.price}</span>
                                <button className="p-2 bg-primary text-white rounded-full hover:bg-accent transition-colors">
                                    <ShoppingCart className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Store;
