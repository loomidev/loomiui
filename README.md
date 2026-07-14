# LoomiUI

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**Themeable, framework-agnostic web components built with Lit.** Pick a color palette,
override it from your own CSS, compose components from independent attributes — the
Laravel Blade-style component ergonomics translated to standards-based
custom elements that work in any framework, or none at all.

📖 **Full docs, live previews and every component's API → [loomiui.com](https://loomiui.com)**

```html
<loomi-button color="error" outline radius="full" icon="trash">Delete</loomi-button>
```

## Why LoomiUI

- **It's just HTML.** Every component is a real custom element — drop it into React,
  Vue, Angular, Svelte, a static site, or nothing at all. No wrapper libraries needed.
- **Theme without a build step.** Colors resolve through CSS custom properties
  (`--loomi-*`). Override them from your own page CSS and every component re-skins
  instantly — no Tailwind install, no rebuild, on the consumer's side.
- **Zero runtime Tailwind.** Tailwind is compiled once at *our* build time and inlined
  into each component's Shadow DOM styles. Nothing Tailwind-related ships to you.
- **Install only what you need.** 46 components, each its own npm package — pull in a
  single button or the entire library.
- **Real form participation.** Every form control is form-associated via
  `ElementInternals` — they submit inside a native `<form>` like any built-in input.
