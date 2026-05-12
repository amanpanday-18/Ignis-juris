-- ============================================================
-- Gallery Migration v2: Multiple photos + structured winners
-- Run this in Supabase SQL Editor
-- ============================================================

-- Add image_urls array column (for multiple photos per event)
ALTER TABLE public.gallery_events
    ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT '{}';

-- Migrate existing single image_url into the array
UPDATE public.gallery_events
    SET image_urls = ARRAY[image_url]
    WHERE image_url IS NOT NULL
      AND (image_urls IS NULL OR image_urls = '{}');

-- Add winners_list JSONB column (array of {position, name} objects)
ALTER TABLE public.gallery_events
    ADD COLUMN IF NOT EXISTS winners_list JSONB DEFAULT '[]';

-- Migrate existing plain-text winners into winners_list
-- (skips rows that already have structured data)
UPDATE public.gallery_events
    SET winners_list = jsonb_build_array(jsonb_build_object('position', '', 'name', winners))
    WHERE winners IS NOT NULL
      AND winners != ''
      AND (winners_list IS NULL OR winners_list = '[]'::jsonb);
