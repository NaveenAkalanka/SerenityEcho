import React from 'react';

interface OrganicBackgroundProps {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

const OrganicBackground: React.FC<OrganicBackgroundProps> = ({ children, className = '', style }) => {
    return (
        <div className={`min-h-screen overflow-hidden ${className.includes('absolute') || className.includes('fixed') ? '' : 'relative'} ${className}`} style={style}>
            {/* Solid background */}
            {/* Solid background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0510] via-[#13091f] to-[#1c0e2e] z-0"></div>

            {/* Left Organic Waves */}
            <div className="hidden md:block absolute left-0 top-0 h-full w-full overflow-hidden pointer-events-none z-0">
                {/* Layer 1: Cyan/Teal - Slow Float */}
                <svg className="absolute left-0 top-0 h-full w-[400px] md:w-[800px] organic-float-1 opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="aurora-1" x1="0%" y1="0%" x2="100%" y2="50%">
                            <stop offset="0%" stopColor="rgba(34, 211, 238, 0.4)" /> {/* Cyan */}
                            <stop offset="50%" stopColor="rgba(45, 212, 191, 0.2)" /> {/* Teal */}
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>
                    <path d="M0,0 C50,15 0,30 40,50 S 0,85 20,100 L0,100 Z" fill="url(#aurora-1)" />
                </svg>

                {/* Layer 2: Deep Purple/Indigo - Sway */}
                <svg className="absolute left-[-50px] md:left-[-100px] top-0 h-full w-[350px] md:w-[700px] organic-float-2 opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="aurora-2" x1="0%" y1="0%" x2="100%" y2="60%">
                            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.4)" /> {/* Violet */}
                            <stop offset="50%" stopColor="rgba(79, 70, 229, 0.2)" /> {/* Indigo */}
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>
                    <path d="M0,0 C60,20 -10,40 50,60 S 10,90 40,100 L0,100 Z" fill="url(#aurora-2)" />
                </svg>

                {/* Layer 3: Blue/Pink - Pulse */}
                <svg className="absolute left-[-25px] md:left-[-50px] top-0 h-full w-[300px] md:w-[600px] organic-float-3 opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="aurora-3" x1="0%" y1="0%" x2="100%" y2="80%">
                            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" /> {/* Blue */}
                            <stop offset="100%" stopColor="rgba(236, 72, 153, 0.1)" /> {/* Pink */}
                        </linearGradient>
                    </defs>
                    <path d="M0,0 C40,15 10,35 60,55 S 0,90 10,100 L0,100 Z" fill="url(#aurora-3)" />
                </svg>
            </div>

            {/* Right Organic Waves */}
            <div className="hidden md:block absolute right-0 top-0 h-full w-full overflow-hidden pointer-events-none z-0">
                {/* Layer 1: Purple/Pink - Slow Float */}
                <svg className="absolute right-0 top-0 h-full w-[400px] md:w-[800px] organic-float-1 opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="aurora-right-1" x1="100%" y1="0%" x2="0%" y2="50%">
                            <stop offset="0%" stopColor="rgba(168, 85, 247, 0.4)" /> {/* Purple */}
                            <stop offset="50%" stopColor="rgba(236, 72, 153, 0.2)" /> {/* Pink */}
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>
                    <path d="M100,0 C50,15 100,30 60,50 S 100,85 80,100 L100,100 Z" fill="url(#aurora-right-1)" />
                </svg>

                {/* Layer 2: Indigo/Blue - Sway */}
                <svg className="absolute right-[-50px] md:right-[-100px] top-0 h-full w-[350px] md:w-[700px] organic-float-2 opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="aurora-right-2" x1="100%" y1="0%" x2="0%" y2="60%">
                            <stop offset="0%" stopColor="rgba(99, 102, 241, 0.4)" /> {/* Indigo */}
                            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.2)" /> {/* Blue */}
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>
                    <path d="M100,0 C40,20 110,40 50,60 S 90,90 60,100 L100,100 Z" fill="url(#aurora-right-2)" />
                </svg>

                {/* Layer 3: Cyan/Teal - Pulse */}
                <svg className="absolute right-[-25px] md:right-[-50px] top-0 h-full w-[300px] md:w-[600px] organic-float-3 opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="aurora-right-3" x1="100%" y1="0%" x2="0%" y2="80%">
                            <stop offset="0%" stopColor="rgba(34, 211, 238, 0.3)" /> {/* Cyan */}
                            <stop offset="100%" stopColor="rgba(45, 212, 191, 0.1)" /> {/* Teal */}
                        </linearGradient>
                    </defs>
                    <path d="M100,0 C60,15 90,35 40,55 S 100,90 90,100 L100,100 Z" fill="url(#aurora-right-3)" />
                </svg>
            </div>

            {/* Rain animation */}
            <div className="rain-container pointer-events-none z-0">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="rain-drop"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${0.5 + Math.random() * 0.5}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};

export default OrganicBackground;
