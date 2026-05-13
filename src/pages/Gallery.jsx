import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, Trophy, Image as ImageIcon,
    Loader, Calendar, X, Award, Users
} from 'lucide-react';
import { GalleryService } from '../services/gallery-service';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin';
import PageHeader from '../components/PageHeader';
import bgGallery from '../assets/more_gallery.png';

/* ── Medal colours for position labels ── */
const MEDAL = {
    '1st': '#FFD700',
    '2nd': '#C0C0C0',
    '3rd': '#CD7F32',
    'first': '#FFD700',
    'second': '#C0C0C0',
    'third': '#CD7F32',
};
const medalColor = (pos = '') => MEDAL[pos.toLowerCase()] || '#a78bfa';

/* ═══════════════════════════════════════════════
   Event Detail Modal
   ═══════════════════════════════════════════════ */
const EventModal = ({ event, onClose }) => {
    const [imgIdx, setImgIdx] = useState(0);
    const imgs = event.image_urls?.length
        ? event.image_urls
        : [event.image_url].filter(Boolean);

    const winnersList = Array.isArray(event.winners_list) && event.winners_list.length
        ? event.winners_list
        : null;

    const prev = useCallback(() => setImgIdx(i => (i - 1 + imgs.length) % imgs.length), [imgs.length]);
    const next = useCallback(() => setImgIdx(i => (i + 1) % imgs.length), [imgs.length]);

    useEffect(() => {
        const handler = e => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handler);
            document.body.style.overflow = '';
        };
    }, [prev, next, onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
            style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)' }}
            onClick={onClose}
        >
            {/* Panel */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={e => e.stopPropagation()}
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
                style={{ 
                    background: '#ffffff', 
                    border: '1px solid #e5e5e5',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#e5e5e5 transparent'
                }}
            >
                {/* Close Button - Sticky at top right */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 rounded-full bg-[#f3f3f3] text-[#2d3a2e] hover:bg-[#e5e5e5] transition-all border border-[#e5e5e5]"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* ── TOP: Full Width Image Viewer ── */}
                <div className="w-full relative bg-black aspect-video lg:aspect-[16/9]">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={imgIdx}
                            src={imgs[imgIdx]}
                            alt={event.title}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full object-contain sm:object-cover"
                        />
                    </AnimatePresence>

                    {/* Navigation Overlays */}
                    {imgs.length > 1 && (
                        <>
                            <button
                                onClick={prev}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                            <button
                                onClick={next}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>
                            
                            {/* Dots */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                {imgs.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 rounded-full transition-all ${i === imgIdx ? 'w-8 bg-white' : 'w-1.5 bg-white/40'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* ── BOTTOM: Content Sections ── */}
                <div className="p-8 lg:p-12 space-y-10 bg-white">
                    
                    {/* Header Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[#2d3a2e] font-bold tracking-wider text-sm uppercase">
                            <Calendar className="h-4 w-4" />
                            {new Date(event.event_date).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'long', year: 'numeric'
                            })}
                        </div>
                        <h2 className="text-3xl lg:text-5xl font-black text-[#1c1b1b] leading-tight">
                            {event.title}
                        </h2>
                    </div>

                    <div className="h-px bg-[#e5e5e5] w-full" />

                    {/* Description */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-[#1c1b1b] flex items-center gap-2">
                            <ImageIcon className="h-5 w-5 text-[#2d3a2e]" />
                            Event Highlights
                        </h3>
                        <p className="text-[#474545] text-lg leading-relaxed whitespace-pre-wrap">
                            {event.description}
                        </p>
                    </div>

                    {/* Winners Section */}
                    {(winnersList || event.winners) && (
                        <div className="space-y-6 pt-6">
                            <h3 className="text-xl font-bold text-[#1c1b1b] flex items-center gap-2">
                                <Trophy className="h-6 w-6 text-[#2d3a2e]" />
                                Winners & Achievements
                            </h3>
                            
                            {winnersList ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {winnersList.map((w, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-center gap-4 p-5 rounded-2xl bg-[#f3f3f3] border border-[#e5e5e5]"
                                        >
                                            <div 
                                                className="h-12 w-12 rounded-full flex items-center justify-center shrink-0"
                                                style={{ background: `${medalColor(w.position)}20`, color: medalColor(w.position) }}
                                            >
                                                <Award className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold uppercase tracking-tighter opacity-50" style={{ color: medalColor(w.position) }}>
                                                    {w.position || 'Rank'}
                                                </div>
                                                <div className="text-[#1c1b1b] font-bold text-lg">{w.name}</div>
                                                {w.institution && (
                                                    <div className="text-[#474545] text-sm">{w.institution}</div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 rounded-2xl bg-[#f3f3f3] border border-[#e5e5e5] text-[#474545] whitespace-pre-wrap text-lg">
                                    {event.winners}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

/* ═══════════════════════════════════════════════
   Single event card (grid thumbnail)
   ═══════════════════════════════════════════════ */
const EventCard = ({ event, onClick }) => {
    const [imgIdx, setImgIdx] = useState(0);
    const imgs = event.image_urls?.length ? event.image_urls : [event.image_url].filter(Boolean);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={onClick}
            className="rounded-2xl overflow-hidden border group shadow-xl flex flex-col cursor-pointer"
            style={{ background: '#ffffff', borderColor: '#e5e5e5' }}
            id={`event-card-${event.id}`}
        >
            {/* Main image */}
            <div className="h-56 relative overflow-hidden">
                <img
                    src={imgs[imgIdx]}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />

                {/* Carousel arrows (hover only) */}
                {imgs.length > 1 && (
                    <>
                        <button
                            onClick={e => { e.stopPropagation(); setImgIdx(i => (i - 1 + imgs.length) % imgs.length); }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={e => { e.stopPropagation(); setImgIdx(i => (i + 1) % imgs.length); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </>
                )}

                {/* Date badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-bold text-white bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Calendar className="h-3 w-3" />
                    {new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>

                {/* Photo count */}
                {imgs.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1">
                        <ImageIcon className="h-3 w-3" /> {imgs.length}
                    </div>
                )}

                {/* "View Details" overlay on hover */}
                <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'rgba(28,27,27,0.4)', backdropFilter: 'blur(2px)' }}
                >
                    <span className="text-white font-bold text-sm px-4 py-2 rounded-full border border-white/50">
                        View Details
                    </span>
                </div>
            </div>

            {/* Card body */}
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-[#1c1b1b] mb-1.5 group-hover:text-[#474545] transition-colors line-clamp-2">
                    {event.title}
                </h3>
                <p className="text-[#474545] text-sm leading-relaxed line-clamp-3">
                    {event.description}
                </p>

                {/* Winners preview */}
                {(Array.isArray(event.winners_list) && event.winners_list.length > 0 || event.winners) && (
                    <div className="mt-auto pt-3 border-t border-[#e5e5e5] flex items-center gap-1.5 text-xs font-semibold text-[#2d3a2e]">
                        <Trophy className="h-3 w-3" />
                        {Array.isArray(event.winners_list) && event.winners_list.length > 0
                            ? `${event.winners_list.length} winner${event.winners_list.length > 1 ? 's' : ''} listed`
                            : 'Winners listed'}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

/* ═══════════════════════════════════════════════
   Main Gallery Page
   ═══════════════════════════════════════════════ */
const Gallery = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const { isAdmin } = useAdmin();

    useEffect(() => {
        GalleryService.getAll()
            .then(data => setEvents(data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="w-full min-h-screen" style={{ background: '#f0ede8' }}>
            <Helmet>
                <title>Gallery - IGNIS JURIS</title>
                <meta name="description" content="Event highlights, photos and winners from Ignis Juris legal events and competitions." />
            </Helmet>

            <PageHeader
                label="/GALLERY"
                title="Event Gallery"
                description="Relive the moments from our competitions, seminars, and legal events. Click any event to explore full details."
                bgImage={bgGallery}
                action={isAdmin && (
                    <Link to="/admin/gallery" className="inline-flex items-center px-5 py-2.5 bg-white text-[#3d4f38] font-bold text-sm rounded-full hover:bg-white/90 transition-all">
                        Manage Gallery
                    </Link>
                )}
            />

            {/* Cards Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
                {loading ? (
                    <div className="flex justify-center py-24">
                        <Loader className="animate-spin h-10 w-10 text-[#2d3a2e]" />
                    </div>
                ) : events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map(event => (
                            <EventCard
                                key={event.id}
                                event={event}
                                onClick={() => setSelectedEvent(event)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-2xl border border-[#e5e5e5]">
                        <ImageIcon className="h-14 w-14 text-[#2d3a2e] mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-[#1c1b1b] mb-2">No Events Yet</h3>
                        <p className="text-[#474545]">Check back soon for event highlights and photos.</p>
                    </div>
                )}
            </div>

            {/* Event Detail Modal */}
            <AnimatePresence>
                {selectedEvent && (
                    <EventModal
                        event={selectedEvent}
                        onClose={() => setSelectedEvent(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
