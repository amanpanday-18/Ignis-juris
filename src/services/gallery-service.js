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

    // Add a new gallery event with image upload
    async add(eventData, imageFile) {
        let imageUrl = null;

        // 1. Upload Image if provided
        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('gallery-images')
                .upload(filePath, imageFile);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data } = supabase.storage
                .from('gallery-images')
                .getPublicUrl(filePath);

            imageUrl = data.publicUrl;
        }

        // 2. Insert Data into Table
        const { data, error } = await supabase
            .from('gallery_events')
            .insert([
                {
                    title: eventData.title,
                    description: eventData.description,
                    event_date: eventData.eventDate,
                    winners: eventData.winners,
                    image_url: imageUrl || 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80' // Default fallback image
                }
            ])
            .select();

        if (error) throw error;
        return data[0];
    },

    // Delete a gallery event
    async delete(id) {
        // Optionally, we could also delete the image from storage here.
        // To keep it simple, we'll just delete the db record.
        const { error } = await supabase
            .from('gallery_events')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};
