import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { SoundTrack } from '../types/SoundTrack';
import type { MixerLayer } from '../types/MixerLayer';

interface SerenityEchoDB extends DBSchema {
    sounds: {
        key: string;
        value: {
            id: string;
            name: string;
            category: string;
            categoryId: string;
            blob: Blob;
            createdAt: number;
        };
        indexes: { 'by-category': string };
    };
    presets: {
        key: string;
        value: {
            id: string;
            name: string;
            layers: MixerLayer[];
            masterVolume: number;
            createdAt: number;
        };
    };
    categories: {
        key: string;
        value: {
            id: string;
            name: string;
        };
    };
}

const DB_NAME = 'serenity-echo-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<SerenityEchoDB>>;

export const initDB = () => {
    if (!dbPromise) {
        dbPromise = openDB<SerenityEchoDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                // Sounds store
                const soundStore = db.createObjectStore('sounds', { keyPath: 'id' });
                soundStore.createIndex('by-category', 'category');

                // Presets store
                db.createObjectStore('presets', { keyPath: 'id' });

                // Categories store
                db.createObjectStore('categories', { keyPath: 'id' });
            },
            terminated() {
                // The browser terminated the connection (e.g. idle timeout, crash)
                // Reset the promise so we reopen it next time
                dbPromise = undefined as any;
            },
        });
    }
    return dbPromise;
};

