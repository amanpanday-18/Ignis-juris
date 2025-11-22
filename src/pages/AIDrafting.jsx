import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, FileText, Sparkles, Copy, Download } from 'lucide-react';

const AIDrafting = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = () => {
        if (!input) return;
        setIsGenerating(true);
        // Simulate AI delay
        setTimeout(() => {
            setOutput(`LEGAL NOTICE

To,
[Recipient Name]
[Address]

Subject: Legal Notice for Recovery of Dues

Dear Sir/Madam,

Under the instruction of my client [Client Name], resident of [Client Address], I hereby serve you with the following legal notice:

1. That my client and you entered into an agreement dated [Date] for [Purpose].
2. That despite repeated reminders, you have failed to clear the outstanding dues of Rs. [Amount].
3. That this act of yours is in violation of the terms agreed upon.

I hereby call upon you to pay the said amount within 15 days of receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you at your own risk and cost.

Sincerely,
[Advocate Name]`);
            setIsGenerating(false);
        }, 2000);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 h-[calc(100vh-4rem)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                {/* Input Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                >
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center">
                        <Sparkles className="h-5 w-5 text-accent mr-2" />
                        <h2 className="font-bold text-primary">AI Input</h2>
                    </div>
                    <div className="flex-grow p-4">
                        <textarea
                            className="w-full h-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                            placeholder="Describe the legal document you need... (e.g., 'Draft a legal notice for recovery of money')"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !input}
                            className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-medium transition-all ${isGenerating || !input
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-primary hover:bg-primary-light'
                                }`}
                        >
                            {isGenerating ? (
                                <>
                                    <span className="animate-spin mr-2">⏳</span> Generating...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4 mr-2" /> Generate Draft
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>

                {/* Output Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                >
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center">
                            <FileText className="h-5 w-5 text-primary mr-2" />
                            <h2 className="font-bold text-primary">Generated Draft</h2>
                        </div>
                        <div className="flex space-x-2">
                            <button className="p-2 text-gray-500 hover:text-accent hover:bg-gray-100 rounded-lg transition-colors" title="Copy">
                                <Copy className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-accent hover:bg-gray-100 rounded-lg transition-colors" title="Download">
                                <Download className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <div className="flex-grow p-6 bg-gray-50 overflow-y-auto">
                        {output ? (
                            <pre className="whitespace-pre-wrap font-sans text-gray-800 text-sm leading-relaxed">
                                {output}
                            </pre>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <FileText className="h-16 w-16 mb-4 opacity-20" />
                                <p>Generated content will appear here</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AIDrafting;
