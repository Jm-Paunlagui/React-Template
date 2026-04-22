/**
 * Sidebar.jsx — Collapsible left sidebar (Aumovio Design System v3.0)
 *
 * CUSTOMISATION
 * ─────────────
 * Edit nav.config.jsx to change links, groups, and role assignments.
 * This file is the renderer only — no link or auth logic lives here.
 *
 * ICON FLEXIBILITY
 * ────────────────
 *   Heroicon forwardRef — icon: UserCircleIcon         (typeof === "object", has .render)
 *   React Icons element — icon: <MdDataUsage size={16} /> (JSX ReactNode)
 *   FontAwesome object  — icon: faHome                 (has .iconName)
 *   Function component  — icon: MyIcon                 (typeof === "function")
 */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useCallback, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { ANIMATE_SLIDE_LEFT, ANIMATE_SLIDE_RIGHT, TRANSITION_COLORS, TRANSITION_SPRING } from "../../assets/styles/pre-set-styles";
import { useLayout } from "../../contexts/layout/LayoutContext";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import Logo from "../ui/Logo";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Tooltip } from "../ui/Tooltip";
import { useNav } from "./useNav";

// ── Group colour palette ──────────────────────────────────────────────────────
const GROUP_COLOR_MAP = {
    orange: {
        dot: "bg-orange-400",
        activeBg: "bg-orange-50  dark:bg-orange-400/10",
        activeText: "text-orange-500 dark:text-orange-400",
        hoverBg: "hover:bg-orange-50  dark:hover:bg-orange-400/10",
        hoverText: "hover:text-orange-500 dark:hover:text-orange-400",
    },
    purple: {
        dot: "bg-purple-400",
        activeBg: "bg-purple-50  dark:bg-purple-400/10",
        activeText: "text-purple-500 dark:text-purple-400",
        hoverBg: "hover:bg-purple-50  dark:hover:bg-purple-400/10",
        hoverText: "hover:text-purple-500 dark:hover:text-purple-400",
    },
    blue: {
        dot: "bg-blue-400",
        activeBg: "bg-blue-50    dark:bg-blue-400/10",
        activeText: "text-blue-500 dark:text-blue-400",
        hoverBg: "hover:bg-blue-50    dark:hover:bg-blue-400/10",
        hoverText: "hover:text-blue-500 dark:hover:text-blue-400",
    },
    success: {
        dot: "bg-success-400",
        activeBg: "bg-success-50 dark:bg-success-400/10",
        activeText: "text-success-500 dark:text-success-400",
        hoverBg: "hover:bg-success-50 dark:hover:bg-success-400/10",
        hoverText: "hover:text-success-500 dark:hover:text-success-400",
    },
    danger: {
        dot: "bg-danger-400",
        activeBg: "bg-danger-50  dark:bg-danger-400/10",
        activeText: "text-danger-500 dark:text-danger-400",
        hoverBg: "hover:bg-danger-50  dark:hover:bg-danger-400/10",
        hoverText: "hover:text-danger-500 dark:hover:text-danger-400",
    },
    warn: {
        dot: "bg-warn-500",
        activeBg: "bg-warn-50    dark:bg-warn-400/10",
        activeText: "text-warn-600 dark:text-warn-400",
        hoverBg: "hover:bg-warn-50    dark:hover:bg-warn-400/10",
        hoverText: "hover:text-warn-600 dark:hover:text-warn-400",
    },
    grey: {
        dot: "bg-grey-400",
        activeBg: "bg-grey-100 dark:bg-grey-800",
        activeText: "text-grey-700 dark:text-grey-300",
        hoverBg: "hover:bg-grey-100 dark:hover:bg-grey-800",
        hoverText: "hover:text-grey-700 dark:hover:text-grey-300",
    },
};

const DEFAULT_COL = GROUP_COLOR_MAP.orange;
const resolveColor = (key) => GROUP_COLOR_MAP[key] ?? DEFAULT_COL;

