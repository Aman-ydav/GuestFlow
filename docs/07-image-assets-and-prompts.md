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

### The one thing still AI-generated: the logo mark

No stock library has a "GuestFlow" brand mark — this one needs generating.

**`guestflow-mark.svg`** (app logomark — nav + favicon):
> Prompt: "Minimalist flat vector logo icon, single solid color #14B8A6, no gradients, no shadows, no text: an abstract open door or gate silhouette merging into a simple checkmark or forward-arrow shape, geometric, square 512×512 canvas, transparent background, suitable for a small favicon at 32px."

Save to `public/logo/guestflow-mark.svg` and a simplified version as `public/favicon.svg`.

## What I don't need sourced

- Client/company logos — not applicable, this isn't a marketing site.
- Stock photography — the design is illustration-led, matching the reference mood.
