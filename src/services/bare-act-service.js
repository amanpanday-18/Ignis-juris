import { supabase } from '../lib/supabase';

export const BareActService = {
    // Fetch all acts with optional filters
    async getAll(filters = {}) {
        let query = supabase
            .from('bare_acts')
            .select('*')
            .order('year', { ascending: false });

        // Filter by category
        if (filters.category && filters.category !== 'all') {
            query = query.eq('category', filters.category);
        }

        // Search by title or act number (client-side filtering might be needed for complex search if not using full text search)
        // For simple text match:
        if (filters.search) {
            query = query.ilike('title', `%${filters.search}%`);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    // Add a new act with optional PDF upload
    async add(actData, pdfFile) {
        let contentUrl = actData.contentUrl;

        // 1. Upload PDF if provided
        if (pdfFile) {
            const fileExt = pdfFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('act-documents')
                .upload(filePath, pdfFile);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data } = supabase.storage
                .from('act-documents')
                .getPublicUrl(filePath);

            contentUrl = data.publicUrl;
        }

        // 2. Insert Data into Table
        const { data, error } = await supabase
            .from('bare_acts')
            .insert([
                {
                    title: actData.title,
                    act_number: actData.actNumber,
                    year: parseInt(actData.year),
                    category: actData.category,
                    description: actData.description,
                    content_url: contentUrl
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete an act
    async delete(id) {
        const { error } = await supabase
            .from('bare_acts')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};

export const actCategories = [
    { id: 'all', name: 'All Categories' },
    { id: 'constitutional', name: 'Constitutional Law' },
    { id: 'criminal', name: 'Criminal Law' },
    { id: 'civil', name: 'Civil Law' },
    { id: 'corporate', name: 'Corporate Law' },
    { id: 'labor', name: 'Labor Law' },
    { id: 'family', name: 'Family Law' },
    { id: 'tax', name: 'Tax Law' },
    { id: 'intellectual_property', name: 'Intellectual Property' }
];
