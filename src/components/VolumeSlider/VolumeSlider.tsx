import React from 'react';

interface VolumeSliderProps {
    value: number;
    onChange: (value: number) => void;
    label?: string;
    min?: number;
    max?: number;
    className?: string;
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({
    value,
    onChange,
    label,
    min = 0,
    max = 100,
    className = ''
}) => {
    // Generate a unique ID for accessibility
    const sliderId = React.useId();

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label htmlFor={sliderId} className="block text-sm text-gray-400 mb-2">
                    {label}
                </label>
            )}
            <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-500">{min}</span>
                <input
                    id={sliderId}
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    aria-label={label || 'Volume slider'}
                    className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all hover:bg-white/20"
                />
                <span className="text-xs text-gray-500">{max}</span>
                <span className="text-sm font-semibold text-accent w-10 text-right">
                    {value}
                </span>
            </div>
        </div>
    );
};

export default VolumeSlider;
