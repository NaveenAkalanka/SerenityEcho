import React from 'react';
import VolumeSlider from '../VolumeSlider';

interface SoundCardProps {
    id: string;
    name: string;
    icon?: string;
    isPlaying: boolean;
    volume: number;
    loop: boolean;
    isCustom?: boolean;
    onPlayPause: () => void;
    onVolumeChange: (volume: number) => void;
    onLoopToggle: () => void;
    onRemove?: () => void;
}

const SoundCard: React.FC<SoundCardProps> = ({
    name,
    icon = '🎵',
    isPlaying,
    volume,
    loop,
    isCustom = false,
    onPlayPause,
    onVolumeChange,
    onLoopToggle,
    onRemove,
}) => {
    return (
        <div className="glass-effect p-5 rounded-2xl hover:border-accent/30 transition-all">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-navy-dark rounded-xl flex items-center justify-center text-2xl">
                        {icon}
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">{name}</h3>
                        {isCustom && (
                            <span className="text-xs text-accent">Custom</span>
                        )}
                    </div>
                </div>

                {isCustom && onRemove && (
                    <button
                        onClick={onRemove}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                        title="Remove sound"
                    >
                        ✕
                    </button>
                )}
            </div>

            <div className="space-y-4">
                <VolumeSlider
                    value={volume}
                    onChange={onVolumeChange}
                    label="Volume"
                />

                <div className="flex items-center justify-between">
                    <button
                        onClick={onPlayPause}
                        className={`px-6 py-2 rounded-lg font-semibold transition-all ${isPlaying
                                ? 'bg-accent text-navy-dark hover:bg-accent-hover'
                                : 'bg-navy-dark text-accent border border-accent hover:bg-accent/10'
                            }`}
                    >
                        {isPlaying ? '⏸ Pause' : '▶ Play'}
                    </button>

                    <button
                        onClick={onLoopToggle}
                        className={`px-4 py-2 rounded-lg text-sm transition-all ${loop
                                ? 'bg-accent/20 text-accent border border-accent'
                                : 'bg-navy-dark text-gray-400 border border-gray-600 hover:border-accent'
                            }`}
                        title="Toggle loop"
                    >
                        🔁 Loop
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SoundCard;
