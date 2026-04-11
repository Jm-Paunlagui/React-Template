import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "aumovio-theme"; // stores "light" | "dark" | "system"

function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

export function ThemeProvider({ children }) {
    // "mode" is the user's *preference*: "light" | "dark" | "system"
    const [mode, setMode] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "light" || stored === "dark" || stored === "system")
            return stored;
        return import.meta.env.VITE_THEME || "system";
    });

    // resolved is always "light" or "dark" — the actual applied theme
    const [resolved, setResolved] = useState(() =>
        mode === "system" ? getSystemTheme() : mode,
    );

    // Listen for OS-level preference changes when mode is "system"
    useEffect(() => {
        if (mode !== "system") {
            setResolved(mode);
            return;
        }
        setResolved(getSystemTheme());

        const mql = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = (e) => setResolved(e.matches ? "dark" : "light");
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, [mode]);

    // Apply to DOM + persist
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", resolved);
        localStorage.setItem(STORAGE_KEY, mode);
    }, [mode, resolved]);

    // Cycle: system → light → dark → system
    const toggle = useCallback(
        () =>
            setMode((m) =>
                m === "system" ? "light" : m === "light" ? "dark" : "system",
            ),
        [],
    );

    const value = useMemo(
        () => ({
            mode, // "system" | "light" | "dark" (the preference)
            theme: resolved, // "light" | "dark" (the applied value)
            isDark: resolved === "dark",
            setMode, // set to "light" | "dark" | "system"
            toggle, // cycle system → light → dark → system
        }),
        [mode, resolved, toggle],
    );

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
}
