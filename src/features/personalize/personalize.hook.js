import { useTheme } from "../../contexts/theme/ThemeContext";

/**
 * usePersonalize — hook for the Personalize modal.
 *
 * Thin adapter over useTheme that surfaces exactly the state and setters the
 * modal needs, with no extra business logic.
 *
 * @returns {{ mode, setMode, isDark, transparency, setTransparency,
 *             palette, setPalette, customColor, setCustomColor }}
 */
export function usePersonalize() {
    const { mode, setMode, isDark, transparency, setTransparency, palette, setPalette, customColor, setCustomColor } =
        useTheme();

    return { mode, setMode, isDark, transparency, setTransparency, palette, setPalette, customColor, setCustomColor };
}
