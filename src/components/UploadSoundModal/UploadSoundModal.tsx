import React, { useState, useRef } from 'react';
import { UploadSimple, FileAudio } from '@phosphor-icons/react';
import GlassModal from '../GlassModal/GlassModal';

interface UploadSoundModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File, category: string, name: string) => void;
    categories: { id: string; name: string }[];
}

const UploadSoundModal: React.FC<UploadSoundModalProps> = ({
    isOpen,
    onClose,
    onUpload,
    categories,
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [soundName, setSoundName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (file: File) => {
        if (file.type.startsWith('audio/')) {
            setSelectedFile(file);
            setSoundName(file.name.replace(/\.[^/.]+$/, ''));
        } else {
            alert('Please select an audio file');
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleSubmit = () => {
        if (selectedFile && soundName.trim() && selectedCategory) {
            onUpload(selectedFile, selectedCategory, soundName.trim());
            setSelectedFile(null);
            setSoundName('');
            setSelectedCategory('');
            onClose();
        }
    };

    return (
        <GlassModal
            isOpen={isOpen}
            onClose={onClose}
            title="Upload Custom Sound"
        >
            {/* Drag and Drop Area */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 group ${isDragging
                    ? 'border-accent bg-accent/10'
                    : 'border-white/10 hover:border-accent/50 hover:bg-white/5'
                    }`}
            >
                <div className={`text-4xl mb-3 transition-transform duration-300 ${isDragging ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {selectedFile ? <FileAudio className="mx-auto text-accent" /> : <UploadSimple className="mx-auto text-gray-400 group-hover:text-accent" />}
                </div>
                <p className="text-white font-medium mb-2">
                    {selectedFile ? selectedFile.name : 'Drop audio file here'}
                </p>
                <p className="text-gray-400 text-sm">
                    {selectedFile ? 'Click to change' : 'or click to browse'}
                </p>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
            />

            {/* Sound Name Input */}
            {selectedFile && (
                <div className="mt-6 space-y-4 animate-in slide-in-from-top-4 fade-in duration-300">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Sound Name</label>
                        <input
                            type="text"
                            value={soundName}
                            onChange={(e) => setSoundName(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all font-medium"
                            placeholder="Enter sound name"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Assign to Category</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all font-medium appearance-none cursor-pointer"
                        >
                            <option value="" className="bg-navy-dark text-gray-500">Select a category...</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.name} className="bg-navy-dark text-white">
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8">
                <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-medium rounded-xl transition-all cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!selectedFile || !soundName.trim() || !selectedCategory}
                    className="flex-1 px-4 py-3 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-navy-dark font-bold rounded-xl transition-all cursor-pointer"
                >
                    Add Sound
                </button>
            </div>
        </GlassModal>
    );
};

export default UploadSoundModal;
