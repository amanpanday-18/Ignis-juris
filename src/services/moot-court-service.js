import { supabase } from '../lib/supabase';

export const MootCourtService = {
    // Fetch all moot courts with optional filter
    async getAll(filter = 'upcoming') {
        const today = new Date().toISOString().split('T')[0];
        let query = supabase
            .from('moot_courts')
            .select('*')
            .order('event_date', { ascending: filter === 'upcoming' });

        if (filter === 'upcoming') {
            query = query.gte('event_date', today);
        } else if (filter === 'past') {
            query = query.lt('event_date', today);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    // Add a new moot court
    async add(mootData) {
        const { data, error } = await supabase
            .from('moot_courts')
            .insert([
                {
                    title: mootData.title,
                    organizer: mootData.organizer,
                    registration_deadline: mootData.registrationDeadline,
                    event_date: mootData.eventDate,
                    location: mootData.location,
                    description: mootData.description,
                    official_link: mootData.officialLink,
                    image_url: mootData.imageUrl
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete a moot court
    async delete(id) {
        const { error } = await supabase
            .from('moot_courts')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};
