/**
 * Tooltip — Hover label attached to any element.
 *
 * Props:
 *   children  — trigger element
 *   content   — string | ReactNode
 *   placement — 'top'|'bottom'|'left'|'right'
 *   delay     — ms (default 300)
 *   size      — 'sm'|'md'
 *   disabled  — boolean
 */

import { useRef, useState } from "react";
import { ANIMATE_FADE_IN } from "../../assets/styles/pre-set-styles";

const PL = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full  left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full  top-1/2 -translate-y-1/2 ml-2",
};

export function Tooltip({ children, content, placement = "top", delay = 300, size = "sm", disabled = false }) {
    const [visible, setVisible] = useState(false);
    const timer = useRef(null);

    const show = () => {
        if (disabled) return;
        timer.current = setTimeout(() => setVisible(true), delay);
    };
    const hide = () => {
        clearTimeout(timer.current);
        setVisible(false);
    };

    return (
        <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
            {children}
            {visible && content && (
                <div
                    className={`absolute z-50 pointer-events-none ${ANIMATE_FADE_IN} whitespace-nowrap
          ${PL[placement] ?? PL.top}
          ${size === "sm" ? "px-2.5 py-1 text-xs rounded-lg" : "px-3 py-1.5 text-sm rounded-xl"}
          bg-grey-900 dark:bg-grey-700 text-white font-aumovio shadow-xl`}
                >
                    {content}
                </div>
            )}
        </div>
    );
}

export default Tooltip;
