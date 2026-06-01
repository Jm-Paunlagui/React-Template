/**
 * personalize.palettes.js — Accent colour palette registry.
 *
 * Each palette defines FIVE anchor colours (one per design-system colour
 * family).  applyPaletteVars() generates full 11-shade scales from each anchor
 * and injects them as CSS custom property overrides on :root so every downstream
 * Tailwind utility (bg-orange-400, text-purple-400, …) picks up the new colour
 * without touching a single component.
 *
 * generateCustomColors(hex) derives 5 complementary colours from a single
 * user-picked hex using HSL rotation — deterministic so the same hex always
 * produces the same palette.
 */

// ── Colour math helpers ────────────────────────────────────────────────────────

/** @param {string} hex — "#rrggbb" */
function hexToRgb(hex) {
    const c = hex.replace("#", "");
    return {
        r: parseInt(c.slice(0, 2), 16),
        g: parseInt(c.slice(2, 4), 16),
        b: parseInt(c.slice(4, 6), 16),
    };
}

/** @returns {string} "#rrggbb" */
function rgbToHex(r, g, b) {
    return (
        "#" +
        [r, g, b]
            .map((v) =>
                Math.max(0, Math.min(255, Math.round(v)))
                    .toString(16)
                    .padStart(2, "0"),
            )
            .join("")
    );
}

/** Linear-interpolate between two hex colours.  t=0 → base, t=1 → target. */
function mix(baseHex, targetHex, t) {
    const a = hexToRgb(baseHex);
    const b = hexToRgb(targetHex);
    return rgbToHex(a.r + (b.r - a.r) * t, a.g + (b.g - a.g) * t, a.b + (b.b - a.b) * t);
}

function hexToHsl(hex) {
    let { r, g, b } = hexToRgb(hex);
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h, s, l) {
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => {
        const k = (n + h / 30) % 12;
        const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * c).toString(16).padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

// ── Scale generation ──────────────────────────────────────────────────────────

const WHITE = "#ffffff";
const BLACK = "#000000";

/**
 * Generate an 11-shade scale from a single base colour (the "400" anchor).
 * Deterministic — same baseHex always returns the same object.
 *
 * @param {string} baseHex — e.g. "#ff4208"
 * @returns {{ "50":string, "100":string, …, "950":string }}
 */
export function generateScale(baseHex) {
    const hex = baseHex.toLowerCase();
    return {
        50:  mix(hex, WHITE, 0.96),
        100: mix(hex, WHITE, 0.82),
        200: mix(hex, WHITE, 0.64),
        300: mix(hex, WHITE, 0.40),
        400: hex,
        500: mix(hex, BLACK, 0.14),
        600: mix(hex, BLACK, 0.30),
        700: mix(hex, BLACK, 0.46),
        800: mix(hex, BLACK, 0.62),
        900: mix(hex, BLACK, 0.77),
        950: mix(hex, BLACK, 0.87),
    };
}

// ── Custom palette derivation ─────────────────────────────────────────────────

/**
 * Derive five complementary colours from a single picked hex.
 * Uses HSL hue rotation so the result is always deterministic.
 *
 * @param {string} primaryHex
 * @returns {{ primary, secondary, blue, turquoise, yellow }}
 */
export function generateCustomColors(primaryHex) {
    const { h, s, l } = hexToHsl(primaryHex.toLowerCase());
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const sat = clamp(s, 35, 90);
    const lit = clamp(l, 30, 62);
    return {
        primary:   primaryHex.toLowerCase(),
        secondary: hslToHex((h + 240) % 360, clamp(sat * 1.05, 35, 90), clamp(lit * 0.88, 25, 55)),
        blue:      hslToHex((h + 205) % 360, clamp(sat * 0.95, 35, 85), clamp(lit * 0.95, 28, 58)),
        turquoise: hslToHex((h + 170) % 360, clamp(sat * 0.90, 30, 80), clamp(lit * 1.05, 30, 62)),
        yellow:    hslToHex((h +  50) % 360, clamp(sat * 0.80, 30, 75), clamp(lit * 1.15, 35, 68)),
    };
}

// ── Runtime CSS variable application ─────────────────────────────────────────

const SHADES = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];

