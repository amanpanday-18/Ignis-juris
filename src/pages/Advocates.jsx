import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Star, MapPin, Phone, Mail } from 'lucide-react';

const Advocates = () => {
    const advocates = [
        {
            id: 1,
            name: 'Adv. Rajesh Kumar',
            specialization: 'Criminal Law',
            location: 'New Delhi',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            podcastTitle: 'Understanding Bail Procedures',
            podcastDuration: '15 min',
        },
        {
            id: 2,
            name: 'Adv. Priya Sharma',
            specialization: 'Family Law',
            location: 'Mumbai',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            podcastTitle: 'Divorce Laws in India',
            podcastDuration: '22 min',
        },
        {
            id: 3,
            name: 'Adv. Amit Patel',
            specialization: 'Corporate Law',
            location: 'Bangalore',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            podcastTitle: 'Startup Legal Compliance',
            podcastDuration: '18 min',
        },
        {
            id: 4,
            name: 'Adv. Sneha Gupta',
            specialization: 'Intellectual Property',
            location: 'Hyderabad',
            rating: 5.0,
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            podcastTitle: 'Copyright vs Trademark',
            podcastDuration: '12 min',
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
            >
                <h1 className="text-4xl font-bold text-primary mb-4">Top Advocates</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Connect with India's leading legal experts. Listen to their insights and book consultations directly.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {advocates.map((advocate, index) => (
                    <motion.div
                        key={advocate.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow border border-gray-100"
                    >
                        <div className="relative h-64">
                            <img
                                src={advocate.image}
                                alt={advocate.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full flex items-center shadow-sm">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="ml-1 text-sm font-bold text-gray-700">{advocate.rating}</span>
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-primary mb-1">{advocate.name}</h3>
                            <p className="text-accent font-medium mb-3">{advocate.specialization}</p>

                            <div className="flex items-center text-gray-500 text-sm mb-4">
                                <MapPin className="h-4 w-4 mr-1" />
                                {advocate.location}
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg mb-4 border border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Featured Podcast</span>
                                    <Mic className="h-4 w-4 text-accent" />
                                </div>
                                <p className="text-sm font-medium text-gray-800 line-clamp-1">{advocate.podcastTitle}</p>
                                <p className="text-xs text-gray-500">{advocate.podcastDuration}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button className="flex items-center justify-center px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-sm font-medium">
                                    <Mail className="h-4 w-4 mr-2" />
                                    Message
                                </button>
                                <button className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors text-sm font-medium">
                                    <Phone className="h-4 w-4 mr-2" />
                                    Book
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Advocates;
