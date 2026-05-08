import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Home, Briefcase, Shield, UserCheck, AlertCircle, Download, Copy, Check, ArrowLeft, Sparkles, Loader } from 'lucide-react';
import { documentTemplates } from '../data/templates';
import { generateDocument } from '../services/ai-service';
import { ActivityService } from '../services/activity-service';
import { Helmet } from 'react-helmet-async';

const iconMap = {
    FileText,
    Home,
    Briefcase,
    Shield,
    UserCheck,
    AlertCircle
};

const AIDrafting = () => {
    const [step, setStep] = useState('select');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [formData, setFormData] = useState({});
    const [generatedDocument, setGeneratedDocument] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        setStep('editor');
    };

    const handleDownload = () => {
        const blob = new Blob([generatedDocument], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedTemplate.name.replace(/\s+/g, '_')}_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleReset = () => {
        setStep('select');
        setSelectedTemplate(null);
        setFormData({});
        setGeneratedDocument('');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedDocument);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleInputChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const response = await generateDocument(selectedTemplate.id, formData);
            setGeneratedDocument(response.document);
            const savedDoc = await ActivityService.saveDocument(selectedTemplate.name, response.document);
            await ActivityService.logActivity('Draft', selectedTemplate.name, 'Generated via AI Drafting', savedDoc.id);
        } catch (error) {
            console.error('Error generating document:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const isFormValid = () => {
        if (!selectedTemplate) return false;
        return selectedTemplate.fields
            .filter(field => field.required)
            .every(field => formData[field.name] && formData[field.name].toString().trim() !== '');
    };

    const calculateProgress = () => {
        if (!selectedTemplate) return 0;
        const requiredFields = selectedTemplate.fields.filter(f => f.required);
        if (requiredFields.length === 0) return 100;
        const filledFields = requiredFields.filter(f => formData[f.name] && formData[f.name].toString().trim() !== '');
        return Math.round((filledFields.length / requiredFields.length) * 100);
    };

    const progress = calculateProgress();

    return (
        <div className="w-full flex flex-col text-slate-100">
            <Helmet>
                <title>AI Drafting - IGNIS JURIS</title>
                <meta name="description" content="Generate legal documents instantly with our AI-powered drafting tool." />
            </Helmet>

            {/* Minimal Header */}
            <div className="bg-slate-800 border-b border-white/5 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center">
                    <Link to="/" className="text-slate-400 hover:text-white mr-4 transition-colors">
                        <Home className="h-5 w-5" />
                    </Link>
                    <div className="h-6 w-px bg-white/10 mr-4"></div>
                    <div className="flex items-center text-white font-bold text-xl">
                        <Sparkles className="h-6 w-6 text-accent mr-2" />
                        AI Legal Drafting
                    </div>
                </div>
                {selectedTemplate && (
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:block text-sm text-slate-400">
                            Drafting: <span className="font-semibold text-white">{selectedTemplate.name}</span>
                        </div>
                        <button
                            onClick={handleReset}
                            className="text-sm text-slate-400 hover:text-red-400 transition-colors"
                        >
                            Exit Editor
                        </button>
                    </div>
                )}
            </div>

            <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
                <AnimatePresence mode="wait">
                    {!selectedTemplate ? (
                        /* Template Selection Grid */
                        <motion.div
                            key="selection"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-5xl mx-auto"
                        >
                            <div className="text-center mb-12">
                                <h1 className="text-4xl font-bold text-white mb-4">What would you like to draft?</h1>
                                <p className="text-xl text-slate-400">Select a template to get started with our AI assistant</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {documentTemplates.map((template) => {
                                    const Icon = iconMap[template.icon];
                                    return (
                                        <motion.div
                                            key={template.id}
                                            whileHover={{ y: -5, boxShadow: "0 0 20px rgba(99, 102, 241, 0.15)" }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleTemplateSelect(template)}
                                            className="bg-slate-800 rounded-xl p-8 shadow-lg border border-white/5 cursor-pointer group transition-all hover:border-accent/50"
                                        >
                                            <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                                                <Icon className="h-7 w-7 text-accent group-hover:text-white transition-colors duration-300" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-3">{template.name}</h3>
                                            <p className="text-slate-400 leading-relaxed">{template.description}</p>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ) : (
                        /* Split Screen Editor */
                        <motion.div
                            key="editor"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)]"
                        >
                            {/* Left Panel: Smart Form */}
                            <div className="w-full lg:w-1/2 flex flex-col bg-slate-800 rounded-2xl shadow-xl border border-white/10 overflow-hidden">
                                {/* Progress Bar */}
                                <div className="bg-black/20 px-8 py-6 border-b border-white/5">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-semibold text-slate-400">Completion</span>
                                        <span className="text-sm font-bold text-accent">{progress}%</span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-2">
                                        <motion.div
                                            className="bg-accent h-2 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.5 }}
                                        ></motion.div>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                    <h2 className="text-2xl font-bold text-white mb-6">Enter Details</h2>
                                    <form className="space-y-6">
                                        {selectedTemplate.fields.map((field) => (
                                            <div key={field.name}>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                                    {field.label}
                                                    {field.required && <span className="text-red-400 ml-1">*</span>}
                                                </label>
                                                {field.type === 'textarea' ? (
                                                    <textarea
                                                        value={formData[field.name] || ''}
                                                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                        rows={4}
                                                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent text-white placeholder-slate-500 transition-all focus:bg-black/30"
                                                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                                                        required={field.required}
                                                    />
                                                ) : (
                                                    <input
                                                        type={field.type}
                                                        value={formData[field.name] || ''}
                                                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent text-white placeholder-slate-500 transition-all focus:bg-black/30"
                                                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                                                        required={field.required}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </form>
                                </div>

                                <div className="p-8 border-t border-white/5 bg-black/20">
                                    <button
                                        type="button"
                                        onClick={handleGenerate}
                                        disabled={!isFormValid() || isGenerating}
                                        className="w-full relative overflow-hidden flex items-center justify-center py-4 px-6 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-500/20 transform hover:-translate-y-1"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <Loader className="animate-spin h-5 w-5 mr-3" />
                                                Reviewing Information...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="h-5 w-5 mr-2 animate-pulse" />
                                                Generate Document
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Right Panel: Live Preview (Paper Look) */}
                            <div className="w-full lg:w-1/2 flex flex-col h-full lg:h-auto overflow-hidden">
                                <div className="bg-black/20 rounded-2xl p-6 h-full overflow-hidden flex flex-col backdrop-blur-sm border border-white/5 relative">
                                    {/* Toolbar */}
                                    {generatedDocument && (
                                        <div className="absolute top-8 right-8 z-10 flex space-x-2">
                                            <button
                                                onClick={handleCopy}
                                                className="p-2 bg-slate-700 rounded-lg shadow-sm hover:shadow-md text-slate-300 hover:text-white transition-all border border-white/10"
                                                title="Copy Text"
                                            >
                                                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                                            </button>
                                            <button
                                                onClick={handleDownload}
                                                className="p-2 bg-slate-700 rounded-lg shadow-sm hover:shadow-md text-slate-300 hover:text-white transition-all border border-white/10"
                                                title="Download File"
                                            >
                                                <Download className="h-5 w-5" />
                                            </button>
                                        </div>
                                    )}

                                    {/* The Paper */}
                                    <div className="flex-1 overflow-y-auto custom-scrollbar flex justify-center py-4">
                                        <div
                                            className={`bg-slate-800 w-full max-w-[210mm] min-h-[297mm] shadow-2xl p-[20mm] transition-all duration-500 ease-in-out text-slate-200 border border-white/5 ${!generatedDocument ? 'flex items-center justify-center text-center opacity-80' : ''
                                                }`}
                                        >
                                            {isGenerating ? (
                                                <div className="flex flex-col items-center">
                                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-accent mb-4"></div>
                                                    <p className="text-slate-400 font-medium animate-pulse">Drafting your document...</p>
                                                </div>
                                            ) : generatedDocument ? (
                                                <div className="prose prose-invert max-w-none font-serif text-justify leading-relaxed whitespace-pre-wrap text-slate-300">
                                                    {generatedDocument}
                                                </div>
                                            ) : (
                                                <div className="max-w-xs mx-auto">
                                                    <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                        <FileText className="h-10 w-10 text-slate-500" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-slate-300 mb-2">Ready to Draft</h3>
                                                    <p className="text-slate-500">Fill in the details on the left and watch your document come to life here.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AIDrafting;
