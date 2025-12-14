import React, { useEffect, useState } from 'react';
import OrganicBackground from '../components/OrganicBackground/OrganicBackground';

const About: React.FC = () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, []);

    return (
        <div className="relative h-screen w-full overflow-hidden bg-[#0a0510]">
            {/* Unified Fixed Background */}
            <OrganicBackground className="absolute inset-0 z-0 pointer-events-none" />

            {/* Scroll Container */}
            <div className="relative h-screen overflow-y-auto z-10 custom-scrollbar">

                <div className="max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-20 md:py-32 space-y-20 md:space-y-32">

                    {/* Section 1: The Story */}
                    <div className={`transition-all duration-1000 ease-out ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="bg-purple-card/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-12 text-center max-w-4xl mx-auto shadow-2xl">
                            <h1 className="text-3xl md:text-6xl mb-4 md:mb-6 bg-gradient-to-r from-purple-200 via-white to-purple-200 bg-clip-text text-transparent font-light">
                                Crafted for Freedom
                            </h1>
                            <p className="text-base md:text-xl text-purple-100 leading-relaxed font-light mb-6 md:mb-8">
                                "I built SerenityEcho as a hobby project because I was tired of limitations.
                                Most ambient sound sites lock you into their library or charge for premium features."
                            </p>
                            <p className="text-lg md:text-xl text-white font-medium">
                                My goal was simple: <span className="text-accent">Complete Freedom.</span>
                            </p>
                            <p className="text-purple-200 mt-4 text-sm md:text-base">
                                Use our library, or upload your own local audio. Mix without limits. Save without accounts.
                            </p>
                        </div>
                    </div>

                    {/* Section 2: How It Works */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="bg-purple-card/30 backdrop-blur-md border border-white/5 rounded-2xl p-8 text-center hover:bg-purple-card/50 transition-all duration-500 group">
                            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-500">🎚️</div>
                            <h3 className="text-2xl text-white mb-4">Mix</h3>
                            <p className="text-purple-200">
                                Blend rain, wind, and fire. Adjust volumes and creating your perfect sonic atmosphere.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-purple-card/30 backdrop-blur-md border border-white/5 rounded-2xl p-8 text-center hover:bg-purple-card/50 transition-all duration-500 group relative overflow-hidden">
                            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-500">📂</div>
                                <h3 className="text-2xl text-white mb-4">Create</h3>
                                <p className="text-purple-200">
                                    The feature that started it all. <span className="text-accent font-semibold">Upload your own sounds</span> directly from your device to the mixer.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-purple-card/30 backdrop-blur-md border border-white/5 rounded-2xl p-8 text-center hover:bg-purple-card/50 transition-all duration-500 group">
                            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-500">💾</div>
                            <h3 className="text-2xl text-white mb-4">Save</h3>
                            <p className="text-purple-200">
                                Save your favorite mixes as Presets. They are stored locally on your device—no login required.
                            </p>
                        </div>
                    </div>

                    {/* Section 3: Connect */}
                    <div className="text-center pb-20">
                        <h2 className="text-3xl text-white mb-12 font-light tracking-wide">Meet the Developer</h2>
                        <div className="flex flex-col md:flex-row justify-center gap-6">
                            <a
                                href="https://github.com/NaveenAkalanka"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-center gap-4 bg-[#24292e]/80 backdrop-blur-md px-8 py-4 rounded-xl hover:bg-[#24292e] hover:scale-105 transition-all duration-300 border border-white/10"
                            >
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                                <span className="text-white font-medium text-lg">GitHub</span>
                            </a>

                            <a
                                href="https://www.linkedin.com/in/naveen-akalanka/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-center gap-4 bg-[#0077b5]/80 backdrop-blur-md px-8 py-4 rounded-xl hover:bg-[#0077b5] hover:scale-105 transition-all duration-300 border border-white/10"
                            >
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" clipRule="evenodd" />
                                </svg>
                                <span className="text-white font-medium text-lg">LinkedIn</span>
                            </a>
                        </div>

                        <p className="text-white/40 mt-16 text-sm font-light">
                            Designed & Developed by Naveen Akalanka • © 2025
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default About;
