# Component Library — shadcn/ui Setup & Theming

## Install (not run yet — plan for when scaffolding is greenlit)

```bash
npx shadcn@latest init      # base color: neutral/zinc, CSS variables: yes, style: default
npx shadcn@latest add --all # every component in one go, per your instruction
```

If you have a specific config from the shadcn playground (theme JSON / `components.json` tweaks), paste it when we scaffold and it takes priority over the defaults above.

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

## Rules

- Aside from the icon swap above, never edit a generated `components/ui/*` file's *logic* — only its default class names, to keep future `shadcn add` updates mergeable. Visual overrides happen via the CSS variables, not by hand-editing component internals.
- One icon set (`react-icons`) app-wide, sized 16–20px inside buttons/inputs, one subset only (e.g. stick to `fi`) — see `03-design-system.md`.
- Every shadcn component used gets checked in dark mode before a screen is marked done.
