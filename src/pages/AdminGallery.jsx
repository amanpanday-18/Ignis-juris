import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Image as ImageIcon, Loader, ShieldAlert } from 'lucide-react';
import { GalleryService } from '../services/gallery-service';
import { useAdmin } from '../hooks/useAdmin';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const AdminGallery = () => {
    const { isAdmin } = useAdmin();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [winners, setWinners] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (isAdmin) {
            loadEvents();
        }
    }, [isAdmin]);

    const loadEvents = async () => {
        try {
            setLoading(true);
            const data = await GalleryService.getAll();
            setEvents(data || []);
        } catch (err) {
            console.error('Error loading gallery events:', err);
            setError('Failed to load gallery events.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!title || !description || !eventDate || !image) {
            setError('Please fill all required fields including an image.');
            return;
        }

        try {
            setSubmitting(true);
            const newEvent = await GalleryService.add({
                title,
                description,
                eventDate,
                winners
            }, image);

            setEvents([newEvent, ...events]);
            
            // Reset form
            setTitle('');
            setDescription('');
            setEventDate('');
            setWinners('');
            setImage(null);
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            
        } catch (err) {
            console.error('Error adding event:', err);
            setError('Failed to add gallery event. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        
        try {
            await GalleryService.delete(id);
            setEvents(events.filter(e => e.id !== id));
        } catch (err) {
            console.error('Error deleting event:', err);
            alert('Failed to delete event.');
        }
    };

    if (!isAdmin) {
        return <Navigate to="/" />;
    }

    return (
        <div className="w-full py-12">
            <Helmet>
                <title>Manage Gallery - Admin</title>
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center mb-8">
                    <ShieldAlert className="h-8 w-8 text-accent mr-3" />
                    <h1 className="text-3xl font-bold text-white">Manage Event Gallery</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add Event Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-800 rounded-2xl p-6 border border-white/5 shadow-xl sticky top-24">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                                <Plus className="h-5 w-5 mr-2 text-accent" /> Add New Event
                            </h2>

                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Event Title *</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent"
                                        placeholder="e.g. National Moot Court"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Event Date *</label>
                                    <input
                                        type="date"
                                        value={eventDate}
                                        onChange={(e) => setEventDate(e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Description *</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent"
                                        rows="3"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Winners (Optional)</label>
                                    <textarea
                                        value={winners}
                                        onChange={(e) => setWinners(e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent"
                                        placeholder="e.g. 1st Place: John Doe"
                                        rows="2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Event Image *</label>
                                    <div 
                                        className="w-full h-32 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-accent/50 transition-colors bg-slate-900 overflow-hidden relative"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <ImageIcon className="h-8 w-8 text-slate-400 mb-2" />
                                                <span className="text-sm text-slate-400">Click to upload image</span>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3 bg-accent hover:bg-accent-hover text-white rounded-lg font-bold transition-colors flex justify-center items-center"
                                >
                                    {submitting ? <Loader className="animate-spin h-5 w-5" /> : 'Publish Event'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Events List */}
                    <div className="lg:col-span-2">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader className="animate-spin h-8 w-8 text-accent" />
                            </div>
                        ) : events.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {events.map((event) => (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-slate-800 rounded-xl overflow-hidden border border-white/5 flex flex-col"
                                    >
                                        <div className="h-48 w-full relative">
                                            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white">
                                                {new Date(event.event_date).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="p-5 flex-grow flex flex-col">
                                            <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                                            <p className="text-slate-400 text-sm mb-4 line-clamp-3">{event.description}</p>
                                            
                                            {event.winners && (
                                                <div className="bg-slate-900/50 p-3 rounded-lg border border-white/5 mb-4">
                                                    <span className="text-xs text-accent font-bold uppercase block mb-1">Winners</span>
                                                    <p className="text-sm text-slate-300 whitespace-pre-wrap">{event.winners}</p>
                                                </div>
                                            )}

                                            <div className="mt-auto pt-4 border-t border-white/5 flex justify-end">
                                                <button
                                                    onClick={() => handleDelete(event.id)}
                                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center text-sm font-semibold"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-white/5 h-full flex flex-col items-center justify-center">
                                <ImageIcon className="h-12 w-12 text-slate-500 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">No Gallery Events</h3>
                                <p className="text-slate-400">Add your first event using the form to showcase it on the home page.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminGallery;
