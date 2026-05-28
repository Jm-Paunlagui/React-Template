/**
 * nav.config.jsx — Single source of truth for all navigation.
 *
 * To configure this for a new project:
 *   1. Update PUBLIC_LINKS with unauthenticated routes.
 *   2. Update AUTH_FLAT_LINKS with top-level authenticated routes (e.g. Dashboard).
 *   3. Update NAV_GROUPS per role with feature routes.
 *      • color        → sidebar group accent  (orange|purple|blue|success|danger|warn|grey)
 *      • icon         → JSX element           (shown in Sidebar; ignored by Navbar)
 *      • description  → subtitle string       (shown in Navbar dropdown; ignored by Sidebar)
 *
 * Both Navbar and Sidebar import from here — change once, both update.
 *
 * Icon library: react-icons/md (primary) + react-icons/fa (gaps)
 */

import { MdHelp, MdHistory, MdHome, MdLogin, MdOutlineChangeHistory, MdSpaceDashboard } from "react-icons/md";

const SIZE = 16;

// ── Unauthenticated flat links ────────────────────────────────────────────────
export const PUBLIC_LINKS = [
    { name: "Home", href: "/", icon: <MdHome size={SIZE} /> },
    { name: "Help", href: "/help", icon: <MdHelp size={SIZE} /> },
    { name: "Sign In", href: "/auth", icon: <MdLogin size={SIZE} /> },
];

// ── Authenticated flat links (shown above groups in both layouts) ──────────────
export const AUTH_FLAT_LINKS = [{ name: "Dashboard", href: "/dashboard", icon: <MdSpaceDashboard size={SIZE} /> }];

// ── Role-based nav groups ─────────────────────────────────────────────────────
// Add or remove roles here to match your backend's role strings.
export const NAV_GROUPS = {
    USER: [
        {
            label: "System",
            color: "purple",
            items: [{ name: "Logging & Observability", href: "/management/logging-observability", icon: <MdHistory size={SIZE} />, description: "Audit and activity logs" }],
        },
        {
            label: "Other",
            color: "grey",
            items: [
                { name: "Version History", href: "/other/changelog", icon: <MdOutlineChangeHistory size={SIZE} />, description: "What's changed in each release" },
                { name: "Help", href: "/help", icon: <MdHelp size={SIZE} /> },
            ],
        },
    ],

    ADMIN: [
        {
            label: "System",
            color: "purple",
            items: [{ name: "Logging & Observability", href: "/management/logging-observability", icon: <MdHistory size={SIZE} />, description: "Audit and activity logs" }],
        },
        {
            label: "Other",
            color: "grey",
            items: [
                { name: "Version History", href: "/other/changelog", icon: <MdOutlineChangeHistory size={SIZE} />, description: "What's changed in each release" },
                { name: "Help", href: "/help", icon: <MdHelp size={SIZE} /> },
            ],
        },
    ],

    SUPER_ADMIN: [
        {
            label: "System",
            color: "purple",
            items: [{ name: "Logging & Observability", href: "/management/logging-observability", icon: <MdHistory size={SIZE} />, description: "Audit and activity logs" }],
        },
        {
            label: "Other",
            color: "grey",
            items: [
                { name: "Version History", href: "/other/changelog", icon: <MdOutlineChangeHistory size={SIZE} />, description: "What's changed in each release" },
                { name: "Help", href: "/help", icon: <MdHelp size={SIZE} /> },
            ],
        },
    ],

    ROBOT: [],
};
