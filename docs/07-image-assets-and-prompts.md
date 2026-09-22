# Image Assets & Illustration Sourcing

## Avatars — no images needed

The reference screenshots use **coloured-initial badges** ("DB", "LM", "TN", "AT"), not photos. Build one `<AvatarInitials name="Lalita Mehta" />` component: initials from first+last name, background colour picked deterministically from a fixed palette (hash the name → index into `[teal, coral, indigo, blue, darkened-lime]`) so it's stable per person. No images, no network dependency.

The one place a real **photo** is needed is the visitor kiosk registration ("Mandatory Photo Capture") — that's a live `getUserMedia()` webcam capture, not a static asset.

Optional fallback for seed-data variety only (not the default): [DiceBear](https://www.dicebear.com/) — free, MIT-licensed, works as a plain URL, no download: `https://api.dicebear.com/9.x/notionists/svg?seed=Lalita%20Mehta`.

## Illustrations — sourced from free libraries, not AI-generated

**Decided:** curated from **unDraw** (primary) and **Storyset** (secondary), recoloured to GuestFlow's palette. Not AI-generated — the exception is the logo mark (below), which no stock library has.

### Sources & license notes

| Library | License | Recolor | Notes |
|---|---|---|---|
| **[unDraw](https://undraw.co)** — primary | Free, **no attribution required** (open-source style license) | Built into the site: paste a hex before downloading | Illustrations are single flat colour by default — this is *why* it's the primary pick, it matches "solid colors, no gradients" natively |
| **[Storyset](https://storyset.com)** (Freepik) — secondary | Free tier **requires attribution** (a visible credit link) unless you have a paid Freepik/Storyset license | Built-in color editor per illustration, can be multi-color — recolor down to 2–3 of our tokens | Use only if unDraw doesn't have a matching concept; if used on the free tier, add the attribution line to the README, don't skip it |
| Other free options if neither fits: **Humaaans** (humaaans.com, free, mix-and-match parts), **ManyPixels Gallery** (free tier), **DrawKit** (free bundle) | Check each one's specific license before using | — | Only reach for these if unDraw/Storyset genuinely lack the concept |

### Rule: recolor everything to the palette before saving

Whatever the source, every illustration gets recoloured to **1–2 tokens from `03-design-system.md`** (teal `#14B8A6`, coral `#F43F5E`, lime `#A3E635`, ink `#111827`) before export — never keep a library's default color scheme as-is, and never anything with a gradient (unDraw/Storyset are both flat by default, so this should rarely need fixing).

### What's needed, with search terms

| File | Search on unDraw / Storyset | Used for |
|---|---|---|
| `empty-front-desk.svg` | "empty", "no data", "inbox zero" | Front-desk table with zero visitors |
| `empty-inbox.svg` | "well done", "selection", "checklist" | Host inbox with no pending requests |
| `kiosk-welcome.svg` | "welcome", "in thought", "opened door" | Visitor kiosk landing screen |
| `404-not-found.svg` | "page not found", "404" | Not-found route |
| `access-denied.svg` | "access denied", "security", "not authorized" | Role-gated route blocked |

Save to `public/illustrations/<kebab-case-name>.svg` per the naming convention in `04-folder-and-naming-conventions.md`.

### Status update — what actually shipped vs. what's still open

**Decided (later, superseding the plan above): no icon logo mark in-page at all** — navbar/sidebar/footer use a text-only wordmark ("Guest" + primary-colored "Flow"), see `03-design-system.md` § Logo. A small mark is still useful for the **favicon** (a browser tab needs *something*, and a wordmark doesn't work at 16–32px) — that prompt is below, updated to the current palette.

**Empty states currently use a plain icon + text** (`FiInbox`, `FiUsers`, etc. from `react-icons/fi`) rather than a full illustration — faster to ship, and consistent with the rest of the app's icon language. The unDraw/Storyset sourcing plan above is still the right call **if/when richer empty-state illustrations are added as a polish pass** — treat the table above as ready-to-use, not obsolete.

### AI-generated prompts — logo mark, favicon, and an alternative hero illustration

All three: **flat, solid color only, no gradients, no drop shadows, transparent background ("no background" per Aman's instruction)**, using GuestFlow's actual palette — teal `#1EA6A0`, coral `#F4527A`, ink `#14213A`, white. Save each under `public/` per the naming convention in `04-folder-and-naming-conventions.md`.

**1. `guestflow-mark.svg` → also used as `public/favicon.svg`** (browser tab icon — the only place an icon mark still appears)
> Prompt: "Minimalist flat vector logo icon, single solid color #1EA6A0, no gradients, no shadows, no text, transparent background: an abstract open door or gate silhouette merging into a simple checkmark or forward-arrow shape, geometric, square 512×512 canvas, bold enough to read clearly as a 16×16px browser favicon."

A basic placeholder favicon (`public/favicon.svg`) already exists (a simple teal rounded-square with a checkmark) — this prompt is for a more polished replacement.

**2. `hero-illustration-alt.svg`** (optional replacement for the current hand-coded `HeroIllustration.jsx` SVG, if a more polished/organic version is wanted)
> Prompt: "Flat isometric vector illustration, solid colors only — teal #1EA6A0, coral #F4527A, ink #14213A, white — no gradients, no drop shadows, transparent background: three stacked, staggered office floor plates viewed in isometric perspective, each with 2–3 simple minimal human silhouettes (circle head, rounded rectangle body, no facial detail) standing near a small reception desk or door accent in coral, a couple of small parked-car shapes at ground level, clean geometric edges suitable for SVG, square composition, no text, no logos."

If generated, swap it in by replacing the JSX body of `src/components/marketing/HeroIllustration.jsx` with an `<img src="/illustrations/hero-illustration-alt.svg" ... />` (or inline the new SVG directly) — keep the same `className` contract (`h-auto w-full max-w-xs md:max-w-sm`) so the hero grid layout doesn't need touching.

**3. Empty-state illustrations** (only if upgrading from the current icon-only empty states) — use the unDraw/Storyset sourcing table above; no new AI prompts needed since flat single-color stock illustrations already exist for these common concepts.

## What I don't need sourced

- Client/company logos — not applicable, this isn't a marketing site, and fabricating fake client logos as social proof would be dishonest (see the landing page's "About this project" section instead of a testimonials wall).
- Stock photography — the design is illustration/icon-led, matching the reference mood.
