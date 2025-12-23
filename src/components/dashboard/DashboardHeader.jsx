import React from 'react';
import { Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardHeader = () => {
    const { user } = useAuth();

    return (
        <header className="h-20 bg-slate-900 border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-20">
            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search cases, documents, or clients..."
                        className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-white placeholder-slate-500"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
                {/* Right Actions Removed as per request */}
            </div>
        </header>
    );
};

export default DashboardHeader;
