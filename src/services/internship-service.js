import { supabase } from '../lib/supabase';

export const InternshipService = {
    // Fetch all internships with optional filters
    async getAll(filters = {}) {
        const today = new Date().toISOString().split('T')[0];
        let query = supabase
            .from('internships')
            .select('*')
            .gte('deadline', today) // Only show active listings by default
            .order('created_at', { ascending: false });

        if (filters.type && filters.type !== 'all') {
            query = query.eq('type', filters.type);
        }

        if (filters.location && filters.location !== 'all') {
            // Simple case-insensitive search or exact match depending on need
            // For now, let's assume exact match from a dropdown or similar
            // or we can use ilike for search
            if (filters.location === 'Remote') {
                query = query.eq('type', 'remote');
            } else {
                query = query.ilike('location', `%${filters.location}%`);
            }
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    // Add a new internship
    async add(internshipData) {
        const { data, error } = await supabase
            .from('internships')
            .insert([
                {
                    title: internshipData.title,
                    organization: internshipData.organization,
                    location: internshipData.location,
                    type: internshipData.type,
                    stipend: internshipData.stipend,
                    duration: internshipData.duration,
                    deadline: internshipData.deadline,
                    description: internshipData.description,
                    apply_link: internshipData.applyLink
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete an internship
    async delete(id) {
        const { error } = await supabase
            .from('internships')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};

export const internshipTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'in-office', name: 'In-Office' },
    { id: 'remote', name: 'Remote' },
    { id: 'hybrid', name: 'Hybrid' }
];
