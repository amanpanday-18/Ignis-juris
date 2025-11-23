import { supabase } from '../lib/supabase';

export const ScholarshipService = {
    // Fetch all scholarships
    async getAll() {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('scholarships')
            .select('*')
            .gte('deadline', today) // Only show active scholarships by default
            .order('deadline', { ascending: true });

        if (error) throw error;
        return data;
    },

    // Add a new scholarship
    async add(scholarshipData) {
        const { data, error } = await supabase
            .from('scholarships')
            .insert([
                {
                    title: scholarshipData.title,
                    provider: scholarshipData.provider,
                    amount: scholarshipData.amount,
                    deadline: scholarshipData.deadline,
                    eligibility: scholarshipData.eligibility,
                    description: scholarshipData.description,
                    apply_link: scholarshipData.applyLink
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete a scholarship
    async delete(id) {
        const { error } = await supabase
            .from('scholarships')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};
