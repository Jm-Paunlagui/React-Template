# Task: Verify & Complete Named Palette Theme Integration (Navbar, Sidebar, Light Tint, Dark Mode)

## Context

The PALETTES constant has been updated. Every named palette now carries eight
colour keys: `primary`, `secondary`, `blue`, `turquoise`, `yellow`,
`darkSurface`, `darkText`, `darkMuted`. A prior task wired the three dark keys
into the theme system via CSS custom properties.

This task has **three objectives**:

1. **Verify** the dark mode integration works everywhere — especially Navbar and
   Sidebar, which are the most visible persistent surfaces.
2. **Fix** any remaining hardcoded brand dark colours that override named palette
   dark values.
3. **Add light-mode tinting** — named palettes should NOT default to a plain
   white background. Instead, derive a very light tint (equivalent to
   Tailwind's `-50` shade) from the palette's `primary` colour and use it as
   the light-mode surface/background.

---

## Objective 1 — Full Dark Mode Verification

### 1.1 Global surfaces

Verify that when a named palette is selected AND dark mode is active, the
following CSS custom properties are being consumed (not overridden by hardcoded
brand values):

| Element                  | Expected dark background       | Expected dark text          | Expected dark muted/border     |
|--------------------------|--------------------------------|-----------------------------|--------------------------------|
| `<body>` / root layout   | `var(--color-dark-surface)`    | `var(--color-dark-text)`    | —                              |
| Card / Panel surfaces    | `var(--color-dark-surface)`    | `var(--color-dark-text)`    | `var(--color-dark-muted)`      |
| Modal backdrop content   | `var(--color-dark-surface)`    | `var(--color-dark-text)`    | `var(--color-dark-muted)`      |
| Drawer content           | `var(--color-dark-surface)`    | `var(--color-dark-text)`    | `var(--color-dark-muted)`      |
| Table rows               | `var(--color-dark-surface)`    | `var(--color-dark-text)`    | `var(--color-dark-muted)`      |
| Form input backgrounds   | slightly lighter than surface  | `var(--color-dark-text)`    | `var(--color-dark-muted)`      |
| Tooltip / Popover        | `var(--color-dark-surface)`    | `var(--color-dark-text)`    | —                              |

### 1.2 Navbar verification

The Navbar is a persistent top-level surface. Verify:

- [ ] Dark mode background uses `var(--color-dark-surface)` or a derived
      elevation variant (e.g. 4% lighter than `darkSurface`) — NOT hardcoded
      `#1a1030` or any brand-specific hex.
- [ ] Navbar text (logo text, nav links, greeting) uses `var(--color-dark-text)`
      — NOT hardcoded `white` or `white/85`.
- [ ] Navbar icons and secondary labels use `var(--color-dark-muted)` — NOT
      `white/60`.
- [ ] Active nav link indicator uses the palette's `primary` colour (this
      should already work — just verify it hasn't been overridden).
- [ ] Navbar border-bottom / divider (if any) uses `var(--color-dark-muted)`
      with low opacity — NOT `border-white/10`.
- [ ] Hover states on nav items use `var(--color-dark-muted)` at ~10-15%
      opacity as background — NOT a hardcoded `hover:bg-white/5`.
- [ ] User avatar ring / notification badge colours still use palette `primary`
      in dark mode.
- [ ] Search input (if present in navbar) — background slightly elevated from
      `darkSurface`, placeholder text uses `darkMuted`, typed text uses
      `darkText`.

### 1.3 Sidebar verification

The Sidebar is the persistent left-hand navigation. Verify:

- [ ] Dark mode background uses `var(--color-dark-surface)` — NOT hardcoded
      brand dark.
- [ ] Sidebar section headers / group labels use `var(--color-dark-muted)`.
- [ ] Sidebar nav item text uses `var(--color-dark-text)`.
- [ ] Active sidebar item has a background tint of palette `primary` at ~10-15%
      opacity, with text in palette `primary` — NOT hardcoded orange/purple.
- [ ] Hover state on sidebar items uses `var(--color-dark-muted)` at ~10%
      opacity.
- [ ] Sidebar dividers / separators use `var(--color-dark-muted)` at ~20%
      opacity.
- [ ] Sidebar collapse/expand icon uses `var(--color-dark-muted)`, hover
      brightens to `var(--color-dark-text)`.
- [ ] Sidebar footer (if any — user info, logout) follows the same pattern.
- [ ] Mobile `BottomNav` equivalent follows the same `darkSurface` / `darkText`
      / `darkMuted` mapping.

### 1.4 Hardcoded hex sweep

Run a full search across `src/` for any remaining hardcoded dark-mode colours
that should now be palette-aware. Search for ALL of these patterns and replace
with CSS variable equivalents:

```bash
# Hardcoded dark surfaces (brand-specific)
grep -rn "dark:bg-\[#1a1030\]"         src/
grep -rn "dark:bg-\[#1e1235\]"         src/
grep -rn "dark:bg-\[#231538\]"         src/
grep -rn "dark:bg-\[#2a1840\]"         src/

# Hardcoded dark text
grep -rn "dark:text-white/85"          src/
grep -rn "dark:text-white/80"          src/
grep -rn "dark:text-white/70"          src/
grep -rn "dark:text-white/60"          src/
grep -rn "dark:text-white/50"          src/
grep -rn "dark:text-white/40"          src/

# Hardcoded dark borders
grep -rn "dark:border-white/10"        src/
grep -rn "dark:border-white/5"         src/
grep -rn "dark:border-white/15"        src/
grep -rn "dark:border-white/20"        src/

# Hardcoded dark hover states
grep -rn "dark:hover:bg-white/5"       src/
grep -rn "dark:hover:bg-white/10"      src/

# Hardcoded dark ring/outline
grep -rn "dark:ring-white/10"          src/
grep -rn "dark:ring-white/20"          src/

# Any other hardcoded dark hex that looks brand-specific
grep -rn "dark:bg-\[#"                 src/
grep -rn "dark:text-\[#"              src/
grep -rn "dark:border-\[#"            src/
```

**Replacement mapping:**

| Hardcoded pattern                  | Replace with                                       |
|------------------------------------|----------------------------------------------------|
| `dark:bg-[#1a1030]`               | `dark:bg-[var(--color-dark-surface)]`              |
| `dark:bg-[#231538]` (elevated)    | `dark:bg-[var(--color-dark-surface-elevated)]`     |
| `dark:text-white/85`              | `dark:text-[var(--color-dark-text)]`               |
| `dark:text-white/60`              | `dark:text-[var(--color-dark-muted)]`              |
| `dark:text-white/40`              | `dark:text-[var(--color-dark-muted)]/60`           |
| `dark:border-white/10`            | `dark:border-[var(--color-dark-muted)]/30`         |
| `dark:hover:bg-white/5`           | `dark:hover:bg-[var(--color-dark-muted)]/10`       |
| `dark:ring-white/10`              | `dark:ring-[var(--color-dark-muted)]/30`           |

> If elevated surfaces are needed (navbar, sidebar, cards that float above the
> base), derive `--color-dark-surface-elevated` by lightening `darkSurface` by
> 4-8% luminance in the palette application logic.

---

## Objective 2 — Light Mode Tinting for Named Palettes

### The problem

Named palettes currently default to a plain white (`#ffffff`) background in
light mode, making them feel generic. Brand palettes have their own warm/cool
white — named palettes should too.

### The solution — derive a `-50` tint from `primary`

For every named palette, when light mode is active, generate a very light tint
of the `primary` colour (equivalent to Tailwind's `color-50` shade) and use it
as the light-mode surface background.

#### Tint generation algorithm

```js
/**
 * Generate a Tailwind-50-equivalent tint from any hex colour.
 * Takes the hue and a hint of saturation from the source,
 * then pushes lightness to 96-98%.
 *
 * @param   {string} hex — the palette's primary colour, e.g. "#434645"
 * @returns {string}     — a very light hex, e.g. "#f5f6f5"
 */
function generateTint50(hex) {
    // 1. Convert hex → HSL
    // 2. Set saturation to max(original_saturation * 0.35, 5%)
    //    — keeps a whisper of colour, doesn't go grey
    // 3. Set lightness to 97%
    //    — equivalent to Tailwind's -50 band
    // 4. Convert HSL → hex
    // 5. Return the hex string
}
```

#### Where to apply

In the **palette application logic** (the same function that sets
`--color-dark-surface` etc.), when dark mode is OFF and a named palette is
active, compute and set:

| CSS Custom Property          | Value                        | Purpose                              |
|------------------------------|------------------------------|--------------------------------------|
| `--color-light-surface`      | `generateTint50(primary)`    | Page background, card backgrounds    |
| `--color-light-surface-alt`  | `generateTint30(primary)`    | Alternating table rows, subtle zones |

> `generateTint30` uses lightness 98.5% — even lighter, for subtle zebra
> striping or secondary surface areas.

#### What changes in components

| Element                    | Before (light mode)              | After (light mode)                         |
|----------------------------|----------------------------------|--------------------------------------------|
| `<body>` / root layout     | `bg-white`                       | `bg-[var(--color-light-surface)]`          |
| Card / Panel               | `bg-white`                       | `bg-[var(--color-light-surface)]`          |
| Navbar background           | `bg-white`                       | `bg-[var(--color-light-surface)]`          |
| Sidebar background          | `bg-white` or `bg-gray-50`       | `bg-[var(--color-light-surface)]`          |
| Table alternating rows      | `bg-gray-50`                     | `bg-[var(--color-light-surface-alt)]`      |
| Modal content               | `bg-white`                       | `bg-[var(--color-light-surface)]`          |
| Drawer content              | `bg-white`                       | `bg-[var(--color-light-surface)]`          |
| Dropdown menu               | `bg-white`                       | `bg-[var(--color-light-surface)]`          |

**Important exceptions — keep `bg-white`:**

- Form `<input>`, `<select>`, `<textarea>` backgrounds — white ensures maximum
  readability and feels standard in forms
- Tooltip content — white for maximum contrast
- Toast/notification backgrounds — keep semantic (`success-50`, `danger-50`, etc.)

#### Brand palette behaviour

Brand palettes (`aumovio-orange`, `aumovio-purple`) should **NOT** get the
tint treatment — they should keep their current light-mode behaviour exactly.
Only named palettes (any palette that has a non-null `colors` object AND is
not a brand palette) get the generated tint.

Detection logic:

```js
const isBrandPalette = ["aumovio-orange", "aumovio-purple"].includes(palette.id);
const isCustomPalette = palette.colors === null;
const isNamedPalette = !isBrandPalette && !isCustomPalette;

if (isNamedPalette && !isDark) {
    // Apply generateTint50(palette.colors.primary) as --color-light-surface
}
```

#### Visual examples of expected tints

| Palette          | Primary     | Expected tint-50    | Feels like             |
|------------------|-------------|---------------------|------------------------|
| Skydive          | `#434645`   | `#f4f5f5`           | Cool grey whisper      |
| Bloodlust        | `#3b080f`   | `#faf3f4`           | Barely-there blush     |
| Crybaby          | `#ade4eb`   | `#f2fbfc`           | Ice blue hint          |
| Eternity         | `#fdf8ff`   | `#fefcff`           | Lavender mist          |
| High Standards   | `#ae8d30`   | `#fbf9f2`           | Warm parchment         |
| Cheap Motel      | `#ff0066`   | `#fff2f6`           | Hot pink ghost         |
| Corporate        | `#455a64`   | `#f3f5f6`           | Slate whisper          |
| Past Times       | `#dab123`   | `#fdfbf2`           | Golden cream           |
| Wave             | `#cbdcd6`   | `#f8fcfa`           | Sea foam breath        |
| Calm             | `#795138`   | `#f9f6f4`           | Warm linen             |

---

## Objective 3 — Navbar & Sidebar Specific Fixes

### 3.1 Navbar — light mode with tint

- [ ] Navbar background uses `var(--color-light-surface)` — NOT `bg-white`.
- [ ] If the navbar has a bottom border, it should use palette `primary` at 8%
      opacity: `border-[var(--color-primary)]/8` — gives the tint a subtle
      branded divider instead of generic `border-gray-200`.
- [ ] Logo / brand mark area can keep its own colours — don't tint the logo.
- [ ] Nav link hover state: `hover:bg-[var(--color-primary)]/5` — a whisper of
      the palette's primary, not generic `hover:bg-gray-100`.
- [ ] Active nav link: text in palette `primary`, bottom indicator or
      background pill in palette `primary` at 10% opacity.

### 3.2 Sidebar — light mode with tint

- [ ] Sidebar background uses `var(--color-light-surface)` — NOT `bg-white`
      or `bg-gray-50`.
- [ ] Sidebar active item: background in palette `primary` at 8-10% opacity,
      text in palette `primary`. Left border accent (if present) in palette
      `primary`.
- [ ] Sidebar hover state: `hover:bg-[var(--color-primary)]/5`.
- [ ] Section headers / group labels: use palette `primary` at 60% opacity or
      palette `darkMuted` — whichever gives better contrast on the tinted
      surface. Test with a palette that has a very light primary (e.g.
      "Broken" `#f0faff`) — the label must still be readable.
- [ ] Sidebar collapse state (icon-only rail): background still uses
      `var(--color-light-surface)`, tooltip on hover shows nav item label.

### 3.3 Navbar — dark mode (from Objective 1)

- [ ] All verifications from §1.2 pass.
- [ ] Specifically: switching between "Corporate" (cool) and "Calm" (warm)
      in dark mode produces visibly different navbar tones — proves the
      palette's `darkSurface` is actually being applied, not a shared fallback.

### 3.4 Sidebar — dark mode (from Objective 1)

- [ ] All verifications from §1.3 pass.
- [ ] Same cross-palette visual difference test as navbar.

---

## Implementation Checklist

### Phase 1 — Palette application logic

- [ ] `generateTint50(hex)` utility function written with HSL conversion
- [ ] `generateTint30(hex)` utility function written (lighter variant)
- [ ] Palette application function sets `--color-light-surface` and
      `--color-light-surface-alt` for named palettes in light mode
- [ ] Palette application function sets `--color-dark-surface-elevated`
      (4-8% lighter than `darkSurface`) for elevated surfaces
- [ ] Brand palettes bypass tint generation — existing behaviour preserved
- [ ] Custom palette (`colors: null`) handled gracefully — no crash

### Phase 2 — CSS variable consumption

- [ ] All hardcoded dark hex values replaced (full grep sweep from §1.4)
- [ ] All `bg-white` on layout surfaces replaced with
      `bg-[var(--color-light-surface)]` (except form inputs, tooltips, toasts)
- [ ] All `bg-gray-50` on alternating/secondary surfaces replaced with
      `bg-[var(--color-light-surface-alt)]`
- [ ] `pre-set-styles.jsx` (if it defines shared dark/light classes) updated

### Phase 3 — Navbar

- [ ] Light mode: tinted background, branded hover/active states
- [ ] Dark mode: palette `darkSurface` background, `darkText` text, `darkMuted`
      secondary elements
- [ ] Transition between light ↔ dark is smooth (no flash of wrong colour)

### Phase 4 — Sidebar

- [ ] Light mode: tinted background, branded hover/active states
- [ ] Dark mode: palette `darkSurface` background, `darkText` / `darkMuted`
- [ ] Collapsed/expanded states both use correct palette colours
- [ ] Mobile BottomNav mirrors the same palette awareness

### Phase 5 — Cross-palette visual smoke test

Test each of these palettes in BOTH light and dark mode. These were chosen to
cover the full hue/luminance spectrum:

| Palette         | Why it's a good test case                                |
|-----------------|----------------------------------------------------------|
| Skydive         | Very dark primary — tint-50 should be barely-there grey  |
| Calm            | Very light/warm existing colours — tint must not vanish  |
| Broken          | All-light palette — dark mode is the real test           |
| Bloodlust       | Deep red — tint should be blush, not pink                |
| Corporate       | Neutral cool — should feel professional, not colourless  |
| Fighting On     | Vivid purple — tint should be lavender, not garish       |
| Cheap Motel     | Hot pink primary — tint must stay subtle                 |
| Crybaby         | Cyan/blue — dark mode should feel oceanic, not brand     |
| Eternity        | Near-white primary — tint-50 is almost invisible (OK)    |
| Wildfire        | Teal primary — tint should be minty, not green           |

For each palette, verify:

- [ ] Light mode: background has a visible but subtle tint, not plain white
- [ ] Light mode: text is fully readable on the tinted surface
- [ ] Dark mode: surfaces, text, and muted elements use the palette's own
      dark colours — NOT brand purple/orange dark values
- [ ] Switching palettes updates ALL surfaces immediately (no stale areas)
- [ ] Toggling dark mode updates ALL surfaces immediately
- [ ] Navbar and Sidebar are visually consistent with the rest of the page

---

## Acceptance Criteria (all must pass)

### Dark mode

- [ ] Named palette dark mode uses `darkSurface`, `darkText`, `darkMuted` from
      the palette — not brand defaults
- [ ] Brand palette dark mode is unchanged — regression-free
- [ ] Navbar dark background changes visibly when switching between palettes
      with different `darkSurface` values
- [ ] Sidebar dark background changes visibly when switching between palettes
- [ ] No hardcoded `dark:bg-[#1a1030]` or `dark:text-white/*` remains in
      palette-aware components
- [ ] All dark text maintains ≥ 7:1 contrast ratio against dark surface (AAA)

### Light mode tinting

- [ ] Named palette light mode surfaces show a tint-50 of the palette's primary
      — not plain white
- [ ] Brand palettes keep their existing light mode — no tint applied
- [ ] Custom palette (`colors: null`) does not crash — falls back to white
- [ ] Form inputs remain `bg-white` — not tinted
- [ ] Tint is subtle enough that body text (dark text on tinted surface)
      maintains ≥ 10:1 contrast ratio
- [ ] Alternating table rows use the even-lighter `tint-30` variant

### Navbar & Sidebar

- [ ] Navbar light mode: tinted background, palette-branded hover/active
- [ ] Navbar dark mode: `darkSurface` background, `darkText`, `darkMuted`
- [ ] Sidebar light mode: tinted background, palette-branded active item
- [ ] Sidebar dark mode: `darkSurface` background, `darkText`, `darkMuted`
- [ ] Mobile BottomNav follows the same palette mapping
- [ ] No visual flash when toggling dark mode or switching palettes

### Architecture

- [ ] `generateTint50` is a pure utility function (no side effects)
- [ ] Palette detection logic uses ID check, not colour value comparison
- [ ] All new CSS variables are set in one place (the palette application
      function) — not scattered across components
- [ ] No new npm dependencies added

---

## Do NOT

- Change any colour values in the PALETTES array — they are finalised
- Remove or reorder palette entries
- Change palette ID strings (they are persisted in localStorage)
- Break brand palette behaviour in either light or dark mode
- Tint form input backgrounds — keep them white
- Add any new npm packages
- Refactor component architecture — this is a theming pass only
