import React from 'react';
import GlassModal from '../GlassModal/GlassModal';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDanger = false
}) => {
    return (
        <GlassModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
        >
            <div className="space-y-6">
                <p className="text-gray-300 leading-relaxed">
                    {message}
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-medium rounded-xl transition-all cursor-pointer"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 px-4 py-3 font-bold rounded-xl transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 ${isDanger
                                ? 'bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 hover:border-white/20 shadow-none'
                                : 'bg-accent hover:bg-accent-hover text-navy-dark shadow-accent/20'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </GlassModal>
    );
};

export default ConfirmationModal;
