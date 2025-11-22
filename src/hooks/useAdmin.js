import { useAuth } from '../context/AuthContext';

export const useAdmin = () => {
    const { user } = useAuth();

    // Check if the logged-in user's email matches the admin email
    const ADMIN_EMAIL = 'amanpandayiit@gmail.com';
    const isAdmin = user?.email === ADMIN_EMAIL;

    return { isAdmin };
};
