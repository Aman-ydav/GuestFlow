# Folder Structure & Naming Conventions

## Full tree

Vite scaffolded flat — `src/` sits directly at the `GuestFlow/` repo root, alongside `public/`, `docs/`, `demo/`, `package.json`, `vite.config.js`, `index.html`. No `app/` subfolder.

**`tests/` (2026-09-22, gitignored — not pushed to the submitted repo):** every `*.test.{js,jsx}` file, flat, one per file/behavior being tested, importing the code under test via the `@/` alias rather than being colocated next to it. Aman's call — the grading rubric (`assignment/instructions-and-evaluation.md`) doesn't list automated tests as a criterion, and he didn't want them visible in the GitHub submission — but they're kept locally since they caught several real bugs during development (see `DECISIONS.md`) and are still run after every change. `vite.config.js`'s `test.setupFiles` points at `./tests/setup.js`; a truly fresh clone of the *pushed* repo won't have this folder, so `npm test` won't run there — expected, not a bug, given the above.

```
GuestFlow/
├── public/
│   ├── full-logo.png            real logo lockup (icon + wordmark) — spacious/light contexts
│   ├── logo-icon.png            icon-only mark, transparent — compact/dark contexts + favicon
│   ├── hero.png                 landing page hero illustration
│   └── login-ref.png            circular-badge illustration for the login page's dark panel
├── src/
│   ├── core/
│   │   ├── App.jsx              root component: Providers + RouterProvider
│   │   ├── routes.jsx           route DEFINITIONS only (no router instance — tests build their own createMemoryRouter from this)
│   │   ├── router.jsx           createBrowserRouter(routes) — the real app's router singleton
│   │   ├── providers.jsx        Redux Provider
│   │   └── uiSlice.js           theme/role/filters — core app state, not a "feature"
│   ├── components/
│   │   └── marketing/           MarketingNavbar, Footer, MarketingLayout, HeroTubesCanvas — the public landing page's own components, not part of components/ui
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
│   │   ├── front-desk/          Dashboard + guest details + VisitorBadgeDialog (QR badge, generated after approval) + QrCheckInScanner (camera QR scan → check-in/out, walk-in badges only)
│   │   └── admin/                Config (limits, offices) + ManageHostsSection (add/remove host employees)
│   ├── components/
│   │   ├── ui/                  shadcn components (generated + themed here)
│   │   ├── layout/               AppShell, Sidebar, Topbar, RoleSwitcher
│   │   ├── StatusBadge.jsx
│   │   ├── FlowBanner.jsx        colored page header, one per flow (see 03-design-system.md)
│   │   ├── BannerDecoration.jsx  seeded decorative SVG scatter used inside FlowBanner
│   │   ├── AvatarInitials.jsx
│   │   ├── DatePicker.jsx        shared single-date picker (Popover + shadcn Calendar) — replaces native <input type="date"> everywhere
│   │   ├── DataTable/            shared table (see 06-component-library-shadcn.md)
│   │   └── MultiSelectCombobox/  shared custom combobox
│   ├── pages/
│   │   ├── LandingPage.jsx        marketing home (/)
│   │   ├── LoginPage.jsx          split-screen sign-in — sets role/host, does NOT gate /app/* (see 03-design-system.md); no signup page exists
│   │   ├── KioskPage.jsx
│   │   ├── HostInboxPage.jsx
│   │   ├── InvitesPage.jsx
│   │   ├── FrontDeskPage.jsx
│   │   ├── AdminPage.jsx
│   │   ├── ComingSoonPage.jsx     honest "not built yet" placeholder pattern
│   │   ├── NotFoundPage.jsx / RouteErrorPage.jsx
│   ├── hooks/                    cross-feature hooks: useDebounce.js, useTheme.js (dashboard-only theme, see 03-design-system.md)
│   ├── lib/                      utils.js (cn helper), dateUtils.js, statusTokens.js, statusTransitions.js, validators.js, avatarPalette.js, flowTheme.js (ONE color per flow — see 03-design-system.md)
│   ├── services/                 apiClient.js, visitorService.js, inviteService.js, hostService.js, configService.js
│   ├── mocks/                    mockApiStore.js (persisted to localStorage, see 01-architecture-and-data.md), config.mock.js, generators/ (makeHost/makeVisitor/makeInvite/seedDataset — the only source of hosts/visitors/invites now; the old hosts.mock.js/visitors.mock.js/invites.mock.js/_seed.js wrapper files were deleted as dead code once mockApiStore.js started calling seedDataset() directly)
│   ├── constants/                routes.js (incl. LOGIN), visitTypes.js, roles.js
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
| Mock data file | camelCase + `.mock.js` | `config.mock.js` |
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
