import { supabase } from '../lib/supabase';

export const EducationService = {
    // Fetch all resources with optional filters
    async getAll(filters = {}) {
        let query = supabase
            .from('educational_resources')
            .select('*')
            .order('created_at', { ascending: false });

        if (filters.type && filters.type !== 'all') {
            query = query.eq('type', filters.type);
        }

        if (filters.category && filters.category !== 'all') {
            query = query.eq('category', filters.category);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    // Add a new resource
    async add(resourceData, file) {
        let contentUrl = resourceData.contentUrl;

        // 1. Upload File if provided (for PDF/Article)
        if (file) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('education-documents')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data } = supabase.storage
                .from('education-documents')
                .getPublicUrl(filePath);

            contentUrl = data.publicUrl;
        }

        // 2. Insert Data into Table
        const { data, error } = await supabase
            .from('educational_resources')
            .insert([
                {
                    title: resourceData.title,
                    type: resourceData.type,
                    category: resourceData.category,
                    description: resourceData.description,
                    content_url: contentUrl,
                    thumbnail_url: resourceData.thumbnailUrl
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete a resource
    async delete(id) {
        const { error } = await supabase
            .from('educational_resources')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};

export const educationCategories = [
    { id: 'all', name: 'All Subjects' },
    { id: 'constitutional', name: 'Constitutional Law' },
    { id: 'criminal', name: 'Criminal Law' },
    { id: 'civil', name: 'Civil Procedure' },
    { id: 'corporate', name: 'Corporate Law' },
    { id: 'jurisprudence', name: 'Jurisprudence' },
    { id: 'international', name: 'International Law' }
];

export const resourceTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'video', name: 'Video Tutorials' },
    { id: 'pdf', name: 'Lecture Notes (PDF)' },
    { id: 'article', name: 'Articles' }
];
