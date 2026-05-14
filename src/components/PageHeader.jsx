import React from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/ignis_juris_logo.jpg';

/**
 * Reusable dark olive-green page header.
 * Props:
 *   label       — small eyebrow text e.g. "/BLOG"
 *   title       — main heading
 *   description — subtitle paragraph
 *   action      — optional JSX for a CTA / admin button on the right
 *   bgImage     — optional image URL used as background (overlaid with olive tint)
 */
const PageHeader = ({ label, title, description, action, bgImage }) => {
    return (
        <div
            className="relative overflow-hidden pt-24 pb-10"
            style={{
                background: 'linear-gradient(135deg, #2d3a2e 0%, #3d4f38 55%, #4a5e43 100%)',
            }}
        >
            {/* ── Background photo (when provided) ── */}
            {bgImage && (
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${bgImage})` }}
                />
            )}

            {/* ── Olive overlay — stronger when bgImage present ── */}
            <div
                className="absolute inset-0"
                style={{
                    background: bgImage
                        ? 'linear-gradient(135deg, rgba(45,58,46,0.88) 0%, rgba(61,79,56,0.82) 55%, rgba(74,94,67,0.78) 100%)'
                        : 'transparent',
                }}
            />

            {/* ── Watermark logo — right side ── */}
            <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 opacity-[0.15] pointer-events-none select-none">
                <img
                    src={logo}
                    alt=""
                    className="h-36 w-36 md:h-52 md:w-52 object-contain rounded-full"
                    style={{ filter: 'grayscale(100%) brightness(1.8)' }}
                />
            </div>

            {/* ── Content ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex items-end justify-between gap-6">
                    <div>
                        {/* Left branding row */}
                        <div className="flex items-center gap-5 mb-5">
                            <img
                                src={logo}
                                alt="Ignis Juris"
                                className="h-20 w-20 rounded-full object-cover border-2 shadow-2xl"
                                style={{ borderColor: 'rgba(212,175,55,0.7)' }}
                            />
                            <div>
                                <p
                                    className="font-black text-base leading-none tracking-widest"
                                    style={{
                                        color: '#d4af37',
                                        fontFamily: "'Source Sans Pro', sans-serif",
                                    }}
                                >
                                    IGNIS JURIS
                                </p>
                                <p
                                    className="text-[10px] font-semibold tracking-[0.22em] uppercase leading-none mt-0.5"
                                    style={{ color: 'rgba(212,175,55,0.7)' }}
                                >
                                    Justice. Simplified.
                                </p>
                            </div>
                        </div>

                        {/* Page title */}
                        {label && (
                            <p
                                className="text-xs font-bold uppercase tracking-[0.22em] mb-2"
                                style={{ color: 'rgba(255,255,255,0.5)' }}
                            >
                                {label}
                            </p>
                        )}
                        <motion.h1
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45 }}
                            className="text-3xl md:text-5xl font-black text-white mb-2"
                            style={{ fontFamily: "'Source Sans Pro', sans-serif" }}
                        >
                            {title}
                        </motion.h1>
                        {description && (
                            <motion.p
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.45, delay: 0.1 }}
                                className="text-white/65 text-sm md:text-base max-w-xl"
                            >
                                {description}
                            </motion.p>
                        )}
                    </div>

                    {/* Optional right-side action (admin buttons, CTAs, etc.) */}
                    {action && (
                        <div className="shrink-0 hidden md:block">
                            {action}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PageHeader;
