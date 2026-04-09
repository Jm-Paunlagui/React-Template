/**
 * Navbar.jsx
 * ──────────
 * Responsive navigation bar.
 *
 * CUSTOMISATION GUIDE
 * ───────────────────
 * 1. Replace `navConfig.js` (imported below) with your project's link definitions.
 * 2. The navbar reads `user.user_data.userLevel` for role-based link visibility.
 * 3. Dropdown groups are rendered from the `dropdowns` array.
 * 4. Add / remove items in navConfig without touching this component.
 */

import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Transition,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
    BASE_COLOR_BG,
    DELAY_1,
    MAIN_COLOR_TEXT,
    MAIN_FOREGROUND_COLOR_TEXT,
    MAIN_OVERLAY_COLOR_BG,
    MAIN_STRONG_COLOR_TEXT,
    SECONDARY_BORDER,
    SECONDARY_COLOR,
    SECONDARY_COLOR_TEXT,
    SUBTITLE_COLOR_TEXT,
    TITLE_COLOR_TEXT,
} from "../../../assets/styles/pre-set-styles";
import { AuthMiddleware } from "../../../middleware/authentication/AuthMiddleware";
import httpClient from "../../../middleware/HttpClient";

// ── Logo ──────────────────────────────────────────────────────────────────
// Replace this import with your own logo asset.
// import logo from '../../assets/img/logo.png';
const LOGO_PLACEHOLDER = null; // set to an imported image or null to show text

/**
 * Build the initials shown in the user avatar button.
 * Grabs first letter of the first word and first letter of the last word.
 */
const getInitials = (name = "") => {
    const parts = name.split(" ").filter(Boolean);
    if (!parts.length) return "??";
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

// ── NavItem helper ────────────────────────────────────────────────────────
const NavItem = ({ item }) => (
    <NavLink to={item.href}>
        <div
            className={`${
                item.current
                    ? `${MAIN_FOREGROUND_COLOR_TEXT} ${SECONDARY_BORDER} shadow`
                    : `${TITLE_COLOR_TEXT} hover:bg-orange-50 hover:text-orange-600`
            } px-2 py-2 rounded-lg text-base transition-all duration-200 ease-out cursor-pointer`}
        >
            {item.name}
        </div>
    </NavLink>
);

// ── DropdownGroup ─────────────────────────────────────────────────────────
const DropdownGroup = ({ label, isActive, items }) => (
    <div className="relative group">
        <div
            className={`${
                isActive
                    ? `${MAIN_FOREGROUND_COLOR_TEXT} ${SECONDARY_BORDER} shadow`
                    : `${TITLE_COLOR_TEXT} hover:bg-orange-50 hover:text-orange-600`
            } px-2 py-2 rounded-lg text-base transition-all duration-200 ease-out backface-hidden cursor-pointer`}
        >
            {label}
        </div>
        {items.length > 0 && (
            <div className="absolute z-10 invisible py-6 mt-2 transition-all duration-300 ease-out origin-top transform -translate-x-1/2 bg-white rounded-lg shadow-2xl opacity-0 w-72 ring-1 ring-black ring-opacity-5 group-hover:opacity-100 group-hover:visible">
                <div className="px-4 grid grid-cols-1 gap-1">
                    {items.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className="group/item"
                        >
                            <div className="flex items-center p-3 transition-all duration-200 rounded-lg hover:bg-grey-100">
                                <div className="flex-1">
                                    <div
                                        className={`${item.current ? MAIN_COLOR_TEXT : "text-grey-900 group-hover/item:text-orange-500"} text-base transition-colors duration-200`}
                                    >
                                        {item.name}
                                    </div>
                                    {item.description && (
                                        <div className="mt-1 text-grey-500 text-sm">
                                            {item.description}
                                        </div>
                                    )}
                                </div>
                                <span className="text-grey-400 group-hover/item:text-orange-500 transition-colors duration-200">
                                    →
                                </span>
                            </div>
                        </NavLink>
                    ))}
                </div>
            </div>
        )}
    </div>
);