/**
 * Override all five colour families on :root.
 * Affects every Tailwind utility that references these CSS variables
 * (bg-orange-400, text-purple-400, border-blue-300, …).
 *
 * @param {{ primary, secondary, blue, turquoise, yellow }} colors
 */
export function applyPaletteVars(colors) {
    const { primary, secondary, blue, turquoise, yellow } = colors;
    const root = document.documentElement;

    function applyFamily(famNames, anchor) {
        const scale = generateScale(anchor);
        for (const shade of SHADES) {
            for (const fam of famNames) {
                root.style.setProperty(`--color-${fam}-${shade}`, scale[shade]);
            }
        }
        const { r, g, b } = hexToRgb(anchor);
        return { r, g, b };
    }

    const pRgb = applyFamily(["orange", "primary"],    primary);
    const sRgb = applyFamily(["purple", "secondary"],  secondary);
    const bRgb = applyFamily(["blue"],                 blue);
    applyFamily(["turquoise"],  turquoise);
    applyFamily(["yellow"],     yellow);

    root.style.setProperty("--glow-orange", `0 8px 28px rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.3)`);
    root.style.setProperty("--glow-purple", `0 8px 28px rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, 0.28)`);
    root.style.setProperty("--glow-blue",   `0 8px 28px rgba(${bRgb.r}, ${bRgb.g}, ${bRgb.b}, 0.28)`);

    // ── Palette-aware surface colours ─────────────────────────────────────────
    // Dark surfaces are tinted with the secondary colour's hue at dramatically
    // reduced saturation so the background feels cohesive without being garish.
    // Cool hues (teal, blue, purple — H 170-300) get a visible tint; warm hues
    // (red, orange, pink — outside that range) stay near-neutral.
    const { h: sh, s: ss } = hexToHsl(secondary);
    const warmFactor = (sh >= 170 && sh <= 300) ? 1.0 : (sh > 300 || sh < 30) ? 0.25 : 0.55;
    const dSat = Math.min(ss * warmFactor * 0.24, 20);
    root.style.setProperty("--palette-surface-dark",   hslToHex(sh, dSat,        5));
    root.style.setProperty("--palette-surface-2-dark", hslToHex(sh, dSat * 1.25, 10));
    root.style.setProperty("--palette-surface-3-dark", hslToHex(sh, dSat * 1.5,  15));

    // Light surfaces: primary-50 shade is 96 % white — an imperceptible tint
    // that makes the page background cohere with the palette on any monitor.
    const lightScale = generateScale(primary);
    root.style.setProperty("--palette-surface-light",   lightScale["50"]);
    root.style.setProperty("--palette-surface-2-light", mix(lightScale["50"], "#f0f0f0", 0.35));
    root.style.setProperty("--palette-surface-3-light", "#f0f0f0");
}

/** Remove all inline overrides, restoring the @theme stylesheet values. */
export function clearPaletteVars() {
    const root = document.documentElement;
    const families = ["orange", "primary", "purple", "secondary", "blue", "turquoise", "yellow"];
    for (const fam of families) {
        for (const shade of SHADES) {
            root.style.removeProperty(`--color-${fam}-${shade}`);
        }
    }
    root.style.removeProperty("--glow-orange");
    root.style.removeProperty("--glow-purple");
    root.style.removeProperty("--glow-blue");
    root.style.removeProperty("--palette-surface-dark");
    root.style.removeProperty("--palette-surface-2-dark");
    root.style.removeProperty("--palette-surface-3-dark");
    root.style.removeProperty("--palette-surface-light");
    root.style.removeProperty("--palette-surface-2-light");
    root.style.removeProperty("--palette-surface-3-light");
}

// ── Palette registry ──────────────────────────────────────────────────────────

/**
 * @typedef {{ primary:string, secondary:string, blue:string, turquoise:string, yellow:string }} PaletteColors
 * @typedef {{ id:string, name:string, colors:PaletteColors|null }} Palette
 */

