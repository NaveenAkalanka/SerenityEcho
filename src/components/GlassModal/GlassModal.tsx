import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from '@phosphor-icons/react';

interface GlassModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
}

const GlassModal: React.FC<GlassModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    className = ''
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300); // Wait for fade out
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    return createPortal(
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 backdrop-blur-none pointer-events-none'}`}>
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className={`relative bg-[#0a0510]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'} ${className}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5 cursor-pointer"
                    >
                        <X size={20} weight="bold" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default GlassModal;
