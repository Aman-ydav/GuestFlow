# Folder Structure & Naming Conventions

## Full tree

Vite scaffolded flat — `src/` sits directly at the `GuestFlow/` repo root, alongside `public/`, `docs/`, `demo/`, `package.json`, `vite.config.js`, `index.html`. No `app/` subfolder.

```
GuestFlow/
├── public/
│   ├── illustrations/          kebab-case.svg — see 07-image-assets-and-prompts.md
│   ├── logo/                   guestflow-mark.svg, guestflow-wordmark.svg
│   └── favicon.svg
├── src/
│   ├── core/
│   │   ├── App.jsx              root component: Providers + RouterProvider
│   │   ├── routes.jsx           route DEFINITIONS only (no router instance — tests build their own createMemoryRouter from this)
│   │   ├── router.jsx           createBrowserRouter(routes) — the real app's router singleton
│   │   ├── providers.jsx        Redux Provider
│   │   └── uiSlice.js           theme/role/filters — core app state, not a "feature"
│   ├── components/
│   │   └── marketing/           MarketingNavbar, Footer, MarketingLayout, HeroIllustration — the public landing page's own components, not part of components/ui
│   ├── store/
│   │   ├── index.js             configureStore, combines feature slices
│   │   └── rootReducer.js
│   ├── features/
│   │   ├── registration/        Visitor kiosk flow
│   │   │   ├── components/      PascalCase .jsx
│   │   │   ├── hooks/           useX.js
│   │   │   ├── registrationSlice.js
│   │   │   └── index.js         public exports only
│   │   ├── approval/            Host approve/reject flow
│   │   ├── invites/             Pre-approval / invite flow
│   │   ├── front-desk/          Dashboard + guest details
│   │   └── admin/                Config (limits, offices)
│   ├── components/
│   │   ├── ui/                  shadcn components (generated + themed here)
│   │   ├── layout/               AppShell, Sidebar, Topbar, RoleSwitcher
│   │   ├── StatusBadge.jsx
│   │   ├── FlowBanner.jsx        colored page header, one per flow (see 03-design-system.md)
│   │   ├── AvatarInitials.jsx
│   │   ├── DataTable/            shared table (see 06-component-library-shadcn.md)
│   │   └── MultiSelectCombobox/  shared custom combobox
│   ├── pages/
│   │   ├── KioskPage.jsx
│   │   ├── HostInboxPage.jsx
│   │   ├── InvitesPage.jsx
│   │   ├── FrontDeskPage.jsx
│   │   └── AdminPage.jsx
│   ├── hooks/                    cross-feature hooks: useDebounce.js, useTheme.js
│   ├── lib/                      utils.js (cn helper), dateUtils.js, statusTokens.js, statusTransitions.js, validators.js, avatarPalette.js, flowTheme.js (ONE color per flow — see 03-design-system.md)
│   ├── services/                 apiClient.js, visitorService.js, inviteService.js, hostService.js
│   ├── mocks/                    see 01-architecture-and-data.md
│   ├── constants/                routes.js, visitTypes.js, roles.js
│   ├── assets/                   local images that aren't public/ (rare — prefer public/)
│   ├── index.css                 ALL global styles, theme tokens, Tailwind layers — single source
│   └── main.jsx
├── .env                          VITE_USE_MOCK_API etc.
└── vite.config.js
```

## Naming rules

| Thing | Convention | Example |
|---|---|---|
| Component file & export | PascalCase, one component per file | `VisitorTable.jsx` |
| Feature folder | kebab-case | `front-desk/`, `pre-approval` folders don't exist — use `invites/` |
| Hook | camelCase, `use` prefix | `useDebounce.js` |
| Redux slice | camelCase + `Slice` suffix, colocated in its feature | `visitorsSlice.js` |
| Service | camelCase + `Service` suffix | `visitorService.js` |
| Mock data file | camelCase + `.mock.js` | `visitors.mock.js` |
| Mock generator | `make<Entity>.js` | `makeVisitor.js` |
| Constant file | camelCase file, `SCREAMING_SNAKE_CASE` exports | `constants/visitTypes.js` → `export const VISIT_TYPES = {...}` |
| Utility function | camelCase, verb-first | `formatVisitTime()`, `isOverstay()` |
| CSS | none — Tailwind utility classes only, tokens in `index.css` | — |
| Route path | kebab-case, matches feature folder where possible | `/front-desk`, `/invites` |

## Import rules

- A feature exports its public API through `index.js`; nothing outside the feature imports its internals directly (`features/invites/components/InviteForm.jsx` is never imported from outside — go through `features/invites/index.js`).
- `components/ui/` (shadcn) is imported from anywhere — it's the shared primitive layer, not feature-owned.
- No feature imports another feature directly. Shared logic moves to `lib/`, `hooks/`, or `components/`.
- Absolute imports via a `@/` alias (Vite `resolve.alias`) instead of `../../../` chains — configure this at scaffold time.

## One component per file, no default-export ambiguity

- Named exports preferred (`export function VisitorTable() {}`) except for page components (`pages/*.jsx` use default export — React Router convention).
- No file exceeds ~150 lines; if a component grows past that, extract sub-components into the same feature's `components/` folder.
