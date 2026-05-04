import React, { useState } from 'react';
import { X, Plus, Trash2, Loader, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizService } from '../services/quiz-service';
import { quizCategories, difficultyLevels } from '../data/quiz-data';

const AddQuizModal = ({ isOpen, onClose, onAdd }) => {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Quiz Details, 2: Questions
    const [quizData, setQuizData] = useState({
        title: '',
        description: '',
        category: 'constitutional',
        difficulty: 'medium',
        timeLimit: '10',
        passingScore: '60',
        published: true
    });

    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState({
        questionText: '',
        questionType: 'mcq-single',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
        points: 1
    });

    const handleQuizChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setQuizData({ ...quizData, [e.target.name]: value });
    };

    const handleQuestionChange = (e) => {
        setCurrentQuestion({ ...currentQuestion, [e.target.name]: e.target.value });
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...currentQuestion.options];
        newOptions[index] = value;
        setCurrentQuestion({ ...currentQuestion, options: newOptions });
    };

    const addQuestion = () => {
        if (!currentQuestion.questionText) {
            alert('Please fill in the question text.');
            return;
        }

        // Only require correct answer for MCQ and True/False
        const requiresAnswer = ['mcq-single', 'mcq-multiple', 'true-false'].includes(currentQuestion.questionType);
        if (requiresAnswer && !currentQuestion.correctAnswer) {
            alert('Please select the correct answer.');
            return;
        }

        setQuestions([...questions, currentQuestion]);
        // Reset current question
        setCurrentQuestion({
            questionText: '',
            questionType: 'mcq-single',
            options: ['', '', '', ''],
            correctAnswer: '',
            explanation: '',
            points: 1
        });
    };

    const removeQuestion = (index) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const handleSubmit = async () => {
        if (questions.length === 0) {
            alert('Please add at least one question.');
            return;
        }

        setLoading(true);
        try {
            // 1. Create Quiz
            const newQuiz = await QuizService.add(quizData);

            // 2. Add Questions
            if (newQuiz && newQuiz.id) {
                await QuizService.addQuestions(newQuiz.id, questions);
                onAdd(newQuiz);
                onClose();
                // Reset form
                setStep(1);
                setQuizData({
                    title: '',
                    description: '',
                    category: 'constitutional',
                    difficulty: 'medium',
                    timeLimit: '10',
                    passingScore: '60',
                    published: true
                });
                setQuestions([]);
            }
        } catch (error) {
            console.error('Error creating quiz:', error);
            alert(`Failed to create quiz: ${error.message || JSON.stringify(error)}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden my-8 flex flex-col max-h-[90vh] border border-white/10"
            >
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">
                        {step === 1 ? 'Create New Quiz' : 'Add Questions'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {step === 1 ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Quiz Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={quizData.title}
                                    onChange={handleQuizChange}
                                    className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-500"
                                    placeholder="e.g., Constitutional Law Basics"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    rows="3"
                                    value={quizData.description}
                                    onChange={handleQuizChange}
                                    className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-500"
                                    placeholder="Brief description of the quiz..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Category *</label>
                                    <select
                                        name="category"
                                        value={quizData.category}
                                        onChange={handleQuizChange}
                                        className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white"
                                    >
                                        {quizCategories.filter(c => c.id !== 'all').map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Difficulty *</label>
                                    <select
                                        name="difficulty"
                                        value={quizData.difficulty}
                                        onChange={handleQuizChange}
                                        className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white"
                                    >
                                        {difficultyLevels.filter(d => d.id !== 'all').map(diff => (
                                            <option key={diff.id} value={diff.id}>{diff.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Time Limit (minutes)</label>
                                    <input
                                        type="number"
                                        name="timeLimit"
                                        min="1"
                                        value={quizData.timeLimit}
                                        onChange={handleQuizChange}
                                        className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Passing Score (%)</label>
                                    <input
                                        type="number"
                                        name="passingScore"
                                        min="1"
                                        max="100"
                                        value={quizData.passingScore}
                                        onChange={handleQuizChange}
                                        className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Submission Deadline (Optional)</label>
                                <input
                                    type="datetime-local"
                                    name="submissionDeadline"
                                    value={quizData.submissionDeadline || ''}
                                    onChange={handleQuizChange}
                                    className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-500"
                                />
                                <p className="text-xs text-gray-400 mt-1">Students won't be able to submit after this time</p>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="published"
                                    id="published"
                                    checked={quizData.published}
                                    onChange={handleQuizChange}
                                    className="h-4 w-4 text-accent focus:ring-accent border-gray-600 rounded bg-slate-800"
                                />
                                <label htmlFor="published" className="ml-2 text-sm text-gray-300">
                                    Publish immediately
                                </label>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Added Questions List */}
                            {questions.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-bold text-gray-300 mb-2">Added Questions ({questions.length})</h3>
                                    <div className="space-y-2 max-h-40 overflow-y-auto border border-white/10 rounded-lg p-2 custom-scrollbar">
                                        {questions.map((q, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-slate-800 p-2 rounded text-sm text-gray-200">
                                                <span className="truncate flex-1 font-medium">{idx + 1}. {q.questionText}</span>
                                                <button onClick={() => removeQuestion(idx)} className="text-red-500 hover:text-red-400 ml-2">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Add New Question Form */}
                            <div className="bg-slate-800/50 p-4 rounded-lg border border-white/10">
                                <h3 className="text-md font-bold text-white mb-4">Add New Question</h3>

                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Question Text</label>
                                    <textarea
                                        name="questionText"
                                        rows="2"
                                        value={currentQuestion.questionText}
                                        onChange={handleQuestionChange}
                                        className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-500"
                                        placeholder="Enter question..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                                        <select
                                            name="questionType"
                                            value={currentQuestion.questionType}
                                            onChange={handleQuestionChange}
                                            className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white"
                                        >
                                            <option value="mcq-single">MCQ - Single Choice</option>
                                            <option value="mcq-multiple">MCQ - Multiple Choice</option>
                                            <option value="true-false">True/False</option>
                                            <option value="short-answer">Short Answer</option>
                                            <option value="long-answer">Long Answer</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Points</label>
                                        <input
                                            type="number"
                                            name="points"
                                            min="1"
                                            value={currentQuestion.points}
                                            onChange={handleQuestionChange}
                                            className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-500"
                                        />
                                    </div>
                                </div>

                                {/* Options - Dynamic based on question type */}
                                {(currentQuestion.questionType === 'mcq-single' || currentQuestion.questionType === 'mcq-multiple') && (
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Options {currentQuestion.questionType === 'mcq-multiple' && <span className="text-xs text-yellow-400">(Multiple answers allowed)</span>}
                                        </label>
                                        <div className="space-y-2">
                                            {currentQuestion.options.map((option, idx) => (
                                                <div key={idx} className="flex items-center">
                                                    <span className="w-6 text-sm text-gray-400">{String.fromCharCode(65 + idx)}.</span>
                                                    <input
                                                        type="text"
                                                        value={option}
                                                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                                                        className="flex-1 px-3 py-1 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-500"
                                                        placeholder={`Option ${idx + 1}`}
                                                    />
                                                    {currentQuestion.questionType === 'mcq-single' ? (
                                                        <input
                                                            type="radio"
                                                            name="correctAnswer"
                                                            checked={currentQuestion.correctAnswer === option && option !== ''}
                                                            onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: option })}
                                                            className="ml-2 h-4 w-4 text-accent focus:ring-accent bg-slate-800 border-gray-600"
                                                            disabled={option === ''}
                                                        />
                                                    ) : (
                                                        <input
                                                            type="checkbox"
                                                            checked={Array.isArray(currentQuestion.correctAnswer) && currentQuestion.correctAnswer.includes(option) && option !== ''}
                                                            onChange={(e) => {
                                                                const answers = Array.isArray(currentQuestion.correctAnswer) ? [...currentQuestion.correctAnswer] : [];
                                                                if (e.target.checked) {
                                                                    answers.push(option);
                                                                } else {
                                                                    const idx = answers.indexOf(option);
                                                                    if (idx > -1) answers.splice(idx, 1);
                                                                }
                                                                setCurrentQuestion({ ...currentQuestion, correctAnswer: answers });
                                                            }}
                                                            className="ml-2 h-4 w-4 text-accent focus:ring-accent bg-slate-800 border-gray-600 rounded"
                                                            disabled={option === ''}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {currentQuestion.questionType === 'true-false' && (
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Correct Answer</label>
                                        <div className="flex space-x-4">
                                            {['True', 'False'].map((option) => (
                                                <label key={option} className="flex items-center space-x-2 cursor-pointer text-gray-300">
                                                    <input
                                                        type="radio"
                                                        name="correctAnswer"
                                                        checked={currentQuestion.correctAnswer === option}
                                                        onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: option })}
                                                        className="h-4 w-4 text-accent focus:ring-accent bg-slate-800 border-gray-600"
                                                    />
                                                    <span>{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {(currentQuestion.questionType === 'short-answer' || currentQuestion.questionType === 'long-answer') && (
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Sample/Expected Answer (Optional)
                                        </label>
                                        <textarea
                                            value={currentQuestion.correctAnswer}
                                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                                            rows="3"
                                            className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-500"
                                            placeholder="Enter a sample answer for reference (will be shown to grader)..."
                                        />
                                        {currentQuestion.questionType === 'short-answer' && (
                                            <div className="mt-2">
                                                <label className="block text-xs text-gray-400 mb-1">Character Limit (optional)</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={currentQuestion.charLimit || ''}
                                                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, charLimit: e.target.value ? parseInt(e.target.value) : null })}
                                                    className="w-32 px-3 py-1 bg-slate-800 border border-white/10 rounded-lg text-white text-sm"
                                                    placeholder="500"
                                                />
                                            </div>
                                        )}
                                        {currentQuestion.questionType === 'long-answer' && (
                                            <div className="mt-2">
                                                <label className="block text-xs text-gray-400 mb-1">Word Limit (optional)</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={currentQuestion.maxWords || ''}
                                                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, maxWords: e.target.value ? parseInt(e.target.value) : null })}
                                                    className="w-32 px-3 py-1 bg-slate-800 border border-white/10 rounded-lg text-white text-sm"
                                                    placeholder="1000"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Explanation (Optional)</label>
                                    <textarea
                                        name="explanation"
                                        rows="2"
                                        value={currentQuestion.explanation}
                                        onChange={handleQuestionChange}
                                        className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-gray-500"
                                        placeholder="Explain why the answer is correct..."
                                    />
                                </div>

                                <button
                                    onClick={addQuestion}
                                    className="w-full py-2 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-600 transition-colors flex items-center justify-center border border-white/10"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Question to Quiz
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-white/10 bg-slate-800/30 flex justify-between">
                    {step === 2 ? (
                        <button
                            onClick={() => setStep(1)}
                            className="px-6 py-2 text-gray-400 hover:text-white font-medium"
                        >
                            Back
                        </button>
                    ) : (
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-gray-400 hover:text-white font-medium"
                        >
                            Cancel
                        </button>
                    )}

                    {step === 1 ? (
                        <button
                            onClick={() => {
                                if (quizData.title) setStep(2);
                                else alert('Please enter a quiz title');
                            }}
                            className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-light transition-colors"
                        >
                            Next: Add Questions
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading || questions.length === 0}
                            className="px-6 py-2 bg-accent text-white font-bold rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 flex items-center"
                        >
                            {loading ? (
                                <>
                                    <Loader className="animate-spin h-5 w-5 mr-2" />
                                    Creating Quiz...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                    Finish & Create Quiz
                                </>
                            )}
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AddQuizModal;
