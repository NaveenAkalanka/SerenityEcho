import React, { useState, useEffect, useRef } from 'react';
import { getSounds, getCategories, saveSound, saveCategory, deleteSound, deleteCategory, initDB } from '../services/audioStorage';
import type { SoundTrack } from '../types/SoundTrack';
import { SOUND_LIBRARY, SOUND_CATEGORIES, CATEGORY_ICONS } from '../data/soundLibrary';
import ConfirmationModal from '../components/ConfirmationModal/ConfirmationModal';
import { useToast } from '../components/Toast/ToastContext';

const SoundLibrary: React.FC = () => {
    const [customSounds, setCustomSounds] = useState<SoundTrack[]>([]);
    const [customCategories, setCustomCategories] = useState<{ id: string; name: string }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
    const [isAddSoundModalOpen, setIsAddSoundModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newSoundName, setNewSoundName] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [playingSound, setPlayingSound] = useState<string | null>(null);
    const [isBannerVisible, setIsBannerVisible] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            await initDB();
            const sounds = await getSounds();
            const categories = await getCategories();
            setCustomSounds(sounds);
            setCustomCategories(categories);
        } catch (error) {
            console.error('Failed to load library data:', error);
            // Don't alert here to avoid spamming on load, but log it.
        }
    };

    const handleAddCategory = async () => {
        if (newCategoryName.trim()) {
            try {
                await saveCategory(newCategoryName.trim());
                setNewCategoryName('');
                setIsAddCategoryModalOpen(false);
                loadData();
            } catch (error: any) {
                showToast(error.message, 'error');
            }
        }
    };

    const handleAddSound = async () => {
        if (selectedFile && newSoundName.trim() && selectedCategory) {
            try {
                const categoryId = customCategories.find(c => c.name === selectedCategory)?.id;
                if (!categoryId) throw new Error('Invalid category ID');

                await saveSound(selectedFile, selectedCategory, newSoundName.trim(), categoryId);
                setNewSoundName('');
                setSelectedFile(null);
                setIsAddSoundModalOpen(false);
                loadData();
            } catch (error: any) {
                showToast(error.message, 'error');
            }
        }
    };

    const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'sound' | 'category'; id: string; name?: string } | null>(null);

    // ... existing effects ...

    const handleDeleteSound = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeleteConfirm({ type: 'sound', id });
    };

    const handleDeleteCategory = (cat: { id: string; name: string }, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeleteConfirm({ type: 'category', id: cat.id, name: cat.name });
    };

    const handleConfirmDelete = async () => {
        if (!deleteConfirm) return;

        try {
            if (deleteConfirm.type === 'sound') {
                await deleteSound(deleteConfirm.id);
            } else {
                await deleteCategory(deleteConfirm.id);
                // If we deleted the currently selected category, clear selection
                if (selectedCategory === deleteConfirm.name) {
                    setSelectedCategory(null);
                }
            }
            await loadData();
        } catch (error: any) {
            console.error('Failed to delete:', error);
            showToast(error.message || 'Failed to delete.', 'error');
        } finally {
            setDeleteConfirm(null);
        }
    };

    // Play sound function
    const handlePlaySound = (filePath: string, soundId: string) => {
        // Stop current audio if playing
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        // Create new audio element
        const audio = new Audio(filePath);
        audioRef.current = audio;
        setPlayingSound(soundId);

        // Play once (no loop)
        audio.loop = false;
        audio.play();

        // Reset playing state when finished
        audio.onended = () => {
            setPlayingSound(null);
            audioRef.current = null;
        };

        // Handle errors
        audio.onerror = () => {
            console.error('Error playing sound:', filePath);
            setPlayingSound(null);
            audioRef.current = null;
        };
    };

    // Stop playing sound
    const handleStopSound = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setPlayingSound(null);
    };

    // Get all categories (default + custom)
    const allCategories = [
        ...SOUND_CATEGORIES.map(cat => ({ id: cat, name: cat, icon: CATEGORY_ICONS[cat], isDefault: true })),
        ...customCategories.map(cat => ({ id: cat.id, name: cat.name, icon: '🎵', isDefault: false }))
    ];

    // Filter default sounds by category
    const filteredDefaultSounds = selectedCategory
        ? SOUND_LIBRARY.filter(s => s.category === selectedCategory)
        : SOUND_LIBRARY;

    // Filter custom sounds by category
    const filteredCustomSounds = selectedCategory
        ? customSounds.filter(s => s.category === selectedCategory)
        : customSounds;

    // Get total count for a category
    const getCategoryCount = (categoryName: string) => {
        const defaultCount = SOUND_LIBRARY.filter(s => s.category === categoryName).length;
        const customCount = customSounds.filter(s => s.category === categoryName).length;
        return defaultCount + customCount;
    };

    return (
        <div
            className="h-screen overflow-y-auto custom-scrollbar bg-gradient-to-b from-[#0a0510] via-[#13091f] to-[#1c0e2e] pb-24 pt-20"
            style={{
                background: 'linear-gradient(to bottom, #0a0510, #13091f, #1c0e2e)',
                backgroundColor: '#0a0510',
                width: '100%'
            }}
        >
            <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
                {/* Warning Banner */}
                {isBannerVisible && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 mb-6 md:mb-8 backdrop-blur-md relative group">
                        <button
                            onClick={() => setIsBannerVisible(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1"
                            title="Dismiss"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="flex items-start gap-4 pr-8">
                            <svg className="w-6 h-6 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h3 className="text-white font-semibold mb-1">Data Storage</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Custom sounds and categories are stored locally in your browser.
                                    Clearing your browser data will remove them.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6">
                    {/* Mobile Only: Vertical Stacked Categories ("List View") */}
                    <div className="lg:hidden space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white">Library</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsAddCategoryModalOpen(true)}
                                    className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all"
                                    title="Add Category"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setIsAddSoundModalOpen(true)}
                                    disabled={customCategories.length === 0}
                                    className="p-2 bg-gradient-to-r from-accent to-accent-hover text-navy-dark rounded-lg transition-all disabled:opacity-50"
                                    title="Upload Sound"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {allCategories.map((cat, index) => {
                            const catSounds = [
                                ...SOUND_LIBRARY.filter(s => s.category === cat.name),
                                ...customSounds.filter(s => s.category === cat.name)
                            ];

                            // Using selectedCategory as the "Expanded" state for mobile accordion
                            const isExpanded = selectedCategory === cat.name;

                            return (
                                <div key={`mobile-cat-${index}`} className="bg-white/5 border border-white/5 rounded-xl overflow-hidden">
                                    <div
                                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                                        onClick={() => setSelectedCategory(isExpanded ? null : cat.name)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{cat.icon}</span>
                                            <div>
                                                <h3 className="text-white font-medium text-lg">{cat.name}</h3>
                                                <p className="text-gray-500 text-xs">{catSounds.length} sounds</p>
                                            </div>
                                        </div>
                                        <button
                                            className={`p-2 rounded-full transition-all duration-300 ${isExpanded ? 'bg-accent text-navy-dark rotate-90' : 'bg-white/5 text-gray-400'}`}
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Sub-Navbar / Horizontal Scroll Area */}
                                    {isExpanded && (
                                        <div className="border-t border-white/5 bg-black/20 p-4 animate-in slide-in-from-top-2 duration-200">
                                            {catSounds.length === 0 ? (
                                                <p className="text-gray-500 text-sm text-center py-4">No sounds yet.</p>
                                            ) : (
                                                <div className="flex gap-4 overflow-x-auto pb-2 snap-x hide-scrollbar">
                                                    {catSounds.map(sound => (
                                                        <div
                                                            key={`mobile-sound-${sound.id}`}
                                                            className="flex-shrink-0 w-40 snap-start bg-white/5 rounded-xl p-3 border border-white/5"
                                                        >
                                                            <div className="flex justify-between items-start mb-2">
                                                                <span className="text-2xl">{sound.icon || '🎵'}</span>
                                                                {/* Delete button for custom sounds */}
                                                                {!sound.id.startsWith('default-') && (
                                                                    <button
                                                                        onClick={(e) => handleDeleteSound(sound.id, e)}
                                                                        className="text-gray-600 hover:text-red-400"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                        </svg>
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <h4 className="text-white font-medium text-sm truncate mb-3">{sound.name}</h4>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    playingSound === sound.id ? handleStopSound() : handlePlaySound(sound.filePath || '', sound.id);
                                                                }}
                                                                className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${playingSound === sound.id ? 'bg-accent text-navy-dark' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                                            >
                                                                {playingSound === sound.id ? 'Stop' : 'Play'}
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Desktop Sidebar - Categories */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="glass-effect p-4 md:p-6 rounded-xl border border-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg md:text-xl font-bold text-white">Categories</h2>
                                <button
                                    onClick={() => setIsAddCategoryModalOpen(true)}
                                    className="p-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/30 rounded-lg transition-all"
                                    title="Add Category"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex lg:block overflow-x-auto lg:overflow-visible gap-2 lg:gap-0 lg:space-y-2 pb-2 lg:pb-0 hide-scrollbar">
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className={`whitespace-nowrap px-4 py-2 rounded-lg transition-all text-sm md:text-base flex-shrink-0 w-auto lg:w-full lg:text-left ${selectedCategory === null
                                        ? 'bg-accent/20 text-accent border border-accent/20'
                                        : 'bg-white/5 lg:bg-transparent text-gray-400 hover:bg-white/10 lg:hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    All Sounds ({SOUND_LIBRARY.length + customSounds.length})
                                </button>
                                {allCategories.map((cat, index) => (
                                    <div key={`${cat.name}-${index}`} className="flex items-center gap-2 group flex-shrink-0">
                                        <button
                                            onClick={() => setSelectedCategory(cat.name)}
                                            className={`whitespace-nowrap flex-1 px-4 py-2 rounded-lg transition-all text-sm md:text-base w-auto lg:w-full text-left flex items-center ${selectedCategory === cat.name
                                                ? 'bg-accent/20 text-accent border border-accent/20'
                                                : 'bg-white/5 lg:bg-transparent text-gray-400 hover:bg-white/10 lg:hover:bg-white/5 hover:text-white'
                                                }`}
                                        >
                                            <span className="mr-2">{cat.icon}</span>
                                            {cat.name} ({getCategoryCount(cat.name)})
                                        </button>
                                        {!cat.isDefault && (
                                            <button
                                                onClick={(e) => handleDeleteCategory({ id: (cat as any).id, name: cat.name }, e)}
                                                className="hidden lg:block p-2 text-gray-500 hover:text-red-400 transition-all"
                                                title="Delete Category"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Area - Sounds (Desktop Only) */}
                    <div className="hidden lg:block lg:col-span-3">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-200 via-white to-purple-200 bg-clip-text text-transparent">
                                {selectedCategory || 'All Sounds'}
                            </h2>
                            <button
                                onClick={() => setIsAddSoundModalOpen(true)}
                                disabled={customCategories.length === 0}
                                className="px-4 py-2 bg-gradient-to-r from-accent to-accent-hover text-navy-dark rounded-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-accent/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Upload Sound
                            </button>
                        </div>

                        {filteredDefaultSounds.length === 0 && filteredCustomSounds.length === 0 ? (
                            <div className="glass-effect p-12 rounded-2xl text-center border-2 border-dashed border-white/10 bg-white/5">
                                <div className="text-6xl mb-4 opacity-50">🎵</div>
                                <p className="text-gray-300 text-lg">No sounds in this category</p>
                                <p className="text-gray-500 text-sm mt-2">
                                    {customCategories.length === 0
                                        ? 'Create a category first, then upload sounds'
                                        : 'Click "Upload Sound" to add your first sound'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Default Sounds Section */}
                                {filteredDefaultSounds.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-400 mb-3 flex items-center gap-2">
                                            <span>🎵</span>
                                            Default Sounds
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {filteredDefaultSounds.map(sound => (
                                                <div key={sound.id} className="glass-effect p-4 rounded-xl hover:bg-white/10 transition-all border border-white/5 group">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xl group-hover:scale-110 transition-transform">{sound.icon}</span>
                                                                <h3 className="text-white font-medium group-hover:text-accent transition-colors">{sound.name}</h3>
                                                            </div>
                                                            <p className="text-gray-500 text-sm ml-7">{sound.category}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => playingSound === sound.id ? handleStopSound() : handlePlaySound(sound.filePath, sound.id)}
                                                            className={`p-2.5 rounded-lg transition-all ${playingSound === sound.id
                                                                ? 'bg-accent text-navy-dark shadow-[0_0_15px_rgba(63,209,200,0.4)]'
                                                                : 'bg-white/5 text-gray-400 hover:bg-accent hover:text-navy-dark'
                                                                }`}
                                                            title={playingSound === sound.id ? 'Stop' : 'Play'}
                                                        >
                                                            {playingSound === sound.id ? (
                                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M8 5v14l11-7z" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Custom Sounds Section */}
                                {filteredCustomSounds.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-400 mb-3 flex items-center gap-2">
                                            <span>✨</span>
                                            Your Custom Sounds
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {filteredCustomSounds.map(sound => (
                                                <div key={sound.id} className="glass-effect p-4 rounded-xl hover:bg-white/10 transition-all border border-white/5 group">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <h3 className="text-white font-medium group-hover:text-accent transition-colors">{sound.name}</h3>
                                                            <p className="text-gray-500 text-sm">{sound.category}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => playingSound === sound.id ? handleStopSound() : handlePlaySound(sound.filePath || '', sound.id)}
                                                                className={`p-2.5 rounded-lg transition-all ${playingSound === sound.id
                                                                    ? 'bg-accent text-navy-dark shadow-[0_0_15px_rgba(63,209,200,0.4)]'
                                                                    : 'bg-white/5 text-gray-400 hover:bg-accent hover:text-navy-dark'
                                                                    }`}
                                                                title={playingSound === sound.id ? 'Stop' : 'Play'}
                                                            >
                                                                {playingSound === sound.id ? (
                                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                                        <path d="M8 5v14l11-7z" />
                                                                    </svg>
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={(e) => handleDeleteSound(sound.id, e)}
                                                                className="p-2.5 text-gray-500 hover:text-red-400 bg-transparent hover:bg-white/5 rounded-lg transition-all"
                                                                title="Delete Sound"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Category Modal */}
            {isAddCategoryModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="glass-effect p-6 rounded-2xl max-w-md w-full">
                        <h3 className="text-2xl font-bold text-white mb-4">Add Category</h3>
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Category name"
                            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 mb-4"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsAddCategoryModalOpen(false)}
                                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddCategory}
                                disabled={!newCategoryName.trim()}
                                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Sound Modal */}
            {isAddSoundModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="glass-effect p-6 rounded-2xl max-w-md w-full">
                        <h3 className="text-2xl font-bold text-white mb-4">Upload Sound</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Sound Name</label>
                                <input
                                    type="text"
                                    value={newSoundName}
                                    onChange={(e) => setNewSoundName(e.target.value)}
                                    placeholder="Enter sound name"
                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="category-select" className="block text-sm text-gray-400 mb-2">Category</label>
                                <select
                                    id="category-select"
                                    value={selectedCategory || ''}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 appearance-none"
                                >
                                    <option value="" className="bg-[#0a0510]">Select category</option>
                                    {customCategories.map(cat => (
                                        <option key={cat.id} value={cat.name} className="bg-[#0a0510]">{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="audio-file-input" className="block text-sm text-gray-400 mb-2">Audio File</label>
                                <input
                                    id="audio-file-input"
                                    type="file"
                                    accept="audio/*"
                                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white file:cursor-pointer hover:file:bg-purple-700"
                                />
                                <div className="mt-2 text-xs text-gray-400">
                                    Need high-quality sounds? Try <a href="https://pixabay.com/sound-effects/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Pixabay.com</a> (Free & Royalty-free)
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setIsAddSoundModalOpen(false);
                                    setNewSoundName('');
                                    setSelectedFile(null);
                                }}
                                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddSound}
                                disabled={!newSoundName.trim() || !selectedFile || !selectedCategory}
                                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ConfirmationModal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={handleConfirmDelete}
                title={deleteConfirm?.type === 'category' ? 'Delete Category' : 'Delete Sound'}
                message={deleteConfirm?.type === 'category'
                    ? `Are you sure you want to delete category "${deleteConfirm.name}"? This will delete all sounds in this category.`
                    : "Are you sure you want to delete this sound?"
                }
                confirmText="Delete"
                isDanger={true}
            />
        </div>
    );
};

export default SoundLibrary;