export const saveSound = async (file: File, category: string, name: string, categoryId: string): Promise<SoundTrack> => {
    const db = await initDB();

    // Check for duplicate sound name in this category
    const allSounds = await db.getAll('sounds');
    const duplicate = allSounds.find(s =>
        s.categoryId === categoryId && s.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (duplicate) {
        throw new Error(`Sound "${name}" already exists in this category.`);
    }

    const id = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const sound = {
        id,
        name,
        category, // Legacy name storage
        categoryId, // STRICT FOREIGN KEY
        blob: file,
        createdAt: Date.now(),
    };
    await db.put('sounds', sound);

    // Return a SoundTrack compatible object
    return {
        id,
        name,
        category,
        categoryId,
        filePath: URL.createObjectURL(file), // Create a temporary URL for immediate use
        isCustom: true,
        isPlaying: false,
        volume: 75,
        loop: true,
    };
};

export const getSounds = async (): Promise<SoundTrack[]> => {
    const db = await initDB();
    const sounds = await db.getAll('sounds');
    return sounds.map(s => ({
        id: s.id,
        name: s.name,
        category: s.category,
        categoryId: s.categoryId, // Ensure retrieval
        filePath: URL.createObjectURL(s.blob), // Create URL from stored blob
        isCustom: true,
        isPlaying: false,
        volume: 75,
        loop: true,
    }));
};

export const deleteSound = async (id: string) => {
    const db = await initDB();

    // Block Delete: Check if used in any preset
    const allPresets = await db.getAll('presets');
    const usedInPresets = allPresets.filter(preset =>
        preset.layers.some(layer => {
            const match = layer.selectedSoundId === id;
            return match;
        })
    );

    if (usedInPresets.length > 0) {
        const presetNames = usedInPresets.map(p => p.name).join(', ');
        throw new Error(`Cannot delete sound. It is used in the following presets: ${presetNames}. Please delete the presets first.`);
    }

    const tx = db.transaction(['sounds'], 'readwrite');

    // Delete the sound
    tx.objectStore('sounds').delete(id);

    await tx.done;
};

export const deleteCategory = async (id: string) => {
    if (!id) {
        throw new Error('Invalid category ID');
    }
    const db = await initDB();

    // 1. Get the Category by ID to ensure it exists and get its Name
    const category = await db.get('categories', id);
    if (!category) {
        throw new Error(`Category not found.`);
    }
    const categoryName = category.name;

    // 2. Get all sounds to filter by CATEGORY ID (Strict Relational Check)
    const sounds = await db.getAll('sounds');
    const soundsToDelete = sounds.filter(s => s.categoryId === id); // Strict check

    // Fallback: If no sounds found by ID (legacy data), try name match for safety
    if (soundsToDelete.length === 0) {
        console.warn('[DB] No sounds found by ID, checking legacy name match...');
        const normalizedTargetName = categoryName.trim().toLowerCase();
        const legacySounds = sounds.filter(s => s.category.trim().toLowerCase() === normalizedTargetName);
        if (legacySounds.length > 0) {
            console.log(`[DB] Found ${legacySounds.length} legacy sounds to delete.`);
            soundsToDelete.push(...legacySounds);
        }
    }

    console.log(`[DEBUG-DELETE-CAT] Found ${soundsToDelete.length} sounds to delete for category "${categoryName}"`);

    // 3. Block Delete: Check if any sound in this category is used in a preset
    const allPresets = await db.getAll('presets');

    // Get IDs of all sounds in this category to check against preset layers
    const categorySoundIds = soundsToDelete.map(s => s.id);
    const targetCategoryLower = categoryName.trim().toLowerCase();

    const usedInPresets = allPresets.filter(preset =>
        preset.layers.some(layer => {
            // Check 1: Explicit category match on layer (Case Insensitive)
            let catMatch = false;
            if (layer.selectedCategory && layer.selectedCategory.trim().toLowerCase() === targetCategoryLower) {
                catMatch = true;
            }

            // Check 2: Sound ID match (if the sound belongs to this category)
            let soundMatch = false;
            if (layer.selectedSoundId && categorySoundIds.includes(layer.selectedSoundId)) {
                soundMatch = true;
            }

            return catMatch || soundMatch;
        })
    );

    if (usedInPresets.length > 0) {
        const presetNames = usedInPresets.map(p => p.name).join(', ');
        throw new Error(`Cannot delete category. Sounds from this category are used in: ${presetNames}. Please delete the presets first.`);
    }

    // 4. Delete all sounds in this category and the category itself
    const tx = db.transaction(['sounds', 'categories'], 'readwrite');
    const promises = [
        ...soundsToDelete.map(s => tx.objectStore('sounds').delete(s.id)),
        tx.objectStore('categories').delete(id)
    ];

    await Promise.all(promises);
    await tx.done;
};

export const saveCategory = async (name: string) => {
    const db = await initDB();

    // Check for duplicate category name
    const allCategories = await db.getAll('categories');
    const duplicate = allCategories.find(c => c.name.toLowerCase() === name.trim().toLowerCase());
    if (duplicate) {
        throw new Error(`Category "${name}" already exists.`);
    }

    const id = `cat-${Date.now()}`;
    await db.put('categories', { id, name });
    return { id, name };
};

export const getCategories = async () => {
    const db = await initDB();
    return await db.getAll('categories');
};

export const savePreset = async (name: string, layers: MixerLayer[], masterVolume: number) => {
    try {
        const db = await initDB();
        const id = `preset-${Date.now()}`;

        // Strict Data Sanitization: explicitly map only serializable fields
        // preventing DataCloneError if runtime objects have functions/symbols/DOM nodes
        const cleanLayers = layers.map(layer => ({
            id: layer.id,
            name: layer.name,
            selectedCategory: layer.selectedCategory || null,
            selectedCategoryId: layer.selectedCategoryId || null, // Ensure strict FK is saved
            selectedSoundId: layer.selectedSoundId || null,
            volume: layer.volume || 75,
            isPlaying: false, // Always reset play state on save
            isMuted: layer.isMuted || false,
            loop: layer.loop ?? true
        }));

        console.log('[DB-SAVE-PRESET] Saving:', { id, name, layers: cleanLayers, masterVolume });

        await db.put('presets', {
            id,
            name,
            layers: cleanLayers,
            masterVolume,
            createdAt: Date.now(),
        });

        console.log('[DB-SAVE-PRESET] Success!');
        return { id, name, layers: cleanLayers, masterVolume };
    } catch (error) {
        console.error('[DB-SAVE-PRESET] Failed:', error);
        throw error;
    }
};

export const getPresets = async () => {
    const db = await initDB();
    const presets = await db.getAll('presets');
    return presets.map(p => ({
        ...p,
        masterVolume: p.masterVolume ?? 1 // Default to 1 (100%) if missing
    }));
};

export const deletePreset = async (id: string) => {
    const db = await initDB();
    await db.delete('presets', id);
};
