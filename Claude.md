# CLAUDE.md — Aumovio UI Component Usage Guide

> **Persona:** Senior React + Tailwind CSS v4 Developer with design-system expertise.
> Every feature use component library — never inline ad-hoc markup when component exists.

---

## 1. Quick Reference: Component Map

| Need                     | Component               | Import path                           |
| ------------------------ | ----------------------- | ------------------------------------- |
| Alert / feedback message | `Alert`                 | `components/ui/Alert`                 |
| Avatar / initials        | `Avatar`, `AvatarGroup` | `components/ui/Avatar`                |
| Badge / status pill      | `Badge`                 | `components/ui/Badge`                 |
| Top announcement bar     | `Banner`                | `components/ui/Banner`                |
| Mobile bottom nav        | `BottomNav`             | `components/layout/BottomNav`         |
| Page breadcrumbs         | `Breadcrumb`            | `components/ui/Breadcrumb`            |
| Primary action           | `Button`                | `components/ui/Button`                |
| Attached button set      | `ButtonGroup`           | `components/ui/ButtonGroup`           |
| Content container        | `Card`                  | `components/ui/Card`                  |
| Image slider             | `Carousel`              | `components/ui/Carousel`              |
| Chat message             | `ChatBubble`            | `components/ui/ChatBubble`            |
| Copy-to-clipboard        | `Clipboard`             | `components/ui/Clipboard`             |
| Date picker              | `Datepicker`            | `components/ui/Datepicker`            |
| Device frame             | `DeviceMockup`          | `components/ui/DeviceMockup`          |
| Side panel               | `Drawer`                | `components/ui/Drawer`                |
| Contextual menu          | `Dropdown`              | `components/ui/Dropdown`              |
| Image grid + lightbox    | `Gallery`               | `components/ui/Gallery`               |
| Notification overlay     | `Indicator`             | `components/ui/Indicator`             |
| Hero / CTA section       | `Jumbotron`             | `components/ui/Jumbotron`             |
| Keyboard shortcut        | `KBD`                   | `components/ui/KBD`                   |
| Bordered list            | `ListGroup`             | `components/ui/ListGroup`             |
| Dialog overlay           | `Modal`                 | `components/ui/Modal`                 |
| Page number nav          | `Pagination`            | `components/ui/Pagination`            |
| Floating info panel      | `Popover`               | `components/ui/Popover`               |
| Progress bar / ring      | `Progress`              | `components/ui/Progress`              |
| QR code                  | `QRCode`                | `components/ui/QRCode`                |
| Star rating              | `Rating`                | `components/ui/Rating`                |
| Loading skeleton         | `Skeleton`              | `components/ui/Skeleton`              |
| FAB with sub-actions     | `SpeedDial`             | `components/ui/SpeedDial`             |
| Loading spinner          | `Spinner`               | `components/ui/Spinner`               |
| Multi-step progress      | `Stepper`               | `components/ui/Stepper`               |
| Data table               | `Table`                 | `components/ui/Table`                 |
| Tab navigation           | `Tabs`                  | `components/ui/Tabs`                  |
| Theme toggle button      | `ThemeToggle`           | `components/ui/ThemeToggle`           |
| Chronological events     | `Timeline`              | `components/ui/Timeline`              |
| Hover label              | `Tooltip`               | `components/ui/Tooltip`               |
| **Forms**                |                         |                                       |
| Checkbox                 | `Checkbox`              | `components/forms/Checkbox`           |
| File upload              | `FileInput`             | `components/forms/FileInput`          |
| Floating-label input     | `FloatingLabel`         | `components/forms/FloatingLabel`      |
| Number stepper           | `NumberInput`           | `components/forms/NumberInput`        |
| Phone + country code     | `PhoneInput`            | `components/forms/PhoneInput`         |
| Radio group              | `Radio`                 | `components/forms/Radio`              |
| Slider                   | `Range`                 | `components/forms/Range`              |
| Dropdown select          | `Select`                | `components/forms/Select`             |
| **Text / search**        |                         |                                       |
| Text input               | `Input`                 | `components/forms/Input`              |
| Debounced search         | `SearchInput`           | `components/forms/SearchInput`        |
| Search bar (UI only)     | `SearchBar`             | `components/ui/SearchBar`             |
| Multi-line input         | `Textarea`              | `components/forms/Textarea`           |
| Time picker              | `Timepicker`            | `components/forms/Timepicker`         |
| Toggle switch            | `Toggle`                | `components/forms/Toggle`             |
| **Typography**           |                         |                                       |
| Headings H1-H6           | `Heading`, `H1`…`H6`    | `components/ui/typography/Heading`    |
| Body text                | `Paragraph`             | `components/ui/typography/Paragraph`  |
| Pull quote               | `Blockquote`            | `components/ui/typography/Blockquote` |
| Responsive image         | `Image`                 | `components/ui/typography/Image`      |
| Bullet / ordered list    | `List`                  | `components/ui/typography/List`       |
| Styled anchor            | `Link`                  | `components/ui/typography/Link`       |
| Inline text variants     | `Text`                  | `components/ui/typography/Text`       |
| Horizontal rule          | `Divider`               | `components/ui/typography/Divider`    |
| **Charts (ApexCharts)**  |                         |                                       |
| Line                     | `LineChart`             | `components/charts/LineChart`         |
| Bar                      | `BarChart`              | `components/charts/BarChart`          |
| Area                     | `AreaChart`             | `components/charts/AreaChart`         |
| Donut / Pie              | `DonutChart`            | `components/charts/DonutChart`        |
| Radial bar               | `RadialChart`           | `components/charts/RadialChart`       |
| Heatmap                  | `HeatmapChart`          | `components/charts/HeatmapChart`      |
| Scatter                  | `ScatterChart`          | `components/charts/ScatterChart`      |
| **Layout / routing**     |                         |                                       |
| Auth guard               | `ProtectedRoute`        | `components/routing/ProtectedRoute`   |
| Error catch              | `ErrorBoundary`         | `components/feedback/ErrorBoundary`   |
| Loading indicator        | `LoadingSpinner`        | `components/feedback/LoadingSpinner`  |
| Toast utilities          | `toast`                 | `components/ui/toast.utils`           |

