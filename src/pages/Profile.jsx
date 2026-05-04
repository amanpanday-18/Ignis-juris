import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Camera, Save, LogOut, Loader, CheckCircle, AlertCircle, Clock, Award, ChevronRight, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { QuizService } from '../services/quiz-service';
import { Helmet } from 'react-helmet-async';

const Profile = () => {
    const { user, loading, logout } = useAuth();
    const [name, setName] = useState(user?.user_metadata?.name || '');
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState(null);

    if (loading) return null;
    if (!user) return <Navigate to="/" />;

    const userInitial = name[0]?.toUpperCase() || user.email[0]?.toUpperCase() || 'U';
    const [uploading, setUploading] = useState(false);
    const [submissions, setSubmissions] = useState([]);
    const [loadingSubmissions, setLoadingSubmissions] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.id) {
            loadSubmissions();
        }
    }, [user?.id]);

    const loadSubmissions = async () => {
        try {
            const data = await QuizService.getUserSubmissions(user.id);
            setSubmissions(data);
        } catch (error) {
            console.error('Error loading submissions:', error);
        } finally {
            setLoadingSubmissions(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({
                data: { name: name }
            });

            if (error) throw error;
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleAvatarUpload = async (event) => {
        try {
            const file = event.target.files[0];
            if (!file) return;

            // Show immediate preview
            const previewUrl = URL.createObjectURL(file);
            setAvatarUrl(previewUrl);
            setUploading(true);

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            const publicUrl = data.publicUrl;

            // Update User Metadata
            const { error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            });

            if (updateError) throw updateError;

            // Update state with final public URL (though it should look the same)
            setAvatarUrl(publicUrl);
            setMessage({ type: 'success', text: 'Photo updated successfully!' });

        } catch (error) {
            console.error('Error uploading avatar:', error);
            setMessage({ type: 'error', text: 'Error uploading image.' });
            // Revert to original if needed, but for now we leave the error message
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 py-12 text-slate-100">
            <Helmet>
                <title>Profile - IGNIS JURIS</title>
            </Helmet>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800 rounded-2xl shadow-xl border border-white/5 overflow-hidden"
                >
                    {/* Header / Cover */}
                    <div className="h-40 bg-gradient-to-r from-slate-900 to-slate-800 relative border-b border-white/5">
                        <div className="absolute inset-0 bg-black/30"></div>
                    </div>

                    <div className="px-8 pb-8 relative">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center -mt-32 mb-8">
                            <div className="relative group">
                                <div className="h-64 w-64 rounded-full border-4 border-slate-800 shadow-2xl bg-slate-700 flex items-center justify-center overflow-hidden">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full bg-slate-700 flex items-center justify-center text-6xl font-bold text-slate-500">
                                            {userInitial}
                                        </div>
                                    )}
                                </div>

                                <label className="absolute bottom-4 right-4 p-3 bg-accent hover:bg-accent/90 text-white rounded-full shadow-lg transition-all transform hover:scale-105 cursor-pointer border border-white/10" title="Change Photo">
                                    {uploading ? <Loader className="animate-spin h-5 w-5" /> : <Camera className="h-5 w-5" />}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarUpload}
                                        disabled={uploading}
                                    />
                                </label>
                            </div>
                            <h2 className="text-3xl font-bold text-white mt-4">{name || 'User'}</h2>
                            <p className="text-slate-400 font-medium">{user.email}</p>
                        </div>

                        {/* Form Section */}
                        <form onSubmit={handleUpdateProfile} className="max-w-lg mx-auto space-y-6">
                            {message && (
                                <div className={`p-4 rounded-lg flex items-center ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                    {message.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
                                    {message.text}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none text-white placeholder-slate-500"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 ml-1">Email Address</label>
                                <div className="relative opacity-70">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                                    <input
                                        type="email"
                                        value={user.email}
                                        disabled
                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/40 border border-white/5 cursor-not-allowed text-slate-400"
                                    />
                                </div>
                                <p className="text-xs text-slate-500 ml-1">Email cannot be changed.</p>
                            </div>

                            <div className="pt-4 flex flex-col gap-4">
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="w-full flex items-center justify-center py-3.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
                                >
                                    {isUpdating ? (
                                        <Loader className="animate-spin h-5 w-5 mr-2" />
                                    ) : (
                                        <Save className="h-5 w-5 mr-2" />
                                    )}
                                    {isUpdating ? 'Saving Changes...' : 'Save Profile'}
                                </button>

                                <button
                                    type="button"
                                    onClick={logout}
                                    className="w-full flex items-center justify-center py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-xl transition-colors border border-red-500/20"
                                >
                                    <LogOut className="h-5 w-5 mr-2" />
                                    Sign Out
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>

                {/* Quiz Submissions Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 bg-slate-800 rounded-2xl shadow-xl border border-white/5 p-8"
                >
                    <div className="flex items-center mb-6">
                        <Award className="h-6 w-6 text-accent mr-3" />
                        <h3 className="text-xl font-bold text-white">Quiz Submissions</h3>
                    </div>

                    {loadingSubmissions ? (
                        <div className="flex justify-center py-8">
                            <Loader className="animate-spin h-8 w-8 text-accent" />
                        </div>
                    ) : submissions.length > 0 ? (
                        <div className="space-y-4">
                            {submissions.map((sub) => (
                                <div
                                    key={sub.id}
                                    className="bg-slate-900/50 rounded-xl p-4 border border-white/5 hover:border-accent/30 transition-all flex items-center justify-between group"
                                >
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white mb-1 group-hover:text-primary transition-colors">
                                            {sub.quiz?.title || 'Unknown Quiz'}
                                        </h4>
                                        <div className="flex items-center text-xs text-slate-500 space-x-4">
                                            <span className="flex items-center">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {new Date(sub.submitted_at).toLocaleDateString()}
                                            </span>
                                            {sub.quiz?.answers_published ? (
                                                <span className="flex items-center text-green-400 font-bold">
                                                    <Award className="h-3 w-3 mr-1" />
                                                    Score: {sub.total_score}
                                                </span>
                                            ) : (
                                                <span className="flex items-center text-yellow-400">
                                                    <FileText className="h-3 w-3 mr-1" />
                                                    Awaiting Grading
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {sub.quiz?.answers_published && (
                                        <button
                                            onClick={() => navigate(`/quizzes/${sub.quiz_id}/results`)}
                                            className="p-2 bg-slate-800 text-slate-400 rounded-full hover:bg-primary hover:text-white transition-all transform group-hover:translate-x-1"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-slate-900/50 rounded-xl border border-dashed border-white/10">
                            <p className="text-slate-500">No quiz submissions found.</p>
                            <button
                                onClick={() => navigate('/quizzes')}
                                className="mt-4 text-accent hover:underline font-medium text-sm"
                            >
                                Take your first quiz
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
