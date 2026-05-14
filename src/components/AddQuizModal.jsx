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
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden my-8 flex flex-col max-h-[90vh] border border-[#e5e5e5]"
            >
                <div className="flex justify-between items-center p-6 border-b border-[#e5e5e5]">
                    <h2 className="text-xl font-black text-[#1c1b1b] tracking-tight">
                        {step === 1 ? 'Create New Quiz' : 'Add Questions'}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full bg-[#f9fafb] text-[#474545] hover:text-[#1c1b1b] border border-[#e5e5e5] transition-all">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {step === 1 ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Quiz Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={quizData.title}
                                    onChange={handleQuizChange}
                                    className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                                    placeholder="e.g., Constitutional Law Basics"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Description</label>
                                <textarea
                                    name="description"
                                    rows="3"
                                    value={quizData.description}
                                    onChange={handleQuizChange}
                                    className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium resize-none"
                                    placeholder="Brief description of the quiz..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Category *</label>
                                    <select
                                        name="category"
                                        value={quizData.category}
                                        onChange={handleQuizChange}
                                        className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] font-medium"
                                    >
                                        {quizCategories.filter(c => c.id !== 'all').map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Difficulty *</label>
                                    <select
                                        name="difficulty"
                                        value={quizData.difficulty}
                                        onChange={handleQuizChange}
                                        className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] font-medium"
                                    >
                                        {difficultyLevels.filter(d => d.id !== 'all').map(diff => (
                                            <option key={diff.id} value={diff.id}>{diff.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Time Limit (min)</label>
                                    <input
                                        type="number"
                                        name="timeLimit"
                                        min="1"
                                        value={quizData.timeLimit}
                                        onChange={handleQuizChange}
                                        className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Passing Score (%)</label>
                                    <input
                                        type="number"
                                        name="passingScore"
                                        min="1"
                                        max="100"
                                        value={quizData.passingScore}
                                        onChange={handleQuizChange}
                                        className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Submission Deadline (Optional)</label>
                                <input
                                    type="datetime-local"
                                    name="submissionDeadline"
                                    value={quizData.submissionDeadline || ''}
                                    onChange={handleQuizChange}
                                    className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                                />
                                <p className="text-[10px] text-[#474545] font-black uppercase tracking-widest mt-2">Students won't be able to submit after this time</p>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="published"
                                    id="published"
                                    checked={quizData.published}
                                    onChange={handleQuizChange}
                                    className="h-4 w-4 text-[#2d3a2e] focus:ring-[#2d3a2e] border-[#e5e5e5] rounded bg-[#f9fafb]"
                                />
                                <label htmlFor="published" className="ml-2 text-xs font-black text-[#474545] uppercase tracking-widest">
                                    Publish immediately
                                </label>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Added Questions List */}
                            {questions.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-[10px] font-black text-[#474545] uppercase tracking-widest mb-4">Added Questions ({questions.length})</h3>
                                    <div className="space-y-2 max-h-40 overflow-y-auto border border-[#e5e5e5] rounded-xl p-3 bg-[#f9fafb]">
                                        {questions.map((q, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-white border border-[#e5e5e5] p-3 rounded-lg text-sm text-[#1c1b1b] shadow-sm">
                                                <span className="truncate flex-1 font-bold">{idx + 1}. {q.questionText}</span>
                                                <button onClick={() => removeQuestion(idx)} className="text-red-500 hover:text-red-600 ml-2 p-1 rounded-full hover:bg-red-50 transition-all">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Add New Question Form */}
                            <div className="bg-[#f9fafb] p-6 rounded-2xl border border-[#e5e5e5] shadow-sm">
                                <h3 className="text-sm font-black text-[#1c1b1b] uppercase tracking-widest mb-6">Add New Question</h3>

                                <div className="mb-4">
                                    <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Question Text</label>
                                    <textarea
                                        name="questionText"
                                        rows="2"
                                        value={currentQuestion.questionText}
                                        onChange={handleQuestionChange}
                                        className="w-full px-4 py-2.5 bg-white border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium resize-none"
                                        placeholder="Enter question..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Type</label>
                                        <select
                                            name="questionType"
                                            value={currentQuestion.questionType}
                                            onChange={handleQuestionChange}
                                            className="w-full px-4 py-2.5 bg-white border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] font-medium"
                                        >
                                            <option value="mcq-single">MCQ - Single Choice</option>
                                            <option value="mcq-multiple">MCQ - Multiple Choice</option>
                                            <option value="true-false">True/False</option>
                                            <option value="short-answer">Short Answer</option>
                                            <option value="long-answer">Long Answer</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Points</label>
                                        <input
                                            type="number"
                                            name="points"
                                            min="1"
                                            value={currentQuestion.points}
                                            onChange={handleQuestionChange}
                                            className="w-full px-4 py-2.5 bg-white border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Options - Dynamic based on question type */}
                                {(currentQuestion.questionType === 'mcq-single' || currentQuestion.questionType === 'mcq-multiple') && (
                                    <div className="mb-4">
                                        <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-3">
                                            Options {currentQuestion.questionType === 'mcq-multiple' && <span className="text-[10px] text-amber-600">(Multi-answer)</span>}
                                        </label>
                                        <div className="space-y-3">
                                            {currentQuestion.options.map((option, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <span className="w-6 text-xs font-black text-[#474545]">{String.fromCharCode(65 + idx)}</span>
                                                    <input
                                                        type="text"
                                                        value={option}
                                                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                                                        className="flex-1 px-4 py-2 bg-white border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                                                        placeholder={`Option ${idx + 1}`}
                                                    />
                                                    {currentQuestion.questionType === 'mcq-single' ? (
                                                        <input
                                                            type="radio"
                                                            name="correctAnswer"
                                                            checked={currentQuestion.correctAnswer === option && option !== ''}
                                                            onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: option })}
                                                            className="h-5 w-5 text-[#2d3a2e] focus:ring-[#2d3a2e] bg-white border-[#e5e5e5]"
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
                                                            className="h-5 w-5 text-[#2d3a2e] focus:ring-[#2d3a2e] bg-white border-[#e5e5e5] rounded"
                                                            disabled={option === ''}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {currentQuestion.questionType === 'true-false' && (
                                    <div className="mb-4">
                                        <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-3">Correct Answer</label>
                                        <div className="flex gap-6">
                                            {['True', 'False'].map((option) => (
                                                <label key={option} className="flex items-center gap-3 cursor-pointer text-[#1c1b1b] font-bold">
                                                    <input
                                                        type="radio"
                                                        name="correctAnswer"
                                                        checked={currentQuestion.correctAnswer === option}
                                                        onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: option })}
                                                        className="h-5 w-5 text-[#2d3a2e] focus:ring-[#2d3a2e] bg-white border-[#e5e5e5]"
                                                    />
                                                    <span>{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {(currentQuestion.questionType === 'short-answer' || currentQuestion.questionType === 'long-answer') && (
                                    <div className="mb-4">
                                        <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-3">
                                            Sample/Expected Answer (Optional)
                                        </label>
                                        <textarea
                                            value={currentQuestion.correctAnswer}
                                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                                            rows="3"
                                            className="w-full px-4 py-2.5 bg-white border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium resize-none"
                                            placeholder="Enter a sample answer for reference..."
                                        />
                                        {currentQuestion.questionType === 'short-answer' && (
                                            <div className="mt-4">
                                                <label className="block text-[10px] font-black text-[#474545] uppercase tracking-widest mb-2">Char Limit (optional)</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={currentQuestion.charLimit || ''}
                                                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, charLimit: e.target.value ? parseInt(e.target.value) : null })}
                                                    className="w-32 px-4 py-2 bg-white border border-[#e5e5e5] rounded-xl text-[#1c1b1b] text-sm font-bold"
                                                    placeholder="500"
                                                />
                                            </div>
                                        )}
                                        {currentQuestion.questionType === 'long-answer' && (
                                            <div className="mt-4">
                                                <label className="block text-[10px] font-black text-[#474545] uppercase tracking-widest mb-2">Word Limit (optional)</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={currentQuestion.maxWords || ''}
                                                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, maxWords: e.target.value ? parseInt(e.target.value) : null })}
                                                    className="w-32 px-4 py-2 bg-white border border-[#e5e5e5] rounded-xl text-[#1c1b1b] text-sm font-bold"
                                                    placeholder="1000"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="mb-6">
                                    <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Explanation (Optional)</label>
                                    <textarea
                                        name="explanation"
                                        rows="2"
                                        value={currentQuestion.explanation}
                                        onChange={handleQuestionChange}
                                        className="w-full px-4 py-2.5 bg-white border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium resize-none"
                                        placeholder="Explain why the answer is correct..."
                                    />
                                </div>

                                <button
                                    onClick={addQuestion}
                                    className="w-full py-4 bg-white text-[#1c1b1b] font-black uppercase tracking-widest text-xs rounded-xl hover:bg-[#f9fafb] transition-all flex items-center justify-center border border-[#e5e5e5] shadow-sm"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Question to Quiz
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-[#e5e5e5] bg-[#f9fafb]/50 flex justify-between">
                    {step === 2 ? (
                        <button
                            onClick={() => setStep(1)}
                            className="px-6 py-2 text-[#474545] hover:text-[#1c1b1b] font-black uppercase tracking-widest text-xs"
                        >
                            Back
                        </button>
                    ) : (
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-[#474545] hover:text-[#1c1b1b] font-black uppercase tracking-widest text-xs"
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
                            className="px-6 py-2 bg-[#2d3a2e] text-white font-black rounded-xl hover:bg-[#1c1b1b] transition-all shadow-lg"
                        >
                            Next: Add Questions
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading || questions.length === 0}
                            className="px-6 py-2 bg-[#2d3a2e] text-white font-black rounded-xl hover:bg-[#1c1b1b] transition-all shadow-lg disabled:opacity-50 flex items-center"
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
