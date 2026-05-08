import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, ChevronRight, ChevronLeft, Loader, AlertCircle } from 'lucide-react';
import { QuizService } from '../services/quiz-service';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

const TakeQuiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionId: answer or [answers] }
    const [timeLeft, setTimeLeft] = useState(0); // in seconds
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadQuiz();
    }, [id]);

    useEffect(() => {
        if (timeLeft > 0 && !isSubmitting) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleSubmit(); // Auto-submit when time runs out
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft, isSubmitting]);

    const loadQuiz = async () => {
        try {
            const data = await QuizService.getById(id);
            setQuiz(data);
            setTimeLeft(data.time_limit * 60);
        } catch (error) {
            console.error('Error loading quiz:', error);
            alert('Failed to load quiz.');
            navigate('/quizzes');
        } finally {
            setLoading(false);
        }
    };

    // Handle answer for single-choice questions (MCQ-Single, True/False)
    const handleSingleAnswer = (answer) => {
        const currentQuestion = quiz.questions[currentQuestionIndex];
        setAnswers({
            ...answers,
            [currentQuestion.id]: answer
        });
    };

    // Handle answer for multiple-choice questions (MCQ-Multiple)
    const handleMultipleAnswer = (option) => {
        const currentQuestion = quiz.questions[currentQuestionIndex];
        const currentAnswers = answers[currentQuestion.id] || [];

        let newAnswers;
        if (currentAnswers.includes(option)) {
            newAnswers = currentAnswers.filter(a => a !== option);
        } else {
            newAnswers = [...currentAnswers, option];
        }

        setAnswers({
            ...answers,
            [currentQuestion.id]: newAnswers
        });
    };

    // Handle text answer (Short Answer, Long Answer)
    const handleTextAnswer = (text) => {
        const currentQuestion = quiz.questions[currentQuestionIndex];
        setAnswers({
            ...answers,
            [currentQuestion.id]: text
        });
    };

    // Count words in text
    const countWords = (text) => {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const timeTaken = (quiz.time_limit * 60) - timeLeft;

            const submissionData = {
                quizId: quiz.id,
                userId: user.id,
                answers,
                timeTaken
            };

            const submission = await QuizService.submitAnswers(submissionData);

            // Navigate to success page
            navigate(`/quizzes/${id}/submission-success`, {
                state: {
                    submission,
                    quiz
                }
            });

        } catch (error) {
            console.error('Error submitting quiz:', error);
            console.error('Submission Data:', {
                quizId: quiz.id,
                userId: user.id,
                answers,
                timeTaken: (quiz.time_limit * 60) - timeLeft
            });
            alert(`Failed to submit quiz: ${error.message || 'Unknown error'}`);
            setIsSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <Loader className="animate-spin h-12 w-12 text-accent" />
            </div>
        );
    }

    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Quiz Not Found</h2>
                    <button
                        onClick={() => navigate('/quizzes')}
                        className="text-accent hover:underline"
                    >
                        Back to Quizzes
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
    const currentAnswer = answers[currentQuestion.id];

    return (
        <div className="w-full py-8 text-slate-100">
            <Helmet>
                <title>{quiz.title} - IGNIS JURIS</title>
            </Helmet>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Submission Loading Overlay */}
                {isSubmitting && (
                    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[100]">
                        <div className="text-center">
                            <Loader className="animate-spin h-12 w-12 text-accent mx-auto mb-4" />
                            <p className="text-xl font-bold text-white">Submitting your answers...</p>
                            <p className="text-slate-400 mt-2">Please do not refresh the page.</p>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="bg-slate-800 rounded-xl shadow-lg border border-white/5 p-4 mb-6 flex justify-between items-center sticky top-4 z-10">
                    <div>
                        <h1 className="text-lg font-bold text-white">{quiz.title}</h1>
                        <p className="text-sm text-slate-400">
                            Question {currentQuestionIndex + 1} of {quiz.questions.length}
                        </p>
                    </div>
                    <div className={`flex items-center px-4 py-2 rounded-lg font-mono font-bold ${timeLeft < 60 ? 'bg-red-500/20 text-red-400' : 'bg-primary-light/20 text-blue-400'
                        }`}>
                        <Clock className="h-5 w-5 mr-2" />
                        {formatTime(timeLeft)}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-2.5 mb-6 overflow-hidden">
                    <div
                        className="bg-accent h-2.5 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {/* Question Card */}
                <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-slate-800 rounded-xl shadow-xl border border-white/5 p-8 mb-8"
                >
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-bold text-white leading-relaxed flex-1">
                            {currentQuestion.question_text}
                        </h2>
                        <span className="ml-4 px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-bold">
                            {currentQuestion.points} {currentQuestion.points === 1 ? 'pt' : 'pts'}
                        </span>
                    </div>

                    {/* Render different UI based on question type */}
                    <div className="space-y-3">
                        {/* MCQ - Single Choice */}
                        {currentQuestion.question_type === 'mcq-single' && (
                            <>
                                {currentQuestion.options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSingleAnswer(option)}
                                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${currentAnswer === option
                                            ? 'border-accent bg-accent/10 text-white font-medium shadow-md'
                                            : 'border-white/10 hover:border-white/30 hover:bg-white/5 text-slate-300'
                                            }`}
                                    >
                                        <div className="flex items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold ${currentAnswer === option
                                                ? 'bg-accent text-white'
                                                : 'bg-white/10 text-slate-400'
                                                }`}>
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            {option}
                                        </div>
                                    </button>
                                ))}
                            </>
                        )}

                        {/* MCQ - Multiple Choice */}
                        {currentQuestion.question_type === 'mcq-multiple' && (
                            <>
                                <p className="text-sm text-slate-400 mb-2">Select all that apply</p>
                                {currentQuestion.options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleMultipleAnswer(option)}
                                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${currentAnswer && currentAnswer.includes(option)
                                            ? 'border-accent bg-accent/10 text-white font-medium shadow-md'
                                            : 'border-white/10 hover:border-white/30 hover:bg-white/5 text-slate-300'
                                            }`}
                                    >
                                        <div className="flex items-center">
                                            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center mr-3 ${currentAnswer && currentAnswer.includes(option)
                                                ? 'bg-accent border-accent'
                                                : 'border-white/30'
                                                }`}>
                                                {currentAnswer && currentAnswer.includes(option) && (
                                                    <CheckCircle className="h-4 w-4 text-white" />
                                                )}
                                            </div>
                                            {option}
                                        </div>
                                    </button>
                                ))}
                            </>
                        )}

                        {/* True/False */}
                        {currentQuestion.question_type === 'true-false' && (
                            <>
                                {['True', 'False'].map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleSingleAnswer(option)}
                                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${currentAnswer === option
                                            ? 'border-accent bg-accent/10 text-white font-medium shadow-md'
                                            : 'border-white/10 hover:border-white/30 hover:bg-white/5 text-slate-300'
                                            }`}
                                    >
                                        <div className="flex items-center justify-center font-bold text-lg">
                                            {option}
                                        </div>
                                    </button>
                                ))}
                            </>
                        )}

                        {/* Short Answer */}
                        {currentQuestion.question_type === 'short-answer' && (
                            <div>
                                <input
                                    type="text"
                                    value={currentAnswer || ''}
                                    onChange={(e) => handleTextAnswer(e.target.value)}
                                    maxLength={currentQuestion.char_limit || 500}
                                    className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-slate-400"
                                    placeholder="Type your answer here..."
                                />
                                {currentQuestion.char_limit && (
                                    <p className="text-sm text-slate-400 mt-2">
                                        {(currentAnswer || '').length} / {currentQuestion.char_limit} characters
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Long Answer */}
                        {currentQuestion.question_type === 'long-answer' && (
                            <div>
                                <textarea
                                    value={currentAnswer || ''}
                                    onChange={(e) => handleTextAnswer(e.target.value)}
                                    rows="8"
                                    className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-slate-400 resize-none"
                                    placeholder="Write your detailed answer here..."
                                />
                                {currentQuestion.max_words && (
                                    <div className="flex justify-between items-center mt-2">
                                        <p className={`text-sm ${countWords(currentAnswer || '') > currentQuestion.max_words
                                            ? 'text-red-400'
                                            : 'text-slate-400'
                                            }`}>
                                            {countWords(currentAnswer || '')} / {currentQuestion.max_words} words
                                        </p>
                                        {countWords(currentAnswer || '') > currentQuestion.max_words && (
                                            <p className="text-sm text-red-400 flex items-center">
                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                Exceeds word limit
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="flex items-center px-6 py-3 text-slate-400 font-medium disabled:opacity-50 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5 mr-2" />
                        Previous
                    </button>

                    {isLastQuestion ? (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex items-center px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-lg disabled:opacity-70"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader className="animate-spin h-5 w-5 mr-2" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    Submit Quiz
                                    <CheckCircle className="h-5 w-5 ml-2" />
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentQuestionIndex(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                            className="flex items-center px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
                        >
                            Next
                            <ChevronRight className="h-5 w-5 ml-2" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TakeQuiz;
