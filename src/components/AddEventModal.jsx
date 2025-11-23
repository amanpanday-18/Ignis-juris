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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden my-8"
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-primary">Add Diary Event</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                            placeholder="e.g., Hearing: Sharma vs State"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                            <select
                                name="eventType"
                                value={formData.eventType}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                            >
                                {eventTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                            <input
                                type="date"
                                name="date"
                                required
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Court / Location</label>
                            <input
                                type="text"
                                name="court"
                                value={formData.court}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                                placeholder="e.g., High Court, Delhi"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                            name="notes"
                            rows="3"
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                            placeholder="Case details, client contact, etc."
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-lg transition-colors disabled:opacity-50"
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
