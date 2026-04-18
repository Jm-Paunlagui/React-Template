/**
 * Tabs — Tabbed content navigation.
 *
 * Props:
 *   tabs     — [{ id, label, icon?, badge?, disabled?, content: ReactNode }]
 *   defaultTab — id
 *   variant  — 'underline'|'pill'|'boxed'|'vertical'
 *   size     — 'sm'|'md'|'lg'
 *   fullWidth — boolean
 */
import { useState } from "react";
const { TRANSITION_SMOOTH } = require("../../assets/styles/pre-set-styles");

const SZ = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-base",
};

export function Tabs({ tabs = [], defaultTab, variant = "underline", size = "md", fullWidth = false }) {
    const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);
    const activeTab = tabs.find((t) => t.id === active);
    const sz = SZ[size] ?? SZ.md;

    const NAV_STYLES = {
        underline: "border-b border-grey-200 dark:border-grey-700 flex gap-1",
        pill: "flex gap-1 p-1 bg-grey-100 dark:bg-grey-800 rounded-xl w-fit",
        boxed: "flex gap-0 border border-grey-200 dark:border-grey-700 rounded-xl overflow-hidden w-fit",
        vertical: "flex flex-col gap-1 border-r border-grey-200 dark:border-grey-700 pr-2",
    };

    const TAB_STYLES = {
        underline: (a) => `border-b-2 ${TRANSITION_SMOOTH} font-aumovio-bold
            ${a ? "border-orange-400 text-orange-400" : "border-transparent text-grey-500 hover:text-orange-400 hover:border-orange-200"}`,
        pill: (a) => `rounded-lg ${TRANSITION_SMOOTH} font-aumovio-bold
            ${a ? "bg-white dark:bg-[#1a1030] text-orange-400 shadow-sm" : "text-grey-500 hover:text-orange-400"}`,
        boxed: (a) => `border-r last:border-0 border-grey-200 dark:border-grey-700 font-aumovio-bold
            ${TRANSITION_SMOOTH}
            ${a ? "bg-orange-400 text-white" : "bg-white dark:bg-[#1a1030] text-grey-500 hover:bg-orange-50 dark:hover:bg-orange-400/10 hover:text-orange-400"}`,
        vertical: (a) => `rounded-lg text-left ${TRANSITION_SMOOTH} font-aumovio-bold
            ${a ? "bg-orange-50 dark:bg-orange-400/10 text-orange-400" : "text-grey-500 hover:bg-grey-100 dark:hover:bg-grey-800 hover:text-orange-400"}`,
    };

    return (
        <div className={`font-aumovio ${variant === "vertical" ? "flex gap-6" : ""}`}>
            <div className={NAV_STYLES[variant]}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => !tab.disabled && setActive(tab.id)}
                        disabled={tab.disabled}
                        className={`flex items-center gap-1.5 whitespace-nowrap
              disabled:opacity-40 disabled:cursor-not-allowed
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40 rounded
              ${sz} ${fullWidth ? "flex-1 justify-center" : ""}
              ${(TAB_STYLES[variant] ?? TAB_STYLES.underline)(tab.id === active)}`}
                    >
                        {tab.icon && <tab.icon className="w-4 h-4 shrink-0" />}
                        {tab.label}
                        {tab.badge !== undefined && (
                            <span
                                className={`text-[10px] px-1.5 py-0.5 rounded-full font-aumovio-bold
                ${tab.id === active ? "bg-white/20 text-white" : "bg-orange-400/10 text-orange-400"}`}
                            >
                                {tab.badge}
                            </span>
                        )}
                    </button>
                ))}
            </div>
            <div className={`${variant !== "vertical" ? "mt-4" : "flex-1"}`}>{activeTab?.content}</div>
        </div>
    );
}

export default Tabs;
