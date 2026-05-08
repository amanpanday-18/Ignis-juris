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
            case 'easy': return 'bg-green-500/20 text-green-400';
            case 'medium': return 'bg-yellow-500/20 text-yellow-400';
            case 'hard': return 'bg-red-500/20 text-red-400';
            default: return 'bg-slate-100/10 text-slate-300';
        }
    };

    return (
        <div className="w-full py-12 text-slate-100">
            <Helmet>
                <title>Legal Quizzes - IGNIS JURIS</title>
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 relative">
                    <div className="flex items-center justify-center mb-4">
                        <Award className="h-10 w-10 text-accent mr-3" />
                        <h1 className="text-4xl font-bold text-white">Legal Quizzes & Tests</h1>
                    </div>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Test your legal knowledge with our comprehensive quizzes on various law subjects
                    </p>

                    {/* Admin Add Button */}
                    {isAdmin && (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="absolute top-0 right-0 flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors shadow-lg"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Create Quiz
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-slate-800 rounded-xl shadow-lg p-6 mb-8 border border-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Filter by Category</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-white"
                            >
                                {quizCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Filter by Difficulty</label>
                            <select
                                value={selectedDifficulty}
                                onChange={(e) => setSelectedDifficulty(e.target.value)}
                                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-white"
                            >
                                {difficultyLevels.map(diff => (
                                    <option key={diff.id} value={diff.id}>{diff.name}</option>
                                ))}
                            </select>
                        </div>
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
                                className="bg-slate-800 rounded-xl shadow-lg border border-white/5 overflow-hidden hover:shadow-xl transition-all relative group hover:border-accent/30"
                            >
                                {/* Admin Controls */}
                                {isAdmin && (
                                    <div className="absolute top-4 right-4 z-10 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewSubmissions(quiz.id);
                                            }}
                                            className="p-2 bg-primary-light/80 text-white rounded-full hover:bg-primary"
                                            title="View Submissions"
                                        >
                                            <Users className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteQuiz(quiz.id);
                                            }}
                                            className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600"
                                            title="Delete Quiz"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getDifficultyColor(quiz.difficulty)}`}>
                                            {quiz.difficulty}
                                        </span>
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            {quizCategories.find(c => c.id === quiz.category)?.name || quiz.category}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{quiz.title}</h3>
                                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{quiz.description}</p>

                                    {/* Admin: Answers Published Status */}
                                    {isAdmin && (
                                        <div className="mb-3">
                                            {quiz.answers_published ? (
                                                <span className="inline-flex items-center px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold">
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    Answers Published
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-bold">
                                                    <EyeOff className="h-3 w-3 mr-1" />
                                                    Answers Hidden
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between text-sm text-slate-500 mb-6">
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-1" />
                                            {quiz.time_limit} mins
                                        </div>
                                        <div className="flex items-center">
                                            <BookOpen className="h-4 w-4 mr-1" />
                                            Pass: {quiz.passing_score}%
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
                                                className="w-full flex items-center justify-center py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
                                            >
                                                <PlayCircle className="h-5 w-5 mr-2" />
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
                                                    className="w-full flex items-center justify-center py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
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
                    <div className="text-center py-12 bg-slate-800 rounded-xl border border-dashed border-white/10">
                        <p className="text-slate-500 text-lg">No quizzes found matching your criteria.</p>
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
