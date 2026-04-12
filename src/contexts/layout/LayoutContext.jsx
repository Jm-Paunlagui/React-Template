/**
 * LayoutContext — Controls the application shell layout.
 *
 * Two modes:
 *   "top"     → Traditional sticky top navbar (default)
 *   "sidebar" → Collapsible left sidebar + slim top bar
 *
 * Consumers:
 *   - App.jsx reads `layout` to wrap content correctly
 *   - Navbar.jsx renders as top navbar when layout === "top"
 *   - Sidebar.jsx renders when layout === "sidebar"
 */

import { createContext, useCallback, useContext, useState } from "react";

/* eslint-disable react-refresh/only-export-components */

const LayoutContext = createContext(null);

const DEFAULT_LAYOUT = import.meta.env.VITE_LAYOUT_MODE === "sidebar" ? "sidebar" : "top";

export function LayoutProvider({ children }) {
    const [layout, setLayout] = useState(DEFAULT_LAYOUT);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = useCallback(() => setSidebarOpen((o) => !o), []);
    const toggleLayout = useCallback(() => setLayout((l) => (l === "top" ? "sidebar" : "top")), []);

    return (
        <LayoutContext.Provider
            value={{
                layout,
                setLayout,
                sidebarOpen,
                setSidebarOpen,
                toggleSidebar,
                toggleLayout,
            }}
        >
            {children}
        </LayoutContext.Provider>
    );
}

export function useLayout() {
    const ctx = useContext(LayoutContext);
    if (!ctx) throw new Error("useLayout must be used within LayoutProvider");
    return ctx;
}