---

## 2. Design Tokens (Tailwind v4 `@theme`)

All colours, spacing, shadow values defined in `src/assets/styles/index.css`.

### Colour hierarchy

```
Primary   → orange-400  (#FF4208)   60 % of colour usage — CTAs, active states
Secondary → purple-400  (#4827AF)   30 % — accents, gradients
Blue      → blue-400    (#18A9E7)   Info / links
Success   → success-400 (#32CB70)
Danger    → danger-400  (#D82822)
Warn      → warn-400    (#FFD600)
Grey      → grey-50…950             Neutral surfaces, text
```

All token names available as standard Tailwind utilities:
`bg-orange-400`, `text-purple-400`, `border-success-400/30`, etc.

### Dark mode

Dark mode controlled by `data-theme="dark"` on `<html>`. Use `dark:` prefix:

```jsx
<div className="bg-white dark:bg-[#1a1030] text-black/85 dark:text-white/85" />
```

---

## 3. Feature Development Workflow

### Step 1 — API layer (`feature.api.js`)

HTTP calls only. No state, no React. Returns raw Axios response.

```js
export const widgetApi = {
    list: () => httpClient.get("widgets"),
    create: (data) => httpClient.post("widgets", data),
    update: (id, data) => httpClient.put(`widgets/${id}`, data),
    delete: (id) => httpClient.delete(`widgets/${id}`),
};
```

### Step 2 — Hook (`feature.hook.js`)

Business logic, state, toasts, navigation. Imports `feature.api.js`.

```js
import { widgetApi } from "./widget.api";
import { toast } from "../../components/ui/toast.utils";

export const useWidget = () => {
    const [loading, setLoading] = useState(false);

    const createWidget = async (data) => {
        setLoading(true);
        try {
            const res = await widgetApi.create(data);
            toast.success(res.data?.message || "Widget created");
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { loading, createWidget };
};
```

### Step 3 — View (`Feature.view.jsx`)

Presentation only. Imports hook + components. Never imports API directly.

```jsx
import { useWidget } from "./widget.hook";
import Button from "../../components/ui/Button";
import { Table } from "../../components/ui/Table";
import { Modal } from "../../components/ui/Modal";
```

---

## 4. Component Usage Patterns

### 4.1 Forms

Always compose form from typed form components. Never write raw `<input>` unless rendering on dark background where white `Input` surface clashes (apply same design tokens manually as shown in `Login.view.jsx`).

```jsx
// Standard light-background form
<Input
  label="Email"
  name="email"
  type="email"
  value={form.email}
  onChange={handleChange}
  error={errors.email}
  required
/>

<Select
  label="Role"
  options={roleOptions}
  value={form.role}
  onChange={(v) => setForm(f => ({ ...f, role: v }))}
  error={errors.role}
/>

<Toggle
  label="Send notifications"
  checked={form.notify}
  onChange={(v) => setForm(f => ({ ...f, notify: v }))}
/>

<Button type="submit" loading={loading} fullWidth>
  Save Changes
</Button>
```

### 4.2 Feedback

```jsx
// Inline feedback
<Alert variant="success" title="Saved!" dismissible>
    Your changes have been applied.
</Alert>;

// Toast (side-effect, anywhere)
import { toast } from "../../components/ui/toast.utils";
toast.success("Record created");
toast.error("Something went wrong");
toast.promise(apiCall(), {
    loading: "Saving…",
    success: "Saved!",
    error: "Failed",
});
```

### 4.3 Data display

```jsx
<Table
  columns={columns}
  data={rows}
  loading={loading}
  selectable
  selectedIds={selected}
  onSelect={(id, checked) => /* … */}
  sortKey={sortKey}
  sortDir={sortDir}
  onSort={setSort}
  striped
/>

// Wrap Table with Pagination
<Pagination
  page={page}
  totalPages={totalPages}
  onChange={setPage}
/>
```

### 4.4 Modals & Drawers

```jsx
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open</Button>

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Confirm Delete"
  variant="danger"
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="danger" loading={loading} onClick={handleDelete}>Delete</Button>
    </>
  }
>
  Are you sure you want to delete this record? This action cannot be undone.
</Modal>
```

### 4.5 Empty / loading states

```jsx
{
    loading ? <Skeleton variant="list" lines={5} /> : data.length === 0 ? <div className="text-center py-16 text-grey-400">No records found.</div> : <ListGroup items={data} selectable />;
}
```

### 4.6 Charts

