import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trash2, Plus, Image as ImageIcon, Loader, ShieldAlert,
    X, Trophy, UserPlus, ChevronLeft, ChevronRight
} from 'lucide-react';
import { GalleryService } from '../services/gallery-service';
import { useAdmin } from '../hooks/useAdmin';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

/* ── tiny image carousel used inside admin event cards ── */
const ImageCarousel = ({ images = [] }) => {
    const [idx, setIdx] = useState(0);
    if (!images.length) return null;
    const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
    const next = () => setIdx((i) => (i + 1) % images.length);
    return (
        <div className="h-48 w-full relative group overflow-hidden">
            <img
                src={images[idx]}
                alt={`Photo ${idx + 1}`}
                className="w-full h-full object-cover transition-all duration-500"
            />
            {images.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIdx(i)}
                                className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                            />
                        ))}
                    </div>
                </>
            )}
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-bold text-white">
                {images.length > 1 ? `${idx + 1}/${images.length}` : new Date().toLocaleDateString()}
            </div>
        </div>
    );
};

const AdminGallery = () => {
    const { isAdmin } = useAdmin();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    // ── Form State ──
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [images, setImages] = useState([]);          // File[]
    const [imagePreviews, setImagePreviews] = useState([]); // string[]
    const [winners, setWinners] = useState([{ position: '', name: '' }]);

    useEffect(() => {
        if (isAdmin) loadEvents();
    }, [isAdmin]);

    const loadEvents = async () => {
        try {
            setLoading(true);
            const data = await GalleryService.getAll();
            setEvents(data || []);
        } catch (err) {
            console.error(err);
            setError('Failed to load gallery events.');
        } finally {
            setLoading(false);
        }
    };

    /* ── image helpers ── */
    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const newPreviews = files.map((f) => URL.createObjectURL(f));
        setImages((prev) => [...prev, ...files]);
        setImagePreviews((prev) => [...prev, ...newPreviews]);
        // allow re-selecting same files
        e.target.value = '';
    };

    const removeImage = (idx) => {
        setImages((prev) => prev.filter((_, i) => i !== idx));
        setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
    };

    /* ── winner helpers ── */
    const addWinner = () =>
        setWinners((prev) => [...prev, { position: '', name: '' }]);

    const removeWinner = (idx) =>
        setWinners((prev) => prev.filter((_, i) => i !== idx));

    const updateWinner = (idx, field, value) =>
        setWinners((prev) =>
            prev.map((w, i) => (i === idx ? { ...w, [field]: value } : w))
        );

    /* ── submit ── */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!title || !description || !eventDate || images.length === 0) {
            setError('Please fill all required fields and add at least one image.');
            return;
        }

        try {
            setSubmitting(true);
            const filledWinners = winners.filter((w) => w.name.trim());
            const newEvent = await GalleryService.add(
                { title, description, eventDate, winnersList: filledWinners },
                images
            );
            setEvents([newEvent, ...events]);

            // reset
            setTitle('');
            setDescription('');
            setEventDate('');
            setImages([]);
            setImagePreviews([]);
            setWinners([{ position: '', name: '' }]);
        } catch (err) {
            console.error(err);
            setError('Failed to add gallery event. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    /* ── delete ── */
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this event?')) return;
        try {
            await GalleryService.delete(id);
            setEvents(events.filter((e) => e.id !== id));
        } catch (err) {
            alert('Failed to delete event.');
        }
    };

    if (!isAdmin) return <Navigate to="/" />;

    return (
        <div className="w-full py-12 min-h-screen" style={{ background: '#f0ede8' }}>
            <Helmet>
                <title>Manage Gallery - Admin</title>
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center mb-8">
                    <ShieldAlert className="h-8 w-8 text-[#2d3a2e] mr-3" />
                    <h1 className="text-3xl font-black text-[#1c1b1b] tracking-tight">Manage Event Gallery</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ── Form ── */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 border border-[#e5e5e5] shadow-xl sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
                            <h2 className="text-xl font-black text-[#1c1b1b] mb-6 flex items-center">
                                <Plus className="h-5 w-5 mr-2 text-[#2d3a2e]" /> Add New Event
                            </h2>

                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* title */}
                                <div>
                                    <label className="block text-sm font-bold text-[#474545] mb-1">Event Title *</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-2 bg-[#f9fafb] border border-[#e5e5e5] rounded-lg text-[#1c1b1b] focus:outline-none focus:border-[#2d3a2e]"
                                        placeholder="e.g. National Moot Court 2026"
                                        required
                                    />
                                </div>

                                {/* date */}
                                <div>
                                    <label className="block text-sm font-bold text-[#474545] mb-1">Event Date *</label>
                                    <input
                                        type="date"
                                        value={eventDate}
                                        onChange={(e) => setEventDate(e.target.value)}
                                        className="w-full px-4 py-2 bg-[#f9fafb] border border-[#e5e5e5] rounded-lg text-[#1c1b1b] focus:outline-none focus:border-[#2d3a2e]"
                                        required
                                    />
                                </div>

                                {/* description */}
                                <div>
                                    <label className="block text-sm font-bold text-[#474545] mb-1">Description *</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-4 py-2 bg-[#f9fafb] border border-[#e5e5e5] rounded-lg text-[#1c1b1b] focus:outline-none focus:border-[#2d3a2e]"
                                        rows="3"
                                        required
                                    />
                                </div>

                                {/* ── multiple images ── */}
                                <div>
                                    <label className="block text-sm font-bold text-[#474545] mb-2">
                                        Event Photos * <span className="text-slate-400 font-normal">(select multiple)</span>
                                    </label>

                                    {/* preview grid */}
                                    {imagePreviews.length > 0 && (
                                        <div className="grid grid-cols-3 gap-2 mb-3">
                                            <AnimatePresence>
                                                {imagePreviews.map((src, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        className="relative aspect-square rounded-lg overflow-hidden group"
                                                    >
                                                        <img src={src} alt={`preview-${i}`} className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(i)}
                                                            className="absolute top-1 right-1 p-0.5 bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full h-20 border-2 border-dashed border-[#e5e5e5] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#2d3a2e]/60 transition-colors bg-[#f9fafb] text-[#474545] hover:text-[#2d3a2e] gap-1"
                                    >
                                        <ImageIcon className="h-6 w-6" />
                                        <span className="text-xs font-bold">
                                            {imagePreviews.length ? `Add more photos (${imagePreviews.length} selected)` : 'Click to add photos'}
                                        </span>
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImagesChange}
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                    />
                                </div>

                                {/* ── winners ── */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-bold text-[#474545]">
                                            Winners <span className="text-slate-400 font-normal">(optional)</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addWinner}
                                            className="flex items-center gap-1 text-xs font-black text-[#2d3a2e] hover:text-[#1c1b1b] transition-colors"
                                        >
                                            <UserPlus className="h-3.5 w-3.5" /> Add Winner
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <AnimatePresence>
                                            {winners.map((w, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="flex gap-2 items-center"
                                                >
                                                    <input
                                                        type="text"
                                                        value={w.position}
                                                        onChange={(e) => updateWinner(i, 'position', e.target.value)}
                                                        placeholder="Pos (e.g. 1st)"
                                                        className="w-24 shrink-0 px-2 py-1.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-lg text-[#1c1b1b] text-xs focus:outline-none focus:border-[#2d3a2e]"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={w.name}
                                                        onChange={(e) => updateWinner(i, 'name', e.target.value)}
                                                        placeholder="Winner's name"
                                                        className="flex-1 px-2 py-1.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-lg text-[#1c1b1b] text-xs focus:outline-none focus:border-[#2d3a2e]"
                                                    />
                                                    {winners.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeWinner(i)}
                                                            className="p-1 text-red-400 hover:bg-red-500/10 rounded transition-colors shrink-0"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                        </button>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3 bg-[#2d3a2e] hover:bg-[#1c1b1b] text-white rounded-lg font-black transition-colors flex justify-center items-center gap-2 shadow-lg"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader className="animate-spin h-4 w-4" /> Uploading…
                                        </>
                                    ) : (
                                        'Publish Event'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* ── Events List ── */}
                    <div className="lg:col-span-2">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader className="animate-spin h-8 w-8 text-[#2d3a2e]" />
                            </div>
                        ) : events.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {events.map((event) => {
                                    const imgs = event.image_urls?.length
                                        ? event.image_urls
                                        : [event.image_url].filter(Boolean);
                                    const winnersList =
                                        Array.isArray(event.winners_list) && event.winners_list.length
                                            ? event.winners_list
                                            : null;

                                    return (
                                        <motion.div
                                            key={event.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white rounded-2xl overflow-hidden border border-[#e5e5e5] flex flex-col shadow-md hover:shadow-xl transition-shadow"
                                        >
                                            <ImageCarousel images={imgs} />

                                            {/* photo count badge */}
                                            {imgs.length > 1 && (
                                                <div className="px-5 pt-3 flex items-center gap-1 text-xs text-slate-400">
                                                    <ImageIcon className="h-3.5 w-3.5" />
                                                    {imgs.length} photos
                                                </div>
                                            )}

                                            <div className="p-5 flex-grow flex flex-col">
                                                <div className="flex items-start justify-between mb-1">
                                                    <h3 className="text-xl font-black text-[#1c1b1b] tracking-tight">{event.title}</h3>
                                                    <span className="text-xs text-[#474545] font-bold shrink-0 ml-2">
                                                        {new Date(event.event_date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-[#474545] text-sm mb-4 line-clamp-3 leading-relaxed">{event.description}</p>

                                                {/* winners */}
                                                {winnersList ? (
                                                    <div className="bg-[#f9fafb] p-3 rounded-lg border border-[#e5e5e5] mb-4">
                                                        <span className="text-xs text-[#2d3a2e] font-black uppercase flex items-center gap-1 mb-2">
                                                            <Trophy className="h-3 w-3" /> Winners
                                                        </span>
                                                        <ul className="space-y-1">
                                                            {winnersList.map((w, i) => (
                                                                <li key={i} className="text-sm text-[#474545] flex gap-2 font-medium">
                                                                    {w.position && (
                                                                        <span className="text-[#2d3a2e] font-black shrink-0">{w.position}</span>
                                                                    )}
                                                                    <span>{w.name}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ) : event.winners ? (
                                                    <div className="bg-[#f9fafb] p-3 rounded-lg border border-[#e5e5e5] mb-4">
                                                        <span className="text-xs text-[#2d3a2e] font-black uppercase block mb-1">Winners</span>
                                                        <p className="text-sm text-[#474545] whitespace-pre-wrap font-medium">{event.winners}</p>
                                                    </div>
                                                ) : null}

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
                                    );
                                })}
                            </div>
                         ) : (
                            <div className="text-center py-20 bg-white rounded-2xl border border-[#e5e5e5] h-full flex flex-col items-center justify-center shadow-sm">
                                <ImageIcon className="h-12 w-12 text-[#e5e5e5] mb-4" />
                                <h3 className="text-xl font-black text-[#1c1b1b] mb-2">No Gallery Events</h3>
                                <p className="text-[#474545]">Add your first event using the form to showcase it on the home page.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminGallery;
