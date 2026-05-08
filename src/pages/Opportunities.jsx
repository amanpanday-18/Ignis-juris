import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Briefcase, Award, GraduationCap, Trophy, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Opportunities = () => {
    const opportunities = [
        {
            id: 'quizzes',
            title: 'Legal Quizzes',
            description: 'Test your knowledge with our comprehensive legal quizzes and earn certificates.',
            icon: BookOpen,
            link: '/quizzes',
            color: 'bg-primary-light/20 text-blue-400',
            buttonText: 'Take a Quiz',
            available: true
        },
        {
            id: 'internships',
            title: 'Internships',
            description: 'Find internship opportunities with top law firms and advocates across India.',
            icon: Briefcase,
            link: '/internships',
            color: 'bg-green-500/20 text-green-400',
            buttonText: 'Find Internships',
            available: true
        },
        {
            id: 'jobs',
            title: 'Job Openings',
            description: 'Explore career opportunities in the legal field. From junior associates to partners.',
            icon: Award,
            link: '/jobs',
            color: 'bg-purple-500/20 text-purple-400',
            buttonText: 'View Jobs',
            available: true
        },
        {
            id: 'competitions',
            title: 'Moot Courts',
            description: 'Participate in upcoming moot court competitions and legal debates.',
            icon: Trophy,
            link: '/opportunities/moot-courts',
            color: 'bg-yellow-500/20 text-yellow-400',
            buttonText: 'View Competitions',
            available: true
        },
        {
            id: 'scholarships',
            title: 'Scholarships',
            description: 'Financial aid and scholarship programs for law students.',
            icon: GraduationCap,
            link: '/opportunities/scholarships',
            color: 'bg-red-500/20 text-red-400',
            buttonText: 'Explore Scholarships',
            available: true
        }
    ];

    return (
        <div className="w-full py-12 text-slate-100">
            <Helmet>
                <title>Opportunities - IGNIS JURIS</title>
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-white mb-4"
                    >
                        Career & Learning Opportunities
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-400 max-w-2xl mx-auto"
                    >
                        Advance your legal career with our curated list of opportunities, resources, and challenges.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {opportunities.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-white/5 hover:border-accent/30 flex flex-col group"
                        >
                            <div className="p-8 flex-1">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${item.color}`}>
                                    <item.icon className="h-7 w-7" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                                <p className="text-slate-400 leading-relaxed mb-6">
                                    {item.description}
                                </p>
                            </div>

                            <div className="p-6 bg-black/20 border-t border-white/5">
                                {item.available ? (
                                    <Link
                                        to={item.link}
                                        className="flex items-center justify-center w-full py-3 bg-transparent border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-all group"
                                    >
                                        {item.buttonText}
                                        <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                ) : (
                                    <button
                                        disabled
                                        className="flex items-center justify-center w-full py-3 bg-white/5 text-slate-500 font-bold rounded-lg cursor-not-allowed border border-white/5"
                                    >
                                        Coming Soon
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Opportunities;