```jsx
import { BarChart } from '../../components/charts/BarChart';
import { DonutChart } from '../../components/charts/DonutChart';

<BarChart
  title="Monthly Revenue"
  categories={['Jan','Feb','Mar']}
  series={[{ name: 'Revenue', data: [12000, 18000, 15000] }]}
  height={280}
/>

<DonutChart
  labels={['Organic', 'Direct', 'Social']}
  series={[42, 28, 30]}
  height={250}
/>
```

---

## 5. Security: CWE & CVE Hardening Guidelines

Rules apply to **every feature** in this codebase.

### 5.1 Authentication & Session (CWE-287, CWE-384)

- JWT tokens stored **only in HTTP-only cookies** (set by server).
  Never store tokens in `localStorage`, `sessionStorage`, or React state.
- CSRF token lives **in memory only** (`CsrfMiddleware._token`).
  Never written to localStorage or non-HTTP-only cookie.
- Call `AuthMiddleware.signout()` on logout — removes token cookie **and** clears localStorage user data.
- `ProtectedRoute` re-verifies token on every mount — don't cache role checks across navigations at component level.

### 5.2 Cross-Site Request Forgery (CWE-352)

- `HttpClient` auto-injects `x-csrf-token` on every mutating request (POST, PUT, PATCH, DELETE). **Never bypass this interceptor** by importing Axios directly.
- On 403 with `CSRF_TOKEN_INVALID`, interceptor retries once after `CsrfMiddleware.forceRefresh()`. No manual handling needed.

### 5.3 Cross-Site Scripting (CWE-79)

- React JSX escapes all interpolated strings. **Never use `dangerouslySetInnerHTML`** unless content sanitised with DOMPurify first.
- User-supplied values in `href` must validate to start with `https://` or `/` — never `javascript:`.

```jsx
// ⚠ Dangerous
<a href={user.url}>Visit</a>;

// ✅ Safe
const safeHref = /^(https?:\/\/|\/)/.test(user.url) ? user.url : "#";
<a href={safeHref}>Visit</a>;
```

### 5.4 Sensitive Data Exposure (CWE-200, CWE-312)

- Never log tokens, passwords, or PII to console in any environment. Remove all `console.log(token)` before committing.
- Mask emails and sensitive values in UI using `maskEmail()` from `src/utils/formatters.js`.
- New `localStorage` writes: never store raw tokens, passwords, or full PII — store only non-sensitive identifiers.

### 5.5 Input Validation (CWE-20)

- Validate on both client **and** server. Client validation is UX only.
- Use helpers in `src/utils/validators.js`:

```js
import { isValidEmail, isStrongPassword, isNonEmpty, validateRequired } from "../../utils/validators";

const { valid, missing } = validateRequired(form, ["username", "email", "password"]);
if (!valid) {
    /* … */
}
if (!isValidEmail(form.email)) {
    /* … */
}
if (!isStrongPassword(form.password)) {
    /* … */
}
```

### 5.6 Error Handling — Information Leakage (CWE-209)

- Production builds show only generic messages to user. Full error details go to server log, not UI.

```jsx
// ⚠ Exposes stack trace
<p>{err.stack}</p>

// ✅ Safe
<Alert variant="danger">Something went wrong. Please try again.</Alert>
```

- Wrap every view in `ErrorBoundary` to catch unexpected render errors:

```jsx
<ErrorBoundary>
    <MyFeatureView />
</ErrorBoundary>
```

### 5.7 Dependency Security (CVE hygiene)

- Run `npm audit` before every release. Address critical/high severity advisories.
- Pin exact versions for security-sensitive packages (auth, crypto, HTTP).
- Never commit `.env` files — all secrets in environment variables injected at build time via Vite (`VITE_*`).

### 5.8 Content Security Policy (CSP)

Configure web server or CDN to send:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' <your-api-origin>;
  frame-ancestors 'none';
```

`frame-ancestors 'none'` mitigates clickjacking (CWE-1021).

### 5.9 Secure HTTP Headers

Server must send:

```
X-Content-Type-Options: nosniff           # CWE-430
X-Frame-Options: DENY                    # CWE-1021
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=(), microphone=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### 5.10 Race Conditions & State (CWE-362)

- Always set `cancelled` flag in `useEffect` async functions and check before calling `setState`. See `ProtectedRoute.jsx` for reference pattern.
- `useRequest` hook deduplicates in-flight requests at module scope — use instead of raw `useEffect` + fetch for data loading.

---

## 6. Routing & Access Control

```jsx
// App.jsx role constants — must match T_EMP_MGMT_ADMIN.EMP_ROLE strings in the DB
const ROLES = {
    ROBOT: "ROBOT",
    USER: "USER",
    ADMIN: "ADMIN",
    SUPER_ADMIN: "SUPER_ADMIN",
    VIEWER: "VIEWER",
    APPROVER: "APPROVER",
};

// Role-only guard
<Route element={<ProtectedRoute role={[ROLES.USER, ROLES.ADMIN, ROLES.VIEWER, ROLES.APPROVER]} />}>
  <Route path="dashboard" element={<DashboardView />} />
</Route>

// Role + fine-grained permission
<Route element={
  <ProtectedRoute
    role={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}
    check={(user) => user.area?.includes('FINANCE')}
  />
}>
  <Route path="finance" element={<FinanceView />} />
</Route>
```

Permission strings (`area` values) defined **inline at each route** in `App.jsx`, not in shared constant — keeps access control readable and co-located with route.

---

## 7. State Management Guidelines

