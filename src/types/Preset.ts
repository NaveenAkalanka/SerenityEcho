export interface Preset {
    id: string;
    name: string;
    createdAt: number;
    layers: {
        id: string;
        name: string;
        selectedCategory: string | null;
        selectedSoundId: string | null;
        volume: number;
        isPlaying: boolean;
        isMuted: boolean;
        loop: boolean;
    }[];
    masterVolume: number;
}
