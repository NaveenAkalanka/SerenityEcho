import React, { useState } from 'react';
import { FloppyDisk, Trash, CaretDown, CaretUp, Check } from '@phosphor-icons/react';
import type { Preset } from '../../types/Preset';

interface PresetManagerProps {
    presets: Preset[];
    onLoadPreset: (preset: Preset) => void;
    onDeletePreset: (id: string) => void;
}

const PresetManager: React.FC<PresetManagerProps> = ({
    presets,
    onLoadPreset,
    onDeletePreset,
}) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="glass-effect p-6 rounded-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">Saved Presets</h3>

            {presets.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-4xl mb-3 flex justify-center">
                        <FloppyDisk size={48} weight="duotone" className="text-white/20" />
                    </div>
                    <p className="text-gray-400">No saved presets yet</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Create a mix and save it to see it here
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {presets.map((preset) => (
                        <div
                            key={preset.id}
                            className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-accent/40 transition-all backdrop-blur-sm"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-white mb-1">{preset.name}</h4>
                                    <p className="text-xs text-gray-400">{formatDate(preset.createdAt)}</p>

                                    {expandedId === preset.id && (
                                        <div className="mt-3 pt-3 border-t border-accent/20">
                                            <p className="text-xs text-gray-400 mb-2">
                                                {preset.layers.length} layer{preset.layers.length !== 1 ? 's' : ''}
                                            </p>
                                            <div className="space-y-1">
                                                {preset.layers.map((layer) => (
                                                    <div key={layer.id} className="text-xs text-gray-500">
                                                        • {layer.name} ({layer.volume}%)
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2 ml-4">
                                    <button
                                        onClick={() => setExpandedId(expandedId === preset.id ? null : preset.id)}
                                        className="text-gray-400 hover:text-accent transition-colors text-sm cursor-pointer p-1"
                                        title="View details"
                                    >
                                        {expandedId === preset.id ? <CaretUp size={16} weight="bold" /> : <CaretDown size={16} weight="bold" />}
                                    </button>
                                    <button
                                        onClick={() => onLoadPreset(preset)}
                                        className="px-3 py-1 bg-accent hover:bg-accent-hover text-navy-dark text-sm font-semibold rounded transition-all cursor-pointer flex items-center gap-1"
                                    >
                                        <Check size={14} weight="bold" />
                                        <span>Load</span>
                                    </button>
                                    <button
                                        onClick={() => onDeletePreset(preset.id)}
                                        className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer p-1"
                                        title="Delete preset"
                                    >
                                        <Trash size={18} weight="bold" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PresetManager;
