import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Trash2 } from 'lucide-react';
import { newsCategories } from '../data/news-data';
import { useAdmin } from '../hooks/useAdmin';

const NewsCard = ({ article, onClick, onDelete }) => {
    const category = newsCategories.find(c => c.id === article.category) || { name: article.category, color: 'bg-gray-100 text-gray-800' };
    const { isAdmin } = useAdmin();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <motion.article
            whileHover={{ y: -4 }}
            onClick={onClick}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden cursor-pointer transition-all hover:shadow-xl group relative"
        >
            {/* Admin Delete Button */}
            {isAdmin && onDelete && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(article.id);
                    }}
                    className="absolute top-2 right-2 z-10 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    title="Delete Article"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            )}

            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-gray-200">
                <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${category.color}`}>
                        {category.name}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-3 line-clamp-2 hover:text-accent transition-colors">
                    {article.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(article.date)}
                        </div>
                        <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {article.author}
                        </div>
                    </div>

                    <div className="flex items-center text-accent font-medium">
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                </div>
            </div>
        </motion.article>
    );
};

export default NewsCard;
