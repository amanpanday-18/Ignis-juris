import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const ShoppingCart = ({ isOpen, onClose }) => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Cart Sidebar */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="relative bg-white h-full w-full max-w-md shadow-2xl flex flex-col"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <ShoppingBag className="h-6 w-6 text-accent mr-2" />
                        <h2 className="text-xl font-bold text-primary">Shopping Cart</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <ShoppingBag className="h-16 w-16 mb-4" />
                            <p className="text-lg">Your cart is empty</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <AnimatePresence>
                                {cartItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg"
                                    >
                                        <img
                                            src={item.image_url || 'https://via.placeholder.com/80'}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                            <p className="text-sm text-gray-600">₹{item.price.toLocaleString()}</p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center space-x-2 mt-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm"
                                                >
                                                    -
                                                </button>
                                                <span className="text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <p className="font-bold text-gray-900">
                                                ₹{(item.price * item.quantity).toLocaleString()}
                                            </p>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="mt-2 text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="border-t border-gray-200 p-6 space-y-4">
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span>Total:</span>
                            <span className="text-2xl text-accent">₹{getCartTotal().toLocaleString()}</span>
                        </div>

                        <button
                            className="w-full py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-lg transition-colors"
                            onClick={() => alert('Checkout feature coming soon!')}
                        >
                            Proceed to Checkout
                        </button>

                        <button
                            onClick={clearCart}
                            className="w-full py-2 text-red-500 hover:text-red-700 font-medium"
                        >
                            Clear Cart
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ShoppingCart;
