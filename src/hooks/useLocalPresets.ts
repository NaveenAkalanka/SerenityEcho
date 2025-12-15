import { useState, useEffect, useCallback } from 'react';
import type { Preset } from '../types/Preset';
import type { MixerLayer } from '../types/MixerLayer';
import { getPresets, savePreset as dbSavePreset, deletePreset as dbDeletePreset, initDB } from '../services/audioStorage';

export const useLocalPresets = () => {
    const [presets, setPresets] = useState<Preset[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load presets from IndexedDB on mount
    useEffect(() => {
        const loadPresets = async () => {
            try {
                await initDB();
                const storedPresets = await getPresets();
                console.log('useLocalPresets: Loaded from DB:', storedPresets);
                setPresets(storedPresets);
            } catch (error) {
                console.error('Error loading presets from DB:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadPresets();
    }, []);

    // Save current mix as a preset (Persist to DB)
    const savePreset = useCallback(async (name: string, layers: MixerLayer[], masterVolume: number) => {
        try {
            // Save to DB
            const savedPreset = await dbSavePreset(name, layers, masterVolume);

            // Update local state with the returned preset (which has the ID)
            const newPreset: Preset = {
                id: savedPreset.id,
                name: savedPreset.name,
                layers: savedPreset.layers,
                masterVolume,
                createdAt: Date.now()
            };

            // Re-fetch to be sure or just update state
            setPresets(prev => [...prev, newPreset]);
            return newPreset;
        } catch (error) {
            console.error('Failed to save preset:', error);
            throw error;
        }
    }, []);

    // Delete a preset (Persist to DB)
    const deletePreset = useCallback(async (presetId: string) => {
        try {
            await dbDeletePreset(presetId);
            setPresets(prev => prev.filter(p => p.id !== presetId));
        } catch (error) {
            console.error('Failed to delete preset:', error);
            throw error;
        }
    }, []);

    // Load a preset (returns the preset data)
    const loadPreset = useCallback((preset: Preset) => {
        return preset;
    }, []);

    return {
        presets,
        savePreset,
        deletePreset,
        loadPreset,
        isLoading
    };
};
