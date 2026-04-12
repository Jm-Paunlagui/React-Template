/**
 * Sidebar.jsx
 * ───────────
 * Collapsible left sidebar navigation.
 * Rendered by App.jsx when layout === "sidebar".
 *
 * CUSTOMISATION GUIDE
 * ───────────────────
 * This component receives its navigation data as props:
 *   navLinks      — flat link array   [{name, href, icon?}]
 *   dropdownGroups — grouped links    [{label, items: [{name, href, description?}]}]
 *   profileLinks  — user actions      [{name, href, onClick?}]
 *
 * It only renders structure — link contents are defined in the parent (App.jsx or Navbar.jsx).
 */

import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useCallback, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { MAIN_COLOR_TEXT, MAIN_FOREGROUND_COLOR_TEXT, MAIN_OVERLAY_COLOR_BG, MAIN_STRONG_COLOR_TEXT, SECONDARY_BORDER, SUBTITLE_COLOR_TEXT, TITLE_COLOR_TEXT } from "../../assets/styles/pre-set-styles";
import { useLayout } from "../../contexts/layout/LayoutContext";
import Logo from "../ui/Logo";

export default function Sidebar({ navLinks = [], dropdownGroups = [], profileLinks = [], user }) {
    const { sidebarOpen, toggleSidebar } = useLayout();
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <aside className={`fixed top-0 left-0 z-40 h-screen ${MAIN_OVERLAY_COLOR_BG} border-r border-grey-200 dark:border-grey-700 transition-all duration-300 ease-in-out flex flex-col ${sidebarOpen ? "w-64" : "w-16"}`}>
            {/* ── Header / Logo ──────────────────────────────────────── */}
            <div className="flex items-center justify-between h-16 md:h-20 px-3 border-b border-grey-200 dark:border-grey-700">
                {sidebarOpen && (
                    <NavLink to="/" className="flex items-center gap-2 overflow-hidden">
                        <Logo className="h-8 w-auto" />
                    </NavLink>
                )}
                <button onClick={toggleSidebar} className={`p-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-white/5 ${MAIN_STRONG_COLOR_TEXT} transition-colors duration-200 shrink-0 ${!sidebarOpen ? "mx-auto" : ""}`}>
                    {sidebarOpen ? <ChevronDoubleLeftIcon className="w-5 h-5" /> : <ChevronDoubleRightIcon className="w-5 h-5" />}
                </button>
            </div>

            {/* ── Navigation ─────────────────────────────────────────── */}
            <nav className="flex-1 overflow-y-auto hide-scrollbar px-2 py-3 space-y-1">
                {/* Flat links */}
                {navLinks.map((item) => (
                    <SidebarLink key={item.name} item={item} collapsed={!sidebarOpen} isActive={currentPath === item.href} />
                ))}

                {/* Grouped links */}
                {dropdownGroups.map((group) => (
                    <SidebarGroup key={group.label} group={group} collapsed={!sidebarOpen} currentPath={currentPath} />
                ))}
            </nav>

            {/* ── Footer / User ──────────────────────────────────────── */}
            {user && (
                <div className="border-t border-grey-200 dark:border-grey-700 px-2 py-3 space-y-1">
                    {sidebarOpen && <p className={`px-3 py-1 text-xs uppercase tracking-wider ${TITLE_COLOR_TEXT}`}>Account</p>}
                    {profileLinks.map((item) => (
                        <SidebarLink key={item.name} item={item} collapsed={!sidebarOpen} isActive={currentPath === item.href} />
                    ))}
                </div>
            )}
        </aside>
    );
}

// ── SidebarLink ───────────────────────────────────────────────────────────
function SidebarLink({ item, collapsed, isActive }) {
    const content = (
        <div className={`${isActive ? `${MAIN_FOREGROUND_COLOR_TEXT} ${SECONDARY_BORDER} shadow` : `${SUBTITLE_COLOR_TEXT} hover:bg-orange-50 dark:hover:bg-white/5 hover:text-orange-600`} flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 cursor-pointer ${collapsed ? "justify-center" : ""}`} title={collapsed ? item.name : undefined}>
            {item.icon && <item.icon className="w-5 h-5 shrink-0" />}
            {!collapsed && <span className="truncate">{item.name}</span>}
        </div>
    );

    if (item.onClick) {
        return (
            <NavLink to={item.href} onClick={item.onClick}>
                {content}
            </NavLink>
        );
    }

    return <NavLink to={item.href}>{content}</NavLink>;
}

// ── SidebarGroup ──────────────────────────────────────────────────────────
function SidebarGroup({ group, collapsed, currentPath }) {
    const isGroupActive = group.items.some((item) => currentPath.startsWith(item.href));
    const [expanded, setExpanded] = useState(isGroupActive);
    const toggle = useCallback(() => setExpanded((e) => !e), []);

    if (collapsed) {
        // In collapsed mode show only the first letter as a category indicator
        return (
            <div className="py-1">
                <div className={`flex items-center justify-center px-3 py-2 rounded-lg text-xs font-aumovio-bold uppercase ${isGroupActive ? MAIN_COLOR_TEXT : TITLE_COLOR_TEXT}`} title={group.label}>
                    {group.label.charAt(0)}
                </div>
            </div>
        );
    }

    return (
        <div className="py-1">
            <button onClick={toggle} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isGroupActive ? `${MAIN_FOREGROUND_COLOR_TEXT} ${SECONDARY_BORDER} shadow` : `${TITLE_COLOR_TEXT} hover:bg-orange-50 dark:hover:bg-white/5 hover:text-orange-600`}`}>
                <span className="font-aumovio-bold">{group.label}</span>
                {expanded ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
            </button>
            {expanded && (
                <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-orange-100 dark:border-orange-400/20 pl-2">
                    {group.items.map((item) => (
                        <NavLink key={item.name} to={item.href}>
                            <div className={`${currentPath === item.href ? `${MAIN_COLOR_TEXT} bg-orange-50 dark:bg-orange-400/10` : `${SUBTITLE_COLOR_TEXT} hover:bg-orange-50 dark:hover:bg-white/5 hover:text-orange-500`} px-3 py-1.5 rounded-lg text-sm transition-all duration-200`}>{item.name}</div>
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );
}