| Data type                  | Solution                                        |
| -------------------------- | ----------------------------------------------- |
| Server data with caching   | `useRequest` hook                               |
| Auth state                 | `AuthMiddleware.isAuth()` (cached 5 min)        |
| UI / local component state | `useState` / `useReducer`                       |
| Cross-component UI state   | React context (`LayoutContext`, `ThemeContext`) |
| Form state                 | Local `useState` object                         |
| Global server mutations    | `useCallback` inside feature hook               |

Never use external state managers (Redux, Zustand, etc.) unless explicitly required — existing patterns cover all standard cases.

---

## 8. Performance Guidelines

### Code splitting — lazy-load views only

```jsx
const FinanceView = lazy(() => import("./features/finance/Finance.view"));
// ⚠ Never lazy-load shared UI components
```

### Data fetching — use `useRequest`

```js
const { data: users, loading, refetch } = useRequest("users/list", () => httpClient.get("users").then((r) => r.data), { staleTime: 60_000 });
```

### Memoisation — only where measurable

```jsx
// Large pure list components
export const DataTable = memo(({ rows, columns }) => {
    /* … */
});

// Handlers passed as props
const handleDelete = useCallback((id) => widgetApi.delete(id), []);

// Expensive derived data
const filtered = useMemo(() => rows.filter((r) => r.active), [rows]);
```

### Images

```jsx
<img src={url} alt={desc} width={400} height={300} loading="lazy" decoding="async" />
```

---

## 9. File & Folder Structure

```
src/
├── assets/styles/
│   ├── index.css           # @theme tokens, @font-face, animations
│   └── pre-set-styles.jsx  # Tailwind class constants + animation system
├── components/
│   ├── charts/             # ApexCharts wrappers
│   ├── feedback/           # ErrorBoundary, LoadingSpinner
│   ├── forms/              # Input, Select, Toggle, FileInput, …
│   ├── layout/             # Navbar, Sidebar, Footer, BottomNav, LoadingScreen
│   ├── routing/            # ProtectedRoute
│   └── ui/
│       ├── typography/     # Heading, Paragraph, List, Link, Divider, …
│       └── *.jsx           # All other UI components
├── contexts/               # LayoutContext, ThemeContext, CsrfContext
├── features/               # Feature folders (auth, dashboard, …)
│   └── <feature>/
│       ├── <feature>.api.js
│       ├── <feature>.hook.js
│       ├── <Feature>.view.jsx           ← orchestrator; calls hook, fans out props to tab components
│       └── components/                  ← add when view exceeds ~400 lines
│           ├── <TabName>Tab.jsx         ← one file per tab / major section
│           ├── <ModalName>Modal.jsx     ← one file per modal
│           └── shared/                  ← sub-components + pure helpers used by 2+ components
├── hooks/                  # useDebounce, useDocumentTitle, usePagination, useRequest
├── middleware/
│   ├── authentication/AuthMiddleware.js
│   ├── security/CsrfMiddleware.js
│   └── HttpClient.js
└── utils/
    ├── chartDefaults.js
    ├── formatters.js
    ├── storage.js
    ├── tokens.js
    └── validators.js
```

---

## 10. Naming Conventions

| Artifact           | Convention               | Example                                  |
| ------------------ | ------------------------ | ---------------------------------------- |
| Component file     | PascalCase + `.jsx`      | `UserCard.jsx`                           |
| View file          | PascalCase + `.view.jsx` | `Dashboard.view.jsx`                     |
| Hook file          | camelCase + `.hook.js`   | `user.hook.js`                           |
| API file           | camelCase + `.api.js`    | `user.api.js`                            |
| Utility file       | camelCase + `.js`        | `formatters.js`                          |
| CSS class constant | SCREAMING_SNAKE          | `MAIN_BUTTON`                            |
| Component export   | Named + default          | `export function X` + `export default X` |

---

## 11. Accordion, Tabs, and Multi-panel Layouts

Use `Tabs` for horizontal navigation, `Accordion` for vertical collapsible sections.
Prefer `Tabs` when all panels visible above fold; prefer `Accordion` for long FAQ/settings pages.

```jsx
<Tabs
  variant="pill"
  tabs={[
    { id: 'profile', label: 'Profile', content: <ProfilePanel /> },
    { id: 'security', label: 'Security', content: <SecurityPanel /> },
  ]}
/>

<Accordion
  variant="separated"
  multiple
  items={[
    { id: 'q1', title: 'How do I reset my password?', content: <p>…</p> },
  ]}
/>
```

---

## 12. Animation System

All animation, transition, motion constants defined in `src/assets/styles/index.css` and exposed as named exports from `src/assets/styles/pre-set-styles.jsx`.

> **Rule:** Always use named constant or animation class from `index.css`. Never hard-code `transition: all 300ms` inline — use design tokens.

---

### 12.1 Easing Curves

Easing library lives in `:root` as CSS custom properties. Reference in `style={{ transition: ... }}` or raw CSS. Never write raw `cubic-bezier(...)` — use token.

