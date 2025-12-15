import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Trash } from '@phosphor-icons/react';
import MixerLayer from '../components/MixerLayer/MixerLayer';
import MasterControls from '../components/MasterControls';
import PresetManager from '../components/PresetManager';
import AtmosphereBackground from '../components/AtmosphereBackground/AtmosphereBackground';
import UploadSoundModal from '../components/UploadSoundModal';
import SavePresetModal from '../components/SavePresetModal/SavePresetModal';
import ConfirmationModal from '../components/ConfirmationModal/ConfirmationModal';
import SupportPopup from '../components/SupportPopup/SupportPopup';
import { useToast } from '../components/Toast/ToastContext';
import { useAudioEngine } from '../hooks/useAudioEngine';
import { useLocalPresets } from '../hooks/useLocalPresets';
import { SOUND_CATEGORIES } from '../data/soundLibrary';
import { getSounds, getCategories, initDB, saveSound } from '../services/audioStorage';
import type { Preset } from '../types/Preset';
import type { SoundTrack } from '../types/SoundTrack';

const Mixer: React.FC = () => {
    const { showToast } = useToast();
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isSavePresetModalOpen, setIsSavePresetModalOpen] = useState(false);
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);
    const [customSounds, setCustomSounds] = useState<SoundTrack[]>([]);
    const [customCategories, setCustomCategories] = useState<{ id: string; name: string }[]>([]);
    const [hasLoadedPreset, setHasLoadedPreset] = useState(false);

    const {
        layers,
        masterVolume,
        setMasterVolume,
        addLayer,
        removeLayer,
        updateLayerCategory,
        updateLayerSound,
        toggleLayer,
        updateLayerVolume,
        toggleLayerMute,
        playAll,
        pauseAll,
        loadLayers,
        reorderLayers,
        clearAllLayers
    } = useAudioEngine(customSounds);

    const { presets, savePreset, deletePreset, isLoading: arePresetsLoading } = useLocalPresets();

    // Default Zen Preset (Rain, Water, Wind, Bells, Crickets)
    const DEFAULT_ZEN_PRESET = [
        'gentle-rain',
        'flowing-stream',
        'soft-breeze',
        'meditation-bell',
        'cricket-chorus'
    ];

    // Define handleLoadPreset early so it can be used in useEffect
    const handleLoadPreset = (preset: Preset, showAlert = true) => {
        setMasterVolume(preset.masterVolume);

        // Map preset layers to MixerLayer type (adding runtime props)
        const loadedLayers = preset.layers.map(l => ({
            ...l,
            isPlaying: false, // Don't auto-play on load
            isMuted: l.isMuted || false,
        }));

        loadLayers(loadedLayers);

        if (showAlert) {
            showToast(`Preset "${preset.name}" loaded!`, 'success');
        }
    };

    // Load custom sounds and categories on mount
    useEffect(() => {
        const loadCustomData = async () => {
            await initDB();
            const sounds = await getSounds();
            const categories = await getCategories();
            setCustomSounds(sounds);
            setCustomCategories(categories);
        };
        loadCustomData();
    }, []);

    // Auto-load most recent preset OR Default Zen preset on mount
    useEffect(() => {
        // Wait for presets to finish loading
        if (arePresetsLoading || hasLoadedPreset) return;

        console.log('Auto-load check:', { presetsCount: presets.length });

        if (presets.length > 0) {
            // Priority 1: User's most recent preset
            const mostRecentPreset = presets[presets.length - 1];
            console.log('Auto-loading user preset:', mostRecentPreset.name);
            handleLoadPreset(mostRecentPreset, false);
            setHasLoadedPreset(true);
        } else if (layers.length === 0) {
            // Priority 2: Default Zen Preset (only if mixer is empty)
            console.log('No user presets found. Loading default Zen preset.');

            // Construct Zen Layers
            const zenLayers = DEFAULT_ZEN_PRESET.map((soundId, index) => {
                const sound = SOUND_LIBRARY.find(s => s.id === soundId);
                // Skip if sound not found
                if (!sound) return null;

                return {
                    id: `zen-layer-${index}-${Date.now()}`,
                    name: sound.name,
                    selectedCategory: sound.category,
                    selectedSoundId: soundId,
                    volume: 50, // Default volume 50%
                    isPlaying: false,
                    isMuted: false,
                    loop: true
                };
            }).filter((l): l is NonNullable<typeof l> => l !== null);

            if (zenLayers.length > 0) {
                loadLayers(zenLayers as any); // Cast to any if MixerLayer type mismatch with strict props but here it should be fine logic-wise
                setHasLoadedPreset(true);
            }
        }
    }, [arePresetsLoading, presets.length, hasLoadedPreset, layers.length, loadLayers]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = layers.findIndex((layer) => layer.id === active.id);
            const newIndex = layers.findIndex((layer) => layer.id === over.id);
            reorderLayers(oldIndex, newIndex);
        }
    };

    const handleSavePreset = (name: string) => {
        console.log('Saving preset with layers:', layers);
        savePreset(name, layers, masterVolume);
        console.log('Preset saved! Check localStorage key: sonixa_presets_v2');
        showToast(`Preset "${name}" saved successfully!`, 'success');
    };

    const handleUploadSound = async (file: File, category: string, name: string) => {
        try {
            const categoryId = customCategories.find(c => c.name === category)?.id;
            if (!categoryId) throw new Error('Invalid category ID');

            await saveSound(file, category, name, categoryId);

            // Reload custom sounds
            const sounds = await getSounds();
            setCustomSounds(sounds);

            showToast(`Sound "${name}" added to ${category}!`, 'success');
        } catch (error) {
            console.error('Upload failed:', error);
            showToast('Failed to upload sound', 'error');
        }
    };

    const handleOpenUploadModal = () => {
        if (customCategories.length === 0) {
            showToast('Please create a custom category in Sound Library first!', 'error');
            return;
        }
        setIsUploadModalOpen(true);
    };

    const handleConfirmClear = () => {
        clearAllLayers();
        showToast('All layers cleared', 'info');
    };

    // Get all categories (default + custom)
    const allCategories: string[] = [
        ...SOUND_CATEGORIES,
        ...customCategories.map(cat => cat.name)
    ];

    return (
        <AtmosphereBackground className="pb-32 md:pb-40 pt-20">
            <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">

                    {/* Main Mixer Panel */}
                    <div className="lg:col-span-3">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6">
                            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-200 via-white to-purple-200 bg-clip-text text-transparent">
                                Mixer Layers
                            </h2>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                {layers.length > 0 && (
                                    <button
                                        onClick={() => setIsClearModalOpen(true)}
                                        className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-xl font-medium transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
                                    >
                                        <Trash size={20} weight="bold" />
                                        Clear All
                                    </button>
                                )}
                                <button
                                    onClick={addLayer}
                                    className="px-5 py-2.5 bg-gradient-to-r from-accent to-accent-hover text-navy-dark rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-accent/20 flex items-center gap-2 cursor-pointer"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Layer
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 h-auto lg:max-h-[calc(100vh-250px)] lg:overflow-y-auto lg:pr-2 custom-scrollbar">
                            {layers.length === 0 ? (
                                <div className="bg-purple-card/60 backdrop-blur-md p-12 rounded-2xl text-center border-2 border-dashed border-white/10 flex flex-col items-center justify-center min-h-[400px]">
                                    <div className="text-7xl mb-6 opacity-80">🎚️</div>
                                    <h3 className="text-2xl text-white font-light mb-2">Start Mixing</h3>
                                    <p className="text-purple-200 text-lg mb-8 max-w-md mx-auto">
                                        Add layers to create your perfect soundscape. Combine different sounds to find your flow.
                                    </p>
                                    <button
                                        onClick={addLayer}
                                        className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all font-medium border border-white/10 hover:border-white/30 cursor-pointer"
                                    >
                                        + Add First Layer
                                    </button>
                                </div>
                            ) : (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={layers.map(l => l.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {layers.map(layer => (
                                            <MixerLayer
                                                key={layer.id}
                                                layer={layer}
                                                categories={allCategories}
                                                customSounds={customSounds}
                                                onCategoryChange={(cat) => updateLayerCategory(layer.id, cat)}
                                                onSoundChange={(soundId) => updateLayerSound(layer.id, soundId)}
                                                onTogglePlay={() => toggleLayer(layer.id)}
                                                onVolumeChange={(vol) => updateLayerVolume(layer.id, vol)}
                                                onToggleMute={() => toggleLayerMute(layer.id)}
                                                onRemove={() => removeLayer(layer.id)}
                                            />
                                        ))}
                                    </SortableContext>
                                </DndContext>
                            )}
                        </div>
                    </div>

                    {/* Right Panel - Master Controls & Presets */}
                    <div className="lg:col-span-1 space-y-6">
                        <MasterControls
                            masterVolume={masterVolume}
                            onMasterVolumeChange={setMasterVolume}
                            onPlayAll={playAll}
                            onPauseAll={pauseAll}
                            onAddCustomSound={handleOpenUploadModal}
                            onSavePreset={() => setIsSavePresetModalOpen(true)}
                        />

                        <PresetManager
                            presets={presets}
                            onLoadPreset={handleLoadPreset}
                            onDeletePreset={deletePreset}
                        />
                    </div>
                </div>
            </div>

            {/* Modals */}
            <UploadSoundModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUpload={handleUploadSound}
                categories={customCategories}
            />

            <SavePresetModal
                isOpen={isSavePresetModalOpen}
                onClose={() => setIsSavePresetModalOpen(false)}
                onSave={handleSavePreset}
            />

            <ConfirmationModal
                isOpen={isClearModalOpen}
                onClose={() => setIsClearModalOpen(false)}
                onConfirm={handleConfirmClear}
                title="Clear All Layers"
                message="Are you sure you want to remove all sound layers? This action cannot be undone."
                confirmText="Yes, Clear All"
                isDanger
            />
            <SupportPopup />
        </AtmosphereBackground>
    );
};

export default Mixer;
