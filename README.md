# GuestFlow — Visitor Management System

A workplace Visitor Management System (VMS): visitor registration, host approval workflow, pre-approval/invite with QR e-pass, and a front-desk check-in/check-out dashboard.

Built for the MoveInSync Frontend Intern case study.

## Tech stack

- React (JavaScript, not TypeScript) + Vite
- Redux Toolkit (state) + Axios (data fetching)
- Tailwind CSS + shadcn/ui, themed with a solid-color palette (no gradients)
- Mock data by default (no live backend — per case-study instructions to mock the API); architecture supports swapping in a real API without touching components — see `docs/01-architecture-and-data.md`

Full planning docs: [`docs/`](docs/) — start with [`docs/00-prd.md`](docs/00-prd.md) and [`docs/RULES.md`](docs/RULES.md).

## Status

Scaffolded — Vite + React lives directly in this repo (`src/`, `public/`, `package.json` at the root, no `app/` subfolder).

## Planned scope (full case-study scope)

1. **Visitor registration / kiosk check-in** — name, contact, purpose of visit, host employee, company, photo capture, auto check-in/out timestamps.
2. **Host approval workflow** — real-time request, approve/reject, badge/QR issuance on approval, security notified on denial.
3. **Pre-approval / invite flow** — host schedules a visit window in advance, visitor gets a QR/e-pass, auto-expiry if unused, per-employee daily pre-approval limits.
4. **Front-desk dashboard** — visitor list/search, guest detail panel, check-in/check-out, overstay flagging.

Full requirement breakdown: [`docs/requirements.md`](docs/requirements.md).

## Folder layout

```
GuestFlow/
├── src/     # the actual Vite + React app
├── public/
├── docs/    # requirements + design-decision notes
└── demo/    # screenshots / demo video for submission
```

## Demo

Screenshots/demo video will go in [`demo/`](demo/) and be linked here before submission.

## Credits

The landing page hero's interactive cursor-following tube background (`src/components/marketing/HeroTubesCanvas.jsx`) adapts the "Tubes Cursor" concept — original concept and implementation by [Kevin Levron](https://www.framer.com/@kevin-levron/), built on the `threejs-components` library. GuestFlow's version is a from-scratch plain-JS component (loads the renderer from a CDN at runtime, no `three`/`framer-motion` dependency added) restricted to the app's own brand palette instead of arbitrary colors.
