import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, Trash2, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { DiaryService, eventTypes } from '../services/diary-service';
import AddEventModal from '../components/AddEventModal';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

const AdvocateDiary = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            loadEvents();
        }
    }, [user]);

    const loadEvents = async () => {
        setLoading(true);
        try {
            const data = await DiaryService.getMyEvents();
            setEvents(data);
        } catch (error) {
            console.error('Error loading events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddEvent = (newEvent) => {
        setEvents([...events, newEvent].sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.time.localeCompare(b.time);
        }));
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await DiaryService.deleteEvent(id);
                setEvents(events.filter(e => e.id !== id));
            } catch (error) {
                console.error('Error deleting event:', error);
                alert('Failed to delete event.');
            }
        }
    };

    // Calendar Logic
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const { days, firstDay } = getDaysInMonth(currentDate);
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const changeMonth = (offset) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };

    const getEventsForDate = (dateStr) => {
        return events.filter(e => e.date === dateStr);
    };

    const selectedDateEvents = getEventsForDate(selectedDate);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Please Login</h2>
                    <p className="text-slate-400">You need to be logged in to access your schedule.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full py-8 text-slate-100">
            <Helmet>
                <title>Advocate Diary - IGNIS JURIS</title>
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Calendar Section */}
                    <div className="lg:w-2/3">
                        <div className="bg-slate-800 rounded-xl shadow-lg p-6 mb-6 border border-white/5">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white flex items-center">
                                    <CalendarIcon className="h-6 w-6 mr-2 text-accent" />
                                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                </h2>
                                <div className="flex space-x-2">
                                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white/10 rounded-full text-white">
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white/10 rounded-full text-white">
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-7 gap-2 mb-2">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="text-center text-sm font-bold text-slate-400 py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-2">
                                {[...Array(firstDay)].map((_, i) => (
                                    <div key={`empty-${i}`} className="h-24 bg-slate-900/50 rounded-lg"></div>
                                ))}
                                {[...Array(days)].map((_, i) => {
                                    const day = i + 1;
                                    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                    const dayEvents = getEventsForDate(dateStr);
                                    const isSelected = selectedDate === dateStr;
                                    const isToday = dateStr === new Date().toISOString().split('T')[0];

                                    return (
                                        <div
                                            key={day}
                                            onClick={() => setSelectedDate(dateStr)}
                                            className={`h-24 p-2 rounded-lg border cursor-pointer transition-all hover:shadow-md flex flex-col ${isSelected
                                                ? 'border-accent bg-accent/10 ring-2 ring-accent ring-opacity-50'
                                                : isToday
                                                    ? 'border-blue-500/50 bg-blue-500/10'
                                                    : 'border-white/5 bg-slate-900/50 hover:border-white/20'
                                                }`}
                                        >
                                            <span className={`text-sm font-bold mb-1 ${isToday ? 'text-blue-400' : 'text-slate-300'}`}>
                                                {day}
                                            </span>
                                            <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
                                                {dayEvents.map(event => (
                                                    <div
                                                        key={event.id}
                                                        className={`text-[10px] px-1 py-0.5 rounded truncate text-white ${eventTypes.find(t => t.id === event.event_type)?.color.replace('text-', 'bg-').replace('600', '500').replace('700', '500') + '/20' || 'bg-slate-700'
                                                            }`}
                                                    >
                                                        {event.title}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Events List Section */}
                    <div className="lg:w-1/3">
                        <div className="bg-slate-800 rounded-xl shadow-lg p-6 h-full flex flex-col border border-white/5">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Schedule</h3>
                                    <p className="text-sm text-slate-400">
                                        {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="p-2 bg-accent text-white rounded-full hover:bg-accent-hover shadow-lg transition-colors"
                                >
                                    <Plus className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                                {loading ? (
                                    <div className="flex justify-center py-8">
                                        <Loader className="animate-spin h-8 w-8 text-accent" />
                                    </div>
                                ) : selectedDateEvents.length > 0 ? (
                                    selectedDateEvents.map(event => (
                                        <motion.div
                                            key={event.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`p-4 rounded-lg border-l-4 shadow-sm relative group ${eventTypes.find(t => t.id === event.event_type)?.color.replace('text-', 'bg-opacity-10 border-') || 'border-slate-600 bg-slate-700/50'
                                                }`}
                                        >
                                            <button
                                                onClick={() => handleDeleteEvent(event.id)}
                                                className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>

                                            <h4 className="font-bold text-white mb-1">{event.title}</h4>

                                            <div className="flex items-center text-sm text-slate-400 mb-2">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {event.time}
                                                {event.court && (
                                                    <>
                                                        <span className="mx-2">•</span>
                                                        <MapPin className="h-3 w-3 mr-1" />
                                                        {event.court}
                                                    </>
                                                )}
                                            </div>

                                            {event.notes && (
                                                <p className="text-xs text-slate-400 mt-2 bg-black/20 p-2 rounded">
                                                    {event.notes}
                                                </p>
                                            )}
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-slate-500">
                                        <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                        <p>No events scheduled for this day.</p>
                                        <button
                                            onClick={() => setIsAddModalOpen(true)}
                                            className="text-accent text-sm font-bold mt-2 hover:underline"
                                        >
                                            Add an Event
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AddEventModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddEvent}
                selectedDate={selectedDate}
            />
        </div>
    );
};

export default AdvocateDiary;
