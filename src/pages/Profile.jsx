import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Camera, Save, LogOut, Loader, CheckCircle, AlertCircle, Clock, Award, ChevronRight, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { QuizService } from '../services/quiz-service';
import { Helmet } from 'react-helmet-async';

const Profile = () => {
    const { user, loading, logout } = useAuth();
    const [name, setName] = useState(user?.user_metadata?.name || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || null);
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
        <div className="w-full py-12" style={{ background: '#f0ede8', minHeight: '100vh' }}>
            <Helmet>
                <title>Profile - IGNIS JURIS</title>
            </Helmet>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-xl border border-[#e5e5e5] overflow-hidden"
                >
                    {/* Header / Cover */}
                    <div className="h-40 bg-[#2d3a2e] relative">
                        <div className="absolute inset-0 bg-black/10"></div>
                    </div>

                    <div className="px-8 pb-10 relative">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center -mt-32 mb-10">
                            <div className="relative group">
                                <div className="h-64 w-64 rounded-full border-8 border-white shadow-2xl bg-[#f9fafb] flex items-center justify-center overflow-hidden">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full bg-[#f9fafb] flex items-center justify-center text-6xl font-black text-[#2d3a2e]/20">
                                            {userInitial}
                                        </div>
                                    )}
                                </div>

                                <label className="absolute bottom-4 right-4 p-4 bg-[#2d3a2e] hover:bg-[#1c1b1b] text-white rounded-full shadow-2xl transition-all transform hover:scale-105 cursor-pointer border-4 border-white" title="Change Photo">
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
                            <h2 className="text-3xl font-black text-[#1c1b1b] mt-6 tracking-tight">{name || 'User'}</h2>
                            <p className="text-[#474545] font-black uppercase tracking-widest text-xs mt-1">{user.email}</p>
                        </div>

                        {/* Form Section */}
                        <form onSubmit={handleUpdateProfile} className="max-w-lg mx-auto space-y-6">
                            {message && (
                                <div className={`p-4 rounded-xl flex items-center text-xs font-black uppercase tracking-widest ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                    {message.type === 'success' ? <CheckCircle className="h-4 w-4 mr-2" /> : <AlertCircle className="h-4 w-4 mr-2" />}
                                    {message.text}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#474545] uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#474545]" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#f9fafb] border border-[#e5e5e5] focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent transition-all outline-none text-[#1c1b1b] font-bold placeholder-gray-400"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#474545] uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative opacity-60">
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#474545]" />
                                    <input
                                        type="email"
                                        value={user.email}
                                        disabled
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-100 border border-[#e5e5e5] cursor-not-allowed text-[#474545] font-bold"
                                    />
                                </div>
                                <p className="text-[10px] text-[#474545]/60 font-black uppercase tracking-widest ml-1">Email cannot be changed.</p>
                            </div>

                            <div className="pt-6 flex flex-col gap-4">
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="w-full flex items-center justify-center py-4 bg-[#2d3a2e] hover:bg-[#1c1b1b] text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-70"
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
                                    className="w-full flex items-center justify-center py-4 bg-white text-red-600 font-black uppercase tracking-widest text-xs rounded-2xl border border-red-100 hover:bg-red-50 transition-all shadow-sm"
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
                    className="mt-8 bg-white rounded-3xl shadow-xl border border-[#e5e5e5] p-10"
                >
                    <div className="flex items-center mb-8">
                        <Award className="h-8 w-8 text-[#2d3a2e] mr-4" />
                        <h3 className="text-2xl font-black text-[#1c1b1b] tracking-tight">Quiz Submissions</h3>
                    </div>

                    {loadingSubmissions ? (
                        <div className="flex justify-center py-12">
                            <Loader className="animate-spin h-10 w-10 text-[#2d3a2e]" />
                        </div>
                    ) : submissions.length > 0 ? (
                        <div className="space-y-4">
                            {submissions.map((sub) => (
                                <div
                                    key={sub.id}
                                    className="bg-[#f9fafb] rounded-2xl p-6 border border-[#e5e5e5] hover:border-[#2d3a2e]/30 transition-all flex items-center justify-between group shadow-sm hover:shadow-md"
                                >
                                    <div className="flex-1">
                                        <h4 className="text-lg font-black text-[#1c1b1b] mb-2 group-hover:text-[#2d3a2e] transition-colors">
                                            {sub.quiz?.title || 'Unknown Quiz'}
                                        </h4>
                                        <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-[#474545] space-x-6">
                                            <span className="flex items-center">
                                                <Clock className="h-3.5 w-3.5 mr-2 text-[#2d3a2e]" />
                                                {new Date(sub.submitted_at).toLocaleDateString()}
                                            </span>
                                            {sub.quiz?.answers_published ? (
                                                <span className="flex items-center text-green-700 bg-green-50 px-2 py-0.5 rounded">
                                                    <Award className="h-3.5 w-3.5 mr-2" />
                                                    Score: {sub.total_score}
                                                </span>
                                            ) : (
                                                <span className="flex items-center text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                                                    <FileText className="h-3.5 w-3.5 mr-2" />
                                                    Awaiting Grading
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {sub.quiz?.answers_published && (
                                        <button
                                            onClick={() => navigate(`/quizzes/${sub.quiz_id}/results`)}
                                            className="p-3 bg-white text-[#474545] border border-[#e5e5e5] rounded-full hover:bg-[#2d3a2e] hover:text-white transition-all transform group-hover:translate-x-1 shadow-sm"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-[#f9fafb] rounded-3xl border border-dashed border-[#e5e5e5]">
                            <p className="text-[#474545] text-lg font-bold">No quiz submissions found.</p>
                            <button
                                onClick={() => navigate('/quizzes')}
                                className="mt-4 text-[#2d3a2e] font-black uppercase tracking-widest text-xs hover:text-[#1c1b1b] underline"
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
