import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, AlertCircle, ChevronRight, ChevronLeft, Loader } from 'lucide-react';
import { QuizService } from '../services/quiz-service';
import { useAuth } from '../context/AuthContext';

const TakeQuiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionId: selectedOption }
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

    const handleAnswerSelect = (option) => {
        const currentQuestion = quiz.questions[currentQuestionIndex];
        setAnswers({
            ...answers,
            [currentQuestion.id]: option
        });
    };

    const calculateScore = () => {
        let score = 0;
        let totalPoints = 0;

        quiz.questions.forEach(q => {
            totalPoints += q.points;
            if (answers[q.id] === q.correct_answer) {
                score += q.points;
            }
        });

        return { score, totalPoints };
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const { score, totalPoints } = calculateScore();
            const percentage = Math.round((score / totalPoints) * 100);
            const timeTaken = (quiz.time_limit * 60) - timeLeft;

            const attemptData = {
                quizId: quiz.id,
                userId: user.id,
                score,
                totalPoints,
                percentage,
                answers,
                timeTaken
            };

            const result = await QuizService.submitAttempt(attemptData);

            // Navigate to results page with state
            navigate(`/quizzes/${id}/results`, {
                state: {
                    result,
                    quiz,
                    userAnswers: answers
                }
            });

        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert('Failed to submit quiz. Please try again.');
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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader className="animate-spin h-12 w-12 text-accent" />
            </div>
        );
    }

    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Not Found</h2>
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

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex justify-between items-center sticky top-4 z-10">
                    <div>
                        <h1 className="text-lg font-bold text-primary">{quiz.title}</h1>
                        <p className="text-sm text-gray-500">
                            Question {currentQuestionIndex + 1} of {quiz.questions.length}
                        </p>
                    </div>
                    <div className={`flex items-center px-4 py-2 rounded-lg font-mono font-bold ${timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                        <Clock className="h-5 w-5 mr-2" />
                        {formatTime(timeLeft)}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                    <div
                        className="bg-accent h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {/* Question Card */}
                <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-xl shadow-lg p-8 mb-8"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
                        {currentQuestion.question_text}
                    </h2>

                    <div className="space-y-3">
                        {currentQuestion.question_type === 'mcq' ? (
                            currentQuestion.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswerSelect(option)}
                                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${answers[currentQuestion.id] === option
                                            ? 'border-accent bg-accent/5 text-primary font-medium'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold ${answers[currentQuestion.id] === option
                                                ? 'bg-accent text-white'
                                                : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        {option}
                                    </div>
                                </button>
                            ))
                        ) : (
                            ['True', 'False'].map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleAnswerSelect(option)}
                                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${answers[currentQuestion.id] === option
                                            ? 'border-accent bg-accent/5 text-primary font-medium'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="flex items-center px-6 py-3 text-gray-600 font-medium disabled:opacity-50 hover:text-primary transition-colors"
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
                            className="flex items-center px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-light transition-colors shadow-lg"
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
