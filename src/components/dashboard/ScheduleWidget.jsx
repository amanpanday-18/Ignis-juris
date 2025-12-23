import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Plus, Briefcase, User, AlertCircle, Trash2 } from 'lucide-react';
import { DiaryService, eventTypes } from '../../services/diary-service';
import AddEventModal from '../AddEventModal';
import { useNavigate } from 'react-router-dom';

const ScheduleWidget = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const data = await DiaryService.getMyEvents();
            // Filter only upcoming events (starting from today)
            const now = new Date();
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            const upcoming = data.filter(e => {
                const eventDate = new Date(`${e.date}T${e.time}`);
                return eventDate >= todayStart;
            }).slice(0, 5); // Show top 5

            setEvents(upcoming);
        } catch (error) {
            console.error("Failed to load schedule:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddEvent = (newEvent) => {
        loadEvents(); // Reload to refresh list
    };

    const formatDate = (dateString, timeString) => {
        const date = new Date(dateString);
        return {
            day: date.getDate(),
            month: date.toLocaleString('default', { month: 'short' }),
            time: new Date(`2000-01-01T${timeString}`).toLocaleString('default', { hour: 'numeric', minute: '2-digit', hour12: true })
        };
    };

    const getIcon = (type) => {
        switch (type) {
            case 'hearing': return <Calendar className="h-4 w-4 mr-1 text-red-500" />;
            case 'meeting': return <Briefcase className="h-4 w-4 mr-1 text-blue-500" />;
            case 'personal': return <User className="h-4 w-4 mr-1 text-green-500" />;
            default: return <AlertCircle className="h-4 w-4 mr-1 text-yellow-500" />;
        }
    };

    return (
        <div className="bg-slate-800 rounded-xl shadow-sm border border-white/5 p-6 relative h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Schedule</h3>
                <div className="flex space-x-2">
                    <button
                        onClick={() => navigate('/diary')}
                        className="text-xs text-slate-400 hover:text-white font-medium"
                    >
                        View All
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-sm bg-accent text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-accent-hover flex items-center transition-colors"
                    >
                        <Plus className="h-4 w-4 mr-1" /> Add
                    </button>
                </div>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                    <div className="text-center py-4 text-slate-500">Loading schedule...</div>
                ) : events.length === 0 ? (
                    <div className="text-center py-8 bg-black/20 rounded-lg text-slate-500 text-sm border border-dashed border-white/5">
                        No upcoming events.
                        <br />
                        <button onClick={() => setIsModalOpen(true)} className="text-accent font-semibold mt-2 hover:underline">
                            Add a hearing or meeting
                        </button>
                    </div>
                ) : (
                    events.map((event) => {
                        const { day, month, time } = formatDate(event.date, event.time);
                        const typeInfo = eventTypes.find(t => t.id === event.event_type);

                        return (
                            <div key={event.id} className="flex items-start group">
                                {/* Date Box */}
                                <div className="flex-shrink-0 w-16 text-center">
                                    <div className="text-xs uppercase font-bold text-slate-500 mb-1">{month}</div>
                                    <div className="text-2xl font-bold text-white">{day}</div>
                                </div>

                                {/* Timeline Line */}
                                <div className="relative flex-shrink-0 w-4 flex flex-col items-center self-stretch mx-2">
                                    <div className={`h-2 w-2 rounded-full mt-2 ${typeInfo?.color.split(' ')[0].replace('bg-', 'bg-').replace('600', '500') || 'bg-slate-400'}`}></div>
                                    <div className="w-px bg-white/10 flex-1 mt-1"></div>
                                </div>


                                {/* Details */}
                                <div className="flex-1 pb-4">
                                    <div className="bg-black/20 p-3 rounded-lg group-hover:bg-white/5 transition-colors border border-transparent group-hover:border-white/10 relative group/card pr-10">
                                        <button
                                            onClick={() => {
                                                if (window.confirm('Delete this event?')) {
                                                    DiaryService.deleteEvent(event.id).then(() => loadEvents());
                                                }
                                            }}
                                            className="absolute top-2 right-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 p-1.5 rounded-full z-10 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                        <div className="flex items-center text-sm text-slate-400 mb-1">
                                            {getIcon(event.event_type)}
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2">{typeInfo?.name}</span>
                                            <span className="flex items-center text-xs ml-auto text-slate-500">
                                                <Clock className="h-3 w-3 mr-1" /> {time}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-white mb-1 leading-tight">{event.title}</h4>
                                        {event.court && (
                                            <div className="flex items-center text-xs text-slate-500 mt-1">
                                                <MapPin className="h-3 w-3 mr-1" /> {event.court}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <AddEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddEvent}
            />
        </div>
    );
};

export default ScheduleWidget;
