import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { Faders, Waveform, FloppyDisk } from '@phosphor-icons/react';
import OrganicBackground from '../components/OrganicBackground/OrganicBackground';

const Landing: React.FC = () => {
    const [loaded, setLoaded] = useState(false);
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);
    const particleIdRef = React.useRef(0);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLoaded(true);

        // Initialize Lenis for smooth scrolling
        if (containerRef.current) {
            const lenis = new Lenis({
                wrapper: containerRef.current,
                duration: 1.2, // Faster, snappier feel
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                wheelMultiplier: 1.2, // slightly more sensitive
                touchMultiplier: 2,
            });

            // Standard raf loop
            const raf = (time: number) => {
                lenis.raf(time);
                requestAnimationFrame(raf);
            };

            requestAnimationFrame(raf);

            return () => {
                lenis.destroy();
            };
        }
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const baseX = ((e.clientX - rect.left) / rect.width) * 100;
        const baseY = ((e.clientY - rect.top) / rect.height) * 100;

        const rippleCount = 3 + Math.floor(Math.random() * 3);

        for (let i = 0; i < rippleCount; i++) {
            const offsetX = (Math.random() - 0.5) * 10;
            const offsetY = (Math.random() - 0.5) * 10;
            const size = 60 + Math.random() * 60;

            const newParticle = {
                id: particleIdRef.current++,
                x: baseX + offsetX,
                y: baseY + offsetY,
                size
            };

            setParticles(prev => [...prev, newParticle]);

            const duration = 3000 + Math.random() * 1500;
            setTimeout(() => {
                setParticles(prev => prev.filter(p => p.id !== newParticle.id));
            }, duration);
        }
    };

    const soundCategories = [
        { name: 'Rain', emoji: '🌧️', description: 'Gentle rainfall sounds', video: 'Rain.mp4' },
        { name: 'Wind', emoji: '💨', description: 'Soft breeze ambiance', video: 'Wind.mp4' },
        { name: 'Ocean', emoji: '🌊', description: 'Calming wave sounds', video: 'Ocean.mp4' },
        { name: 'Forest', emoji: '🌲', description: 'Nature\'s symphony', video: 'Forest.mp4' },
        { name: 'Thunder', emoji: '⛈️', description: 'Rolling storm sounds', video: 'Thunder.mp4' },
        { name: 'Fire', emoji: '🔥', description: 'Crackling fireplace', video: 'Fire.mp4' },
        { name: 'Birds', emoji: '🐦', description: 'Gentle bird songs', video: 'Birds.mp4' },
        { name: 'Night', emoji: '🌙', description: 'Peaceful crickets', video: 'Night.mp4' },
        { name: 'River', emoji: '🏞️', description: 'Flowing water', video: 'River.mp4' },
        { name: 'Beach', emoji: '🏖️', description: 'Coastal atmosphere', video: 'Beach.mp4' },
        { name: 'Snow', emoji: '❄️', description: 'Winter serenity', video: 'Snow.mp4' },
        { name: 'Cafe', emoji: '☕', description: 'Coffee shop buzz', video: 'Cafe.mp4' }
    ];

    return (
        <div className="relative h-screen w-full overflow-hidden bg-[#0a0510]">
            {/* Unified Fixed Background */}
            <OrganicBackground className="absolute inset-0 z-0 pointer-events-none" />

            {/* Scroll Container */}
            <div ref={containerRef} className="relative h-screen snap-scroll-container z-10" style={{ willChange: 'scroll-position' }}>

                {/* Section 1: Hero */}
                <section className="min-h-screen relative flex items-center justify-center pt-20 bg-transparent" style={{ transform: 'translate3d(0,0,0)' }}>

                    <div className="w-full h-full flex items-center justify-center">
                        {/* Hero content */}
                        <div className="relative z-10 text-center px-4 md:px-8 max-w-4xl">
                            <div className="inline-block mb-2 bg-purple-card/80 backdrop-blur-md px-6 py-2 md:px-8 rounded-2xl">
                                <div className={`w-40 h-40 md:w-64 md:h-64 transition-all duration-[1200ms] ease-out ${loaded ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                                    <img src="/SerenityEcho.svg" alt="SerenityEcho Logo" className="w-full h-full" loading="lazy" decoding="async" />
                                </div>
                            </div>

                            <div className="bg-purple-card/60 backdrop-blur-sm px-6 py-2 md:px-12 rounded-3xl">
                                <h1 className={`text-4xl md:text-7xl mb-4 md:mb-6 bg-gradient-to-r from-purple-200 via-white to-purple-200 bg-clip-text text-transparent transition-all duration-[1200ms] ease-out delay-100 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                    SerenityEcho
                                </h1>

                                <p className={`text-lg md:text-2xl text-purple-100 mb-6 md:mb-10 font-light leading-relaxed transition-all duration-[1200ms] ease-out delay-200 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                    Immerse yourself in calming soundscapes
                                    <br className="hidden md:block" />
                                    designed for focus, relaxation, and peace
                                </p>

                                <div className={`flex gap-6 justify-center transition-all duration-[1200ms] ease-out delay-300 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                    <a href="/mixer" className="group relative px-8 py-3 md:px-10 md:py-4 bg-gradient-to-r from-accent to-accent-hover text-navy-dark font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent/50 inline-block">
                                        <span className="relative z-10 text-sm md:text-base">Start Mixing</span>
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 animate-bounce-slow pointer-events-none transition-opacity duration-1000 delay-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </section>

                {/* Section 2: Atmosphere */}
                <section className="min-h-screen relative flex items-center justify-center py-20 px-6 bg-transparent overflow-hidden" style={{ transform: 'translate3d(0,0,0)' }}>
                    <div className="constellation-container">
                        <svg className="constellation-svg" xmlns="http://www.w3.org/2000/svg">
                            <g className="constellation-lines constellation-group-1">
                                <line x1="15%" y1="20%" x2="35%" y2="30%" className="constellation-line" />
                                <line x1="35%" y1="30%" x2="55%" y2="25%" className="constellation-line" />
                                <line x1="55%" y1="25%" x2="75%" y2="35%" className="constellation-line" />
                            </g>
                            <g className="constellation-lines constellation-group-2">
                                <line x1="40%" y1="55%" x2="60%" y2="50%" className="constellation-line" />
                                <line x1="60%" y1="50%" x2="80%" y2="60%" className="constellation-line" />
                            </g>
                            <g className="constellation-lines constellation-group-3">
                                <line x1="20%" y1="80%" x2="45%" y2="75%" className="constellation-line" />
                                <line x1="45%" y1="75%" x2="65%" y2="70%" className="constellation-line" />
                            </g>
                            <circle cx="15%" cy="20%" r="3" className="constellation-star star-pulse-1" />
                            <circle cx="35%" cy="30%" r="4" className="constellation-star star-pulse-2" />
                            <circle cx="55%" cy="25%" r="3.5" className="constellation-star star-pulse-3" />
                            <circle cx="75%" cy="35%" r="3" className="constellation-star star-pulse-1" />
                            <circle cx="40%" cy="55%" r="4.5" className="constellation-star star-pulse-2" />
                            <circle cx="60%" cy="50%" r="4" className="constellation-star star-pulse-3" />
                        </svg>
                    </div>

                    <div className="relative z-10 w-full overflow-hidden">
                        <h2 className="text-3xl md:text-5xl text-center mb-8 md:mb-16 bg-gradient-to-r from-purple-200 via-white to-purple-200 bg-clip-text text-transparent">
                            Find Your Atmosphere
                        </h2>

                        {/* Mobile: Dual Horizontal Rows (Scaled Down) */}
                        <div className="block md:hidden w-full overflow-hidden flex flex-col gap-20 py-12">
                            {/* Row 1 */}
                            <div className="carousel-track-mobile">
                                {/* Duplicate set for seamless infinite scroll */}
                                {[...soundCategories, ...soundCategories].map((category, idx) => (
                                    <div key={`mob-row1-${idx}`} className="carousel-card-mobile bg-purple-card backdrop-blur-md rounded-xl border border-white/5 overflow-hidden">
                                        <div className="relative w-full h-24 overflow-hidden">
                                            <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
                                                <source src={`/videos/atmosphere/${category.video}`} type="video/mp4" />
                                            </video>
                                            <div className="absolute inset-0 bg-gradient-to-t from-purple-card/90 to-transparent"></div>
                                        </div>
                                        <div className="relative p-2 text-center">
                                            <h3 className="text-xs font-medium text-white">{category.name}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Row 2 - Offset/Randomized */}
                            <div className="carousel-track-mobile" style={{ animationDuration: '70s', animationDirection: 'reverse' }}>
                                {/* Shifted data for "random" feel */}
                                {(() => {
                                    const shifted = [...soundCategories.slice(6), ...soundCategories.slice(0, 6)];
                                    return [...shifted, ...shifted].map((category, idx) => (
                                        <div key={`mob-row2-${idx}`} className="carousel-card-mobile bg-purple-card backdrop-blur-md rounded-xl border border-white/5 overflow-hidden">
                                            <div className="relative w-full h-24 overflow-hidden">
                                                <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
                                                    <source src={`/videos/atmosphere/${category.video}`} type="video/mp4" />
                                                </video>
                                                <div className="absolute inset-0 bg-gradient-to-t from-purple-card/90 to-transparent"></div>
                                            </div>
                                            <div className="relative p-2 text-center">
                                                <h3 className="text-xs font-medium text-white">{category.name}</h3>
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </div>

                        {/* Desktop: Infinite Carousel */}
                        <div className="hidden md:block carousel-container">
                            <div className="carousel-track">
                                {soundCategories.map((category) => (
                                    <div key={`${category.name}-1`} className="carousel-card group relative bg-purple-card backdrop-blur-md rounded-2xl border border-white/5 hover:border-white/15 transition-all duration-700 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden">
                                        <div className="relative w-full h-48 overflow-hidden rounded-t-2xl">
                                            <video className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" autoPlay loop muted playsInline>
                                                <source src={`/videos/atmosphere/${category.video}`} type="video/mp4" />
                                            </video>
                                            <div className="absolute inset-0 bg-gradient-to-t from-purple-card/90 to-transparent"></div>
                                        </div>
                                        <div className="relative p-6 text-center">
                                            <h3 className="text-2xl mb-2 text-white font-light">{category.name}</h3>
                                            <p className="text-purple-100 text-sm">{category.description}</p>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/10 group-hover:to-accent-hover/10 transition-all duration-500 rounded-2xl pointer-events-none"></div>
                                    </div>
                                ))}
                                {soundCategories.map((category) => (
                                    <div key={`${category.name}-2`} className="carousel-card group relative bg-purple-card backdrop-blur-md rounded-2xl border border-white/5 hover:border-white/15 transition-all duration-700 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden">
                                        <div className="relative w-full h-48 overflow-hidden rounded-t-2xl">
                                            <video className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" autoPlay loop muted playsInline>
                                                <source src={`/videos/atmosphere/${category.video}`} type="video/mp4" />
                                            </video>
                                            <div className="absolute inset-0 bg-gradient-to-t from-purple-card/90 to-transparent"></div>
                                        </div>
                                        <div className="relative p-6 text-center">
                                            <h3 className="text-2xl mb-2 text-white font-light">{category.name}</h3>
                                            <p className="text-purple-100 text-sm">{category.description}</p>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/10 group-hover:to-accent-hover/10 transition-all duration-500 rounded-2xl pointer-events-none"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 animate-bounce-slow pointer-events-none">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </section>

                {/* Section 3: Features */}
                <section className="min-h-screen relative flex items-center justify-center py-20 px-6 bg-transparent overflow-hidden" onMouseMove={handleMouseMove} style={{ transform: 'translate3d(0,0,0)' }}>
                    <div className="wind-container">
                        {[...Array(15)].map((_, i) => (
                            <div key={i} className="wind-particle" style={{ top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${8 + Math.random() * 4}s` }}></div>
                        ))}
                    </div>

                    <div className="particle-trail-container">
                        {particles.map(particle => (
                            <div key={particle.id} className="trail-particle" style={{ left: `${particle.x}%`, top: `${particle.y}%`, '--ripple-size': `${particle.size}px` } as React.CSSProperties} />
                        ))}
                    </div>

                    <div className="relative z-10 max-w-6xl w-full">
                        <h2 className="text-3xl md:text-5xl text-center mb-8 md:mb-16 bg-gradient-to-r from-purple-200 via-white to-purple-200 bg-clip-text text-transparent">Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-purple-card/60 backdrop-blur-md p-8 rounded-2xl border border-white/5 flex flex-col items-center text-center group hover:bg-purple-card/80 transition-all duration-300">
                                <Faders size={48} className="text-accent mb-4 group-hover:scale-110 transition-transform duration-300" weight="light" />
                                <h3 className="text-2xl mb-3 text-white">Mix Sounds</h3>
                                <p className="text-purple-100">Blend multiple soundscapes</p>
                            </div>
                            <div className="bg-purple-card/60 backdrop-blur-md p-8 rounded-2xl border border-white/5 flex flex-col items-center text-center group hover:bg-purple-card/80 transition-all duration-300">
                                <Waveform size={48} className="text-accent mb-4 group-hover:scale-110 transition-transform duration-300" weight="light" />
                                <h3 className="text-2xl mb-3 text-white">Custom Sounds</h3>
                                <p className="text-purple-100">Upload your own tracks</p>
                            </div>
                            <div className="bg-purple-card/60 backdrop-blur-md p-8 rounded-2xl border border-white/5 flex flex-col items-center text-center group hover:bg-purple-card/80 transition-all duration-300">
                                <FloppyDisk size={48} className="text-accent mb-4 group-hover:scale-110 transition-transform duration-300" weight="light" />
                                <h3 className="text-2xl mb-3 text-white">Save Presets</h3>
                                <p className="text-purple-100">Remember your favorites</p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-6 left-0 w-full text-center z-20">
                        <p className="text-white/40 text-sm font-light tracking-wide">
                            &copy; 2025 SerenityEcho. Developed by <span className="text-white/60 font-normal hover:text-accent transition-colors duration-300 cursor-default">Naveen Akalanka</span>
                        </p>
                    </div>
                </section >
            </div >
        </div >
    );
};

export default Landing;
