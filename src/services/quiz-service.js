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
        // Note: RLS policies handle this securely, but good to filter on client too
        if (!filters.isAdmin) {
            query = query.eq('published', true);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    // Get single quiz by ID with questions
    async getById(id) {
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
                    published: quizData.published || false
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
            options: q.options, // Array of strings
            correct_answer: q.correctAnswer,
            explanation: q.explanation,
            points: parseInt(q.points) || 1,
            order: index
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

    // Submit a quiz attempt
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

    // Get user's attempts
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
