import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, FileText, Scale, Clock, Calendar, Briefcase, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { DiaryService } from '../services/diary-service';

const Profile = () => {
    const { user, loading } = useAuth();
    const [events, setEvents] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        if (user) {
            fetchDiaryEvents();
        }
    }, [user]);

    const fetchDiaryEvents = async () => {
        try {
            const data = await DiaryService.getMyEvents();
            // Sort by date descending for recent activity
            const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setEvents(sortedData);
        } catch (error) {
            console.error("Error fetching diary events:", error);
        } finally {
            setIsLoadingData(false);
        }
    };

    if (loading) return null;
    if (!user) return <Navigate to="/" />;

    const displayName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
    const userInitial = displayName[0]?.toUpperCase() || 'U';

    // Calculate Stats
    const now = new Date();
    const pendingConsultations = events.filter(e => new Date(e.date) >= now).length;

    // Helper to get icon based on event type
    const getEventIcon = (type) => {
        switch (type) {
            case 'hearing': return Scale;
            case 'meeting': return Briefcase;
            case 'deadline': return AlertCircle;
            default: return Calendar;
        }
    };

    const getEventColor = (type) => {
        switch (type) {
            case 'hearing': return 'text-red-500 bg-red-50';
            case 'meeting': return 'text-blue-500 bg-blue-50';
            case 'deadline': return 'text-yellow-500 bg-yellow-50';
            default: return 'text-green-500 bg-green-50';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                {/* User Info Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="h-32 bg-primary"></div>
                        <div className="px-6 pb-6">
                            <div className="relative flex justify-center -mt-16 mb-4">
                                <div className="h-32 w-32 rounded-full border-4 border-white shadow-md bg-accent flex items-center justify-center text-white text-4xl font-bold">
                                    {userInitial}
                                </div>
                            </div>
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-primary">{displayName}</h2>
                                <p className="text-gray-500 flex items-center justify-center mt-1">
                                    <Mail className="h-4 w-4 mr-1" /> {user.email}
                                </p>
                            </div>
                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600">Account Type</span>
                                    <span className="font-semibold text-accent">Premium</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600">Member Since</span>
                                    <span className="font-semibold text-primary">
                                        {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard / Activity */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                        <h3 className="text-xl font-bold text-primary mb-6 flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-accent" />
                            Recent Activity
                        </h3>
                        <div className="space-y-4">
                            {isLoadingData ? (
                                <div className="text-center py-4 text-gray-500">Loading activity...</div>
                            ) : events.length > 0 ? (
                                events.slice(0, 5).map((item) => {
                                    const Icon = getEventIcon(item.event_type);
                                    const colorClass = getEventColor(item.event_type);
                                    return (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className={`p-2 rounded-full shadow-sm ${colorClass}`}>
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-primary">{item.title}</h4>
                                                    <p className="text-xs text-gray-500 capitalize">{item.event_type}</p>
                                                </div>
                                            </div>
                                            <span className="text-sm text-gray-400">
                                                {new Date(item.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No recent activity found.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-primary text-white rounded-xl p-6 shadow-lg">
                            <h3 className="text-lg font-bold mb-2">Saved Drafts</h3>
                            <p className="text-3xl font-bold text-accent">0</p>
                            <p className="text-sm text-gray-400 mt-1">Access your legal documents</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                            <h3 className="text-lg font-bold text-primary mb-2">Upcoming Events</h3>
                            <p className="text-3xl font-bold text-accent">{pendingConsultations}</p>
                            <p className="text-sm text-gray-500 mt-1">Hearings & Meetings</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
