import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, FileText, Scale, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Profile = () => {
    const { user, loading } = useAuth();

    if (loading) return null;
    if (!user) return <Navigate to="/" />;

    const recentActivity = [
        { id: 1, type: 'Draft', title: 'Legal Notice - Recovery', date: '2 hours ago', icon: FileText },
        { id: 2, type: 'Judgement', title: 'Kesavananda Bharati v. State of Kerala', date: '1 day ago', icon: Scale },
        { id: 3, type: 'Draft', title: 'Rental Agreement', date: '3 days ago', icon: FileText },
    ];

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
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="h-32 w-32 rounded-full border-4 border-white shadow-md bg-white"
                                />
                            </div>
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-primary">{user.name}</h2>
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
                                    <span className="font-semibold text-primary">Nov 2025</span>
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
                            {recentActivity.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-white rounded-full shadow-sm">
                                            <item.icon className="h-5 w-5 text-accent" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-primary">{item.title}</h4>
                                            <p className="text-xs text-gray-500">{item.type}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-400">{item.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-primary text-white rounded-xl p-6 shadow-lg">
                            <h3 className="text-lg font-bold mb-2">Saved Drafts</h3>
                            <p className="text-3xl font-bold text-accent">12</p>
                            <p className="text-sm text-gray-400 mt-1">Access your legal documents</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                            <h3 className="text-lg font-bold text-primary mb-2">Pending Consultations</h3>
                            <p className="text-3xl font-bold text-accent">0</p>
                            <p className="text-sm text-gray-500 mt-1">No upcoming appointments</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
