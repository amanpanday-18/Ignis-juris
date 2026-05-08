import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Loader, PlusCircle, ShieldAlert, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../hooks/useAdmin';
import { Helmet } from 'react-helmet-async';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { isAdmin } = useAdmin();

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .eq('status', 'approved')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBlogs(data || []);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
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
        <div className="w-full py-12">
            <Helmet>
                <title>Blog - IGNIS JURIS</title>
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Legal <span className="text-accent">Insights</span> & Blogs
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl">
                            Read the latest articles, essays, and research from our community of legal minds.
                        </p>
                    </div>
                    
                    <div className="mt-6 md:mt-0 flex gap-4">
                        {isAdmin && (
                            <Link
                                to="/admin/blogs"
                                className="inline-flex items-center px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700"
                                title="Admin Review"
                            >
                                <ShieldAlert className="h-5 w-5 mr-2" />
                                Review Pending
                            </Link>
                        )}
                        {user && (
                            <Link
                                to="/my-blogs"
                                className="inline-flex items-center px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700"
                            >
                                <User className="h-5 w-5 mr-2" />
                                My Submissions
                            </Link>
                        )}
                        <Link
                            to="/blog/new"
                            className="inline-flex items-center px-6 py-3 bg-accent text-white font-bold rounded-lg hover:bg-accent-hover transition-colors"
                        >
                            <PlusCircle className="h-5 w-5 mr-2" />
                            Submit a Blog
                        </Link>
                    </div>
                </div>

                {blogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog) => (
                            <motion.div
                                key={blog.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-slate-800/50 rounded-xl overflow-hidden border border-white/5 hover:border-accent/50 transition-colors flex flex-col"
                            >
                                <div className="p-6 flex-grow">
                                    <h2 className="text-2xl font-bold text-white mb-3 line-clamp-2">{blog.title}</h2>
                                    <div className="flex items-center text-sm text-slate-400 mb-4">
                                        <span className="font-medium text-slate-300">{blog.author_name}</span>
                                        <span className="mx-2">•</span>
                                        <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-slate-300 line-clamp-4 whitespace-pre-wrap">
                                        {blog.content}
                                    </p>
                                </div>
                                <div className="px-6 py-4 border-t border-white/5 bg-slate-800/30">
                                    <Link to={`/blog/${blog.id}`} className="text-accent text-sm font-semibold hover:text-accent-hover transition-colors inline-block">
                                        Read full post
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-white/5">
                        <h3 className="text-2xl font-bold text-white mb-2">No blogs yet</h3>
                        <p className="text-slate-400 mb-6">Be the first to share your legal insights with our community.</p>
                        <Link
                            to="/blog/new"
                            className="inline-flex items-center px-6 py-3 bg-accent text-white font-bold rounded-lg hover:bg-accent-hover transition-colors"
                        >
                            <PlusCircle className="h-5 w-5 mr-2" />
                            Write a Blog
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogList;
