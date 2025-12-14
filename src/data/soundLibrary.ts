export interface SoundDefinition {
    id: string;
    name: string;
    category: string;
    icon: string;
    filePath: string;
}

export const SOUND_CATEGORIES = [
    'Beach & Ocean',
    'Rain & Storms',
    'Forest',
    'Water',
    'Wind',
    'Crickets & Insects',
    'Meditation Bells',
    'Singing Bowls & Gongs',
    'Wind Chimes & Zen',
    'Guided Meditation'
] as const;

export type SoundCategory = typeof SOUND_CATEGORIES[number];

export const CATEGORY_ICONS: Record<SoundCategory, string> = {
    'Beach & Ocean': '🌊',
    'Rain & Storms': '⛈️',
    'Forest': '🌲',
    'Water': '💧',
    'Wind': '💨',
    'Crickets & Insects': '🦗',
    'Meditation Bells': '🔔',
    'Singing Bowls & Gongs': '🎵',
    'Wind Chimes & Zen': '🎐',
    'Guided Meditation': '🧘'
};

export const SOUND_LIBRARY: SoundDefinition[] = [
    // Beach & Ocean (3 files)
    {
        id: 'gentle-waves',
        name: 'Gentle Waves',
        category: 'Beach & Ocean',
        icon: '🌊',
        filePath: '/sounds/Beach & Ocean/Gentle Waves.mp3'
    },
    {
        id: 'seagulls-at-shore',
        name: 'Seagulls at Shore',
        category: 'Beach & Ocean',
        icon: '🕊️',
        filePath: '/sounds/Beach & Ocean/Seagulls at Shore.mp3'
    },
    {
        id: 'windy-coastal-waves',
        name: 'Windy Coastal Waves',
        category: 'Beach & Ocean',
        icon: '🌊',
        filePath: '/sounds/Beach & Ocean/Windy Coastal Waves.mp3'
    },

    // Rain & Storms (7 files)
    {
        id: 'calming-rain',
        name: 'Calming Rain',
        category: 'Rain & Storms',
        icon: '🌧️',
        filePath: '/sounds/Rain & Storms/Calming Rain.mp3'
    },
    {
        id: 'gentle-rain',
        name: 'Gentle Rain',
        category: 'Rain & Storms',
        icon: '🌧️',
        filePath: '/sounds/Rain & Storms/Gentle Rain.mp3'
    },
    {
        id: 'light-storm',
        name: 'Light Storm',
        category: 'Rain & Storms',
        icon: '⛈️',
        filePath: '/sounds/Rain & Storms/Light Storm.mp3'
    },
    {
        id: 'thunder-and-rain',
        name: 'Thunder and Rain',
        category: 'Rain & Storms',
        icon: '⚡',
        filePath: '/sounds/Rain & Storms/Thunder and Rain.mp3'
    },
    {
        id: 'mild-thunderstorm',
        name: 'Mild Thunderstorm',
        category: 'Rain & Storms',
        icon: '⛈️',
        filePath: '/sounds/Rain & Storms/Mild Thunderstorm.mp3'
    },
    {
        id: 'lightning-strike',
        name: 'Lightning Strike',
        category: 'Rain & Storms',
        icon: '⚡',
        filePath: '/sounds/Rain & Storms/Lightning Strike.mp3'
    },
    {
        id: 'lightning-soundscape',
        name: 'Lightning Soundscape',
        category: 'Rain & Storms',
        icon: '⚡',
        filePath: '/sounds/Rain & Storms/Lightning Soundscape.mp3'
    },

    // Forest (3 files)
    {
        id: 'forest-ambience',
        name: 'Forest Ambience',
        category: 'Forest',
        icon: '🌲',
        filePath: '/sounds/Forest/Forest Ambience.mp3'
    },
    {
        id: 'woodland-atmosphere',
        name: 'Woodland Atmosphere',
        category: 'Forest',
        icon: '🌳',
        filePath: '/sounds/Forest/Woodland Atmosphere.mp3'
    },
    {
        id: 'deep-forest',
        name: 'Deep Forest',
        category: 'Forest',
        icon: '🌲',
        filePath: '/sounds/Forest/Deep Forest.mp3'
    },

    // Water (3 files)
    {
        id: 'flowing-stream',
        name: 'Flowing Stream',
        category: 'Water',
        icon: '💧',
        filePath: '/sounds/Water/Flowing Stream.mp3'
    },
    {
        id: 'spring-stream',
        name: 'Spring Stream',
        category: 'Water',
        icon: '💧',
        filePath: '/sounds/Water/Spring Stream.mp3'
    },
    {
        id: 'waterfall',
        name: 'Waterfall',
        category: 'Water',
        icon: '💦',
        filePath: '/sounds/Water/Waterfall.mp3'
    },

    // Wind (3 files)
    {
        id: 'soft-breeze',
        name: 'Soft Breeze',
        category: 'Wind',
        icon: '💨',
        filePath: '/sounds/Wind/Soft Breeze.mp3'
    },
    {
        id: 'wind-blowing',
        name: 'Wind Blowing',
        category: 'Wind',
        icon: '🌬️',
        filePath: '/sounds/Wind/Wind Blowing.mp3'
    },
    {
        id: 'winter-wind',
        name: 'Winter Wind',
        category: 'Wind',
        icon: '❄️',
        filePath: '/sounds/Wind/Winter Wind.mp3'
    },

    // Crickets & Insects (3 files)
    {
        id: 'cricket-chorus',
        name: 'Cricket Chorus',
        category: 'Crickets & Insects',
        icon: '🦗',
        filePath: '/sounds/Crickets & Insects/Cricket Chorus.mp3'
    },
    {
        id: 'night-crickets',
        name: 'Night Crickets',
        category: 'Crickets & Insects',
        icon: '🌙',
        filePath: '/sounds/Crickets & Insects/Night Crickets.mp3'
    },
    {
        id: 'summer-crickets',
        name: 'Summer Crickets',
        category: 'Crickets & Insects',
        icon: '☀️',
        filePath: '/sounds/Crickets & Insects/Summer Crickets.mp3'
    },

    // Meditation Bells (7 files)
    {
        id: 'clear-bell',
        name: 'Clear Bell',
        category: 'Meditation Bells',
        icon: '🔔',
        filePath: '/sounds/Meditation Bells/Clear Bell.mp3'
    },
    {
        id: 'meditation-bell',
        name: 'Meditation Bell',
        category: 'Meditation Bells',
        icon: '🔔',
        filePath: '/sounds/Meditation Bells/Meditation Bell.mp3'
    },
    {
        id: 'crown-chakra-bell',
        name: 'Crown Chakra Bell',
        category: 'Meditation Bells',
        icon: '👑',
        filePath: '/sounds/Meditation Bells/Crown Chakra Bell.mp3'
    },
    {
        id: 'heart-chakra-bell',
        name: 'Heart Chakra Bell',
        category: 'Meditation Bells',
        icon: '💚',
        filePath: '/sounds/Meditation Bells/Heart Chakra Bell.mp3'
    },
    {
        id: 'root-chakra-bell',
        name: 'Root Chakra Bell',
        category: 'Meditation Bells',
        icon: '🔴',
        filePath: '/sounds/Meditation Bells/Root Chakra Bell.mp3'
    },
    {
        id: 'solar-plexus-bell',
        name: 'Solar Plexus Bell',
        category: 'Meditation Bells',
        icon: '💛',
        filePath: '/sounds/Meditation Bells/Solar Plexus Bell.mp3'
    },
    {
        id: 'third-eye-bell',
        name: 'Third Eye Bell',
        category: 'Meditation Bells',
        icon: '💜',
        filePath: '/sounds/Meditation Bells/Third Eye Bell.mp3'
    },

    // Singing Bowls & Gongs (4 files)
    {
        id: 'deep-singing-bowl',
        name: 'Deep Singing Bowl',
        category: 'Singing Bowls & Gongs',
        icon: '🎵',
        filePath: '/sounds/Singing Bowls & Gongs/Deep Singing Bowl.mp3'
    },
    {
        id: 'singing-bowl',
        name: 'Singing Bowl',
        category: 'Singing Bowls & Gongs',
        icon: '🎶',
        filePath: '/sounds/Singing Bowls & Gongs/Singing Bowl.mp3'
    },
    {
        id: 'gong',
        name: 'Gong',
        category: 'Singing Bowls & Gongs',
        icon: '🥁',
        filePath: '/sounds/Singing Bowls & Gongs/Gong.mp3'
    },
    {
        id: 'tuning-fork',
        name: 'Tuning Fork',
        category: 'Singing Bowls & Gongs',
        icon: '🎼',
        filePath: '/sounds/Singing Bowls & Gongs/Tuning Fork.mp3'
    },

    // Wind Chimes & Zen (3 files)
    {
        id: 'wind-chimes',
        name: 'Wind Chimes',
        category: 'Wind Chimes & Zen',
        icon: '🎐',
        filePath: '/sounds/Wind Chimes & Zen/Wind Chimes.mp3'
    },
    {
        id: 'zen-fountain',
        name: 'Zen Fountain',
        category: 'Wind Chimes & Zen',
        icon: '⛲',
        filePath: '/sounds/Wind Chimes & Zen/Zen Fountain.mp3'
    },
    {
        id: 'zen-tone',
        name: 'Zen Tone',
        category: 'Wind Chimes & Zen',
        icon: '☯️',
        filePath: '/sounds/Wind Chimes & Zen/Zen Tone.mp3'
    },

    // Guided Meditation (1 file)
    {
        id: 'peaceful-meditation',
        name: 'Peaceful Meditation',
        category: 'Guided Meditation',
        icon: '🧘',
        filePath: '/sounds/Guided Meditation/Peaceful Meditation.mp3'
    }
];

// Helper function to get sounds by category
export const getSoundsByCategory = (category: SoundCategory): SoundDefinition[] => {
    return SOUND_LIBRARY.filter(sound => sound.category === category);
};

// Helper function to get all categories with counts
export const getCategoriesWithCounts = (): Array<{ category: SoundCategory; count: number; icon: string }> => {
    return SOUND_CATEGORIES.map(category => ({
        category,
        count: getSoundsByCategory(category).length,
        icon: CATEGORY_ICONS[category]
    }));
};
