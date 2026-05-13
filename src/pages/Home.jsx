import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Scale, BookOpen, GraduationCap, Briefcase,
    ChevronRight, ChevronLeft, X, Users,
    ArrowRight, CheckCircle2, ShieldCheck, Zap, SkipForward, Trophy, Image as ImageIcon, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NewsService } from '../services/news-service';
import { GalleryService } from '../services/gallery-service';
import { useAdmin } from '../hooks/useAdmin';
import AddNewsModal from '../components/AddNewsModal';
import { Helmet } from 'react-helmet-async';
import introVideoMobile from '../assets/video/ignis_intro_mobile.mp4';
import introVideoDesktop from '../assets/video/ignis_intro_desktop.mp4';
import heroBg from '../assets/new_hero_bg.png';
import bgBlog from '../assets/more_legal_articles.png';
import bgEducation from '../assets/more_education.png';
import bgOpportunities from '../assets/more_internships.png';

/* ── Mini image carousel for gallery cards on Home page ── */
const GalleryCard = ({ event }) => {
    const [imgIdx, setImgIdx] = React.useState(0);
    const imgs = event.image_urls?.length ? event.image_urls : [event.image_url].filter(Boolean);
    const prev = (e) => { e.stopPropagation(); setImgIdx((i) => (i - 1 + imgs.length) % imgs.length); };
    const next = (e) => { e.stopPropagation(); setImgIdx((i) => (i + 1) % imgs.length); };
    const winnersList = Array.isArray(event.winners_list) && event.winners_list.length
        ? event.winners_list
        : null;

    return (
        <motion.div
            whileHover={{ y: -6 }}
            className="bg-white rounded-2xl overflow-hidden border border-[#e5e5e5] shadow-card hover:shadow-card-hover group transition-all duration-300"
        >
            {/* Image */}
            <div className="h-48 relative overflow-hidden">
                <img
                    src={imgs[imgIdx]}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70" />

                {imgs.length > 1 && (
                    <>
                        <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <ChevronRight className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                            {imgs.map((_, i) => (
                                <button key={i} onClick={(e) => { e.stopPropagation(); setImgIdx(i); }}
                                    className={`h-1 rounded-full transition-all ${i === imgIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/40'}`}
                                />
                            ))}
                        </div>
                    </>
                )}

                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white">
                    {new Date(event.event_date).toLocaleDateString()}
                </div>
                {imgs.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-semibold text-white flex items-center gap-1">
                        <ImageIcon className="h-3 w-3" /> {imgs.length}
                    </div>
                )}
            </div>

            <div className="p-5">
                <h4 className="text-lg font-bold text-[#1c1b1b] mb-1.5 line-clamp-1 group-hover:text-[#474545] transition-colors">{event.title}</h4>
                <p className="text-[#474545] text-sm line-clamp-2 mb-4">{event.description}</p>

                {(winnersList || event.winners) && (
                    <div className="pt-3 border-t border-[#e5e5e5]">
                        <span className="text-xs text-[#1c1b1b] font-bold uppercase flex items-center gap-1 mb-1.5">
                            <Trophy className="h-3 w-3" /> Winners
                        </span>
                        {winnersList ? (
                            <ul className="space-y-0.5">
                                {winnersList.slice(0, 3).map((w, i) => (
                                    <li key={i} className="text-sm text-[#474545] flex gap-2">
                                        {w.position && <span className="text-[#1c1b1b] font-bold shrink-0">{w.position}</span>}
                                        <span className="line-clamp-1">{w.name}</span>
                                    </li>
                                ))}
                                {winnersList.length > 3 && (
                                    <li className="text-xs text-[#888]">+{winnersList.length - 3} more</li>
                                )}
                            </ul>
                        ) : (
                            <p className="text-sm text-[#474545] line-clamp-2">{event.winners}</p>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const Home = () => {
    const [news, setNews] = useState([]);
    const [galleryEvents, setGalleryEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const [videoPlaying, setVideoPlaying] = useState(true);
    const [videoFading, setVideoFading] = useState(false);
    const [isPortrait, setIsPortrait] = useState(false);
    const videoRef = useRef(null);
    const { isAdmin } = useAdmin();
    const { user } = useAuth();

    useEffect(() => {
        const checkOrientation = () => setIsPortrait(window.innerHeight > window.innerWidth);
        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        return () => window.removeEventListener('resize', checkOrientation);
    }, []);

    useEffect(() => {
        loadNews();
        loadGalleryEvents();
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

    const loadGalleryEvents = async () => {
        try {
            const data = await GalleryService.getAll();
            setGalleryEvents(data ? data.slice(0, 4) : []);
        } catch (error) {
            console.error('Error loading gallery:', error);
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
            description: 'In-depth analysis of recent judgements and legal developments written by our community.',
            icon: BookOpen,
            path: '/blog',
            bgImage: bgBlog,
        },
        {
            title: 'Education Hub',
            description: 'Comprehensive study materials, bare acts and resources for law students and professionals.',
            icon: GraduationCap,
            path: '/education',
            bgImage: bgEducation,
        },
        {
            title: 'Opportunities',
            description: 'Handpicked internships, jobs and scholarships in the legal sector — updated regularly.',
            icon: Briefcase,
            path: '/internships',
            bgImage: bgOpportunities,
        }
    ];

    return (
        <div className="min-h-screen bg-[#f3f3f3] overflow-hidden">
            <Helmet>
                <title>IGNIS JURIS — Justice Simplified</title>
                <meta name="description" content="Your comprehensive legal platform for blogs, resources, and AI-powered document drafting." />
            </Helmet>

            {/* ── Hero Section ── */}
            <section className="relative min-h-screen overflow-hidden">
                <AnimatePresence mode="wait">
                    {videoPlaying ? (
                        /* VIDEO STATE */
                        <motion.div
                            key="video-hero"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: videoFading ? 0 : 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative w-full min-h-screen flex items-end justify-center pb-16 bg-black"
                        >
                            <video
                                ref={videoRef}
                                src={isPortrait ? introVideoMobile : introVideoDesktop}
                                autoPlay
                                muted
                                playsInline
                                onEnded={handleVideoEnd}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />
                            <div className="relative z-10">
                                <button
                                    onClick={handleSkipVideo}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-sm font-semibold hover:bg-black/60 transition-all"
                                >
                                    <SkipForward className="h-4 w-4" />
                                    Skip Intro
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        /* ── LIGHT HERO with BG IMAGE ── */
                        <motion.div
                            key="content-hero"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative min-h-screen flex flex-col"
                            style={{
                                backgroundImage: `url(${heroBg})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundColor: '#f0ede8' // fallback
                            }}
                        >
                            {/* Very subtle tint to ensure text readability without washing out the image */}
                            <div className="absolute inset-0 bg-[#f5f2eb]/20 pointer-events-none" />
                            {/* Hero content */}
                            <div className="relative z-10 flex-1 flex items-center pt-24 md:pt-32 pb-12">
                                <div className="max-w-7xl mx-auto px-6 w-full">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
                                        {/* Left — headline */}
                                        <div>
                                            <motion.p
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5 }}
                                                className="text-xs font-bold uppercase tracking-[0.25em] text-[#2d3a2e] mb-4"
                                            >
                                                /THE LEGAL PLATFORM
                                            </motion.p>
                                            <motion.h1
                                                initial={{ opacity: 0, y: 16 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.6, delay: 0.1 }}
                                                className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#2d3a2e] leading-tight tracking-tight mb-8"
                                                style={{ fontFamily: "'Playfair Display', 'Merriweather', Georgia, serif" }}
                                            >
                                                Justice<br />Simplified.
                                            </motion.h1>
                                            <motion.div
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.6, delay: 0.25 }}
                                                className="flex flex-col sm:flex-row gap-4"
                                            >
                                                <Link
                                                    to="/blog"
                                                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#2d3a2e] text-white text-sm font-bold rounded-full hover:bg-[#3d4f38] transition-all duration-200 active:scale-95 shadow-md"
                                                >
                                                    Start Exploring <ArrowRight className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => setShowDisclaimer(true)}
                                                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-[#2d3a2e] text-[#2d3a2e] text-sm font-bold rounded-full hover:bg-[#2d3a2e] hover:text-white transition-all duration-200 active:scale-95"
                                                >
                                                    Learn More
                                                </button>
                                            </motion.div>
                                        </div>

                                        {/* Right — description + stats */}
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.6, delay: 0.3 }}
                                        >
                                            <p className="text-[#2d3a2e] text-base md:text-lg leading-relaxed mb-10 font-medium max-w-lg">
                                                Ignis Juris bridges the gap between complex legal structures and accessible justice through AI-driven insights and expert resources.
                                            </p>

                                            {/* Stats row */}
                                            <div className="grid grid-cols-2 gap-5">
                                                {stats.map((stat, i) => (
                                                    <div key={i} className="bg-[#f4f1ea]/95 backdrop-blur-sm rounded-2xl p-6 border border-[#e5e0d8] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform">
                                                        <div className="w-10 h-10 rounded-full bg-[#2d3a2e] flex items-center justify-center mb-4 shadow-inner">
                                                            <stat.icon className="h-5 w-5 text-[#f4f1ea]" strokeWidth={1.5} />
                                                        </div>
                                                        <p className="text-3xl md:text-4xl font-bold text-[#2d3a2e] mb-1" style={{ fontFamily: "'Playfair Display', 'Merriweather', Georgia, serif" }}>{stat.value}</p>
                                                        <p className="text-sm text-[#2d3a2e]/80 font-semibold">{stat.label}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* ── Why Choose Us / Features Section ── */}
            <section className="py-20 md:py-28 bg-[#f3f3f3]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-end mb-14">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#474545] mb-3">/WHY CHOOSE US</p>
                            <h2 className="text-4xl md:text-5xl font-black text-[#1c1b1b] leading-tight" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
                                We specialize in providing reliable and efficient solutions
                            </h2>
                        </div>
                        <div>
                            <p className="text-[#474545] text-base leading-relaxed mb-6">
                                Whether you need to understand your rights, access study materials, or find career opportunities in law, we're here to help you achieve your goals with precision and speed.
                            </p>
                            <Link to="/more" className="inline-flex items-center gap-2 text-sm font-bold text-[#1c1b1b] hover:text-[#474545] transition-colors group">
                                Explore All Features <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((feature, idx) => (
                            <Link to={feature.path} key={idx} className="group">
                                <motion.div
                                    whileHover={{ y: -6 }}
                                    className="relative h-full p-8 rounded-2xl border border-transparent shadow-card hover:shadow-card-hover overflow-hidden transition-all duration-300 flex flex-col"
                                >
                                    {/* Background Image & Overlay */}
                                    {feature.bgImage ? (
                                        <>
                                            <div
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                                style={{ backgroundImage: `url(${feature.bgImage})` }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b1b]/95 via-[#1c1b1b]/80 to-[#1c1b1b]/60 transition-opacity duration-300 group-hover:opacity-90" />
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 bg-[#1c1b1b]" />
                                    )}

                                    {/* IGNIS JURIS watermark inside card */}
                                    <div
                                        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none font-black text-white"
                                        style={{ fontSize: '5rem', lineHeight: 1, fontFamily: "'Source Sans Pro', sans-serif" }}
                                    >
                                        IGNIS
                                    </div>
                                    
                                    <div className="relative z-10 flex-1 flex flex-col">
                                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6 group-hover:bg-white group-hover:border-white transition-all duration-300">
                                            <feature.icon className="h-5 w-5 text-white group-hover:text-[#2d3a2e] transition-colors duration-300" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                        <p className="text-white/70 text-sm leading-relaxed mb-6 flex-1">{feature.description}</p>
                                        <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:gap-3 transition-all mt-auto">
                                            Learn More <ArrowRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Event Highlights / Gallery ── */}
            {(galleryEvents.length > 0 || isAdmin) && (
                <section className="py-20 md:py-28 bg-white border-t border-[#e5e5e5]">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#474545] mb-3">/GALLERY</p>
                                <h2 className="text-4xl md:text-5xl font-black text-[#1c1b1b]" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
                                    Event Highlights.
                                </h2>
                                <p className="text-[#474545] mt-3 max-w-md">
                                    Relive the moments from our past competitions, seminars, and legal events.
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                {isAdmin && (
                                    <Link to="/admin/gallery" className="px-5 py-2.5 bg-[#1c1b1b] text-white rounded-full text-sm font-bold hover:bg-[#474545] transition-all">
                                        Manage Gallery
                                    </Link>
                                )}
                                <Link to="/gallery" className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#1c1b1b] text-[#1c1b1b] rounded-full text-sm font-bold hover:bg-[#1c1b1b] hover:text-white transition-all">
                                    See All
                                </Link>
                            </div>
                        </div>

                        {galleryEvents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                {galleryEvents.map((event) => (
                                    <GalleryCard key={event.id} event={event} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-[#f3f3f3] rounded-2xl border border-[#e5e5e5]">
                                <p className="text-[#474545]">No events to show yet.</p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ── Mission Section ── */}
            <section className="py-20 md:py-28 bg-[#f3f3f3]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{ once: true }}
                            className="relative rounded-2xl overflow-hidden shadow-card"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80"
                                alt="Legal Mission"
                                className="w-full aspect-square object-cover"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{ once: true }}
                        >
                            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#474545] mb-4">/OUR MISSION</p>
                            <h2 className="text-4xl md:text-5xl font-black text-[#1c1b1b] mb-8 leading-tight" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
                                Empowering justice through knowledge.
                            </h2>
                            <div className="space-y-5">
                                {[
                                    'Democratizing access to legal resources and judgements.',
                                    'Leveraging technology to simplify legal document drafting.',
                                    'Building a bridge between legal experts and the community.',
                                    'Fostering a culture of continuous legal education.'
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="mt-0.5 w-5 h-5 rounded-full bg-[#1c1b1b] flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="h-3 w-3 text-white" />
                                        </div>
                                        <p className="text-[#474545] leading-relaxed">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Disclaimer Overlay ── */}
            <AnimatePresence>
                {showDisclaimer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 16 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 16 }}
                            className="max-w-2xl w-full bg-white p-8 md:p-12 rounded-2xl relative shadow-card-hover border border-[#e5e5e5]"
                        >
                            <button
                                onClick={() => setShowDisclaimer(false)}
                                className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#f3f3f3] text-[#474545] transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <div className="mb-6 w-12 h-12 rounded-full bg-[#f3f3f3] border border-[#e5e5e5] flex items-center justify-center">
                                <Scale className="h-5 w-5 text-[#2d3a2e]" />
                            </div>

                            <h2 className="text-2xl font-black text-[#1c1b1b] mb-5" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>Legal Disclaimer</h2>

                            <div className="space-y-4 text-sm md:text-base text-[#474545] leading-relaxed">
                                <p>This website is for educational purposes only and is intended to share legal knowledge. The content provided here does not constitute professional legal advice, and no attorney-client relationship is formed by your use of this site.</p>
                                <p>As I am a law student, the information provided may not reflect the most current legal developments. For specific legal issues, please consult a licensed legal professional.</p>
                                <p className="font-bold text-[#1c1b1b]">We do not take responsibility for any information provided on the website. This entire website is for educational purposes only, and no responsibility will be taken for its authenticity.</p>
                            </div>

                            <button
                                onClick={() => setShowDisclaimer(false)}
                                className="mt-8 w-full py-3.5 bg-[#1c1b1b] text-white font-bold rounded-full hover:bg-[#474545] transition-all duration-200"
                            >
                                I Understand
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Disclaimer Button */}
            {!showDisclaimer && (
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setShowDisclaimer(true)}
                    className="fixed bottom-8 right-8 z-[999] hidden md:flex items-center gap-2 px-5 py-2.5 bg-[#1c1b1b] text-white rounded-full shadow-card-hover transition-all hover:bg-[#474545] group"
                >
                    <Scale className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-widest overflow-hidden max-w-0 group-hover:max-w-[80px] transition-all duration-500 whitespace-nowrap">Disclaimer</span>
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
