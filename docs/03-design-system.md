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

**Rules:** never use `text-lg` or above for body copy. Reach for `font-medium`/`font-semibold` for emphasis before reaching for a bigger size. No page title exceeds `text-xl`. This dense scale is a **dashboard rule, not a marketing-site rule** — the one deliberate exception is the landing hero's `<h1>`, which uses the `font-display` utility (Sora, loaded in `index.html`, `--font-display` token in `index.css`). Revised 2026-09-22 to three explicit lines (`Go` / `beyond the` / `front desk.`) at `text-6xl sm:text-7xl lg:text-8xl` with tight `leading-[0.95]` — bigger again than the first two-line pass, deliberately filling more of the hero's vertical space (Aman: "use the upper space we have, there's a lot of space there"). The text column also got `md:self-start` (was implicitly centered via the grid's `items-center`) so it sits toward the top of the hero rather than vertically centered, for the same reason — a marketing headline is allowed to be loud in a way a data table never is.

**Gotcha worth remembering:** the line breaks are real `<br />` elements, not three `<span className="block">` siblings — sibling block-level elements get **no implicit space** between them in accessible-name computation (`dom-accessibility-api`, what `getByRole(..., { name })` uses under the hood), so "Go" and "beyond" ran together as "Gobeyond" with no space, breaking a test query. `<br />` doesn't automatically fix it either — verified via a throwaway debug test that `<br />`'s surrounding text nodes also get no implicit space; the actual fix is an explicit `{' '}` text node on either side of each `<br />`. Confirmed with `computeAccessibleName()` directly before trusting it, not just by re-running the suite until green.

## Landing hero background — interactive WebGL tubes

**Decided (2026-09-22):** the hero section's dark background (`bg-[#0B0D10]`) has an interactive cursor-following tube animation behind the content (`components/marketing/HeroTubesCanvas.jsx`), adapted from a reference Aman provided (see README § Credits — original concept by Kevin Levron, `threejs-components` library). It loads its renderer from a CDN **at runtime** via a plain `import('https://...')` rather than installing `three` as a project dependency for one decorative section — `/* @vite-ignore */` tells Vite not to try to statically bundle that URL. Colors are drawn only from the app's own brand palette (teal/coral/lime + a couple of lighter variants, no pure white — see below), never arbitrary random hex, including on the click-to-reshuffle easter egg. Skipped entirely when `import.meta.env.MODE === 'test'` so the test suite never makes a real network call; skipped just as gracefully (try/catch, console error only) if the CDN is unreachable for a real visitor — either way the hero just shows its plain dark background, never a broken page.

**Toned down, then nudged back up (2026-09-22, same day):** the reference's `lights.intensity: 200` and a pure-white light color read as much too bright/glowing behind the headline text. Turned down to `intensity: 50` first, dropped white from `LIGHT_COLORS` entirely, and added a flat `bg-black/35` scrim (not a gradient) between the canvas and the content as a second, more predictable lever — tuning a WebGL library's exact intensity scale from source alone is guesswork, the scrim guarantees a legible result regardless. Nudged back up to `intensity: 90` shortly after ("increase a little bit from the current") — 50 read as a little too flat/dim once seen live.

## Spacing, radius, shape

- Base spacing unit: Tailwind's default 4px scale, unchanged.
- Card radius: `--radius: 0.5rem` (shadcn default `rounded-lg`).
- **Primary CTAs are pill-shaped** (`rounded-full`) — the one deliberate echo of the reference's "Book a demo" button; everything else uses `rounded-lg`.
- Cards: 1px `--border`, no shadow-heavy elevation — flat design, depth from color/spacing not drop-shadows.

## `--brand-ink` / `--brand-ink-foreground` already invert per theme — never add a `dark:` override on top

**`lib/flowTheme.js`'s `frontDesk.tone` is plain `bg-brand-ink text-brand-ink-foreground` — no `dark:` prefix, and it should stay that way.** `--brand-ink`/`--brand-ink-foreground` are already redefined inside `.dark { }` in `index.css` (light mode: ink is near-black, ink-foreground is white; dark mode: ink flips to near-white, ink-foreground flips to near-black) specifically so this one class pair renders correctly in both themes without any `dark:` variant needed.

**Real bug (2026-09-22, caught from a screenshot, root-caused with a throwaway debug test dumping real computed CSS values, not guessed):** a first attempt at "make the Front Desk banner work in dark mode" added `dark:bg-white dark:text-brand-ink` on top of the base classes. That put dark mode's `--brand-ink` value — near-*white* — as the **text** color, on top of a literal `bg-white` background: near-invisible text. The fix was to remove the override entirely, not add another one; the token pair already did the right thing on its own. If a similar "X is unreadable in dark mode" report comes up again for a `brand-*` token pair, check whether the token already has a `.dark { }` redefinition in `index.css` before reaching for a `dark:` utility override — most of them do.

## Gotcha: `<TooltipTrigger asChild>` (Radix `Slot`) breaks a function-typed `className`

**Never wrap a `<NavLink>` whose `className` prop is the `({ isActive }) => string` render-prop function directly in `asChild`** (Radix `Slot`, used by `TooltipTrigger`/`PopoverTrigger`/`Button asChild`/etc.). Slot merges the wrapper's own props onto its child by string-concatenating `className`; concatenating a string with a *function* silently coerces the function to its `.toString()` via JS's usual `+` behavior, so the child's `class` attribute ends up containing the function's literal source code instead of computed Tailwind classes. `flex` (and everything else) never actually applies.

This is exactly what broke the sidebar's "icon and label on one line" — `Sidebar.jsx`'s nav `NavLink`s are wrapped in `<TooltipTrigger asChild>` (for the collapsed-state hover label). The fix: compute `isActive` yourself (`useLocation()` + a plain comparison against the route) and pass `className` as an already-resolved **string**, never a function, to anything that might end up inside `asChild`. Caught by rendering the component in a test and reading the real `outerHTML` (`element.className` printed `"({ isActive }) => cn(...) active"` — the smoking gun), not by staring at the JSX, which looked completely correct. If a similar "the classes I wrote aren't taking effect" report comes up on an `asChild`-wrapped element, check for a function-typed prop before anything else.

## Printing a QR pass — `.print-pass` / `.no-print`, no dedicated print route

**Decided (2026-09-22):** `EPassDialog` and `VisitorBadgeDialog` both got a "Print" button (`window.print()`), using a small `@media print` block in `index.css` rather than a separate print-only page/route: everything on the page is hidden except the element marked `.print-pass` (the QR + name/status block, already on screen in the dialog), and `.no-print` hides UI chrome (dialog header, the Print button itself) that shouldn't end up on paper. Simpler than a dedicated print view since the dialog already has everything needed — printing is just "that, alone, full-page."

## QR check-in scanning — scoped to walk-in visitor badges only, not invite e-passes

**Decided (2026-09-22):** `QrCheckInScanner` (Front Desk, `jsqr` for decoding) reads a `VisitorBadgeDialog` QR — which encodes the visitor's own id — looks the visitor up, and offers Check-In/Check-Out directly. It deliberately does **not** also handle the invite flow's e-pass QR (`EPassDialog`, which encodes an *invite code*, not a visitor id) — what "checking in a pre-approved invite" should actually do (create a new visitor record tied to `sourceInviteId`? transition the invite's own status?) is a real data-model question that hasn't been decided, not something to guess at silently. See `DECISIONS.md` for the full reasoning; extending the scanner to invites is a clear next step once that's answered.

Same explicit-permission pattern as `PhotoCapture` (camera never opens until "Start Scanning" is clicked) and the same ref-timing fix documented there (the `<video>` only mounts once `cameraState` is `'live'`, so `srcObject` has to be attached in an effect keyed on that state, not at the point `getUserMedia()` resolves).

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
