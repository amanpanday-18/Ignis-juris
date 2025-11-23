import React from 'react';
import { X, Download, Calendar, Scale, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { categories } from '../data/judgements-data';

const JudgementDetailModal = ({ judgement, isOpen, onClose }) => {
    if (!isOpen || !judgement) return null;

    const category = categories.find(c => c.id === judgement.category);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden my-8"
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-primary text-white">
                    <div>
                        <h2 className="text-2xl font-bold">{judgement.case_title}</h2>
                        <p className="text-gray-200 text-sm mt-1">{judgement.case_number}</p>
                    </div>
                    <button onClick={onClose} className="text-white hover:text-gray-200">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {/* Metadata */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Court</p>
                            <p className="font-semibold text-sm flex items-center">
                                <Scale className="h-4 w-4 mr-1 text-accent" />
                                {judgement.court}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Category</p>
                            <p className="font-semibold text-sm">{category?.name || judgement.category}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Date</p>
                            <p className="font-semibold text-sm flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-accent" />
                                {formatDate(judgement.date_of_judgement)}
                            </p>
                        </div>
                        {judgement.pdf_url && (
                            <div>
                                <p className="text-xs text-gray-500 mb-1">PDF</p>
                                <a
                                    href={judgement.pdf_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-sm text-accent hover:text-accent-hover font-semibold"
                                >
                                    <Download className="h-4 w-4 mr-1" />
                                    Download
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Bench */}
                    {judgement.bench && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Bench</h3>
                            <p className="text-gray-700">{judgement.bench}</p>
                        </div>
                    )}

                    {/* Summary */}
                    {judgement.summary && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Summary</h3>
                            <p className="text-gray-700 leading-relaxed">{judgement.summary}</p>
                        </div>
                    )}

                    {/* Full Text */}
                    {judgement.full_text && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Full Judgement</h3>
                            <div className="prose prose-sm max-w-none">
                                {judgement.full_text.split('\n\n').map((paragraph, index) => (
                                    <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Keywords */}
                    {judgement.keywords && judgement.keywords.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Keywords</h3>
                            <div className="flex flex-wrap gap-2">
                                {judgement.keywords.map((keyword, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium"
                                    >
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default JudgementDetailModal;
