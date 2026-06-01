/**
 * PersonalizeModal — Mode, transparency, and 5-colour accent palette.
 *
 * Each palette swatch renders a 5-segment horizontal strip showing all five
 * accent colours that will be applied to the design system.  The Custom swatch
 * opens the native colour picker; the derived 5-colour scheme is shown live.
 */
import { ComputerDesktopIcon, MoonIcon, PaintBrushIcon, PlusIcon, SunIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useCallback, useRef } from "react";

import { TRANSITION_COLORS } from "../../assets/styles/pre-set-styles";
import { Toggle } from "../../components/forms/Toggle";
import { Modal } from "../../components/ui/Modal";
import { usePersonalize } from "./personalize.hook";
import { generateCustomColors, PALETTES } from "./personalize.palettes";

// ── Helpers ───────────────────────────────────────────────────────────────────

const MODE_OPTIONS = [
    { id: "system", label: "System", icon: ComputerDesktopIcon },
    { id: "light",  label: "Light",  icon: SunIcon },
    { id: "dark",   label: "Dark",   icon: MoonIcon },
];

// ── Layout atoms ──────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
    return (
        <p className="text-[11px] font-aumovio-bold uppercase tracking-widest text-grey-400 dark:text-grey-500 mb-3">
            {children}
        </p>
    );
}

function Divider() {
    return <div className="my-5 h-px bg-grey-100 dark:bg-grey-800" />;
}

// ── Mode selector ─────────────────────────────────────────────────────────────

function ModeSelector({ mode, setMode }) {
    return (
        <div className="grid grid-cols-3 gap-2">
            {MODE_OPTIONS.map(({ id, label, icon: Icon }) => {
                const active = mode === id;
                return (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setMode(id)}
                        aria-pressed={active}
                        className={[
                            "flex flex-col items-center gap-2 px-3 py-4 rounded-xl border-2 text-sm font-aumovio",
                            TRANSITION_COLORS,
                            active
                                ? "border-orange-400 bg-orange-50 dark:bg-orange-400/10 text-orange-500 dark:text-orange-400"
                                : "border-grey-200 dark:border-grey-700 text-grey-600 dark:text-grey-400 hover:border-orange-300 dark:hover:border-orange-400/40 hover:text-orange-500 dark:hover:text-orange-400",
                        ].join(" ")}
                    >
                        <Icon className="w-5 h-5 shrink-0" />
                        {label}
                    </button>
                );
            })}
        </div>
    );
}

// ── 5-colour strip ────────────────────────────────────────────────────────────

function ColorStrip({ colors, active, children }) {
    const list = [colors.primary, colors.secondary, colors.blue, colors.turquoise, colors.yellow];
    return (
        <div
            className={[
                "relative w-14 h-9 rounded-lg overflow-hidden flex shadow-md shrink-0",
                active ? "ring-2 ring-offset-1 ring-orange-400 ring-offset-[var(--bg-surface-2)]" : "",
            ].join(" ")}
        >
            {list.map((c, i) => (
                <div key={i} className="flex-1" style={{ background: c }} />
            ))}
            {children}
        </div>
    );
}

const CHECK_OVERLAY = (
    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
        <div className="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center shadow">
            <CheckIcon className="w-3 h-3 text-black/70" />
        </div>
    </div>
);

// ── Predefined palette swatch ─────────────────────────────────────────────────

function PaletteSwatch({ palette, active, onSelect }) {
    const { id, name, colors } = palette;
    return (
        <button
            type="button"
            onClick={() => onSelect(id)}
            title={name}
            aria-label={name}
            aria-pressed={active}
            className={["flex flex-col items-center gap-1.5 p-1 rounded-xl", TRANSITION_COLORS].join(" ")}
        >
            <ColorStrip colors={colors} active={active}>
                {active && CHECK_OVERLAY}
            </ColorStrip>
            <span className="text-[9px] font-aumovio text-grey-500 dark:text-grey-400 leading-tight text-center max-w-[56px] truncate">
                {name}
            </span>
        </button>
    );
}

// ── Custom colour swatch ──────────────────────────────────────────────────────

function CustomSwatch({ active, customColor, onColorChange }) {
    const inputRef = useRef(null);
    const openPicker = useCallback(() => inputRef.current?.click(), []);

    const derivedColors = customColor
        ? generateCustomColors(customColor)
        : { primary: "#ff4208", secondary: "#4827af", blue: "#18a9e7", turquoise: "#12caae", yellow: "#cec43a" };

    return (
        <button
            type="button"
            onClick={openPicker}
            aria-label="Custom colour — open colour picker"
            className={["flex flex-col items-center gap-1.5 p-1 rounded-xl", TRANSITION_COLORS].join(" ")}
        >
            <ColorStrip colors={derivedColors} active={active}>
                {active ? (
                    CHECK_OVERLAY
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                        <div className="w-5 h-5 rounded-full bg-white/80 flex items-center justify-center shadow">
                            <PlusIcon className="w-3 h-3 text-black/60" />
                        </div>
                    </div>
                )}
            </ColorStrip>
            <span className="text-[9px] font-aumovio text-grey-500 dark:text-grey-400 leading-tight text-center">
                Custom
            </span>
            <input
                ref={inputRef}
                type="color"
                value={customColor || "#ff4208"}
                onChange={(e) => onColorChange(e.target.value)}
                className="absolute opacity-0 w-0 h-0 pointer-events-none"
                aria-hidden="true"
                tabIndex={-1}
            />
        </button>
    );
}

