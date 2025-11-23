import { supabase } from '../lib/supabase';

export const TemplateService = {
    // Fetch all templates with optional category filter
    async getAll(category = 'all') {
        let query = supabase
            .from('drafting_templates')
            .select('*')
            .order('downloads', { ascending: false });

        if (category && category !== 'all') {
            query = query.eq('category', category);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    // Add a new template with file upload
    async add(templateData, file) {
        let fileUrl = '';

        // 1. Upload File
        if (file) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('template-documents')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data } = supabase.storage
                .from('template-documents')
                .getPublicUrl(filePath);

            fileUrl = data.publicUrl;
        }

        // 2. Insert Data into Table
        const { data, error } = await supabase
            .from('drafting_templates')
            .insert([
                {
                    title: templateData.title,
                    category: templateData.category,
                    description: templateData.description,
                    file_url: fileUrl,
                    downloads: 0
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Increment download count
    async incrementDownloads(id) {
        // First get current count
        const { data: current, error: fetchError } = await supabase
            .from('drafting_templates')
            .select('downloads')
            .eq('id', id)
            .single();

        if (fetchError) return;

        const { error } = await supabase
            .from('drafting_templates')
            .update({ downloads: current.downloads + 1 })
            .eq('id', id);

        if (error) console.error('Error updating download count:', error);
    },

    // Delete a template
    async delete(id) {
        const { error } = await supabase
            .from('drafting_templates')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};

export const templateCategories = [
    { id: 'all', name: 'All Templates' },
    { id: 'affidavits', name: 'Affidavits' },
    { id: 'contracts', name: 'Contracts & Agreements' },
    { id: 'notices', name: 'Legal Notices' },
    { id: 'property', name: 'Property Documents' },
    { id: 'corporate', name: 'Corporate & Business' },
    { id: 'civil', name: 'Civil Plaints' },
    { id: 'criminal', name: 'Criminal Petitions' },
    { id: 'family', name: 'Family & Matrimonial' }
];
