# CLAUDE.md — GuestFlow (Visitor Management System)

Project-level guide for AI-assisted development. The workspace-level rules in `../CLAUDE.md` also apply.

## What this is

A frontend-only Visitor Management System built as a case-study submission: visitor registration with photo, host approval workflow, pre-approval invites with QR e-pass, and a front-desk dashboard. Spec: `docs/requirements.md`. The original brief: `../assignment/problem-statement.md`. Grading rubric: `../assignment/instructions-and-evaluation.md`.

## Layout

```
GuestFlow/            ← git repo root AND the Vite app root (Aman scaffolded it flat — src/ lives directly here, no app/ subfolder). Aman creates the repo; the agent never runs git here.
├── src/             ← all app code. See docs/04-folder-and-naming-conventions.md for the full tree.
├── public/
├── index.html · vite.config.js · package.json · eslint.config.js
├── docs/
│   ├── 00-prd.md                      vision, personas, goals, evaluation-criteria mapping, OPEN QUESTIONS
│   ├── 01-architecture-and-data.md    backend-or-mock decision, mock data layer, service layer, data shapes
│   ├── 02-tech-stack.md               full stack + install plan
│   ├── 03-design-system.md            colors (solid, no gradients), typography, status badges, theme, feedback rules
│   ├── 04-folder-and-naming-conventions.md   full tree + naming rules — READ BEFORE CREATING ANY FILE
│   ├── 05-state-management-redux.md   slice design, transition table, selector rules
│   ├── 06-component-library-shadcn.md shadcn install/theming plan, custom MultiSelectCombobox spec
│   ├── 07-image-assets-and-prompts.md avatar strategy (initials, no images needed), illustration prompts
│   ├── RULES.md                       ← the enforcement checklist. Read this one every session.
│   ├── requirements.md                tactical spec (fields/screens/flows) — unchanged, still current
│   └── design-decisions.md            WHY + complexity table — written DURING the build, not after
└── demo/            ← screenshots / demo video referenced from README
```

**Read `docs/RULES.md` and `docs/00-prd.md` § Open decisions at the start of every GuestFlow session** — rules and open questions live there, not duplicated here.

## Stack (fixed — see `docs/02-tech-stack.md` and `../DECISIONS.md`)

- React 18+, **plain JavaScript** (`.jsx`), no TypeScript
- Vite
- Tailwind CSS + shadcn/ui (components copied into `src/components/ui/`, themed per `docs/03-design-system.md` — **no gradients anywhere**)
- React Router v6 (layout routes for role gating)
- **Redux Toolkit** for state — decided, see `docs/05-state-management-redux.md`
- **Axios** for data fetching, one shared client in `services/apiClient.js`
- **Mock data only, no real backend** — decided. `services/` simulates an API (async, latency, occasional failure) so the UI never touches raw arrays directly; architecture still supports flipping to a real backend later without touching components, but none is planned. See `docs/01-architecture-and-data.md`.
- **`react-icons` app-wide** (incl. a one-time swap inside shadcn's copied components, which default to `lucide-react`) — decided, see `docs/06-component-library-shadcn.md`.
- **Illustrations from unDraw (primary) + Storyset (secondary)**, recoloured to the palette; logo mark is AI-generated — decided, see `docs/07-image-assets-and-prompts.md`.
- All open questions resolved as of 2026-09-22 — see `docs/00-prd.md` § Decisions. Next step is scaffolding.

## Conventions

Full detail in `docs/04-folder-and-naming-conventions.md` — summary:
- **Feature-based folders:** `src/features/<flow>/` (registration, approval, invites, front-desk, admin) each with its own components, hooks, and a colocated Redux slice. Shared UI in `src/components/`, shared hooks in `src/hooks/`, utilities in `src/lib/`.
- **Data access goes through `src/services/`**, never straight to mock arrays. Swapping in a real REST API should touch only that folder.
- **State transitions are explicit.** Visitor status enforced via `lib/statusTransitions.js`'s `canTransition()`, used by the Redux reducer — invalid transitions set `state.error`, never silently mutate status. See `docs/05-state-management-redux.md`.
- **Every user action gives feedback**: success toast (`sonner`), inline validation, or an error toast with a human message. Disabled buttons while pending.
- **Comments only where the *why* isn't obvious** — especially complexity notes on search/filter/limit-check logic, since "Complexity Estimation" is a graded criterion.
- Small, named functions. No 200-line components (~150 line soft cap).
- Mock dataset should be large enough to prove performance (thousands of visitors); generate it, don't hand-write it.
- **Text sizes stay small/dense** (`text-sm` default, `text-xl` page-title cap) and **every screen is checked in both light and dark theme** before being marked done — see `docs/03-design-system.md` and `docs/RULES.md`.

## Definition of done — per flow

A flow is done when: all fields/actions in `docs/requirements.md` for that flow work · validation + invalid-transition guards exist · loading/success/error feedback exists · it works at large dataset size · dark AND light theme checked · its complexity/design entry is written in `docs/design-decisions.md` · relevant `docs/RULES.md` checklist items pass.

## Working rules for the agent

- Confirm scope before starting a new flow. Then build it end to end — no half-finished features.
- After each flow, update `docs/design-decisions.md` and tick `../PLAN.md`.
- Never run git commands or create a repository. Aman handles commits and pushes.
- Nothing from `../interview-prep/` or `../assignment/` gets copied in here.
- When Aman does a **live-change drill**, he edits the code himself; the agent only reviews afterward.

## Status

Not yet scaffolded. the GuestFlow repo root is empty. Waiting for Aman's go.
