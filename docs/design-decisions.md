# GuestFlow — Design Decisions & Complexity Notes

Filled progressively during the build — this is what interview 1 leans on. Every entry answers "why this, not the alternative?"

## Architecture

- **Folder structure — feature-based, not type-based.** `features/registration|approval|invites|admin` each own their slice + components; shared code lives in `components/`, `lib/`, `services/`, `hooks/`. Chosen so a whole flow (state + UI + tests) can be found, reviewed, or deleted as one unit — a type-based split (`reducers/`, `components/`) scatters one feature across the codebase as it grows.
- **Routing — two route trees, one AppShell.** `/` is the public marketing site (`MarketingLayout`), `/app/*` is the actual product (`AppShell`, role-gated nav). Kept as one route array (`core/routes.jsx`) rather than two separate router instances so there's a single source of truth for the whole site map, and so tests can mount either half via `createMemoryRouter` without duplicating route definitions. `router.jsx` (the real `createBrowserRouter`) is deliberately a thin wrapper around `routes.jsx` — the split exists *specifically* because `createBrowserRouter` is a module-level singleton that doesn't respond to test-driven `window.history` changes; tests need a fresh router per case (`createMemoryRouter`), the app needs exactly one browser-backed router for its whole lifetime.
- **Role switching without real auth — an explicit, labelled demo affordance.** `ui.role` in Redux, no backend check behind it. Chosen because building real auth (JWT, sessions) is out of scope for a frontend case study and would eat the time budget the rubric actually grades; the switcher is clearly labelled "(demo only)" so it's never mistaken for a security boundary. The `services/` boundary means swapping in real auth later touches only `services/`, not every component.

## State management

- **Redux Toolkit**, not Context/useReducer or Zustand. Chosen because four distinct roles (visitor, host, front-desk, admin) all read and write overlapping visitor/invite data from different screens — Context would re-render every consumer on every change; Zustand would work but RTK's `createEntityAdapter` + `createSelector` + devtools + the explicit action-log (every state change is a named, inspectable action) matches "the CV lists Redux Toolkit, be able to defend it in depth" directly.
- **Status transitions are a table, not scattered `if`s.** `lib/statusTransitions.js` exports one `canTransition(from, to)` function consumed by every slice and every mock service call. An invalid move (check-out before check-in, approving an expired invite) is rejected in exactly one place — not re-implemented per screen, and not preventable only by UI discipline (disabling a button doesn't stop a second tab, a race, or a bug elsewhere from calling the action anyway; the table stops it at the data layer regardless of how the call arrives).
- **Normalised state via `createEntityAdapter`** (`{ ids, entities }`) for visitors/hosts/invites — O(1) lookup/update by id instead of `array.find` (O(n)) on every render of the guest-details panel.

## Data layer

- **Mock shape mirrors a real backend 1:1** (see `01-architecture-and-data.md`) — `Visitor`/`Host`/`Invite`/`ApprovalEvent` — specifically so nothing about the Redux slices, selectors, or components would need to change if a real API replaced the mock tomorrow.
- **The abstraction boundary is `services/*Service.js`**, gated by one env var (`VITE_USE_MOCK_API`). Every service function has the identical signature and return shape in both modes; Redux thunks call the service and never know which mode is active.
- **Simulated latency (200–700ms) + ~8% random write failures** (`mocks/mockApiStore.js`) — deliberately, so the loading/error UI (skeletons, disabled buttons, error toasts) has something real to exercise instead of resolving instantly and looking untested.
- **Mock dataset defaults to ~3,000 visitors / 400 invites / 24 hosts**, generated, not hand-written — small mock data would hide exactly the problems the "Performance" rubric criterion is checking for (unmemoised filters, missing virtualization).

## Complexity analysis (per feature)

| Operation | Data structure | Time | Space | Notes |
|---|---|---|---|---|
| Search visitors by name/email/phone | `createSelector` over the entity array, one combined predicate | O(n) per settled query (not per keystroke — debounce lands in flow 4) | O(k) for k matches | Single pass; not three chained `.filter()` calls |
| Filter by date / status | Same selector, same pass as search | O(n) | O(k) | Combined into the same predicate as search, so filtering never costs a second O(n) pass |
| Lookup visitor by id (guest details panel) | `entityAdapter` `entities` map | O(1) | O(1) | vs O(n) `array.find` on a plain array |
| Check pre-approval limit per employee per day | `Array.filter` over today's invites for one host, in `inviteService.createInvite` | O(m) where m = that host's invites that day (small, bounded) | O(1) extra | Documented as the one place this could become an O(1) `countByHostDay` map if profiling ever showed m matters — see `05-state-management-redux.md` |
| Expire unused pre-approvals | Derived on read: `now > windowEnd && status === 'invited'` | O(1) per invite checked | O(1) | No polling/timer needed; always correct whether or not a sweep ran |
| Approve / reject / check-in / check-out | `canTransition` table lookup + entity `upsertOne` | O(1) | O(1) | Table lookup, not a chain of `if` statements |

## UX / error handling decisions

- **Feedback is action-specific, not one style everywhere:** form submission → toast (`sonner`) + the page's own success state (Kiosk shows a confirmation screen, not just a toast that scrolls away); field errors → inline, under the field, only after `touched`; invalid backend operation → toast with the service's human-readable message (e.g. "Daily pre-approval limit (5) reached for this host"), not a raw status code.
- **Every mutating button disables itself while its thunk is in flight** (`visitorsSlice.mutatingIds`) — prevents double-submit racing the ~8% simulated failure rate into a confusing double-toast.
- **The photo-capture camera failure path is a first-class UI state**, not a crash: denied/unsupported camera → visible message + a working file-upload fallback, covered by an automated test (`App.smoke.test.jsx`) specifically because jsdom has no camera and would otherwise mask this exact path.

## Testing & verification (what actually proved this works)

- **Vitest + jsdom**, not a real browser — this sandbox's network blocks large binary downloads (Playwright's Chromium fetch timed out after multiple retries against `cdn.playwright.dev`; regular `npm install` traffic is unaffected, so it's specifically the ~150MB browser binary that's blocked, not general network access). Playwright is still installed as a devDependency for real e2e runs on an unrestricted machine later.
- 15 tests: reducer/transition-table unit tests (cheapest, highest-value per the interview-prep testing notes), and a full-app smoke suite that mounts the real Redux store + real route tree via `createMemoryRouter` and drives it with Testing Library — landing page renders, flow cards link to real routes, dashboard redirects correctly, kiosk form validates and accepts an uploaded photo, theme toggle actually flips the `dark` class on `<html>`, unknown routes 404 correctly.
- Two real bugs were caught this way, not by inspection: shadcn's `CardTitle` renders a plain `<div>` (invisible to heading-based navigation/testing) — fixed at the component source since every usage in the app needs it; and the initial `shadcn add --all` pulled a broken `import { cn } from "cn"` and a Next.js-only `next-themes` import into every generated file, both fixed before any feature code was written on top of them.

## Tradeoffs & what I'd do with more time

- Front-desk dashboard (search/filter/pagination/virtualization at the full 3,000-row scale), host inbox, invites, and admin config are scaffolded as routes but not yet built — flow 1 (registration) is complete end-to-end; the rest follow the same pattern.
- Code-splitting (`React.lazy` per route) isn't in yet — the build warns about one ~600KB bundle. Straightforward to add once more routes exist and the split points are obvious.
- A real headless-browser visual check wasn't possible in this sandbox (see Testing above) — the app has not been visually confirmed in an actual rendered browser, only via build success, lint, and jsdom-based interaction tests. Worth a first real look with `npm run dev` before submission.
