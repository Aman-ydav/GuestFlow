# RULES — read this before touching any code

The single enforcement checklist. Every other doc explains *why*; this page is the *don't skip this* list. If a rule needs to change, it changes here first, with a one-line reason, not silently in the middle of building a feature.

## Before starting any new phase (screen, flow, or refactor)

- [ ] Confirm scope/approach in chat first if anything is ambiguous — don't guess on anything UI/UX-visible.
- [ ] Check `../../PLAN.md` for what's already decided so it isn't re-litigated.
- [ ] No `git` operations, ever, unless explicitly asked in that message.

## Every screen, before it's marked done

- [ ] Checked in **both** light and dark theme.
- [ ] Every action (submit, approve, reject, check-in, check-out, cancel) gives visible feedback — toast, inline error, or status change. No silent no-ops.
- [ ] Every form validates before submit; errors are human-readable, not raw error codes.
- [ ] Destructive actions confirm first (`AlertDialog`).
- [ ] No hardcoded hex colors — tokens from `index.css` only.
- [ ] No gradients anywhere.
- [ ] Body text is `text-sm` or smaller; no page title exceeds `text-xl`.
- [ ] Keyboard-reachable and labelled — a screen reader user isn't stuck.
- [ ] Loading state exists (skeleton or spinner) for anything async.

## Code

- [ ] One component per file, PascalCase, named export (pages excepted — default export).
- [ ] Components never import `mocks/*` directly — only through `services/`.
- [ ] No feature imports another feature's internals — shared code lives in `lib/`, `hooks/`, or `components/`.
- [ ] Status changes go through the transition table (`lib/statusTransitions.js`) — never set `.status` by hand.
- [ ] Derived data (counts, filtered lists) is a memoised selector, never stored state.
- [ ] Functions/files stay small — extract before a file passes ~150 lines.
- [ ] Comments explain *why*, not *what* — especially on anything with non-obvious complexity (the "Complexity Estimation" grading criterion lives here).

## Data & state

- [ ] All data access goes through `services/*Service.js` — nothing else knows if it's mocked or real.
- [ ] Redux slices are feature-colocated; selectors exported alongside their slice.
- [ ] Toasts are not in Redux — use `sonner` directly.

## Docs stay current

- [ ] New architecture decision → append to `../../DECISIONS.md`.
- [ ] Milestone reached → tick it in `../../PLAN.md`.
- [ ] Complexity/design reasoning for a feature → written into `design-decisions.md` **while building it**, not retroactively before the interview.

## Decisions already made — don't re-ask, don't re-litigate

Mock-only backend · Redux Toolkit · Axios · `react-icons` app-wide (incl. inside shadcn internals) · illustrations from unDraw/Storyset, recoloured · no gradients, ever · dense type scale. Full detail: `00-prd.md` § Decisions. Anything genuinely new that comes up goes through a chat confirmation first, then gets added here.
