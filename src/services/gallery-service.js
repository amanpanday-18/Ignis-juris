import { supabase } from '../lib/supabase';

export const GalleryService = {
    // Fetch all gallery events
    async getAll() {
        const { data, error } = await supabase
            .from('gallery_events')
            .select('*')
            .order('event_date', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Upload a single image and return its public URL
    async _uploadImage(file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('gallery-images')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('gallery-images')
            .getPublicUrl(fileName);

        return data.publicUrl;
    },

    // Add a new gallery event with multiple images and structured winners
    async add(eventData, imageFiles) {
        // 1. Upload all images in parallel
        const imageUrls = [];

        if (imageFiles && imageFiles.length > 0) {
            const uploadPromises = Array.from(imageFiles).map((file) =>
                this._uploadImage(file)
            );
            const results = await Promise.all(uploadPromises);
            imageUrls.push(...results);
        }

        if (imageUrls.length === 0) {
            imageUrls.push(
                'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80'
            );
        }

        // 2. Insert into DB
        const { data, error } = await supabase
            .from('gallery_events')
            .insert([
                {
                    title: eventData.title,
                    description: eventData.description,
                    event_date: eventData.eventDate,
                    // Legacy single-image column (first image for backward compat)
                    image_url: imageUrls[0],
                    // New multi-image column
                    image_urls: imageUrls,
                    // Structured winners list
                    winners_list: eventData.winnersList || [],
                    // Legacy plain text winners
                    winners: eventData.winnersList
                        ? eventData.winnersList
                              .filter((w) => w.name)
                              .map((w) => (w.position ? `${w.position}: ${w.name}` : w.name))
                              .join('\n')
                        : '',
                },
            ])
            .select();

        if (error) throw error;
        return data[0];
    },

    // Delete a gallery event
    async delete(id) {
        const { error } = await supabase
            .from('gallery_events')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },
};
