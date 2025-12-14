import React, { useState, useEffect } from 'react';
import { FloppyDisk } from '@phosphor-icons/react';
import GlassModal from '../GlassModal/GlassModal';

interface SavePresetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
}

const SavePresetModal: React.FC<SavePresetModalProps> = ({
    isOpen,
    onClose,
    onSave,
}) => {
    const [name, setName] = useState('');

    // Reset name when modal opens
    useEffect(() => {
        if (isOpen) setName('');
    }, [isOpen]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (name.trim()) {
            onSave(name.trim());
            onClose();
        }
    };

    return (
        <GlassModal
            isOpen={isOpen}
            onClose={onClose}
            title="Save Preset"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Preset Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="My Awesome Mix"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all font-medium"
                        autoFocus
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-medium rounded-xl transition-all cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!name.trim()}
                        className="flex-1 px-4 py-3 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-navy-dark font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <FloppyDisk size={20} weight="fill" />
                        Save Preset
                    </button>
                </div>
            </form>
        </GlassModal>
    );
};

export default SavePresetModal;
