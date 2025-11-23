import { supabase } from '../lib/supabase';

export const NewsService = {
    // Fetch all news
    async getAll() {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;
        return data;
    },



    // Add a new news article with image upload
    async add(newsData, imageFile) {
        let imageUrl = null;

        // 1. Upload Image if provided
        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('news-images')
                .upload(filePath, imageFile);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data } = supabase.storage
                .from('news-images')
                .getPublicUrl(filePath);

            imageUrl = data.publicUrl;
        }

        // 2. Insert Data into Table
        const { data, error } = await supabase
            .from('news')
            .insert([
                {
                    title: newsData.title,
                    excerpt: newsData.excerpt,
                    content: newsData.content,
                    category: newsData.category,
                    author: newsData.author,
                    date: new Date().toISOString(), // Current date
                    image_url: imageUrl || 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80' // Default image
                }
            ])
            .select();

        if (error) throw error;
        return data[0];
    },

    // Delete a news article
    async delete(id) {
        const { error } = await supabase
            .from('news')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};
