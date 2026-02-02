import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Settings, LogOut, Scale, Home, PenTool, BookOpen, History, FileText, Book } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Book, label: 'Bare Acts', path: '/bare-acts' },
        { icon: Settings, label: 'Settings', path: '/profile' },
    ];

    return (
        <aside className="w-64 bg-[#1a365d] text-white min-h-screen fixed left-0 top-0 flex flex-col z-30">
            {/* Logo Area */}
            <div className="p-6 flex items-center border-b border-blue-800">
                <Scale className="h-8 w-8 text-[#c5a572] mr-3" />
                <div>
                    <h1 className="text-xl font-bold font-serif tracking-wide">IGNIS JURIS</h1>
                    <p className="text-xs text-blue-200">ADVOCATE SUITE</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                ? 'bg-[#c5a572] text-[#1a365d] font-bold shadow-lg'
                                : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                            }`
                        }
                    >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User Profile / Logout */}
            <div className="p-4 border-t border-blue-800 space-y-2">
                <NavLink
                    to="/"
                    className="flex items-center w-full px-4 py-2 text-blue-200 hover:bg-blue-800 hover:text-white rounded-lg transition-colors"
                >
                    <Home className="h-5 w-5 mr-3" />
                    <span>Back to Home</span>
                </NavLink>
                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2 text-blue-200 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors"
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
