import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CaretDown, Check } from '@phosphor-icons/react';

interface Option {
    value: string;
    label: string;
}

interface GlassSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

const GlassSelect: React.FC<GlassSelectProps> = ({
    value,
    onChange,
    options,
    placeholder = 'Select...',
    disabled = false,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState<{
        top?: number;
        bottom?: number;
        left: number;
        width: number;
        origin: 'origin-top' | 'origin-bottom';
    }>({ left: 0, width: 0, origin: 'origin-top' });
    const triggerRef = useRef<HTMLButtonElement>(null);

    // Update coordinates when opening
    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const updateCoords = () => {
                const rect = triggerRef.current?.getBoundingClientRect();
                if (rect) {
                    const DROPDOWN_HEIGHT = 200; // Estimated height
                    const GAP = 8;
                    const spaceBelow = window.innerHeight - rect.bottom;

                    // Check if we should open upwards
                    const shouldOpenUp = spaceBelow < DROPDOWN_HEIGHT && rect.top > spaceBelow;

                    if (shouldOpenUp) {
                        setCoords({
                            bottom: window.innerHeight - rect.top + GAP,
                            left: rect.left,
                            width: rect.width,
                            origin: 'origin-bottom'
                        });
                    } else {
                        setCoords({
                            top: rect.bottom + GAP,
                            left: rect.left,
                            width: rect.width,
                            origin: 'origin-top'
                        });
                    }
                }
            };

            updateCoords();
            window.addEventListener('resize', updateCoords);
            window.addEventListener('scroll', updateCoords, true);

            return () => {
                window.removeEventListener('resize', updateCoords);
                window.removeEventListener('scroll', updateCoords, true);
            };
        }
    }, [isOpen]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const portalContent = document.getElementById('glass-select-portal-content');

            if (isOpen &&
                triggerRef.current &&
                !triggerRef.current.contains(target) &&
                portalContent &&
                !portalContent.contains(target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    const selectedOption = options.find(opt => opt.value === value);

    const DropdownContent = (
        <div
            id="glass-select-portal-content"
            className={`fixed z-[9999] overflow-hidden rounded-xl border border-white/10 bg-[#0a0510]/95 backdrop-blur-xl shadow-2xl shadow-black/80 animate-in fade-in zoom-in-95 duration-100 ${coords.origin}`}
            style={{
                top: coords.top !== undefined ? `${coords.top}px` : 'auto',
                bottom: coords.bottom !== undefined ? `${coords.bottom}px` : 'auto',
                left: `${coords.left}px`,
                width: `${coords.width}px`,
                maxHeight: '300px'
            }}
        >
            <div className="max-h-60 overflow-y-auto custom-scrollbar py-1">
                {options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => handleSelect(option.value)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-left ${option.value === value
                                ? 'bg-accent/10 text-accent font-medium'
                                : 'text-gray-200 hover:bg-white/5'
                            }`}
                    >
                        <span className="truncate">{option.label}</span>
                        {option.value === value && (
                            <Check size={14} weight="bold" className="text-accent ml-2 flex-shrink-0" />
                        )}
                    </button>
                ))}
                {options.length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        No options available
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className={`relative ${className}`}>
            <button
                ref={triggerRef}
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-left transition-all backdrop-blur-md border ${disabled
                        ? 'bg-white/5 border-white/5 text-gray-500 cursor-not-allowed'
                        : isOpen
                            ? 'bg-white/10 border-accent/50 text-white shadow-[0_0_10px_rgba(63,209,200,0.1)]'
                            : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                    }`}
            >
                <span className="truncate block mr-2">
                    {selectedOption ? selectedOption.label : <span className="text-gray-400">{placeholder}</span>}
                </span>
                <CaretDown
                    size={16}
                    weight="bold"
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-accent' : 'text-gray-400'}`}
                />
            </button>

            {isOpen && createPortal(DropdownContent, document.body)}
        </div>
    );
};

export default GlassSelect;
