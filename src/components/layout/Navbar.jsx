/**
 * Navbar.jsx
 * ──────────
 * Responsive navigation bar — visual design ported from OPITS-FE.
 *
 * CUSTOMISATION GUIDE
 * ───────────────────
 * 1. Update `authLinks`, `publicLinks`, `dropdownGroups` with your routes.
 * 2. The navbar reads `user.user_data.userLevel` for role-based link visibility.
 * 3. Dropdown groups are rendered from the `dropdownGroups` array.
 * 4. Replace the logo import and APP_DISPLAY_NAME to brand your project.
 */

import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { ACCENT_COLOR_BORDER, BASE_COLOR_BG, BASE_COLOR_TEXT, DELAY_1, MAIN_COLOR_TEXT, MAIN_FOREGROUND_COLOR_TEXT, MAIN_OVERLAY_COLOR_BG, MAIN_PULSE_COLOR_BG, MAIN_STRONG_COLOR_TEXT, SECONDARY_COLOR, SECONDARY_COLOR_TEXT, SUBTITLE_COLOR_TEXT, TITLE_COLOR_TEXT } from "../../assets/styles/pre-set-styles";
import { AuthMiddleware } from "../../middleware/authentication/AuthMiddleware";
import httpClient from "../../middleware/HttpClient";

// ── Logo ──────────────────────────────────────────────────────────────────
import Logo from "../ui/Logo";
import { ThemeToggle } from "../ui/ThemeToggle";

// Display name shown beside the logo (set to null to hide).
const APP_DISPLAY_NAME = import.meta.env.VITE_APP_NAME || null;

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
        <div className={`${item.current ? `${MAIN_FOREGROUND_COLOR_TEXT} ${ACCENT_COLOR_BORDER} shadow` : `${TITLE_COLOR_TEXT} hover:bg-orange-50 dark:hover:bg-white/5 hover:text-orange-600`} px-2 py-2 rounded-lg text-base transition-all duration-200 ease-out cursor-pointer`}>{item.name}</div>
    </NavLink>
);

