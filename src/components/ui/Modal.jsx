/**
 * Modal — Accessible dialog overlay.
 *
 * Props:
 *   open     — boolean
 *   onClose  — () => void
 *   title    — string
 *   size     — 'sm'|'md'|'lg'|'xl'|'2xl'|'full'
 *   variant  — 'default'|'danger'|'success'
 *   footer   — ReactNode
 *   children
 */
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";

const SIZES = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    "2xl": "max-w-4xl",
    full: "max-w-full min-h-screen rounded-none",
};

const VARIANTS = {
    default: "",
    danger: "border-t-4 border-danger-400",
    success: "border-t-4 border-success-400",
};

export function Modal({
    open,
    onClose,
    title,
    size = "md",
    variant = "default",
    footer,
    children,
}) {
    useEffect(() => {
        if (!open) return;
        const h = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        document.addEventListener("keydown", h);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", h);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
        >
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />
            <div
                className={`relative w-full ${SIZES[size] ?? SIZES.md}
        bg-white dark:bg-[#1a1030] rounded-2xl shadow-2xl
        animate-scale-in overflow-hidden font-aumovio ${VARIANTS[variant]}`}
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-grey-200 dark:border-grey-700">
                        <h2 className="text-base font-aumovio-bold text-black/85 dark:text-white/90">
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            aria-label="Close"
                            className="flex items-center justify-center transition-colors rounded-lg w-7 h-7 text-grey-400 hover:text-grey-600 dark:hover:text-grey-300 hover:bg-grey-100 dark:hover:bg-grey-800"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>
                )}
                {/* Body */}
                <div className="px-6 py-5 overflow-y-auto max-h-[70vh]">
                    {children}
                </div>
                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-grey-200 dark:border-grey-700 bg-grey-50 dark:bg-white/5">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Modal;
