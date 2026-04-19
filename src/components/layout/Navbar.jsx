/**
 * Navbar.jsx
 * ──────────
 * Responsive top navigation bar — Aumovio Design System v3.0
 *
 * UI COMPONENTS USED
 * ──────────────────
 *   Avatar      → user avatar button (desktop + mobile)
 *   Badge       → role pill inside profile dropdown
 *   ThemeToggle → dark-mode cycle button in the right rail
 *   Dropdown    → profile context menu (desktop)
 *
 * CUSTOMISATION GUIDE
 * ───────────────────
 * 1. Update `authLinks`, `publicLinks`, `dropdownGroups` with your routes.
 * 2. The navbar reads `user.user_data.userLevel` for role-based visibility.
 * 3. Replace the Logo import and APP_DISPLAY_NAME to brand your project.
 * 4. Add/remove Dropdown items inside `profileDropdownItems`.
 */

import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { ArrowRightStartOnRectangleIcon, Bars3Icon, UserCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { ACCENT_COLOR_BORDER, ANIMATE_SCALE_IN, ANIMATE_SCALE_OUT, ANIMATE_SLIDE_DOWN, BASE_COLOR_TEXT, DELAY_1, MAIN_FOREGROUND_COLOR_TEXT, MAIN_OVERLAY_COLOR_BG, MAIN_PULSE_COLOR_BG, SECONDARY_COLOR_TEXT, SUBTITLE_COLOR_TEXT, TITLE_COLOR_TEXT, TRANSITION_COLORS, TRANSITION_SNAP, TRANSITION_SPRING } from "../../assets/styles/pre-set-styles";
import { AuthMiddleware } from "../../middleware/authentication/AuthMiddleware";
import httpClient from "../../middleware/HttpClient";

// ── UI components ─────────────────────────────────────────────────────────────
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import Logo from "../ui/Logo";
import { ThemeToggle } from "../ui/ThemeToggle";

// App display name (set to null to hide the text label next to the logo)
const APP_DISPLAY_NAME = import.meta.env.VITE_APP_NAME || null;

// ── Role helpers ──────────────────────────────────────────────────────────────
function resolveRoleLabel(level) {
    if (level === 3) return "Super Admin";
    if (level === 2) return "Admin";
    return "User";
}
function resolveRoleBadgeVariant(level) {
    if (level === 3) return "purple";
    if (level === 2) return "orange";
    return "grey";
}

// ── NavItem helper ────────────────────────────────────────────────────────────
const NavItem = ({ item }) => (
    <NavLink to={item.href}>
        <div
            className={`
                ${item.current ? `${MAIN_FOREGROUND_COLOR_TEXT} ${ACCENT_COLOR_BORDER} shadow` : `${TITLE_COLOR_TEXT} hover:bg-orange-50 dark:hover:bg-white/5 hover:text-orange-600`}
                px-3 py-2 rounded-lg text-sm font-aumovio ${TRANSITION_COLORS} cursor-pointer
            `}
        >
            {item.name}
        </div>
    </NavLink>
);

// ── DropdownGroup (mega-menu on hover) ────────────────────────────────────────
const DropdownGroup = ({ label, isActive: active, isLoading, items }) => (
    <div className="relative group">
        <div
            className={`
                ${isLoading ? `${SECONDARY_COLOR_TEXT} animate-pulse ${MAIN_PULSE_COLOR_BG} cursor-default` : active ? `${MAIN_FOREGROUND_COLOR_TEXT} ${ACCENT_COLOR_BORDER} shadow` : `${TITLE_COLOR_TEXT} hover:bg-orange-50 dark:hover:bg-white/5 hover:text-orange-600`}
                px-3 py-2 rounded-lg text-sm font-aumovio ${TRANSITION_COLORS} cursor-pointer
            `}
        >
            {isLoading ? <span className={`w-20 bg-orange-300 rounded animate-pulse text-transparent ${DELAY_1}`}>{label}</span> : label}
        </div>
        {items.length > 0 && (
            <div
                className={`
                    absolute z-10 invisible py-4 mt-2 ${TRANSITION_SNAP}
                    origin-top transform -translate-x-1/2 left-1/2 w-72
                    bg-white dark:bg-[#1a1030] rounded-xl shadow-2xl opacity-0
                    ring-1 ring-black/5 dark:ring-white/10
                    group-hover:opacity-100 group-hover:visible
                `}
            >
                <div className="px-4">
                    <p className="mb-3 text-[10px] font-aumovio-bold uppercase tracking-widest text-grey-400">{label}</p>
                    <div className="space-y-1">
                        {items.map((item) => (
                            <NavLink key={item.name} to={item.href}>
                                <div
                                    className={`
                                        flex items-center justify-between p-2.5 rounded-lg
                                        ${TRANSITION_COLORS}
                                        hover:bg-orange-50 dark:hover:bg-orange-400/5
                                        ${item.current ? "text-orange-400 font-aumovio-bold" : "text-grey-700 dark:text-grey-300 hover:text-orange-500"}
                                    `}
                                >
                                    <div>
                                        <p className="text-sm font-aumovio">{item.name}</p>
                                        {item.description && <p className="text-xs text-grey-400 mt-0.5">{item.description}</p>}
                                    </div>
                                    <span className="text-grey-300 dark:text-grey-600 text-sm">→</span>
                                </div>
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
        )}
    </div>
);

// ─── Main Navbar Component ────────────────────────────────────────────────────
export default function Navbar() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);

    const token = AuthMiddleware.getCookie("token");
    const location = useLocation();
    const navigate = useNavigate();
    const split = location.pathname.split("/");

    // Scroll shadow
    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Fetch user on token change
    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setIsLoading(true);
            const u = token ? await AuthMiddleware.isAuth() : null;
            if (!cancelled) {
                setUser(u);
                setIsLoading(false);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, [token]);

    const isActive = useCallback((seg, depth = 1) => split[depth] === seg, [split]);

    // ── Logout ────────────────────────────────────────────────────────────
    const logout = useCallback(() => {
        httpClient
            .post("user-auth/logout")
            .then((r) => toast.success(r.data?.message || "Signed out"))
            .catch((e) => toast.error(e?.response?.data?.message || "Logout failed"));
        navigate("/user/logout");
    }, [navigate]);

    // ── Derived user data ─────────────────────────────────────────────────
    const userName = user?.user_data?.name ?? "";
    const userLevel = user?.user_data?.userLevel;
    const userDivision = user?.user_data?.area?.split(",")[0] ?? "";
    const roleLabel = resolveRoleLabel(userLevel);
    const roleBadge = resolveRoleBadgeVariant(userLevel);

    // ── Link sets ─────────────────────────────────────────────────────────
    // ┌─────────────────────────────────────────────────────────────────────┐
    // │  PROJECT CUSTOMISATION POINT                                         │
    // │  Replace / extend these arrays with your application's routes.      │
    // └─────────────────────────────────────────────────────────────────────┘
    const publicLinks = useMemo(
        () => [
            { name: "Home", href: "/", current: isActive("", 1) },
            { name: "Sign In", href: "/auth", current: isActive("auth", 1) },
            { name: "Sign Up", href: "/sign-up", current: isActive("sign-up", 1) },
        ],
        [isActive],
    );

    const authLinks = useMemo(
        () => [
            { name: "Dashboard", href: "/dashboard", current: isActive("dashboard", 1) },
            { name: "Help", href: "/help", current: isActive("help", 1) },
        ],
        [isActive],
    );

    // Profile Dropdown items using the Dropdown component shape
    const profileDropdownItems = useMemo(
        () =>
            user
                ? [
                      {
                          id: "profile",
                          label: "Your Profile",
                          icon: UserCircleIcon,
                          onClick: () => navigate(`/user/profile/${user.user_data?.userId}`),
                      },
                      { divider: true },
                      {
                          id: "logout",
                          label: "Sign out",
                          icon: ArrowRightStartOnRectangleIcon,
                          danger: true,
                          onClick: logout,
                      },
                  ]
                : [],
        [user, logout, navigate],
    );

    // Dropdown groups for mega-menu (add your own groups here)
    const dropdownGroups = useMemo(() => {
        if (!user || isLoading) return [];
        return [
            // Example:
            // {
            //   label:      'Management',
            //   segmentKey: 'management',
            //   depth:      1,
            //   items: [
            //     { name: 'Users',    href: '/management/users',    description: 'Manage accounts' },
            //     { name: 'Settings', href: '/management/settings', description: 'System settings' },
            //   ],
            // },
        ];
    }, [user, isLoading]);

    const navigationLinks = useMemo(() => (isLoading ? [{ name: "Loading…", href: "#", isLoading: true }] : user ? authLinks : publicLinks), [isLoading, user, authLinks, publicLinks]);

    // ── Skeleton placeholder ──────────────────────────────────────────────
    const SkeletonLink = () => <span className={`inline-block w-20 bg-orange-300 rounded animate-pulse text-transparent ${DELAY_1}`}>Loading…</span>;

    return (
        <Menu
            as="nav"
            className={`
                sticky top-0 z-50 w-full font-aumovio
                ${MAIN_OVERLAY_COLOR_BG}
                ${isScrolled ? "shadow-lg shadow-black/10" : ""}
            `}
        >
            {({ open }) => (
                <>
                    {/* Mobile backdrop */}
                    {open && <div className="fixed inset-0 z-40 lg:hidden bg-black/10" />}

                    <div className="relative">
                        <div className="relative flex items-center justify-between h-16 md:h-20 lg:h-24 px-4">
                            {/* ── Logo ─────────────────────────────────── */}
                            <NavLink to="/" className="flex items-center gap-2">
                                <Logo className="h-8 md:h-10 lg:h-12 w-auto" />
                                {APP_DISPLAY_NAME && <span className={`hidden md:block tracking-widest text-base ${BASE_COLOR_TEXT}`}>{APP_DISPLAY_NAME}</span>}
                                {userDivision && <span className={`hidden md:block tracking-widest text-base ${BASE_COLOR_TEXT}`}>{userDivision}</span>}
                            </NavLink>

                            {/* ── Desktop links (centred) ───────────────── */}
                            <div className="justify-center flex-1 hidden lg:flex">
                                <div className="flex items-center gap-1">
                                    {navigationLinks.map((item, i) =>
                                        item.isLoading ? (
                                            <div key={`loading-${i}`} className={`${SECONDARY_COLOR_TEXT} animate-pulse ${MAIN_PULSE_COLOR_BG} px-3 py-2 rounded-lg text-sm`}>
                                                <SkeletonLink />
                                            </div>
                                        ) : (
                                            <NavItem key={item.name} item={item} />
                                        ),
                                    )}

                                    {/* Mega-menu groups */}
                                    {dropdownGroups.map((g) => (
                                        <DropdownGroup key={g.label} label={g.label} isActive={isActive(g.segmentKey, g.depth)} isLoading={isLoading} items={g.items} />
                                    ))}
                                </div>
                            </div>

                            {/* ── Right rail: ThemeToggle + Avatar + Burger ─ */}
                            <div className="flex items-center gap-2">
                                {/* Dark-mode toggle — always visible */}
                                <ThemeToggle size="sm" variant="cycle" />

                                {/* User Avatar + profile dropdown (desktop) */}
                                {(user || isLoading) && token && (
                                    <Menu as="div" className="relative hidden md:block">
                                        <MenuButton
                                            disabled={isLoading}
                                            className="
                                                focus-visible:outline-none
                                                focus-visible:ring-2 focus-visible:ring-orange-400/50
                                                rounded-full ${TRANSITION_SPRING}
                                                hover:ring-2 hover:ring-orange-400/40
                                            "
                                        >
                                            {isLoading ? <div className="w-9 h-9 rounded-full bg-orange-200 animate-pulse" /> : <Avatar name={userName} size="sm" bordered />}
                                        </MenuButton>

                                        <Transition as="div" enter={`${ANIMATE_SCALE_IN}`} leave={`${ANIMATE_SCALE_OUT}`}>
                                            <MenuItems
                                                className="
                                                    absolute right-0 z-50 mt-2 w-56
                                                    bg-white dark:bg-[#1a1030]
                                                    rounded-xl shadow-2xl
                                                    ring-1 ring-black/5 dark:ring-white/10
                                                    focus:outline-none overflow-hidden
                                                "
                                            >
                                                {/* User info header */}
                                                <div className="px-4 py-3 border-b border-grey-100 dark:border-grey-800">
                                                    <div className="flex items-center gap-2.5">
                                                        <Avatar name={userName} size="sm" />
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-aumovio-bold text-black/85 dark:text-white/90 truncate">{userName}</p>
                                                            <Badge variant={roleBadge} size="xs" pill>
                                                                {roleLabel}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Menu items */}
                                                <div className="py-1.5 px-1.5 space-y-0.5">
                                                    {profileDropdownItems.map((item, i) => {
                                                        if (item.divider) {
                                                            return <div key={`divider-${i}`} className="my-1 h-px bg-grey-100 dark:bg-grey-800 mx-2" />;
                                                        }
                                                        return (
                                                            <MenuItem key={item.id}>
                                                                <button
                                                                    onClick={item.onClick}
                                                                    className={`
                                                                        w-full flex items-center gap-2.5
                                                                        px-3 py-2 rounded-lg text-sm font-aumovio
                                                                        ${TRANSITION_COLORS}
                                                                        ${item.danger ? "text-danger-500 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-400/10" : "text-grey-700 dark:text-grey-300 hover:bg-orange-50 dark:hover:bg-orange-400/5 hover:text-orange-500"}
                                                                    `}
                                                                >
                                                                    {item.icon && <item.icon className="w-4 h-4 shrink-0" />}
                                                                    {item.label}
                                                                </button>
                                                            </MenuItem>
                                                        );
                                                    })}
                                                </div>
                                            </MenuItems>
                                        </Transition>
                                    </Menu>
                                )}

                                {/* Mobile burger */}
                                <MenuButton
                                    className={`
                                        lg:hidden inline-flex items-center justify-center p-2
                                        rounded-lg ${TRANSITION_SPRING}
                                        text-grey-600 dark:text-grey-300
                                        hover:bg-orange-50 dark:hover:bg-orange-400/10
                                        hover:text-orange-500
                                    `}
                                >
                                    <span className="sr-only">Open main menu</span>
                                    {open ? <XMarkIcon aria-hidden="true" className="w-5 h-5" /> : <Bars3Icon aria-hidden="true" className="w-5 h-5" />}
                                </MenuButton>
                            </div>
                        </div>
                    </div>

                    {/* ── Mobile menu ──────────────────────────────────── */}
                    <Transition show={open} as="div" className="absolute left-0 right-0 z-50 lg:hidden top-full" enter={`${ANIMATE_SLIDE_DOWN}`} leave={`${ANIMATE_SCALE_OUT}`}>
                        <div
                            className={`
                                mx-2 mb-2 px-2 pt-4 pb-4 space-y-1
                                overflow-auto rounded-xl shadow-2xl
                                max-h-[90vh] hide-scrollbar
                                ${MAIN_OVERLAY_COLOR_BG}
                                border border-grey-100 dark:border-grey-800
                            `}
                        >
                            {/* Mobile user card */}
                            {user && (
                                <div
                                    className="
                                        flex items-center gap-3 px-3 py-2.5 mb-2 rounded-xl
                                        bg-orange-50 dark:bg-orange-400/10
                                        border border-orange-100 dark:border-orange-400/15
                                    "
                                >
                                    <Avatar name={userName} size="sm" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-aumovio-bold text-black/85 dark:text-white/90 truncate">{userName}</p>
                                        <Badge variant={roleBadge} size="xs" pill>
                                            {roleLabel}
                                        </Badge>
                                    </div>
                                </div>
                            )}

                            {/* Nav links */}
                            {navigationLinks.map((item, i) => (
                                <NavLink key={item.name || `mobile-${i}`} to={item.isLoading ? "#" : item.href} onClick={item.isLoading ? (e) => e.preventDefault() : undefined}>
                                    <div
                                        className={`
                                            px-3 py-2 rounded-xl text-sm font-aumovio
                                            ${TRANSITION_COLORS} block
                                            ${item.isLoading ? `${SECONDARY_COLOR_TEXT} animate-pulse bg-orange-100/50 cursor-default` : item.current ? `${MAIN_FOREGROUND_COLOR_TEXT} bg-orange-50 dark:bg-orange-400/10 ${ACCENT_COLOR_BORDER}` : `${TITLE_COLOR_TEXT} hover:bg-orange-50 dark:hover:bg-white/5 hover:text-orange-600`}
                                        `}
                                    >
                                        {item.isLoading ? <span className="w-20 bg-orange-200 rounded animate-pulse text-transparent">…</span> : item.name}
                                    </div>
                                </NavLink>
                            ))}

                            {/* Mobile mega-group items (flat) */}
                            {dropdownGroups.map((g) => (
                                <div key={g.label} className="pt-3 border-t border-grey-100 dark:border-grey-800">
                                    <p className="px-3 pb-1 text-[10px] font-aumovio-bold uppercase tracking-widest text-grey-400">{g.label}</p>
                                    {g.items.map((item) => (
                                        <NavLink key={item.name} to={item.href}>
                                            <div
                                                className={`
                                                    px-3 py-2 rounded-xl text-sm font-aumovio
                                                    transition-all duration-200 block
                                                    ${item.current ? `${MAIN_FOREGROUND_COLOR_TEXT} bg-orange-50 dark:bg-orange-400/10` : `${SUBTITLE_COLOR_TEXT} hover:bg-orange-50 dark:hover:bg-white/5 hover:text-orange-600`}
                                                `}
                                            >
                                                {item.name}
                                            </div>
                                        </NavLink>
                                    ))}
                                </div>
                            ))}

                            {/* Mobile profile links */}
                            {user && profileDropdownItems.length > 0 && (
                                <div className="pt-3 border-t border-grey-100 dark:border-grey-800">
                                    <p className="px-3 pb-1 text-[10px] font-aumovio-bold uppercase tracking-widest text-grey-400">Account</p>
                                    {profileDropdownItems
                                        .filter((i) => !i.divider)
                                        .map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={item.onClick}
                                                className={`
                                                    w-full flex items-center gap-2.5
                                                    px-3 py-2 rounded-xl text-sm font-aumovio
                                                    transition-colors duration-150 text-left
                                                    ${item.danger ? "text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-400/10" : `${SUBTITLE_COLOR_TEXT} hover:bg-orange-50 dark:hover:bg-white/5 hover:text-orange-600`}
                                                `}
                                            >
                                                {item.icon && <item.icon className="w-4 h-4 shrink-0" />}
                                                {item.label}
                                            </button>
                                        ))}
                                </div>
                            )}

                            {/* Mobile theme toggle */}
                            <div className="pt-3 border-t border-grey-100 dark:border-grey-800">
                                <div className="flex items-center justify-between px-3 py-1">
                                    <span className="text-xs text-grey-400 font-aumovio">Appearance</span>
                                    <ThemeToggle size="sm" variant="segmented" />
                                </div>
                            </div>
                        </div>
                    </Transition>
                </>
            )}
        </Menu>
    );
}
