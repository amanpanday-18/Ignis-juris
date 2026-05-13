import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    BookOpen,
    Briefcase,
    Award,
    GraduationCap,
    Scale,
    Library,
    Camera,
    FileText,
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../components/PageHeader';

// Background images
import bgQuizzes      from '../assets/more_legal_quizzes.png';
import bgInternships  from '../assets/more_internships.png';
import bgJobs         from '../assets/more_job_openings.png';
import bgEducation    from '../assets/more_education.png';
import bgMoot         from '../assets/more_moot_courts.png';
import bgScholar      from '../assets/more_scholarships.png';
import bgGallery      from '../assets/more_gallery.png';
import bgArticles     from '../assets/more_legal_articles.png';
import logo           from '../assets/ignis_juris_logo.jpg';

/* ─────────────────────────────────────────────
   Single card component
───────────────────────────────────────────── */
const FeatureCard = ({ item }) => {
    const Icon = item.icon;

    const inner = (
        <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative rounded-2xl overflow-hidden cursor-pointer group h-full"
            style={{ minHeight: 260 }}
        >
            {/* Background photo */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${item.bg})` }}
            />

            {/* Dark gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

            {/* ── Top-left: IGNIS JURIS branding ── */}
            <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                <img
                    src={logo}
                    alt="Ignis Juris"
                    className="h-7 w-7 rounded-full object-cover border border-white/20"
                />
                <div>
                    <p
                        className="text-white font-black text-xs leading-none tracking-widest"
                        style={{ fontFamily: "'Source Sans Pro', sans-serif", textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}
                    >
                        IGNIS JURIS
                    </p>
                    <p className="text-white/65 text-[8px] font-semibold tracking-[0.2em] uppercase leading-none mt-0.5">
                        Justice. Simplified.
                    </p>
                </div>
            </div>

            {/* ── Bottom: icon + title + description ── */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center mb-2.5 shadow-lg">
                    <Icon className="h-4 w-4 text-[#2d3a2e]" />
                </div>
                <h3
                    className="text-white font-black text-base leading-tight mb-1"
                    style={{ fontFamily: "'Source Sans Pro', sans-serif", textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}
                >
                    {item.title}
                </h3>
                <p className="text-white/70 text-xs leading-snug line-clamp-3">
                    {item.description}
                </p>
            </div>
        </motion.div>
    );

    return item.available
        ? <Link to={item.link} className="block h-full">{inner}</Link>
        : <div className="h-full opacity-60 cursor-not-allowed">{inner}</div>;
};

/* ─────────────────────────────────────────────
   Main More Page
───────────────────────────────────────────── */
const More = () => {
    const topRow = [
        {
            id: 'quizzes',
            title: 'Legal Quizzes',
            description: 'Test your knowledge with our comprehensive legal quizzes and earn certificates.',
            icon: BookOpen,
            link: '/quizzes',
            bg: bgQuizzes,
            available: true,
        },
        {
            id: 'internships',
            title: 'Internships',
            description: 'Find internship opportunities with top law firms and advocates across India.',
            icon: Briefcase,
            link: '/internships',
            bg: bgInternships,
            available: true,
        },
        {
            id: 'jobs',
            title: 'Job Openings',
            description: 'Explore career opportunities in the legal field. From junior associates to partners.',
            icon: Award,
            link: '/jobs',
            bg: bgJobs,
            available: true,
        },
        {
            id: 'education',
            title: 'Educational Resources',
            description: 'Study materials, lecture notes, and video tutorials for law students.',
            icon: Library,
            link: '/education',
            bg: bgEducation,
            available: true,
        },
    ];

    const bottomRow = [
        {
            id: 'competitions',
            title: 'Moot Courts',
            description: 'Participate in upcoming moot court competitions and legal debates.',
            icon: Scale,
            link: '/competitions',
            bg: bgMoot,
            available: true,
        },
        {
            id: 'scholarships',
            title: 'Scholarships',
            description: 'Discover scholarships and financial aid opportunities for law students.',
            icon: GraduationCap,
            link: '/scholarships',
            bg: bgScholar,
            available: true,
        },
        {
            id: 'gallery',
            title: 'Event Gallery',
            description: 'Highlights, photos and winner announcements from our past events.',
            icon: Camera,
            link: '/gallery',
            bg: bgGallery,
            available: true,
        },
        {
            id: 'articles',
            title: 'Legal Articles',
            description: 'Read insightful articles on trending topics and case analyses.',
            icon: FileText,
            link: '/blog',
            bg: bgArticles,
            available: true,
        },
    ];

    const containerVariants = {
        hidden:  { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
    };

    const itemVariants = {
        hidden:  { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const taglines = [
        { icon: Scale,        primary: 'Empowering future legal minds.', secondary: 'Learn. Explore. Achieve.' },
        { icon: Award,        primary: 'Trusted by students',            secondary: 'across India.'            },
        { icon: GraduationCap, primary: 'Your journey in law',           secondary: 'starts here.'            },
    ];

    return (
        <div className="w-full min-h-screen" style={{ background: '#f0ede8' }}>
            <Helmet>
                <title>More Resources — IGNIS JURIS</title>
                <meta
                    name="description"
                    content="Explore legal resources: quizzes, internships, jobs, education, moot courts, scholarships and gallery."
                />
            </Helmet>

            {/* ── Dark Olive Header ── */}
            <PageHeader
                label="/RESOURCES"
                title="Explore More"
                description="Unlock a world of legal opportunities, knowledge, and tools to accelerate your career."
            />

            {/* ── Cards Grid ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-6">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                >
                    {/* Top row — 4 cards */}
                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                    >
                        {topRow.map((item) => (
                            <FeatureCard key={item.id} item={item} />
                        ))}
                    </motion.div>

                    {/* Bottom row — 4 cards */}
                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                    >
                        {bottomRow.map((item) => (
                            <FeatureCard key={item.id} item={item} />
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* ── Bottom tagline banner ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                <div
                    className="rounded-2xl border border-[#d4cfc8] bg-white/70 backdrop-blur-sm"
                    style={{ background: 'rgba(255,255,255,0.6)' }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#d4cfc8]">
                        {taglines.map(({ icon: Icon, primary, secondary }, i) => (
                            <div key={i} className="flex items-center gap-3 px-6 py-4">
                                <div className="w-9 h-9 rounded-full bg-[#f0ede8] border border-[#d4cfc8] flex items-center justify-center shrink-0">
                                    <Icon className="h-4 w-4 text-[#2d3a2e]" />
                                </div>
                                <div>
                                    <p className="text-[#1c1b1b] font-bold text-sm leading-tight">{primary}</p>
                                    <p className="text-[#474545] text-xs leading-tight">{secondary}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default More;
