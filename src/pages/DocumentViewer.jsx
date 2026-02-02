import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ActivityService } from '../services/activity-service';
import { ArrowLeft, Copy, Download, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const DocumentViewer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDocument();
    }, [id]);

    const loadDocument = async () => {
        try {
            const data = await ActivityService.getDocument(id);
            setDocument(data);
        } catch (err) {
            console.error("Error loading document:", err);
            setError("Document not found or access denied.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen bg-slate-900 text-white">Loading document...</div>;
    if (error) return <div className="flex justify-center items-center h-screen bg-slate-900 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-slate-900 p-6 text-slate-100">
            <Helmet>
                <title>{document.title} - IGNIS JURIS</title>
            </Helmet>
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back
                    </button>
                    <div className="flex space-x-3">
                        <button
                            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-slate-800 border border-white/20 rounded-lg hover:bg-slate-700 transition-colors"
                            onClick={() => navigator.clipboard.writeText(document.content)}
                        >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Text
                        </button>
                        <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                        </button>
                    </div>
                </div>

                {/* Document View */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800 rounded-xl shadow-lg border border-white/10 overflow-hidden"
                >
                    <div className="bg-black/20 border-b border-white/5 px-8 py-4 flex items-center">
                        <FileText className="h-5 w-5 text-[#c5a572] mr-3" />
                        <h1 className="text-xl font-bold text-white">{document.title}</h1>
                        <span className="ml-4 text-xs bg-blue-900/30 text-blue-300 border border-blue-500/30 px-2 py-1 rounded-full uppercase tracking-wide">
                            {document.type}
                        </span>
                    </div>

                    <div className="p-10 font-serif text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-800 h-[80vh] overflow-y-auto custom-scrollbar">
                        {document.content}
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default DocumentViewer;
