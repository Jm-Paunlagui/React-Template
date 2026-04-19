/**
 * Sidebar.jsx
 * ───────────
 * Collapsible left-sidebar navigation — Aumovio Design System v3.0
 *
 * UI COMPONENTS USED
 * ──────────────────
 *   Avatar      → user card avatar + collapsed indicator
 *   Badge       → role pill inside user card
 *   ThemeToggle → dark-mode toggle pinned to footer
 *   Tooltip     → hover labels for every item when collapsed
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  PROP CONTRACT                                                       │
 * │                                                                      │
 * │  publicLinks    — flat links shown when NOT authenticated            │
 * │                   [{ name, href, icon? }]                            │
 * │                   e.g. Home / Help / Sign In / Sign Up               │
 * │                   Always rendered WITHOUT group headers.             │
 * │                                                                      │
 * │  navLinks       — flat authenticated links (no group header)         │
 * │                   [{ name, href, icon? }]                            │
 * │                                                                      │
 * │  dropdownGroups — grouped authenticated links                        │
 * │                   [{                                                 │
 * │                     label:  string,                                  │
 * │                     color?: 'orange'|'purple'|'blue'|               │
 * │                             'success'|'danger'|'warn'|'grey',        │
 * │                     items:  [{ name, href, icon?, description? }]    │
 * │                   }]                                                 │
 * │                   Only rendered when user IS authenticated.          │
 * │                                                                      │
 * │  profileLinks   — account / user actions                             │
 * │                   [{ name, href, icon?, onClick?, danger? }]         │
 * │                                                                      │
 * │  user           — auth user object or null                           │
 * │                   { user_data: { name, area, division, userLevel } } │
 * │                                                                      │
 * │  userLevelLabel — optional role override string                      │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * ICON FLEXIBILITY
 * ────────────────
 *   Heroicon component   — icon: HomeIcon
 *   FontAwesome object   — icon: faHome   (detected via .iconName)
 *   React Icons element  — icon: <AiFillHome size={16} />
 *   Any ReactNode        — icon: <svg>…</svg>
 */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useCallback, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

// Animation/transition tokens
import { ANIMATE_SLIDE_LEFT, ANIMATE_SLIDE_RIGHT, TRANSITION_COLORS, TRANSITION_SPRING } from "../../assets/styles/pre-set-styles";

// ── UI component library ──────────────────────────────────────────────────────
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import Logo from "../ui/Logo";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Tooltip } from "../ui/Tooltip";

