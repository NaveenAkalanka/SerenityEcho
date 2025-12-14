import React from 'react';
import { Play, Pause, MusicNotesPlus, FloppyDisk } from '@phosphor-icons/react';
import VolumeSlider from '../VolumeSlider';

interface MasterControlsProps {
    masterVolume: number;
    onMasterVolumeChange: (volume: number) => void;
    onPlayAll: () => void;
    onPauseAll: () => void;
    onAddCustomSound: () => void;
    onSavePreset: () => void;
}

const MasterControls: React.FC<MasterControlsProps> = ({
    masterVolume,
    onMasterVolumeChange,
    onPlayAll,
    onPauseAll,
    onAddCustomSound,
    onSavePreset,
}) => {
    return (
        <div className="glass-effect p-6 rounded-2xl space-y-6">
            <h3 className="text-2xl font-bold text-white mb-4">Master Controls</h3>

            {/* Master Volume */}
            <div>
                <VolumeSlider
                    value={masterVolume}
                    onChange={onMasterVolumeChange}
                    label="Master Volume"
                />
            </div>

            {/* Control Buttons */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={onPlayAll}
                    className="px-4 py-3 bg-accent/80 hover:bg-accent text-navy-dark font-semibold rounded-lg transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                    <Play size={20} weight="fill" />
                    <span>Play All</span>
                </button>
                <button
                    onClick={onPauseAll}
                    className="px-4 py-3 bg-white/5 hover:bg-white/10 text-accent border border-accent/30 rounded-lg transition-all backdrop-blur-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                    <Pause size={20} weight="fill" />
                    <span>Pause All</span>
                </button>
            </div>

            {/* Additional Actions */}
            <div className="space-y-3 pt-4 border-t border-white/10">
                <button
                    onClick={onAddCustomSound}
                    className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-accent/50 rounded-lg transition-all flex items-center justify-center space-x-2 backdrop-blur-sm cursor-pointer"
                >
                    <MusicNotesPlus size={20} weight="bold" />
                    <span>Add Custom Sound</span>
                </button>

                <button
                    onClick={onSavePreset}
                    className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-accent/50 rounded-lg transition-all flex items-center justify-center space-x-2 backdrop-blur-sm cursor-pointer"
                >
                    <FloppyDisk size={20} weight="bold" />
                    <span>Save Preset</span>
                </button>
            </div>
        </div>
    );
};

export default MasterControls;
