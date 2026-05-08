import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Loader, ArrowLeft, Send } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const CreateBlog = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!title.trim() || !content.trim()) {
            setError('Please fill in all fields.');
            return;
        }

        if (!user) {
            setError('You must be logged in to submit a blog.');
            return;
        }

        setLoading(true);

        try {
            const authorName = user.user_metadata?.name || user.email?.split('@')[0] || 'Anonymous';

            const { error: insertError } = await supabase
                .from('blogs')
                .insert([
                    {
                        title: title.trim(),
                        content: content.trim(),
                        author_id: user.id,
                        author_name: authorName,
                        status: 'pending'
                    }
                ]);

            if (insertError) throw insertError;

            setSuccess(true);
            setTimeout(() => {
                navigate('/blog');
            }, 3000);
        } catch (err) {
            console.error('Error submitting blog:', err);
            setError(err.message || 'Failed to submit blog. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background px-4">
                <div className="bg-slate-800 p-8 rounded-2xl border border-green-500/30 text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Send className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Blog Submitted!</h2>
                    <p className="text-slate-300 mb-6">
                        Your blog has been submitted successfully and is pending admin approval. You will be redirected shortly.
                    </p>
                    <Link to="/blog" className="text-accent hover:text-accent-hover font-medium">
                        Return to Blogs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full py-12">
            <Helmet>
                <title>Submit Blog - IGNIS JURIS</title>
            </Helmet>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate('/blog')}
                    className="flex items-center text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Blogs
                </button>

                <div className="bg-slate-800 rounded-2xl p-8 border border-white/5 shadow-xl">
                    <h1 className="text-3xl font-bold text-white mb-2">Write a New Blog</h1>
                    <p className="text-slate-400 mb-8">
                        Share your legal knowledge and insights. Submissions will be reviewed before publishing.
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
                                Blog Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                placeholder="Enter an engaging title..."
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-slate-300 mb-2">
                                Content
                            </label>
                            <textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows="12"
                                className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-y"
                                placeholder="Write your blog content here..."
                                required
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center px-8 py-3 bg-accent text-white font-bold rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin h-5 w-5 mr-2" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-5 w-5 mr-2" />
                                        Submit for Review
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateBlog;