| CSS var              | Curve                                    | When to use                                                |
| -------------------- | ---------------------------------------- | ---------------------------------------------------------- |
| `--ease-standard`    | `cubic-bezier(0.4, 0, 0.2, 1)`           | General colour/opacity changes, nav links                  |
| `--ease-decelerate`  | `cubic-bezier(0, 0, 0.2, 1)`             | Elements entering screen (ease-out)                        |
| `--ease-accelerate`  | `cubic-bezier(0.4, 0, 1, 1)`             | Elements leaving screen (ease-in)                          |
| `--ease-spring`      | `cubic-bezier(0.34, 1.56, 0.64, 1)`      | **Buttons, toggles, interactive cards** — spring overshoot |
| `--ease-spring-soft` | `cubic-bezier(0.25, 1.4, 0.5, 1)`        | Gentle spring for menus and panels                         |
| `--ease-spring-hard` | `cubic-bezier(0.5, 2.0, 0.6, 0.8)`       | Snappy spring for small badge pops                         |
| `--ease-bounce`      | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | **Checkmarks, success states** — hard bounce               |
| `--ease-bounce-out`  | `cubic-bezier(0.34, 1.4, 0.64, 1)`       | Settle after bounce                                        |
| `--ease-snap`        | `cubic-bezier(0.2, 0, 0, 1)`             | **Dropdowns, tooltips** — instant snap                     |
| `--ease-overshoot`   | `cubic-bezier(0.3, 1.8, 0.4, 0.9)`       | Overshoot + settle for counters                            |

```jsx
// Using a CSS easing token in an inline style
<div style={{ transition: `transform 350ms var(--ease-spring)` }} />
```

---

### 12.2 Duration Tokens

| CSS var               | Value | Use case                                  |
| --------------------- | ----- | ----------------------------------------- |
| `--duration-instant`  | 80ms  | Ripple click feedback, micro interactions |
| `--duration-fast`     | 150ms | Tooltip show/hide, snap interactions      |
| `--duration-normal`   | 250ms | Most UI state transitions                 |
| `--duration-moderate` | 350ms | Modals, drawers, slide animations         |
| `--duration-slow`     | 500ms | Page enters, hero animations              |
| `--duration-lazy`     | 700ms | Background decorations, ambient motion    |

```jsx
// Combining tokens
<div style={{ transition: `opacity var(--duration-normal) var(--ease-decelerate)` }} />
```

---

### 12.3 Transition Preset Classes

Import from `pre-set-styles.jsx` or use class name directly.

```jsx
import { TRANSITION_SMOOTH, TRANSITION_SPRING, TRANSITION_BOUNCE, TRANSITION_SNAP, TRANSITION_LAZY } from "../../assets/styles/pre-set-styles";
```

| Constant            | Class               | What it transitions                       | Best for                            |
| ------------------- | ------------------- | ----------------------------------------- | ----------------------------------- |
| `TRANSITION_SMOOTH` | `transition-smooth` | transform + opacity + shadow + bg + color | Nav links, colour swaps, tabs       |
| `TRANSITION_SPRING` | `transition-spring` | transform + shadow (spring easing)        | Buttons, toggles, interactive cards |
| `TRANSITION_BOUNCE` | `transition-bounce` | transform + opacity (bounce easing)       | Modals, drawers, toasts             |
| `TRANSITION_SNAP`   | `transition-snap`   | transform + opacity (snap easing, 150ms)  | Dropdowns, tooltips                 |
| `TRANSITION_LAZY`   | `transition-lazy`   | All, 700ms standard                       | Decorative, hero, ambient           |

**Shorthand property constants:**

| Constant                      | Class                         | Transitions                    |
| ----------------------------- | ----------------------------- | ------------------------------ |
| `TRANSITION_COLORS`           | `transition-colors-fast`      | color, bg, border (150ms)      |
| `TRANSITION_TRANSFORM_SPRING` | `transition-transform-spring` | transform only (350ms spring)  |
| `TRANSITION_SHADOW`           | `transition-shadow`           | box-shadow (350ms standard)    |
| `TRANSITION_OPACITY`          | `transition-opacity`          | opacity (250ms standard)       |
| `TRANSITION_SCALE_SPRING`     | `transition-scale-spring`     | transform scale (350ms spring) |

---

### 12.4 Enter / Exit Animation Classes

All one-shot animations use `animation-fill-mode: both`. Safe to apply at mount.

```jsx
import { ANIMATE_FADE_IN, ANIMATE_SLIDE_UP, ANIMATE_SCALE_IN, ANIMATE_ENTER_UP, ANIMATE_BOUNCE_IN, ANIMATE_FADE_IN_UP, ANIMATE_FADE_IN_DOWN, ANIMATE_FADE_IN_LEFT, ANIMATE_FADE_IN_RIGHT, ANIMATE_PAGE_ENTER, ANIMATE_PAGE_EXIT } from "../../assets/styles/pre-set-styles";
```

