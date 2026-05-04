-- =====================================================
-- QUIZ SYSTEM MIGRATION SCRIPT
-- University-Style Examination Platform
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 0. CREATE PROFILES TABLE (IF NOT EXISTS)
-- =====================================================

-- Create profiles table to store user metadata
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to check if a user is an admin without RLS recursion
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles (drop first if exists, then create)
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

-- =====================================================
-- 1. UPDATE EXISTING TABLES
-- =====================================================

-- Add new columns to quizzes table
ALTER TABLE quizzes
ADD COLUMN IF NOT EXISTS answers_published BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS submission_deadline TIMESTAMP WITH TIME ZONE;

-- Add new columns to quiz_questions table for different question types
ALTER TABLE quiz_questions
ADD COLUMN IF NOT EXISTS allow_multiple_answers BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS max_words INTEGER,
ADD COLUMN IF NOT EXISTS char_limit INTEGER;

-- =====================================================
-- 2. CREATE NEW TABLES
-- =====================================================

-- Update existing question types to new format
UPDATE quiz_questions 
SET question_type = 'mcq-single' 
WHERE question_type = 'mcq';

-- Create quiz_submissions table to store all user answers
CREATE TABLE IF NOT EXISTS quiz_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  answers JSONB NOT NULL, -- Stores all user answers (format: {questionId: answer or [answers]})
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  time_taken INTEGER, -- in seconds
  auto_score INTEGER DEFAULT 0, -- Auto-calculated score for MCQ/True-False
  manual_score INTEGER DEFAULT 0, -- Manually graded score for text answers
  total_score INTEGER DEFAULT 0, -- Total score
  is_graded BOOLEAN DEFAULT FALSE, -- True when all manual grading is complete
  graded_by UUID REFERENCES auth.users(id), -- Admin who graded
  graded_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(quiz_id, user_id, submitted_at)
);

-- 4. Create quiz_question_grades table for storing individual question grades
CREATE TABLE IF NOT EXISTS quiz_question_grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID REFERENCES quiz_submissions(id) ON DELETE CASCADE,
  question_id UUID REFERENCES quiz_questions(id) ON DELETE CASCADE,
  points_awarded INTEGER NOT NULL,
  grader_notes TEXT,
  graded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  graded_by UUID REFERENCES auth.users(id),
  UNIQUE(submission_id, question_id)
);

-- 5. Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_quiz_id ON quiz_submissions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_user_id ON quiz_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_is_graded ON quiz_submissions(is_graded);
CREATE INDEX IF NOT EXISTS idx_quiz_question_grades_submission_id ON quiz_question_grades(submission_id);

-- 6. Enable RLS
ALTER TABLE quiz_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_question_grades ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for quiz_submissions
DROP POLICY IF EXISTS "Users can insert their own submissions" ON quiz_submissions;
CREATE POLICY "Users can insert their own submissions"
  ON quiz_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own submissions" ON quiz_submissions;
CREATE POLICY "Users can view their own submissions"
  ON quiz_submissions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all submissions" ON quiz_submissions;
CREATE POLICY "Admins can view all submissions"
  ON quiz_submissions FOR SELECT
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can update submissions for grading" ON quiz_submissions;
CREATE POLICY "Admins can update submissions for grading"
  ON quiz_submissions FOR UPDATE
  USING (is_admin());

-- 8. RLS Policies for quiz_question_grades
DROP POLICY IF EXISTS "Admins can insert grades" ON quiz_question_grades;
CREATE POLICY "Admins can insert grades"
  ON quiz_question_grades FOR INSERT
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can view all grades" ON quiz_question_grades;
CREATE POLICY "Admins can view all grades"
  ON quiz_question_grades FOR SELECT
  USING (is_admin());

DROP POLICY IF EXISTS "Users can view their own grades" ON quiz_question_grades;
CREATE POLICY "Users can view their own grades"
  ON quiz_question_grades FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quiz_submissions
      WHERE quiz_submissions.id = quiz_question_grades.submission_id
      AND quiz_submissions.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can update grades" ON quiz_question_grades;
CREATE POLICY "Admins can update grades"
  ON quiz_question_grades FOR UPDATE
  USING (is_admin());

-- 9. Add helpful comments
COMMENT ON COLUMN quizzes.answers_published IS 'Whether correct answers are visible to users';
COMMENT ON COLUMN quizzes.submission_deadline IS 'Optional deadline for quiz submissions';
COMMENT ON COLUMN quiz_questions.allow_multiple_answers IS 'True for MCQ-Multiple type questions';
COMMENT ON COLUMN quiz_questions.max_words IS 'Maximum word count for long-answer questions';
COMMENT ON COLUMN quiz_questions.char_limit IS 'Character limit for short-answer questions';
COMMENT ON TABLE quiz_submissions IS 'Stores user quiz submissions with answers';
COMMENT ON TABLE quiz_question_grades IS 'Stores manual grades for individual questions';
