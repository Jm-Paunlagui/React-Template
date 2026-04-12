/**
 * Badge — Status pill / label.
 *
 * Props:
 *   variant  — 'green'|'red'|'warning'|'blue'|'purple'|'cyan'|'amber'|'grey'|'orange'
 *   size     — 'xs'|'sm'|'md'
 *   dot      — boolean (animated pulse dot)
 *   outline  — boolean (border-only style)
 *   removable — boolean (× button)
 *   onRemove — () => void
 *   pill     — boolean (rounded-full instead of rounded-lg)
 *   children
 */
const V = {
    green: {
        solid: "text-success-400 bg-success-100/60 border-success-400/30",
        outline: "text-success-500 border-success-400 bg-transparent",
        dot: "bg-success-400",
    },
    red: {
        solid: "text-danger-400  bg-danger-100      border-danger-400/30",
        outline: "text-danger-500  border-danger-400  bg-transparent",
        dot: "bg-danger-400",
    },
    warning: {
        solid: "text-warn-600    bg-warn-100/30     border-warn-400/30",
        outline: "text-warn-600    border-warn-400    bg-transparent",
        dot: "bg-warn-400",
    },
    blue: {
        solid: "text-blue-500    bg-blue-100/30     border-blue-400/30",
        outline: "text-blue-500    border-blue-400    bg-transparent",
        dot: "bg-blue-400",
    },
    purple: {
        solid: "text-purple-400  bg-purple-100/25   border-purple-400/35",
        outline: "text-purple-500  border-purple-400  bg-transparent",
        dot: "bg-purple-400",
    },
    cyan: {
        solid: "text-turquoise-500 bg-turquoise-100/22 border-turquoise-400/25",
        outline: "text-turquoise-500 border-turquoise-400 bg-transparent",
        dot: "bg-turquoise-400",
    },
    amber: {
        solid: "text-yellow-600  bg-yellow-100      border-yellow-400/30",
        outline: "text-yellow-600  border-yellow-400  bg-transparent",
        dot: "bg-yellow-400",
    },
    grey: {
        solid: "text-grey-500 dark:text-grey-400 bg-grey-100 dark:bg-grey-800 border-grey-400/30 dark:border-grey-600/30",
        outline: "text-grey-500 dark:text-grey-400 border-grey-400 dark:border-grey-600 bg-transparent",
        dot: "bg-grey-400",
    },
    orange: {
        solid: "text-orange-500  bg-orange-100/20   border-orange-400/30",
        outline: "text-orange-500  border-orange-400  bg-transparent",
        dot: "bg-orange-400",
    },
};

const SZ = {
    xs: "px-1.5 py-0.5 text-xs gap-1",
    sm: "px-2   py-0.5 text-xs gap-1",
    md: "px-2.5 py-1   text-xs gap-1.5",
};

export function Badge({ variant = "grey", size = "md", dot = false, outline = false, removable = false, onRemove, pill = false, children }) {
    const cfg = V[variant] ?? V.grey;
    const style = outline ? cfg.outline : cfg.solid;

    return (
        <span
            className={`inline-flex items-center font-aumovio-bold tracking-wide
      border shadow-sm ${pill ? "rounded-full" : "rounded-lg"}
      ${style} ${SZ[size] ?? SZ.md}`}
        >
            {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 animate-pulse ${cfg.dot}`} />}
            {children}
            {removable && (
                <button onClick={onRemove} aria-label="Remove" className="ml-0.5 hover:opacity-70">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M8 2L2 8M2 2l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
            )}
        </span>
    );
}

export default Badge;