| Constant                  | Class                     | Description                                           |
| ------------------------- | ------------------------- | ----------------------------------------------------- |
| `ANIMATE_FADE_IN`         | `animate-fade-in`         | Opacity 0 → 1. 250ms decelerate.                      |
| `ANIMATE_FADE_OUT`        | `animate-fade-out`        | Opacity 1 → 0. 250ms accelerate.                      |
| `ANIMATE_SLIDE_UP`        | `animate-slide-up`        | Y(16px) + fade. 350ms spring. Drawers, panels.        |
| `ANIMATE_SLIDE_DOWN`      | `animate-slide-down`      | Y(-16px) + fade. 350ms spring. Top dropdowns.         |
| `ANIMATE_SLIDE_LEFT`      | `animate-slide-left`      | X(16px) + fade. Slides from right.                    |
| `ANIMATE_SLIDE_RIGHT`     | `animate-slide-right`     | X(-16px) + fade. Slides from left.                    |
| `ANIMATE_SCALE_IN`        | `animate-scale-in`        | Scale(0.95) + fade. 250ms spring. Modals, popovers.   |
| `ANIMATE_SCALE_IN_CENTER` | `animate-scale-in-center` | Scale(0.85) + fade. 500ms spring. Hero / loading.     |
| `ANIMATE_SCALE_OUT`       | `animate-scale-out`       | Scale(1) → scale(0.92) + fade. 150ms accelerate.      |
| `ANIMATE_SCALE_SPRING`    | `animate-scale-spring`    | Spring with 4% overshoot. FABs, badges, pings.        |
| `ANIMATE_ENTER_UP`        | `animate-enter-up`        | Y(12px) + scale(0.97). **Preferred card/item enter.** |
| `ANIMATE_ENTER_DOWN`      | `animate-enter-down`      | Y(-12px) + scale(0.97). Top-entering items.           |
| `ANIMATE_BOUNCE_IN`       | `animate-bounce-in`       | Scale 0.3 → 1.08 → 1. 500ms bounce. Success states.   |
| `ANIMATE_FADE_IN_UP`      | `animate-fade-in-up`      | Y(20px) + fade. **⚠ Sets `opacity:0` in CSS.**        |
| `ANIMATE_FADE_IN_DOWN`    | `animate-fade-in-down`    | Y(-20px) + fade.                                      |
| `ANIMATE_FADE_IN_LEFT`    | `animate-fade-in-left`    | X(20px) + fade.                                       |
| `ANIMATE_FADE_IN_RIGHT`   | `animate-fade-in-right`   | X(-20px) + fade.                                      |
| `ANIMATE_PAGE_ENTER`      | `animate-page-enter`      | Route enter: Y(10px) + scale(0.99). 350ms spring.     |
| `ANIMATE_PAGE_EXIT`       | `animate-page-exit`       | Route exit: Y(-10px) + scale(0.99). 250ms accelerate. |

> **Note on `animate-fade-in-*`:** These classes set `opacity: 0` in CSS as initial state — element invisible before animation plays. Intentional — do **not** add `opacity-0` manually, doubles effect.

---

### 12.5 Loop / Ambient Animations

```jsx
import { ANIMATE_FLOAT, ANIMATE_FLOAT_SM, ANIMATE_FLOAT_LG, ANIMATE_PULSE, ANIMATE_PULSE_SCALE, ANIMATE_PING, ANIMATE_SPIN, ANIMATE_SPIN_SLOW, ANIMATE_SPIN_REVERSE, ANIMATE_HEARTBEAT, ANIMATE_BOUNCE_SLOW, ANIMATE_SHIMMER, ANIMATE_GRADIENT } from "../../assets/styles/pre-set-styles";
```

| Constant               | Class                  | Description                                          |
| ---------------------- | ---------------------- | ---------------------------------------------------- |
| `ANIMATE_FLOAT`        | `animate-float`        | Y ±8px loop, 3 s. Standard floating illustration.    |
| `ANIMATE_FLOAT_SM`     | `animate-float-sm`     | Y ±4px loop, 2.5 s. Small icons, badges.             |
| `ANIMATE_FLOAT_LG`     | `animate-float-lg`     | Y ±14px loop, 4 s. Large hero elements.              |
| `ANIMATE_BOUNCE_SLOW`  | `animate-bounce-slow`  | Gentle bob 2 s loop. Buttons awaiting interaction.   |
| `ANIMATE_HEARTBEAT`    | `animate-heartbeat`    | Double-beat scale pulse. Like buttons, health dots.  |
| `ANIMATE_PULSE`        | `animate-pulse`        | Opacity 1↔0.5. Standard skeleton / loading.          |
| `ANIMATE_PULSE_SCALE`  | `animate-pulse-scale`  | Scale 1↔1.05. "Breathing" CTA, active ring.          |
| `ANIMATE_PING`         | `animate-ping`         | Scale → 2 + opacity 0. Ring behind dot indicators.   |
| `ANIMATE_SPIN`         | `animate-spin`         | 360° at 0.75 s linear. Standard spinner.             |
| `ANIMATE_SPIN_SLOW`    | `animate-spin-slow`    | 360° at 2 s linear. Slow decorative rotation.        |
| `ANIMATE_SPIN_REVERSE` | `animate-spin-reverse` | Counter-clockwise 1.2 s. Inner ring vs outer ring.   |
| `ANIMATE_SHIMMER`      | `animate-shimmer`      | Moving gradient shimmer. Used by `.skeleton` class.  |
| `ANIMATE_GRADIENT`     | `animate-gradient`     | bg-position shift. Combine with gradient background. |

---

### 12.6 Attention Seeker Animations (Validation)

```jsx
import { ANIMATE_SHAKE, ANIMATE_SHAKE_H, ANIMATE_WOBBLE, ANIMATE_HEADSHAKE } from "../../assets/styles/pre-set-styles";
```

| Constant            | Class               | Description                                                                      |
| ------------------- | ------------------- | -------------------------------------------------------------------------------- |
| `ANIMATE_SHAKE`     | `animate-shake`     | Horizontal rapid shake + colour shift to danger. 250ms. For invalid form submit. |
| `ANIMATE_SHAKE_H`   | `animate-shake-h`   | Horizontal shake, no colour shift. 500ms. General error.                         |
| `ANIMATE_WOBBLE`    | `animate-wobble`    | ±5° rotation wobble. 600ms. Playful attention grab.                              |
| `ANIMATE_HEADSHAKE` | `animate-headshake` | translateX + rotateY "head shake". 500ms.                                        |

