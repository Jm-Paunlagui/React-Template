# CLAUDE.md — Aumovio UI Component Usage Guide

> **Persona:** Senior React + Tailwind CSS v4 Developer with design-system expertise.
> Every feature should use the component library — never inline ad-hoc markup when a component exists.

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

All colours, spacing, and shadow values are defined in `src/assets/styles/index.css`.

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

All token names are available as standard Tailwind utilities:
`bg-orange-400`, `text-purple-400`, `border-success-400/30`, etc.

### Dark mode

Dark mode is controlled by `data-theme="dark"` on `<html>`. Use the `dark:` prefix:

```jsx
<div className="bg-white dark:bg-[#1a1030] text-black/85 dark:text-white/85" />
```

---

## 3. Feature Development Workflow

### Step 1 — API layer (`feature.api.js`)

Only HTTP calls, no state, no React. Returns raw Axios response.

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

Always compose a form from the typed form components. Never write raw `<input>` unless
you are rendering on a dark background where the white `Input` surface would clash
(in that case, apply the same design tokens manually as shown in `Login.view.jsx`).

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

These rules apply to **every feature** in this codebase.

### 5.1 Authentication & Session (CWE-287, CWE-384)

- JWT tokens are stored **only in HTTP-only cookies** (set by the server).  
  Never store tokens in `localStorage`, `sessionStorage`, or React state.
- The CSRF token lives **in memory only** (`CsrfMiddleware._token`).  
  It is never written to localStorage or a non-HTTP-only cookie.
- Call `AuthMiddleware.signout()` on logout — this removes the token cookie **and**
  clears localStorage user data in one step.
- `ProtectedRoute` re-verifies the token on every mount — do not cache role checks
  across navigations at the component level.

### 5.2 Cross-Site Request Forgery (CWE-352)

- `HttpClient` automatically injects `x-csrf-token` on every mutating request
  (POST, PUT, PATCH, DELETE). **Never bypass this interceptor** by importing Axios directly.
- If you receive a 403 with `CSRF_TOKEN_INVALID`, the interceptor retries once
  after `CsrfMiddleware.forceRefresh()`. You do not need to handle this manually.

### 5.3 Cross-Site Scripting (CWE-79)

- React's JSX escapes all interpolated strings automatically. **Never use
  `dangerouslySetInnerHTML`** unless the content has been sanitised with
  a library such as DOMPurify first.
- User-supplied values rendered into `href` attributes must be validated to start
  with `https://` or `/` — never `javascript:`.

```jsx
// ❌ Dangerous
<a href={user.url}>Visit</a>;

// ✅ Safe
const safeHref = /^(https?:\/\/|\/)/.test(user.url) ? user.url : "#";
<a href={safeHref}>Visit</a>;
```

### 5.4 Sensitive Data Exposure (CWE-200, CWE-312)

- Never log tokens, passwords, or PII to the console in any environment.  
  Remove all `console.log(token)` and similar lines before committing.
- Mask emails and sensitive values in the UI using `maskEmail()` from
  `src/utils/formatters.js`.
- If you add new `localStorage` writes, never store raw tokens, passwords,
  or full PII objects — store only non-sensitive identifiers.

### 5.5 Input Validation (CWE-20)

- Always validate on both client **and** server. Client validation is UX only.
- Use the helpers in `src/utils/validators.js`:

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

- In production builds, only show generic messages to the user.  
  Full error details go to the server log, not the UI.

```jsx
// ❌ Exposes stack trace
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

- Run `npm audit` before every release and address critical/high severity advisories.
- Pin exact versions for security-sensitive packages (auth, crypto, HTTP).
- Never commit `.env` files — all secrets must live in environment variables
  that are injected at build time via Vite (`VITE_*`).

### 5.8 Content Security Policy (CSP)

When deploying, configure your web server or CDN to send:

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

Ensure the server sends:

```
X-Content-Type-Options: nosniff           # CWE-430
X-Frame-Options: DENY                    # CWE-1021
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=(), microphone=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### 5.10 Race Conditions & State (CWE-362)

- Always set a `cancelled` flag in `useEffect` async functions and check it before
  calling `setState`. See `ProtectedRoute.jsx` for the reference pattern.
- The `useRequest` hook deduplicates in-flight requests at module scope — use it
  instead of raw `useEffect` + fetch for data loading.

---

## 6. Routing & Access Control

```jsx
// App.jsx role constants — define ALL roles here
const ROLES = { SADMIN: 3, ADMIN: 2, USER: 1 };

// Role-only guard
<Route element={<ProtectedRoute role={[ROLES.USER, ROLES.ADMIN]} />}>
  <Route path="dashboard" element={<DashboardView />} />
</Route>

// Role + fine-grained permission
<Route element={
  <ProtectedRoute
    role={[ROLES.ADMIN, ROLES.SADMIN]}
    check={(user) => user.area?.includes('FINANCE')}
  />
}>
  <Route path="finance" element={<FinanceView />} />
</Route>
```

Permission strings (`area` values) are defined **inline at each route** in `App.jsx`,
not in a shared constant — this keeps access control readable and co-located with the route.

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

Never use external state managers (Redux, Zustand, etc.) unless explicitly required —
the existing patterns cover all standard cases.

---

## 8. Performance Guidelines

### Code splitting — lazy-load views only

```jsx
const FinanceView = lazy(() => import("./features/finance/Finance.view"));
// ❌ Never lazy-load shared UI components
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
│   └── pre-set-styles.jsx  # Tailwind class constants
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
│       └── <Feature>.view.jsx
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

Use `Tabs` for horizontal navigation and `Accordion` for vertical collapsible sections.
Prefer `Tabs` when all panels are visible above the fold; prefer `Accordion` for long
FAQ/settings pages.

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

_Last updated: Aumovio Design System v3.0 — React 19 + Tailwind v4 + Security Hardening_