/** @type {Palette[]} */
export const PALETTES = [
    // ── Brand ─────────────────────────────────────────────────────────────────
    {
        id: "aumovio-orange", name: "Aumovio Orange",
        colors: { primary: "#ff4208", secondary: "#4827af", blue: "#18a9e7", turquoise: "#12caae", yellow: "#cec43a" },
    },
    {
        id: "aumovio-purple", name: "Aumovio Purple",
        colors: { primary: "#4827af", secondary: "#ff4208", blue: "#7c3aed", turquoise: "#a78bfa", yellow: "#e879f9" },
    },
    // ── Named ─────────────────────────────────────────────────────────────────
    {
        id: "skydive", name: "Skydive",
        colors: { primary: "#0ea5e9", secondary: "#0369a1", blue: "#38bdf8", turquoise: "#22d3ee", yellow: "#fbbf24" },
    },
    {
        id: "the-divine", name: "The Divine",
        colors: { primary: "#d97706", secondary: "#7c3aed", blue: "#f59e0b", turquoise: "#c4b5fd", yellow: "#fde68a" },
    },
    {
        id: "too-much", name: "Too Much",
        colors: { primary: "#ec4899", secondary: "#a21caf", blue: "#e879f9", turquoise: "#f0abfc", yellow: "#fda4af" },
    },
    {
        id: "through-the-window", name: "Through the Window",
        colors: { primary: "#607d8b", secondary: "#455a64", blue: "#78909c", turquoise: "#b0bec5", yellow: "#cfd8dc" },
    },
    {
        id: "bloodlust", name: "Bloodlust",
        colors: { primary: "#dc2626", secondary: "#7f1d1d", blue: "#ef4444", turquoise: "#f87171", yellow: "#fecaca" },
    },
    {
        id: "muted", name: "Muted",
        colors: { primary: "#b08090", secondary: "#9f7285", blue: "#c9a0a8", turquoise: "#d4b5bb", yellow: "#edddd3" },
    },
    {
        id: "not-enough", name: "Not Enough",
        colors: { primary: "#9b8ec4", secondary: "#7c6daa", blue: "#a5b4fc", turquoise: "#c4b5fd", yellow: "#ddd6fe" },
    },
    {
        id: "desperate-touch", name: "Desperate Touch",
        colors: { primary: "#f87171", secondary: "#ef4444", blue: "#fca5a5", turquoise: "#fed7aa", yellow: "#fef3c7" },
    },
    {
        id: "high-standards", name: "High Standards",
        colors: { primary: "#c9a84c", secondary: "#92400e", blue: "#d4a017", turquoise: "#e5c577", yellow: "#fef3c7" },
    },
    {
        id: "fade-away", name: "Fade Away",
        colors: { primary: "#7cb89b", secondary: "#5a9a7f", blue: "#9ecdb5", turquoise: "#bbdece", yellow: "#d1fae5" },
    },
    {
        id: "office", name: "Office",
        colors: { primary: "#1b4b8a", secondary: "#1e40af", blue: "#2563eb", turquoise: "#3b82f6", yellow: "#93c5fd" },
    },
    {
        id: "cigarette-smoke", name: "Cigarette Smoke",
        colors: { primary: "#8b7355", secondary: "#6b5440", blue: "#a89070", turquoise: "#c4aa8a", yellow: "#e8d5b7" },
    },
    {
        id: "horizon", name: "Horizon",
        colors: { primary: "#f97316", secondary: "#dc2626", blue: "#fdba74", turquoise: "#fda4af", yellow: "#fde68a" },
    },
    {
        id: "never-again", name: "Never Again",
        colors: { primary: "#0d9488", secondary: "#0f766e", blue: "#14b8a6", turquoise: "#2dd4bf", yellow: "#99f6e4" },
    },
    {
        id: "star", name: "Star",
        colors: { primary: "#eab308", secondary: "#1e3a5f", blue: "#facc15", turquoise: "#fde047", yellow: "#7dd3fc" },
    },
    {
        id: "just-leave", name: "Just Leave",
        colors: { primary: "#6b7280", secondary: "#374151", blue: "#9ca3af", turquoise: "#d1d5db", yellow: "#f3f4f6" },
    },
    {
        id: "i-see-you", name: "I See You",
        colors: { primary: "#ec4899", secondary: "#be185d", blue: "#f9a8d4", turquoise: "#fce7f3", yellow: "#fff1f2" },
    },
    {
        id: "past-times", name: "Past Times",
        colors: { primary: "#92400e", secondary: "#451a03", blue: "#b45309", turquoise: "#d97706", yellow: "#fde68a" },
    },
    {
        id: "rough-sex", name: "Rough Sex",
        colors: { primary: "#7b1f3a", secondary: "#450a23", blue: "#9f2e50", turquoise: "#c04c6a", yellow: "#e8708a" },
    },
    {
        id: "cheap-motel", name: "Cheap Motel",
        colors: { primary: "#10b981", secondary: "#7c3aed", blue: "#06b6d4", turquoise: "#f59e0b", yellow: "#f0abfc" },
    },
    {
        id: "crybaby", name: "Crybaby",
        colors: { primary: "#7b9be8", secondary: "#4f6dcc", blue: "#93aff0", turquoise: "#bdd0f8", yellow: "#e0e9fd" },
    },
    {
        id: "wave", name: "Wave",
        colors: { primary: "#06b6d4", secondary: "#0e7490", blue: "#22d3ee", turquoise: "#67e8f9", yellow: "#cffafe" },
    },
    {
        id: "set-me-free", name: "Set Me Free",
        colors: { primary: "#3dd68c", secondary: "#16a34a", blue: "#6ee7b7", turquoise: "#bbf7d0", yellow: "#fef9c3" },
    },
    {
        id: "choking", name: "Choking",
        colors: { primary: "#4b5563", secondary: "#1f2937", blue: "#374151", turquoise: "#6b7280", yellow: "#9ca3af" },
    },
    {
        id: "overboard", name: "Overboard",
        colors: { primary: "#1e3a5f", secondary: "#0f2540", blue: "#1d4ed8", turquoise: "#2563eb", yellow: "#60a5fa" },
    },
    {
        id: "bruised", name: "Bruised",
        colors: { primary: "#4b2d7e", secondary: "#2e1a57", blue: "#7c3aed", turquoise: "#8b5cf6", yellow: "#c4b5fd" },
    },
    {
        id: "broken", name: "Broken",
        colors: { primary: "#8e82a2", secondary: "#6b5e8a", blue: "#a899c0", turquoise: "#c4b8d8", yellow: "#e4dff0" },
    },
    {
        id: "calm", name: "Calm",
        colors: { primary: "#5bb8a5", secondary: "#3d9e8e", blue: "#7ecfbe", turquoise: "#a5e0d3", yellow: "#d4f4ed" },
    },
    {
        id: "crackle", name: "Crackle",
        colors: { primary: "#ca8a04", secondary: "#dc2626", blue: "#f59e0b", turquoise: "#fbbf24", yellow: "#fef08a" },
    },
    {
        id: "always", name: "Always",
        colors: { primary: "#c87c6e", secondary: "#a85e52", blue: "#e0a090", turquoise: "#efc0b4", yellow: "#f7ddd5" },
    },
    {
        id: "fighting-on", name: "Fighting On",
        colors: { primary: "#e84317", secondary: "#9a1f00", blue: "#ff5722", turquoise: "#ff7043", yellow: "#ffccbc" },
    },
    {
        id: "heartache", name: "Heartache",
        colors: { primary: "#be185d", secondary: "#831843", blue: "#db2777", turquoise: "#ec4899", yellow: "#fbcfe8" },
    },
    {
        id: "eternity", name: "Eternity",
        colors: { primary: "#1a237e", secondary: "#0d1557", blue: "#1565c0", turquoise: "#1976d2", yellow: "#90caf9" },
    },
    {
        id: "never", name: "Never",
        colors: { primary: "#4b5563", secondary: "#1f2937", blue: "#374151", turquoise: "#6b7280", yellow: "#9ca3af" },
    },
    {
        id: "wildfire", name: "Wildfire",
        colors: { primary: "#ff3d00", secondary: "#bf0000", blue: "#ff6e40", turquoise: "#ff9e80", yellow: "#ffccbc" },
    },
    {
        id: "soft-boy", name: "Soft Boy",
        colors: { primary: "#f472b6", secondary: "#db2777", blue: "#f9a8d4", turquoise: "#fce7f3", yellow: "#fdf2f8" },
    },
    {
        id: "corporate", name: "Corporate",
        colors: { primary: "#455a64", secondary: "#263238", blue: "#546e7a", turquoise: "#607d8b", yellow: "#90a4ae" },
    },
    // ── Custom (user-picked primary, rest derived) ─────────────────────────────
    { id: "custom", name: "Custom", colors: null },
];

/** Return a palette entry by id, or the first entry as fallback. */
export function findPalette(id) {
    return PALETTES.find((p) => p.id === id) ?? PALETTES[0];
}
