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

### Status update — what actually shipped

**Decided (2026-09-22, superseding both the AI-generation-prompt plan below and the later "text-only wordmark" call): Aman provided real logo/hero artwork directly**, dropped into `public/` — no AI generation needed, the section below is kept only as a historical record of what was planned before that. The real assets:

| File | Used for |
|---|---|
| `public/full-logo.png` | Icon + "GuestFlow" wordmark lockup — desktop marketing navbar, mobile nav Sheet header, expanded sidebar, footer, login page's mobile-only slot |
| `public/logo-icon.png` | Icon mark only, transparent background — compact marketing navbar (below `sm`), collapsed sidebar, browser favicon, login page's dark left panel |
| `public/hero.png` | Landing page hero illustration (replaced the hand-coded `HeroIllustration.jsx`, which was deleted along with its now-unused `--gf-*` CSS custom properties in `index.css`) |
| `public/login-ref.png` | Circular-badge variant of the same illustration, framed with a ring echoing the logo mark — used on the login page's dark left panel instead of the landing hero image |

See `03-design-system.md` § Logo for the full/icon placement rule.

**Empty states currently use a plain icon + text** (`FiInbox`, `FiUsers`, etc. from `react-icons/fi`) rather than a full illustration — faster to ship, and consistent with the rest of the app's icon language. The unDraw/Storyset sourcing plan below is still the right call **if/when richer empty-state illustrations are added as a polish pass** — treat that table as ready-to-use, not obsolete.

### Superseded — original AI-generation prompts (kept for history only, not used)

The plan had been to AI-generate a logo mark/favicon and an alternative hero illustration (flat, solid-color, no gradients, transparent background, GuestFlow's palette) if nothing better turned up. That never happened — Aman supplied finished artwork instead (above), so these prompts were never run.

## What I don't need sourced

- Client/company logos — not applicable, this isn't a marketing site, and fabricating fake client logos as social proof would be dishonest (see the landing page's "About this project" section instead of a testimonials wall).
- Stock photography — the design is illustration/icon-led, matching the reference mood.
