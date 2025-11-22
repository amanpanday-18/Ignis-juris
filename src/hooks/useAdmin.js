import { useAuth } from '../context/AuthContext';

export const useAdmin = () => {
    const { user } = useAuth();

    // For now, we'll consider any logged-in user as an "admin" to allow you to test easily.
    // In a real app, you'd check: user?.user_metadata?.role === 'admin'
    const isAdmin = !!user;

    return { isAdmin };
};
