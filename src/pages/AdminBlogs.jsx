import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Loader, CheckCircle, XCircle, ArrowLeft, Clock, Trash2, ShieldCheck } from 'lucide-react';
import { useAdmin } from '../hooks/useAdmin';
import { Helmet } from 'react-helmet-async';

const AdminBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const navigate = useNavigate();
    const { isAdmin } = useAdmin();

    useEffect(() => {
        if (!isAdmin) {
            navigate('/blog', { replace: true });
            return;
        }
        fetchAllBlogs();
    }, [isAdmin, navigate]);

    const fetchAllBlogs = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBlogs(data || []);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            alert('Failed to load blogs.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            setActionLoading(id);
            const { error } = await supabase
                .from('blogs')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            
            setBlogs(current => current.map(blog => blog.id === id ? { ...blog, status: newStatus } : blog));
        } catch (error) {
            console.error(`Error updating blog to ${newStatus}:`, error);
            alert(`Failed to ${newStatus === 'approved' ? 'accept' : 'reject'} blog.`);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to completely delete this blog? This cannot be undone.')) return;
        
        try {
            setActionLoading(id);
            const { error } = await supabase
                .from('blogs')
                .delete()
                .eq('id', id);

            if (error) throw error;
            
            setBlogs(current => current.filter(blog => blog.id !== id));
        } catch (error) {
            console.error('Error deleting blog:', error);
            alert('Failed to delete blog.');
        } finally {
            setActionLoading(null);
        }
    };

    const pendingBlogs = blogs.filter(b => b.status === 'pending');
    const approvedBlogs = blogs.filter(b => b.status === 'approved');

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-background">
                <Loader className="animate-spin h-12 w-12 text-accent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-12">
            <Helmet>
                <title>Admin - Review Blogs - IGNIS JURIS</title>
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate('/blog')}
                    className="flex items-center text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Blogs
                </button>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Manage Blogs</h1>
                        <p className="text-slate-400">Review pending submissions or manage approved blogs.</p>
                    </div>
                </div>

                <div className="space-y-12">
                    {/* Pending Section */}
                    <div>
                        <div className="flex items-center mb-6">
                            <Clock className="h-6 w-6 text-yellow-500 mr-3" />
                            <h2 className="text-2xl font-bold text-white">Pending Review ({pendingBlogs.length})</h2>
                        </div>
                        {pendingBlogs.length > 0 ? (
                            <div className="space-y-6">
                                {pendingBlogs.map((blog) => (
                                    <motion.div
                                        key={blog.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-slate-800/80 rounded-xl p-6 border border-yellow-500/20 shadow-lg flex flex-col md:flex-row gap-6"
                                    >
                                        <div className="flex-grow">
                                            <h2 className="text-2xl font-bold text-white mb-2">{blog.title}</h2>
                                            <div className="flex items-center text-sm text-slate-400 mb-4">
                                                <span className="font-medium text-slate-300">By: {blog.author_name}</span>
                                                <span className="mx-2">•</span>
                                                <span>Submitted: {new Date(blog.created_at).toLocaleString()}</span>
                                            </div>
                                            <div className="bg-slate-900/50 p-4 rounded-lg border border-white/5 max-h-60 overflow-y-auto">
                                                <p className="text-slate-300 whitespace-pre-wrap">{blog.content}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap md:flex-col justify-end gap-3 min-w-[140px]">
                                            <button
                                                onClick={() => handleUpdateStatus(blog.id, 'approved')}
                                                disabled={actionLoading === blog.id}
                                                className="flex-1 flex justify-center items-center px-4 py-3 bg-green-600/20 text-green-500 hover:bg-green-600 hover:text-white rounded-lg transition-colors border border-green-500/30 font-bold disabled:opacity-50"
                                            >
                                                {actionLoading === blog.id ? (
                                                    <Loader className="animate-spin h-5 w-5" />
                                                ) : (
                                                    <>
                                                        <CheckCircle className="h-5 w-5 mr-2" />
                                                        Accept
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(blog.id, 'rejected')}
                                                disabled={actionLoading === blog.id}
                                                className="flex-1 flex justify-center items-center px-4 py-3 bg-orange-600/20 text-orange-500 hover:bg-orange-600 hover:text-white rounded-lg transition-colors border border-orange-500/30 font-bold disabled:opacity-50"
                                            >
                                                {actionLoading === blog.id ? (
                                                    <Loader className="animate-spin h-5 w-5" />
                                                ) : (
                                                    <>
                                                        <XCircle className="h-5 w-5 mr-2" />
                                                        Reject
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(blog.id)}
                                                disabled={actionLoading === blog.id}
                                                className="flex-1 flex justify-center items-center px-4 py-3 bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-colors border border-red-500/30 font-bold disabled:opacity-50"
                                            >
                                                {actionLoading === blog.id ? (
                                                    <Loader className="animate-spin h-5 w-5" />
                                                ) : (
                                                    <>
                                                        <Trash2 className="h-5 w-5 mr-2" />
                                                        Delete
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-slate-800/50 rounded-2xl p-8 text-center border border-white/5">
                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4 opacity-50" />
                                <h3 className="text-xl font-bold text-white mb-2">All caught up!</h3>
                                <p className="text-slate-400">There are no pending blogs to review right now.</p>
                            </div>
                        )}
                    </div>

                    {/* Approved Section */}
                    <div>
                        <div className="flex items-center mb-6">
                            <ShieldCheck className="h-6 w-6 text-green-500 mr-3" />
                            <h2 className="text-2xl font-bold text-white">Approved Blogs ({approvedBlogs.length})</h2>
                        </div>
                        {approvedBlogs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {approvedBlogs.map((blog) => (
                                    <div key={blog.id} className="bg-slate-800/50 rounded-xl p-6 border border-white/5 flex flex-col">
                                        <div className="flex-grow">
                                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{blog.title}</h3>
                                            <div className="text-sm text-slate-400 mb-4">By: {blog.author_name}</div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-end gap-2">
                                            <button
                                                onClick={() => handleUpdateStatus(blog.id, 'pending')}
                                                disabled={actionLoading === blog.id}
                                                className="px-3 py-2 bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500 hover:text-white rounded transition-colors text-sm font-bold"
                                            >
                                                Move to Pending
                                            </button>
                                            <button
                                                onClick={() => handleDelete(blog.id)}
                                                disabled={actionLoading === blog.id}
                                                className="px-3 py-2 bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white rounded transition-colors text-sm font-bold flex items-center"
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-slate-800/50 rounded-2xl p-8 text-center border border-white/5">
                                <p className="text-slate-400">No approved blogs yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBlogs;
