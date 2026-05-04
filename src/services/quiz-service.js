import { supabase } from '../lib/supabase';

export const QuizService = {
    // Fetch all published quizzes (or all for admins)
    async getAll(filters = {}) {
        let query = supabase
            .from('quizzes')
            .select('*')
            .order('created_at', { ascending: false });

        // Filter by category if provided
        if (filters.category && filters.category !== 'all') {
            query = query.eq('category', filters.category);
        }

        // Filter by difficulty if provided
        if (filters.difficulty && filters.difficulty !== 'all') {
            query = query.eq('difficulty', filters.difficulty);
        }

        // If not admin, only show published
        if (!filters.isAdmin) {
            query = query.eq('published', true);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    // Get single quiz by ID with questions
    async getById(id, includeCorrectAnswers = false) {
        const { data, error } = await supabase
            .from('quizzes')
            .select(`
                *,
                questions:quiz_questions(*)
            `)
            .eq('id', id)
            .single();

        if (error) throw error;

        // Sort questions by order
        if (data.questions) {
            data.questions.sort((a, b) => a.order - b.order);

            // Hide correct answers if not published (unless explicitly requested)
            if (!includeCorrectAnswers && !data.answers_published) {
                data.questions = data.questions.map(q => ({
                    ...q,
                    correct_answer: null,
                    explanation: null
                }));
            }
        }

        return data;
    },

    // Add a new quiz
    async add(quizData) {
        const { data, error } = await supabase
            .from('quizzes')
            .insert([
                {
                    title: quizData.title,
                    description: quizData.description,
                    category: quizData.category,
                    difficulty: quizData.difficulty,
                    time_limit: parseInt(quizData.timeLimit) || 10,
                    passing_score: parseInt(quizData.passingScore) || 60,
                    published: quizData.published !== undefined ? quizData.published : true,
                    answers_published: false, // Answers not published by default
                    submission_deadline: quizData.submissionDeadline || null
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Add questions to a quiz
    async addQuestions(quizId, questions) {
        const questionsToInsert = questions.map((q, index) => ({
            quiz_id: quizId,
            question_text: q.questionText,
            question_type: q.questionType,
            options: q.options || null, // Array of strings for MCQ
            correct_answer: q.correctAnswer || null,
            explanation: q.explanation || null,
            points: parseInt(q.points) || 1,
            order: index,
            allow_multiple_answers: q.allowMultipleAnswers || false,
            max_words: q.maxWords || null,
            char_limit: q.charLimit || null
        }));

        const { data, error } = await supabase
            .from('quiz_questions')
            .insert(questionsToInsert)
            .select();

        if (error) throw error;
        return data;
    },

    // Delete a quiz
    async delete(id) {
        const { error } = await supabase
            .from('quizzes')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    // Publish answers for a quiz
    async publishAnswers(quizId) {
        const { data, error } = await supabase
            .from('quizzes')
            .update({ answers_published: true })
            .eq('id', quizId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Unpublish answers for a quiz
    async unpublishAnswers(quizId) {
        const { data, error } = await supabase
            .from('quizzes')
            .update({ answers_published: false })
            .eq('id', quizId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // ========== NEW SUBMISSION SYSTEM ==========

    // Submit quiz answers (no scoring, just save answers)
    async submitAnswers(submissionData) {
        if (!submissionData.quizId || !submissionData.userId) {
            throw new Error('Missing quiz ID or user ID');
        }

        const { data, error } = await supabase
            .from('quiz_submissions')
            .insert([
                {
                    quiz_id: submissionData.quizId,
                    user_id: submissionData.userId,
                    answers: submissionData.answers || {},
                    time_taken: Math.max(0, parseInt(submissionData.timeTaken) || 0),
                    auto_score: 0,
                    manual_score: 0,
                    total_score: 0,
                    is_graded: false
                }
            ])
            .select();

        if (error) {
            console.error('Supabase Insert Error:', error);
            throw error;
        }

        return data && data.length > 0 ? data[0] : null;
    },

    // Get user's submission for a specific quiz
    async getUserSubmission(quizId, userId) {
        const { data, error } = await supabase
            .from('quiz_submissions')
            .select('*')
            .eq('quiz_id', quizId)
            .eq('user_id', userId)
            .order('submitted_at', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
        return data;
    },

    // Get all submissions for a specific user
    async getUserSubmissions(userId) {
        const { data, error } = await supabase
            .from('quiz_submissions')
            .select(`
                *,
                quiz:quizzes(title, answers_published)
            `)
            .eq('user_id', userId)
            .order('submitted_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get all submissions for a quiz (admin only)
    async getQuizSubmissions(quizId) {
        // 1. Get submissions
        const { data: submissions, error } = await supabase
            .from('quiz_submissions')
            .select('*')
            .eq('quiz_id', quizId)
            .order('submitted_at', { ascending: false });

        if (error) throw error;
        if (!submissions || submissions.length === 0) return [];

        // 2. Get profiles for these users manually to avoid relationship issues
        const userIds = [...new Set(submissions.map(s => s.user_id))];
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, name, email')
            .in('id', userIds);

        if (profilesError) {
            console.error('Error fetching profiles:', profilesError);
        }

        // 3. Merge data
        return submissions.map(sub => {
            const userProfile = profiles?.find(p => p.id === sub.user_id);
            return {
                ...sub,
                user: userProfile || { name: 'Unknown User', email: 'No Email' }
            };
        });
    },

    // Publish answers for a quiz (admin only)
    async publishAnswers(quizId) {
        const { data, error } = await supabase
            .from('quizzes')
            .update({ answers_published: true })
            .eq('id', quizId)
            .select()
            .single();

        if (error) throw error;

        // Calculate auto-scores for all submissions
        await this.calculateAutoScores(quizId);

        return data;
    },

    // Unpublish answers (admin only)
    async unpublishAnswers(quizId) {
        const { data, error } = await supabase
            .from('quizzes')
            .update({ answers_published: false })
            .eq('id', quizId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Calculate auto-scores for all submissions of a quiz
    async calculateAutoScores(quizId) {
        // Get quiz with questions
        const quiz = await this.getById(quizId, true);

        // Get all submissions
        const submissions = await this.getQuizSubmissions(quizId);

        // Calculate score for each submission
        for (const submission of submissions) {
            let autoScore = 0;

            // Get any manual overrides for this submission
            const { data: manualGrades } = await supabase
                .from('quiz_question_grades')
                .select('question_id')
                .eq('submission_id', submission.id);

            const overriddenIds = manualGrades?.map(g => g.question_id) || [];

            quiz.questions.forEach(question => {
                // SKIP if this question has been manually graded (overridden)
                if (overriddenIds.includes(question.id)) return;

                const userAnswer = submission.answers[question.id];

                // Only auto-grade MCQ and True/False
                if (['mcq-single', 'true-false'].includes(question.question_type)) {
                    if (userAnswer === question.correct_answer) {
                        autoScore += question.points;
                    }
                } else if (question.question_type === 'mcq-multiple') {
                    // For multiple choice, check if arrays match
                    if (Array.isArray(userAnswer) && Array.isArray(question.correct_answer)) {
                        const sorted1 = [...userAnswer].sort();
                        const sorted2 = [...question.correct_answer].sort();
                        if (JSON.stringify(sorted1) === JSON.stringify(sorted2)) {
                            autoScore += question.points;
                        }
                    }
                }
            });

            // Update submission with auto score
            const { data: updatedSub, error: updateError } = await supabase
                .from('quiz_submissions')
                .update({
                    auto_score: autoScore,
                    total_score: autoScore + (submission.manual_score || 0)
                })
                .eq('id', submission.id)
                .select()
                .single();

            if (updateError) console.error('Error updating auto score:', updateError);
        }
    },

    // Grade a specific question for a submission (admin only)
    async gradeQuestion(submissionId, questionId, pointsAwarded, graderNotes, graderId) {
        if (!submissionId || !questionId) throw new Error('Missing submission or question ID');

        const { data, error } = await supabase
            .from('quiz_question_grades')
            .upsert([
                {
                    submission_id: submissionId,
                    question_id: questionId,
                    points_awarded: parseInt(pointsAwarded) || 0,
                    grader_notes: graderNotes || '',
                    graded_by: graderId || null
                }
            ], {
                onConflict: 'submission_id,question_id'
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase Upsert Error:', error);
            throw error;
        }

        // Recalculate total scores for this submission
        const { data: submission } = await supabase
            .from('quiz_submissions')
            .select('auto_score')
            .eq('id', submissionId)
            .single();

        // Get total manual score
        const { data: grades } = await supabase
            .from('quiz_question_grades')
            .select('points_awarded')
            .eq('submission_id', submissionId);

        const manualScore = grades?.reduce((sum, g) => sum + g.points_awarded, 0) || 0;

        await supabase
            .from('quiz_submissions')
            .update({
                manual_score: manualScore,
                total_score: (submission?.auto_score || 0) + manualScore
            })
            .eq('id', submissionId);

        return data;
    },

    // Update manual score for a submission
    async updateManualScore(submissionId) {
        // Get all grades for this submission
        const { data: grades, error: gradesError } = await supabase
            .from('quiz_question_grades')
            .select('points_awarded')
            .eq('submission_id', submissionId);

        if (gradesError) throw gradesError;

        const manualScore = grades.reduce((sum, grade) => sum + grade.points_awarded, 0);

        // Get current submission
        const { data: submission, error: subError } = await supabase
            .from('quiz_submissions')
            .select('auto_score')
            .eq('id', submissionId)
            .single();

        if (subError) throw subError;

        // Update submission
        const { error: updateError } = await supabase
            .from('quiz_submissions')
            .update({
                manual_score: manualScore,
                total_score: (submission.auto_score || 0) + manualScore
            })
            .eq('id', submissionId);

        if (updateError) throw updateError;
    },

    // Mark submission as fully graded
    async markAsGraded(submissionId, graderId) {
        const { data, error } = await supabase
            .from('quiz_submissions')
            .update({
                is_graded: true,
                graded_by: graderId,
                graded_at: new Date().toISOString()
            })
            .eq('id', submissionId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get grades for a specific submission
    async getSubmissionGrades(submissionId) {
        const { data, error } = await supabase
            .from('quiz_question_grades')
            .select('*')
            .eq('submission_id', submissionId);

        if (error) throw error;
        return data;
    },

    // Calculate results for a user (only if answers are published)
    async calculateUserResults(quizId, userId) {
        const quiz = await this.getById(quizId, true);

        if (!quiz.answers_published) {
            throw new Error('Answers have not been published yet');
        }

        const submission = await this.getUserSubmission(quizId, userId);
        if (!submission) {
            throw new Error('No submission found');
        }

        const grades = await this.getSubmissionGrades(submission.id);
        const gradeMap = {};
        grades.forEach(g => {
            gradeMap[g.question_id] = g;
        });

        return {
            submission,
            quiz,
            grades: gradeMap
        };
    },

    // ========== LEGACY METHODS (for backward compatibility) ==========

    // Submit a quiz attempt (old method, kept for compatibility)
    async submitAttempt(attemptData) {
        const { data, error } = await supabase
            .from('quiz_attempts')
            .insert([
                {
                    quiz_id: attemptData.quizId,
                    user_id: attemptData.userId,
                    score: attemptData.score,
                    total_points: attemptData.totalPoints,
                    percentage: attemptData.percentage,
                    answers: attemptData.answers,
                    time_taken: attemptData.timeTaken
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get user's attempts (old method)
    async getUserAttempts(userId) {
        const { data, error } = await supabase
            .from('quiz_attempts')
            .select(`
                *,
                quiz:quizzes(title, category)
            `)
            .eq('user_id', userId)
            .order('completed_at', { ascending: false });

        if (error) throw error;
        return data;
    }
};
