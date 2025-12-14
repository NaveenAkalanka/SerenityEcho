export interface SoundTrack {
    id: string;
    name: string;
    category: string; // Keep for legacy/display if needed, or rely on lookup
    categoryId?: string; // New Foreign Key
    icon?: string;
    description?: string;
    filePath?: string;
    volume: number;
    isPlaying: boolean;
    isMuted?: boolean;
    loop: boolean;
    isCustom?: boolean;
}
