import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
    applyPaletteVars,
    clearPaletteVars,
    findPalette,
    generateCustomColors,
} from "../../features/personalize/personalize.palettes";

const ThemeContext = createContext(null);

const PERSONALIZE_KEY = "aumovio-personalize";
const LEGACY_KEY = "aumovio-theme";

function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function loadPrefs() {
    try {
        const raw = localStorage.getItem(PERSONALIZE_KEY);
        if (raw) {
            const p = JSON.parse(raw);
            return {
                mode: ["light", "dark", "system"].includes(p.mode) ? p.mode : "system",
                transparency: p.transparency !== false,
                palette: typeof p.palette === "string" ? p.palette : "aumovio-orange",
                customColor: typeof p.customColor === "string" ? p.customColor : null,
            };
        }
    } catch {}
    const legacy = localStorage.getItem(LEGACY_KEY);
    return {
        mode: ["light", "dark", "system"].includes(legacy) ? legacy : import.meta.env.VITE_THEME || "system",
        transparency: true,
        palette: "aumovio-orange",
        customColor: null,
    };
}

const TRANSPARENCY_STYLE_ID = "aumovio-no-transparency";

export function ThemeProvider({ children }) {
    const init = useMemo(loadPrefs, []);

    const [mode, setMode] = useState(init.mode);
    const [transparency, setTransparency] = useState(init.transparency);
    const [palette, setPaletteState] = useState(init.palette);
    const [customColor, setCustomColorState] = useState(init.customColor);

    const [resolved, setResolved] = useState(() => (mode === "system" ? getSystemTheme() : mode));

    // OS dark-mode listener
    useEffect(() => {
        if (mode !== "system") { setResolved(mode); return; }
        setResolved(getSystemTheme());
        const mql = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = (e) => setResolved(e.matches ? "dark" : "light");
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, [mode]);

    // Apply theme to DOM + persist all prefs
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", resolved);
        try {
            localStorage.setItem(PERSONALIZE_KEY, JSON.stringify({ mode, transparency, palette, customColor }));
            localStorage.setItem(LEGACY_KEY, mode);
        } catch {}
    }, [mode, resolved, transparency, palette, customColor]);

    // Transparency — inject/remove a <style> tag appended to <head>.
    // A dynamically-appended <style> lives AFTER all linked stylesheets in the
    // cascade, so !important here beats every Tailwind utility regardless of layer.
    useEffect(() => {
        const existing = document.getElementById(TRANSPARENCY_STYLE_ID);
        if (!transparency) {
            if (!existing) {
                const style = document.createElement("style");
                style.id = TRANSPARENCY_STYLE_ID;
                style.textContent =
                    "*, *::before, *::after { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }";
                document.head.appendChild(style);
            }
        } else {
            existing?.remove();
        }
    }, [transparency]);

    // Palette CSS variable overrides
    useEffect(() => {
        if (palette === "aumovio-orange") {
            clearPaletteVars();
            return;
        }
        if (palette === "custom") {
            if (customColor) applyPaletteVars(generateCustomColors(customColor));
            return;
        }
        const entry = findPalette(palette);
        if (entry?.colors) applyPaletteVars(entry.colors);
    }, [palette, customColor]);

    const toggle = useCallback(
        () => setMode((m) => (m === "system" ? "light" : m === "light" ? "dark" : "system")),
        [],
    );
    const setPalette = useCallback((id) => setPaletteState(id), []);
    const setCustomColor = useCallback((hex) => setCustomColorState(hex), []);

    const value = useMemo(
        () => ({
            mode, theme: resolved, isDark: resolved === "dark",
            setMode, toggle,
            transparency, setTransparency,
            palette, setPalette,
            customColor, setCustomColor,
        }),
        [mode, resolved, toggle, transparency, palette, customColor, setPalette, setCustomColor],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * @returns {{ mode, theme, isDark, setMode, toggle,
 *             transparency, setTransparency,
 *             palette, setPalette, customColor, setCustomColor }}
 */
export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
}
