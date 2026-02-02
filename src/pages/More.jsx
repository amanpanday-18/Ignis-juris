import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    BookOpen,
    Briefcase,
    Award,
    GraduationCap,
    Trophy,
    ArrowRight,
    Scale,
    Calendar,
    Library
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const More = () => {
    const features = [
        {
            id: 'quizzes',
            title: 'Legal Quizzes',
            description: 'Test your knowledge with our comprehensive legal quizzes and earn certificates.',
            icon: BookOpen,
            link: '/quizzes',
            color: 'bg-blue-500',
            textColor: 'text-blue-400',
            gradient: 'from-blue-500 to-blue-600',
            available: true
        },

        {
            id: 'internships',
            title: 'Internships',
            description: 'Find internship opportunities with top law firms and advocates across India.',
            icon: Briefcase,
            link: '/internships',
            color: 'bg-green-500',
            textColor: 'text-green-400',
            gradient: 'from-green-500 to-green-600',
            available: true
        },
        {
            id: 'jobs',
            title: 'Job Openings',
            description: 'Explore career opportunities in the legal field. From junior associates to partners.',
            icon: Award,
            link: '/jobs',
            color: 'bg-purple-500',
            textColor: 'text-purple-400',
            gradient: 'from-purple-500 to-purple-600',
            available: true
        },
        {
            id: 'education',
            title: 'Educational Resources',
            description: 'Study materials, lecture notes, and video tutorials for law students.',
            icon: Library,
            link: '/education',
            color: 'bg-teal-500',
            textColor: 'text-teal-400',
            gradient: 'from-teal-500 to-teal-600',
            available: true
        },

        {
            id: 'competitions',
            title: 'Moot Courts',
            description: 'Participate in upcoming moot court competitions and legal debates.',
            icon: Trophy,
            link: '/competitions',
            color: 'bg-yellow-500',
            textColor: 'text-yellow-400',
            gradient: 'from-yellow-500 to-yellow-600',
            available: true
        },
        {
            id: 'scholarships',
            title: 'Scholarships',
            description: 'Financial aid and scholarship programs for law students.',
            icon: GraduationCap,
            link: '/scholarships',
            color: 'bg-red-500',
            textColor: 'text-red-400',
            gradient: 'from-red-500 to-red-600',
            available: true
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">
            <Helmet>
                <title>More Resources - IGNIS JURIS</title>
                <meta name="description" content="Explore additional legal resources, quizzes, internships, and jobs." />
            </Helmet>

            <div className="bg-gradient-to-r from-indigo-900 to-black text-white pt-20 pb-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-slate-900 to-black opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white"
                    >
                        Explore More
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-300 max-w-2xl mx-auto"
                    >
                        Unlock a world of legal opportunities, knowledge, and tools to accelerate your career.
                    </motion.p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-20">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {features.map((item) => (
                        <motion.div
                            key={item.id}
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className="bg-slate-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-white/5 flex flex-col group h-full hover:border-accent/30"
                        >
                            <div className={`p-1 h-1.5 w-full bg-gradient-to-r ${item.gradient}`}></div>
                            <div className="p-8 flex-1 flex flex-col">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white/5 group-hover:bg-white/10 transition-all duration-300`}>
                                    <item.icon className={`h-7 w-7 ${item.textColor}`} />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                                    {item.title}
                                </h3>

                                <p className="text-slate-400 leading-relaxed mb-6 flex-1 text-sm">
                                    {item.description}
                                </p>

                                <div className="mt-auto">
                                    {item.available ? (
                                        <Link
                                            to={item.link}
                                            className="flex items-center justify-between text-sm font-bold text-white group-hover:text-primary transition-colors"
                                        >
                                            <span>Get Started</span>
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </Link>
                                    ) : (
                                        <div className="flex items-center justify-between text-sm font-bold text-slate-500 cursor-not-allowed">
                                            <span>Coming Soon</span>
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                                <ArrowRight className="h-4 w-4" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default More;
