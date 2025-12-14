id: string;
name: string;
selectedCategory: string | null;
selectedCategoryId ?: string | null; // Strict Foreign Key
selectedSoundId: string | null;
volume: number;
isPlaying: boolean;
isMuted: boolean;
loop: boolean;
    // Runtime audio nodes are now managed via refs in useAudioEngine
}
