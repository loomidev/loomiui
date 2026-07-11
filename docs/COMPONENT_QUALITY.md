# Component quality standards

Every interactive `@loomidev/*` component should meet these three bars before release:

1. **Accessibility** — keyboard operable, correctly labelled, visible focus
2. **Responsive** — usable on narrow viewports without horizontal page overflow
3. **Dark mode** — surfaces and text flip via semantic Loomi tokens

Run `pnpm audit:quality` to check README coverage and common token anti-patterns.

---

## Accessibility

### Prefer native elements

Use `<button>`, `<a>`, `<input>`, and `<select>` before custom clickable surfaces. When a
`<div>` must be interactive, add `role`, `tabindex="0"`, keyboard handlers, and
`:focus-visible` styling.

### ARIA

- **Decorative icons/images:** `aria-hidden="true"` and empty `alt=""`, or omit from the
  accessibility tree when redundant with visible text.
- **Live regions / status:** `role="status"` with `aria-label` or `aria-labelledby`.
- **Lists:** `role="list"` / `role="listitem"` (or semantic `<ul>`/`<li>` in light DOM).
- **Overlays:** `aria-modal="true"`, focus trap, Escape to dismiss, restore focus on close.
- **Comboboxes:** follow APG patterns (`aria-expanded`, `aria-activedescendant`) like
  `@loomidev/select`.

### Keyboard

Document supported keys in each package README (`## Accessibility`). At minimum:

- `Tab` / `Shift+Tab` — reach all controls
- `Enter` / `Space` — activate buttons and links
- `Escape` — close overlays
- Arrow keys — lists, tabs, grids, menus where applicable

### Focus

Use `:focus-visible` rings bound to `--loomi-focus-ring` or `--loomi-primary-600`. Never
remove focus outlines without a visible replacement.

### Strings

Default aria labels and button text belong in `@loomidev/core` locales (`loomiT()`), not
hard-coded English in component source.

---

## Responsive behavior

### Layout rules

- `:host { display: block; }` and `width: 100%` / `min-width: 0` on flex children
- Prefer `flex-wrap`, `overflow-x: auto`, and `min()`/`clamp()` over fixed pixel widths
- Break at **`768px`** unless a component needs a different breakpoint (document it)
- Toolbars and filter rows should **stack vertically** below `768px`
- Data-heavy components (grid, table, chart legend) may scroll horizontally inside their
  shell — not the page

Document breakpoints and mobile behavior under `## Responsive behavior` in README.

---

## Dark mode

Dark mode is toggled by adding **`.dark`** on `<html>` (via `@loomidev/theme-switcher` or
Pro `@loomdev-pro/themes`). Components must **not** use `prefers-color-scheme` directly
except inside `theme-switcher`.

### Semantic tokens (required for surfaces and text)

| Role | Token |
|------|--------|
| Card / panel background | `var(--loomi-surface)` |
| Page / muted background | `var(--loomi-surface-muted)` |
| Hover row / subtle fill | `var(--loomi-surface-hover)` |
| Borders | `var(--loomi-surface-border)` |
| Primary text | `var(--loomi-text)` |
| Secondary / labels | `var(--loomi-text-secondary)` |
| Muted helper text | `var(--loomi-text-muted)` |
| Text on primary buttons | `var(--loomi-text-on-primary)` or `var(--loomi-white)` |

**Avoid** `--loomi-gray-*`, `#ffffff`, and `#fff` for surfaces or body text — they do not
flip under `:host-context(.dark)`.

Brand accents (`--loomi-primary-*`, `--loomi-success-*`, chart series colors) may stay on
palette tokens.

Document token usage under `## Dark mode` in README.

---

## README template

Add these sections to every interactive component README (before
`## Attributes`):

```markdown
## Accessibility
- …

## Responsive behavior
- …

## Dark mode
- Uses semantic `--loomi-surface` / `--loomi-text` tokens; respects `.dark` on `<html>`.
```

Category packages (`forms`, `navigation`, `content`) summarize shared expectations and link
here.

---

## Related docs

- [`HOW_THIS_PROJECT_WORKS.md` §11](HOW_THIS_PROJECT_WORKS.md#11-events-forms-and-accessibility)
- [`CONTRIBUTING.md` §7](../CONTRIBUTING.md#7-the-theming-model-so-you-dont-break-it)
- [`packages/theme/README.md`](../packages/theme/README.md)
