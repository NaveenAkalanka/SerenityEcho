import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';

const Header: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [visible, setVisible] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const prevScrollY = useRef(0);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Determine visibility (hide on scroll down, show on scroll up)
            // Added a small threshold (> 10) to prevent flickering at the very top
            if (currentScrollY > prevScrollY.current && currentScrollY > 80) {
                setVisible(false);
            } else {
                setVisible(true);
            }

            setScrolled(currentScrollY > 20);
            prevScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path: string) => location.pathname === path;

    return (
        <header
            className={`
                fixed top-0 left-0 right-0 z-[100]
                transition-all duration-300 ease-in-out
                ${visible ? 'translate-y-0' : '-translate-y-full'}
                ${scrolled
                    ? 'bg-[#0a0510]/80 backdrop-blur-xl shadow-lg'
                    : 'bg-[#0a0510]/30 backdrop-blur-md'
                }
                border-b border-white/5
            `}
            style={{
                boxShadow: scrolled
                    ? '0 4px 20px rgba(80, 60, 140, 0.15)'
                    : '0 2px 10px rgba(80, 60, 140, 0.08)'
            }}
        >
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center space-x-3 group"
                        onClick={() => {
                            // Find the scroll container in Landing page and scroll to top
                            const scrollContainer = document.querySelector('.snap-scroll-container');
                            if (scrollContainer) {
                                scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
                            } else {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                        }}
                    >
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 p-2.5">
                            <img src="/SerenityEcho.svg" alt="SerenityEcho Logo" className="w-full h-full" />
                        </div>
                        <h1 className="text-2xl bg-gradient-to-r from-purple-200 via-white to-purple-200 bg-clip-text text-transparent tracking-wide transition-all duration-300 group-hover:opacity-90">
                            SerenityEcho
                        </h1>
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-purple-100 hover:text-white transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className={`
                                relative px-4 py-2 rounded-lg
                                text-purple-100 tracking-wide
                                transition-all duration-300
                                hover:text-white hover:bg-white/5
                                ${isActive('/') ? 'text-white bg-white/5' : ''}
                            `}
                        >
                            Home
                        </Link>
                        <Link
                            to="/mixer"
                            className={`
                                relative px-4 py-2 rounded-lg
                                text-purple-100 tracking-wide
                                transition-all duration-300
                                hover:text-white hover:bg-white/5
                                ${isActive('/mixer') ? 'text-white bg-white/5' : ''}
                            `}
                        >
                            Mixer
                        </Link>
                        <Link
                            to="/library"
                            className={`
                                relative px-4 py-2 rounded-lg
                                text-purple-100 tracking-wide
                                transition-all duration-300
                                hover:text-white hover:bg-white/5
                                ${isActive('/library') ? 'text-white bg-white/5' : ''}
                            `}
                        >
                            Sound Library
                        </Link>
                        <Link
                            to="/about"
                            className={`
                                relative px-4 py-2 rounded-lg
                                text-purple-100 tracking-wide
                                transition-all duration-300
                                hover:text-white hover:bg-white/5
                                ${isActive('/about') ? 'text-white bg-white/5' : ''}
                            `}
                        >
                            About
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && createPortal(
                <div className="md:hidden fixed inset-0 z-[100]" style={{ top: '80px', backgroundColor: '#0a0510' }}>
                    <nav className="flex flex-col items-center justify-start pt-12 p-8 space-y-8 h-full pb-24">
                        <Link
                            to="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`
                                text-2xl font-light tracking-wide
                                ${isActive('/') ? 'text-white' : 'text-purple-200'}
                            `}
                        >
                            Home
                        </Link>
                        <Link
                            to="/mixer"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`
                                text-2xl font-light tracking-wide
                                ${isActive('/mixer') ? 'text-white' : 'text-purple-200'}
                            `}
                        >
                            Mixer
                        </Link>
                        <Link
                            to="/library"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`
                                text-2xl font-light tracking-wide
                                ${isActive('/library') ? 'text-white' : 'text-purple-200'}
                            `}
                        >
                            Sound Library
                        </Link>
                        <Link
                            to="/about"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`
                                text-2xl font-light tracking-wide
                                ${isActive('/about') ? 'text-white' : 'text-purple-200'}
                            `}
                        >
                            About
                        </Link>
                    </nav>
                </div>,
                document.body
            )}
        </header>
    );
};

export default Header;
