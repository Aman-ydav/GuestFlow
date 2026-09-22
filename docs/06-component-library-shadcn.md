# Component Library — shadcn/ui Setup & Theming

## Install — done

35 components installed and themed (base color neutral/zinc, CSS variables, "new-york" style). `add --all` itself hit a broken experimental registry block and was replaced with an explicit curated list — see `DECISIONS.md` for that specific fix.

## Theming after install

shadcn writes its own default CSS variables into `index.css` on init. Immediately after, every token gets overridden with GuestFlow's palette from [`03-design-system.md`](03-design-system.md) — same variable names (`--primary`, `--secondary`, `--accent`, `--destructive`, `--background`, `--foreground`, `--muted`, `--card`, `--border`, `--input`, `--ring`, `--radius`), just our values instead of shadcn's defaults, for both `:root` and `.dark`. This is the **only** place theme colors are defined — no component overrides a token locally.

## Components to install (all of them, grouped by where they're used)

| Group | Components | Used for |
|---|---|---|
| Form primitives | `button`, `input`, `label`, `textarea`, `select`, `checkbox`, `radio-group`, `switch`, `form`, `calendar`, `popover`, `command` | Registration form, invite form, admin config |
| Data display | `table`, `card`, `badge`, `avatar`, `separator`, `tabs`, `accordion`, `tooltip`, `skeleton`, `progress` | Front-desk table, guest details, dashboards |
| Overlays | `dialog`, `sheet`, `alert-dialog`, `dropdown-menu`, `hover-card`, `sonner` (toast) | Guest details panel (`sheet`), confirm-reject (`alert-dialog`), notifications menu |
| Navigation | `navigation-menu`, `breadcrumb`, `pagination` | App shell nav, table pagination |

Since the instruction is "install all in one go," `add --all` covers everything above and more — unused ones just sit in `components/ui/` unreferenced, which is harmless (they're source files, not bundled unless imported).

## Custom component: the multi-select combobox (your spec)

**Requirement, restated precisely:** it should look like a `Select` (bordered trigger box, placeholder text, chevron icon) — not a plain multi-select dropdown with checkboxes inline. Once items are picked, they render as **removable chips in a list below the trigger**, exactly like the "ADDED GUESTS" panel in the Invite Visitor reference screenshot (avatar-initial circle + name + ✕).

**Structure:**

```
<MultiSelectCombobox>
  <SelectStyledTrigger>              ← looks like shadcn Select, opens on click
    <Popover>
      <Command>                       ← searchable list (Command's built-in filter)
        <CommandInput placeholder="Search by name, id, email or phone" />
        <CommandList>
          <CommandItem /> × N          ← click to add, already-selected items shown checked/disabled
        </CommandList>
      </Command>
    </Popover>
  </SelectStyledTrigger>
  <SelectedChipsList>                 ← BELOW the trigger, not inside it
    {value.map(item => <Chip key={item.id}>{item.avatar}{item.name}<RemoveButton /></Chip>)}
  </SelectedChipsList>
</MultiSelectCombobox>
```

**Props contract:** `options`, `value` (array of ids), `onChange(nextValue)`, `placeholder`, `searchPlaceholder`, `renderChip?`, `maxItems?`. Lives in `components/MultiSelectCombobox/` as a shared primitive — used by the invite form's guest picker and anywhere else a multi-pick is needed (e.g. admin office multi-select).

Built from shadcn's `Command` + `Popover` + `Badge`, not a new dependency.

## Icon swap inside shadcn internals (react-icons decision)

shadcn's generated components import specific `lucide-react` icons directly (e.g. `Select`'s chevron, `Dialog`/`Sheet`'s close `X`, `Checkbox`'s check, `Calendar`'s arrows). Since `react-icons` was chosen app-wide, do a one-time pass after `add --all`: find every `from "lucide-react"` import inside `components/ui/*` and swap it for the equivalent `react-icons/fi` (Feather-style, matches lucide's outline look most closely) icon, keeping the same size/className props. This is a deliberate, documented exception to "don't edit generated component internals" — log each file touched in a short list here once done, so a future `npx shadcn add` re-sync knows what to redo.

## Select — reskinned to match a specific reference (deliberate exception)

`components/ui/select.jsx` was reskinned to match a reference screenshot (iOS-style): the trigger and the open option list render as one seamless rounded card with a colored divider between them (`position="popper"`, `sideOffset=0`, trigger's bottom corners square off on open, content's top corners square off to meet it), bigger item padding, `rounded-lg` item highlight instead of `rounded-sm`. Same precedent as the icon swap — a documented, intentional edit to generated component internals, not a style hack layered on top.

## `sonner.jsx` — a third documented exception, and a real bug it caused

`components/ui/sonner.jsx`'s `Toaster` was edited beyond the icon swap: its `next-themes` import (Next.js-only, broken in Vite) was replaced with the app's own `hooks/useTheme.js` early on, and its inline `style` prop (`--normal-bg`, `--normal-text`, `--normal-border`) had a real bug — those were set to bare `var(--popover)` etc., but `--popover`/`--popover-foreground`/`--border` in `index.css` are bare HSL triplets, not full CSS colors (every other usage wraps them in `hsl(var(--x))`). The unwrapped version is invalid CSS the browser silently drops, so every toast was quietly falling back to Sonner's own built-in colors instead of the app's theme, in both light and dark mode, until caught and fixed (2026-09-22) — see `DECISIONS.md`.

## Rules

- Aside from the icon swap, the `Select` reskin, and `sonner.jsx` above, never edit a generated `components/ui/*` file's *logic* — only its default class names, to keep future `shadcn add` updates mergeable. Visual overrides happen via the CSS variables, not by hand-editing component internals.
- One icon set (`react-icons`) app-wide, sized 16–20px inside buttons/inputs, one subset only (e.g. stick to `fi`) — see `03-design-system.md`.
- Every shadcn component used gets checked in dark mode before a screen is marked done.
