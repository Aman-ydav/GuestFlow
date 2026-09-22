# State Management — Redux Toolkit

Full RTK reference/interview material already exists in `../../interview-prep/02-technical-interview/react/03-state-management-redux-toolkit.md` — this doc is the *build spec*, that one is the *study material*. Keep them consistent.

## Slices

| Slice | Lives in | Shape | Notes |
|---|---|---|---|
| `visitors` | `features/registration/visitorsSlice.js` | `createEntityAdapter` — `{ ids, entities, status, error, mutatingIds }` | Status transition table enforced in the *service* layer (`visitorService.transitionVisitor`), not the reducer — see below, this changed from the original plan |
| `invites` | `features/invites/invitesSlice.js` | plain entity adapter, no extra fields | **Not** an O(1) `countByHostDay` map — that was the original plan; the actual daily-limit check in `inviteService.createInvite` is `Array.filter` over that host's invites for the day, O(m) where m is small and bounded (documented, deliberate — see `design-decisions.md`, flagged as the one place to add an O(1) counter if profiling ever showed it mattered) |
| `hosts` | `features/approval/hostsSlice.js` | entity adapter + `mutatingIds` | **No longer read-only** (2026-09-22) — `createHost`/`deleteHost` thunks added for Admin's "Manage Hosts" section |
| `config` | `features/admin/configSlice.js` | `{ preApprovalLimit, overstayMinutes, offices, status }` | Admin-editable; `status` lifecycle (`idle`/`pending`/`succeeded`) exists specifically so `AdminSettingsForm` only mounts its inner form once real data has loaded, avoiding a sync-via-effect anti-pattern |
| `ui` | `core/uiSlice.js` | `{ theme, role, currentHostId, sidebarCollapsed, filters: { query, status, date }, selectedVisitorId }` | `theme`/`role`/`currentHostId`/`sidebarCollapsed` each read their initial value from `localStorage` on load and write back on change, inline in their own reducer case — **no middleware**, see below; `filters`/`selectedVisitorId` are session-only |

**Toasts are NOT a Redux slice.** shadcn's `sonner` manages its own state via its hook — routing success/error messages through Redux would be pure ceremony. Call `toast.success(...)` / `toast.error(...)` directly from thunks or components.

## The transition table (non-negotiable — this is the "data consistency" evaluation criterion)

```js
// lib/statusTransitions.js — the real, current file
export const VISITOR_TRANSITIONS = {
  pending: ['approved', 'rejected'],
  approved: ['checked-in'],
  rejected: [],
  invited: ['checked-in', 'expired', 'cancelled'],
  'checked-in': ['checked-out'],
  'checked-out': [],
  expired: [],
  cancelled: [],
}
export function canTransition(from, to) {
  return VISITOR_TRANSITIONS[from]?.includes(to) ?? false
}
```

**Enforced in the service layer, not the reducer** — this is a deliberate difference from the original plan above (a `visitorTransitioned` reducer calling `canTransition` directly). In the actual build, `visitorService.transitionVisitor(id, to)` is what calls `canTransition` and throws a `{ message, status: 409 }` for an invalid move; the `visitorsSlice` reducer only ever applies an already-validated result (`transitionVisitor.fulfilled` → `adapter.upsertOne`) or records the rejection's message (`transitionVisitor.rejected` → `state.error`). The net effect is the same guarantee — no code path can write an invalid status — just one layer lower than first planned, because that's also where a real backend's validation would live, keeping the mock/real boundary exact.

`canTransition` is used by **`visitorsSlice`'s statuses only** (both plain visitor statuses and invite statuses share the same table, since `invited`/`expired`/`cancelled` are also valid values there). `invitesSlice`'s own mutations (`createInvite`, `cancelInvite`) do **not** currently route through `canTransition` — `cancelInvite` checks `invite.status !== 'invited'` directly in `inviteService.js` instead. That's a known small inconsistency, not a design decision: worth unifying if this project continued.

## Async pattern

`createAsyncThunk` wrapping the relevant `services/*Service.js` call — thunks never know whether the service is mocked or real (that's the whole point of the architecture split). Standard `pending/fulfilled/rejected` handling in `extraReducers`; errors surface via `rejectWithValue` → a toast in the component.

## Selectors

- Colocated in the same slice file, exported alongside the reducer.
- `createSelector` for anything derived (filtered/sorted lists, counts) — never store derived data in state.
- Naming: `select<Noun>` (`selectVisibleVisitors`, `selectPendingForHost`).
- The front-desk search/filter is **one memoised selector with a single combined predicate** — not three chained `.filter()` calls (see `03-async-event-loop.md`-adjacent complexity notes in interview-prep for why).

## Store setup

```js
// store/index.js
export const store = configureStore({
  reducer: { visitors, invites, hosts, config, ui },
  devTools: import.meta.env.DEV,
});
```

**`ui` slice persistence:** no middleware, no `preloadedState` — each of `theme`/`role`/`currentHostId`/`sidebarCollapsed` reads its own `localStorage` key inline at `initialState` construction (via small `getPreferred*()` helpers, each wrapped in try/catch for private-browsing/blocked-storage) and writes back inline inside its own reducer case, right after mutating `state`. Simpler than a listener middleware for four independent, rarely-changing values — no `redux-persist` dependency needed either.

**Mock "database" persistence is separate and much bigger**: the entire `visitors`/`invites`/`hosts`/`config` dataset (not just four `ui` fields) is persisted via `mocks/mockApiStore.js`'s own `persist()`/`loadPersisted()` functions, called from every mutating `services/*Service.js` function — this is what makes an approve/reject/check-in/invite survive a page refresh, and it's a real bug fix from development (the dataset used to reset on every refresh, and the seed generator's random jitter on `createdAt` made the front-desk list visibly reorder between refreshes too — same root cause, one fix). See `01-architecture-and-data.md`.

## Testing

Reducers are pure — the cheapest, highest-value tests in the app. Every transition rule gets at least one test (`check-out rejected before check-in`, `daily limit blocks the 6th invite`). See `../../interview-prep/02-technical-interview/react/05-architecture-patterns-routing-testing.md` for the RTL pattern for component tests.
