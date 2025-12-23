import React, { useEffect, useState } from 'react';
import { Clock, TrendingUp } from 'lucide-react';
import { ActivityService } from '../../services/activity-service';

const UsageStats = () => {
    const [stats, setStats] = useState([]);
    const [todayUsage, setTodayUsage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await ActivityService.getWeeklyUsage();

            // Format data for chart (ensure all 7 days are present)
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const last7Days = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateStr = d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // IST YYYY-MM-DD
                const dayName = d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'Asia/Kolkata' });

                // Find matching data from DB
                const dayData = data.find(row => row.date === dateStr);
                const hours = dayData ? parseFloat((dayData.minutes_spent / 60).toFixed(1)) : 0;

                last7Days.push({
                    day: dayName,
                    hours: hours,
                    minutes: dayData ? dayData.minutes_spent : 0,
                    // Calculate height percentage (cap at 5 hours default, or max of data)
                    heightPct: 0 // Will calculate below
                });
            }

            // Normalize heights relative to the max value (or 2 hours minimum)
            const maxHours = Math.max(2, ...last7Days.map(d => d.hours));
            const processedStats = last7Days.map(d => ({
                ...d,
                heightPct: (d.hours / maxHours) * 100
            }));

            setStats(processedStats);

            // Set today's usage separately
            const todayMins = await ActivityService.getTodayUsage();
            setTodayUsage(todayMins);

        } catch (error) {
            console.error("Failed to load usage stats:", error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate nice format for today
    const formatDuration = (minutes) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m`;
    };

    return (
        <div className="bg-slate-800 rounded-xl shadow-sm border border-white/5 p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Daily Usage</h3>
                <div className="flex items-center space-x-2">
                    <span className="flex items-center text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
                        <Clock className="h-3 w-3 mr-1" /> {formatDuration(todayUsage)} Today
                    </span>
                </div>
            </div>

            {/* Custom CSS Bar Chart - Crash Proof */}
            <div className="h-64 w-full flex items-end justify-between px-4 pb-4 gap-4 relative">
                {/* Horizontal Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none px-4 pb-8">
                    <div className="border-t border-dashed border-white/5 w-full h-0"></div>
                    <div className="border-t border-dashed border-white/5 w-full h-0"></div>
                    <div className="border-t border-dashed border-white/5 w-full h-0"></div>
                    <div className="border-t border-dashed border-white/5 w-full h-0"></div>
                </div>

                {loading ? (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm z-10">Loading stats...</div>
                ) : (
                    stats.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center flex-1 h-full justify-end group relative z-10"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {/* Tooltip */}
                            <div className={`absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded shadow-lg transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20 border border-white/10 ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}`}>
                                {item.hours} hrs
                                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45 border-r border-b border-white/10"></div>
                            </div>

                            {/* Bar */}
                            <div className="w-full h-full flex items-end justify-center rounded-t-sm bg-transparent">
                                <div
                                    style={{ height: `${Math.max(item.heightPct, 2)}%` }}
                                    className={`w-full max-w-[40px] rounded-t-md transition-all duration-500 ease-out ${index === stats.length - 1 ? 'bg-accent' : 'bg-primary'} ${hoveredIndex === index ? 'opacity-90 scale-[1.02]' : 'opacity-100'}`}
                                ></div>
                            </div>

                            {/* Label */}
                            <span className="text-[10px] text-slate-500 mt-2 font-mono uppercase">{item.day}</span>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                <p className="text-xs text-slate-500">Track your productivity</p>
                <div className="flex items-center text-xs text-green-400 font-bold">
                    <TrendingUp className="h-3 w-3 mr-1" /> Active
                </div>
            </div>
        </div>
    );
};

export default UsageStats;