- **An MCP server included.** [`@loomidev/mcp-server`](packages/mcp-server) lets AI coding
  assistants (Claude Code, Cursor, etc.) look up real attribute tables instead of
  guessing. See [below](#ai-assisted-development).

> **Status:** LoomiUI is pre-1.0. Every package is versioned independently starting at
> `0.x` — expect breaking changes between minor versions until packages reach `1.0`.

## Quick start

Try it with no install at all, straight from a CDN:

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/button"></script>

<loomi-button>Hello LoomiUI</loomi-button>
```

Or install it properly:

```bash
npm install @loomidev/button lit
```

```js
import "@loomidev/button"; // registers <loomi-button>
```

```html
<loomi-button color="primary" icon="check">Save changes</loomi-button>
```

## Two ways to install

### Install everything

```bash
npm install @loomidev/components lit
```

```js
import "@loomidev/components"; // registers every LoomiUI element
```

### Install just what you need

Each component is its own package, depending only on the tiny shared `@loomidev/core` and
`@loomidev/theme` (pulled in automatically).

```bash
npm install @loomidev/select @loomidev/datepicker lit
```

```js
import "@loomidev/select";
import "@loomidev/datepicker";
```

You can also install a whole category at once — see [`@loomidev/forms`](packages/forms),
[`@loomidev/content`](packages/content), [`@loomidev/navigation`](packages/navigation) — or
cherry-pick a single component from the umbrella package:
`import "@loomidev/components/button"`.

> Install `lit` alongside LoomiUI packages. This lets your app use one shared Lit version
> instead of each Loomi package bringing its own copy.

## Theming

Override any palette slot from your own page CSS — no build step, no Tailwind:

```css
:root {
  --loomi-primary-600: #16a34a; /* every primary-colored component turns green */
  --loomi-primary-700: #15803d; /* its hover shade */
}
```

That's the whole theming API. Every component resolves its colors through
`--loomi-<color>-<shade>` custom properties, which inherit through the Shadow DOM
boundary — one `:root` declaration restyles the entire library instantly.

**Supported colors:** `primary` `secondary` `success` `error` `warning` `gray` — each with the full
`50`–`950` tonal scale (e.g. `--loomi-warning-500`).

Curious how the override mechanism avoids the usual Shadow DOM custom-property pitfalls?
See [`@loomidev/core`'s README](packages/core#--loomi--public-theme-vs---_loomi-accent-private-per-instance).

## Internationalization

Built-in component text is translated through `@loomidev/core`: placeholders, validation
messages, aria labels, pagination text, and datepicker month/weekday names. Set a shared
locale before rendering components, or use a component's `locale` attribute for a local
override.

```js
import { setLoomiLocale, defineLoomiTranslations } from "@loomidev/core";
import "@loomidev/components";

setLoomiLocale("es");

defineLoomiTranslations("ak", {
  datepicker: { placeholder: "Paw da a wobɛpaw" },
  filepicker: { placeholderLine1: "Paw fael anaa twe bra ha" },
});
```

```html
<loomi-datepicker locale="fr"></loomi-datepicker>
<loomi-filepicker locale="pt_BR"></loomi-filepicker>
```

Default locales: `en`, `ar`, `de`, `es`, `fr`, `it`, `ml`, `pt_BR`, `tr`, and
`zh_CN`. Per-component text attributes still take precedence when you need custom copy.

## Components

| Category | Packages |
| --- | --- |
| Standalone | [`button`](packages/button) · [`button-group`](packages/button-group) · [`icon`](packages/icon) · [`spinner`](packages/spinner) · [`alert`](packages/alert) · [`bell`](packages/bell) · [`modal`](packages/modal) · [`drawer`](packages/drawer) · [`fab`](packages/fab) · [`floating-panel`](packages/floating-panel) · [`notification`](packages/notification) · [`clipboard`](packages/clipboard) · [`resizable`](packages/resizable) · [`table`](packages/table) |
| **Forms** | [`input`](packages/input) · [`autocomplete`](packages/autocomplete) · [`password`](packages/password) · [`textarea`](packages/textarea) · [`text-editor`](packages/text-editor) · [`select`](packages/select) · [`checkbox`](packages/checkbox) · [`radio`](packages/radio) · [`toggle`](packages/toggle) · [`number`](packages/number) · [`slider`](packages/slider) · [`otp`](packages/otp) · [`checkcards`](packages/checkcards) · [`tag-input`](packages/tag-input) · [`emoji-picker`](packages/emoji-picker) · [`datepicker`](packages/datepicker) · [`timepicker`](packages/timepicker) · [`timezonepicker`](packages/timezonepicker) · [`date-range-picker`](packages/date-range-picker) · [`colorpicker`](packages/colorpicker) · [`filepicker`](packages/filepicker) · [`filter-builder`](packages/filter-builder) · [`countries`](packages/countries) · [`creditcard`](packages/creditcard) |
| **Content** | [`card`](packages/card) · [`divider`](packages/divider) · [`qrcode`](packages/qrcode) · [`avatar`](packages/avatar) · [`accordion`](packages/accordion) · [`tag`](packages/tag) · [`tooltip`](packages/tooltip) · [`popover`](packages/popover) · [`empty-state`](packages/empty-state) · [`statistic`](packages/statistic) · [`rating`](packages/rating) · [`arc-meter`](packages/arc-meter) · [`timeline`](packages/timeline) · [`progress`](packages/progress) · [`timer`](packages/timer) · [`listview`](packages/listview) · [`contact-card`](packages/contact-card) · [`centered-content`](packages/centered-content) · [`sortable`](packages/sortable) · [`processing`](packages/processing) · [`horizontal-line-graph`](packages/horizontal-line-graph) · [`chart`](packages/chart) · [`chat`](packages/chat) · [`calendar`](packages/calendar) · [`data-grid`](packages/data-grid) · [`video`](packages/video) · [`photo-gallery`](packages/photo-gallery) · [`lightbox`](packages/lightbox) |
| **Navigation** | [`bottom-nav`](packages/bottom-nav) · [`side-nav`](packages/side-nav) · [`tab`](packages/tab) · [`pagination`](packages/pagination) · [`dropmenu`](packages/dropmenu) · [`context-menu`](packages/context-menu) · [`command-palette`](packages/command-palette) · [`profile-menu`](packages/profile-menu) · [`progress-steps`](packages/progress-steps) · [`theme-switcher`](packages/theme-switcher) |

Each package's README has a full usage guide and attribute table. Or browse them all
rendered live at [loomiui.com](https://loomiui.com).

## Using LoomiUI with a framework

LoomiUI components are standard custom elements, so they work everywhere — the only thing
that differs between frameworks is how you bind **non-string properties** (arrays,
objects, booleans passed as real values rather than attribute strings), e.g.
`<loomi-select>`'s `.data` array.

**React** doesn't bind custom-element properties through JSX attributes before React 19,
so set them imperatively via a ref:

```jsx
import { useEffect, useRef } from "react";
import "@loomidev/select";

function CountryPicker() {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.data = [{ label: "Ghana", value: "gh" }, { label: "Nigeria", value: "ng" }];
  }, []);
  return <loomi-select ref={ref} placeholder="Country" />;
}
```

**Vue** and **Angular** bind properties directly through their normal binding syntax —
no refs needed:

```html
<!-- Vue -->
<loomi-select :data="countries" placeholder="Country" />

<!-- Angular (add CUSTOM_ELEMENTS_SCHEMA to your module/component schemas) -->
<loomi-select [data]="countries" placeholder="Country"></loomi-select>
```

Simple attributes (`color`, `size`, `disabled`, etc.) work identically as plain HTML
attributes in every framework.

## Browser support

LoomiUI targets modern evergreen browsers: recent Chrome, Edge, Firefox, and Safari.
Form-associated custom elements (`ElementInternals`-based form participation, used by
every form control) require **Safari 16.4+** — older Safari versions can render the
components but won't submit their values inside a native `<form>`.

## AI-assisted development

[`@loomidev/mcp-server`](packages/mcp-server) is an [MCP](https://modelcontextprotocol.io)
server that exposes every component's real documentation to AI coding tools:

```bash
npx @loomidev/mcp-server
```

Point Claude Code, Cursor, or Claude Desktop at it (see the package README for the exact
config) and the assistant can look up accurate attribute tables and usage examples
instead of guessing at an API.

## Contributing

Want to add a component, understand the build steps, or publish a release? See
**[CONTRIBUTING.md](CONTRIBUTING.md)** — it explains the project structure, the theming
implementation, how to add a new component end to end, and the npm publish process in
detail.

## License

[MIT](LICENSE)
