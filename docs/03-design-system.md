# Design System

**Mood reference:** the Traction Guest screenshots you shared — solid flat colour blocks (no gradients), bold geometric/isometric illustration accents, pill-shaped CTAs, generous whitespace, dense small-type data tables. GuestFlow takes the *mood*, not the brand — our own palette below, our own name, no copied logos/marks.

## Layout width

**Full-bleed, not boxed.** Every section (navbar, footer, landing sections, the dashboard's topbar/main) uses the `.site-container` utility (`index.css`) — fills normal/laptop screens edge to edge with responsive side padding, capped at `1600px` only so text doesn't stretch unreadably on ultra-wide monitors. This replaced an earlier `max-w-6xl` centered-box layout per Aman's "use full width" instruction.

## One color per flow — the system that ties the whole app together

`lib/flowTheme.js` defines `FLOWS = { registration, approvals, invites, frontDesk, admin }`, each with a title, icon, description, and a solid Tailwind color pair (`tone`). This single object is the **only** place a flow's color is chosen — imported by:
- The landing page's flow-card grid (`pages/LandingPage.jsx`)
- Every dashboard page's `<FlowBanner flowKey="..." />` header (`components/FlowBanner.jsx`)
- The sidebar's active-nav-item background (`components/layout/Sidebar.jsx`)

Colors: registration = coral, approvals = lime, invites = primary/teal, front desk = ink, admin = zinc. Never hardcode one of these elsewhere — add a new flow to `FLOWS` instead.

## Logo — real provided artwork, two variants

**Decided (2026-09-22, superseding the earlier "text wordmark only" call):** Aman supplied real logo artwork in `public/` — `full-logo.png` (icon + "GuestFlow" wordmark lockup, for spacious/light contexts) and `logo-icon.png` (icon mark only, transparent background, for compact/dark contexts). Rule: **full lockup wherever there's room and a light-enough surface** — desktop marketing navbar, mobile nav Sheet header, expanded sidebar, footer, the login page's mobile-only wordmark slot; **icon-only where space is tight or the surface is dark** — the marketing navbar below the `sm` breakpoint, the collapsed sidebar, the browser favicon (`index.html`), and the login page's dark left panel (dark ink text in the full lockup isn't legible on `#0B0D10`). Never re-derive the wordmark as styled text — always the provided image files. The old hand-coded `HeroIllustration.jsx` SVG and its `--gf-*` CSS custom properties were removed once real artwork replaced every usage.

## Site structure: marketing (`/`), auth (`/login`), and product (`/app/*`)

`/` is the public landing page (navbar, hero, feature/flow cards, CTA banner) styled closely on the reference mood — see `MarketingNavbar`/`MarketingLayout`/`LandingPage`. `/login` is a standalone split-screen page (dark branded panel + light form) reusing the same visual language, picking `ui.role`/`currentHostId` exactly like the in-app `RoleSwitcher` — **not a hard gate**, so the landing page's "no fake demo form, dashboard is live" CTA stays true either way. There is no `/signup` — Aman decided accounts aren't a real concept in this demo, so the page and route were removed (2026-09-22); `/signup` now renders the 404 page. The actual product (kiosk, host inbox, invites, front desk, admin) lives under `/app/*` using the dashboard shell (`AppShell`/`Sidebar`/`Topbar`). Every CTA links to a real, working route — no fabricated testimonials/client logos; where the reference has a testimonial, GuestFlow has an honest "About this project" note instead.

