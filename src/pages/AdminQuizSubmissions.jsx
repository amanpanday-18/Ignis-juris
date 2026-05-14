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
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#f0ede8' }}>
                <Loader className="animate-spin h-12 w-12 text-[#2d3a2e]" />
            </div>
        );
    }

    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const avgScore = submissions.length > 0
        ? submissions.reduce((sum, s) => sum + (s.total_score || 0), 0) / submissions.length
        : 0;
    const gradedCount = submissions.filter(s => s.is_graded).length;

    return (
        <div className="w-full py-12 min-h-screen" style={{ background: '#f0ede8' }}>
            <Helmet>
                <title>Submissions - {quiz.title} - IGNIS JURIS</title>
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/quizzes')}
                        className="flex items-center text-[#474545] hover:text-[#2d3a2e] mb-4 transition-colors font-bold"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Quizzes
                    </button>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-black text-[#1c1b1b] mb-2 tracking-tight">{quiz.title}</h1>
                            <p className="text-[#474545] font-medium">Viewing all student submissions</p>
                        </div>
                        <button
                            onClick={exportToCSV}
                            className="flex items-center px-5 py-2.5 bg-[#2d3a2e] text-white rounded-lg hover:bg-[#1c1b1b] transition-colors font-bold shadow-md"
                        >
                            <Download className="h-5 w-5 mr-2" />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 border border-[#e5e5e5] shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#474545] text-xs font-bold uppercase tracking-wider">Total Submissions</p>
                                <p className="text-3xl font-black text-[#1c1b1b] mt-1">{submissions.length}</p>
                            </div>
                            <Users className="h-10 w-10 text-blue-600/20" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-[#e5e5e5] shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#474545] text-xs font-bold uppercase tracking-wider">Average Score</p>
                                <p className="text-3xl font-black text-[#2d3a2e] mt-1">{avgScore.toFixed(1)}</p>
                            </div>
                            <Award className="h-10 w-10 text-[#2d3a2e]/20" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-[#e5e5e5] shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#474545] text-xs font-bold uppercase tracking-wider">Fully Graded</p>
                                <p className="text-3xl font-black text-green-600 mt-1">{gradedCount}/{submissions.length}</p>
                            </div>
                            <CheckCircle className="h-10 w-10 text-green-600/20" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-[#e5e5e5] shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#474545] text-xs font-bold uppercase tracking-wider">Total Points</p>
                                <p className="text-3xl font-black text-[#2d3a2e] mt-1">{totalPoints}</p>
                            </div>
                            <Award className="h-10 w-10 text-[#2d3a2e]/20" />
                        </div>
                    </div>
                </div>

                {/* Submissions Table */}
                {submissions.length > 0 ? (
                    <div className="bg-white rounded-2xl shadow-xl border border-[#e5e5e5] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#f9fafb]">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-black text-[#474545] uppercase tracking-widest">Student</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-[#474545] uppercase tracking-widest">Auto Score</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-[#474545] uppercase tracking-widest">Manual Score</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-[#474545] uppercase tracking-widest">Total</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-[#474545] uppercase tracking-widest">Time</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-[#474545] uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-[#474545] uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e5e5e5]">
                                    {submissions.map((submission) => (
                                        <tr key={submission.id} className="hover:bg-[#f9fafb] transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-bold text-[#1c1b1b]">{submission.user?.name || 'Unknown'}</p>
                                                    <p className="text-xs text-[#474545] font-medium">{submission.user?.email || 'N/A'}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-blue-700 font-black">{submission.auto_score || 0}</td>
                                            <td className="px-6 py-4 text-purple-700 font-black">{submission.manual_score || 0}</td>
                                            <td className="px-6 py-4 text-[#2d3a2e] font-black text-lg">{submission.total_score || 0}/{totalPoints}</td>
                                            <td className="px-6 py-4 text-[#474545] font-medium text-sm">{formatTime(submission.time_taken)}</td>
                                            <td className="px-6 py-4">
                                                {submission.is_graded ? (
                                                    <span className="inline-flex items-center px-2 py-1 bg-green-500/10 text-green-700 rounded text-[10px] font-black uppercase tracking-wider border border-green-500/20">
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Graded
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-1 bg-yellow-500/10 text-yellow-700 rounded text-[10px] font-black uppercase tracking-wider border border-yellow-500/20">
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => setSelectedSubmission(submission)}
                                                        className="p-2 bg-[#f9fafb] text-[#2d3a2e] rounded-lg hover:bg-[#2d3a2e] hover:text-white transition-all border border-[#e5e5e5] shadow-sm"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    {!submission.is_graded && (
                                                        <button
                                                            onClick={() => markAsFullyGraded(submission.id)}
                                                            className="px-3 py-1 bg-[#2d3a2e] text-white rounded-lg hover:bg-[#1c1b1b] transition-colors text-xs font-black uppercase tracking-tight shadow-md"
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
                    <div className="bg-white rounded-2xl p-12 text-center border border-[#e5e5e5] shadow-sm">
                        <p className="text-[#474545] text-lg font-medium">No submissions yet.</p>
                    </div>
                )}

                {/* Submission Detail Modal */}
                {selectedSubmission && (
                    <div className="fixed inset-0 bg-[#1c1b1b]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#e5e5e5] shadow-2xl"
                        >
                            <div className="sticky top-0 bg-white border-b border-[#e5e5e5] p-6 flex justify-between items-center z-10">
                                <div>
                                    <h2 className="text-2xl font-black text-[#1c1b1b] tracking-tight">{selectedSubmission.user?.name}'s Submission</h2>
                                    <p className="text-[#474545] font-bold">Total Score: {selectedSubmission.total_score}/{totalPoints}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedSubmission(null)}
                                    className="p-2 rounded-full bg-[#f9fafb] text-[#474545] hover:text-[#1c1b1b] border border-[#e5e5e5]"
                                >
                                    <XCircle className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {quiz.questions.map((question, idx) => {
                                    const userAnswer = selectedSubmission.answers[question.id];
                                    const isTextQuestion = ['short-answer', 'long-answer'].includes(question.question_type);

                                    return (
                                        <div key={question.id} className="bg-[#f9fafb] rounded-xl p-6 border border-[#e5e5e5] relative group shadow-sm">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="font-black text-[#1c1b1b] flex-1 text-lg">
                                                    {idx + 1}. {question.question_text}
                                                </h3>
                                                <span className="text-[10px] font-black text-[#2d3a2e] px-2 py-1 bg-white border border-[#2d3a2e]/20 rounded uppercase tracking-widest">
                                                    {question.points} pts
                                                </span>
                                            </div>

                                            <div className="mb-4">
                                                <p className="text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Student's Answer:</p>
                                                <div className="p-4 bg-white rounded-xl border border-[#e5e5e5] shadow-inner">
                                                    <p className="text-[#1c1b1b] font-medium whitespace-pre-wrap">
                                                        {Array.isArray(userAnswer) ? userAnswer.join(', ') : (userAnswer !== null && userAnswer !== undefined ? String(userAnswer) : 'No answer')}
                                                    </p>
                                                </div>
                                            </div>

                                            {!isTextQuestion && (
                                                <div className="mb-4">
                                                    <p className="text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Correct Answer:</p>
                                                    <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                                        <p className="text-green-800 font-bold text-sm">
                                                            {Array.isArray(question.correct_answer)
                                                                ? question.correct_answer.join(', ')
                                                                : String(question.correct_answer)}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {isTextQuestion && question.correct_answer && (
                                                <div className="mb-4">
                                                    <p className="text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Sample Answer / Keywords:</p>
                                                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                                        <p className="text-blue-800 font-medium text-sm">{question.correct_answer}</p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-[#e5e5e5]">
                                                <button
                                                    onClick={() => handleQuickGrade(selectedSubmission.id, question.id, question.points, 'Marked as correct by instructor')}
                                                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-xs font-black uppercase tracking-wider shadow-sm"
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1.5" />
                                                    Mark Correct
                                                </button>
                                                <button
                                                    onClick={() => handleQuickGrade(selectedSubmission.id, question.id, 0, 'Marked as incorrect by instructor')}
                                                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-xs font-black uppercase tracking-wider shadow-sm"
                                                >
                                                    <XCircle className="h-4 w-4 mr-1.5" />
                                                    Mark Incorrect
                                                </button>
                                                <button
                                                    onClick={() => handleGradeQuestion(selectedSubmission.id, question.id, question)}
                                                    className="flex items-center px-4 py-2 bg-white text-[#2d3a2e] border border-[#2d3a2e] rounded-lg hover:bg-[#2d3a2e] hover:text-white transition-all text-xs font-black uppercase tracking-wider shadow-sm"
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
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-2xl max-w-2xl w-full border border-[#e5e5e5] p-8 shadow-2xl"
                        >
                            <h2 className="text-2xl font-black text-[#1c1b1b] mb-4 tracking-tight">Grade Question</h2>
                            <p className="text-[#474545] font-medium mb-6">{gradingQuestion.question.question_text}</p>

                            <div className="mb-4">
                                <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">
                                    Points Awarded (0 - {gradingQuestion.question.points})
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max={gradingQuestion.question.points}
                                    value={gradeInput.points}
                                    onChange={(e) => setGradeInput({ ...gradeInput, points: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl text-[#1c1b1b] focus:outline-none focus:border-[#2d3a2e] font-bold"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">
                                    Feedback (Optional)
                                </label>
                                <textarea
                                    value={gradeInput.notes}
                                    onChange={(e) => setGradeInput({ ...gradeInput, notes: e.target.value })}
                                    rows="3"
                                    className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl text-[#1c1b1b] resize-none focus:outline-none focus:border-[#2d3a2e] font-medium"
                                    placeholder="Provide feedback to the student..."
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setGradingQuestion(null)}
                                    className="px-6 py-2.5 bg-white text-[#474545] border border-[#e5e5e5] rounded-lg hover:bg-[#f9fafb] transition-colors font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitGrade}
                                    className="px-6 py-2.5 bg-[#2d3a2e] text-white rounded-lg hover:bg-[#1c1b1b] transition-colors font-black shadow-md"
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
