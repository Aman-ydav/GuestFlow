# Design System

**Mood reference:** the Traction Guest screenshots you shared — solid flat colour blocks (no gradients), bold geometric/isometric illustration accents, pill-shaped CTAs, generous whitespace, dense small-type data tables. GuestFlow takes the *mood*, not the brand — our own palette below, our own name, no copied logos/marks.

## Site structure: marketing (`/`) vs product (`/app/*`)

`/` is the public landing page (navbar, hero, feature/flow cards, CTA banner) styled closely on the reference mood — see `MarketingNavbar`/`MarketingLayout`/`LandingPage`. The actual product (kiosk, host inbox, invites, front desk, admin) lives under `/app/*` using the dashboard shell (`AppShell`/`Sidebar`/`Topbar`). Every CTA on the landing page links to a real, working `/app/...` route — no fake "book a demo" forms or fabricated testimonials/client logos; where the reference has a testimonial, GuestFlow has an honest "About this project" note instead.

**Exception — the marketing hero is always dark**, regardless of the site-wide light/dark toggle (`bg-[#0B0D10]` literal, not a token). This mirrors the reference's own fixed dark hero treatment and is a deliberate brand choice, not a violation of "every screen works in both themes" — that rule is about the *product* UI (dashboard, forms, tables), which does fully theme. Everything on the landing page below the hero uses normal theme tokens.

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

## Iconography

**Decided: `react-icons` everywhere** — including inside shadcn's own copied components. shadcn's generated components hardcode a handful of `lucide-react` icons internally (the chevron in `Select`, the `X` in `Dialog`/`Sheet`, the check in `Checkbox`, etc.); since those components are copied source we own (not a dependency), swap those specific imports to the `react-icons` equivalent too when theming each component after install — see `06-component-library-shadcn.md`. Rule either way: **one icon set app-wide**, 18–20px default size inside buttons/inputs, consistent stroke/fill style (pick one `react-icons` subset — e.g. `react-icons/fi` (Feather-style outline) — and stay in it; don't mix `fi`/`md`/`bi` subsets on the same screen).

## Illustrations

**Decided: sourced from [unDraw](https://undraw.co) (primary) and [Storyset](https://storyset.com) (secondary)**, recoloured to the palette above — not AI-generated (the one exception is the logo mark, which no stock library has). Full sourcing plan, license notes, and the list of needed illustrations: `07-image-assets-and-prompts.md`. Used only for empty states, the kiosk landing screen, and error pages — never as decorative filler.

## Dark / light theme

- Strategy: `class` on `<html>` (`.dark`), not `prefers-color-scheme` alone — user-togglable, defaults to system preference on first load.
- Toggle lives in `uiSlice` (`theme: 'light' | 'dark'`), persisted to `localStorage`, applied via a `useEffect` in the app shell that sets/removes the `dark` class.
- **Every screen must be checked in both themes before it's marked done** — this is a checklist item in `RULES.md`, not optional polish.
- Status badge colors, brand tokens, and illustrations all need a dark-mode value — see the tables above.

## Feedback rules (User Experience + Error Handling criteria)

- Every user action results in one of: a toast (success/error), an inline validation message, a status badge change, or a disabled-then-enabled button — never a silent no-op.
- Loading states: skeleton rows for tables/cards, spinner only inside buttons mid-action.
- Errors are human-readable ("Daily pre-approval limit reached for this host" not "Error 409").
- Destructive actions (reject, cancel invite) get a confirm step (shadcn `AlertDialog`).
