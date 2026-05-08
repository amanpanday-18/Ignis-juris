import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    Scale, BookOpen, GraduationCap, Briefcase, 
    ChevronRight, Sparkles, X, Star, Users, 
    ArrowRight, CheckCircle2, ShieldCheck, Zap, SkipForward
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NewsService } from '../services/news-service';
import { useAdmin } from '../hooks/useAdmin';
import AddNewsModal from '../components/AddNewsModal';
import { Helmet } from 'react-helmet-async';
import introVideo from '../assets/video/ignis_intro.mp4';
import heroLastFrame from '../assets/video/ignis_hero_last.jpg';

const Home = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const [videoPlaying, setVideoPlaying] = useState(true);
    const [videoFading, setVideoFading] = useState(false);
    const videoRef = useRef(null);
    const { isAdmin } = useAdmin();
    const { user } = useAuth();

    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async () => {
        try {
            const data = await NewsService.getAll();
            setNews(data);
        } catch (error) {
            console.error('Error loading news:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNews = (newArticle) => {
        setNews([newArticle, ...news]);
    };

    const handleVideoEnd = () => {
        setVideoFading(true);
        setTimeout(() => {
            setVideoPlaying(false);
            setVideoFading(false);
        }, 800);
    };

    const handleSkipVideo = () => {
        handleVideoEnd();
    };

    const stats = [
        { label: 'Resources Shared', value: '500+', icon: BookOpen },
        { label: 'Community Members', value: '2k+', icon: Users },
        { label: 'Legal Insights', value: '150+', icon: Sparkles },
        { label: 'Trusted Experts', value: '50+', icon: ShieldCheck },
    ];

    const features = [
        {
            title: 'Legal Blogs',
            description: 'In-depth analysis of recent judgements and legal developments.',
            icon: BookOpen,
            path: '/blog',
            color: 'blue'
        },
        {
            title: 'Education',
            description: 'Comprehensive study materials for law students and professionals.',
            icon: GraduationCap,
            path: '/education',
            color: 'indigo'
        },
        {
            title: 'Opportunities',
            description: 'Handpicked internships and job openings in the legal sector.',
            icon: Briefcase,
            path: '/internships',
            color: 'amber'
        }
    ];

    return (
        <div className="min-h-screen bg-background selection:bg-accent selection:text-white overflow-hidden">
            <Helmet>
                <title>IGNIS JURIS - Justice Simplified</title>
                <meta name="description" content="Your comprehensive legal platform for news, resources, and AI-powered document drafting." />
            </Helmet>

            {/* Hero Section */}
            <section className="relative min-h-[90vh] overflow-hidden">

                <AnimatePresence mode="wait">
                    {videoPlaying ? (
                        /* ── VIDEO STATE ── */
                        <motion.div
                            key="video-hero"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: videoFading ? 0 : 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative w-full min-h-[90vh] flex items-end justify-center pb-16"
                        >
                            {/* Fullwidth video */}
                            <video
                                ref={videoRef}
                                src={introVideo}
                                autoPlay
                                muted
                                playsInline
                                onEnded={handleVideoEnd}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            {/* Subtle dark gradient at top so navbar stays readable */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

                            {/* Skip button */}
                            <div className="relative z-10">
                                <button
                                    onClick={handleSkipVideo}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-sm font-bold hover:bg-black/60 transition-all"
                                >
                                    <SkipForward className="h-4 w-4" />
                                    Skip Intro
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        /* ── ORIGINAL HERO CONTENT ── */
                        <motion.div
                            key="content-hero"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative min-h-screen flex items-center justify-center pt-24 md:pt-36 pb-16 md:pb-32"
                        >
                            {/* Dynamic Background */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse"></div>
                                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                            </div>

                            <div className="container mx-auto px-6 relative z-10">
                                <div className="max-w-5xl mx-auto text-center">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6 md:mb-8"
                                    >
                                        <Sparkles className="h-4 w-4 text-accent" />
                                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-300">The Future of Legal Empowerment</span>
                                    </motion.div>

                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.7, delay: 0.2 }}
                                        className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-black mb-5 md:mb-8 leading-[1.1] tracking-tight"
                                    >
                                        <span className="text-white">JUSTICE</span>
                                        <br />
                                        <span className="text-gradient italic">SIMPLIFIED.</span>
                                    </motion.h1>

                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.7, delay: 0.4 }}
                                        className="text-base sm:text-lg md:text-2xl text-slate-400 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed font-light px-2"
                                    >
                                        Ignis Juris bridge the gap between complex legal structures and accessible justice through AI-driven insights and expert resources.
                                    </motion.p>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.7, delay: 0.6 }}
                                        className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center w-full px-4 sm:px-0"
                                    >
                                        <Link
                                            to="/blog"
                                            className="group relative w-full sm:w-auto px-8 py-4 bg-primary rounded-2xl font-bold text-white text-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] overflow-hidden"
                                        >
                                            <span className="relative z-10 flex items-center gap-2">
                                                Start Exploring <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </Link>
                                        <button
                                            onClick={() => setShowDisclaimer(true)}
                                            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-white border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                                        >
                                            How it Works
                                        </button>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-1/4 right-10 hidden lg:block"
                            >
                                <div className="glass p-4 rounded-2xl shadow-2xl">
                                    <Scale className="h-8 w-8 text-accent" />
                                </div>
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-1/4 left-10 hidden lg:block"
                            >
                                <div className="glass p-4 rounded-2xl shadow-2xl">
                                    <ShieldCheck className="h-8 w-8 text-blue-400" />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* Features Section */}

            <section className="py-16 md:py-32 relative">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16 gap-6 md:gap-8">
                        <div className="max-w-2xl">
                            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4">Key Resources</h2>
                            <h3 className="text-2xl sm:text-3xl md:text-5xl font-serif font-bold text-white mb-4 md:mb-6">Designed for the modern legal era.</h3>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                We've built a ecosystem of resources to support your legal journey at every step, from education to professional practice.
                            </p>
                        </div>
                        <Link to="/more" className="text-accent font-bold flex items-center gap-2 group">
                            Explore All Features <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <Link to={feature.path} key={idx} className="group">
                                <motion.div
                                    whileHover={{ y: -10 }}
                                    className="h-full p-8 rounded-3xl glass border-white/5 hover:border-white/20 transition-all duration-500"
                                >
                                    <div className={`w-16 h-16 rounded-2xl bg-${feature.color}-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                        <feature.icon className={`h-8 w-8 text-${feature.color}-400`} />
                                    </div>
                                    <h4 className="text-2xl font-bold text-white mb-4">{feature.title}</h4>
                                    <p className="text-slate-400 mb-8 leading-relaxed">
                                        {feature.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-300 group-hover:text-white transition-colors">
                                        Learn More <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 md:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 -skew-y-3 translate-y-20"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center">
                        <div className="relative">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                            >
                                <img 
                                    src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80" 
                                    alt="Legal Mission" 
                                    className="w-full aspect-square object-cover"
                                />
                            </motion.div>
                            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-accent/20 rounded-full blur-[100px] -z-10"></div>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4">Our Mission</h2>
                            <h3 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8 leading-tight">Empowering justice through knowledge.</h3>
                            <div className="space-y-6">
                                {[
                                    'Democratizing access to legal resources and judgements.',
                                    'Leveraging technology to simplify legal document drafting.',
                                    'Building a bridge between legal experts and the community.',
                                    'Fostering a culture of continuous legal education.'
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="mt-1 p-1 rounded-full bg-accent/10 border border-accent/20">
                                            <CheckCircle2 className="h-4 w-4 text-accent" />
                                        </div>
                                        <p className="text-slate-300 text-lg">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Disclaimer Overlay */}

            <AnimatePresence>
                {showDisclaimer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="max-w-2xl w-full glass p-8 md:p-12 rounded-[2.5rem] relative shadow-2xl border-white/10"
                        >
                            <button 
                                onClick={() => setShowDisclaimer(false)}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-slate-400 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                            
                            <div className="mb-8 p-4 rounded-2xl bg-accent/10 border border-accent/20 w-fit">
                                <Scale className="h-8 w-8 text-accent" />
                            </div>

                            <h2 className="text-3xl font-serif font-bold text-white mb-6">Legal Disclaimer</h2>
                            
                            <div className="prose prose-invert max-w-none text-slate-300 space-y-4 text-sm md:text-base leading-relaxed">
                                <p>This website is for educational purposes only and is intended to share legal knowledge. The content provided here does not constitute professional legal advice, and no attorney-client relationship is formed by your use of this site.</p>
                                <p>As I am a law student, the information provided may not reflect the most current legal developments. For specific legal issues, please consult a licensed legal professional.</p>
                                <p className="font-bold text-slate-200">We do not take responsibility for any information provided on the website. This entire website is for educational purposes only, and no responsibility will be taken for its authenticity.</p>
                            </div>

                            <button 
                                onClick={() => setShowDisclaimer(false)}
                                className="mt-12 w-full py-4 bg-accent text-white font-bold rounded-2xl hover:bg-accent-hover transition-colors"
                            >
                                I Understand
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Disclaimer Trigger */}
            {!showDisclaimer && (
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setShowDisclaimer(true)}
                    className="fixed bottom-8 right-8 z-[999] p-4 bg-accent/90 hover:bg-accent text-white rounded-2xl shadow-2xl backdrop-blur-sm transition-all md:flex items-center gap-2 group hidden"
                >
                    <Scale className="h-5 w-5" />
                    <span className="font-bold text-xs uppercase tracking-widest overflow-hidden max-w-0 group-hover:max-w-[100px] transition-all duration-500 whitespace-nowrap">Disclaimer</span>
                </motion.button>
            )}

            <AddNewsModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddNews}
            />
        </div>
    );
};

export default Home;

