# LoomiUI

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**Modern web components for every framework.** LoomiUI gives you
components built on web standards, with clear HTML attributes for common options such as
colors, sizes, states, icons, and layouts. More advanced components also provide
JavaScript properties and custom events.

📖 **Visit [loomiui.com](https://loomiui.com) for complete documentation, live previews,
and API details for every component.**

```html
<loomi-button color="error" outline radius="full" icon="trash">Delete</loomi-button>
```

## Why LoomiUI

- **Use familiar HTML.** Every LoomiUI component is a browser custom element. You can use
  the same tags in React, Vue, Angular, Svelte, a static site, or plain HTML. A framework
  wrapper is not required.
- **Change the theme from CSS.** Component colors come from CSS custom properties whose
  names start with `--loomi-`. Override those properties in your application CSS to
  update every component. Your application does not need Tailwind or an extra theme
  build step.
- **Ship no Tailwind runtime.** LoomiUI compiles Tailwind while building each package and
  includes the resulting CSS inside the component. Applications that use LoomiUI do not
  load or run Tailwind in the browser.
- **Install only what your application uses.** LoomiUI provides 76 components as separate
  npm packages. You can install one component, a category of components, or the complete
  library.
- **Submit values with native forms.** LoomiUI form controls use `ElementInternals` to
  participate in a normal HTML `<form>`. Their values are included when the form is
  submitted, just like values from built-in inputs.
- **Give coding tools accurate component documentation.** The included
  [`@loomidev/mcp-server`](packages/mcp-server) lets compatible tools read the real usage
  guides and attribute tables. See [MCP documentation server](#mcp-documentation-server).

> **Project status:** LoomiUI has not reached version 1.0. Each package has its own `0.x`
> version. A minor update may contain breaking changes until that package reaches 1.0.

## Quick start

To try one component without installing a package, load Lit and the LoomiUI component
from a CDN:

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/button"></script>

<loomi-button>Hello LoomiUI</loomi-button>
```

For an application project, install the component and Lit from npm:

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

Each component is available as its own package. Its shared LoomiUI dependencies, such as
`@loomidev/core` and `@loomidev/theme`, are installed automatically.

```bash
npm install @loomidev/select @loomidev/datepicker lit
```

```js
import "@loomidev/select";
import "@loomidev/datepicker";
```

You can install a package that contains a whole category. Available category packages
include [`@loomidev/forms`](packages/forms), [`@loomidev/content`](packages/content), and
[`@loomidev/navigation`](packages/navigation). If you install `@loomidev/components`, you
can still import only one component with `import "@loomidev/components/button"`.

> Install `lit` alongside your LoomiUI packages. This allows the application and all
> LoomiUI components to share one installed version of Lit.

## Theming

Set LoomiUI color variables in your application CSS. You do not need Tailwind or another
build step:

```css
:root {
  --loomi-primary-600: #16a34a; /* every primary-colored component turns green */
  --loomi-primary-700: #15803d; /* its hover shade */
}
```

Every component reads its colors from CSS custom properties that follow the
`--loomi-<color>-<shade>` naming pattern. These properties pass from your page into each
component's Shadow DOM. Defining them on `:root` therefore updates every LoomiUI
component on the page.

**Supported colors:** `primary`, `secondary`, `success`, `error`, `warning`, and `gray`.
Each color includes shades from `50` through `950`, such as `--loomi-warning-500`.

For technical details about public theme variables and internal component colors, see
[`@loomidev/core`'s README](packages/core#--loomi--public-theme-vs---_loomi-accent-private-per-instance).

## Internationalization

`@loomidev/core` provides translations for text built into the components. This includes
placeholders, validation messages, accessible labels, pagination text, and month and
weekday names in the datepicker. Set one locale for the whole application before
rendering components. You can also set the `locale` attribute on one component when it
needs a different language.

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

Included locales are `en`, `ar`, `de`, `es`, `fr`, `it`, `ml`, `pt_BR`, `tr`, and
`zh_CN`. If a component provides an attribute for specific text, that attribute overrides
the translated default.

## Components

| Category       | Packages                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Standalone     | [`button`](packages/button) · [`button-group`](packages/button-group) · [`split-button`](packages/split-button) · [`icon`](packages/icon) · [`spinner`](packages/spinner) · [`alert`](packages/alert) · [`bell`](packages/bell) · [`modal`](packages/modal) · [`drawer`](packages/drawer) · [`fab`](packages/fab) · [`floating-panel`](packages/floating-panel) · [`notification`](packages/notification) · [`clipboard`](packages/clipboard) · [`resizable`](packages/resizable) · [`table`](packages/table)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Forms**      | [`input`](packages/input) · [`autocomplete`](packages/autocomplete) · [`password`](packages/password) · [`textarea`](packages/textarea) · [`text-editor`](packages/text-editor) · [`select`](packages/select) · [`checkbox`](packages/checkbox) · [`radio`](packages/radio) · [`toggle`](packages/toggle) · [`number`](packages/number) · [`slider`](packages/slider) · [`otp`](packages/otp) · [`checkcards`](packages/checkcards) · [`tag-input`](packages/tag-input) · [`emoji-picker`](packages/emoji-picker) · [`datepicker`](packages/datepicker) · [`timepicker`](packages/timepicker) · [`timezonepicker`](packages/timezonepicker) · [`date-range-picker`](packages/date-range-picker) · [`colorpicker`](packages/colorpicker) · [`filepicker`](packages/filepicker) · [`filter-builder`](packages/filter-builder) · [`countries`](packages/countries) · [`creditcard`](packages/creditcard)                                                                                                                                   |
| **Content**    | [`card`](packages/card) · [`divider`](packages/divider) · [`scroller`](packages/scroller) · [`qrcode`](packages/qrcode) · [`avatar`](packages/avatar) · [`accordion`](packages/accordion) · [`tag`](packages/tag) · [`tooltip`](packages/tooltip) · [`popover`](packages/popover) · [`empty-state`](packages/empty-state) · [`statistic`](packages/statistic) · [`rating`](packages/rating) · [`arc-meter`](packages/arc-meter) · [`timeline`](packages/timeline) · [`progress`](packages/progress) · [`timer`](packages/timer) · [`listview`](packages/listview) · [`contact-card`](packages/contact-card) · [`centered-content`](packages/centered-content) · [`sortable`](packages/sortable) · [`processing`](packages/processing) · [`horizontal-line-graph`](packages/horizontal-line-graph) · [`chart`](packages/chart) · [`chat`](packages/chat) · [`calendar`](packages/calendar) · [`data-grid`](packages/data-grid) · [`video`](packages/video) · [`photo-gallery`](packages/photo-gallery) · [`lightbox`](packages/lightbox) |
| **Navigation** | [`bottom-nav`](packages/bottom-nav) · [`side-nav`](packages/side-nav) · [`tab`](packages/tab) · [`pagination`](packages/pagination) · [`dropmenu`](packages/dropmenu) · [`context-menu`](packages/context-menu) · [`command-palette`](packages/command-palette) · [`profile-menu`](packages/profile-menu) · [`progress-steps`](packages/progress-steps) · [`theme-switcher`](packages/theme-switcher)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

Each package README includes installation instructions, examples, and an attribute table.
You can also browse the rendered documentation and live previews at
[loomiui.com](https://loomiui.com).

## Using LoomiUI with a framework

LoomiUI components use the browser's custom elements standard, so they work with React,
Vue, Angular, and other frameworks. Install the package, import it once to register the
component, then use its `<loomi-*>` tag in your template.

Text values and simple attributes such as `color`, `size`, and `disabled` work like normal
HTML attributes. Arrays, objects, and functions are JavaScript values, so they must be
passed to the component as properties. For example, `<loomi-select>` receives its options
through the `.data` property.

**React 19** can pass these JavaScript values to custom-element properties through JSX.
**React 18 and earlier** cannot do this directly. In those versions, create a ref for the
LoomiUI element and set the property after the component mounts:

```jsx
import { useEffect, useRef } from "react";
import "@loomidev/select";

function CountryPicker() {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.data = [
      { label: "Canada", value: "ca" },
      { label: "India", value: "in" },
    ];
  }, []);
  return <loomi-select ref={ref} placeholder="Country" />;
}
```

For JSX autocomplete and property checking in a TypeScript React project, install the
types package and include it in your `tsconfig.json`:

```bash
npm install --save-dev @loomidev/react-types
```

```json
{
  "compilerOptions": {
    "types": ["@loomidev/react-types"]
  }
}
```

`@loomidev/react-types` supports React 18 and React 19 without adding runtime wrappers.
It improves TypeScript checking, but React 18 still needs refs for arrays, objects,
functions, and custom DOM events.

**Vue** and **Angular** can pass JavaScript values directly through their normal property
binding syntax. You do not need a ref:

```html
<!-- Vue -->
<loomi-select :data="countries" placeholder="Country" />

