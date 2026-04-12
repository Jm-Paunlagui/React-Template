/**
 * Breadcrumb — Page hierarchy navigation.
 *
 * Props:
 *   items     — [{ label, href?, icon? }]  (last item = current, no link)
 *   separator — 'slash' | 'chevron' | 'dot'
 *   size      — 'sm' | 'md'
 *   homeIcon  — boolean (show home icon on first item)
 */
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";

const SEPARATORS = {
    slash: <span className="select-none text-grey-400">/</span>,
    chevron: <ChevronRightIcon className="w-3.5 h-3.5 text-grey-400 shrink-0" />,
    dot: <span className="w-1 h-1 rounded-full bg-grey-400 shrink-0" />,
};

export function Breadcrumb({ items = [], separator = "chevron", size = "md", homeIcon = true }) {
    const textSz = size === "sm" ? "text-xs" : "text-sm";

    return (
        <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 flex-wrap font-aumovio ${textSz}`}>
            {items.map((item, i) => {
                const isLast = i === items.length - 1;
                return (
                    <div key={i} className="flex items-center gap-1.5">
                        {i > 0 && (SEPARATORS[separator] ?? SEPARATORS.chevron)}
                        {isLast ? (
                            <span className="flex items-center gap-1 text-orange-400 font-aumovio-bold" aria-current="page">
                                {item.icon && <item.icon className="w-3.5 h-3.5" />}
                                {item.label}
                            </span>
                        ) : (
                            <NavLink to={item.href ?? "#"} className="flex items-center gap-1 transition-colors duration-200 text-grey-500 dark:text-grey-400 hover:text-orange-400">
                                {i === 0 && homeIcon ? <HomeIcon className="w-3.5 h-3.5" /> : item.icon && <item.icon className="w-3.5 h-3.5" />}
                                {item.label}
                            </NavLink>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}

export default Breadcrumb;