// ── Palette grid ──────────────────────────────────────────────────────────────

function PaletteGrid({ activePalette, customColor, onSelect, onCustomColor }) {
    const predefined = PALETTES.filter((p) => p.id !== "custom" && p.colors !== null);
    const customEntry = PALETTES.find((p) => p.id === "custom");

    return (
        <div className="relative">
            <div className="max-h-64 overflow-y-auto hide-scrollbar -mr-1 pr-1">
                <div className="grid grid-cols-4 gap-x-1 gap-y-2 sm:grid-cols-5">
                    {predefined.map((palette) => (
                        <PaletteSwatch
                            key={palette.id}
                            palette={palette}
                            active={activePalette === palette.id}
                            onSelect={onSelect}
                        />
                    ))}
                    {customEntry && (
                        <CustomSwatch
                            active={activePalette === "custom"}
                            customColor={customColor}
                            onColorChange={(hex) => {
                                onCustomColor(hex);
                                onSelect("custom");
                            }}
                        />
                    )}
                </div>
            </div>
            {/* Scroll-fade mask — tells user there are more palettes below */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[var(--bg-surface-2)] to-transparent" />
        </div>
    );
}

// ── Active palette footer ─────────────────────────────────────────────────────

function ActivePaletteInfo({ activePalette, customColor }) {
    const entry = PALETTES.find((p) => p.id === activePalette);
    if (!entry) return null;

    const colors =
        activePalette === "custom" && customColor
            ? generateCustomColors(customColor)
            : entry.colors;

    if (!colors) return null;

    return (
        <div className="flex items-center gap-2 mt-3 px-1">
            <div className="flex gap-0.5">
                {[colors.primary, colors.secondary, colors.blue, colors.turquoise, colors.yellow].map((c, i) => (
                    <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                ))}
            </div>
            <span className="text-xs text-grey-500 dark:text-grey-400 font-aumovio">
                {entry.name}
                {activePalette === "custom" && customColor && (
                    <span className="ml-1.5 font-mono text-grey-400 dark:text-grey-500">
                        {customColor.toUpperCase()}
                    </span>
                )}
            </span>
        </div>
    );
}

// ── Main modal ────────────────────────────────────────────────────────────────

/**
 * @param {{ open: boolean, onClose: () => void }} props
 */
export default function PersonalizeModal({ open, onClose }) {
    const { mode, setMode, transparency, setTransparency, palette, setPalette, customColor, setCustomColor } =
        usePersonalize();

    return (
        <Modal open={open} onClose={onClose} size="md">
            {/* Custom header — negative margins break out of Modal's px-6 py-5 body wrapper */}
            <div className="-mx-6 -mt-5 px-6 py-4 border-b border-grey-200 dark:border-grey-700 mb-5">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-400/10 flex items-center justify-center">
                        <PaintBrushIcon className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                        <h2 className="text-base font-aumovio-bold text-black/85 dark:text-white/90">Personalize</h2>
                        <p className="text-[11px] text-grey-400 dark:text-grey-500">Appearance &amp; accent colours</p>
                    </div>
                </div>
            </div>

            <div className="space-y-0">
                {/* 1 — Mode */}
                <div>
                    <SectionLabel>Choose your mode</SectionLabel>
                    <ModeSelector mode={mode} setMode={setMode} />
                </div>

                <Divider />

                {/* 2 — Transparency */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-aumovio text-black/80 dark:text-white/80">Transparency effects</p>
                        <p className="text-xs text-grey-400 dark:text-grey-500 mt-0.5">
                            Blur and frosted glass on surfaces
                        </p>
                    </div>
                    <Toggle checked={transparency} onChange={setTransparency} size="md" color="orange" />
                </div>

                <Divider />

                {/* 3 — Accent colour */}
                <div>
                    <SectionLabel>Accent colour</SectionLabel>
                    <PaletteGrid
                        activePalette={palette}
                        customColor={customColor}
                        onSelect={setPalette}
                        onCustomColor={setCustomColor}
                    />
                    <ActivePaletteInfo activePalette={palette} customColor={customColor} />
                </div>
            </div>
        </Modal>
    );
}
