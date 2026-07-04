/** Per-package README quality sections. Falls back to auto-detected defaults. */
export const qualityOverrides = {
  "data-grid": {
    accessibility: [
      "Grid uses native `<table>` semantics with sortable column headers.",
      "Roving cell focus: Arrow keys, Home/End, Page Up/Down; Space toggles row selection; Enter fires `loomi-row-action`.",
      "Module toolbars expose labelled controls (`aria-label` on filters and actions)."
    ],
    responsive: [
      "Horizontal scroll inside `.grid-wrap` on narrow viewports; table keeps a minimum width.",
      "Toolbar and footer groups stack below `768px`."
    ],
    darkMode: [
      "Shell, headers, and cells use `--loomi-data-grid-*` aliases mapped to semantic surface/text tokens."
    ]
  },
  "command-palette": {
    accessibility: [
      "Modal dialog with `aria-modal`, labelled search field, and listbox-style results.",
      "Arrow keys move selection; Enter runs command; Escape closes and restores focus.",
      "Global shortcut (default ⌘K / Ctrl+K) documented for power users."
    ],
    responsive: [
      "Dialog uses full viewport width below `640px` with reduced top padding."
    ],
    darkMode: ["Dialog surfaces use `--loomi-command-*` aliases bound to semantic tokens."]
  },
  "filter-builder": {
    accessibility: [
      "Filter logic toggle uses `aria-pressed`.",
      "Each rule row exposes labelled field, operator, and value controls.",
      "Remove actions include an accessible name."
    ],
    responsive: ["Rule rows stack vertically below `720px`."],
    darkMode: ["Panel background and text use `--loomi-filter-*` semantic aliases."]
  },
  "date-range-picker": {
    accessibility: [
      "Popover pairs with calendar keyboard navigation.",
      "Preset and comparison controls are labelled."
    ],
    responsive: ["Popover layout reflows on narrow viewports (single-column presets)."],
    darkMode: ["Popover shell uses `--loomi-date-*` semantic aliases."]
  },
  calendar: {
    accessibility: [
      "Calendar grid with `aria-selected` days and roving focus.",
      "Previous/next month buttons are labelled; Escape closes popover parents."
    ],
    responsive: ["Minimum width scales down; day cells shrink on small screens."],
    darkMode: ["Day cells and chrome use `--loomi-calendar-*` aliases tied to semantic tokens."]
  },
  chart: {
    accessibility: [
      "SVG root exposes `role=\"img\"` with a descriptive `aria-label`.",
      "Interactive hits remain pointer-driven; provide a text summary nearby for critical data."
    ],
    responsive: [
      "SVG scales to container width; legend wraps below `640px` when positioned horizontally."
    ],
    darkMode: [
      "Grid lines and axis labels use `--loomi-surface-border` and `--loomi-text-muted` instead of raw gray ramps."
    ]
  },
  table: {
    accessibility: ["Uses native table semantics; sortable headers are buttons with state."],
    responsive: ["Horizontal scroll wrapper when columns exceed viewport."],
    darkMode: ["Row and header backgrounds use semantic surface tokens."]
  },
  select: {
    accessibility: [
      "WAI-ARIA combobox pattern: `aria-expanded`, `aria-activedescendant`, typeahead, Arrow/Enter/Escape."
    ],
    responsive: ["Dropdown width matches trigger; long lists scroll inside the panel."],
    darkMode: ["Trigger and menu surfaces use `--loomi-surface` / `--loomi-text` tokens."]
  },
  modal: {
    accessibility: [
      "`aria-modal=\"true\"`, focus trap, Escape to close, body scroll lock via `@loomidev/core`."
    ],
    responsive: ["Dialog width capped with `min()`; footer actions wrap on small screens."],
    darkMode: ["Dialog, header, and footer backgrounds use semantic surface tokens."]
  },
  drawer: {
    accessibility: ["Same overlay contract as modal; labelled close control."],
    responsive: ["Full-width sheet on mobile; side inset from `768px`."],
    darkMode: ["Panel uses `--loomi-surface` and border tokens."]
  },
  tab: {
    accessibility: [
      "WAI-ARIA tabs pattern with `role=\"tablist\"`, roving tabindex, Arrow/Home/End keys.",
      "See APG link in README."
    ],
    responsive: ["Tab list scrolls horizontally when tabs overflow."],
    darkMode: ["Active tab indicator uses primary tokens on semantic surfaces."]
  },
  button: {
    accessibility: ["Native `<button>`; visible `:focus-visible` ring."],
    responsive: ["Inline-flex; wraps with parent flex containers."],
    darkMode: ["Filled variants use primary palette; secondary uses semantic surfaces."]
  },
  input: {
    accessibility: ["Native input with associated label slot / `aria-*` from form context."],
    responsive: ["`width: 100%` within flex layouts."],
    darkMode: ["Field background `--loomi-surface`; border `--loomi-surface-border`."]
  },
  card: {
    accessibility: [
      "When `url` is set, the card behaves as a link: `role=\"link\"`, keyboard activation, focus ring.",
      "Compose headings with `loomi-card-title` for page structure."
    ],
    responsive: ["Block-level; padding tightens on narrow viewports."],
    darkMode: ["Card surface and border use semantic tokens."]
  },
  "empty-state": {
    accessibility: [
      "`role=\"status\"` region labelled by the heading.",
      "Decorative illustration is hidden from assistive tech; action button is a native `<button>`."
    ],
    responsive: ["Centered column with reduced padding below `640px`."],
    darkMode: ["Text uses `--loomi-text` / `--loomi-text-muted`; not raw gray ramps."]
  },
  listview: {
    accessibility: ["`role=\"list\"` container with `role=\"listitem\"` rows."],
    responsive: ["Rows span full width; compact density reduces vertical padding."],
    darkMode: ["Dividers and text use semantic surface/text tokens."]
  },
  "horizontal-line-graph": {
    accessibility: [
      "`role=\"img\"` with an `aria-label` summarizing segment percentages.",
      "Legend repeats segment labels for sighted users."
    ],
    responsive: ["Legend wraps on narrow viewports."],
    darkMode: ["Track and legend text use semantic muted/text tokens."]
  }
};

export const categoryQuality = {
  forms: {
    accessibility: [
      "Form controls use native elements or documented ARIA patterns (combobox, switch, etc.).",
      "Validation messages should be associated via `aria-describedby` in your app shell."
    ],
    responsive: ["Controls default to `width: 100%` in stacked form layouts."],
    darkMode: ["All packages in this category should use semantic surface/text tokens."]
  },
  navigation: {
    accessibility: [
      "Menus, sidebars, and palettes expose landmarks, labels, and keyboard shortcuts.",
      "Focus is trapped in modal navigation surfaces until dismissed."
    ],
    responsive: ["Navigation collapses to sheets or horizontal scroll on mobile."],
    darkMode: ["Chrome and panels use semantic tokens, not fixed light-gray fills."]
  },
  content: {
    accessibility: [
      "Data display components expose text alternatives (`aria-label`, visible labels, table semantics).",
      "Decorative visuals are hidden from assistive technologies."
    ],
    responsive: ["Charts, tables, and cards scale to container width; overflow scrolls internally."],
    darkMode: ["Surfaces and typography use semantic Loomi tokens."]
  }
};
