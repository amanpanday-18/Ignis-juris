import React from 'react';
import { Search, FileText, Calendar, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
    const navigate = useNavigate();

    const actions = [
        { icon: Calendar, label: 'Schedule', path: '/diary', description: 'Manage your case schedule' },
        { icon: BookOpen, label: 'Browse Bare Acts', path: '/bare-acts', description: 'Access comprehensive legal texts' },
    ];

    return (
        <div className="bg-slate-800 rounded-xl shadow-sm border border-white/5 p-6 h-full">
            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        onClick={() => navigate(action.path)}
                        className="flex items-start p-4 rounded-lg border border-white/5 hover:border-accent/50 bg-black/20 hover:bg-black/40 transition-all group text-left"
                    >
                        <div className="p-2 bg-slate-700/50 rounded-md shadow-sm text-accent mr-3 group-hover:scale-110 transition-transform">
                            <action.icon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-200">{action.label}</p>
                            <p className="text-xs text-slate-500 mt-1">{action.description}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;
