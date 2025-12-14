import React, { useState, useEffect, useCallback, useRef } from 'react';
import './AtmosphereBackground.css';

interface AtmosphereBackgroundProps {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

interface Bird {
    id: number;
    top: number;
    delay: number;
    scale: number;
}

const AtmosphereBackground: React.FC<AtmosphereBackgroundProps> = ({ children, className = '', style }) => {
    // --- State ---
    const [isWindy, setIsWindy] = useState(false);
    const [isThundering, setIsThundering] = useState(false);
    const [birds, setBirds] = useState<Bird[]>([]);

    // --- Refs for intervals to clear on unmount ---
    const windTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const thunderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const birdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // --- Logic: Rain (Always on) ---
    // Rain logic is handled purely by CSS mapping, but we can randomize drop parameters here
    const rainDrops = useRef([...Array(80)].map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 0.5 + Math.random() * 0.5,
        opacity: 0.3 + Math.random() * 0.5
    })));


    // --- Logic: Wind ---
    const triggerWind = useCallback(() => {
        setIsWindy(true);
        // Wind lasts for 4-8 seconds
        const duration = 4000 + Math.random() * 4000;

        windTimeoutRef.current = setTimeout(() => {
            setIsWindy(false);
            // Schedule next wind gust in 10-20 seconds
            const nextGustDelay = 10000 + Math.random() * 10000;
            windTimeoutRef.current = setTimeout(triggerWind, nextGustDelay);
        }, duration);
    }, []);


    // --- Logic: Thunder ---
    const triggerThunder = useCallback(() => {
        setIsThundering(true);

        // Reset thunder class after animation completes (0.8s)
        setTimeout(() => setIsThundering(false), 900);

        // Schedule next thunder in 15-40 seconds
        const nextThunderDelay = 15000 + Math.random() * 25000;
        thunderTimeoutRef.current = setTimeout(triggerThunder, nextThunderDelay);
    }, []);


    // --- Logic: Birds ---
    const triggerBirds = useCallback(() => {
        // Spawn a small flock (1-3 birds)
        const flockSize = 1 + Math.floor(Math.random() * 3);
        const newBirds: Bird[] = [];
        const startTop = 5 + Math.random() * 40; // Top 5-45% of screen

        for (let i = 0; i < flockSize; i++) {
            newBirds.push({
                id: Date.now() + i,
                top: startTop + (Math.random() * 10 - 5), // Slight vertical variation
                delay: i * 2, // Slight stagger
                scale: 0.8 + Math.random() * 0.4
            });
        }

        setBirds(prev => [...prev, ...newBirds]);

        // Clean up birds after they fly off screen (15s animation)
        setTimeout(() => {
            setBirds(prev => prev.filter(b => !newBirds.find(nb => nb.id === b.id)));
        }, 16000);

        // Schedule next flock in 20-60 seconds
        const nextBirdDelay = 20000 + Math.random() * 40000;
        birdTimeoutRef.current = setTimeout(triggerBirds, nextBirdDelay);
    }, []);


    // --- Initialization ---
    useEffect(() => {
        // Start cycles
        const initialWindDelay = 2000 + Math.random() * 5000;
        const initialThunderDelay = 5000 + Math.random() * 10000;
        const initialBirdDelay = 3000 + Math.random() * 8000;

        windTimeoutRef.current = setTimeout(triggerWind, initialWindDelay);
        thunderTimeoutRef.current = setTimeout(triggerThunder, initialThunderDelay);
        birdTimeoutRef.current = setTimeout(triggerBirds, initialBirdDelay);

        return () => {
            if (windTimeoutRef.current) clearTimeout(windTimeoutRef.current);
            if (thunderTimeoutRef.current) clearTimeout(thunderTimeoutRef.current);
            if (birdTimeoutRef.current) clearTimeout(birdTimeoutRef.current);
        };
    }, [triggerWind, triggerThunder, triggerBirds]);


    return (
        <div className={`relative min-h-screen w-full overflow-x-hidden ${className}`} style={style}>

            {/* Base Dark Background - Fixed to viewport */}
            <div className="fixed inset-0 bg-gradient-to-b from-[#0a0510] via-[#13091f] to-[#1c0e2e] z-0"></div>

            {/* Atmosphere Layer - Fixed to viewport */}
            <div className={`atmosphere-container fixed inset-0 pointer-events-none ${isWindy ? 'wind-active' : ''}`}>

                {/* Rain */}
                <div className="rain-container">
                    {rainDrops.current.map(drop => (
                        <div
                            key={drop.id}
                            className="rain-drop"
                            style={{
                                left: `${drop.left}%`,
                                animationDelay: `${drop.delay}s`,
                                animationDuration: `${drop.duration}s`,
                                opacity: drop.opacity
                            }}
                        />
                    ))}
                </div>

                {/* Wind Particles (Visible only when windy) */}
                {isWindy && (
                    <div className="wind-particles">
                        {[...Array(10)].map((_, i) => (
                            <div
                                key={i}
                                className="wind-particle"
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `-100px`,
                                    animationDelay: `${Math.random()}s`,
                                    animationDuration: `${1 + Math.random()}s`
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Thunder Overlay */}
                <div className={`thunder-overlay ${isThundering ? 'thunder-active' : ''}`} />

                {/* Birds */}
                <div className="bird-container">
                    {birds.map(bird => (
                        <div
                            key={bird.id}
                            className="bird"
                            style={{
                                top: `${bird.top}%`,
                                transform: `scale(${bird.scale})`,
                                animationDelay: `${bird.delay}s` // Note: animation delay handled in CSS or here
                            }}
                        >
                            {/* Simple Bird SVG */}
                            <svg viewBox="0 0 24 24">
                                <path d="M2,12 Q8,4 12,12 T22,12" fill="none" stroke="rgba(200,200,255,0.4)" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Content */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};

export default AtmosphereBackground;