<!-- Angular (add CUSTOM_ELEMENTS_SCHEMA to your module/component schemas) -->
<loomi-select [data]="countries" placeholder="Country"></loomi-select>
```

## Server-side rendering

Every LoomiUI component renders on the server to [Declarative Shadow
DOM](https://developer.mozilla.org/docs/Web/HTML/Element/template#shadowrootmode), so a
page can contain real, styled markup before any JavaScript runs. This works from any
stack that can run Node during the request or the build — Astro, Nuxt, Next.js, or a
static site generator — and the resulting HTML is plain markup that Rails, Laravel or
Django can serve just as well.

```js
import { render } from "@lit-labs/ssr";
import { collectResultSync } from "@lit-labs/ssr/lib/render-result.js";
import { html } from "lit";
import "@loomidev/components/button";

const markup = collectResultSync(render(html`<loomi-button>Save</loomi-button>`));
// <loomi-button><template shadowrootmode="open"><style>…</style><button …>…</button></template></loomi-button>
```

Browsers parse that `<template shadowrootmode>` into a real shadow root during HTML
parsing, so the component is visible and styled with no JavaScript at all. To make it
interactive, load the component modules as usual; to have Lit adopt the server-rendered
DOM rather than replace it, import Lit's hydration support **before** any component:

```js
import "@lit-labs/ssr-client/lit-element-hydrate-support.js";
import "@loomidev/components/button";
```

**One limitation to know.** A handful of components inspect their light-DOM children to
decide what to render — `<loomi-select>` reading `<option>` elements, `<loomi-tabs>`
finding its `<loomi-tab>` children, `<loomi-table>` reading a `<template slot="row">`.
The server has no light DOM to inspect, so anything derived from those children is absent
from the server HTML and fills in at hydration. Nothing throws, and the rest of the
component still renders.

Passing the same data through a property avoids this, because properties are readable on
the server. `<loomi-select .data=${options} selected-value="gh">` server-renders its
trigger showing the selected label, where the `<option>` form renders the placeholder
until hydration. Note that this affects the _closed_ control only — a select's option
list is not in the server HTML either way, since the panel is rendered only while open.

CI runs two checks over this. `pnpm check:ssr` renders all 103 components in Node and
fails if any throws or emits no shadow root; `pnpm check:hydration` then loads that markup
in a browser and fails if the client replaces the server-rendered DOM instead of adopting
it — which is what would show up to a user as a flash of re-rendered content.

## Browser support

LoomiUI supports recent versions of Chrome, Edge, Firefox, and Safari. LoomiUI form
controls use the browser's `ElementInternals` API to submit values through native forms.
This form behavior requires **Safari 16.4 or later**. Older Safari versions can display
the components, but they cannot include LoomiUI control values when submitting a native
`<form>`.

## MCP documentation server

[`@loomidev/mcp-server`](packages/mcp-server) is a
[Model Context Protocol (MCP)](https://modelcontextprotocol.io) server. It gives compatible
coding tools access to LoomiUI documentation, including component attributes and usage
examples.

```bash
npx @loomidev/mcp-server
```

See the package README for instructions on connecting an MCP client. After the connection
is configured, the client can look up accurate attribute tables and usage examples.

## Contributing

See **[CONTRIBUTING.md](CONTRIBUTING.md)** to learn about the project structure, theming
implementation, component development process, build steps, and npm release process.

For task-focused references, see the [contributor workflow](docs/contributor-workflow.md),
[operations runbook](docs/operations.md), [maintainer guide](docs/maintainer-guide.md),
and [release communication templates](docs/release-communication.md).

## License

[MIT](LICENSE)
