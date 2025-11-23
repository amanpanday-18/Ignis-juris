import { supabase } from '../lib/supabase';

export const JudgementService = {
    // Fetch all judgements with optional filters
    async getAll(filters = {}) {
        let query = supabase
            .from('judgements')
            .select('*')
            .order('date_of_judgement', { ascending: false });

        // Apply filters
        if (filters.court) {
            query = query.eq('court', filters.court);
        }
        if (filters.category) {
            query = query.eq('category', filters.category);
        }
        if (filters.dateFrom) {
            query = query.gte('date_of_judgement', filters.dateFrom);
        }
        if (filters.dateTo) {
            query = query.lte('date_of_judgement', filters.dateTo);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    // Search judgements by query
    async search(searchQuery) {
        const { data, error } = await supabase
            .from('judgements')
            .select('*')
            .or(`case_number.ilike.%${searchQuery}%,case_title.ilike.%${searchQuery}%,summary.ilike.%${searchQuery}%`)
            .order('date_of_judgement', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get single judgement by ID
    async getById(id) {
        const { data, error } = await supabase
            .from('judgements')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    // Add a new judgement with optional PDF upload
    async add(judgementData, pdfFile) {
        let pdfUrl = null;

        // 1. Upload PDF if provided
        if (pdfFile) {
            const fileExt = pdfFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('judgement-files')
                .upload(filePath, pdfFile);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data } = supabase.storage
                .from('judgement-files')
                .getPublicUrl(filePath);

            pdfUrl = data.publicUrl;
        }

        // 2. Insert Data into Table
        const { data, error } = await supabase
            .from('judgements')
            .insert([
                {
                    case_number: judgementData.caseNumber,
                    case_title: judgementData.caseTitle,
                    court: judgementData.court,
                    bench: judgementData.bench,
                    date_of_judgement: judgementData.dateOfJudgement,
                    category: judgementData.category,
                    summary: judgementData.summary,
                    full_text: judgementData.fullText,
                    pdf_url: pdfUrl,
                    keywords: judgementData.keywords || []
                }
            ])
            .select();

        if (error) throw error;
        return data[0];
    },

    // Delete a judgement
    async delete(id) {
        const { error } = await supabase
            .from('judgements')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};
