# LoomiUI

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Themeable, framework-agnostic web components built with Lit.** Pick a color palette,
override it from your own CSS, compose components from independent attributes — the
BladewindUI developer experience, translated from Laravel Blade to standards-based
custom elements that work in any framework, or none at all.

📖 **Full docs, live previews and every component's API → [loomiui.com](https://loomiui.com)**

```html
<loomi-button color="red" outline radius="full" icon="trash">Delete</loomi-button>
```

## Why LoomiUI

- **It's just HTML.** Every component is a real custom element — drop it into React,
  Vue, Angular, Svelte, a static site, or nothing at all. No wrapper libraries needed.
- **Theme without a build step.** Colors resolve through CSS custom properties
  (`--loomi-*`). Override them from your own page CSS and every component re-skins
  instantly — no Tailwind install, no rebuild, on the consumer's side.
- **Zero runtime Tailwind.** Tailwind is compiled once at *our* build time and inlined
  into each component's Shadow DOM styles. Nothing Tailwind-related ships to you.
- **Install only what you need.** 44 components, each its own npm package — pull in a
  single button or the entire library.
- **Real form participation.** Every form control is form-associated via
  `ElementInternals` — they submit inside a native `<form>` like any built-in input.
- **An MCP server included.** [`@loomi/mcp-server`](packages/mcp-server) lets AI coding
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
<script type="module" src="https://esm.sh/@loomi/button"></script>

<loomi-button>Hello LoomiUI</loomi-button>
```

Or install it properly:

```bash
npm install @loomi/button lit
```

```js
import "@loomi/button"; // registers <loomi-button>
```

```html
<loomi-button color="primary" icon="check">Save changes</loomi-button>
```

## Two ways to install

### Install everything

```bash
npm install @loomi/components lit
```

```js
import "@loomi/components"; // registers every LoomiUI element
```

### Install just what you need

Each component is its own package, depending only on the tiny shared `@loomi/core` and
`@loomi/theme` (pulled in automatically).

```bash
npm install @loomi/select @loomi/datepicker lit
```

```js
import "@loomi/select";
import "@loomi/datepicker";
```

You can also install a whole category at once — see [`@loomi/forms`](packages/forms),
[`@loomi/content`](packages/content), [`@loomi/navigation`](packages/navigation) — or
cherry-pick a single component from the umbrella package:
`import "@loomi/components/button"`.

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

**Supported colors:** `primary` `secondary` `red` `blue` `green` `purple` `pink`
`orange` `black` `cyan` `violet` `indigo` `fuchsia` `gray` — each with the full
`50`–`950` tonal scale (e.g. `--loomi-cyan-500`).

Curious how the override mechanism avoids the usual Shadow DOM custom-property pitfalls?
See [`@loomi/core`'s README](packages/core#--loomi--public-theme-vs---_loomi-accent-private-per-instance).

## Internationalization

Built-in component text is translated through `@loomi/core`: placeholders, validation
messages, aria labels, pagination text, and datepicker month/weekday names. Set a shared
locale before rendering components, or use a component's `locale` attribute for a local
override.

```js
import { setLoomiLocale, defineLoomiTranslations } from "@loomi/core";
import "@loomi/components";

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
| Standalone | [`button`](packages/button) · [`icon`](packages/icon) · [`spinner`](packages/spinner) · [`alert`](packages/alert) · [`bell`](packages/bell) · [`modal`](packages/modal) · [`notification`](packages/notification) · [`table`](packages/table) |
| **Forms** | [`input`](packages/input) · [`textarea`](packages/textarea) · [`select`](packages/select) · [`checkbox`](packages/checkbox) · [`radio`](packages/radio) · [`toggle`](packages/toggle) · [`number`](packages/number) · [`slider`](packages/slider) · [`code`](packages/code) · [`checkcards`](packages/checkcards) · [`datepicker`](packages/datepicker) · [`timepicker`](packages/timepicker) · [`colorpicker`](packages/colorpicker) · [`filepicker`](packages/filepicker) |
| **Content** | [`card`](packages/card) · [`avatar`](packages/avatar) · [`accordion`](packages/accordion) · [`tag`](packages/tag) · [`tooltip`](packages/tooltip) · [`popover`](packages/popover) · [`empty-state`](packages/empty-state) · [`statistic`](packages/statistic) · [`rating`](packages/rating) · [`timeline`](packages/timeline) · [`progress`](packages/progress) · [`listview`](packages/listview) · [`contact-card`](packages/contact-card) · [`centered-content`](packages/centered-content) · [`sortable`](packages/sortable) · [`processing`](packages/processing) · [`horizontal-line-graph`](packages/horizontal-line-graph) · [`chart`](packages/chart) |
| **Navigation** | [`tab`](packages/tab) · [`pagination`](packages/pagination) · [`dropmenu`](packages/dropmenu) · [`theme-switcher`](packages/theme-switcher) |

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
import "@loomi/select";

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

[`@loomi/mcp-server`](packages/mcp-server) is an [MCP](https://modelcontextprotocol.io)
server that exposes every component's real documentation to AI coding tools:

```bash
npx @loomi/mcp-server
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
