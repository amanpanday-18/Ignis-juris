import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Instagram, Mail, Twitter, Linkedin, ExternalLink } from 'lucide-react';
import logoFooter from '../assets/ignis_juris_logo.jpg';

const Layout = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <main className={`flex-grow ${isHomePage ? '' : 'pt-28 md:pt-36'}`}>
                <Outlet />
            </main>
            <footer className="bg-slate-950 text-slate-400 py-20 border-t border-white/5 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>
                
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
                        {/* Brand Column */}
                        <div className="space-y-6">
                            <Link to="/" className="flex items-center gap-3">
                                <img src={logoFooter} alt="Logo" className="w-12 h-12 rounded-full object-cover border border-white/10" />
                                <span className="font-serif font-black text-2xl text-white tracking-tighter">
                                    IGNIS<span className="text-accent">JURIS</span>
                                </span>
                            </Link>
                            <p className="text-sm leading-relaxed max-w-xs">
                                Empowering the legal community through accessible resources, AI-driven insights, and a commitment to justice for all.
                            </p>
                            <div className="flex gap-4">
                                {[
                                    { icon: Instagram, href: "https://www.instagram.com/the_legalremedies.in?igsh=OWZzYTZ1ZGlleW5x", color: "hover:bg-pink-600" },
                                    { icon: Mail, href: "mailto:info@ignisjuris.online", color: "hover:bg-red-600" },
                                    { icon: Twitter, href: "#", color: "hover:bg-blue-400" },
                                    { icon: Linkedin, href: "https://www.linkedin.com/in/ignis-juris-6240593aa/", color: "hover:bg-blue-700" }
                                ].map((social, i) => (
                                    <a
                                        key={i}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white transition-all duration-300 ${social.color} hover:scale-110 shadow-lg`}
                                    >
                                        <social.icon className="h-5 w-5" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-white text-lg font-bold mb-6">Explore</h3>
                            <ul className="space-y-4 text-sm">
                                {[
                                    { name: 'Legal Blogs', path: '/blog' },
                                    { name: 'Education Hub', path: '/education' },
                                    { name: 'Career Center', path: '/internships' },
                                    { name: 'Resource Store', path: '/store' }
                                ].map((link, i) => (
                                    <li key={i}>
                                        <Link to={link.path} className="hover:text-accent transition-colors flex items-center gap-2 group">
                                            <span className="w-1 h-1 rounded-full bg-accent/40 group-hover:bg-accent transition-colors"></span>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h3 className="text-white text-lg font-bold mb-6">Legal</h3>
                            <ul className="space-y-4 text-sm">
                                {[
                                    { name: 'Privacy Policy', path: '#' },
                                    { name: 'Terms of Service', path: '#' },
                                    { name: 'Cookie Policy', path: '#' },
                                    { name: 'Disclaimer', path: '#' }
                                ].map((link, i) => (
                                    <li key={i}>
                                        <a href={link.path} className="hover:text-accent transition-colors flex items-center gap-2 group">
                                            <span className="w-1 h-1 rounded-full bg-accent/40 group-hover:bg-accent transition-colors"></span>
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter/Contact */}
                        <div>
                            <h3 className="text-white text-lg font-bold mb-6">Get in Touch</h3>
                            <p className="text-sm mb-6">Have questions? Our team is here to help you navigate your legal journey.</p>
                            <a 
                                href="mailto:info@ignisjuris.online" 
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all group"
                            >
                                Contact Support <ExternalLink className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </a>
                        </div>
                    </div>

                    <div className="mt-12 md:mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-3 text-[10px] md:text-xs font-bold tracking-widest uppercase text-slate-500 text-center">
                        <p>&copy; {new Date().getFullYear()} IGNIS JURIS. ALL RIGHTS RESERVED.</p>
                        <p>Designed with ❤️ for Justice</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;

