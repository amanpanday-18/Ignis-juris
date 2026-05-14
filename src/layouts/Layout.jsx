import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Instagram, Mail, Twitter, Linkedin, ExternalLink } from 'lucide-react';
import logoFooter from '../assets/ignis_juris_logo.jpg';

const Layout = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <div className="min-h-screen flex flex-col bg-[#f3f3f3]">
            <Navbar />
            <main className={`flex-grow ${isHomePage ? '' : 'pt-16 md:pt-[68px]'}`}>
                <Outlet />
            </main>

            {/* Footer — stays dark per the reference */}
            <footer className="bg-[#1c1b1b] text-[#888] py-16 md:py-20 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

                        {/* Brand Column */}
                        <div className="space-y-5">
                            <Link to="/" className="flex items-center gap-3">
                                <img src={logoFooter} alt="Logo" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                <span className="font-black text-xl text-white tracking-tight" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
                                    IGNIS JURIS
                                </span>
                            </Link>
                            <p className="text-sm leading-relaxed max-w-xs text-[#888]">
                                Empowering the legal community through accessible resources, AI-driven insights, and a commitment to justice for all.
                            </p>
                            <div className="flex gap-3">
                                {[
                                    { icon: Instagram, href: "https://www.instagram.com/the_legalremedies.in?igsh=OWZzYTZ1ZGlleW5x" },
                                    { icon: Mail, href: "mailto:info@ignisjuris.online" },
                                    { icon: Twitter, href: "#" },
                                    { icon: Linkedin, href: "https://www.linkedin.com/in/ignis-juris-6240593aa/" }
                                ].map((social, i) => (
                                    <a
                                        key={i}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#888] hover:text-white hover:bg-white/10 transition-all duration-200"
                                    >
                                        <social.icon className="h-4 w-4" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-white text-sm font-bold mb-5 uppercase tracking-wider">Explore</h3>
                            <ul className="space-y-3 text-sm">
                                {[
                                    { name: 'Legal Blogs', path: '/blog' },
                                    { name: 'Education Hub', path: '/education' },
                                    { name: 'Career Center', path: '/internships' },
                                    { name: 'Resource Store', path: '/store' }
                                ].map((link, i) => (
                                    <li key={i}>
                                        <Link to={link.path} className="text-[#888] hover:text-white transition-colors duration-200">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h3 className="text-white text-sm font-bold mb-5 uppercase tracking-wider">Legal</h3>
                            <ul className="space-y-3 text-sm">
                                {[
                                    { name: 'Privacy Policy', path: '#' },
                                    { name: 'Terms of Service', path: '#' },
                                    { name: 'Cookie Policy', path: '#' },
                                    { name: 'Disclaimer', path: '#' }
                                ].map((link, i) => (
                                    <li key={i}>
                                        <a href={link.path} className="text-[#888] hover:text-white transition-colors duration-200">
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Get in Touch */}
                        <div>
                            <h3 className="text-white text-sm font-bold mb-5 uppercase tracking-wider">Get in Touch</h3>
                            <p className="text-sm mb-5 text-[#888]">Have questions? Our team is here to help you navigate your legal journey.</p>
                            <a
                                href="mailto:info@ignisjuris.online"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-all duration-200 group"
                            >
                                Contact Support <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs font-semibold tracking-wider text-[#555] text-center">
                        <p>&copy; {new Date().getFullYear()} IGNIS JURIS. All Rights Reserved.</p>
                        <p>Designed with ❤️ for Justice</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
