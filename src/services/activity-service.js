import { supabase } from '../lib/supabase';

export const ActivityService = {
    // --- Activity / History Logs ---

    // Fetch recent 5 items
    async getRecentActivity() {
        const { data, error } = await supabase
            .from('activity_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);

        if (error) throw error;
        return data;
    },

    // Log a new activity
    async logActivity(action_type, item_title, details = null, resource_id = null, external_link = null) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('activity_logs')
            .insert([{
                user_id: user.id,
                action_type,
                item_title,
                details,
                resource_id,
                external_link
            }]);

        if (error) {
            console.error('Error logging activity:', error);
        }
    },

    // Delete an activity log
    async deleteActivity(id) {
        const { error } = await supabase
            .from('activity_logs')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    // --- Documents ---

    // Save a generated document
    async saveDocument(title, content, type = 'Draft') {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('documents')
            .insert([{
                user_id: user.id,
                title,
                content,
                type
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get a document by ID
    async getDocument(id) {
        const { data, error } = await supabase
            .from('documents')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    // --- Daily Usage Stats ---

    // Get usage stats for the last 7 days
    async getWeeklyUsage() {
        // Get date 7 days ago
        const date = new Date();
        date.setDate(date.getDate() - 7);
        const sevenDaysAgo = date.toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('daily_usage')
            .select('date, minutes_spent')
            .gte('date', sevenDaysAgo)
            .order('date', { ascending: true });

        if (error) throw error;
        return data;
    },

    // Get today's usage specifically
    async getTodayUsage() {
        // Use local date (YYYY-MM-DD) to match user's day (IST)
        const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

        const { data, error } = await supabase
            .from('daily_usage')
            .select('minutes_spent')
            .eq('date', today)
            .single();

        if (error && error.code !== 'PGRST116') { // Ignore "Row not found" error
            throw error;
        }

        return data?.minutes_spent || 0;
    },

    // Increment usage by 1 minute (Heartbeat)
    async trackHeartbeat() {
        // Pass local date to ensure we track usage for the user's correct day (IST)
        const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // YYYY-MM-DD

        const { error } = await supabase.rpc('increment_usage', { client_date: today });
        if (error) {
            console.error('Error tracking usage:', error);
        }
    },
    // --- Hearings ---

    // Get upcoming hearings
    async getHearings() {
        const { data, error } = await supabase
            .from('hearings')
            .select('*')
            .gte('hearing_date', new Date().toISOString()) // Only future hearings
            .order('hearing_date', { ascending: true })
            .limit(10);

        if (error) throw error;
        return data;
    },

    // Add a new hearing
    async addHearing(court_name, hearing_date, case_reference, notes = '') {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('hearings')
            .insert([{
                user_id: user.id,
                court_name,
                hearing_date,
                case_reference,
                notes
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
