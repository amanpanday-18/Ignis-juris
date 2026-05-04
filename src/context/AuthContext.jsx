import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        // Check active session with a safe guard for errors/timeouts
        const checkSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;
                if (mounted) setUser(session?.user ?? null);
            } catch (error) {
                console.error("Auth initialization error:", error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        checkSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (mounted) setUser(session?.user ?? null);
            if (mounted) setLoading(false); // Ensure loading is false on any auth change
        });

        // Safety timeout to ensure app loads even if Supabase hangs
        const timeoutId = setTimeout(() => {
            if (mounted && loading) {
                console.warn("Auth initialization timed out after 1.5s, forcing load");
                setLoading(false);
            }
        }, 1500); // Reduced from 3000ms to improve perceived performance

        return () => {
            mounted = false;
            subscription.unsubscribe();
            clearTimeout(timeoutId);
        };
    }, []);

    const signUp = async (email, password, name) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name,
                }
            }
        });
        if (error) throw error;
        return data;
    };

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null);
    };

    const signUpWithOTP = async (email, name) => {
        const { data, error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                data: {
                    name: name,
                }
            }
        });
        if (error) throw error;
        return data;
    };

    const verifyOTP = async (email, otp, type = 'email') => {
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type
        });
        if (error) throw error;
        return data;
    };

    return (
        <AuthContext.Provider value={{ user, signUp, signIn, logout, signUpWithOTP, verifyOTP, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
