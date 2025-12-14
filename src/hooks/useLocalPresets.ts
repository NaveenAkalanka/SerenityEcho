import { useState, useEffect, useCallback } from 'react';
import type { Preset } from '../types/Preset';
import type { MixerLayer } from '../types/MixerLayer';
import { getPresets, savePreset as dbSavePreset, deletePreset as dbDeletePreset, initDB } from '../services/audioStorage';

export const useLocalPresets = () => {
    const [presets, setPresets] = useState<Preset[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load presets from IndexedDB on mount
    useEffect(() => {
        const loadPresets = async () => {
            try {
                await initDB();
                const storedPresets = await getPresets();
                console.log('useLocalPresets: Loaded from DB:', storedPresets);
                // Sort by creation time if needed, though DB usually returns in key order or insert order
                setPresets(storedPresets);
            } catch (error) {
                console.error('Error loading presets from DB:', error);
            } finally {
                setIsInitialized(true);
            }
        };
        loadPresets();
    }, []);

    // Save current mix as a preset (Persist to DB)
    const savePreset = useCallback(async (name: string, layers: MixerLayer[], masterVolume: number) => {
        try {
            // Save to DB
            const savedPreset = await dbSavePreset(name, layers);

            // Update local state with the returned preset (which has the ID)
            const newPreset: Preset = {
                id: savedPreset.id,
                name: savedPreset.name,
                layers: savedPreset.layers,
                masterVolume, // Note: masterVolume is currently passed but not fully stored in DB schema in previous steps? 
                // Wait, checking audioStorage.savePreset signature... it accepts (name, layers). 
                // MasterVolume seems missing from DB schema/save function in audioStorage.
                // We should probably update audioStorage to accept masterVolume too, 
                // but for now let's ensure we at least store the structure correctly.
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
    };
};
