# LoomiUI Architecture

This document explains how the LoomiUI component library is put together. It is written
for contributors and curious users who want to understand the system design without
reading every package first.

For setup commands, publishing steps, and the exact checklist for adding a component, see
[`CONTRIBUTING.md`](CONTRIBUTING.md). For a slower beginner-oriented tour of the same
ideas, see [`HOW_THIS_PROJECT_WORKS.md`](HOW_THIS_PROJECT_WORKS.md).

## If You Are New Here

Read this document as a map, not as a tutorial you need to memorize. The most useful path
is:

1. Read [Goals](#goals) and [Repository Shape](#repository-shape) so you know what kind of
   project this is.
2. Read [Dependency Direction](#dependency-direction) so you know which packages are
   allowed to depend on which other packages.
3. Read [Package Anatomy](#package-anatomy) with `packages/button/` open beside it.
4. Read [Styling Pipeline](#styling-pipeline) and [Theme Architecture](#theme-architecture)
   before changing CSS or colors.
5. Read [Events, Forms, and Shadow DOM Boundaries](#events-forms-and-shadow-dom-boundaries)
   before changing a form control or interactive component.

After that, use [`CONTRIBUTING.md`](CONTRIBUTING.md) for exact commands and checklists.

## Goals

LoomiUI is designed around a few constraints:

- Components should work in plain HTML and in any framework that can render custom
  elements.
- Consumers should not need Tailwind, PostCSS, or a Loomi-specific build plugin.
- Each component should be installable on its own, while still sharing a single theme,
  icon registry, test setup, and release workflow.
- The public API should be normal web platform surface area: HTML attributes, DOM
  properties, slots, CSS custom properties, parts, and events.
- Shared behavior should live in foundation packages, not be copied into every component.

The result is a pnpm workspace monorepo containing independently publishable npm packages
under the `@loomidev/*` scope.

## Repository Shape

```text
components/
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── web-test-runner.config.mjs
├── README.md
├── CONTRIBUTING.md
├── architecture.md
├── examples/
└── packages/
    ├── theme/
    ├── core/
    ├── icons/
    ├── button/
    ├── input/
    ├── select/
    ├── ...
    ├── components/
    ├── forms/
    ├── content/
    ├── navigation/
    └── mcp-server/
```

Every immediate child of `packages/` is a workspace package because
[`pnpm-workspace.yaml`](pnpm-workspace.yaml) includes `packages/*`.

The main package categories are:

- Foundation packages: `theme`, `core`, and `icons`.
- Leaf component packages: `button`, `input`, `modal`, `datepicker`, and the rest of the
  individual `<loomi-*>` elements.
- Bundle packages: `components`, `forms`, `content`, and `navigation`.
- Tooling package: `mcp-server`, which exposes component documentation to AI tools.

## Dependency Direction

The package graph is intentionally one-way:

```text
leaf component packages
        |
        +--> @loomidev/core --> @loomidev/theme
        |
        +--> @loomidev/icons, when icons are needed

bundle packages
        |
        +--> leaf component packages
        +--> foundation packages
```

Foundation packages do not import from leaf components. Leaf components do not import
from bundle packages. Bundle packages exist only to re-export other packages.

This keeps changes localized. A theme or core change can flow into every component, but a
button change cannot accidentally pull button-specific code into `core` or `theme`.

## Package Anatomy

Most component packages follow this shape:

```text
packages/button/
├── package.json
├── tsconfig.json
├── README.md
├── scripts/
│   └── build-styles.mjs
├── src/
│   ├── loomi-button.ts
│   ├── index.ts
│   ├── styles.css
│   ├── icons.ts
│   └── generated/
│       └── styles.css.ts
├── test/
│   └── loomi-button.test.ts
└── dist/
```

The important split is source versus output:

- `src/` is authored by maintainers.
- `src/generated/` is generated during build and should not be edited by hand.
- `dist/` is generated during build and is the only runtime code shipped to npm for most
  packages.
- `README.md` is the package-level public documentation.

Each package declares its public entry points through `package.json`:

```json
{
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
    "./loomi-button.js": {
      "types": "./dist/loomi-button.d.ts",
      "import": "./dist/loomi-button.js"
    }
  }
}
```

Consumers import compiled JavaScript from `dist/`; they do not import TypeScript source.

## Web Component Runtime Model

Each user-facing component is a Web Component built with Lit. The component class usually
looks like this:

```ts
import { html, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

@customElement("loomi-example")
export class LoomiExample extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ reflect: true }) size = "medium";

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
```

Lit provides the reactive rendering loop:

- `@customElement("loomi-example")` registers the HTML tag.
- `@property()` turns fields into reactive DOM properties and attributes.
- `render()` describes the component's shadow-DOM output.
- changing a reactive property schedules a re-render.

Components extend `LoomiElement`, not Lit's `LitElement` directly. `LoomiElement` provides
shared host behavior, including the stable host class generated from the `name` attribute
or from a fallback like `loomi-button-a1b2c`.

## Styling Pipeline

LoomiUI uses Tailwind as an authoring tool, not as a consumer dependency.

At build time, component scripts compile Tailwind utilities and local CSS into a Lit
`CSSResult`:

```text
src/styles.css
        |
scripts/build-styles.mjs
        |
src/generated/styles.css.ts
        |
tsc
        |
dist/generated/styles.css.js
```

At runtime, each component imports its compiled CSS and injects it into its own Shadow
DOM through `static styles`.

This gives consumers:

- no Tailwind runtime dependency;
- no global Loomi CSS file to remember;
- component styles isolated by Shadow DOM;
- normal CSS custom properties for theming.

Generated files are disposable. If a class is missing from the output, edit the component
source, `src/styles.css`, the theme palette, or the build script safelist. Do not patch
`src/generated/styles.css.ts` directly.

## Theme Architecture

`@loomidev/theme` is the source of shared design tokens. The key file is
[`packages/theme/palette.json`](packages/theme/palette.json), which defines:

- the public prefix, currently `loomi`;
- supported color names;
- supported shade numbers;
- the Tailwind default ramp used for each Loomi color.

The theme build creates two main outputs:

- `src/generated/tokens.css.ts`, exported as `themeStyles`;
- `src/tailwind-colors.css`, a Tailwind color mapping reference.

The central rule is:

```css
color: var(--loomi-primary-600, var(--_loomi-primary-600-default));
```

The public token, `--loomi-primary-600`, is the consumer override slot. It is intentionally
not declared on component `:host` rules, so values from `:root` can inherit through Shadow
DOM.

The private token, `--_loomi-primary-600-default`, is the fallback value generated from
Tailwind's defaults. It is declared inside each component through `themeStyles`.

That two-step lookup is why consumers can write:

```css
:root {
  --loomi-primary-600: #16a34a;
}
```

and recolor every component without rebuilding anything.

Components that need per-instance color use `accentVars(color)` from `@loomidev/core`.
That helper sets private accent slots such as `--_loomi-accent`, but those slots still
resolve through the public theme tokens first.

## Foundation Packages

### `@loomidev/theme`

Owns palette data and generated CSS token output. It should not know about individual
components.

### `@loomidev/core`

Owns shared runtime behavior:

- `LoomiElement`;
- `loomiStyles(...)` — prepends `themeStyles`, `motionStyles`, `elevationStyles`, and
  `focusStyles` to a component's own styles;
- `motionStyles` / `elevationStyles` / `focusStyles` — shared entrance-animation
  `@keyframes`, drop-shadow, and focus-ring color tokens, so components reuse one
  definition instead of hand-rolling their own (see `packages/core/README.md`'s
  "Motion", "Elevation", and "Focus ring" sections);
- `accentVars(...)`;
- `cssColor(...)`;
- `onClickOutside(...)`;
- `randomSuffix(...)` — short random id, e.g. for de-duplicating notification keys
  across component instances;
- `nextMenuFocusIndex(...)` — resolves an Arrow/Home/End keydown into the next index to
  focus in a top-level menu, extracted after `dropmenu` and `context-menu` turned out to
  share byte-for-byte identical keydown logic;
- shared body scroll locking for overlays;
- shared i18n helpers and built-in translations.

Components should import shared runtime utilities from `@loomidev/core` instead of
reaching into foundation internals.

### `@loomidev/icons`

Owns the shared icon registry. Components that need icons call `getLoomiIcon(...)` or
re-export the shared registration helpers.

## Bundle Packages

Bundle packages are convenience entry points:

- `@loomidev/components` re-exports the whole library.
- `@loomidev/forms` re-exports form-related components.
- `@loomidev/content` re-exports content and display components.
- `@loomidev/navigation` re-exports navigation components.

They contain little or no component logic. Their job is to depend on other packages and
re-export them from stable entry points.

For example:

```ts
// packages/components/src/button.ts
export * from "@loomidev/button";
```

This lets consumers choose between:

```ts
import "@loomidev/button";
import "@loomidev/components";
import "@loomidev/components/button";
```

## Events, Forms, and Shadow DOM Boundaries

Public component events should be ordinary DOM events that work outside Shadow DOM:

```ts
this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
```

Use `CustomEvent` when callers need structured detail:

```ts
this.dispatchEvent(
  new CustomEvent("selection-change", {
    bubbles: true,
    composed: true,
    detail: { selected },
  }),
);
```

Form controls use form-associated custom elements:

```ts
static formAssociated = true;
private internals = this.attachInternals();
```

Those components call `this.internals.setFormValue(...)` so a normal `FormData(form)` can
include values from `<loomi-input>`, `<loomi-select>`, `<loomi-checkbox>`, and similar
custom elements.

## Internationalization

Built-in component strings are centralized in `@loomidev/core`.

The runtime API includes:

- `setLoomiLocale(...)`;
- `defineLoomiTranslations(...)`;
- `loomiT(...)`;
- date/month/weekday helpers.

Built-in locale files live under `packages/core/src/locales/`. Components should use
these helpers for built-in labels, placeholders, validation messages, and aria text
instead of hardcoding English strings in each package.

## Build and Test Flow

The root scripts coordinate the workspace:

```json
{
  "build": "pnpm -r --filter \"./packages/*\" build",
  "dev": "pnpm -r --parallel dev",
  "typecheck": "pnpm -r typecheck",
  "test": "web-test-runner"
}
```

`pnpm -r` runs scripts recursively across workspace packages. pnpm uses dependency order,
so `theme` and `core` build before packages that depend on them.

Tests run with Web Test Runner in a real headless Chromium browser. Test files import
from `dist/`, not from `src/`, so build before running tests:

```sh
pnpm build
pnpm test
```

This catches packaging and generated-output problems that source-only tests would miss.

## Release Model

Packages are independently versioned and published with Changesets.

Local package dependencies use the pnpm workspace protocol:

```json
{
  "dependencies": {
    "@loomidev/core": "workspace:^"
  }
}
```

During publish, workspace ranges are converted into normal semver ranges for npm users.
Consumers never see `workspace:^`.

The release flow is intentionally separate from architecture. See
[`CONTRIBUTING.md`](CONTRIBUTING.md) for the operational details.

## Public Extension Points

Prefer these when adding or changing component APIs:

- HTML attributes and DOM properties for state;
- slots for caller-provided content;
- CSS custom properties for theme-level styling;
- `part="..."` for specific internal styling hooks;
- DOM events for user actions and state changes;
- public methods only when an imperative action is genuinely needed, such as `focus()`.

Avoid exposing implementation details such as generated file paths, private CSS
variables, or internal helper method names as public API.

## Contributor Reading Order

When learning or changing a component, read in this order:

```text
packages/<name>/README.md
packages/<name>/package.json
packages/<name>/src/index.ts
packages/<name>/src/loomi-*.ts
packages/<name>/src/styles.css
packages/<name>/scripts/build-styles.mjs
packages/<name>/test/*.test.ts
```

That path starts with the public contract, then moves into implementation and finally
existing verification.