**The marketing hero and the login page's left panel are always dark** — a fixed brand treatment (`bg-[#0B0D10]` literal), independent of the theme toggle below. It mirrors the reference's own fixed dark hero. The landing hero uses `public/hero.png`; the login panel uses `public/login-ref.png` (a circular-badge variant of the same illustration, framed to echo the logo mark's ring motif) — both real provided artwork, not the old hand-coded SVG.

## Theme: dark/light toggle — dashboard only, never the marketing site

**Decided (2026-09-22, reversing an earlier "light-only, no toggle at all" call):** the `/app/*` dashboard has a real, working dark/light toggle (`ThemeToggle` in `Topbar`); the marketing site at `/` (and `/login`/`/signup`) never shows one and always renders light, regardless of what's picked in the dashboard.

**How the scoping works — this is the part worth remembering:** `AppShell` applies the `dark` class to **its own root `<div>`**, not to `<html>`. Since this is an SPA (client-side routing never reloads `<html>`), touching `document.documentElement` would leak dark mode into the marketing route the moment someone navigated there after toggling — so it deliberately never does that. Tailwind's `@custom-variant dark (&:is(.dark *));` in `index.css` matches *any* `.dark` ancestor, not `<html>` specifically, so scoping the class to `AppShell` is enough to make every `dark:` utility inside the dashboard (including ones baked into shadcn's own generated components) work correctly, while the marketing tree — never nested inside that div — can never match it. See `hooks/useTheme.js` for the implementation and `../../DECISIONS.md` for the bug this fixed the first time it was attempted (removing `@custom-variant dark` entirely would have let a visitor's OS dark-mode preference silently reskin the whole app with no toggle to undo it).

## Color palette — solid colors only, no gradients anywhere

Defined as CSS custom properties in `src/index.css`, in shadcn's HSL-triplet format so they plug straight into shadcn's token names. Every value below has a light and a dark variant.

### Brand

| Token | Light | Dark | Hex (light) | Used for |
|---|---|---|---|---|
| `--brand-teal` | `180 72% 38%` | `178 65% 46%` | `~#1EA6A0` | Primary actions, links, active nav. Tuned to H180 (true turquoise) — H173 read too green next to the reference mood, see DECISIONS.md |
| `--brand-coral` | `350 89% 60%` | `350 85% 65%` | `#F43F5E` | Secondary accent, illustration highlights, destructive-adjacent emphasis |
| `--brand-lime` | `82 78% 55%` | `82 70% 60%` | `#A3E635` | High-emphasis CTA fills (sparingly — one per screen, like "Confirm Invite") |
| `--brand-ink` | `221 39% 11%` | — | `#111827` | Headlines, dark-mode-only near-black surfaces |

### Neutrals (zinc scale) & semantic

| Token | Role |
|---|---|
| `--background` / `--foreground` | Page background / default text — white on light, `#0B0D0F`-ish on dark |
| `--card` / `--card-foreground` | Card surfaces, one step off background |
| `--muted` / `--muted-foreground` | Secondary text, disabled states, subtle backgrounds |
| `--border` / `--input` | 1px dividers and input borders — zinc-200 light / zinc-800 dark |
| `--ring` | Focus ring — `--brand-teal` |
| `--destructive` | `0 84% 60%` (`#EF4444`) — reject actions, delete, hard errors |
| `--success` | `142 71% 45%` (`#22C55E`) — approved, success toasts |
| `--warning` | `38 92% 50%` (`#F59E0B`) — pending, caution |

### Status badges (front-desk / visitor status — each a distinct solid color, never colour-only)

| Status | Color token | Badge text |
|---|---|---|
| `pending` | warning (amber) | "Pending" |
| `invited` | indigo `239 84% 67%` | "Invited" |
| `approved` | success (teal-green) | "Approved" |
| `rejected` | destructive (red) | "Rejected" |
| `checked-in` | blue `217 91% 60%` | "Checked In" |
| `checked-out` | muted (zinc) | "Checked Out" |
| `overstay` | destructive, solid fill (strongest visual weight — matches the reference screenshot's red OVERSTAY badge) | "Overstay" |
| `expired` | muted, with reduced opacity | "Expired" |
| `cancelled` | muted, strikethrough label | "Cancelled" |

**Rule:** define these once as a `statusVariants` map (`lib/statusTokens.js`) consumed by a single `<StatusBadge status="..." />` component. Never hardcode a status color in a page.

## Typography — smaller, denser scale than Tailwind's default

Default Tailwind body text is 16px; GuestFlow is a data-dense enterprise tool (see the front-desk table reference), so:

| Use | Class | Size |
|---|---|---|
| Meta / timestamps / helper text | `text-xs` | 11px |
| **Default body, table cells, form inputs/labels** | `text-sm` | 13px |
| Buttons, nav items | `text-sm font-medium` | 13px |
| Card/section titles | `text-base font-semibold` | 14px |
| Page titles | `text-xl font-semibold` (cap here) | 18px |
| Dashboard hero numbers only (e.g. "27" visitor count) | `text-2xl font-bold` | 22px |

**Rules:** never use `text-lg` or above for body copy. Reach for `font-medium`/`font-semibold` for emphasis before reaching for a bigger size. No page title exceeds `text-xl`.

## Spacing, radius, shape

- Base spacing unit: Tailwind's default 4px scale, unchanged.
- Card radius: `--radius: 0.5rem` (shadcn default `rounded-lg`).
- **Primary CTAs are pill-shaped** (`rounded-full`) — the one deliberate echo of the reference's "Book a demo" button; everything else uses `rounded-lg`.
- Cards: 1px `--border`, no shadow-heavy elevation — flat design, depth from color/spacing not drop-shadows.

## Date fields — shadcn Calendar via Popover, never native `<input type="date">`

**Decided (2026-09-22):** every date field is the shared `components/DatePicker.jsx` (a `Popover` + `Calendar` + a `Button` trigger showing the formatted date, `date-fns` for formatting) — not a native `<input type="date">`. The native control's styling can't be themed and looks inconsistent across browsers/OSes, which stood out against everything else being shadcn-themed. Used by `VisitorFilters` (front desk date filter) and `InviteForm` (invite date). Contract: `value`/`onChange` are still plain `'yyyy-MM-dd'` strings, same as the native input, so nothing downstream (Redux filters, validators) needed to change.

## Sidebar collapse — an edge handle, not a chevron button

**Decided (2026-09-22, superseding the earlier chevron-button toggle):** the collapse/expand control is a full-height, hover-highlighted line on the sidebar's right border (`cursor-col-resize`, no icon) instead of a button sitting in the header next to the logo. The button used to fight the logo for space in the collapsed header (`w-19`) — the edge handle needs no header space at all, so the logo (icon-only when collapsed, full lockup when expanded) can sit alone and stay legible. Same `sidebarToggled()` action either way; `aria-label`/`title` still say "Expand sidebar"/"Collapse sidebar" for accessibility.

## Iconography

**Decided: `react-icons` everywhere** — including inside shadcn's own copied components. shadcn's generated components hardcode a handful of `lucide-react` icons internally (the chevron in `Select`, the `X` in `Dialog`/`Sheet`, the check in `Checkbox`, etc.); since those components are copied source we own (not a dependency), swap those specific imports to the `react-icons` equivalent too when theming each component after install — see `06-component-library-shadcn.md`. Rule either way: **one icon set app-wide**, 18–20px default size inside buttons/inputs, consistent stroke/fill style (pick one `react-icons` subset — e.g. `react-icons/fi` (Feather-style outline) — and stay in it; don't mix `fi`/`md`/`bi` subsets on the same screen).

## Illustrations

**Decided: sourced from [unDraw](https://undraw.co) (primary) and [Storyset](https://storyset.com) (secondary)**, recoloured to the palette above — not AI-generated (the one exception is the logo mark, which no stock library has). Full sourcing plan, license notes, and the list of needed illustrations: `07-image-assets-and-prompts.md`. Used only for empty states, the kiosk landing screen, and error pages — never as decorative filler.

## Feedback rules (User Experience + Error Handling criteria)

- Every user action results in one of: a toast (success/error), an inline validation message, a status badge change, or a disabled-then-enabled button — never a silent no-op.
- Loading states: skeleton rows for tables/cards, spinner only inside buttons mid-action. `LoginPage`'s Sign In button is the reference pattern — `disabled` while pending, `FiLoader` spin icon (`animate-spin`) + "Signing in…" label swapped in for the idle label, restored (or navigated away) once the action resolves.
- Errors are human-readable ("Daily pre-approval limit reached for this host" not "Error 409").
- Destructive actions (reject, cancel invite) get a confirm step (shadcn `AlertDialog`).
