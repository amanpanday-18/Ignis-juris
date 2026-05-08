import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Trophy, ArrowLeft, Loader, Lock } from 'lucide-react';
import { QuizService } from '../services/quiz-service';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

const QuizResults = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadResults();
    }, [id]);

    const loadResults = async () => {
        try {
            const data = await QuizService.calculateUserResults(id, user.id);
            setResults(data);
        } catch (error) {
            console.error('Error loading results:', error);
            setError(error.message || 'Failed to load results');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const isCorrect = (question, userAnswer) => {
        if (question.question_type === 'mcq-single' || question.question_type === 'true-false') {
            return userAnswer === question.correct_answer;
        } else if (question.question_type === 'mcq-multiple') {
            if (!Array.isArray(userAnswer) || !Array.isArray(question.correct_answer)) return false;
            const sorted1 = [...userAnswer].sort();
            const sorted2 = [...question.correct_answer].sort();
            return JSON.stringify(sorted1) === JSON.stringify(sorted2);
        }
        return null; // For text answers, no auto-check
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <Loader className="animate-spin h-12 w-12 text-accent" />
            </div>
        );
    }

    // Show error if answers not published or no submission found
    if (error) {
        return (
            <div className="w-full py-12 text-slate-100">
                <Helmet>
                    <title>Quiz Results - IGNIS JURIS</title>
                </Helmet>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-800 rounded-xl shadow-xl border border-white/5 p-8 text-center"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-500/20 text-yellow-400 mb-4">
                            <Lock className="h-10 w-10" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            Results Not Available Yet
                        </h1>
                        <p className="text-slate-400 mb-6">
                            {error}
                        </p>
                        <p className="text-slate-500 text-sm mb-6">
                            The instructor will publish the answers and results once all students have completed the quiz.
                            You'll be able to view your detailed results at that time.
                        </p>
                        <button
                            onClick={() => navigate('/quizzes')}
                            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center mx-auto"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Back to Quizzes
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    const { submission, quiz, grades } = results;
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = totalPoints > 0 ? Math.round((submission.total_score / totalPoints) * 100) : 0;
    const passed = percentage >= quiz.passing_score;

    return (
        <div className="w-full py-12 text-slate-100">
            <Helmet>
                <title>Quiz Results - {quiz.title} - IGNIS JURIS</title>
            </Helmet>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Results Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800 rounded-xl shadow-xl border border-white/5 overflow-hidden mb-8"
                >
                    <div className={`p-8 text-center ${passed ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                            {passed ? <Trophy className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {passed ? 'Congratulations!' : 'Keep Practicing!'}
                        </h1>
                        <p className="text-slate-400 mb-6">
                            {passed ? 'You passed the quiz!' : 'You did not pass this time, but you can try again.'}
                        </p>

                        <div className="flex justify-center items-center space-x-8">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary mb-1">
                                    {submission.total_score}/{totalPoints}
                                </div>
                                <div className="text-sm text-slate-500 uppercase tracking-wider">Score</div>
                            </div>
                            <div className="w-px h-16 bg-white/10"></div>
                            <div className="text-center">
                                <div className={`text-4xl font-bold mb-1 ${passed ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                    {percentage}%
                                </div>
                                <div className="text-sm text-slate-500 uppercase tracking-wider">Percentage</div>
                            </div>
                            <div className="w-px h-16 bg-white/10"></div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary mb-1 flex items-center justify-center">
                                    <Clock className="h-6 w-6 mr-2" />
                                    {formatTime(submission.time_taken)}
                                </div>
                                <div className="text-sm text-slate-500 uppercase tracking-wider">Time Taken</div>
                            </div>
                        </div>
                    </div>

                    {/* Score Breakdown */}
                    {(submission.auto_score > 0 || submission.manual_score > 0) && (
                        <div className="p-6 border-t border-white/5 bg-slate-800/50">
                            <div className="flex justify-center space-x-8 text-sm">
                                <div className="text-center">
                                    <p className="text-slate-400">Auto-Graded</p>
                                    <p className="text-lg font-bold text-blue-400">{submission.auto_score} pts</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-slate-400">Manually Graded</p>
                                    <p className="text-lg font-bold text-purple-400">{submission.manual_score} pts</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-slate-400">Total</p>
                                    <p className="text-lg font-bold text-accent">{submission.total_score} pts</p>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Question Review */}
                <h2 className="text-2xl font-bold text-white mb-4">Answer Review</h2>
                <div className="space-y-6">
                    {quiz.questions.map((question, index) => {
                        const userAnswer = submission.answers[question.id];
                        const grade = grades[question.id];
                        const correct = isCorrect(question, userAnswer);
                        const isTextQuestion = ['short-answer', 'long-answer'].includes(question.question_type);

                        return (
                            <motion.div
                                key={question.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-slate-800 rounded-xl shadow-lg border border-white/5 p-6"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-bold text-white flex-1">
                                        {index + 1}. {question.question_text}
                                    </h3>
                                    <div className="ml-4 flex items-center space-x-2">
                                        <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-bold">
                                            {question.points} pts
                                        </span>
                                        {!isTextQuestion && (
                                            correct ? (
                                                <CheckCircle className="h-6 w-6 text-green-400" />
                                            ) : (
                                                <XCircle className="h-6 w-6 text-red-400" />
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Your Answer */}
                                <div className="mb-4">
                                    <p className="text-sm text-slate-400 mb-2">Your Answer:</p>
                                    <div className={`p-3 rounded-lg ${isTextQuestion ? 'bg-primary-light/10 border border-primary-light/20' :
                                            correct ? 'bg-green-500/10 border border-green-500/20' :
                                                'bg-red-500/10 border border-red-500/20'
                                        }`}>
                                        {Array.isArray(userAnswer) ? (
                                            <ul className="list-disc list-inside text-white">
                                                {userAnswer.map((ans, idx) => (
                                                    <li key={idx}>{ans}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-white whitespace-pre-wrap">{userAnswer || 'No answer provided'}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Correct Answer (for auto-graded questions) */}
                                {!isTextQuestion && question.correct_answer && (
                                    <div className="mb-4">
                                        <p className="text-sm text-slate-400 mb-2">Correct Answer:</p>
                                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                                            {Array.isArray(question.correct_answer) ? (
                                                <ul className="list-disc list-inside text-green-300">
                                                    {question.correct_answer.map((ans, idx) => (
                                                        <li key={idx}>{ans}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-green-300">{question.correct_answer}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Manual Grade (for text questions) */}
                                {isTextQuestion && grade && (
                                    <div className="mb-4">
                                        <p className="text-sm text-slate-400 mb-2">Grade:</p>
                                        <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                            <p className="text-purple-300 font-bold">
                                                {grade.points_awarded} / {question.points} points
                                            </p>
                                            {grade.grader_notes && (
                                                <p className="text-slate-300 mt-2 text-sm">
                                                    <span className="font-medium">Feedback:</span> {grade.grader_notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Explanation */}
                                {question.explanation && (
                                    <div>
                                        <p className="text-sm text-slate-400 mb-2">Explanation:</p>
                                        <div className="p-3 rounded-lg bg-primary-light/10 border border-primary-light/20">
                                            <p className="text-blue-200">{question.explanation}</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Actions */}
                <div className="flex justify-center space-x-4 mt-8">
                    <button
                        onClick={() => navigate('/quizzes')}
                        className="px-6 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors flex items-center"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Quizzes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizResults;
