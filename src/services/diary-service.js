import { supabase } from '../lib/supabase';

export const DiaryService = {
    // Fetch all events for the current user
    async getMyEvents() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('diary_events')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: true })
            .order('time', { ascending: true });

        if (error) throw error;
        return data;
    },

    // Add a new event
    async addEvent(eventData) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('diary_events')
            .insert([
                {
                    user_id: user.id,
                    title: eventData.title,
                    event_type: eventData.eventType,
                    date: eventData.date,
                    time: eventData.time,
                    court: eventData.court,
                    notes: eventData.notes,
                    status: 'upcoming'
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete an event
    async deleteEvent(id) {
        const { error } = await supabase
            .from('diary_events')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    // Update event status
    async updateStatus(id, status) {
        const { error } = await supabase
            .from('diary_events')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};

export const eventTypes = [
    { id: 'hearing', name: 'Court Hearing', color: 'bg-red-100 text-red-700 border-red-200' },
    { id: 'meeting', name: 'Client Meeting', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 'deadline', name: 'Filing Deadline', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { id: 'personal', name: 'Personal', color: 'bg-green-100 text-green-700 border-green-200' }
];
