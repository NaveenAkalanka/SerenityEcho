import { useState, useEffect, useRef, useCallback } from 'react';
import type { MixerLayer } from '../types/MixerLayer';
import type { SoundTrack } from '../types/SoundTrack';
import { SOUND_LIBRARY } from '../data/soundLibrary';

interface LayerAudioNodes {
    source?: AudioBufferSourceNode;
    gain?: GainNode;
    buffer?: AudioBuffer;
}

export const useAudioEngine = (customSounds: SoundTrack[] = []) => {
    const [layers, setLayers] = useState<MixerLayer[]>([]);
    const [masterVolume, setMasterVolume] = useState(70);
    const audioContextRef = useRef<AudioContext | null>(null);
    const masterGainRef = useRef<GainNode | null>(null);
    const layerNodesRef = useRef<Record<string, LayerAudioNodes>>({});
    const layersRef = useRef<MixerLayer[]>([]);

    // Keep layersRef in sync
    useEffect(() => {
        layersRef.current = layers;
    }, [layers]);

    // Initialize AudioContext
    useEffect(() => {
        const initAudioContext = () => {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                masterGainRef.current = audioContextRef.current.createGain();
                masterGainRef.current.connect(audioContextRef.current.destination);
                masterGainRef.current.gain.value = masterVolume / 100;
            }
        };

        const handleUserInteraction = () => {
            initAudioContext();
            document.removeEventListener('click', handleUserInteraction);
        };
        document.addEventListener('click', handleUserInteraction);

        return () => {
            document.removeEventListener('click', handleUserInteraction);
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    // Update master volume
    useEffect(() => {
        if (masterGainRef.current) {
            masterGainRef.current.gain.value = masterVolume / 100;
        }
    }, [masterVolume]);

    // Load audio from URL
    const loadAudioFromURL = useCallback(async (url: string): Promise<AudioBuffer | undefined> => {
        if (!audioContextRef.current) return undefined;
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            return await audioContextRef.current.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error('Error loading audio from URL:', error);
            return undefined;
        }
    }, []);

    // Helper to stop a layer's audio
    const stopLayerAudio = useCallback((layerId: string) => {
        const nodes = layerNodesRef.current[layerId];
        if (nodes?.source) {
            try {
                nodes.source.stop();
                nodes.source.disconnect();
            } catch (e) {
                // Ignore errors if already stopped
            }
        }
        if (nodes?.gain) {
            nodes.gain.disconnect();
        }
        // Keep the buffer, but clear source and gain
        if (nodes) {
            layerNodesRef.current[layerId] = { buffer: nodes.buffer };
        }
    }, []);

    // Play a layer
    const playLayer = useCallback(async (layerId: string) => {
        const layer = layers.find(l => l.id === layerId);
        if (!layer || !layer.selectedSoundId || !audioContextRef.current || !masterGainRef.current) return;

        // Ensure context is running
        if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
        }

        // Get or load buffer
        let buffer = layerNodesRef.current[layerId]?.buffer;
        if (!buffer) {
            // Check default sounds first
            let sound = SOUND_LIBRARY.find(s => s.id === layer.selectedSoundId);

            // If not found in default sounds, check custom sounds
            if (!sound) {
                const customSound = customSounds.find(s => s.id === layer.selectedSoundId);
                if (customSound && customSound.filePath) {
                    sound = {
                        id: customSound.id,
                        name: customSound.name,
                        category: customSound.category || '',
                        icon: customSound.icon || '🎵',
                        filePath: customSound.filePath
                    };
                }
            }

            if (sound && sound.filePath) {
                buffer = await loadAudioFromURL(sound.filePath);
                if (buffer) {
                    // Store buffer
                    layerNodesRef.current[layerId] = { ...layerNodesRef.current[layerId], buffer };
                }
            }
        }

        if (buffer) {
            // Stop existing if any (shouldn't happen if logic is correct, but safety first)
            stopLayerAudio(layerId);

            const source = audioContextRef.current.createBufferSource();
            const gainNode = audioContextRef.current.createGain();

            source.buffer = buffer;
            source.loop = layer.loop;

            // Use layersRef to get latest volume/mute state
            const currentLayer = layersRef.current.find(l => l.id === layerId) || layer;
            const volume = currentLayer.isMuted ? 0 : currentLayer.volume / 100;

            gainNode.gain.value = volume;

            source.connect(gainNode);
            if (masterGainRef.current) {
                gainNode.connect(masterGainRef.current);
            }

            source.start(0);

            // Store nodes
            layerNodesRef.current[layerId] = { buffer, source, gain: gainNode };

            // Update state
            setLayers(prev => prev.map(l => l.id === layerId ? { ...l, isPlaying: true } : l));
        }
    }, [layers, loadAudioFromURL, stopLayerAudio]);

    // Add a new empty layer
    const addLayer = useCallback(() => {
        const newLayer: MixerLayer = {
            id: `layer-${Date.now()}`,
            name: `Layer ${layers.length + 1}`,
            selectedCategory: null,
            selectedSoundId: null,
            volume: 75,
            isPlaying: false,
            isMuted: false,
            loop: true,
        };
        setLayers(prev => [...prev, newLayer]);
    }, [layers.length]);

    // Remove a layer
    const removeLayer = useCallback((layerId: string) => {
        stopLayerAudio(layerId);
        delete layerNodesRef.current[layerId];
        setLayers(prev => prev.filter(l => l.id !== layerId));
    }, [stopLayerAudio]);

    // Update layer category
    const updateLayerCategory = useCallback((layerId: string, category: string) => {
        stopLayerAudio(layerId);
        setLayers(prev => prev.map(layer => {
            if (layer.id === layerId) {
                return {
                    ...layer,
                    selectedCategory: category,
                    selectedSoundId: null, // Reset sound
                    isPlaying: false,
                };
            }
            return layer;
        }));
    }, [stopLayerAudio]);

    // Update layer sound
    const updateLayerSound = useCallback((layerId: string, soundId: string) => {
        stopLayerAudio(layerId);
        // Clear buffer for this layer as sound changed
        if (layerNodesRef.current[layerId]) {
            layerNodesRef.current[layerId].buffer = undefined;
        }

        setLayers(prev => prev.map(layer => {
            if (layer.id === layerId) {
                return {
                    ...layer,
                    selectedSoundId: soundId,
                    isPlaying: false,
                };
            }
            return layer;
        }));
    }, [stopLayerAudio]);

    // Update volume
    const updateLayerVolume = useCallback((layerId: string, volume: number) => {
        // Update audio node directly
        const nodes = layerNodesRef.current[layerId];
        // We need to check isMuted from state... but we don't have it easily here without iterating.
        // However, we can use the functional update of setLayers to get the current state, 
        // BUT we want to update the audio node immediately.
        // Let's assume we update the state, and if we have the node, we update it.

        setLayers(prev => prev.map(layer => {
            if (layer.id === layerId) {
                if (nodes?.gain) {
                    nodes.gain.gain.value = layer.isMuted ? 0 : volume / 100;
                }
                return { ...layer, volume };
            }
            return layer;
        }));
    }, []);

    // Toggle Mute
    const toggleLayerMute = useCallback((layerId: string) => {
        const nodes = layerNodesRef.current[layerId];

        setLayers(prev => prev.map(layer => {
            if (layer.id === layerId) {
                const newMuted = !layer.isMuted;
                if (nodes?.gain) {
                    nodes.gain.gain.value = newMuted ? 0 : layer.volume / 100;
                }
                return { ...layer, isMuted: newMuted };
            }
            return layer;
        }));
    }, []);

    // Toggle layer play/pause
    const handleToggleLayer = useCallback((layerId: string) => {
        setLayers(prev => {
            const layer = prev.find(l => l.id === layerId);
            if (!layer) return prev;

            if (layer.isPlaying) {
                stopLayerAudio(layerId);
                return prev.map(l => l.id === layerId ? { ...l, isPlaying: false } : l);
            } else {
                // We can't await here inside setState, so we trigger play outside
                // But playLayer needs the latest state? 
                // playLayer uses `layers` from closure. 
                // We should call playLayer directly.
                return prev;
            }
        });

        // Check current state (from ref or closure? closure `layers` might be stale)
        // Better to check the layer from the `prev` in setLayers? No.
        // Let's just check the layer in the current `layers` state.
        const layer = layers.find(l => l.id === layerId);
        if (layer && !layer.isPlaying) {
            playLayer(layerId);
        }
    }, [layers, playLayer, stopLayerAudio]);

    // Play All
    const playAll = useCallback(() => {
        layers.forEach(layer => {
            if (!layer.isPlaying && layer.selectedSoundId) {
                playLayer(layer.id);
            }
        });
    }, [layers, playLayer]);

    // Pause All
    const pauseAll = useCallback(() => {
        layers.forEach(layer => {
            if (layer.isPlaying) {
                stopLayerAudio(layer.id);
            }
        });
        setLayers(prev => prev.map(l => ({ ...l, isPlaying: false })));
    }, [layers, stopLayerAudio]);

    // Load layers (for presets)
    const loadLayers = useCallback((newLayers: MixerLayer[]) => {
        // Stop all current sounds
        layers.forEach(layer => {
            stopLayerAudio(layer.id);
        });
        // Clear all refs
        layerNodesRef.current = {};

        setLayers(newLayers);
    }, [layers, stopLayerAudio]);

    // Reorder layers
    const reorderLayers = useCallback((oldIndex: number, newIndex: number) => {
        setLayers(prev => {
            const newLayers = [...prev];
            const [movedLayer] = newLayers.splice(oldIndex, 1);
            newLayers.splice(newIndex, 0, movedLayer);
            return newLayers;
        });
    }, []);

    // Clear all layers
    const clearAllLayers = useCallback(() => {
        // Stop audio for all layers
        layers.forEach(layer => stopLayerAudio(layer.id));
        // Clear references
        layerNodesRef.current = {};
        // Clear state
        setLayers([]);
    }, [layers, stopLayerAudio]);

    return {
        layers,
        masterVolume,
        setMasterVolume,
        addLayer,
        removeLayer,
        updateLayerCategory,
        updateLayerSound,
        toggleLayer: handleToggleLayer,
        updateLayerVolume,
        toggleLayerMute,
        playAll,
        pauseAll,
        loadLayers,
        reorderLayers,
        clearAllLayers
    };
};
