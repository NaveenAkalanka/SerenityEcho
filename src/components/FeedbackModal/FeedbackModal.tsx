import React, { useState } from 'react';
import { X, PaperPlaneRight, CheckCircle, WarningCircle } from '@phosphor-icons/react';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
    const [result, setResult] = useState("");
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

    if (!isOpen) return null;

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus("submitting");
        setResult("Sending...");

        const formData = new FormData(event.currentTarget);
        formData.append("access_key", "d1425489-0971-4911-af81-f23957d3df42");
        formData.append("subject", "SerenityEcho Feedback");

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                setStatus("success");
                setResult("Feedback sent successfully!");
                // Clear form? Or just show success state
                setTimeout(() => {
                    onClose();
                    setStatus("idle");
                    setResult("");
                }, 3000);
            } else {
                setStatus("error");
                setResult(data.message || "Something went wrong.");
            }
        } catch (error) {
            setStatus("error");
            setResult("Failed to send feedback. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="bg-navy-card/90 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-md relative animate-fade-in-up">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                    <X size={24} />
                </button>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-white mb-2">Send Feedback</h2>
                    <p className="text-purple-100/70 text-sm">
                        Found a bug? Have a suggestion? We'd love to hear from you!
                    </p>
                </div>

                {status === "success" ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-4">
                            <CheckCircle size={32} weight="fill" />
                        </div>
                        <h3 className="text-xl text-white font-medium mb-2">Thank You!</h3>
                        <p className="text-purple-200">Your feedback has been received.</p>
                    </div>
                ) : (
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm text-purple-200/80 mb-1.5 ml-1">Name (Optional)</label>
                            <input
                                type="text"
                                name="name"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all"
                                placeholder="Your Name"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm text-purple-200/80 mb-1.5 ml-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm text-purple-200/80 mb-1.5 ml-1">Message</label>
                            <textarea
                                name="message"
                                required
                                rows={4}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all resize-none"
                                placeholder="Tell us what's on your mind..."
                            ></textarea>
                        </div>

                        {status === "error" && (
                            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">
                                <WarningCircle size={20} />
                                {result}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status === "submitting"}
                            className="w-full py-3 bg-gradient-to-r from-accent to-accent-hover text-navy-dark font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
                        >
                            {status === "submitting" ? (
                                <>Sending...</>
                            ) : (
                                <>
                                    <PaperPlaneRight size={20} weight="bold" />
                                    Send Feedback
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default FeedbackModal;
