import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        // If not loading and no user, show auth modal
        if (!loading && !user) {
            setShowAuthModal(true);
        } else if (user) {
            setShowAuthModal(false);
        }
    }, [user, loading]);

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // If user is authenticated, render the protected content
    if (user) {
        return <>{children}</>;
    }

    // If not authenticated, show auth modal and a message
    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <div className="text-center max-w-md">
                    <div className="mb-6">
                        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-primary mb-2">Authentication Required</h2>
                    <p className="text-gray-600 mb-6">
                        Please sign in to access this page and explore all features of Legal Remedies.
                    </p>
                    <button
                        onClick={() => setShowAuthModal(true)}
                        className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors font-medium"
                    >
                        Sign In / Sign Up
                    </button>
                </div>
            </div>
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                type="signin"
            />
        </>
    );
};

export default ProtectedRoute;
