import { supabase } from '../lib/supabase';

export const JobService = {
    // Fetch all jobs with optional filters
    async getAll(filters = {}) {
        let query = supabase
            .from('job_openings')
            .select('*')
            .order('posted_date', { ascending: false });

        if (filters.experience && filters.experience !== 'all') {
            // Simple exact match for now, could be range based later
            query = query.eq('experience', filters.experience);
        }

        if (filters.location && filters.location !== 'all') {
            query = query.ilike('location', `%${filters.location}%`);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    // Add a new job
    async add(jobData) {
        const { data, error } = await supabase
            .from('job_openings')
            .insert([
                {
                    title: jobData.title,
                    organization: jobData.organization,
                    location: jobData.location,
                    type: jobData.type,
                    experience: jobData.experience,
                    salary: jobData.salary,
                    description: jobData.description,
                    apply_link: jobData.applyLink
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete a job
    async delete(id) {
        const { error } = await supabase
            .from('job_openings')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};

export const experienceLevels = [
    { id: 'all', name: 'All Levels' },
    { id: 'Fresher', name: 'Fresher (0-1 Years)' },
    { id: '1-3 Years', name: 'Junior (1-3 Years)' },
    { id: '3-5 Years', name: 'Mid-Level (3-5 Years)' },
    { id: '5+ Years', name: 'Senior (5+ Years)' }
];
