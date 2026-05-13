-- Supabase Migration for Gallery Feature

-- Create the gallery_events table
CREATE TABLE IF NOT EXISTS public.gallery_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    event_date DATE NOT NULL,
    winners TEXT, -- Can be comma separated list of winners or a text block
    image_url TEXT NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.gallery_events ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public profiles are viewable by everyone."
ON public.gallery_events FOR SELECT
USING ( true );

-- Allow authenticated users to insert gallery events
CREATE POLICY "Authenticated users can insert gallery events"
ON public.gallery_events FOR INSERT
TO authenticated
WITH CHECK ( true );

-- Allow authenticated users to delete gallery events
CREATE POLICY "Authenticated users can delete gallery events"
ON public.gallery_events FOR DELETE
TO authenticated
USING ( true );

-- Create a storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to the gallery-images bucket
CREATE POLICY "Public Access to gallery images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'gallery-images' );

-- Allow authenticated users to upload images to gallery-images bucket
CREATE POLICY "Authenticated users can upload gallery images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'gallery-images' );

-- Allow authenticated users to delete images from gallery-images bucket
CREATE POLICY "Authenticated users can delete gallery images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'gallery-images' );
