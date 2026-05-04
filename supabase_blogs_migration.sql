-- Run this in your Supabase SQL Editor

-- Create the blogs table
CREATE TABLE IF NOT EXISTS blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id) NOT NULL,
    author_name TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read approved blogs
CREATE POLICY "Anyone can view approved blogs" ON blogs
    FOR SELECT USING (status = 'approved');

-- Policy: Authenticated users can create blogs
CREATE POLICY "Authenticated users can create blogs" ON blogs
    FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Policy: Users can read their own blogs regardless of status
CREATE POLICY "Users can view own blogs" ON blogs
    FOR SELECT USING (auth.uid() = author_id);

-- Policy: Admins can do everything
-- Note: Replaced "true" with a strict email check for the admin email
CREATE POLICY "Admins can update blogs" ON blogs
    FOR UPDATE USING (auth.jwt() ->> 'email' = 'ignisjuris@gmail.com');

CREATE POLICY "Admins can view all blogs" ON blogs
    FOR SELECT USING (auth.jwt() ->> 'email' = 'ignisjuris@gmail.com');

CREATE POLICY "Admins can delete blogs" ON blogs
    FOR DELETE USING (auth.jwt() ->> 'email' = 'ignisjuris@gmail.com');
