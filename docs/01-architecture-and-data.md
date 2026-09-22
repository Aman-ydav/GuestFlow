# Architecture & Data Layer

## The backend question

⚠️ **Open — needs your confirmation, see chat.** Default/recommended answer below; flip it if you want a real backend.

**Recommendation: frontend-only, mock-data-first.** The case study explicitly permits this ("use mock data to implement the feature if API is not available"), it's what the evaluation criteria are written to grade (frontend UX/error-handling/performance, not backend ops), and it's the fastest path to a polished, fully-working submission in the time available.

**If you'd rather have a real backend** (Node + Express + MongoDB), that's a bigger but doable add-on — the architecture below is deliberately built so either choice costs nothing to switch later: components never talk to data directly, they go through `services/`, and `services/` is the *only* layer that knows whether it's reading a mock array or calling `axios`.

## The switch

One env var decides it — nothing else changes:

```
# .env
VITE_USE_MOCK_API=true      # false once a real backend exists
VITE_API_BASE_URL=/api      # only read when the above is false
```

`src/services/apiClient.js` configures one shared `axios` instance (`baseURL`, timeout, response/error interceptor that normalises errors into `{ message, status, fieldErrors? }`). Every `*Service.js` file exports the same async function signatures regardless of mode:

```js
// services/visitorService.js
export async function listVisitors(params) { ... }   // mock: filters the in-memory store; real: axios.get('/visitors', { params })
export async function approveVisitor(id) { ... }
```

## Mock data layer

```
src/mocks/
├── generators/
│   ├── makeVisitor.js       one function, returns one realistic visitor object
│   ├── makeHost.js
│   ├── makeInvite.js
│   └── seedDataset.js       builds N visitors/hosts/invites with sane relationships (host exists, dates make sense)
├── visitors.mock.js         calls seedDataset once, exports the array (module-level = stable across renders)
├── hosts.mock.js
├── invites.mock.js
├── config.mock.js           { preApprovalLimit: 5, overstayMinutes: 120, offices: [...] }
└── mockApiStore.js          wraps the arrays above in an in-memory "database" the mock services read/write,
                              with delay(200-600ms) + ~8% simulated failure rate on writes
```

**Rules:**
- Components **never** `import` from `mocks/` directly — always through `services/`. That's the whole point of the boundary.
- The seed dataset was designed to default to a **large N** (several thousand visitors) specifically so performance work (memoised selectors, virtualization, pagination) has something real to prove itself against — small mock data hides the problems the "Performance" evaluation criterion is checking for. **Temporarily turned down to a minimal N (2026-09-22, Aman: "keep very less mock data for now", then further to single digits — "reduce it like 4-7 across, including all the roles")** — `seedDataset()` in `mocks/generators/seedDataset.js` currently defaults to 4 hosts / 7 visitors / 5 invites; check that file for the exact live numbers since they've already been revised down twice. **Restore the large defaults before final submission** so the Performance criterion actually has scale to demonstrate against — the pagination logic itself doesn't change either way, only how much data there is to page through.
- `mockApiStore.js` is genuinely mutable (a `Map` keyed by id) so approve/reject/check-in actually persist for the session — not just a static read-only array.
- **Persisted to `localStorage` (2026-09-22)**, not just in-memory. The first version reset to the original seed on every page refresh and the seed generator's `Math.random()` jitter on `createdAt` re-rolled on every reload too — which, since the front-desk list sorts by `createdAt`, made the list visibly re-order between refreshes even when nothing had actually changed (Aman: "why did our thing get cleared after a refresh, and [the] list [is] shuffled"). Now: the seed runs once, its result is saved to `localStorage` under a versioned key (`guestflow:mock-db:v1`), and every subsequent load rehydrates from that snapshot instead of re-seeding — fixing both symptoms at once, since they shared one root cause. Every mutating service call (`registerVisitor`, `transitionVisitor`, `createInvite`, `cancelInvite`, `updateConfig`) calls `persist()` right after it changes `db`. `resetMockData()` (wired to Admin's "Reset Demo Data" button, behind a confirm `AlertDialog`) clears the snapshot and reloads, for when you want back to a clean slate. All storage access is wrapped in try/catch — a blocked/full/private-browsing `localStorage` degrades to "doesn't persist," never a crash.
- **"The server is taking too long to respond"** (thrown by `maybeFail()`, ~8% of writes) is not a bug — it's a deliberate simulated failure rate specifically so the app's error-handling UI (toasts, disabled-while-mutating buttons) has something real to exercise instead of a mock backend that always succeeds and never proves the error paths work. If you hit it, that's it working as designed; just retry the action.

## If/when a real backend is added (Phase 2, only if confirmed)

- **Express** routes mirroring the service function names 1:1 (`GET /visitors`, `POST /visitors/:id/approve`, …).
- **MongoDB + Mongoose** schemas shaped identically to the mock generators' output, so swapping the flag doesn't change any Redux shape.
- Lives in a `GuestFlow/server/` folder, a sibling of `src/` at the repo root (not nested inside `src/`) so the frontend structure doesn't change either way.
- Auth (if added) would be a thin JWT layer — out of scope unless you confirm you want it.

## Data shapes (source of truth for both mock and real)

```js
// Visitor
{ id, name, phone, email, purpose, hostId, company, photoUrl,
  status: 'pending' | 'approved' | 'rejected' | 'checked-in' | 'checked-out',
  checkedInAt, checkedOutAt, createdAt, sourceInviteId? }

// Host
{ id, name, department, email, avatarInitials, avatarColor }

// Invite
{ id, code, title, visitType, officeId, hostId, guestIds: [visitorId],
  windowStart, windowEnd, note,
  status: 'invited' | 'checked-in' | 'expired' | 'cancelled', createdAt }

// ApprovalEvent (audit log)
{ id, visitorId, action: 'approved' | 'rejected' | 'checked-in' | 'checked-out',
  actorId, at }
```
