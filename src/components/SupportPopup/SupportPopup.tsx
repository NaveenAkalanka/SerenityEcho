import React, { useState, useEffect } from 'react';
import { X, Coffee } from '@phosphor-icons/react';

const SupportPopup: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show popup after a delay (e.g., 5 seconds)
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-slow">
            <div className="bg-navy-card/90 backdrop-blur-xl border border-accent/20 p-6 rounded-2xl shadow-2xl max-w-sm relative overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-2 right-2 text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                    <X size={20} />
                </button>

                {/* Content */}
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center text-yellow-400">
                        <Coffee size={28} weight="fill" />
                    </div>

                    <div>
                        <h3 className="text-white font-semibold text-lg mb-1">Enjoying SerenityEcho?</h3>
                        <p className="text-purple-100/80 text-sm">
                            Help keep the servers running and support future updates!
                        </p>
                    </div>

                    <a
                        href="https://buymeacoffee.com/naveenakalanka"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-[#FFDD00] hover:bg-[#FFDD00]/90 text-black font-bold rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                    >
                        <Coffee size={20} weight="fill" />
                        Buy me a coffee
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SupportPopup;
