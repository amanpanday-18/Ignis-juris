import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Trash2, Clock, Award, BookOpen, PlayCircle, Loader, Eye, EyeOff, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { QuizService } from '../services/quiz-service';
import { quizCategories, difficultyLevels } from '../data/quiz-data';
import { useAdmin } from '../hooks/useAdmin';
import { useAuth } from '../context/AuthContext';
import AddQuizModal from '../components/AddQuizModal';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../components/PageHeader';
import bgQuizzes from '../assets/more_legal_quizzes.png';

const Quizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [userSubmissions, setUserSubmissions] = useState([]);
    const { isAdmin } = useAdmin();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, [selectedCategory, selectedDifficulty, user?.id]);

    const loadData = async () => {
        setLoading(true);
        try {
            const filters = {
                category: selectedCategory,
                difficulty: selectedDifficulty,
                isAdmin
            };

            const [quizzesData, submissionsData] = await Promise.all([
                QuizService.getAll(filters),
                user?.id ? QuizService.getUserSubmissions(user.id) : Promise.resolve([])
            ]);

            setQuizzes(quizzesData);
            setUserSubmissions(submissionsData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadQuizzes = loadData; // Alias for backward compatibility if needed

    const handleAddQuiz = (newQuiz) => {
        setQuizzes([newQuiz, ...quizzes]);
    };

    const handleDeleteQuiz = async (id) => {
        if (window.confirm('Are you sure you want to delete this quiz?')) {
            try {
                await QuizService.delete(id);
                setQuizzes(quizzes.filter(q => q.id !== id));
            } catch (error) {
                console.error('Error deleting quiz:', error);
                alert('Failed to delete quiz.');
            }
        }
    };

    const handlePublishAnswers = async (quizId) => {
        try {
            await QuizService.publishAnswers(quizId);
            // Reload quizzes to reflect the change
            loadQuizzes();
            alert('Answers published successfully! Students can now view their results.');
        } catch (error) {
            console.error('Error publishing answers:', error);
            alert('Failed to publish answers.');
        }
    };

    const handleUnpublishAnswers = async (quizId) => {
        if (window.confirm('Are you sure you want to unpublish answers? Students will no longer see results.')) {
            try {
                await QuizService.unpublishAnswers(quizId);
                loadQuizzes();
                alert('Answers unpublished successfully.');
            } catch (error) {
                console.error('Error unpublishing answers:', error);
                alert('Failed to unpublish answers.');
            }
        }
    };

    const handleViewSubmissions = (quizId) => {
        navigate(`/admin/quizzes/${quizId}/submissions`);
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy': return 'bg-green-100 text-green-700 border border-green-200';
            case 'medium': return 'bg-amber-100 text-amber-700 border border-amber-200';
            case 'hard': return 'bg-red-100 text-red-700 border border-red-200';
            default: return 'bg-gray-100 text-gray-700 border border-gray-200';
        }
    };

    return (
        <div className="w-full min-h-screen" style={{ background: '#f0ede8' }}>
            <Helmet>
                <title>Legal Quizzes - IGNIS JURIS</title>
            </Helmet>

            <PageHeader
                label="/QUIZZES"
                title="Legal Quizzes & Tests"
                description="Test your legal knowledge with our comprehensive quizzes on various law subjects."
                bgImage={bgQuizzes}
                action={isAdmin && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center px-5 py-2.5 bg-white text-[#3d4f38] rounded-full hover:bg-white/90 transition-colors font-bold text-sm"
                    >
                        <Plus className="h-4 w-4 mr-2" />Create Quiz
                    </button>
                )}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Filters */}
                <div className="flex flex-col gap-6 mb-12">
                    <div className="flex flex-wrap justify-center gap-3">
                        {quizCategories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-6 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md border ${selectedCategory === cat.id
                                    ? 'bg-[#2d3a2e] text-white border-[#2d3a2e] shadow-lg'
                                    : 'bg-white text-[#474545] border-[#e5e5e5] hover:bg-[#f3f3f3]'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                        {difficultyLevels.map((diff) => (
                            <button
                                key={diff.id}
                                onClick={() => setSelectedDifficulty(diff.id)}
                                className={`px-5 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all shadow-sm border ${selectedDifficulty === diff.id
                                    ? 'bg-[#474545] text-white border-[#474545] shadow-md'
                                    : 'bg-white text-[#474545] border-[#e5e5e5] hover:bg-[#f3f3f3]'
                                    }`}
                            >
                                {diff.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quiz Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader className="animate-spin h-12 w-12 text-accent" />
                    </div>
                ) : quizzes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quizzes.map((quiz, index) => (
                            <motion.div
                                key={quiz.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl shadow-sm border border-[#e5e5e5] overflow-hidden hover:shadow-xl transition-all relative group hover:border-[#2d3a2e]/30"
                            >
                                {/* Admin Controls */}
                                {isAdmin && (
                                    <div className="absolute top-4 right-4 z-10 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewSubmissions(quiz.id);
                                            }}
                                            className="p-2 bg-[#f9fafb] text-[#474545] border border-[#e5e5e5] rounded-full hover:text-[#1c1b1b] shadow-sm transition-all"
                                            title="View Submissions"
                                        >
                                            <Users className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteQuiz(quiz.id);
                                            }}
                                            className="p-2 bg-red-50 text-red-600 border border-red-100 rounded-full hover:bg-red-600 hover:text-white shadow-sm transition-all"
                                            title="Delete Quiz"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getDifficultyColor(quiz.difficulty)}`}>
                                            {quiz.difficulty}
                                        </span>
                                        <span className="text-[10px] font-black text-[#474545] uppercase tracking-widest">
                                            {quizCategories.find(c => c.id === quiz.category)?.name || quiz.category}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-black text-[#1c1b1b] mb-2 group-hover:text-[#2d3a2e] transition-colors">{quiz.title}</h3>
                                    <p className="text-[#474545] text-sm mb-4 line-clamp-2 leading-relaxed">{quiz.description}</p>

                                    {/* Admin: Answers Published Status */}
                                    {isAdmin && (
                                        <div className="mb-3">
                                            {quiz.answers_published ? (
                                                <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 border border-green-100 rounded text-[10px] font-black uppercase tracking-widest">
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    Answers Published
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded text-[10px] font-black uppercase tracking-widest">
                                                    <EyeOff className="h-3 w-3 mr-1" />
                                                    Answers Hidden
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between text-xs font-bold text-[#474545] mb-6">
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-1.5 text-[#2d3a2e]" />
                                            {quiz.time_limit} MINS
                                        </div>
                                        <div className="flex items-center">
                                            <BookOpen className="h-4 w-4 mr-1.5 text-[#2d3a2e]" />
                                            PASS: {quiz.passing_score}%
                                        </div>
                                    </div>

                                    {isAdmin ? (
                                        <div className="space-y-2">
                                            {quiz.answers_published ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUnpublishAnswers(quiz.id);
                                                    }}
                                                    className="w-full flex items-center justify-center py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                                                >
                                                    <EyeOff className="h-4 w-4 mr-2" />
                                                    Unpublish Answers
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePublishAnswers(quiz.id);
                                                    }}
                                                    className="w-full flex items-center justify-center py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors text-sm"
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Publish Answers
                                                </button>
                                            )}
                                            <button
                                                onClick={() => navigate(`/quizzes/${quiz.id}`)}
                                                className="w-full flex items-center justify-center py-3 bg-[#2d3a2e] text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-[#1c1b1b] transition-all shadow-md"
                                            >
                                                <PlayCircle className="h-4 w-4 mr-2" />
                                                Preview Quiz
                                            </button>
                                        </div>
                                    ) : (
                                        (() => {
                                            const submission = userSubmissions.find(s => s.quiz_id === quiz.id);
                                            if (submission) {
                                                if (quiz.answers_published) {
                                                    return (
                                                        <button
                                                            onClick={() => navigate(`/quizzes/${quiz.id}/results`)}
                                                            className="w-full flex items-center justify-center py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-lg"
                                                        >
                                                            <Award className="h-5 w-5 mr-2" />
                                                            View Results
                                                        </button>
                                                    );
                                                } else {
                                                    return (
                                                        <div className="w-full py-3 bg-slate-700/50 text-slate-400 font-bold rounded-lg text-center border border-white/5 flex items-center justify-center cursor-default">
                                                            <Clock className="h-5 w-5 mr-2" />
                                                            Grading Pending
                                                        </div>
                                                    );
                                                }
                                            }
                                            return (
                                                <button
                                                    onClick={() => navigate(`/quizzes/${quiz.id}`)}
                                                    className="w-full flex items-center justify-center py-4 bg-[#2d3a2e] text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-[#1c1b1b] transition-all shadow-lg"
                                                >
                                                    <PlayCircle className="h-5 w-5 mr-2" />
                                                    Start Quiz
                                                </button>
                                            );
                                        })()
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#e5e5e5] shadow-sm">
                        <p className="text-[#474545] text-lg font-bold">No quizzes found matching your criteria.</p>
                        <p className="text-[#474545]/60 text-sm mt-1">Try adjusting your filters or check back later.</p>
                    </div>
                )}
            </div>

            <AddQuizModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddQuiz}
            />
        </div>
    );
};

export default Quizzes;
