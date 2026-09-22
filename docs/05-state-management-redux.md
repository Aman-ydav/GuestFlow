# State Management — Redux Toolkit

Full RTK reference/interview material already exists in `../../interview-prep/02-technical-interview/react/03-state-management-redux-toolkit.md` — this doc is the *build spec*, that one is the *study material*. Keep them consistent.

## Slices

| Slice | Lives in | Shape | Notes |
|---|---|---|---|
| `visitors` | `features/registration/visitorsSlice.js` | `createEntityAdapter` — `{ ids, entities, status, error }` | Status transition table enforced in the reducer (see below) |
| `invites` | `features/invites/invitesSlice.js` | entity adapter + `countByHostDay: { "hostId\|YYYY-MM-DD": n }` | O(1) daily-limit check; see interview-prep file for the full design |
| `hosts` | `features/approval/hostsSlice.js` | entity adapter | Seeded from mock, effectively read-only in v1 |
| `config` | `features/admin/configSlice.js` | `{ preApprovalLimit, overstayMinutes, offices }` | Admin-editable |
| `ui` | `core/uiSlice.js` | `{ role, theme, filters: { query, status, date }, selectedVisitorId }` | `role` and `theme` persisted to localStorage; filters are not |

**Toasts are NOT a Redux slice.** shadcn's `sonner` manages its own state via its hook — routing success/error messages through Redux would be pure ceremony. Call `toast.success(...)` / `toast.error(...)` directly from thunks or components.

## The transition table (non-negotiable — this is the "data consistency" evaluation criterion)

```js
// lib/statusTransitions.js
export const VISITOR_TRANSITIONS = {
  pending:      ['approved', 'rejected'],
  approved:     ['checked-in'],
  invited:      ['checked-in', 'expired', 'cancelled'],
  'checked-in': ['checked-out'],
};
export const canTransition = (from, to) => VISITOR_TRANSITIONS[from]?.includes(to) ?? false;
```

Every status change goes through one reducer action (`visitorTransitioned`) that calls `canTransition`. An invalid transition sets `state.error`, never throws silently, never mutates status anyway. This is imported and reused by `visitorsSlice` and `invitesSlice` — one source of truth for the rules, not duplicated per slice.

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

Persistence: a small `createListenerMiddleware` writes `ui.role` and `ui.theme` to `localStorage` on change; hydrated once at boot via `preloadedState`. No `redux-persist` dependency needed for two fields.

## Testing

Reducers are pure — the cheapest, highest-value tests in the app. Every transition rule gets at least one test (`check-out rejected before check-in`, `daily limit blocks the 6th invite`). See `../../interview-prep/02-technical-interview/react/05-architecture-patterns-routing-testing.md` for the RTL pattern for component tests.
