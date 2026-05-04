import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Loader, ArrowLeft, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const MyBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchMyBlogs();
        } else {
            navigate('/blog');
        }
    }, [user, navigate]);

    const fetchMyBlogs = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .eq('author_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBlogs(data || []);
        } catch (error) {
            console.error('Error fetching my blogs:', error);
            alert('Failed to load your blogs.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'approved':
                return { icon: <CheckCircle className="h-5 w-5 text-green-500" />, color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20', text: 'Approved' };
            case 'rejected':
                return { icon: <XCircle className="h-5 w-5 text-red-500" />, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20', text: 'Rejected' };
            case 'pending':
            default:
                return { icon: <Clock className="h-5 w-5 text-yellow-500" />, color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/20', text: 'Pending Review' };
        }
    };

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
                <title>My Blogs - IGNIS JURIS</title>
            </Helmet>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate('/blog')}
                    className="flex items-center text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Blogs
                </button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">My Submissions</h1>
                        <p className="text-slate-400">Track the status of your blog submissions.</p>
                    </div>
                    <Link
                        to="/blog/new"
                        className="inline-flex items-center px-4 py-2 bg-accent text-white font-bold rounded-lg hover:bg-accent-hover transition-colors"
                    >
                        <FileText className="h-5 w-5 mr-2" />
                        Write New Blog
                    </Link>
                </div>

                {blogs.length > 0 ? (
                    <div className="space-y-6">
                        {blogs.map((blog) => {
                            const statusConfig = getStatusConfig(blog.status);
                            return (
                                <motion.div
                                    key={blog.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-slate-800/80 rounded-xl p-6 border border-white/10 shadow-lg"
                                >
                                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-1">{blog.title}</h2>
                                            <div className="text-sm text-slate-400">
                                                Submitted on: {new Date(blog.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </div>
                                        </div>
                                        <div className={`flex items-center px-4 py-2 rounded-lg border h-fit whitespace-nowrap ${statusConfig.bg}`}>
                                            {statusConfig.icon}
                                            <span className={`ml-2 font-bold ${statusConfig.color}`}>{statusConfig.text}</span>
                                        </div>
                                    </div>

                                    <div className="bg-slate-900/50 p-4 rounded-lg border border-white/5 line-clamp-3">
                                        <p className="text-slate-300 whitespace-pre-wrap text-sm">{blog.content}</p>
                                    </div>
                                    
                                    {blog.status === 'approved' && (
                                        <div className="mt-4 flex justify-end">
                                            <Link 
                                                to={`/blog/${blog.id}`}
                                                className="text-accent hover:text-accent-hover text-sm font-semibold flex items-center"
                                            >
                                                View Published Post <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
                                            </Link>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-slate-800/50 rounded-2xl p-12 text-center border border-white/5">
                        <FileText className="h-16 w-16 text-slate-500 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-bold text-white mb-2">No submissions yet</h3>
                        <p className="text-slate-400 mb-6">You haven't submitted any blogs for review.</p>
                        <Link
                            to="/blog/new"
                            className="inline-flex items-center px-6 py-3 bg-accent text-white font-bold rounded-lg hover:bg-accent-hover transition-colors"
                        >
                            Write your first blog
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBlogs;
