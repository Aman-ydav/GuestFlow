# Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Build tool | Vite | Fast dev server, simple config, standard for a React SPA case study |
| Language | JavaScript (no TypeScript) | Decided in `../../DECISIONS.md` — plain JS by choice |
| UI library | React 19 | Required by the JD/assignment fit |
| Routing | React Router v7 (data router) | `routes.jsx` (definitions) split from `router.jsx` (the real `createBrowserRouter` singleton) — layout routes for the dashboard shell, nested routes for the front-desk detail panel via URL |
| State | Redux Toolkit | Explicitly requested; see `05-state-management-redux.md` |
| Data fetching | Axios (via one shared client) | Requested; also gives interceptors for a consistent error shape, real or mocked |
| Styling | Tailwind CSS v4 (CSS-first config) | Utility-first, pairs with shadcn/ui, easy theming via CSS variables |
| Components | shadcn/ui (Radix primitives) | Copied source, not a dependency — full control to theme; see `06-component-library-shadcn.md` |
| Icons | `react-icons` app-wide, incl. swapped into shadcn's own copied components (which default to `lucide-react`) | Decided 2026-09-22 |
| QR | `react-qr-code` (generate — invite e-pass + visitor badge) and `jsqr` (decode — front-desk check-in scanner) | Both pure client-side, no native dependency, matches mock-only architecture |
| Dates | `date-fns` | Small, tree-shakeable, no moment.js bloat |
| Class merging | `clsx` + `tailwind-merge` (`cn()` helper — shadcn ships this) | Standard shadcn pattern |
| Toasts | shadcn `sonner` | Not put in Redux — see state-management doc for why. Its `--normal-bg` etc. tokens must be `hsl(var(--x))`-wrapped, not bare `var(--x)` — a real bug hit during development, see `DECISIONS.md` |
| Testing | Vitest + React Testing Library | Fast, Vite-native — used throughout development to catch regressions (several real bugs were found this way, not by inspection — see `design-decisions.md` § Testing) |
| Linting | ESLint | Code quality criterion; `react-hooks/set-state-in-effect` and related rules caught several real issues during development |
| Mock data generation | Hand-rolled generators in `mocks/generators/`, persisted to `localStorage` via `mocks/mockApiStore.js` | Keeps the dependency list honest for a case study; persistence added so a page refresh doesn't lose demo state |

## Explicitly not used

- **TypeScript** — decided against; JSDoc + boundary validation instead (see interview-prep `jd-breakdown.md` for the honest interview answer on this).
- **Angular / Signals / RxJS** — not the assignment's framework choice.
- **CSS-in-JS** — Tailwind covers it; no styled-components/emotion.
- **Gradients anywhere in the UI** — solid colors only, see `03-design-system.md`.
- **`three`/`framer-motion` as installed dependencies** — the landing hero's interactive WebGL background loads its renderer from a CDN at runtime instead (see `03-design-system.md` § Landing hero background), so neither needed to become a project dependency for one decorative section.

## Full dependency list

See `package.json` — every dependency above is a real, currently-installed one. There is no separate "install plan" anymore; the app is fully built.
