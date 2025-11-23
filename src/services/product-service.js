import { supabase } from '../lib/supabase';

export const ProductService = {
    // Fetch all products with optional filters
    async getAll(filters = {}) {
        let query = supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        // Apply filters
        if (filters.category && filters.category !== 'all') {
            query = query.eq('category', filters.category);
        }
        if (filters.featured) {
            query = query.eq('featured', true);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    // Get single product by ID
    async getById(id) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    // Add a new product with image upload
    async add(productData, imageFile) {
        let imageUrl = null;

        // 1. Upload image if provided
        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, imageFile);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            imageUrl = data.publicUrl;
        }

        // 2. Insert Data into Table
        const { data, error } = await supabase
            .from('products')
            .insert([
                {
                    name: productData.name,
                    description: productData.description,
                    price: parseFloat(productData.price),
                    category: productData.category,
                    image_url: imageUrl,
                    rating: parseFloat(productData.rating) || 0,
                    stock: parseInt(productData.stock) || 0,
                    featured: productData.featured || false
                }
            ])
            .select();

        if (error) throw error;
        return data[0];
    },

    // Delete a product
    async delete(id) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    // Update product stock
    async updateStock(id, newStock) {
        const { data, error } = await supabase
            .from('products')
            .update({ stock: newStock })
            .eq('id', id)
            .select();

        if (error) throw error;
        return data[0];
    }
};
