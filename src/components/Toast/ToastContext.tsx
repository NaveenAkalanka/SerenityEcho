import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, Info, WarningCircle, XCircle } from '@phosphor-icons/react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {createPortal(
                <div className="fixed bottom-6 right-6 z-[1000] flex flex-col gap-3 pointer-events-none">
                    {toasts.map(toast => (
                        <div
                            key={toast.id}
                            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-md animate-in slide-in-from-right-10 fade-in duration-300 min-w-[300px] border border-white/10"
                            style={{
                                backgroundColor: toast.type === 'success' ? 'rgba(6, 78, 59, 0.9)' :
                                    toast.type === 'error' ? 'rgba(127, 29, 29, 0.9)' :
                                        toast.type === 'warning' ? 'rgba(120, 53, 15, 0.9)' :
                                            'rgba(30, 41, 59, 0.9)'
                            }}
                        >
                            <div className="flex-shrink-0 text-white">
                                {toast.type === 'success' && <CheckCircle size={24} weight="fill" className="text-green-400" />}
                                {toast.type === 'error' && <XCircle size={24} weight="fill" className="text-red-400" />}
                                {toast.type === 'warning' && <WarningCircle size={24} weight="fill" className="text-amber-400" />}
                                {toast.type === 'info' && <Info size={24} weight="fill" className="text-blue-400" />}
                            </div>
                            <p className="flex-1 text-sm font-medium text-white">{toast.message}</p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="text-white/60 hover:text-white transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    );
};