import { faHome, faQuestionCircle, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { useLayout } from "../../contexts/layout/LayoutContext";

// ─── Group colour palette ─────────────────────────────────────────────────────
const GROUP_COLOR_MAP = {
    orange: {
        dot: "bg-orange-400",
        activeBg: "bg-orange-50  dark:bg-orange-400/10",
        activeText: "text-orange-500 dark:text-orange-400",
        hoverBg: "hover:bg-orange-50  dark:hover:bg-orange-400/10",
        hoverText: "hover:text-orange-500 dark:hover:text-orange-400",
        badgeVariant: "orange",
    },
    purple: {
        dot: "bg-purple-400",
        activeBg: "bg-purple-50  dark:bg-purple-400/10",
        activeText: "text-purple-500 dark:text-purple-400",
        hoverBg: "hover:bg-purple-50  dark:hover:bg-purple-400/10",
        hoverText: "hover:text-purple-500 dark:hover:text-purple-400",
        badgeVariant: "purple",
    },
    blue: {
        dot: "bg-blue-400",
        activeBg: "bg-blue-50    dark:bg-blue-400/10",
        activeText: "text-blue-500 dark:text-blue-400",
        hoverBg: "hover:bg-blue-50    dark:hover:bg-blue-400/10",
        hoverText: "hover:text-blue-500 dark:hover:text-blue-400",
        badgeVariant: "blue",
    },
    success: {
        dot: "bg-success-400",
        activeBg: "bg-success-50 dark:bg-success-400/10",
        activeText: "text-success-500 dark:text-success-400",
        hoverBg: "hover:bg-success-50 dark:hover:bg-success-400/10",
        hoverText: "hover:text-success-500 dark:hover:text-success-400",
        badgeVariant: "green",
    },
    danger: {
        dot: "bg-danger-400",
        activeBg: "bg-danger-50  dark:bg-danger-400/10",
        activeText: "text-danger-500 dark:text-danger-400",
        hoverBg: "hover:bg-danger-50  dark:hover:bg-danger-400/10",
        hoverText: "hover:text-danger-500 dark:hover:text-danger-400",
        badgeVariant: "red",
    },
    warn: {
        dot: "bg-warn-500",
        activeBg: "bg-warn-50    dark:bg-warn-400/10",
        activeText: "text-warn-600 dark:text-warn-400",
        hoverBg: "hover:bg-warn-50    dark:hover:bg-warn-400/10",
        hoverText: "hover:text-warn-600 dark:hover:text-warn-400",
        badgeVariant: "warning",
    },
    grey: {
        dot: "bg-grey-400",
        activeBg: "bg-grey-100 dark:bg-grey-800",
        activeText: "text-grey-700 dark:text-grey-300",
        hoverBg: "hover:bg-grey-100 dark:hover:bg-grey-800",
        hoverText: "hover:text-grey-700 dark:hover:text-grey-300",
        badgeVariant: "grey",
    },
};

const DEFAULT_COL = GROUP_COLOR_MAP.orange;
const resolveColor = (key) => GROUP_COLOR_MAP[key] ?? DEFAULT_COL;

// ─── Resolve role → Badge variant ────────────────────────────────────────────
function roleBadgeVariant(level, label = "") {
    const l = label.toLowerCase();
    if (l.includes("super") || level === 3) return "purple";
    if (l.includes("admin") || level === 2) return "orange";
    return "grey";
}

// ─── Flexible icon renderer ───────────────────────────────────────────────────
// 1. Heroicon component ref    — typeof icon === "function"
// 2. FontAwesome icon object   — "iconName" in icon
// 3. JSX element / ReactNode   — everything else
function NavIcon({ icon, className = "w-4 h-4 shrink-0" }) {
    if (!icon) return null;
    if (typeof icon === "function") {
        const Icon = icon;
        return <Icon className={className} />;
    }
    if (icon && typeof icon === "object" && "iconName" in icon) {
        return <FontAwesomeIcon icon={icon} className={className} />;
    }
    return <span className="shrink-0 flex items-center justify-center">{icon}</span>;
}

// ─── FlatNavItem ──────────────────────────────────────────────────────────────
function FlatNavItem({ item, collapsed, colorKey = "orange", danger = false }) {
    const col = resolveColor(colorKey);
    const location = useLocation();
    const isActive = location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href + "/"));

    const inner = (
        <NavLink to={item.href} onClick={item.onClick}>
            <div
                className={`
                    flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-aumovio
                    ${TRANSITION_COLORS}
                    ${collapsed ? "justify-center px-0! w-10 h-10 mx-auto" : ""}
                    ${danger ? "text-danger-500 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-400/10" : isActive ? `${col.activeBg} ${col.activeText} font-aumovio-bold` : `text-grey-600 dark:text-grey-400 ${col.hoverBg} ${col.hoverText}`}
                `}
            >
                <span
                    className={`
                        shrink-0 flex items-center justify-center
                        ${danger ? "text-danger-400" : isActive ? col.activeText : "text-grey-400 dark:text-grey-500"}
                    `}
                >
                    <NavIcon icon={item.icon} />
                </span>

                {!collapsed && (
                    <>
                        <span className="flex-1 truncate">{item.name}</span>
                        {isActive && !danger && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${col.dot}`} />}
                    </>
                )}
            </div>
        </NavLink>
    );

    // Wrap with Tooltip only in collapsed mode
    if (collapsed) {
        return (
            <Tooltip content={item.name} placement="right" delay={100}>
                {inner}
            </Tooltip>
        );
    }
    return inner;
}

// ─── SidebarGroup ─────────────────────────────────────────────────────────────
function SidebarGroup({ group, collapsed, currentPath }) {
    const col = resolveColor(group.color ?? "orange");
    const isGroupActive = group.items.some((item) => currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href + "/")));
    const [expanded, setExpanded] = useState(isGroupActive);
    const toggle = useCallback(() => setExpanded((v) => !v), []);

    // ── Collapsed: letter marker + icon-only items ────────────────────────
    if (collapsed) {
        return (
            <div className="flex flex-col items-center gap-0.5 py-1">
                {/* Group initial as a Tooltip trigger */}
                <Tooltip content={group.label} placement="right" delay={100}>
                    <div
                        className={`
                            w-7 h-7 rounded-lg flex items-center justify-center
                            text-[10px] font-aumovio-bold uppercase cursor-default
                            ${isGroupActive ? `${col.activeBg} ${col.activeText}` : "text-grey-400 dark:text-grey-500 hover:bg-grey-100 dark:hover:bg-grey-800"}
                        `}
                    >
                        {group.label.charAt(0)}
                    </div>
                </Tooltip>

                {group.items.map((item) => {
                    const active = currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href + "/"));
                    return (
                        <Tooltip key={item.name} content={item.name} placement="right" delay={100}>
                            <NavLink to={item.href}>
                                <div
                                    className={`
                                        w-9 h-9 flex items-center justify-center rounded-xl
                                        ${TRANSITION_COLORS}
                                        ${active ? `${col.activeBg} ${col.activeText}` : `text-grey-400 dark:text-grey-500 ${col.hoverBg} ${col.hoverText}`}
                                    `}
                                >
                                    <span className={`flex items-center justify-center ${active ? col.activeText : ""}`}>
                                        <NavIcon icon={item.icon} />
                                    </span>
                                </div>
                            </NavLink>
                        </Tooltip>
                    );
                })}
            </div>
        );
    }

    // ── Expanded ──────────────────────────────────────────────────────────
    return (
        <div className="mb-1">
            {/* Group header */}
            <button
                onClick={toggle}
                className={`
                    w-full flex items-center gap-2 px-3 py-1.5 rounded-lg
                    text-[11px] font-aumovio-bold uppercase tracking-wider
                    ${TRANSITION_COLORS}
                    ${isGroupActive ? col.activeText : "text-grey-400 dark:text-grey-500 hover:text-grey-600 dark:hover:text-grey-300"}
                `}
            >
                <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${col.dot}`} />
                <span className="flex-1 text-left">{group.label}</span>
                {expanded ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />}
            </button>

            {/* Group items */}
            {expanded && (
                <div className="mt-0.5 ml-3 pl-3 border-l-2 border-grey-100 dark:border-grey-700/60 space-y-0.5">
                    {group.items.map((item) => {
                        const active = currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href + "/"));
                        return (
                            <NavLink key={item.name} to={item.href}>
                                <div
                                    className={`
                                        flex items-center gap-2.5 px-3 py-2 rounded-lg
                                        text-sm font-aumovio
                                        ${TRANSITION_COLORS}
                                        ${active ? `${col.activeBg} ${col.activeText} font-aumovio-bold` : `text-grey-600 dark:text-grey-400 ${col.hoverBg} ${col.hoverText}`}
                                    `}
                                >
                                    <span
                                        className={`shrink-0 flex items-center justify-center
                                            ${active ? col.activeText : "text-grey-400 dark:text-grey-500"}`}
                                    >
                                        <NavIcon icon={item.icon} />
                                    </span>
                                    <span className="flex-1 truncate">{item.name}</span>
                                    {active && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${col.dot}`} />}
                                </div>
                            </NavLink>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ─── UserCard ─────────────────────────────────────────────────────────────────
// Uses Avatar (ui/Avatar) + Badge (ui/Badge) from the component library.
function UserCard({ user, userLevelLabel, collapsed }) {
    const name = user?.user_data?.name ?? "";
    const division = user?.user_data?.area?.split(",")[0] ?? user?.user_data?.division ?? "";
    const level = user?.user_data?.userLevel;
    const role = userLevelLabel ?? (level === 3 ? "Super Admin" : level === 2 ? "Admin" : "User");

    const badgeVariant = roleBadgeVariant(level, role);

    // Collapsed: Avatar only with Tooltip showing full name
    if (collapsed) {
        return (
            <div className="flex justify-center py-3 shrink-0 border-b border-grey-100 dark:border-grey-800">
                <Tooltip content={`${name} · ${role}`} placement="right" delay={100}>
                    <Avatar name={name} size="sm" bordered />
                </Tooltip>
            </div>
        );
    }

    // Expanded: full user card
    return (
        <div
            className="
                mx-3 mt-3 mb-1 p-3 rounded-xl shrink-0
                bg-orange-50 dark:bg-orange-400/8
                border border-orange-100 dark:border-orange-400/15
                flex items-center gap-3
            "
        >
            <Avatar name={name} size="lg" />

            <div className="min-w-0 flex-1">
                <p className="text-sm font-aumovio-bold text-black/85 dark:text-white/90 truncate leading-tight">{name || "User"}</p>
                {division && <p className="text-xs text-grey-500 dark:text-grey-400 truncate mt-0.5">{division}</p>}
                <div className="mt-1.5">
                    <Badge variant={badgeVariant} size="xs" pill>
                        {role}
                    </Badge>
                </div>
            </div>
        </div>
    );
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────
export default function Sidebar({
    publicLinks = [
        { name: "Home", href: "/", icon: <FontAwesomeIcon icon={faHome} /> }, // FA object
        { name: "Help", href: "/help", icon: <FontAwesomeIcon icon={faQuestionCircle} /> }, // Heroicon
        { name: "Sign In", href: "/auth", icon: <FontAwesomeIcon icon={faSignInAlt} /> }, // React Icons
    ],
    navLinks = [],
    dropdownGroups = [],
    profileLinks = [],
    user = null,
    userLevelLabel,
}) {
    const { sidebarOpen, toggleSidebar } = useLayout();
    const { pathname } = useLocation();
    const isAuth = Boolean(user);

    // Sidebar open/close animation
    const sidebarAnim = sidebarOpen ? ANIMATE_SLIDE_RIGHT : ANIMATE_SLIDE_LEFT;
    return (
        <aside className={["fixed top-0 left-0 z-40 h-screen flex flex-col", "bg-white dark:bg-[#0d0d14]", "border-r border-grey-100 dark:border-grey-800", "shadow-[1px_0_8px_0_rgba(0,0,0,0.04)] dark:shadow-none", sidebarAnim, sidebarOpen ? "w-auto" : "w-16"].join(" ")}>
            {/* ── Header: Logo + collapse toggle ───────────────────────── */}
            <div
                className={`
                    flex items-center h-16 md:h-20 lg:h-24 shrink-0
                    border-b border-grey-100 dark:border-grey-800
                    ${sidebarOpen ? "px-4 gap-3 justify-between" : "px-2 justify-center"}
                `}
            >
                {sidebarOpen && (
                    <NavLink to="/" className="flex items-center flex-1 min-w-0 overflow-hidden">
                        <Logo className="w-auto h-16 md:h-20 lg:h-24" />
                    </NavLink>
                )}

                <Tooltip content={sidebarOpen ? "Collapse" : "Expand"} placement="right" delay={300}>
                    <button onClick={toggleSidebar} aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"} className={["p-1.5 rounded-lg shrink-0", "text-grey-400 dark:text-grey-500", "hover:bg-orange-50 dark:hover:bg-orange-400/10", "hover:text-orange-400", TRANSITION_SPRING, "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/50"].join(" ")}>
                        {sidebarOpen ? <ChevronDoubleLeftIcon className="w-4 h-4" /> : <ChevronDoubleRightIcon className="w-4 h-4" />}
                    </button>
                </Tooltip>
            </div>

            {/* ── User Card — authenticated only ───────────────────────── */}
            {isAuth && <UserCard user={user} userLevelLabel={userLevelLabel} collapsed={!sidebarOpen} />}

            {/* ── Navigation ───────────────────────────────────────────── */}
            <nav className="flex-1 overflow-y-auto hide-scrollbar px-2 py-3 space-y-0.5">
                {/* Public links — unauthenticated, flat, no grouping */}
                {!isAuth && publicLinks.map((item) => <FlatNavItem key={item.name} item={item} collapsed={!sidebarOpen} />)}

                {/* Authenticated flat links */}
                {isAuth && navLinks.map((item) => <FlatNavItem key={item.name} item={item} collapsed={!sidebarOpen} />)}

                {/* Divider between flat and grouped sections */}
                {isAuth && navLinks.length > 0 && dropdownGroups.length > 0 && (
                    <div className="py-1.5 px-1">
                        <div className="h-px bg-grey-100 dark:bg-grey-800" />
                    </div>
                )}

                {/* Grouped links — authenticated only */}
                {isAuth && dropdownGroups.map((group) => <SidebarGroup key={group.label} group={group} collapsed={!sidebarOpen} currentPath={pathname} />)}
            </nav>

            {/* ── Footer ───────────────────────────────────────────────── */}
            <div className="shrink-0 border-t border-grey-100 dark:border-grey-800 px-2 py-3 space-y-1">
                {/* Dark-mode toggle */}
                <div
                    className={`
                        flex items-center px-2 py-1
                        ${sidebarOpen ? "justify-between" : "justify-center"}
                    `}
                >
                    {sidebarOpen && <span className="text-xs text-grey-400 dark:text-grey-500 font-aumovio">Appearance</span>}
                    <Tooltip content="Toggle theme" placement="right" delay={200} disabled={sidebarOpen}>
                        <ThemeToggle size="sm" variant="cycle" />
                    </Tooltip>
                </div>

                {/* Account label */}
                {sidebarOpen && isAuth && profileLinks.length > 0 && <p className="px-3 pt-1 text-[10px] font-aumovio-bold uppercase tracking-widest text-grey-400 dark:text-grey-500">Account</p>}

                {/* Profile / account links */}
                {profileLinks.map((item) => (
                    <FlatNavItem key={item.name} item={item} collapsed={!sidebarOpen} danger={item.danger ?? false} />
                ))}
            </div>
        </aside>
    );
}