// ── DropdownGroup ─────────────────────────────────────────────────────────
const DropdownGroup = ({ label, isActive: active, isLoading, items }) => (
    <div className="relative group">
        <div className={`${isLoading ? `${SECONDARY_COLOR_TEXT} animate-pulse ${MAIN_PULSE_COLOR_BG} cursor-default` : active ? `${MAIN_FOREGROUND_COLOR_TEXT} ${ACCENT_COLOR_BORDER} shadow` : `${TITLE_COLOR_TEXT} hover:bg-orange-50 dark:hover:bg-white/5 hover:text-orange-600`} px-2 py-2 rounded-lg text-base transition-all duration-200 ease-out backface-hidden cursor-pointer`}>
            {isLoading ? <span className={`w-24 bg-orange-300 rounded animate-pulse text-transparent ${DELAY_1}`}>{label}</span> : label}
        </div>
        {items.length > 0 && (
            <div className="absolute z-10 invisible py-6 mt-2 transition-all duration-300 ease-out origin-top transform -translate-x-1/2 bg-white dark:bg-[#1a1030] rounded-lg shadow-2xl opacity-0 left-1/2 w-96 ring-1 ring-black/5 dark:ring-white/10 group-hover:opacity-100 group-hover:visible">
                <div className="px-6">
                    <div className="mb-4">
                        <h3 className="mb-3 text-base tracking-wider text-gray-900 dark:text-white uppercase">{label}</h3>
                        <div className="grid grid-cols-1 gap-2">
                            {items.map((item) => (
                                <NavLink key={item.name} to={item.href} className="group/item">
                                    <div className="flex items-center p-3 transition-all duration-200 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5">
                                        <div className="flex-1">
                                            <div className={`${item.current ? `${MAIN_COLOR_TEXT} ` : "text-gray-900 dark:text-white group-hover/item:text-orange-600"} text-base transition-colors duration-200`}>{item.name}</div>
                                            {item.description && <div className="mt-1 text-gray-500 dark:text-grey-400">{item.description}</div>}
                                        </div>
                                        <div className="text-gray-400 dark:text-grey-500 transition-colors duration-200 group-hover/item:text-orange-500">→</div>
                                    </div>
                                </NavLink>
                            ))}
                        </div>
                    </div>
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

    const isActive = useCallback((seg, depth = 1) => split[depth] === seg, [split]);

    // ── Logout ──────────────────────────────────────────────────────────────
    const logout = useCallback(() => {
        httpClient
            .post("user-auth/logout")
            .then((r) => toast.success(r.data?.message || "Signed out"))
            .catch((e) => toast.error(e?.response?.data?.message || "Logout failed"));
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

    const navigationLinks = useMemo(() => (isLoading ? [{ name: "Loading…", href: "#", isLoading: true }] : user ? authLinks : publicLinks), [isLoading, user, authLinks, publicLinks]);

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

    const userInitials = useMemo(() => getInitials(user?.user_data?.name || ""), [user]);

    const userDivision = useMemo(() => user?.user_data?.area?.split(",")[0] || "", [user]);

    // ── Skeleton link ─────────────────────────────────────────────────────
    const SkeletonLink = () => <span className={`inline-block w-20 bg-orange-300 rounded animate-pulse text-transparent ${DELAY_1}`}>Loading…</span>;

    return (
        <Menu as="nav" className={`sticky top-0 z-50 w-full ${MAIN_OVERLAY_COLOR_BG} font-aumovio ${isScrolled ? "shadow-lg shadow-black/10" : ""}`}>
            {({ open }) => (
                <>
                    {/* Mobile backdrop */}
                    {open && <div className="fixed inset-0 z-40 lg:hidden bg-black/10" />}

                    <div className="relative">
                        <div className="relative flex items-center justify-between h-16 md:h-20 lg:h-24">
                            {/* ── Logo ─────────────────────────────────────────────────── */}
                            <div className="flex items-center">
                                <NavLink to="/">
                                    <div className={`relative group flex items-center ${SECONDARY_COLOR_TEXT} transition-all duration-300 ease-out delay-75 backface-hidden rounded-md`}>
                                        <Logo className="w-auto h-16 md:h-20 lg:h-24" />
                                        {APP_DISPLAY_NAME && <h1 className={`tracking-widest ${DELAY_1} md:flex ${BASE_COLOR_TEXT} hidden text-lg`}>{APP_DISPLAY_NAME}</h1>}
                                        {userDivision && <div className={`ml-2 tracking-widest ${DELAY_1} md:flex ${BASE_COLOR_TEXT} hidden text-lg`}>{userDivision}</div>}
                                    </div>
                                </NavLink>
                            </div>

                            {/* ── Desktop links (centred) ───────────────────────────────── */}
                            <div className="justify-center flex-1 hidden lg:flex">
                                <div className="flex space-x-8">
                                    {navigationLinks.map((item, i) =>
                                        item.isLoading ? (
                                            <NavLink key={`loading-${i}`} to="#" onClick={(e) => e.preventDefault()}>
                                                <div className={`${SECONDARY_COLOR_TEXT} animate-pulse ${MAIN_PULSE_COLOR_BG} px-2 py-2 rounded-lg text-base cursor-default`}>
                                                    <SkeletonLink />
                                                </div>
                                            </NavLink>
                                        ) : (
                                            <NavItem key={item.name} item={item} />
                                        ),
                                    )}

                                    {/* Dropdown groups */}
                                    {dropdownGroups.map((g) => (
                                        <DropdownGroup key={g.label} label={g.label} isActive={isActive(g.segmentKey, g.depth)} isLoading={isLoading} items={g.items} />
                                    ))}
                                </div>
                            </div>

                            {/* ── Right side: avatar + mobile burger ─────────────────── */}
                            <div className="flex items-center pr-4 space-x-4">
                                {/* Theme toggle */}
                                <ThemeToggle size="sm" />

                                {/* User avatar (desktop + tablet) */}
                                {(user || isLoading) && token && (
                                    <Menu as="div" className="relative hidden md:block">
                                        <MenuButton
                                            className={`${
                                                isLoading ? `${SECONDARY_COLOR_TEXT} animate-pulse ${MAIN_PULSE_COLOR_BG} cursor-default` : isActive("profile") ? `${MAIN_FOREGROUND_COLOR_TEXT} ${BASE_COLOR_BG} rounded-full` : `${SECONDARY_COLOR_TEXT} hover:bg-orange-600 rounded-full bg-violet-900`
                                            } p-2 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 ease-out backface-hidden`}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? <div className="w-6 h-6 bg-orange-300 rounded-full animate-pulse" /> : <div className="flex items-center justify-center w-6 h-6 rounded-full">{userInitials}</div>}
                                        </MenuButton>
                                        <Transition as="div" enter="transition-all ease-out duration-300 transform" enterFrom="opacity-0 scale-95 -translate-y-2" enterTo="opacity-100 scale-100 translate-y-0" leave="transition-all ease-in duration-200 transform" leaveFrom="opacity-100 scale-100 translate-y-0" leaveTo="opacity-0 scale-95 -translate-y-2">
                                            <MenuItems className="absolute right-0 z-10 w-48 py-2 mt-2 origin-top-right bg-white dark:bg-[#1a1030] rounded-lg shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none">
                                                {profileLinks.map((item) => (
                                                    <MenuItem key={item.name}>
                                                        <NavLink to={item.href} onClick={item.onClick}>
                                                            <div className={`${item.current ? `${MAIN_COLOR_TEXT} ${SECONDARY_COLOR} rounded-lg` : "text-gray-700 dark:text-grey-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg hover:text-orange-600"} px-2 py-2 text-base transition-all duration-200 ease-out backface-hidden`}>{item.name}</div>
                                                        </NavLink>
                                                    </MenuItem>
                                                ))}
                                            </MenuItems>
                                        </Transition>
                                    </Menu>
                                )}

                                {/* Mobile burger */}
                                <MenuButton className={`lg:hidden inline-flex items-center justify-center p-2 ${MAIN_STRONG_COLOR_TEXT} hover:bg-orange-50 dark:hover:bg-white/5 hover:text-orange-600 rounded-lg transition-all duration-200 ease-out backface-hidden`}>
                                    <span className="sr-only">Open main menu</span>
                                    {open ? <XMarkIcon aria-hidden="true" className="block w-6 h-6" /> : <Bars3Icon aria-hidden="true" className="block w-6 h-6" />}
                                </MenuButton>
                            </div>
                        </div>
                    </div>

                    {/* ── Mobile menu ──────────────────────────────────────────── */}
                    <Transition
                        show={open}
                        as="div"
                        className="absolute left-0 right-0 z-50 lg:hidden top-full"
                        enter="transition-all ease-out duration-300 transform"
                        enterFrom="opacity-0 scale-95 -translate-y-4"
                        enterTo="opacity-100 scale-100 translate-y-0"
                        leave="transition-all ease-in duration-200 transform"
                        leaveFrom="opacity-100 scale-100 translate-y-0"
                        leaveTo="opacity-0 scale-95 -translate-y-4"
                    >
                        <div className={`mx-auto px-2 pt-4 pb-6 space-y-2 overflow-auto rounded-lg shadow-lg max-h-[90vh] hide-scrollbar ${MAIN_OVERLAY_COLOR_BG}`}>
                            {/* Main navigation links */}
                            {navigationLinks.map((item, index) => (
                                <NavLink
                                    key={item.name || `mobile-loading-${index}`}
                                    to={item.isLoading ? "#" : item.href}
                                    onClick={item.isLoading ? (e) => e.preventDefault() : undefined}
                                    style={{
                                        animationDelay: `${index * 50}ms`,
                                        animationFillMode: "both",
                                    }}
                                >
                                    <div className={`${item.isLoading ? `${SECONDARY_COLOR_TEXT} animate-pulse bg-orange-200 cursor-default` : item.current ? `${MAIN_FOREGROUND_COLOR_TEXT} ${ACCENT_COLOR_BORDER} shadow` : `${TITLE_COLOR_TEXT} hover:bg-orange-50 dark:hover:bg-white/5 hover:text-orange-600`} px-2 py-2 rounded-lg text-base transition-all duration-200 ease-out backface-hidden block`}>
                                        {item.isLoading ? <span className={`w-20 bg-orange-300 rounded animate-pulse text-transparent ${DELAY_1}`}>Loading…</span> : item.name}
                                    </div>
                                </NavLink>
                            ))}

                            {/* Dropdown groups (mobile — flat list with section header) */}
                            {dropdownGroups.map((g) => (
                                <div key={g.label} className="pt-4 border-t border-orange-200">
                                    <div className="px-2 py-2">
                                        <h3 className={`${TITLE_COLOR_TEXT} uppercase tracking-wider`}>{g.label}</h3>
                                    </div>
                                    {g.items.map((item) => (
                                        <NavLink key={item.name} to={item.href}>
                                            <div className={`${item.current ? `${MAIN_FOREGROUND_COLOR_TEXT} ${ACCENT_COLOR_BORDER} shadow` : `${SUBTITLE_COLOR_TEXT} hover:bg-orange-50 dark:hover:bg-white/5 hover:text-orange-600`} px-2 py-2 rounded-lg text-base transition-all duration-200 ease-out backface-hidden block`}>{item.name}</div>
                                        </NavLink>
                                    ))}
                                </div>
                            ))}

                            {/* Profile links (mobile) */}
                            {(user || isLoading) && token && (
                                <div className="pt-4 border-t border-orange-200 dark:border-orange-400/20">
                                    <div className="px-2 py-2">
                                        <h3 className={`${TITLE_COLOR_TEXT} uppercase tracking-wider`}>Account</h3>
                                    </div>
                                    {profileLinks.map((item) => (
                                        <NavLink key={item.name} to={item.href} onClick={item.onClick}>
                                            <div className={`${item.current ? `${MAIN_FOREGROUND_COLOR_TEXT} ${ACCENT_COLOR_BORDER} shadow` : `${SUBTITLE_COLOR_TEXT} hover:bg-orange-50 dark:hover:bg-white/5 hover:text-orange-600`} px-2 py-2 rounded-lg text-base transition-all duration-200 ease-out backface-hidden block`}>{item.name}</div>
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