// ── Main Component ────────────────────────────────────────────────────────
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

    const isActive = useCallback(
        (seg, depth = 1) => split[depth] === seg,
        [split],
    );

    // ── Logout ──────────────────────────────────────────────────────────────
    const logout = useCallback(() => {
        httpClient
            .post("user-auth/logout")
            .then((r) => toast.success(r.data?.message || "Signed out"))
            .catch((e) =>
                toast.error(e?.response?.data?.message || "Logout failed"),
            );
        navigate("/user/logout");
    }, [navigate]);

    // ── Link sets ───────────────────────────────────────────────────────────
    // ┌─────────────────────────────────────────────────────────────────────┐
    // │  PROJECT CUSTOMISATION POINT                                        │
    // │  Replace / extend these arrays with your application's routes.     │
    // └─────────────────────────────────────────────────────────────────────┘

    const publicLinks = useMemo(
        () => [
            { name: "Home", href: "/", current: isActive("", 1) },
            { name: "Sign In", href: "/auth", current: isActive("auth", 1) },
            {
                name: "Sign Up",
                href: "/sign-up",
                current: isActive("sign-up", 1),
            },
        ],
        [isActive],
    );

    const authLinks = useMemo(
        () => [
            {
                name: "Dashboard",
                href: "/dashboard",
                current: isActive("dashboard", 1),
            },
            { name: "Help", href: "/help", current: isActive("help", 1) },
        ],
        [isActive],
    );

    const profileLinks = useMemo(
        () =>
            user
                ? [
                      {
                          name: "Your Profile",
                          href: `/user/profile/${user?.user_data?.userId}`,
                          current: false,
                      },
                      {
                          name: "Sign out",
                          href: "/user/logout",
                          current: false,
                          onClick: logout,
                      },
                  ]
                : [],
        [user, logout],
    );

    const navigationLinks = useMemo(
        () =>
            isLoading
                ? [{ name: "Loading…", href: "#", isLoading: true }]
                : user
                  ? authLinks
                  : publicLinks,
        [isLoading, user, authLinks, publicLinks],
    );

    // ── Dropdown groups (add more as your project grows) ───────────────────
    // Each group: { label, segmentKey, depth, items: [{name, href, description?}] }
    const dropdownGroups = useMemo(() => {
        if (!user || isLoading) return [];
        return [
            // Example group — remove or replace for your project
            // {
            //   label:      'Management',
            //   segmentKey: 'management',
            //   depth:      1,
            //   items: [
            //     { name: 'Users',    href: '/management/users',    description: 'Manage user accounts' },
            //     { name: 'Settings', href: '/management/settings', description: 'System settings'      },
            //   ],
            // },
        ];
    }, [user, isLoading]);

    const userInitials = useMemo(
        () => getInitials(user?.user_data?.name || ""),
        [user],
    );

    // ── Skeleton link ─────────────────────────────────────────────────────
    const SkeletonLink = () => (
        <span
            className={`inline-block w-20 h-5 bg-orange-200 rounded animate-pulse ${DELAY_1}`}
        />
    );

    return (
        <Menu
            as="nav"
            className={`sticky top-0 z-50 w-full ${MAIN_OVERLAY_COLOR_BG} font-aumovio ${isScrolled ? "shadow-lg shadow-black/10" : ""}`}
        >
            {({ open }) => (
                <>
                    {/* Mobile backdrop */}
                    {open && (
                        <div className="lg:hidden fixed inset-0 bg-black/10 z-40" />
                    )}

                    <div className="relative">
                        <div className="relative flex items-center justify-between h-16 md:h-20 px-4">
                            {/* ── Logo ─────────────────────────────────────────────────── */}
                            <NavLink to="/" className="flex items-center gap-3">
                                {LOGO_PLACEHOLDER ? (
                                    <img
                                        src={LOGO_PLACEHOLDER}
                                        alt="Logo"
                                        className="h-10 w-auto"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-orange-400 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-aumovio-bold text-sm">
                                                A
                                            </span>
                                        </div>
                                        <span
                                            className={`font-aumovio-bold text-lg ${MAIN_STRONG_COLOR_TEXT} hidden md:block`}
                                        >
                                            {/* Replace with your app name */}
                                            AppName
                                        </span>
                                    </div>
                                )}
                            </NavLink>

                            {/* ── Desktop links ─────────────────────────────────────────── */}
                            <div className="hidden lg:flex items-center gap-6">
                                {navigationLinks.map((item, i) =>
                                    item.isLoading ? (
                                        <SkeletonLink key={i} />
                                    ) : (
                                        <NavItem key={item.name} item={item} />
                                    ),
                                )}

                                {/* Dropdown groups */}
                                {dropdownGroups.map((g) => (
                                    <DropdownGroup
                                        key={g.label}
                                        label={g.label}
                                        isActive={isActive(
                                            g.segmentKey,
                                            g.depth,
                                        )}
                                        items={g.items}
                                    />
                                ))}
                            </div>

                            {/* ── Right side: avatar + mobile burger ─────────────────────── */}
                            <div className="flex items-center gap-3">
                                {/* User avatar (desktop + tablet) */}
                                {user && token && (
                                    <Menu
                                        as="div"
                                        className="relative hidden md:block"
                                    >
                                        <MenuButton
                                            className={`${
                                                isActive("profile", 2)
                                                    ? `${MAIN_FOREGROUND_COLOR_TEXT} ${BASE_COLOR_BG} rounded-full`
                                                    : `${SECONDARY_COLOR_TEXT} hover:bg-orange-500 rounded-full bg-purple-400`
                                            } p-2 w-10 h-10 flex items-center justify-center transition-all duration-200 backface-hidden`}
                                        >
                                            <span className="text-sm font-aumovio-bold">
                                                {userInitials}
                                            </span>
                                        </MenuButton>
                                        <Transition
                                            as="div"
                                            enter="transition-all ease-out duration-200"
                                            enterFrom="opacity-0 scale-95 -translate-y-1"
                                            enterTo="opacity-100 scale-100 translate-y-0"
                                            leave="transition-all ease-in duration-150"
                                            leaveFrom="opacity-100 scale-100 translate-y-0"
                                            leaveTo="opacity-0 scale-95 -translate-y-1"
                                        >
                                            <MenuItems className="absolute right-0 z-10 w-48 py-2 mt-2 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                                {profileLinks.map((item) => (
                                                    <MenuItem key={item.name}>
                                                        <NavLink
                                                            to={item.href}
                                                            onClick={
                                                                item.onClick
                                                            }
                                                        >
                                                            <div
                                                                className={`${
                                                                    item.current
                                                                        ? `${MAIN_COLOR_TEXT} ${SECONDARY_COLOR} rounded-lg`
                                                                        : "text-grey-700 hover:bg-grey-100 rounded-lg hover:text-orange-500"
                                                                } px-3 py-2 text-sm transition-all duration-200 block`}
                                                            >
                                                                {item.name}
                                                            </div>
                                                        </NavLink>
                                                    </MenuItem>
                                                ))}
                                            </MenuItems>
                                        </Transition>
                                    </Menu>
                                )}

                                {/* Mobile burger */}
                                <MenuButton
                                    className={`lg:hidden inline-flex items-center justify-center p-2 ${MAIN_STRONG_COLOR_TEXT} hover:bg-orange-50 rounded-lg transition-all duration-200`}
                                >
                                    <span className="sr-only">Open menu</span>
                                    {open ? (
                                        <XMarkIcon className="w-6 h-6" />
                                    ) : (
                                        <Bars3Icon className="w-6 h-6" />
                                    )}
                                </MenuButton>
                            </div>
                        </div>
                    </div>

                    {/* ── Mobile menu ──────────────────────────────────────────────── */}
                    <Transition
                        show={open}
                        as="div"
                        className="lg:hidden absolute top-full left-0 right-0 z-50"
                        enter="transition-all ease-out duration-300"
                        enterFrom="opacity-0 -translate-y-4"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition-all ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 -translate-y-4"
                    >
                        <div
                            className={`px-3 pt-4 pb-6 space-y-1 overflow-auto rounded-lg shadow-lg max-h-[85vh] hide-scrollbar ${MAIN_OVERLAY_COLOR_BG}`}
                        >
                            {navigationLinks.map((item, i) =>
                                item.isLoading ? (
                                    <div key={i} className="px-3 py-2">
                                        <SkeletonLink />
                                    </div>
                                ) : (
                                    <NavLink key={item.name} to={item.href}>
                                        <div
                                            className={`${item.current ? `${MAIN_FOREGROUND_COLOR_TEXT} ${SECONDARY_BORDER} shadow` : `${SUBTITLE_COLOR_TEXT} hover:bg-orange-50 hover:text-orange-500`} px-3 py-2 rounded-lg text-base transition-all duration-200 block`}
                                        >
                                            {item.name}
                                        </div>
                                    </NavLink>
                                ),
                            )}

                            {/* Dropdown groups (mobile — flat list with section header) */}
                            {dropdownGroups.map((g) => (
                                <div
                                    key={g.label}
                                    className="pt-3 border-t border-orange-100"
                                >
                                    <p
                                        className={`px-3 py-1 text-xs uppercase tracking-wider ${TITLE_COLOR_TEXT}`}
                                    >
                                        {g.label}
                                    </p>
                                    {g.items.map((item) => (
                                        <NavLink key={item.name} to={item.href}>
                                            <div
                                                className={`${item.current ? `${MAIN_FOREGROUND_COLOR_TEXT} ${SECONDARY_BORDER} shadow` : `${SUBTITLE_COLOR_TEXT} hover:bg-orange-50 hover:text-orange-500`} px-3 py-2 rounded-lg text-base transition-all duration-200 block`}
                                            >
                                                {item.name}
                                            </div>
                                        </NavLink>
                                    ))}
                                </div>
                            ))}

                            {/* Profile links (mobile) */}
                            {user && token && (
                                <div className="pt-3 border-t border-orange-100">
                                    <p
                                        className={`px-3 py-1 text-xs uppercase tracking-wider ${TITLE_COLOR_TEXT}`}
                                    >
                                        Account
                                    </p>
                                    {profileLinks.map((item) => (
                                        <NavLink
                                            key={item.name}
                                            to={item.href}
                                            onClick={item.onClick}
                                        >
                                            <div
                                                className={`${SUBTITLE_COLOR_TEXT} hover:bg-orange-50 hover:text-orange-500 px-3 py-2 rounded-lg text-base transition-all duration-200 block`}
                                            >
                                                {item.name}
                                            </div>
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Transition>
                </>
            )}
        </Menu>
    );
}
