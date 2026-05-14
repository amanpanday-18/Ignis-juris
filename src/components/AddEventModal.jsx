import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, FileText, Loader, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { DiaryService, eventTypes } from '../services/diary-service';

const AddEventModal = ({ isOpen, onClose, onAdd, selectedDate }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        eventType: 'hearing',
        date: selectedDate || new Date().toISOString().split('T')[0],
        time: '10:00',
        court: '',
        notes: ''
    });

    // Update date if selectedDate prop changes
    React.useEffect(() => {
        if (selectedDate) {
            setFormData(prev => ({ ...prev, date: selectedDate }));
        }
    }, [selectedDate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const newEvent = await DiaryService.addEvent(formData);
            onAdd(newEvent);
            onClose();
            // Reset form (keep date/time reasonable)
            setFormData({
                title: '',
                eventType: 'hearing',
                date: formData.date,
                time: '10:00',
                court: '',
                notes: ''
            });
        } catch (error) {
            console.error('Error adding event:', error);
            alert(`Failed to add event: ${error.message || JSON.stringify(error)}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden my-8 border border-[#e5e5e5]"
            >
                <div className="flex justify-between items-center p-6 border-b border-[#e5e5e5]">
                    <h2 className="text-xl font-black text-[#1c1b1b] tracking-tight">Add Diary Event</h2>
                    <button onClick={onClose} className="p-2 rounded-full bg-[#f9fafb] text-[#474545] hover:text-[#1c1b1b] border border-[#e5e5e5] transition-all">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Event Title *</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                            placeholder="e.g., Hearing: Sharma vs State"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Type *</label>
                            <select
                                name="eventType"
                                value={formData.eventType}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] font-medium"
                            >
                                {eventTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Date *</label>
                            <input
                                type="date"
                                name="date"
                                required
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] font-medium"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Time</label>
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Court / Location</label>
                            <input
                                type="text"
                                name="court"
                                value={formData.court}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium"
                                placeholder="e.g., High Court, Delhi"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-[#474545] uppercase tracking-widest mb-2">Notes</label>
                        <textarea
                            name="notes"
                            rows="3"
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#2d3a2e] focus:border-transparent text-[#1c1b1b] placeholder-gray-400 font-medium resize-none"
                            placeholder="Case details, client contact, etc."
                        />
                    </div>

                    <div className="pt-6 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-white text-[#474545] font-bold rounded-xl hover:bg-[#f9fafb] transition-all border border-[#e5e5e5] shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 flex items-center justify-center py-3 bg-[#2d3a2e] hover:bg-[#1c1b1b] text-white font-black rounded-xl transition-all shadow-lg disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader className="animate-spin h-5 w-5 mr-2" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Check className="h-5 w-5 mr-2" />
                                    Save Event
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddEventModal;
