import { supabase } from '../lib/supabase';

export const AdvocateService = {
    // Fetch all advocates
    async getAll() {
        const { data, error } = await supabase
            .from('advocates')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Add a new advocate with image upload
    async add(advocateData, imageFile) {
        let imageUrl = null;

        // 1. Upload Image if provided
        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('advocate-images')
                .upload(filePath, imageFile);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data } = supabase.storage
                .from('advocate-images')
                .getPublicUrl(filePath);

            imageUrl = data.publicUrl;
        }

        // 2. Insert Data into Table
        const { data, error } = await supabase
            .from('advocates')
            .insert([
                {
                    name: advocateData.name,
                    specialization: advocateData.specialization,
                    location: advocateData.location,
                    rating: advocateData.rating || 5.0,
                    podcast_title: advocateData.podcastTitle,
                    podcast_duration: advocateData.podcastDuration,
                    image_url: imageUrl || 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=400&q=80' // Default image
                }
            ])
            .select();

        if (error) throw error;
        return data[0];
    },

    // Delete an advocate
    async delete(id) {
        const { error } = await supabase
            .from('advocates')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};
