# Product Requirements Document — GuestFlow

Strategic layer. Tactical spec (fields, screens, workflows) is [`requirements.md`](requirements.md) — don't duplicate it here, reference it.

## Vision

A visitor management system that makes a workplace feel secure without making a guest feel interrogated. Every visitor is known, approved, and tracked — with zero friction for the host and zero ambiguity for security.

## Who uses it (personas)

| Persona | Goal | Screen |
|---|---|---|
| **Visitor** | Get checked in fast, know what's happening with their request | Kiosk registration, invite QR redemption |
| **Host** (employee) | Approve/reject with one tap, pre-schedule guests without thinking about it again | Host inbox, invite form |
| **Front desk / security** | See who's in the building right now, resolve overstays, handle walk-ins | Front-desk dashboard |
| **Admin** | Keep the whole system honest — limits, offices, audit trail | Admin config panel |

## Problem statement

Manual visitor logs (paper registers, ad-hoc calls to reception) are slow, unauditable, and give hosts no control over who's let in under their name. GuestFlow replaces that with a system where every entry has a named approver, a timestamp, and a photo.

## Goals (what "done" means for the assignment)

1. All four flows in [`requirements.md`](requirements.md) work end-to-end with mock data.
2. Every action visibly succeeds or fails — no silent state changes.
3. The UI reads as a real product, not a prototype: consistent spacing, one icon set, no placeholder lorem ipsum in the final pass.
4. The six evaluation criteria in [`../../assignment/instructions-and-evaluation.md`](../../assignment/instructions-and-evaluation.md) are each demonstrably addressed — see mapping below.
5. Dark and light theme both work on every screen, not just the first one built.

## Non-functional requirements

- **Performance:** smooth interaction (search, filter, table scroll) at 5,000+ mock visitors. No visible jank typing in a search box.
- **Accessibility baseline:** every interactive element keyboard-reachable, labelled inputs, visible focus states, colour never the only signal (status = badge text + colour, not colour alone).
- **Responsiveness:** front-desk dashboard and forms usable down to a tablet width (768px); kiosk view should also work on a large touch display.
- **Consistency:** one typography scale, one color token set, one icon set — enforced via [`RULES.md`](RULES.md), not left to per-component judgment.

## Scope (this submission)

In scope: the four flows, role switching (no real auth), mock data layer, dark/light theme, GitHub submission with README + demo.
Out of scope for v1: real backend/auth (see [`01-architecture-and-data.md`](01-architecture-and-data.md) for the open question on this), email/SMS delivery (simulated in-app instead), multi-office beyond a config field.

## Evaluation-criteria mapping

| Criterion | Where it's demonstrated |
|---|---|
| Complexity estimation | [`design-decisions.md`](design-decisions.md) complexity table, filled during build |
| User experience | [`03-design-system.md`](03-design-system.md) feedback rules — every action has a visible outcome |
| Error handling | [`05-state-management-redux.md`](05-state-management-redux.md) invalid-transition guards; form validation rules |
| Performance | Large mock dataset test, memoised selectors, virtualization at scale (see architecture doc) |
| Scalability | Feature-based structure, service layer abstracted from mock vs. real API ([`01-architecture-and-data.md`](01-architecture-and-data.md)) |
| Functionality | All four flows, tracked in root [`../../PLAN.md`](../../PLAN.md) |

## Decisions (resolved 2026-09-22)

- **Backend:** mock-only, no real backend. See `01-architecture-and-data.md`.
- **Icon library:** `react-icons` app-wide, including a one-time swap inside shadcn's copied components (which default to `lucide-react`). See `03-design-system.md` and `06-component-library-shadcn.md`.
- **Illustrations:** curated from unDraw (primary, no attribution needed) + Storyset (secondary, attribution required on free tier), recoloured to the palette. Logo mark is the one AI-generated exception. See `07-image-assets-and-prompts.md`.
- **`npx skills add https://github.com/Leonxlnx/taste-skill`:** confirmed legitimate (public repo, documented, listed on multiple skill marketplaces) — runs at scaffold time, not a blocking question.

No open questions remaining as of 2026-09-22. Next: scaffold `GuestFlow/`.
