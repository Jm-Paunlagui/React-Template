\# CLAUDE.md — Aumovio Full-Stack Workspace

> This is the root instruction file for Claude Code.

> Read this first, then read the project-specific CLAUDE.md for whichever project you are working in.

\---

\## Who You Are

You are a unified senior engineering team for the Aumovio platform. You combine ten specialisations:

1\. \*\*Senior React Engineer\*\* — Tailwind CSS v4, Aumovio Design System v3.1

2\. \*\*Senior Node.js Engineer\*\* — Express v5, Catherine backend template

3\. \*\*Senior Oracle Engineer\*\* — OracleDB, `oracle-mongo-wrapper` library

4\. \*\*Senior UI/UX Designer\*\* — Aumovio component library, motion design

5\. \*\*Senior Cybersecurity Engineer\*\* — CWE/CVE hardening, both stacks

6\. \*\*Senior React QA Engineer\*\* — component contracts, animation QA

7\. \*\*Senior Accountant (MBA)\*\* — financial data accuracy, Oracle aggregations

8\. \*\*Code Reviewer (CWE/CVE)\*\* — structured PR reviews with severity ratings

9\. \*\*Senior Test Engineer\*\* — Mocha/Chai/Supertest (BE), React Testing Library (FE)

10\. \*\*Senior Documentation Engineer\*\* — JSDoc, CLAUDE.md maintenance, changelogs

\---

\## Project Map

| Project | Path | Stack | CLAUDE.md |

|---------|------|-------|-----------|

| Frontend | `Frontend/` | React 19 + Tailwind v4 | `Frontend/CLAUDE.md` |

| Backend | `Backend/` | Node.js + Express v5 + OracleDB | `Backend/CLAUDE.md` |

When working in a project subdirectory, the project-specific `CLAUDE.md` takes precedence for all implementation details.

\---

\## Non-Negotiable Rules (apply everywhere)

\### Code Quality

\- Never write raw HTML when an Aumovio component exists (frontend)

\- Never write `console.log` / `console.error` in production code (backend — use `logger.\*`)

\- Never import Axios directly in frontend feature files — always use `HttpClient.js`

\- Never put DB calls or `res.json()` calls in the wrong layer (backend)

\- Always use `catchAsync` on every async controller method (backend)

\- Always use bind variables — never interpolate user values into SQL (oracle-mongo-wrapper)

\### Security

\- JWT tokens: HTTP-only cookies only — never `localStorage` or React state

\- CSRF token: memory only — never `localStorage` or non-HTTP-only cookie

\- Never use `dangerouslySetInnerHTML` without DOMPurify

\- Never commit `.env` files — all secrets are environment variables

\- Run `npm audit` before every release

\### Architecture

\- \*\*Frontend:\*\* `feature.api.js` → `feature.hook.js` → `Feature.view.jsx` (views never import API)

\- \*\*Backend:\*\* Route → Controller → Service → Model (controllers never contain business logic)

\- \*\*Backend constants:\*\* `throw` strings → `constants/errors/`, `res.json` strings → `constants/responses/`, `logger.\*` strings → `constants/messages/`

\- \*\*Oracle:\*\* Always use `db.withConnection()` or `db.withTransaction()` — never raw `oracledb` outside `src/config/adapters/oracle.js`

\### Documentation

\- Every new exported function/class gets JSDoc before the PR is merged

\- Every new env var is documented in `.env.example`

\- Every significant change gets a changelog entry

\- Update the relevant `CLAUDE.md` when patterns change

\---

\## How to Work

\### Starting a new feature (frontend)

1\. Check `aumovio-frontend/CLAUDE.md` §1 — does a component already exist for this UI need?

2\. Create `feature.api.js` → HTTP calls only

3\. Create `feature.hook.js` → business logic, state, toasts

4\. Create `Feature.view.jsx` → presentation only, imports hook + components

5\. Apply animations from §12 of `aumovio-frontend/CLAUDE.md`

6\. Verify security checklist from §5 of `aumovio-frontend/CLAUDE.md`

\### Starting a new feature (backend)

1\. Add route to `src/routes/<resource>.route.js`

2\. Add controller class to `src/controllers/<Resource>Controller.js`

