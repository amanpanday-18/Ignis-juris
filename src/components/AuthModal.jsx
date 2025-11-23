import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import OTPInput from './OTPInput';

const AuthModal = ({ isOpen, onClose, type = 'signin' }) => {
    const [isSignIn, setIsSignIn] = useState(type === 'signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const { signUp, signIn, signUpWithOTP, verifyOTP } = useAuth();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignIn) {
                await signIn(email, password);
                onClose();
                // Reset form
                setEmail('');
                setPassword('');
            } else {
                // Send OTP for sign up
                await signUpWithOTP(email, name);
                setOtpSent(true);
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleOTPComplete = async (otp) => {
        setError('');
        setLoading(true);
        setOtpCode(otp);

        try {
            await verifyOTP(email, otp);
            onClose();
            // Reset form
            setEmail('');
            setName('');
            setOtpSent(false);
            setOtpCode('');
        } catch (err) {
            setError(err.message || 'Invalid OTP code');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setError('');
        setLoading(true);
        try {
            await signUpWithOTP(email, name);
            setError('');
            // Show success message briefly
            setTimeout(() => setError(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200"
                >
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-primary">
                                {isSignIn ? 'Welcome Back' : 'Create Account'}
                            </h2>
                            <p className="text-gray-500 mt-2 text-sm">
                                {isSignIn
                                    ? 'Enter your credentials to access your account'
                                    : 'Join Legal Remedies today for full access'}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {!isSignIn && otpSent ? (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                        <Mail className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Check Your Email</h3>
                                    <p className="text-sm text-gray-600 mb-1">
                                        We've sent a 6-digit code to
                                    </p>
                                    <p className="text-sm font-medium text-primary">{email}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                                        Enter Verification Code
                                    </label>
                                    <OTPInput length={6} onComplete={handleOTPComplete} />
                                </div>

                                <div className="text-center">
                                    <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        disabled={loading}
                                        className="text-sm font-medium text-accent hover:text-accent-hover disabled:opacity-50"
                                    >
                                        Resend Code
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setOtpSent(false);
                                        setError('');
                                    }}
                                    className="w-full text-sm text-gray-600 hover:text-gray-900"
                                >
                                    ← Back to sign up
                                </button>
                            </div>
                        ) : (
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                {!isSignIn && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent sm:text-sm"
                                                placeholder="Name"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent sm:text-sm"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            minLength={6}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent sm:text-sm"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {!isSignIn && (
                                        <p className="mt-1 text-xs text-gray-500">Password must be at least 6 characters</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {isSignIn ? 'Signing In...' : 'Creating Account...'}
                                        </span>
                                    ) : (
                                        <>
                                            {isSignIn ? 'Sign In' : 'Sign Up'}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                {isSignIn ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsSignIn(!isSignIn);
                                        setError('');
                                    }}
                                    className="font-medium text-accent hover:text-accent-hover"
                                >
                                    {isSignIn ? 'Sign up' : 'Sign in'}
                                </button>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AuthModal;
