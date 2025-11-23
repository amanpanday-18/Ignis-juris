-- Run this in your Supabase SQL Editor to add the missing columns

ALTER TABLE advocates
ADD COLUMN phone_number TEXT,
ADD COLUMN email TEXT,
ADD COLUMN linkedin_url TEXT,
ADD COLUMN instagram_url TEXT,
ADD COLUMN website_url TEXT;