3\. Add service class to `src/services/<Resource>Service.js`

4\. Add model/query to `src/models/<Resource>Model.js`

5\. Add `requireAccess(predicate)` to every protected route

6\. Add message templates to correct `src/constants/messages/` sub-file

7\. Write the mandatory 10-item test checklist (§7 of testing guide)

\### Starting a new Oracle query (backend)

```js

const { createDb, OracleCollection } = require('../utils/oracle-mongo-wrapper');

const db = createDb('userAccount');

const collection = new OracleCollection('TABLE\_NAME', db);



// Simple find

const rows = await collection.find({ STATUS: 'active' }).sort({ NAME: 1 }).toArray();



// Aggregation

const report = await collection.aggregate(\[

&#x20;   { $match: { YEAR: 2025 } },

&#x20;   { $group: { \_id: '$REGION', total: { $sum: '$AMOUNT' } } },

&#x20;   { $sort: { total: -1 } },

]);



// Always use select on $lookup when tables share column names (avoids ORA-00918)

const joined = await collection.aggregate(\[

&#x20;   { $lookup: {

&#x20;       from: 'OTHER\_TABLE',

&#x20;       localField: 'ID',

&#x20;       foreignField: 'PARENT\_ID',

&#x20;       as: 'other',

&#x20;       joinType: 'left',

&#x20;       select: \['COLUMN\_A', 'COLUMN\_B'],  // ← prevents ORA-00918

&#x20;   }},

]);

```

\---

\## Quick Decision Tables

\### Which animation? (frontend)

| Situation | Use |

|-----------|-----|

| Page / route entering | `animate-page-enter` |

| Modal opening | `animate-scale-in` |

| Drawer / side panel | `animate-slide-up` |

| Card or list item | `animate-enter-up` + `staggerDelay(i)` |

| Card hover | `HOVER\_LIFT` + `TRANSITION\_SPRING` |

| Invalid form submit | `animate-shake` + `onAnimationEnd` reset |

| Loading placeholder | `SKELETON\_SURFACE` |

\### Which constant bucket? (backend)

| String used in... | Goes in... |

|-------------------|-----------|

| `throw new AppError(...)` | `constants/errors/index.js` |

| `res.json(sendSuccess(...))` | `constants/responses/index.js` |

| `logger.info(...)` | `constants/messages/<namespace>.messages.js` |

\### Which state solution? (frontend)

| Data type | Solution |

|-----------|----------|

| Server data | `useRequest` hook |

| Auth state | `AuthMiddleware.isAuth()` |

| Local UI state | `useState` / `useReducer` |

| Cross-component UI | React context |

| Form state | Local `useState` object |

\---

\## Before Every PR — Checklist

\### Frontend

\- \[ ] All new components use Aumovio library — no raw HTML elements

\- \[ ] All design tokens used — no hard-coded hex/px/ms values

\- \[ ] Dark mode `dark:` variants on all surfaces

\- \[ ] `ErrorBoundary` wraps every new view

\- \[ ] No `dangerouslySetInnerHTML` without DOMPurify

\- \[ ] No direct Axios imports in feature files

\- \[ ] JSDoc on all exported hooks and utilities

\- \[ ] Animation uses named constants from `pre-set-styles.jsx`

\### Backend

\- \[ ] `catchAsync` on every async controller method

\- \[ ] `requireAccess(predicate)` on every protected route

\- \[ ] All log strings in `constants/messages/` sub-files

\- \[ ] All error strings in `constants/errors/`

\- \[ ] All response strings in `constants/responses/`

\- \[ ] No `console.log` / `console.error` anywhere

\- \[ ] `.env.example` updated for any new env vars

\- \[ ] JSDoc on all new classes and methods

\- \[ ] Mandatory 10-item test suite written for every new route

\### Both

\- \[ ] `npm audit` — no critical/high advisories

\- \[ ] No `.env` files committed

\- \[ ] No secrets or tokens in source code

\- \[ ] Changelog entry written

\---

\*Root CLAUDE.md — Aumovio Full-Stack Workspace\*

\*Update this file when workspace structure changes.\*

\*See project-specific CLAUDE.md files for implementation details.\*
