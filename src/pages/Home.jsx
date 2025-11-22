import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Scale, BookOpen, FileText, Users } from 'lucide-react';

const Home = () => {
    const features = [
        { icon: Users, title: 'Advocates', desc: 'Connect with top legal minds' },
        { icon: Scale, title: 'Judgements', desc: 'Searchable case database' },
        { icon: BookOpen, title: 'Bare Acts', desc: 'Comprehensive legal codes' },
        { icon: FileText, title: 'AI Drafting', desc: 'Automated legal drafts' },
    ];

    const news = [
        { id: 1, title: 'Supreme Court rules on Right to Privacy', date: '2 hours ago', category: 'Constitutional Law' },
        { id: 2, title: 'New amendments to the IT Act proposed', date: '5 hours ago', category: 'Cyber Law' },
        { id: 3, title: 'Bar Council announces new guidelines for internships', date: '1 day ago', category: 'Education' },
    ];

    return (
        <div className="space-y-16 pb-16">
            {/* Hero Section */}
            <section className="relative bg-primary text-white py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                            Justice, <span className="text-accent">Simplified.</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8">
                            Your comprehensive platform for legal resources, expert connections, and AI-powered assistance.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button className="bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
                                Get Started
                            </button>
                            <button className="bg-transparent border-2 border-white hover:bg-white hover:text-primary text-white px-8 py-3 rounded-lg font-semibold transition-all">
                                Learn More
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100"
                        >
                            <feature.icon className="h-10 w-10 text-accent mb-4" />
                            <h3 className="text-xl font-bold text-primary mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Legal News Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-primary">Legal News</h2>
                        <p className="text-gray-600 mt-2">Latest updates from the legal world</p>
                    </div>
                    <button className="text-accent font-semibold flex items-center hover:underline">
                        View All <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {news.map((item) => (
                        <motion.div
                            key={item.id}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100"
                        >
                            <div className="h-48 bg-gray-200 bg-[url('https://images.unsplash.com/photo-1505664194779-8beaceb93744?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center"></div>
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs font-bold text-accent uppercase tracking-wider">{item.category}</span>
                                    <span className="text-xs text-gray-500">{item.date}</span>
                                </div>
                                <h3 className="text-lg font-bold text-primary mb-3 hover:text-accent cursor-pointer transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-3">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
