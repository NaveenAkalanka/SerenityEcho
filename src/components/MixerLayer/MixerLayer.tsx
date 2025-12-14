import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Play, Pause, SpeakerHigh, SpeakerX, X, DotsSixVertical } from '@phosphor-icons/react';
import VolumeSlider from '../VolumeSlider/VolumeSlider';
import type { MixerLayer as MixerLayerType } from '../../types/MixerLayer';
import type { SoundTrack } from '../../types/SoundTrack';
import { SOUND_LIBRARY } from '../../data/soundLibrary';
import GlassSelect from '../GlassSelect/GlassSelect';

interface MixerLayerProps {
    layer: MixerLayerType;
    categories: string[];
    customSounds: SoundTrack[];
    onCategoryChange: (categoryId: string) => void;
    onSoundChange: (soundId: string) => void;
    onTogglePlay: () => void;
    onVolumeChange: (volume: number) => void;
    onToggleMute: () => void;
    onRemove: () => void;
}

const MixerLayer: React.FC<MixerLayerProps> = ({
    layer,
    categories,
    customSounds,
    onCategoryChange,
    onSoundChange,
    onTogglePlay,
    onVolumeChange,
    onToggleMute,
    onRemove,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: layer.id });

    const style = {
        '--sortable-transform': CSS.Transform.toString(transform),
        '--sortable-transition': transition,
    } as React.CSSProperties;

    // Filter sounds based on selected category (default + custom)
    const defaultSounds = layer.selectedCategory
        ? SOUND_LIBRARY.filter(s => s.category === layer.selectedCategory)
        : [];

    const filteredCustomSounds = layer.selectedCategory
        ? customSounds.filter(s => s.category === layer.selectedCategory)
        : [];

    // Merge default and custom sounds
    const availableSounds = [
        ...defaultSounds,
        ...filteredCustomSounds.map(cs => ({
            id: cs.id,
            name: cs.name,
            category: cs.category || '',
            icon: cs.icon || '🎵',
            filePath: cs.filePath || ''
        }))
    ];

    const categoryOptions = categories.map(cat => ({ value: cat, label: cat }));
    const soundOptions = availableSounds.map(s => ({ value: s.id, label: s.name }));

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="mixer-layer-sortable glass-effect p-4 rounded-xl flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-4 transition-all hover:bg-white/5"
        >
            {/* Header / Drag Handle Row (Mobile Only) */}
            <div className="flex md:hidden items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <button
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-white transition-colors p-1"
                        aria-label="Drag to reorder"
                    >
                        <DotsSixVertical size={24} weight="bold" />
                    </button>
                    <span className="text-gray-300 font-medium">Layer</span>
                    {/* Status Indicator (Mobile) */}
                    <div className={`w-2 h-2 rounded-full ${layer.isPlaying ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'bg-gray-600'}`} />
                </div>
                <button
                    onClick={onRemove}
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                    title="Remove Layer"
                >
                    <X size={20} weight="bold" />
                </button>
            </div>

            {/* Desktop Drag Handle */}
            <button
                {...attributes}
                {...listeners}
                className="hidden md:block cursor-grab active:cursor-grabbing text-gray-400 hover:text-white transition-colors p-1"
                aria-label="Drag to reorder"
            >
                <DotsSixVertical size={24} weight="bold" />
            </button>

            {/* Status Indicator (Desktop) */}
            <div className={`hidden md:block w-3 h-3 rounded-full ${layer.isPlaying ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'bg-gray-600'}`} />

            {/* Dropdowns Container */}
            <div className="flex flex-col md:flex-row gap-4 flex-[2]">
                {/* Category Selection */}
                <div className="flex-1 w-full">
                    <label className="block text-xs text-gray-400 mb-1">Category</label>
                    <GlassSelect
                        value={layer.selectedCategory || ''}
                        onChange={onCategoryChange}
                        options={categoryOptions}
                        placeholder="Select Category"
                    />
                </div>

                {/* Sound Selection */}
                <div className="flex-1 w-full">
                    <label className="block text-xs text-gray-400 mb-1">Sound</label>
                    <GlassSelect
                        value={layer.selectedSoundId || ''}
                        onChange={onSoundChange}
                        options={soundOptions}
                        placeholder="Select Sound"
                        disabled={!layer.selectedCategory}
                    />
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 flex-[1.5] mt-2 md:mt-0 pt-2 md:pt-0 border-t border-white/5 md:border-none">
                {/* Play/Pause Button - Solid Style */}
                <button
                    onClick={onTogglePlay}
                    disabled={!layer.selectedSoundId}
                    className={`w-10 h-10 md:w-10 md:h-10 flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer ${layer.isPlaying
                        ? 'bg-accent text-navy-dark shadow-[0_0_15px_rgba(63,209,200,0.4)] scale-105'
                        : 'bg-white/10 text-white hover:bg-accent hover:text-navy-dark disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/10 disabled:hover:text-white'
                        }`}
                >
                    {layer.isPlaying ? (
                        <Pause size={20} weight="fill" />
                    ) : (
                        <Play size={20} weight="fill" className="ml-0.5" />
                    )}
                </button>

                {/* Volume */}
                <div className="flex-1 flex items-center gap-3">
                    <button
                        onClick={onToggleMute}
                        className={`text-gray-400 hover:text-white transition-colors ${layer.isMuted ? 'text-red-400' : ''}`}
                    >
                        {layer.isMuted ? (
                            <SpeakerX size={20} weight="fill" />
                        ) : (
                            <SpeakerHigh size={20} weight="fill" />
                        )}
                    </button>
                    <VolumeSlider
                        value={layer.volume}
                        onChange={onVolumeChange}
                        className="flex-1"
                    />
                </div>

                {/* Desktop Remove - Hidden on Mobile to save space/prevent fat finger */}
                <button
                    onClick={onRemove}
                    className="hidden md:block p-2 text-gray-500 hover:text-red-400 transition-colors"
                    title="Remove Layer"
                >
                    <X size={20} weight="bold" />
                </button>
            </div>
        </div>
    );
};

export default MixerLayer;
