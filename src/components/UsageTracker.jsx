import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ActivityService } from '../services/activity-service';

const UsageTracker = () => {
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        // Initial ping removed to prevent double-counting in React Strict Mode (Development)
        // ActivityService.trackHeartbeat();

        // Ping every 60 seconds (1 minute)
        const interval = setInterval(() => {
            // Only track if tab is focused (optional optimization, but good for "active" time)
            if (document.visibilityState === 'visible') {
                ActivityService.trackHeartbeat();
            }
        }, 60000);

        return () => clearInterval(interval);
    }, [user]);

    return null; // This component renders nothing
};

export default UsageTracker;
