import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader, ArrowLeft, Calendar, User } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const { data, error } = await supabase
                    .from('blogs')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setBlog(data);
            } catch (error) {
                console.error('Error fetching blog:', error);
                alert('Blog not found or an error occurred.');
                navigate('/blog');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBlog();
        }
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-background">
                <Loader className="animate-spin h-12 w-12 text-accent" />
            </div>
        );
    }

    if (!blog) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen bg-background py-12">
            <Helmet>
                <title>{blog.title} - IGNIS JURIS Blog</title>
            </Helmet>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link
                    to="/blog"
                    className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Blogs
                </Link>

                <article className="bg-slate-800/50 rounded-2xl p-8 md:p-12 border border-white/5 shadow-xl">
                    <header className="mb-8 pb-8 border-b border-white/5">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            {blog.title}
                        </h1>
                        <div className="flex flex-wrap items-center text-slate-400 gap-6">
                            <div className="flex items-center">
                                <User className="h-5 w-5 mr-2 text-accent" />
                                <span className="font-medium text-slate-300">{blog.author_name}</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="h-5 w-5 mr-2 text-accent" />
                                <span>{new Date(blog.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </div>
                    </header>

                    <div className="prose prose-invert prose-lg max-w-none">
                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                            {blog.content}
                        </p>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default BlogDetail;
