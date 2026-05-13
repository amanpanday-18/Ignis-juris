import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Loader, PlusCircle, ShieldAlert, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../hooks/useAdmin';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../components/PageHeader';
import bgBlog from '../assets/more_legal_articles.png';

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
            <div className="min-h-[70vh] flex items-center justify-center bg-[#f3f3f3]">
                <Loader className="animate-spin h-10 w-10 text-[#1c1b1b]" />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen" style={{ background: '#f0ede8' }}>
            <Helmet>
                <title>Blog — IGNIS JURIS</title>
            </Helmet>

            <PageHeader
                label="/BLOG"
                title="Legal Insights & Blogs"
                description="Read the latest articles, essays, and research from our community of legal minds."
                bgImage={bgBlog}
                action={
                    <div className="flex flex-wrap gap-3">
                        {isAdmin && (
                            <Link to="/admin/blogs" className="inline-flex items-center px-4 py-2 border border-white/40 text-white text-sm font-bold rounded-full hover:bg-white hover:text-[#3d4f38] transition-all">
                                <ShieldAlert className="h-4 w-4 mr-2" />Review Pending
                            </Link>
                        )}
                        {user && (
                            <Link to="/my-blogs" className="inline-flex items-center px-4 py-2 border border-white/40 text-white text-sm font-bold rounded-full hover:bg-white hover:text-[#3d4f38] transition-all">
                                <User className="h-4 w-4 mr-2" />My Submissions
                            </Link>
                        )}
                        <Link to="/blog/new" className="inline-flex items-center px-4 py-2 bg-white text-[#3d4f38] text-sm font-bold rounded-full hover:bg-white/90 transition-all">
                            <PlusCircle className="h-4 w-4 mr-2" />Submit a Blog
                        </Link>
                    </div>
                }
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Blog Grid */}

                {blogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogs.map((blog, idx) => (
                            <motion.div
                                key={blog.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-2xl overflow-hidden border border-[#e5e5e5] shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col"
                            >
                                <div className="p-6 flex-grow">
                                    <h2 className="text-xl font-bold text-[#1c1b1b] mb-3 line-clamp-2">{blog.title}</h2>
                                    <div className="flex items-center text-sm text-[#474545] mb-4 gap-1">
                                        <span className="font-semibold text-[#1c1b1b]">{blog.author_name}</span>
                                        <span className="mx-1.5 text-[#888]">•</span>
                                        <span className="text-[#888]">{new Date(blog.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-[#474545] text-sm line-clamp-4 whitespace-pre-wrap leading-relaxed">
                                        {blog.content}
                                    </p>
                                </div>
                                <div className="px-6 py-4 border-t border-[#e5e5e5]">
                                    <Link
                                        to={`/blog/${blog.id}`}
                                        className="inline-flex items-center gap-2 text-sm font-bold text-[#1c1b1b] hover:text-[#474545] transition-colors group"
                                    >
                                        Read full post <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-[#e5e5e5]">
                        <h3 className="text-2xl font-bold text-[#1c1b1b] mb-2">No blogs yet</h3>
                        <p className="text-[#474545] mb-6">Be the first to share your legal insights with our community.</p>
                        <Link
                            to="/blog/new"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1c1b1b] text-white font-bold rounded-full hover:bg-[#474545] transition-all duration-200"
                        >
                            <PlusCircle className="h-5 w-5" />
                            Write a Blog
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogList;
