import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Award, ArrowRight, RotateCcw } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const QuizResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { result, quiz, userAnswers } = location.state || {};

    if (!result || !quiz) {
        navigate('/quizzes');
        return null;
    }

    const passed = result.percentage >= quiz.passing_score;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    return (
        <div className="min-h-screen bg-slate-900 py-12 text-slate-100">
            <Helmet>
                <title>Quiz Results - Legal Remedies</title>
            </Helmet>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Score Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800 rounded-xl shadow-xl overflow-hidden mb-8 border border-white/5"
                >
                    <div className={`p-8 text-center ${passed ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                            {passed ? <Award className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
                        </div>

                        <h1 className="text-3xl font-bold text-white mb-2">
                            {passed ? 'Congratulations! You Passed!' : 'Better Luck Next Time!'}
                        </h1>
                        <p className="text-slate-400 mb-6">
                            You scored {result.score} out of {result.total_points} points
                        </p>

                        <div className="flex justify-center items-center space-x-8">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary mb-1">{result.percentage}%</div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider">Score</div>
                            </div>
                            <div className="w-px h-12 bg-white/10"></div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary mb-1">{formatTime(result.time_taken)}</div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider">Time Taken</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 border-t border-white/5">
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => navigate('/quizzes')}
                                className="px-6 py-2 border border-white/10 rounded-lg font-medium text-slate-300 hover:bg-white/5 transition-colors"
                            >
                                Back to Quizzes
                            </button>
                            <button
                                onClick={() => navigate(`/quizzes/${quiz.id}`)}
                                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center"
                            >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Retake Quiz
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Review Answers */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-4">Review Answers</h2>

                    {quiz.questions.map((question, index) => {
                        const userAnswer = userAnswers[question.id];
                        const isCorrect = userAnswer === question.correct_answer;
                        const isSkipped = !userAnswer;

                        return (
                            <motion.div
                                key={question.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`bg-slate-800 rounded-xl shadow-sm border-l-4 p-6 ${isCorrect ? 'border-green-500' : 'border-red-500'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-lg font-bold text-white flex-1">
                                        <span className="text-slate-500 mr-2">{index + 1}.</span>
                                        {question.question_text}
                                    </h3>
                                    <div className={`flex items-center px-3 py-1 rounded-full text-sm font-bold ${isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        {isCorrect ? (
                                            <>
                                                <CheckCircle className="h-4 w-4 mr-1" /> Correct
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="h-4 w-4 mr-1" /> {isSkipped ? 'Skipped' : 'Incorrect'}
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className={`p-3 rounded-lg border ${isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
                                        }`}>
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Your Answer</span>
                                        <span className={`font-medium ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>{userAnswer || 'Not Answered'}</span>
                                    </div>

                                    {!isCorrect && (
                                        <div className="p-3 rounded-lg border bg-green-500/10 border-green-500/30">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Correct Answer</span>
                                            <span className="font-medium text-green-300">{question.correct_answer}</span>
                                        </div>
                                    )}
                                </div>

                                {question.explanation && (
                                    <div className="bg-blue-500/10 p-4 rounded-lg text-sm text-blue-300 border border-blue-500/20">
                                        <span className="font-bold block mb-1 text-blue-200">Explanation:</span>
                                        {question.explanation}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default QuizResults;
