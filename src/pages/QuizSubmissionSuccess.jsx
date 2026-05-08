import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, ArrowRight, Calendar } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const QuizSubmissionSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { quiz, submission } = location.state || {};

    if (!submission || !quiz) {
        navigate('/quizzes');
        return null;
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    };

    return (
        <div className="w-full py-12 text-slate-100">
            <Helmet>
                <title>Quiz Submitted - IGNIS JURIS</title>
            </Helmet>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Success Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-white/5"
                >
                    <div className="p-8 text-center bg-green-500/10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 text-green-400 mb-4">
                            <CheckCircle className="h-10 w-10" />
                        </div>

                        <h1 className="text-3xl font-bold text-white mb-2">
                            Quiz Submitted Successfully!
                        </h1>
                        <p className="text-slate-400 mb-6">
                            Your answers have been saved and submitted to the instructor.
                        </p>

                        <div className="flex justify-center items-center space-x-8">
                            <div className="text-center">
                                <div className="flex items-center justify-center text-2xl font-bold text-primary mb-1">
                                    <Clock className="h-6 w-6 mr-2" />
                                    {formatTime(submission.time_taken)}
                                </div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider">Time Taken</div>
                            </div>
                            <div className="w-px h-12 bg-white/10"></div>
                            <div className="text-center">
                                <div className="flex items-center justify-center text-2xl font-bold text-primary mb-1">
                                    <Calendar className="h-6 w-6 mr-2" />
                                    {formatDate(submission.submitted_at)}
                                </div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider">Submitted At</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 border-t border-white/5">
                        <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20 mb-6">
                            <h3 className="text-blue-200 font-bold mb-2 flex items-center">
                                <CheckCircle className="h-5 w-5 mr-2" />
                                What Happens Next?
                            </h3>
                            <p className="text-blue-300 text-sm">
                                Your instructor will review your submission and publish the correct answers.
                                You'll be able to view your results and score once the answers are published.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-start">
                                <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                                    1
                                </div>
                                <div>
                                    <p className="text-white font-medium">Submission Recorded</p>
                                    <p className="text-slate-400 text-sm">Your answers have been saved securely.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                                    2
                                </div>
                                <div>
                                    <p className="text-white font-medium">Awaiting Grading</p>
                                    <p className="text-slate-400 text-sm">The instructor will review and grade your submission.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-6 h-6 rounded-full bg-slate-600 text-slate-400 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                                    3
                                </div>
                                <div>
                                    <p className="text-slate-400 font-medium">Results Published</p>
                                    <p className="text-slate-500 text-sm">You'll be notified when results are available.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center space-x-4 mt-8">
                            <button
                                onClick={() => navigate('/quizzes')}
                                className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center"
                            >
                                Back to Quizzes
                                <ArrowRight className="h-5 w-5 ml-2" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Quiz Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 bg-slate-800 rounded-xl p-6 border border-white/5"
                >
                    <h2 className="text-lg font-bold text-white mb-2">{quiz.title}</h2>
                    <p className="text-slate-400 text-sm">{quiz.description}</p>
                </motion.div>
            </div>
        </div>
    );
};

export default QuizSubmissionSuccess;
