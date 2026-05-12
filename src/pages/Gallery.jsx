import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, Trophy, Image as ImageIcon,
    Loader, Calendar, X
} from 'lucide-react';
import { GalleryService } from '../services/gallery-service';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin';

/* ── Full-screen lightbox ── */
const Lightbox = ({ images, startIdx, onClose }) => {
    const [idx, setIdx] = useState(startIdx);
    const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
    const next = () => setIdx((i) => (i + 1) % images.length);

    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            >
                <X className="h-6 w-6" />
            </button>

            <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>

            <img
                src={images[idx]}
                alt={`Photo ${idx + 1}`}
                className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            />

            <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            >
                <ChevronRight className="h-6 w-6" />
            </button>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                        className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/30'}`}
                    />
                ))}
            </div>
        </motion.div>
    );
};

/* ── Single event card ── */
const EventCard = ({ event }) => {
    const [imgIdx, setImgIdx] = useState(0);
    const [lightbox, setLightbox] = useState(null); // index
    const imgs = event.image_urls?.length ? event.image_urls : [event.image_url].filter(Boolean);
    const winnersList = Array.isArray(event.winners_list) && event.winners_list.length
        ? event.winners_list
        : null;

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-slate-800 rounded-2xl overflow-hidden border border-white/5 group shadow-xl flex flex-col"
            >
                {/* Main image with carousel */}
                <div className="h-56 relative overflow-hidden cursor-pointer" onClick={() => setLightbox(imgIdx)}>
                    <img
                        src={imgs[imgIdx]}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />

                    {/* Carousel controls */}
                    {imgs.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); setImgIdx((i) => (i - 1 + imgs.length) % imgs.length); }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setImgIdx((i) => (i + 1) % imgs.length); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                                {imgs.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={(e) => { e.stopPropagation(); setImgIdx(i); }}
                                        className={`h-1 rounded-full transition-all ${i === imgIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/40'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Badges */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-bold text-white bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                        <Calendar className="h-3 w-3" />
                        {new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    {imgs.length > 1 && (
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1">
                            <ImageIcon className="h-3 w-3" /> {imgs.length}
                        </div>
                    )}
                </div>

                {/* Thumbnail strip for multiple images */}
                {imgs.length > 1 && (
                    <div className="flex gap-1.5 px-4 py-2 bg-slate-900/50">
                        {imgs.map((src, i) => (
                            <button
                                key={i}
                                onClick={() => setImgIdx(i)}
                                className={`h-10 w-14 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${i === imgIdx ? 'border-accent' : 'border-transparent'}`}
                            >
                                <img src={src} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}

                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">{event.description}</p>

                    {/* Winners */}
                    {(winnersList || event.winners) && (
                        <div className="mt-auto pt-4 border-t border-white/10">
                            <span className="text-xs text-accent font-bold uppercase flex items-center gap-1 mb-2">
                                <Trophy className="h-3 w-3" /> Winners
                            </span>
                            {winnersList ? (
                                <ul className="space-y-1">
                                    {winnersList.map((w, i) => (
                                        <li key={i} className="text-sm text-slate-300 flex gap-2">
                                            {w.position && <span className="text-accent font-bold shrink-0">{w.position}</span>}
                                            <span>{w.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-slate-300 whitespace-pre-wrap">{event.winners}</p>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox !== null && (
                    <Lightbox images={imgs} startIdx={lightbox} onClose={() => setLightbox(null)} />
                )}
            </AnimatePresence>
        </>
    );
};

/* ── Main Gallery Page ── */
const Gallery = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAdmin } = useAdmin();

    useEffect(() => {
        GalleryService.getAll()
            .then((data) => setEvents(data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="w-full text-slate-100">
            <Helmet>
                <title>Gallery - IGNIS JURIS</title>
                <meta name="description" content="Event highlights, photos and winners from Ignis Juris legal events and competitions." />
            </Helmet>

            {/* Hero */}
            <div className="relative bg-gradient-to-r from-indigo-900 to-black pt-20 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-slate-900 to-black opacity-90" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-white"
                    >
                        Event <span className="text-accent">Gallery</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-300 max-w-2xl mx-auto"
                    >
                        Relive the moments from our competitions, seminars, and legal events.
                    </motion.p>
                    {isAdmin && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-6">
                            <Link
                                to="/admin/gallery"
                                className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl transition-colors shadow-lg shadow-accent/20"
                            >
                                Manage Gallery
                            </Link>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-24">
                {loading ? (
                    <div className="flex justify-center py-24">
                        <Loader className="animate-spin h-10 w-10 text-accent" />
                    </div>
                ) : events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-slate-800/40 rounded-2xl border border-white/5">
                        <ImageIcon className="h-14 w-14 text-slate-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">No Events Yet</h3>
                        <p className="text-slate-400">Check back soon for event highlights and photos.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gallery;
