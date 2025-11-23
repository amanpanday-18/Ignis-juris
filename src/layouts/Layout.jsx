import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <footer className="bg-primary text-gray-400 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-white text-lg font-bold mb-4">The Legal Remedies</h3>
                            <p className="text-sm">
                                Your one-stop solution for all legal needs. From news to drafting, we have it all.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-accent">About Us</a></li>
                                <li><a href="#" className="hover:text-accent">Contact</a></li>
                                <li><a href="#" className="hover:text-accent">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-accent">Terms of Service</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white text-lg font-bold mb-4">Connect</h3>
                            <div className="flex space-x-4">
                                {/* Social Icons placeholders */}
                                <div className="w-8 h-8 bg-gray-700 rounded-full hover:bg-accent transition-colors"></div>
                                <div className="w-8 h-8 bg-gray-700 rounded-full hover:bg-accent transition-colors"></div>
                                <div className="w-8 h-8 bg-gray-700 rounded-full hover:bg-accent transition-colors"></div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
                        &copy; {new Date().getFullYear()} The Legal Remedies. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
