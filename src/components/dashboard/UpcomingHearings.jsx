import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Plus, X } from 'lucide-react';
import { ActivityService } from '../../services/activity-service';

const UpcomingHearings = () => {
    const [hearings, setHearings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        court_name: '',
        case_reference: '',
        hearing_date: '',
        hearing_time: ''
    });

    const [error, setError] = useState(null);

    useEffect(() => {
        loadHearings();
    }, []);

    const loadHearings = async () => {
        try {
            setError(null);
            const data = await ActivityService.getHearings();
            setHearings(data || []);
        } catch (error) {
            console.error("Failed to load hearings:", error);
            setError("Failed to verify database connection. Please ensure the 'hearings' table exists.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddHearing = async (e) => {
        e.preventDefault();
        try {
            // Combine date and time
            const dateTime = new Date(`${formData.hearing_date}T${formData.hearing_time}`);

            await ActivityService.addHearing(
                formData.court_name,
                dateTime.toISOString(),
                formData.case_reference
            );

            setIsModalOpen(false);
            setFormData({ court_name: '', case_reference: '', hearing_date: '', hearing_time: '' });
            loadHearings(); // Refresh list
        } catch (error) {
            console.error("Failed to add hearing:", error);
            alert("Failed to save hearing. Please try again.");
        }
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return {
            day: date.getDate(),
            month: date.toLocaleString('default', { month: 'short' }),
            time: date.toLocaleString('default', { hour: 'numeric', minute: '2-digit', hour12: true })
        };
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#1a365d]">Upcoming Hearings</h3>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-sm bg-[#c5a572] text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-[#b08d55] flex items-center transition-colors"
                >
                    <Plus className="h-4 w-4 mr-1" /> Add
                </button>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                    <div className="text-center py-4 text-gray-400">Loading schedule...</div>
                ) : error ? (
                    <div className="text-center py-4 text-red-500 text-sm px-4">
                        {error}
                        <br />
                        <button onClick={loadHearings} className="text-[#c5a572] underline mt-2 text-xs">Retry</button>
                    </div>
                ) : hearings.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg text-gray-500 text-sm">
                        No upcoming hearings scheduled.
                        <br />
                        <button onClick={() => setIsModalOpen(true)} className="text-[#c5a572] font-semibold mt-2 hover:underline">
                            Add your first hearing
                        </button>
                    </div>
                ) : (
                    hearings.map((event) => {
                        const { day, month, time } = formatDate(event.hearing_date);
                        return (
                            <div key={event.id} className="flex items-start group">
                                {/* Date Box */}
                                <div className="flex-shrink-0 w-16 text-center">
                                    <div className="text-xs uppercase font-bold text-gray-500 mb-1">{month}</div>
                                    <div className="text-2xl font-bold text-[#1a365d]">{day}</div>
                                </div>

                                {/* Timeline Line */}
                                <div className="relative flex-shrink-0 w-4 flex flex-col items-center self-stretch mx-2">
                                    <div className="h-2 w-2 bg-[#c5a572] rounded-full mt-2"></div>
                                    <div className="w-px bg-gray-200 flex-1 mt-1"></div>
                                </div>

                                {/* Details */}
                                <div className="flex-1 pb-6">
                                    <div className="bg-gray-50 p-4 rounded-lg group-hover:bg-[#f0f7ff] transition-colors border border-transparent group-hover:border-blue-100">
                                        <div className="flex items-center text-sm text-gray-600 mb-2">
                                            <Clock className="h-4 w-4 mr-1 text-[#c5a572]" />
                                            {time}
                                        </div>
                                        <h4 className="font-bold text-gray-800 mb-1">{event.court_name}</h4>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Case: {event.case_reference}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Simple Modal for Adding Hearing */}
            {isModalOpen && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center rounded-xl p-4">
                    <form onSubmit={handleAddHearing} className="w-full max-w-sm space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-bold text-[#1a365d]">Add New Hearing</h4>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Court Name</label>
                            <input
                                required
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#c5a572] outline-none"
                                placeholder="e.g. High Court, Delhi"
                                value={formData.court_name}
                                onChange={(e) => setFormData({ ...formData, court_name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Case Reference</label>
                            <input
                                required
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#c5a572] outline-none"
                                placeholder="e.g. WP(C) 1234/2024"
                                value={formData.case_reference}
                                onChange={(e) => setFormData({ ...formData, case_reference: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Date</label>
                                <input
                                    required
                                    type="date"
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#c5a572] outline-none"
                                    value={formData.hearing_date}
                                    onChange={(e) => setFormData({ ...formData, hearing_date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Time</label>
                                <input
                                    required
                                    type="time"
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#c5a572] outline-none"
                                    value={formData.hearing_time}
                                    onChange={(e) => setFormData({ ...formData, hearing_time: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#1a365d] text-white font-bold py-2 rounded-lg hover:bg-[#2c4a87] transition-colors mt-2"
                        >
                            Save Schedule
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UpcomingHearings;