```jsx
// Standard invalid form shake pattern
const [shaking, setShaking] = useState(false);

const handleInvalidSubmit = () => {
    setShaking(true);
    // Remove the class once animation finishes so it can re-trigger
};

<Card className={shaking ? ANIMATE_SHAKE : ""} onAnimationEnd={() => setShaking(false)}>
    <form>...</form>
</Card>;
```

---

### 12.7 Toast / Notification Animations

Applied by `toast.utils.js` and ToastContainer automatically. Reference when building custom notification layer.

| Constant                 | Class                    | Description                         |
| ------------------------ | ------------------------ | ----------------------------------- |
| `ANIMATE_TOAST_IN_RIGHT` | `animate-toast-in-right` | Slides in from right. 350ms spring. |
| `ANIMATE_TOAST_IN_LEFT`  | `animate-toast-in-left`  | Slides in from left.                |
| `ANIMATE_TOAST_IN_UP`    | `animate-toast-in-up`    | Slides up from 80px below.          |
| `ANIMATE_TOAST_OUT`      | `animate-toast-out`      | Slides out right, collapses height. |

---

### 12.8 Hover Patterns

```jsx
import { HOVER_LIFT, HOVER_LIFT_SM, HOVER_LIFT_LG, HOVER_PRESS, HOVER_SCALE, HOVER_GLOW_ORANGE, HOVER_GLOW_PURPLE, HOVER_GLOW_BLUE, HOVER_GLOW_SUCCESS } from "../../assets/styles/pre-set-styles";
```

| Constant             | Class                | Description                                               |
| -------------------- | -------------------- | --------------------------------------------------------- |
| `HOVER_LIFT`         | `hover-lift`         | translateY(-3px) + shadow-lg on hover, -1px active.       |
| `HOVER_LIFT_SM`      | `hover-lift-sm`      | translateY(-2px) + shadow-md. Compact list items.         |
| `HOVER_LIFT_LG`      | `hover-lift-lg`      | translateY(-6px) + shadow-xl. Featured hero cards.        |
| `HOVER_PRESS`        | `hover-press`        | scale(1.02) hover, scale(0.97) active. 150ms snap.        |
| `HOVER_SCALE`        | `scale-hover`        | scale(1.05) hover, scale(0.97) active. 250ms spring.      |
| `HOVER_GLOW_ORANGE`  | `hover-glow-orange`  | Orange brand glow shadow on hover. CTAs, primary buttons. |
| `HOVER_GLOW_PURPLE`  | `hover-glow-purple`  | Purple glow. Accent/secondary buttons.                    |
| `HOVER_GLOW_BLUE`    | `hover-glow-blue`    | Blue glow. Info items, links.                             |
| `HOVER_GLOW_SUCCESS` | `hover-glow-success` | Green glow. Positive actions.                             |

```jsx
// Card with lift + spring transition
<Card className={`${TRANSITION_SPRING} ${HOVER_LIFT}`}>
    …
</Card>

// Icon button with press feedback
<button className={`${TRANSITION_SNAP} ${HOVER_PRESS}`}>
    <PlusIcon />
</button>
```

---

### 12.9 Animation Delay Helpers

Append to any `animate-*` class to stagger multiple elements.

```jsx
import { ANIM_DELAY_0, ANIM_DELAY_100, staggerDelay, staggerDelayDense } from "../../assets/styles/pre-set-styles";
```

Available constants: `ANIM_DELAY_0`, `ANIM_DELAY_50`, `ANIM_DELAY_75`, `ANIM_DELAY_100`,
`ANIM_DELAY_150`, `ANIM_DELAY_200`, `ANIM_DELAY_300`, `ANIM_DELAY_400`, `ANIM_DELAY_500`,
`ANIM_DELAY_600`, `ANIM_DELAY_700`, `ANIM_DELAY_1000`.

---

### 12.10 Stagger Helpers

```jsx
import { staggerDelay, staggerDelayDense } from "../../assets/styles/pre-set-styles";
import { ANIMATE_FADE_IN_UP } from "../../assets/styles/pre-set-styles";

// Standard stagger (0, 100, 200 … 500ms)
{
    items.map((item, i) => (
        <div key={item.id} className={`${ANIMATE_FADE_IN_UP} ${staggerDelay(i)}`}>
            {item.name}
        </div>
    ));
}

// Dense stagger (0, 50, 75, 100, 150, 200, 300ms) — nav items, menus
{
    navItems.map((item, i) => (
        <a key={item.href} className={`${ANIMATE_FADE_IN_RIGHT} ${staggerDelayDense(i)}`}>
            {item.label}
        </a>
    ));
}
```

---

### 12.11 Composed Constants

Pre-built combos for common motion patterns.

```jsx
import { CARD_ENTER, BUTTON_SPRING, MODAL_BACKDROP, SKELETON_SURFACE, RIPPLE_HOST, FOCUS_RING } from "../../assets/styles/pre-set-styles";
```

| Constant           | Value                                                        | Description                                |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------ |
| `CARD_ENTER`       | `animate-fade-in-up hover-lift`                              | Standard card: enters from below + lifts.  |
| `BUTTON_SPRING`    | `transition-spring hover-glow-orange`                        | Interactive button motion + glow.          |
| `MODAL_BACKDROP`   | `animate-fade-in fixed inset-0 bg-black/50 backdrop-blur-sm` | Modal overlay.                             |
| `SKELETON_SURFACE` | `skeleton`                                                   | Shimmer placeholder from index.css.        |
| `RIPPLE_HOST`      | `ripple-host`                                                | Container for JS-injected ripple elements. |
| `FOCUS_RING`       | `focus-ring`                                                 | Accessible orange focus ring.              |

