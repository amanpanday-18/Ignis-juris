import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Home, Briefcase, Shield, UserCheck, AlertCircle, Download, Copy, Check, ArrowLeft, Sparkles } from 'lucide-react';
import { documentTemplates, getTemplateById } from '../data/templates';
import { generateDocument } from '../services/ai-service';

const iconMap = {
    FileText,
    Home,
    Briefcase,
    Shield,
    UserCheck,
    AlertCircle
};

const AIDrafting = () => {
    const [step, setStep] = useState('select'); // 'select', 'form', 'preview'
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [formData, setFormData] = useState({});
    const [generatedDocument, setGeneratedDocument] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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

    const isFormValid = () => {
        if (!selectedTemplate) return false;
        return selectedTemplate.fields
            .filter(field => field.required)
            .every(field => formData[field.name] && formData[field.name].toString().trim() !== '');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <Sparkles className="h-10 w-10 text-accent mr-3" />
                        <h1 className="text-4xl font-bold text-primary">AI Legal Drafting</h1>
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Generate professional legal documents in seconds with our AI-powered drafting assistant
                    </p>
                </div>

                {/* Template Selection */}
                {step === 'select' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {documentTemplates.map((template) => {
                            const Icon = iconMap[template.icon];
                            return (
                                <motion.div
                                    key={template.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleTemplateSelect(template)}
                                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 cursor-pointer hover:border-accent transition-all"
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="p-3 bg-accent/10 rounded-lg">
                                            <Icon className="h-6 w-6 text-accent" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-primary mb-2">{template.name}</h3>
                                            <p className="text-sm text-gray-600">{template.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}

                {/* Form */}
                {step === 'form' && selectedTemplate && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                            <button
                                onClick={handleReset}
                                className="flex items-center text-gray-600 hover:text-accent mb-6 transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Templates
                            </button>

                            <h2 className="text-2xl font-bold text-primary mb-2">{selectedTemplate.name}</h2>
                            <p className="text-gray-600 mb-8">{selectedTemplate.description}</p>

                            <form className="space-y-6">
                                {selectedTemplate.fields.map((field) => (
                                    <div key={field.name}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {field.label}
                                            {field.required && <span className="text-red-500 ml-1">*</span>}
                                        </label>
                                        {field.type === 'textarea' ? (
                                            <textarea
                                                value={formData[field.name] || ''}
                                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                rows={4}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                                                placeholder={`Enter ${field.label.toLowerCase()}`}
                                                required={field.required}
                                            />
                                        ) : (
                                            <input
                                                type={field.type}
                                                value={formData[field.name] || ''}
                                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                                                placeholder={`Enter ${field.label.toLowerCase()}`}
                                                required={field.required}
                                            />
                                        )}
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={handleGenerate}
                                    disabled={!isFormValid() || isGenerating}
                                    className="w-full flex items-center justify-center py-3 px-6 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isGenerating ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Generating Document...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-5 w-5 mr-2" />
                                            Generate Document
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}

                {/* Preview */}
                {step === 'preview' && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="bg-primary text-white p-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedTemplate.name}</h2>
                                    <p className="text-gray-300 text-sm mt-1">Generated successfully</p>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="h-4 w-4 mr-2" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-4 w-4 mr-2" />
                                                Copy
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleDownload}
                                        className="flex items-center px-4 py-2 bg-accent hover:bg-accent-hover rounded-lg transition-colors"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </button>
                                </div>
                            </div>

                            <div className="p-8">
                                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed">
                                    {generatedDocument}
                                </pre>
                            </div>

                            <div className="border-t border-gray-200 p-6 bg-gray-50 flex justify-between">
                                <button
                                    onClick={handleReset}
                                    className="flex items-center px-6 py-2 text-gray-700 hover:text-accent transition-colors"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Create Another Document
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AIDrafting;
