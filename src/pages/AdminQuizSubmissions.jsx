import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Clock, Award, Loader, Download, Eye, CheckCircle, XCircle } from 'lucide-react';
import { QuizService } from '../services/quiz-service';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

const AdminQuizSubmissions = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [quiz, setQuiz] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [gradingQuestion, setGradingQuestion] = useState(null);
    const [gradeInput, setGradeInput] = useState({ points: '', notes: '' });

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const [quizData, submissionsData] = await Promise.all([
                QuizService.getById(id, true), // Include correct answers
                QuizService.getQuizSubmissions(id)
            ]);
            setQuiz(quizData);
            setSubmissions(submissionsData);
        } catch (error) {
            console.error('Error loading data:', error);
            alert('Failed to load submissions.');
            navigate('/quizzes');
        } finally {
            setLoading(false);
        }
    };

    const handleGradeQuestion = async (submissionId, questionId, question) => {
        setGradingQuestion({ submissionId, questionId, question });
        setGradeInput({ points: '', notes: '' });
    };

    const submitGrade = async () => {
        if (gradeInput.points === '') {
            alert('Please enter points awarded.');
            return;
        }

        const points = parseInt(gradeInput.points);
        if (points < 0 || points > gradingQuestion.question.points) {
            alert(`Points must be between 0 and ${gradingQuestion.question.points}`);
            return;
        }

        try {
            await QuizService.gradeQuestion(
                gradingQuestion.submissionId,
                gradingQuestion.questionId,
                points,
                gradeInput.notes,
                user.id
            );

            // Reload submissions
            await loadData();
            setGradingQuestion(null);
            alert('Grade saved successfully!');
        } catch (error) {
            console.error('Full Error Object:', error);
            console.error('Error grading question:', error.message || error);
            alert(`Failed to save grade: ${error.message || 'Unknown error'}. Check console for details.`);
        }
    };

    const markAsFullyGraded = async (submissionId) => {
        try {
            await QuizService.markAsGraded(submissionId, user.id);
            await loadData();
            alert('Submission marked as fully graded!');
        } catch (error) {
            console.error('Error marking as graded:', error);
            alert('Failed to mark as graded.');
        }
    };

    const handleQuickGrade = async (submissionId, questionId, points, notes) => {
        try {
            await QuizService.gradeQuestion(
                submissionId,
                questionId,
                points,
                notes,
                user.id
            );
            // Refresh auto scores as well
            await QuizService.calculateAutoScores(quiz.id);
            await loadData();
        } catch (error) {
            console.error('Full Error Object:', error);
            console.error('Error quick grading:', error.message || error);
            alert(`Failed to save grade: ${error.message || 'Unknown error'}. Check console for details.`);
        }
    };

    const exportToCSV = () => {
        if (!submissions || submissions.length === 0) return;

        const headers = ['Student Name', 'Email', 'Auto Score', 'Manual Score', 'Total Score', 'Time Taken (s)', 'Submitted At', 'Graded'];
        const rows = submissions.map(sub => [
            sub.user?.name || 'Unknown',
            sub.user?.email || 'N/A',
            sub.auto_score || 0,
            sub.manual_score || 0,
            sub.total_score || 0,
            sub.time_taken || 0,
            new Date(sub.submitted_at).toLocaleString(),
            sub.is_graded ? 'Yes' : 'No'
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${quiz.title}_submissions.csv`;
        a.click();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <Loader className="animate-spin h-12 w-12 text-accent" />
            </div>
        );
    }

    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const avgScore = submissions.length > 0
        ? submissions.reduce((sum, s) => sum + (s.total_score || 0), 0) / submissions.length
        : 0;
    const gradedCount = submissions.filter(s => s.is_graded).length;

    return (
        <div className="min-h-screen bg-slate-900 py-12 text-slate-100">
            <Helmet>
                <title>Submissions - {quiz.title} - IGNIS JURIS</title>
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/quizzes')}
                        className="flex items-center text-slate-400 hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Quizzes
                    </button>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{quiz.title}</h1>
                            <p className="text-slate-400">Viewing all student submissions</p>
                        </div>
                        <button
                            onClick={exportToCSV}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Download className="h-5 w-5 mr-2" />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-slate-800 rounded-xl p-6 border border-white/5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Total Submissions</p>
                                <p className="text-3xl font-bold text-white mt-1">{submissions.length}</p>
                            </div>
                            <Users className="h-10 w-10 text-blue-400" />
                        </div>
                    </div>
                    <div className="bg-slate-800 rounded-xl p-6 border border-white/5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Average Score</p>
                                <p className="text-3xl font-bold text-accent mt-1">{avgScore.toFixed(1)}</p>
                            </div>
                            <Award className="h-10 w-10 text-accent" />
                        </div>
                    </div>
                    <div className="bg-slate-800 rounded-xl p-6 border border-white/5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Fully Graded</p>
                                <p className="text-3xl font-bold text-green-400 mt-1">{gradedCount}/{submissions.length}</p>
                            </div>
                            <CheckCircle className="h-10 w-10 text-green-400" />
                        </div>
                    </div>
                    <div className="bg-slate-800 rounded-xl p-6 border border-white/5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Total Points</p>
                                <p className="text-3xl font-bold text-primary mt-1">{totalPoints}</p>
                            </div>
                            <Award className="h-10 w-10 text-primary" />
                        </div>
                    </div>
                </div>

                {/* Submissions Table */}
                {submissions.length > 0 ? (
                    <div className="bg-slate-800 rounded-xl shadow-xl border border-white/5 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-700/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Student</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Auto Score</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Manual Score</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Time</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {submissions.map((submission) => (
                                        <tr key={submission.id} className="hover:bg-slate-700/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-white">{submission.user?.name || 'Unknown'}</p>
                                                    <p className="text-sm text-slate-400">{submission.user?.email || 'N/A'}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-blue-400 font-bold">{submission.auto_score || 0}</td>
                                            <td className="px-6 py-4 text-purple-400 font-bold">{submission.manual_score || 0}</td>
                                            <td className="px-6 py-4 text-accent font-bold text-lg">{submission.total_score || 0}/{totalPoints}</td>
                                            <td className="px-6 py-4 text-slate-300">{formatTime(submission.time_taken)}</td>
                                            <td className="px-6 py-4">
                                                {submission.is_graded ? (
                                                    <span className="inline-flex items-center px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold">
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Graded
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-bold">
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => setSelectedSubmission(submission)}
                                                        className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    {!submission.is_graded && (
                                                        <button
                                                            onClick={() => markAsFullyGraded(submission.id)}
                                                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                                                        >
                                                            Mark Graded
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-800 rounded-xl p-12 text-center border border-dashed border-white/10">
                        <p className="text-slate-500 text-lg">No submissions yet.</p>
                    </div>
                )}

                {/* Submission Detail Modal */}
                {selectedSubmission && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
                        >
                            <div className="sticky top-0 bg-slate-800 border-b border-white/10 p-6 flex justify-between items-center z-10">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{selectedSubmission.user?.name}'s Submission</h2>
                                    <p className="text-slate-400">Total Score: {selectedSubmission.total_score}/{totalPoints}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedSubmission(null)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <XCircle className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {quiz.questions.map((question, idx) => {
                                    const userAnswer = selectedSubmission.answers[question.id];
                                    const isTextQuestion = ['short-answer', 'long-answer'].includes(question.question_type);

                                    // Check if this student's question already has a manual grade
                                    // (Note: we'd ideally pass this in from the service, but let's assume auto vs manual)
                                    // For now, let's just allow grading on all

                                    return (
                                        <div key={question.id} className="bg-slate-700/50 rounded-lg p-4 border border-white/5 relative group">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-white flex-1">
                                                    {idx + 1}. {question.question_text}
                                                </h3>
                                                <span className="text-xs font-bold text-slate-400 px-2 py-1 bg-slate-800 rounded">
                                                    {question.points} pts
                                                </span>
                                            </div>

                                            <div className="mb-3">
                                                <p className="text-sm text-slate-400 mb-1">Student's Answer:</p>
                                                <div className="p-3 bg-slate-800 rounded border border-white/5">
                                                    <p className="text-white whitespace-pre-wrap">
                                                        {Array.isArray(userAnswer) ? userAnswer.join(', ') : (userAnswer !== null && userAnswer !== undefined ? String(userAnswer) : 'No answer')}
                                                    </p>
                                                </div>
                                            </div>

                                            {!isTextQuestion && (
                                                <div className="mb-4">
                                                    <p className="text-sm text-slate-400 mb-1">Correct Answer:</p>
                                                    <div className="p-3 bg-green-500/10 rounded border border-green-500/20">
                                                        <p className="text-green-300 text-sm">
                                                            {Array.isArray(question.correct_answer)
                                                                ? question.correct_answer.join(', ')
                                                                : String(question.correct_answer)}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {isTextQuestion && question.correct_answer && (
                                                <div className="mb-4">
                                                    <p className="text-sm text-slate-400 mb-1">Sample Answer / Keywords:</p>
                                                    <div className="p-3 bg-blue-500/10 rounded border border-blue-500/20">
                                                        <p className="text-blue-200 text-sm">{question.correct_answer}</p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/5">
                                                <button
                                                    onClick={() => handleQuickGrade(selectedSubmission.id, question.id, question.points, 'Marked as correct by instructor')}
                                                    className="flex items-center px-3 py-1.5 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600 hover:text-white transition-all text-xs font-bold border border-green-500/20"
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1.5" />
                                                    Mark Correct
                                                </button>
                                                <button
                                                    onClick={() => handleQuickGrade(selectedSubmission.id, question.id, 0, 'Marked as incorrect by instructor')}
                                                    className="flex items-center px-3 py-1.5 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-all text-xs font-bold border border-red-500/20"
                                                >
                                                    <XCircle className="h-4 w-4 mr-1.5" />
                                                    Mark Incorrect
                                                </button>
                                                <button
                                                    onClick={() => handleGradeQuestion(selectedSubmission.id, question.id, question)}
                                                    className="flex items-center px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 hover:text-white transition-all text-xs font-bold"
                                                >
                                                    Custom Grade
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Grading Modal */}
                {gradingQuestion && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-800 rounded-xl max-w-2xl w-full border border-white/10 p-6"
                        >
                            <h2 className="text-2xl font-bold text-white mb-4">Grade Question</h2>
                            <p className="text-slate-300 mb-4">{gradingQuestion.question.question_text}</p>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                    Points Awarded (0 - {gradingQuestion.question.points})
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max={gradingQuestion.question.points}
                                    value={gradeInput.points}
                                    onChange={(e) => setGradeInput({ ...gradeInput, points: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-700 border border-white/10 rounded-lg text-white"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                    Feedback (Optional)
                                </label>
                                <textarea
                                    value={gradeInput.notes}
                                    onChange={(e) => setGradeInput({ ...gradeInput, notes: e.target.value })}
                                    rows="3"
                                    className="w-full px-4 py-2 bg-slate-700 border border-white/10 rounded-lg text-white resize-none"
                                    placeholder="Provide feedback to the student..."
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setGradingQuestion(null)}
                                    className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitGrade}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Save Grade
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminQuizSubmissions;