---

### 12.12 Motion Usage Examples

#### Page-level section reveal

```jsx
// Apply to each section so it animates in as the view mounts
function FeatureView() {
    return (
        <div className="space-y-8">
            <div className={`${ANIMATE_FADE_IN_UP} ${ANIM_DELAY_0}`}>
                <H1>Title</H1>
            </div>
            <div className={`${ANIMATE_FADE_IN_UP} ${ANIM_DELAY_100}`}>
                <Paragraph>Body copy…</Paragraph>
            </div>
            <div className={`${ANIMATE_FADE_IN_UP} ${ANIM_DELAY_200}`}>
                <Button>Get started</Button>
            </div>
        </div>
    );
}
```

#### Staggered data list

```jsx
import { ANIMATE_ENTER_UP, staggerDelay, TRANSITION_SMOOTH, HOVER_LIFT_SM } from "../../assets/styles/pre-set-styles";

function ItemList({ items }) {
    return (
        <ul className="space-y-2">
            {items.map((item, i) => (
                <li key={item.id} className={`${ANIMATE_ENTER_UP} ${staggerDelay(i)} ${TRANSITION_SMOOTH} ${HOVER_LIFT_SM}`}>
                    {item.name}
                </li>
            ))}
        </ul>
    );
}
```

#### Modal with correct enter / backdrop

```jsx
import { ANIMATE_SCALE_IN, MODAL_BACKDROP } from "../../assets/styles/pre-set-styles";

// Modal component handles this internally.
// Building custom overlay from scratch:
function CustomModal({ open, onClose, children }) {
    if (!open) return null;
    return (
        <div className={MODAL_BACKDROP} onClick={onClose}>
            <div className={`relative w-full max-w-md mx-auto mt-24 bg-white dark:bg-[#1a1030] rounded-2xl shadow-2xl ${ANIMATE_SCALE_IN}`} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}
```

#### Loading skeleton

```jsx
import { SKELETON_SURFACE } from "../../assets/styles/pre-set-styles";

// Skeleton component wraps this automatically.
// Raw shimmer surface:
<div className={`${SKELETON_SURFACE} h-8 w-48 rounded-lg`} />;
```

#### Ambient floating icon

```jsx
import { ANIMATE_FLOAT_SM, ANIMATE_PULSE_SCALE } from "../../assets/styles/pre-set-styles";

// Icon floats and pulses to draw attention
<div className={`${ANIMATE_FLOAT_SM} ${ANIMATE_PULSE_SCALE}`}>
    <StarIcon className="w-8 h-8 text-orange-400" />
</div>;
```

#### Click ripple host

```jsx
import { RIPPLE_HOST } from "../../assets/styles/pre-set-styles";

// Wrap element and attach ripple JS handler
function RippleButton({ onClick, children }) {
    const handleClick = (e) => {
        const btn = e.currentTarget;
        const circle = document.createElement("span");
        const diameter = Math.max(btn.clientWidth, btn.clientHeight);
        const radius = diameter / 2;
        const rect = btn.getBoundingClientRect();
        circle.style.cssText = `width:${diameter}px;height:${diameter}px;left:${e.clientX - rect.left - radius}px;top:${e.clientY - rect.top - radius}px`;
        circle.classList.add("ripple");
        btn.querySelector(".ripple")?.remove();
        btn.appendChild(circle);
        onClick?.(e);
    };

    return (
        <button className={`${RIPPLE_HOST} px-4 py-2 bg-orange-400 text-white rounded-lg`} onClick={handleClick}>
            {children}
        </button>
    );
}
```

---

### 12.13 Animation Decision Guide

```
New element entering the screen?
  ├── Full page / route         → animate-page-enter
  ├── Modal / dialog            → animate-scale-in  (+ backdrop: animate-fade-in)
  ├── Drawer / side panel       → animate-slide-up / slide-left / slide-right
  ├── Dropdown / popover        → animate-scale-in  (transition-snap on wrapper)
  ├── Card or list item         → animate-enter-up  + staggerDelay(index)
  └── Hero / large section      → animate-fade-in-up  (spring, 0.6s)

Interactive element hover/click?
  ├── Card surface              → HOVER_LIFT + TRANSITION_SPRING
  ├── Primary CTA button        → BUTTON_SPRING  (already in Button.jsx)
  ├── Icon button / FAB         → HOVER_PRESS + TRANSITION_SNAP
  └── Logo / avatar             → HOVER_SCALE

Element that loops / idles?
  ├── Illustration              → animate-float / animate-float-sm / animate-float-lg
  ├── Loading spinner           → animate-spin
  ├── Skeleton / placeholder    → SKELETON_SURFACE (.skeleton class)
  ├── Active status dot         → animate-ping (ring) + animate-pulse (dot)
  └── Breathing CTA             → animate-pulse-scale

Validation / error state?
  ├── Invalid form shake        → animate-shake  (onAnimationEnd → remove class)
  ├── General error wobble      → animate-shake-h
  └── Success badge pop         → animate-bounce-in
```

---

_Last updated: Aumovio Design System v3.1 — React 19 + Tailwind v4 + Animation System_