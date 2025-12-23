import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Instagram, Mail } from 'lucide-react';
import logoFooter from '../assets/logo-footer.jpg';

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <footer className="bg-slate-900 text-gray-400 py-8 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-white text-lg font-bold mb-4">The Legal Remedies</h3>
                            <p className="text-sm">
                                Your one-stop solution for all legal needs. From news to drafting, we have it all.
                            </p>
                        </div>
                        <div className="flex items-center justify-center">
                            <img
                                src={logoFooter}
                                alt="The Legal Remedies Logo"
                                className="w-32 h-32 rounded-full object-cover shadow-lg"
                            />
                        </div>
                        <div>
                            <h3 className="text-white text-lg font-bold mb-4">Connect</h3>
                            <div className="flex space-x-4">
                                <a
                                    href="https://www.instagram.com/the_legalremedies.in?igsh=OWZzYTZ1ZGlleW5x"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors text-white"
                                    title="Instagram"
                                >
                                    <Instagram className="h-5 w-5" />
                                </a>
                                <a
                                    href="https://mail.google.com/mail/?view=cm&fs=1&to=thelegalremedies@gmail.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-white"
                                    title="Email Us via Gmail"
                                >
                                    <Mail className="h-5 w-5" />
                                </a>
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
