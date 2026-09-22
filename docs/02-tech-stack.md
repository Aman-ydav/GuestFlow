# Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Build tool | Vite | Fast dev server, simple config, standard for a React SPA case study |
| Language | JavaScript (no TypeScript) | Decided in `../../DECISIONS.md` — plain JS by choice |
| UI library | React 18 | Required by the JD/assignment fit |
| Routing | React Router v6 | Layout routes for role gating, nested routes for front-desk detail panel via URL |
| State | Redux Toolkit | Explicitly requested; see `05-state-management-redux.md` |
| Data fetching | Axios (via one shared client) | Requested; also gives interceptors for a consistent error shape, real or mocked |
| Styling | Tailwind CSS | Utility-first, pairs with shadcn/ui, easy theming via CSS variables |
| Components | shadcn/ui (Radix primitives) | Copied source, not a dependency — full control to theme; see `06-component-library-shadcn.md` |
| Icons | `react-icons` app-wide, incl. swapped into shadcn's own copied components (which default to `lucide-react`) | Decided 2026-09-22 |
| Illustrations | Curated from unDraw (primary) + Storyset (secondary), recoloured to palette | Decided 2026-09-22 — see `07-image-assets-and-prompts.md` |
| Dates | `date-fns` | Small, tree-shakeable, no moment.js bloat |
| Class merging | `clsx` + `tailwind-merge` (`cn()` helper — shadcn ships this) | Standard shadcn pattern |
| Toasts | shadcn `sonner` | Not put in Redux — see state-management doc for why |
| Testing | Vitest + React Testing Library | Fast, Vite-native, matches interview-prep testing track |
| Linting | ESLint + Prettier | Code quality criterion |
| Mock data generation | Hand-rolled generators in `mocks/generators/` (optionally `@faker-js/faker` if you want more variety) | Keeps the dependency list honest for a case study |

## Explicitly not used

- **TypeScript** — decided against; JSDoc + boundary validation instead (see interview-prep `jd-breakdown.md` for the honest interview answer on this).
- **Angular / Signals / RxJS** — not the assignment's framework choice.
- **CSS-in-JS** — Tailwind covers it; no styled-components/emotion.
- **Gradients anywhere in the UI** — solid colors only, see `03-design-system.md`.

## Package install plan (not run yet — waiting on the open questions)

```bash
npm create vite@latest . -- --template react
npm install @reduxjs/toolkit react-redux react-router-dom axios date-fns react-icons
npx shadcn@latest init
npx shadcn@latest add --all        # every component in one go, then themed per 06-component-library-shadcn.md
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"   # frontend design-taste skill, confirmed legitimate
```
(Run inside `GuestFlow/`, once scaffolding is greenlit.)