// ── Role helpers ──────────────────────────────────────────────────────────────
function resolveRoleLabel(role) {
    if (role === "SuperAdmin") return "Super Admin";
    if (role === "Admin") return "Admin";
    return "User";
}

function resolveRoleBadgeVariant(role) {
    if (role === "SuperAdmin") return "purple";
    if (role === "Admin") return "orange";
    return "grey";
}

// ── Flexible icon renderer ────────────────────────────────────────────────────
function NavIcon({ icon, className = "w-4 h-4 shrink-0" }) {
    if (!icon) return null;
    if (typeof icon === "function") {
        const Icon = icon;
        return <Icon className={className} />;
    }
    if (typeof icon === "object" && typeof icon.render === "function") {
        // React.forwardRef component (Heroicons v2)
        const Icon = icon;
        return <Icon className={className} />;
    }
    if (typeof icon === "object" && "iconName" in icon) {
        return <FontAwesomeIcon icon={icon} className={className} />;
    }
    // JSX element (React Icons, etc.)
    return <span className="shrink-0 flex items-center justify-center">{icon}</span>;
}

// ── FlatNavItem ───────────────────────────────────────────────────────────────
function FlatNavItem({ item, collapsed, colorKey = "orange", danger = false }) {
    const col = resolveColor(colorKey);
    const { pathname } = useLocation();
    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));

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
                <span className={`shrink-0 flex items-center justify-center ${danger ? "text-danger-400" : isActive ? col.activeText : "text-grey-400 dark:text-grey-500"}`}>
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

    if (collapsed) {
        return (
            <Tooltip content={item.name} placement="right" delay={100}>
                {inner}
            </Tooltip>
        );
    }
    return inner;
}

// ── SidebarGroup ──────────────────────────────────────────────────────────────
function SidebarGroup({ group, collapsed, currentPath }) {
    const col = resolveColor(group.color ?? "orange");
    const isGroupActive = group.items.some((item) => currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href + "/")));
    const [expanded, setExpanded] = useState(isGroupActive);
    const toggle = useCallback(() => setExpanded((v) => !v), []);

    if (collapsed) {
        return (
            <div className="flex flex-col items-center gap-0.5 py-1">
                <Tooltip content={group.label} placement="right" delay={100}>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-aumovio-bold uppercase cursor-default ${isGroupActive ? `${col.activeBg} ${col.activeText}` : "text-grey-400 dark:text-grey-500 hover:bg-grey-100 dark:hover:bg-grey-800"}`}>{group.label.charAt(0)}</div>
                </Tooltip>
                {group.items.map((item) => {
                    const active = currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href + "/"));
                    return (
                        <Tooltip key={item.name} content={item.name} placement="right" delay={100}>
                            <NavLink to={item.href}>
                                <div className={`w-9 h-9 flex items-center justify-center rounded-xl ${TRANSITION_COLORS} ${active ? `${col.activeBg} ${col.activeText}` : `text-grey-400 dark:text-grey-500 ${col.hoverBg} ${col.hoverText}`}`}>
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

    return (
        <div className="mb-1">
            <button onClick={toggle} className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-aumovio-bold uppercase tracking-wider ${TRANSITION_COLORS} ${isGroupActive ? col.activeText : "text-grey-400 dark:text-grey-500 hover:text-grey-600 dark:hover:text-grey-300"}`}>
                <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${col.dot}`} />
                <span className="flex-1 text-left">{group.label}</span>
                {expanded ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />}
            </button>

            {expanded && (
                <div className="mt-0.5 ml-3 pl-3 border-l-2 border-grey-100 dark:border-grey-700/60 space-y-0.5">
                    {group.items.map((item) => {
                        const active = currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href + "/"));
                        return (
                            <NavLink key={item.name} to={item.href}>
                                <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-aumovio ${TRANSITION_COLORS} ${active ? `${col.activeBg} ${col.activeText} font-aumovio-bold` : `text-grey-600 dark:text-grey-400 ${col.hoverBg} ${col.hoverText}`}`}>
                                    <span className={`shrink-0 flex items-center justify-center ${active ? col.activeText : "text-grey-400 dark:text-grey-500"}`}>
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

