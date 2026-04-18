/**
 * Alert — Feedback message with optional dismiss and actions.
 *
 * Props:
 *   variant   — 'info' | 'success' | 'warning' | 'danger'
 *   title     — string (optional bold heading)
 *   children  — message content
 *   icon      — custom icon component (defaults to variant icon)
 *   dismissible — boolean
 *   onDismiss — () => void
 *   actions   — [{ label, onClick }]
 *   bordered  — boolean
 *   size      — 'sm' | 'md'
 */

import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { TRANSITION_COLORS } from "../../assets/styles/pre-set-styles";

const CONFIG = {
    info: {
        bg: "bg-purple-100/20 dark:bg-purple-400/10",
        border: "border-purple-400/30",
        text: "text-purple-500 dark:text-purple-300",
        icon: InformationCircleIcon,
    },
    success: {
        bg: "bg-success-100/40 dark:bg-success-400/10",
        border: "border-success-400/30",
        text: "text-success-500 dark:text-success-300",
        icon: CheckCircleIcon,
    },
    warning: {
        bg: "bg-warn-100/30 dark:bg-warn-400/10",
        border: "border-warn-400/30",
        text: "text-warn-500 dark:text-yellow-300",
        icon: ExclamationTriangleIcon,
    },
    danger: {
        bg: "bg-danger-100/40 dark:bg-danger-400/10",
        border: "border-danger-400/30",
        text: "text-danger-500 dark:text-danger-300",
        icon: XCircleIcon,
    },
};

export function Alert({ variant = "info", title, children, icon: CustomIcon, dismissible = false, onDismiss, actions = [], bordered = true, size = "md" }) {
    const [visible, setVisible] = useState(true);
    const cfg = CONFIG[variant] ?? CONFIG.info;
    const Icon = CustomIcon ?? cfg.icon;

    const dismiss = () => {
        setVisible(false);
        onDismiss?.();
    };

    if (!visible) return null;

    const { ANIMATE_FADE_IN } = require("../../assets/styles/pre-set-styles");
    return (
        <div
            role="alert"
            className={`
      flex gap-3 rounded-xl font-aumovio ${ANIMATE_FADE_IN}
      ${size === "sm" ? "p-3 text-xs" : "p-4 text-sm"}
      ${cfg.bg} ${bordered ? `border ${cfg.border}` : ""}
    `}
        >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${cfg.text}`} />
            <div className="flex-1 min-w-0">
                {title && <p className={`font-aumovio-bold mb-0.5 ${cfg.text}`}>{title}</p>}
                <div className={`text-black/75 dark:text-white/70 leading-relaxed`}>{children}</div>
                {actions.length > 0 && (
                    <div className="flex gap-2 mt-3">
                        {actions.map((a, i) => (
                            <button key={i} onClick={a.onClick} className={`text-xs font-aumovio-bold ${cfg.text} hover:underline`}>
                                {a.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {dismissible && (
                <button onClick={dismiss} aria-label="Dismiss" className={`${TRANSITION_COLORS} shrink-0 text-grey-400 hover:text-grey-600 dark:hover:text-grey-300`}>
                    <XMarkIcon className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}

export default Alert;
