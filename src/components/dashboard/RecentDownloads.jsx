import React, { useEffect, useState } from 'react';
import { ArrowRight, FileText, Download, BookOpen, X } from 'lucide-react';
import { ActivityService } from '../../services/activity-service';
import { useNavigate } from 'react-router-dom';

const RecentDownloads = () => {
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadActivity();
    }, []);

    const loadActivity = async () => {
        try {
            const data = await ActivityService.getRecentActivity();
            setRecentActivity(data || []);
        } catch (error) {
            console.error("Failed to load activity:", error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'draft': return FileText;
            case 'bare act': return BookOpen;
            case 'research': return BookOpen;
            default: return Download;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
    };

    return (
        <div className="bg-slate-800 rounded-xl shadow-sm border border-white/5 p-6 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                <button className="text-sm text-accent font-semibold hover:underline flex items-center">
                    View History <ArrowRight className="h-4 w-4 ml-1" />
                </button>
            </div>

            <div className="space-y-3">
                {loading ? (
                    <div className="text-center py-4 text-slate-500">Loading history...</div>
                ) : recentActivity.length === 0 ? (
                    <div className="text-center py-4 text-slate-500">No recent activity</div>
                ) : (
                    recentActivity.map((item) => {
                        const Icon = getIcon(item.action_type);
                        return (
                            <div
                                key={item.id}
                                onClick={() => {
                                    if (item.resource_id) {
                                        navigate(`/documents/${item.resource_id}`);
                                    } else if (item.external_link) {
                                        window.open(item.external_link, '_blank');
                                    }
                                }}
                                className={`p-3 rounded-lg hover:bg-white/5 transition-colors border-l-4 border-accent bg-black/20 shadow-sm flex items-center group relative ${item.resource_id || item.external_link ? 'cursor-pointer hover:shadow-md' : ''}`}
                            >
                                {/* Delete Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm('Clear this activity?')) {
                                            ActivityService.deleteActivity(item.id).then(() => {
                                                loadActivity();
                                            });
                                        }
                                    }}
                                    className="absolute top-2 right-2 p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-full transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                                    title="Clear activity"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                                <div className="mr-3 p-2 bg-blue-500/10 text-blue-400 rounded-full">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1 pr-12">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-slate-200">{item.item_title}</h4>
                                        <span className="text-xs font-mono text-slate-500">{formatDate(item.created_at)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-xs bg-white/10 text-slate-400 px-2 py-1 rounded-full font-medium">
                                            {item.action_type}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div >
    );
};

export default RecentDownloads;