// ── UserCard ──────────────────────────────────────────────────────────────────
function UserCard({ user, collapsed }) {
    const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
    const division = user?.segmentDesc ?? "";
    const role = resolveRoleLabel(user?.role);
    const badgeVariant = resolveRoleBadgeVariant(user?.role);

    if (collapsed) {
        return (
            <div className="flex justify-center py-3 shrink-0 border-b border-grey-100 dark:border-grey-800">
                <Tooltip content={`${name} · ${role}`} placement="right" delay={100}>
                    <Avatar name={name} size="sm" bordered />
                </Tooltip>
            </div>
        );
    }

    return (
        <div className="mx-3 mt-3 mb-1 p-3 rounded-xl shrink-0 bg-orange-50 dark:bg-orange-400/8 border border-orange-100 dark:border-orange-400/15 flex items-center gap-3">
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

// ── Main Sidebar ──────────────────────────────────────────────────────────────
export default function Sidebar() {
    const { layout, sidebarOpen, toggleSidebar } = useLayout();
    const { pathname } = useLocation();
    const { user, isLoading, navGroups, profileItems, publicLinks } = useNav();

    // Sidebar is only rendered in sidebar layout mode — guard AFTER all hooks
    if (layout !== "sidebar") return null;

    const isAuth = Boolean(user) && !isLoading;
    const collapsed = !sidebarOpen;
    const sidebarProfileLinks = profileItems.filter((item) => !item.divider);

    return (
        <aside className={["sticky top-0 z-40 h-screen self-start flex flex-col shrink-0", "bg-white dark:bg-[#0d0d14]", "border-r border-grey-100 dark:border-grey-800", "shadow-[1px_0_8px_0_rgba(0,0,0,0.04)] dark:shadow-none", sidebarOpen ? `${ANIMATE_SLIDE_RIGHT} w-auto` : `${ANIMATE_SLIDE_LEFT} w-16`].join(" ")}>
            {/* Header: Logo + collapse toggle */}
            <div className={`flex items-center h-16 md:h-20 lg:h-24 shrink-0 border-b border-grey-100 dark:border-grey-800 ${sidebarOpen ? "px-4 gap-3 justify-between" : "px-2 justify-center"}`}>
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

            {/* User card */}
            {isAuth && <UserCard user={user} collapsed={collapsed} />}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto hide-scrollbar px-2 py-3 space-y-0.5">
                {!isAuth && publicLinks.map((item) => <FlatNavItem key={item.name} item={item} collapsed={collapsed} />)}
                {isAuth && navGroups.map((group) => <SidebarGroup key={group.label} group={group} collapsed={collapsed} currentPath={pathname} />)}
            </nav>

            {/* Footer: theme toggle + account links */}
            <div className="shrink-0 border-t border-grey-100 dark:border-grey-800 px-2 py-3 space-y-1">
                <div className={`flex items-center px-2 py-1 ${sidebarOpen ? "justify-between" : "justify-center"}`}>
                    {sidebarOpen && <span className="text-xs text-grey-400 dark:text-grey-500 font-aumovio">Appearance</span>}
                    <Tooltip content="Toggle theme" placement="right" delay={200} disabled={sidebarOpen}>
                        <ThemeToggle size="sm" variant="cycle" />
                    </Tooltip>
                </div>

                {sidebarOpen && isAuth && sidebarProfileLinks.length > 0 && <p className="px-3 pt-1 text-[10px] font-aumovio-bold uppercase tracking-widest text-grey-400 dark:text-grey-500">Account</p>}
                {sidebarProfileLinks.map((item) => (
                    <FlatNavItem key={item.id} item={item} collapsed={collapsed} danger={item.danger ?? false} />
                ))}
            </div>
        </aside>
    );
}
