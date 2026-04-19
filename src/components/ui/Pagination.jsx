/**
 * Pagination — Page navigation controls.
 *
 * Props:
 *   page       — current page (1-indexed)
 *   totalPages — total number of pages
 *   onChange   — (page: number) => void
 *   siblingCount — pages shown on each side of current (default 1)
 *   showEnds   — boolean (first/last page buttons)
 *   size       — 'sm'|'md'|'lg'
 *   variant    — 'default'|'minimal'|'rounded'
 */

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { TRANSITION_COLORS } from "../../assets/styles/pre-set-styles";

function buildRange(start, end) {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function getPages(current, total, sibling = 1) {
    const range = sibling + 5;
    if (total <= range) return buildRange(1, total);
    const left = Math.max(current - sibling, 1);
    const right = Math.min(current + sibling, total);
    const showLeft = left > 2;
    const showRight = right < total - 1;
    const pages = [];
    pages.push(1);
    if (showLeft) pages.push("...");
    pages.push(...buildRange(left, right));
    if (showRight) pages.push("...");
    pages.push(total);
    return [...new Set(pages)];
}

const SZ = {
    sm: "w-7 h-7 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
};

export function Pagination({ page, totalPages, onChange, siblingCount = 1, showEnds = true, size = "md", variant = "default" }) {
    if (totalPages <= 1) return null;
    const pages = getPages(page, totalPages, siblingCount);
    const sz = SZ[size] ?? SZ.md;
    const radius = variant === "rounded" ? "rounded-full" : "rounded-lg";

    const btn = (label, targetPage, disabled, icon) => (
        <button
            key={typeof label === "string" ? label : undefined}
            onClick={() => !disabled && onChange?.(targetPage)}
            disabled={disabled}
            aria-label={typeof label === "string" ? label : undefined}
            aria-current={label === page ? "page" : undefined}
            className={`flex items-center justify-center font-aumovio-bold shrink-0
        border ${TRANSITION_COLORS} ${sz} ${radius}
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
        ${label === page ? "bg-orange-400 text-white border-orange-400 shadow-lg shadow-orange-400/30" : label === "..." ? "bg-transparent border-transparent text-grey-400 cursor-default hover:bg-transparent" : "bg-white dark:bg-[#1a1030] border-grey-200 dark:border-grey-700 text-black/70 dark:text-white/70 hover:border-orange-400 hover:text-orange-400 dark:hover:border-orange-400"}`}
        >
            {icon ?? label}
        </button>
    );

    return (
        <nav aria-label="Pagination" className="flex flex-wrap items-center gap-1 font-aumovio">
            {btn("Prev", page - 1, page <= 1, <ChevronLeftIcon className="w-4 h-4" />)}
            {!showEnds ? null : pages.map((p, i) => btn(p, typeof p === "number" ? p : page, p === "...", null))}
            {btn("Next", page + 1, page >= totalPages, <ChevronRightIcon className="w-4 h-4" />)}
        </nav>
    );
}

export default Pagination;
