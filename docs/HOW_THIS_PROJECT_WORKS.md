# How This Project Is Wired

A from-scratch tour of the LoomiUI monorepo, written for someone who knows basic
JavaScript but hasn't worked with npm workspaces, TypeScript, Web Components, or build
tooling like this before. Read it top to bottom once, then keep it around as a map.

This file is a project-local learning guide, not the public-facing product
documentation. The project's real docs are [`README.md`](../README.md) (the pitch and usage)
and [`CONTRIBUTING.md`](../CONTRIBUTING.md) (the contributor procedures). This file exists to
build the _mental model_ those two assume you already have.

## Table of contents

0. [The one-paragraph version](#0-the-one-paragraph-version)
1. [Concepts you need before any of this makes sense](#1-concepts-you-need-before-any-of-this-makes-sense)
2. [The 10,000-foot shape of the repo](#2-the-10000-foot-shape-of-the-repo)
3. [pnpm workspaces: how the packages talk to each other](#3-pnpm-workspaces-how-the-packages-talk-to-each-other)
4. [Anatomy of one package, file by file: `packages/button`](#4-anatomy-of-one-package-file-by-file-packagesbutton)
5. [The foundation packages: theme, core, icons](#5-the-foundation-packages-theme-core-icons)
6. [The theming system in detail](#6-the-theming-system-in-detail)
7. [The build pipeline: what `pnpm build` actually does](#7-the-build-pipeline-what-pnpm-build-actually-does)
8. [Umbrella & category packages](#8-umbrella--category-packages)
9. [Internationalization (i18n)](#9-internationalization-i18n)
10. [How a Lit component updates](#10-how-a-lit-component-updates)
11. [Events, forms, and accessibility](#11-events-forms-and-accessibility)
12. [The MCP server package](#12-the-mcp-server-package)
13. [Testing](#13-testing)
14. [CI/CD: GitHub Actions + changesets](#14-cicd-github-actions--changesets)
15. [Root config file cheat-sheet](#15-root-config-file-cheat-sheet)
16. [Follow one request, start to finish](#16-follow-one-request-start-to-finish)
17. [Common gotchas to recognize](#17-common-gotchas-to-recognize)
18. [How to change a component without getting lost](#18-how-to-change-a-component-without-getting-lost)
19. [Where to go next](#19-where-to-go-next)

---

## 0. The one-paragraph version

LoomiUI is a **monorepo** (one git repository containing many separately-publishable npm
packages) that implements a UI component library. Each component — button, select,
modal, datepicker, etc. — is its own small npm package under `packages/`, built as a
**Web Component** (a real HTML custom element, e.g. `<loomi-button>`) using a library
called **Lit**. Components are styled with **Tailwind CSS classes**, but Tailwind itself
never ships to the consumer: it's compiled once, at _this repo's_ build time, into plain
CSS baked inside each component. Colors are themeable after the fact via **CSS custom
properties** (`--loomi-primary-600`, etc.) without any rebuild. Everything is written in
**TypeScript** and compiled to plain JavaScript with `tsc`. Packages are linked to each
other locally with **pnpm workspaces**, versioned and published to npm with
**Changesets**, and built/tested/released automatically via **GitHub Actions**.

If none of those bolded terms mean anything yet, section 1 defines them. If you already
know them, skip to section 2.

---

## 1. Concepts you need before any of this makes sense

### npm packages & the registry

An npm "package" is just a folder with a `package.json` describing it (name, version,
entry point, dependencies) plus some code. `npm install x` downloads package `x` (and
its dependencies) from the npm registry into a `node_modules/` folder so your code can
`import` it. This repo _produces_ many packages that get published to the registry under
the `@loomidev` scope (e.g. `@loomidev/button`) — a "scope" is the `@name/` prefix that
namespaces packages, similar to a username.

### ESM modules

`"type": "module"` in a `package.json` (see the root [package.json](../package.json:7)) tells
Node/bundlers to treat `.js`/`.ts` files as **ES Modules** — the standard `import`/`export`
syntax — rather than the older CommonJS `require`/`module.exports`. Every package in this
repo is ESM-only. That's why imports look like `import { x } from "./y.js"` (note: `.js`,
even though the source file is `y.ts` — TypeScript doesn't rewrite import paths, so you
write the path your _compiled output_ will have).

### TypeScript

TypeScript is JavaScript with optional type annotations (`name: string`, `count: number`).
It catches a class of bugs (wrong argument types, typos in property names) before the
code ever runs, at the cost of a compile step. The compiler, `tsc`, turns `.ts` files into
plain `.js` files (plus `.d.ts` "type declaration" files describing the shapes for other
TypeScript consumers). Every package here is authored in TypeScript and ships compiled
JavaScript — consumers never need TypeScript themselves.

### Monorepo & workspaces

A **monorepo** is one git repository holding multiple independent packages, instead of
one repo per package. The benefit here: a shared build/test/release pipeline, and the
ability to change a shared package (like `@loomidev/core`) and every component that
depends on it in a single commit. A **workspace** (pnpm's term, similar to npm/yarn
workspaces) is the mechanism that lets all those packages reference each other _locally_
during development, without publishing to npm first. More in section 3.

### Web Components (custom elements + Shadow DOM)

A **custom element** is a real HTML tag you define yourself, e.g. `<loomi-button>`. You
register it once with `customElements.define("loomi-button", LoomiButton)` and from then
on the browser treats `<loomi-button>` exactly like `<button>` or `<input>` — no
framework required, works in React/Vue/Angular/plain HTML equally. This is the literal
truth behind this project's tagline "it's just HTML."

**Shadow DOM** is a sandboxed mini-document attached to an element. A component renders
its internal markup and CSS _inside_ its own shadow root, where outside page styles can't
leak in and the component's own styles can't leak out. This is how a component can use
Tailwind classes like `bg-blue-600` internally without colliding with — or being
overridden by — whatever CSS the host page happens to have for `.bg-blue-600`.

### Lit

Plain custom elements are verbose to write by hand (manual DOM updates, manual attribute
parsing). **Lit** is a small library (`lit`) that adds:

- A `html` template tag for declarative rendering (``html`<div>${value}</div>` ``) that
  efficiently re-renders only what changed.
- **Decorators** like `@customElement("loomi-button")` and `@property()` — the `@`-prefixed
  lines above a class or field. They're a TypeScript/JS feature for attaching behavior to
  a class declaratively. `@property()` turns a plain class field into a _reactive
  property_: changing it automatically re-runs `render()` and (by default) keeps it in
  sync with an HTML attribute of the same name.

This is why `tsconfig.base.json` sets `"experimentalDecorators": true` and
`"useDefineForClassFields": false` — both are required for Lit's decorators to compile
to the runtime behavior Lit expects. If you ever see a Lit component whose `@property()`
fields silently stop working, this pairing of compiler flags is the first thing to check.

### CSS custom properties (CSS variables)

`--some-name: value;` defines a CSS variable; `var(--some-name)` reads it. Unlike Tailwind
classes (resolved once, at this repo's build time), CSS variables are resolved by the
_browser_, live, and — critically — they **inherit through Shadow DOM boundaries**. A
page-level `:root { --loomi-primary-600: hotpink; }` reaches into every component's shadow
root and repaints it, with no rebuild. This is the entire mechanism behind "theme without
a build step" (see section 6).

### Build time vs. runtime

"Build time" = steps that run on the _maintainer's_ machine or in CI, before anything is
published (compiling TypeScript, compiling Tailwind, generating files). "Runtime" = code
that actually executes in the _consumer's_ browser. A recurring theme in this codebase is
pushing as much work as possible to build time so runtime stays small and dependency-free
— e.g., Tailwind is a build-time-only tool here; zero Tailwind code or CSS-in-JS engine
ships to consumers.

---

## 2. The 10,000-foot shape of the repo

```
components/                          <- repo root (this is what "@loomidev/root" refers to)
├── package.json                     root scripts: build/dev/test/typecheck, runs across all packages
├── pnpm-workspace.yaml              declares packages/* as the workspace
├── tsconfig.base.json               shared TypeScript compiler settings, every package extends this
├── web-test-runner.config.mjs       test runner config (see section 13)
├── .changeset/                      Changesets config — versioning & publishing (section 14)
├── .github/workflows/               CI + release automation (section 14)
├── examples/                        static .html files for manually eyeballing components in a browser
├── CONTRIBUTING.md                  the contributor's procedural reference (long, detailed)
├── README.md                        the public pitch / usage docs
└── packages/                        <- every publishable package lives here, flat
    ├── theme/                       foundation: design tokens / color palette
    ├── core/                        foundation: shared base class, i18n, small DOM helpers
    ├── icons/                       foundation: shared SVG icon registry
    ├── button/                      a single component
    ├── input/                       a single component
    ├── select/                      a single component
    ├── ...                          more component packages
    ├── components/                  umbrella: re-exports every component, one install
    ├── forms/                       category umbrella: just the form controls
    ├── content/                     category umbrella: just content/display components
    ├── navigation/                  category umbrella: just navigation components
    └── mcp-server/                  a Node.js MCP server exposing component docs to AI tools
```

Every folder under `packages/` is its own npm package with its own `package.json`,
versioned independently. The exact count changes as new components land, but they fall
into a few stable categories:

- **3 foundation packages** (`theme`, `core`, `icons`) that almost everything else depends on.
- **Leaf component packages** (`button`, `input`, `modal`, …), each depending on the
  foundation packages and nothing else in the repo.
- **4 umbrella packages** (`components`, `forms`, `content`, `navigation`) that depend on
  a bunch of leaf packages purely to re-export them under one install.
- **1 tooling package** (`mcp-server`) that's unrelated to the UI runtime — it's a
  documentation server for AI coding assistants.

Dependency direction (arrows mean "depends on"):

```
   leaf component (button, select, modal, ...)
          │
          ├──> @loomidev/core ──> @loomidev/theme
          └──> @loomidev/icons             ▲
                                            │
   umbrella (components/forms/content/nav) │
          └──> every leaf package it bundles, plus the foundation packages directly
```

Nothing ever points the other way — `theme` knows nothing about `button`, `core` knows
nothing about any specific component. That one-directional flow is what makes it safe to
add another component package without touching any existing one.

---

## 3. pnpm workspaces: how the packages talk to each other

[pnpm](https://pnpm.io) is a package manager like `npm`, but faster and stricter about
dependencies. This repo pins it via `"packageManager": "pnpm@9.15.9"` in the root
[package.json](../package.json:8), and the same file requires Node `>=20`. Use Node 20 or
newer, then let `corepack` run the pinned pnpm version for you. That keeps "wrong pnpm
version" from becoming a class of bug during local development.

[`pnpm-workspace.yaml`](../pnpm-workspace.yaml) is one line:

```yaml
packages:
  - "packages/*"
```

That tells pnpm "every immediate subfolder of `packages/` is a workspace member." Once a
folder is a workspace member, any _other_ member can depend on it like this (see
[`packages/button/package.json`](../packages/button/package.json:24)):

```json
"dependencies": {
  "@loomidev/core": "workspace:^",
  "@loomidev/icons": "workspace:^",
  "@loomidev/theme": "workspace:^"
}
```

`workspace:^` is a special pnpm protocol meaning "use the copy that lives in this
workspace, not whatever's on the npm registry." Concretely, `pnpm install` creates a
**symlink** — `node_modules/@loomidev/core` literally points at `packages/core` on disk.
That means when `button`'s source code does `import { LoomiElement } from "@loomidev/core"`,
Node/TypeScript resolves it to `packages/core/dist/index.js` straight off your local
filesystem — no registry round-trip, and editing `core` is instantly visible to every
package that depends on it (after `core` rebuilds; see section 7).

When packages are _published_ to npm, Changesets rewrites `workspace:^` to a real version
number (e.g. `^0.1.0`) automatically — consumers installing from npm never see the
`workspace:` protocol; it's purely a local-development mechanism.

The three `.npmrc` settings ([`.npmrc`](../.npmrc)) reinforce this:

```
link-workspace-packages=true   # prefer the local symlink over the npm registry
prefer-workspace-packages=true # same intent, belt-and-suspenders
auto-install-peers=true        # auto-installs peerDependencies (e.g. `lit`) so you don't have to
```

**The practical gotcha to internalize:** these symlinks are created once, when you run
`pnpm install`, based on whatever each package's `name` field says _at that moment_. If a
package's name changes afterward but you don't re-run `pnpm install`, your local
`node_modules` keeps the _old_ symlink name, and code importing the old name keeps working
— right up until someone (you, or CI) does a fresh install. Section 15 walks through a
live example of exactly this sitting in the repo right now.

---

## 4. Anatomy of one package, file by file: `packages/button`

This is the most important section — every other component package (input, select, modal,
…) follows this exact same shape. Once `button` makes sense, you can read any of the
other 43.

```
packages/button/
├── package.json              <- identity, entry points, dependencies, scripts
├── custom-elements.json       <- generated API manifest (committed; `pnpm cem` regenerates)
├── tsconfig.json              <- "compile my src/, extend the shared base config"
├── src/
│   ├── index.ts                <- the public API surface (what consumers import)
│   ├── loomi-button.ts          <- the actual component class
│   ├── icons.ts                 <- re-exports the icon registry for this component's use
│   ├── styles.css                <- a few lines of hand-written plain CSS
│   └── generated/styles.css.ts    <- AUTO-GENERATED, not committed (gitignored)
├── scripts/build-styles.mjs    <- 4-line shim into the shared style build (scripts/lib/)
└── test/loomi-button.test.ts  <- a smoke test, runs against the built dist/, not src/
```

### `package.json` — the package's identity card

```json
{
  "name": "@loomidev/button",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
    "./loomi-button.js": { "types": "./dist/loomi-button.d.ts", "import": "./dist/loomi-button.js" }
  },
  "scripts": {
    "build": "node scripts/build-styles.mjs && tsc -p tsconfig.json",
    "dev": "node scripts/build-styles.mjs && tsc -p tsconfig.json --watch",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "dependencies": { "@loomidev/core": "workspace:^", "@loomidev/icons": "workspace:^", "@loomidev/theme": "workspace:^" },
  "peerDependencies": { "lit": "^3.0.0" }
}
```

Field by field:

- **`main`/`module`/`types`** — where to find the compiled JS entry point and its type
  declarations. All three point into `dist/`, never `src/` — consumers run compiled code.
- **`files`** — when this package is packed for npm, only `dist/` and
  `custom-elements.json` (plus `package.json`, `README.md`, `LICENSE` automatically) are
  included. Source TypeScript never ships.
- **`customElements`** — points at `custom-elements.json`, the package's
  [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest):
  a machine-readable description of the tag, its attributes, slots, CSS parts and
  events, generated by `pnpm cem` at the repo root and read by IDEs, docs tooling and
  framework integrations. Unlike `dist/`, it _is_ committed — regenerate it whenever a
  component's public API changes.
- **`exports`** — the modern way to declare a package's importable "entry points." The
  `"."` entry is what you get from `import "@loomidev/button"`. The second entry lets
  someone import the component file directly (`@loomidev/button/loomi-button.js`) if they
  want the class without the barrel re-export — rarely needed, there for flexibility.
- **`scripts.build`** — runs two steps in order: first regenerate the compiled CSS
  (`build-styles.mjs`), _then_ run the TypeScript compiler. Order matters because the
  component's source code imports the file the first step generates.
- **`dependencies` vs `peerDependencies`** — `dependencies` are things this package needs
  and npm will install for you automatically. `lit` is instead a **peerDependency**: the
  package needs _some_ compatible version of `lit` to exist, but doesn't bundle its own —
  it expects the consuming app to provide one shared copy. This is why the root README
  says "install `lit` alongside LoomiUI packages": if every component
  packages bundled its own copy of `lit`, a page using ten of them would load ten copies.

### `src/loomi-button.ts` — the component itself

The full file is at [`packages/button/src/loomi-button.ts`](../packages/button/src/loomi-button.ts).
The shape, annotated:

```ts
import { LoomiElement, loomiStyles } from "@loomidev/core";
import { buttonStyles } from "./generated/styles.css.js";

@customElement("loomi-button")          // registers the tag name with the browser
export class LoomiButton extends LoomiElement {
  static override styles = loomiStyles(buttonStyles); // shared tokens + this component's own CSS

  @property({ reflect: true }) type: LoomiButtonType = "primary";
  @property() color: LoomiColor | "" = "";
  @property({ type: Boolean }) outline = false;
  // ... more @property() fields, one per HTML attribute the tag accepts

  override render(): TemplateResult {
    const cls = this.computeClasses();      // builds a Tailwind class string from current props
    // ...
    return html`<button class=${cls} part="button" ...>${this.renderContent()}</button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap { "loomi-button": LoomiButton; }
}
```

Things worth pausing on:

- **`extends LoomiElement`**, not `extends LitElement` directly. `LoomiElement`
  (from `@loomidev/core`, see section 5) is this library's own thin base class that adds a
  shared convention (a stable CSS targeting class) on top of Lit's `LitElement`. Every
  loomi component extends it instead of Lit's class directly — a single place to add
  cross-cutting behavior later.
- **`@property({ reflect: true })`** means the property is kept in sync with a real HTML
  attribute (`<loomi-button type="primary">` ↔ `el.type`). Without `reflect: true`, a
  property still works in JS (`el.type = "x"`) but won't show up as an HTML attribute —
  used for things you don't want cluttering the DOM (like the `color` override here).
- **`computeClasses()`** builds an ordinary space-separated string of Tailwind utility
  classes (`"loomi-btn inline-flex ... bg-primary-600 text-white ..."`) based on the
  component's current attribute values, and Lit puts that string straight on the
  `class=` attribute of the real `<button>` inside the shadow root. This is plain runtime
  string concatenation — nothing magic — but it only _works_ visually because the CSS
  rules for `bg-primary-600` etc. were already compiled into `buttonStyles` ahead of time
  (next section explains how).
- **`<slot>`** elements in `renderContent()` are the Shadow DOM mechanism for "let the
  consumer's own light-DOM children show up here." `<loomi-button>Click me</loomi-button>`
  — the text "Click me" lives in the _page's_ DOM, but the default `<slot></slot>` inside
  the component's shadow root decides _where_ it visually appears.
- **`declare global { interface HTMLElementTagNameMap ... }`** is a TypeScript-only
  addition (it generates no JS) that teaches `document.createElement("loomi-button")` and
  `document.querySelector("loomi-button")` their correct return type elsewhere in a
  consumer's codebase.

### `src/index.ts` — the public surface

```ts
export {
  LoomiButton,
  type LoomiButtonType,
  type LoomiButtonSize,
  type LoomiButtonRadius,
  type LoomiButtonTag,
} from "./loomi-button.js";
export { registerLoomiIcon, getLoomiIcon } from "./icons.js";
```

This file is the actual thing `import "@loomidev/button"` runs. Note it's almost entirely
_re-exports_ — the real logic lives in `loomi-button.ts`. This "barrel file" pattern (a
small `index.ts` that just re-exports from sibling files) is used everywhere in this repo
specifically so the _side effect_ of `@customElement("loomi-button")` registration runs
exactly once, at a predictable single entry point, while still giving TypeScript
consumers clean named imports for types.

### `scripts/build-styles.mjs` — where Tailwind disappears

The per-package file is a 4-line shim: it imports `buildComponentStyles` from the shared
implementation at [`scripts/lib/build-component-styles.mjs`](../scripts/lib/build-component-styles.mjs)
(repo root) and calls it with `import.meta.url` — passing its own module URL is what keeps
palette and Tailwind CLI resolution anchored to the package's `node_modules` rather than
the repo root's. The shared script runs at build time (never in the consumer's browser).
In order:

1. Reads `packages/theme/palette.json` (the single source of truth for color names).
2. Builds a Tailwind `@theme inline` block mapping every Tailwind color utility
   (`bg-primary-600`) onto an overridable CSS variable (`var(--loomi-primary-600, ...)`)
   instead of a hardcoded hex value.
3. Adds a `@source inline(...)` **safelist** if the package's shim asked for one — the
   utilities import carries `source(none)`, meaning Tailwind does _not_ scan source files
   for class names at all (component templates use semantic `loomi-*` classes, so
   scanning only ever matched false positives and bloated the output). Any utility class
   a component needs must therefore appear in `src/styles.css` itself (e.g. via `@apply`)
   or be safelisted. Button is the one package that needs this: its shim passes a
   `safelist` option (`{ variants, props, shades }`, see
   [`packages/button/scripts/build-styles.mjs`](../packages/button/scripts/build-styles.mjs))
   that expands to every color/shade combination its dynamic class strings
   (`` `bg-${color}-600` ``) might produce at runtime, so Tailwind generates CSS for all
   of them anyway.
4. Shells out to the real Tailwind CLI (`spawnSync`) to compile all of that into plain CSS.
5. Writes the result into `src/generated/styles.css.ts` as a Lit `CSSResult` (wrapped with
   `unsafeCSS(...)`) — a TypeScript file containing a plain string of CSS that
   `loomi-button.ts` then imports and feeds into `static styles`.

The net effect: by the time `loomi-button.ts` is compiled, **all the CSS it needs already
exists as a plain string** baked into the published package. No Tailwind, no PostCSS, no
build tool of any kind needs to run in the consumer's app. Consumers see this output:
"generated by `@loomidev/button` — do not edit by hand" right at the top of the file.
That comment is your signal: never hand-edit anything under `src/generated/` — it's
overwritten every time `pnpm build` runs, and isn't even committed to git (it's in
[`.gitignore`](../.gitignore) under `**/src/generated/`).

### `test/loomi-button.test.ts`

```ts
import "../dist/loomi-button.js";   // <- dist, not src!
```

Tests import the **compiled output**, not the TypeScript source. Section 11 explains why.

---

## 5. The foundation packages: theme, core, icons

### `packages/theme` — `@loomidev/theme`

The single source of truth for "what colors exist." [`palette.json`](../packages/theme/palette.json)
is genuinely just JSON:

```json
{
  "prefix": "loomi",
  "colors": ["primary", "secondary", "red", "blue", "green", ...],
  "shades": [50, 100, 200, ..., 950],
  "ramps": { "primary": "blue", "secondary": "slate", "red": "red", ... }
}
```

`colors` is the public, overridable palette (the names you see in component APIs, e.g.
`<loomi-button color="red">`). `ramps` says which of _Tailwind's own_ built-in color
scales supplies the **default** value for each — e.g. `primary`'s defaults come from
Tailwind's `blue` ramp — so this project never hand-types a single hex/oklch color value;
every default is borrowed directly from Tailwind's own design tokens. `prefix` (`"loomi"`)
is the brand prefix for every generated CSS variable; change it here once and every
`--loomi-*` variable in the entire library would be renamed on the next build.

`scripts/build-tokens.mjs` reads that JSON and Tailwind's own theme file, then generates
[`src/generated/tokens.css.ts`](../packages/theme/src/generated/tokens.css.ts) — exported as
`themeStyles`, the CSS block every single component prepends to its own styles via
`loomiStyles(...)` (see `static override styles = loomiStyles(buttonStyles)` back in
`loomi-button.ts`). This is what actually _declares_ the `--loomi-*` variables with their
default values, plus a tiny universal `box-sizing: border-box` reset, plus the dark-mode
semantic tokens (section 6).

### `packages/core` — `@loomidev/core`

The shared runtime toolkit every component imports from. Per
[`src/index.ts`](../packages/core/src/index.ts), it provides:

- **`LoomiElement`** — the shared base class (extends Lit's `LitElement`) every component
  extends instead of `LitElement` directly. Its one real job today: give every rendered
  element a stable, predictable CSS class (either from an explicit `name="..."` attribute,
  or an auto-generated `loomi-<component>-<random>` if you didn't set one) — useful for
  targeting a specific instance from outside CSS or for analytics/testing hooks.
- **Re-exports of everything from `@loomidev/theme`** (`themeStyles`, `isLoomiColor`, the
  `LoomiColor` type, …) — so component authors only ever need to import from `core`, not
  reach into `theme` directly. ("Re-export the shared theme surface so components import
  everything from `@loomidev/core`," per the comment in the source.)
  - **`loomiStyles(...styles)`** — `return [themeStyles, motionStyles, elevationStyles,
focusStyles, ...styles]`. Every component's `static styles` should be built with this,
    not a hand-rolled array, so it automatically gets the shared animation keyframes,
    drop-shadow token, and focus-ring color below.
  - **`motionStyles`** (`src/motion.ts`) — shared entrance-animation `@keyframes`
    (fade/pop/rise/drop/slide-in, plus a spinner `loomi-spin`) and duration/easing
    tokens, with `prefers-reduced-motion` handled once, centrally, instead of every
    component repeating its own media query.
  - **`elevationStyles`** (`src/elevation.ts`) — the shared `--loomi-shadow-elevated`
    drop-shadow token used by modal/drawer/floating-panel's floating surfaces.
  - **`focusStyles`** (`src/focus.ts`) — deprecated and now empty; kept only so older
    `loomiStyles(...)` compositions keep working. The focus tokens live in
    `@loomidev/theme` itself (so they flip with dark mode): `--loomi-focus-ring-color`
    for solid `outline`-style rings, and `--loomi-focus-ring` for the soft
    `box-shadow: 0 0 0 3px` halo. They exist because several components used to
    hardcode a bare `--loomi-primary-<shade>` for their focus ring with no fallback —
    since the public theme slots are deliberately left undeclared (section 6), that
    silently rendered no visible focus ring at all. A component with its own
    per-instance `accentVars()` color should reference `--_loomi-accent` directly
    instead of these tokens, since nested `var()` inside an inherited custom property
    resolves at the element where the _outer_ property was declared, not at the element
    that finally uses it.
  - **`fieldStyles` / `controlSizeStyles`** (`src/field.ts`) — the shared chrome for
    form controls. `fieldStyles` is the border/background/focus/invalid/disabled/
    minimal-variant treatment every text field and select-style picker repeats, on two
    opt-in class hooks (`.loomi-field` for focus-delegating wrappers, `.loomi-trigger`
    for button-style controls); `controlSizeStyles` is the shared `.size-tiny` …
    `.size-big` sizing scale. A dozen packages (input, textarea, select, datepicker,
    countries, …) compose these instead of copy-pasting ~60 lines of chrome each —
    which is why a design change like "focus rings are now a softer halo" is a
    one-file edit instead of a twelve-package sweep.
  - **`watchDarkMode(listener)`** (`src/dark-mode.ts`) — JS dark-mode detection (a
    single shared `MutationObserver` on `<html>`'s `class`) for components whose CSS
    must branch on dark mode beyond what the semantic tokens already handle;
    `:host-context(.dark)` has no Firefox support, so components toggle an `is-dark`
    class on themselves instead (see table, calendar).
  - **`accentVars(color)`** — builds a small block of _per-instance_ CSS variables
    (`--_loomi-accent`, `--_loomi-accent-strong`, …) for components that need "this one
    instance is red, that one is blue" rather than a global theme override. Section 6
    explains the public/private naming convention this relies on.
  - **`onClickOutside(el, handler)`** — a small DOM utility for "close this dropdown/modal
    when the user clicks elsewhere," correctly handling clicks that cross a Shadow DOM
    boundary via `event.composedPath()` (a plain `target` check wouldn't see through
    shadow roots).
  - **`randomSuffix()`** — a short random id, e.g. for de-duplicating notification keys
    across component instances.
  - **`nextMenuFocusIndex(event, currentIndex, itemCount)`** — resolves an
    Arrow/Home/End keydown into the next index to focus in a top-level menu. Pulled out
    once `dropmenu` and `context-menu` turned out to have identical keydown logic for
    this; it stays a pure function (no DOM, no index wrapping) since the two packages'
    actual focus-moving methods differ enough elsewhere not to share.
  - **i18n functions** (`setLoomiLocale`, `defineLoomiTranslations`, …) — section 9.

### `packages/icons` — `@loomidev/icons`

A generated registry of [Heroicons](https://heroicons.com) as Lit `svg` template
literals (`scripts/generate-heroicons.mjs` produces `src/index.ts`), keyed by name
(`"trash"`, `"academic-cap"`, …) and exposed via `getLoomiIcon(name)` /
`registerLoomiIcon(name, template)` (the latter lets a consumer add their own custom
icon under a new name). Icons render with `stroke="currentColor"`, so they automatically
inherit whatever text color the surrounding component/CSS context has — no per-icon color
prop needed.

---

## 6. The theming system in detail

This is the cleverest part of the codebase and worth understanding precisely, because it
explains a line you'll otherwise find mysterious: `var(--loomi-primary-600, var(--_loomi-primary-600-default))`.

The goal: let a consumer override a color **from their own page's plain CSS**, with no
rebuild, while still having a sensible default if they override nothing — and do this
correctly _across a Shadow DOM boundary_, which has a specific pitfall:

> If a component declares a CSS variable's default value on its own `:host` selector
> (i.e., on itself), that locally-declared value wins over anything the page's `:root`
> tries to set, because `:host` is "closer" in the CSS cascade than an inherited value from
> outside the shadow tree. Declaring defaults the naive way silently makes the variable
> _unoverridable_ from outside.

The fix used throughout this repo is a two-variable chain:

- **Public slot**: `--loomi-primary-600` — intentionally **never declared** by any
  component. Left undeclared, it inherits straight through from wherever the _consumer_
  defines it (typically `:root`), all the way down into every shadow root.
- **Private default**: `--_loomi-primary-600-default` — **is** declared, on `:host`, by
  `@loomidev/theme`'s generated tokens, with the real fallback value (borrowed from
  Tailwind's own `blue` ramp, per `palette.json`'s `ramps` mapping).
- Every actual usage resolves through both, public-first:
  `var(--loomi-primary-600, var(--_loomi-primary-600-default))` — "use the public slot if
  the consumer set one; otherwise fall back to our private default."

Worked example: a consumer writes this in their own page CSS, with zero build step:

```css
:root {
  --loomi-primary-600: #16a34a;
  --loomi-primary-700: #15803d; /* hover shade */
}
```

That single declaration reaches into the shadow root of _every_ component on the page
using `primary`, because `--loomi-primary-600` (the public slot) was never shadowed
locally by anything — it was only ever read via `var()`, never declared, inside any
component. The private `-default` fallback only kicks in for consumers who set nothing at
all.

**Dark mode** rides the same mechanism one level up, as named _semantic_ aliases rather
than raw colors — `--loomi-surface`, `--loomi-text`, `--loomi-text-muted`,
`--loomi-focus-ring`, `--loomi-focus-ring-color`, `--loomi-text-on-primary`, etc. — defined
once in `theme`'s generated tokens with a light-mode value on `:host` and a different
value under `:host-context(.dark)` (i.e., "when any ancestor of this shadow host —
typically `<html>` — has `class="dark"`"). `@loomidev/theme-switcher` is the component that
actually toggles that `.dark` class on `<html>`. Components are expected to reference
`var(--loomi-surface)` rather than a raw `gray-50`, specifically so dark mode support is
"already there" the moment a component uses the semantic token instead of a literal shade.

**Per-instance accents** (`accentVars()` in `@loomidev/core`, used by components that need
one specific instance recolored rather than the whole theme) use a parallel _private-only_
naming convention (`--_loomi-accent`, no public sibling) set via an inline `style=` attribute
on that one element — deliberately not part of the global override surface.

---

## 7. The build pipeline: what `pnpm build` actually does

The root [`package.json`](../package.json:11) defines:

```json
"scripts": {
  "build": "pnpm -r --filter \"./packages/*\" build",
  "dev": "pnpm -r --parallel dev",
  "typecheck": "pnpm -r typecheck",
  "test": "web-test-runner",
  "cem": "node scripts/generate-cem.mjs"
}
```

(`cem` regenerates every package's committed `custom-elements.json` API manifest — run
it after changing any component's public properties, events, slots, or JSDoc.)

`pnpm -r` means "run this script in every workspace package that defines it" (`-r` =
recursive). Crucially, pnpm runs them in **topological dependency order** automatically:
because `button`'s `package.json` lists `@loomidev/core` as a dependency, pnpm guarantees
`core` finishes building before `button`'s build starts. You never have to hand-order
dozens of packages yourself.

Each package's own `build` script is intentionally tiny and uniform, e.g. button's:

```json
"build": "node scripts/build-styles.mjs && tsc -p tsconfig.json"
```

1. Run any package-specific code-generation script first (Tailwind compilation for
   components; token generation for `theme`; the heroicons registry for `icons`; the
   MCP manifest for `mcp-server`). Most packages skip this step entirely — they have no
   generation step and go straight to step 2.
2. Run `tsc -p tsconfig.json` — compile `src/**/*.ts` to `dist/**/*.js` (+ `.d.ts` +
   source maps), per that package's [`tsconfig.json`](../packages/button/tsconfig.json),
   which itself just extends the shared [`tsconfig.base.json`](../tsconfig.base.json) and
   sets `rootDir`/`outDir`.

`dev` is the watch-mode equivalent (`tsc --watch`), run `--parallel` across every package
at once, for local development.

`typecheck` runs `tsc --noEmit` (type-check without writing any output) in every package —
this is what CI runs to catch type errors without needing a full build.

Nothing under `dist/` or `src/generated/` is ever committed to git (both are in
[`.gitignore`](../.gitignore)) — they're reproducible build artifacts, regenerated by anyone,
anytime, from source + the generation scripts.

---

## 8. Umbrella & category packages

Separate component packages are great for "install only the 2 components you need," but
tedious if you want the whole library. Four extra packages solve that purely by
**re-exporting** other workspace packages — they contain almost no logic of their own.

[`packages/components/src/index.ts`](../packages/components/src/index.ts):

```ts
// Umbrella entry: re-exports every loomi component and registers all custom elements.
export * from "@loomidev/button";
export * from "@loomidev/input";
export * from "@loomidev/textarea";
// ...more lines, one per component
```

`import "@loomidev/components"` therefore registers _every_ `<loomi-*>` tag in one go.
The package also exposes a **subpath export per component** — e.g.
[`packages/components/src/button.ts`](../packages/components/src/button.ts) is literally one
line, `export * from "@loomidev/button";` — wired up via the long `exports` map in
[`packages/components/package.json`](../packages/components/package.json), so a consumer who
installed the umbrella package can still cherry-pick: `import "@loomidev/components/button"`
pulls in only that one component's code, even though it all lives in one installed
package.

`forms`, `content`, and `navigation` are the same pattern at a smaller scale — each
re-exports just the components in its category (per
[`packages/forms/src/index.ts`](../packages/forms/src/index.ts): input, autocomplete,
password, textarea, text-editor, select, checkbox, radio, toggle, number, slider, otp,
checkcards, tag-input, emoji-picker, datepicker, timepicker, timezonepicker,
date-range-picker, colorpicker, filepicker, filter-builder, countries, and creditcard).
They exist
purely as a convenience layer; deleting all four umbrella packages would not break any
individual component package's functionality.

---

## 9. Internationalization (i18n)

Built-in component text (placeholders, validation messages, aria-labels, month/weekday
names in the datepicker, …) is centralized in `@loomidev/core`, not hardcoded per
component. [`packages/core/src/locales/`](../packages/core/src/locales) holds one file per
built-in language (`en.ts`, `es.ts`, `fr.ts`, `de.ts`, `ar.ts`, `it.ts`, `ml.ts`,
`pt_BR.ts`, `tr.ts`, `zh_CN.ts`), each exporting a nested object of translation strings,
merged together in [`locales/index.ts`](../packages/core/src/locales/index.ts).

[`packages/core/src/i18n.ts`](../packages/core/src/i18n.ts) provides the runtime API:

- **`setLoomiLocale("es")`** — sets a global active locale; every component re-renders
  its built-in text in Spanish from then on.
- **`defineLoomiTranslations("ak", { ... })`** — registers a brand-new locale (or extends
  an existing one) at runtime, with no need to touch this repo's source at all — handy if
  a consumer needs a language LoomiUI doesn't ship built-in.
- A `locale="fr"` **attribute** on any individual component overrides the global setting
  for just that one instance (`<loomi-datepicker locale="fr">`).

Lookup falls back gracefully: an exact locale match, then the base language (`pt_BR` →
`pt`), then English, so a partially-translated locale never shows blank text — see
`readLocalizedValue()` in `i18n.ts` for the fallback chain.

---

## 10. How a Lit component updates

When you are new to Lit, the easiest mental model is: **properties are the state,
`render()` is the drawing function, and Lit calls `render()` whenever a reactive property
changes.** You usually do not call `render()` yourself.

For example, this attribute:

```html
<loomi-button outline radius="full">Save</loomi-button>
```

becomes these property values on the component instance:

```ts
this.outline = true;
this.radius = "full";
```

Then Lit schedules an update. "Schedules" matters: the update does not always happen
immediately on the exact same line of code. Lit batches changes so this:

```ts
button.outline = true;
button.radius = "full";
button.icon = "check";
```

normally produces one render pass, not three. That is why tests often wait for
`await el.updateComplete` after changing a property: it means "wait until Lit has finished
the render caused by my change."

The common lifecycle hooks you will see in this repo are:

- **`connectedCallback()`** — the element was attached to the page. Use this for setup
  that needs the real document, such as document-level event listeners. Always call
  `super.connectedCallback()` first.
- **`disconnectedCallback()`** — the element was removed from the page. Use this to clean
  up timers, object URLs, and document-level listeners. Always call
  `super.disconnectedCallback()`.
- **`willUpdate(changed)`** — Lit is about to render. Good for deriving internal state from
  changed properties or syncing form values before paint. Several form controls call
  `this.internals.setFormValue(...)` here.
- **`firstUpdated()`** — the first render has happened and `this.shadowRoot` contains the
  rendered DOM. Use this when you need to query or wire up something that did not exist
  before render.
- **`updated(changed)`** — a render just finished. Use this when a change must be followed
  by DOM work, such as focus management or syncing child components.

Attribute/property conversion is another place beginners get surprised:

- String properties do not need a converter: `@property() label = ""`.
- Boolean attributes are true when present: `<loomi-button outline>` means `outline === true`.
- Number properties need `@property({ type: Number })`, otherwise `"2"` stays a string.
- Kebab-case attributes need an explicit name when the JS property is camelCase:
  `@property({ attribute: "border-width" }) borderWidth = 2`.
- `reflect: true` copies property changes back onto the host attribute. Use it when CSS,
  tests, or outside code need to see that state on `<loomi-button ...>`.

Finally, remember the DOM is split in two:

- **Light DOM** is what the consumer writes between the tags:
  `<loomi-button>Save</loomi-button>`.
- **Shadow DOM** is what the component renders internally.
- A `<slot>` is the doorway between them. It shows light-DOM children at a chosen position
  inside the shadow-DOM layout.

---

## 11. Events, forms, and accessibility

Shippable components must also meet the accessibility, responsive, and dark-mode bars in
[`docs/COMPONENT_QUALITY.md`](COMPONENT_QUALITY.md). Run `pnpm audit:quality` before
opening a PR.

Web Components are real DOM elements, so they communicate with the outside page through
normal browser events. The important Shadow DOM detail is the pair of options you see
again and again:

```ts
this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
```

- **`bubbles: true`** lets the event travel upward through ancestors, so a form, page, or
  framework wrapper can listen in one place.
- **`composed: true`** lets the event cross the Shadow DOM boundary. Without it, many
  events would stay trapped inside the component.
- **`CustomEvent`** is used when the event needs extra data:
  `new CustomEvent("loomi-selection-change", { detail: { selected } })`.

**Event naming convention:** an event that mirrors native semantics keeps the native
name — `change`, `input`, `close`, video's `timeupdate` — so framework two-way-binding
conventions keep working. Every other custom event carries the **`loomi-` prefix**
(`loomi-select`, `loomi-page-change`, `loomi-reorder`, …). Two reasons: a consumer can
tell at a glance which events come from this library, and a bare name like `select`
dispatched from a composed shadow tree is indistinguishable from the native event of the
same name to a listener further up the page.

For form-like components (`input`, `select`, `checkbox`, `slider`, `datepicker`, and
friends), the key browser feature is **form-associated custom elements**:

```ts
static formAssociated = true;
private internals = this.attachInternals();
```

That gives the component an `ElementInternals` object. Calling
`this.internals.setFormValue(this.value)` teaches a normal `<form>` what value to submit
for this custom element. That is why this works like a native input:

```html
<form>
  <loomi-input name="email" value="ada@example.com"></loomi-input>
</form>
```

When the browser builds `new FormData(form)`, Loomi's custom input can contribute
`email=ada@example.com`. Validation hooks (`checkValidity()`, `reportValidity()`,
`setValidity(...)`) use the same `internals` object.

Accessibility lives in the rendered HTML, not in TypeScript types. When changing a
component, look for:

- native elements where possible (`button`, `input`, `a`) instead of making everything a
  clickable `div`;
- `aria-*` attributes when a custom surface needs to describe state, such as
  `aria-expanded`, `aria-disabled`, or `aria-label`;
- keyboard handlers for components that open, close, select, or move focus;
- `part="..."` attributes when consumers need a stable styling hook inside Shadow DOM.

If you add a new interactive behavior, ask the simple browser question: "Could someone use
this with only a keyboard, and can outside code hear the event it needs?"

---

## 12. The MCP server package

[**MCP** (Model Context Protocol)](https://modelcontextprotocol.io) is an open protocol
that lets AI coding assistants (Claude Code, Cursor, Claude Desktop, …) call out to a
small local/remote server for facts, instead of guessing from training data alone.
`@loomidev/mcp-server` (`packages/mcp-server`) is exactly that: a tiny Node process
(`npx @loomidev/mcp-server`) exposing three tools — `list_components`,
`get_component_docs`, `search_components` — backed by a generated manifest
([`src/generated/manifest.json`](../packages/mcp-server/src/generated/manifest.json), built
from every component's real README/attribute tables by `scripts/build-manifest.mjs`). The
point: when you ask an AI assistant "what attributes does `<loomi-button>` accept," it can
query this server for the _actual, current_ API instead of hallucinating one. It has
nothing to do with the UI components at runtime — it's a developer-experience tool that
ships as its own package because, like everything else here, it's independently versioned
and installed only by people who want it.

(Fittingly, this very `HOW_THIS_PROJECT_WORKS.md` file and the MCP server solve adjacent
problems: one explains the system to a human reading the repo, the other explains specific
component APIs to an AI assistant on demand.)

---

## 13. Testing

The root `test` script runs [`web-test-runner`](https://modern-web.dev/docs/test-runner/overview/),
configured in [`web-test-runner.config.mjs`](../web-test-runner.config.mjs):

```js
export default {
  files: "packages/*/test/**/*.test.ts",
  browsers: [puppeteerLauncher({ launchOptions: { args: ["--no-sandbox"] } })],
  concurrency: 1,
  testFramework: { config: { ui: "bdd", timeout: "10000" } },
};
```

Key things to notice:

- Tests run in a **real headless Chromium** (via Puppeteer), not a simulated DOM. Web
  Components rely on real browser APIs (`customElements`, Shadow DOM, slots) that
  simulated/mocked DOM environments often get subtly wrong — so this project pays for a
  real browser in tests rather than risk that gap.
- Test files import from **`../dist/...`**, never `../src/...` (see
  [`packages/button/test/loomi-button.test.ts`](../packages/button/test/loomi-button.test.ts):
  `import "../dist/loomi-button.js"`). That means **you must run `pnpm build` before
  `pnpm test`** — tests intentionally exercise the exact compiled artifact a real consumer
  would install, catching bugs a TS-source-only test could miss (a build misconfiguration,
  a broken `exports` map, generated CSS that didn't make it into `dist`).
- `concurrency: 1` (run one test file at a time) trades wall-clock speed for reliability —
  each file spins up its own real browser page, and running many in parallel caused flaky
  timeouts under CPU contention on real dev machines. With only a few dozen tests total,
  serial execution is still fast enough that this is a clearly worthwhile trade, per the
  comment directly in the config file.
- The `ui: "bdd"` framework option means tests are written with Mocha's BDD-style
  `describe(...)` / `it(...)` (as opposed to `suite`/`test`), the same shape you'd see in
  Jest or Jasmine.
- [`@open-wc/testing`](https://open-wc.org/docs/testing/testing-package/)'s `fixture()`
  helper mounts a snippet of HTML into a real page and returns the live element, and
  `expect()` is Chai's assertion API.

This section explains _why_ testing works this way, not the full list of commands to run
it — for that (running one package's tests only, `pnpm clean`, `pnpm changeset`, and
every other available command in one table), see
[`CONTRIBUTING.md`](../CONTRIBUTING.md)'s [§12 Quick reference](../CONTRIBUTING.md#12-quick-reference).

---

## 14. CI/CD: GitHub Actions + Changesets

### Continuous integration — [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)

Runs on every push to `main` and every pull request:

```yaml
- run: pnpm install --frozen-lockfile
- run: pnpm build
- run: pnpm typecheck
- run: pnpm test
```

`--frozen-lockfile` means "install exactly what `pnpm-lock.yaml` says, and **fail** if any
`package.json` disagrees with the lockfile" — a safety check that the lockfile committed
to git is actually still accurate, rather than silently regenerating it. Section 17 covers
the kind of workspace/link drift this helps catch.

### Releases — [`.github/workflows/release.yml`](../.github/workflows/release.yml)

This project uses [**Changesets**](https://github.com/changesets/changesets) to manage
"many independently-versioned packages in one repo" — a genuinely hard problem (which
packages bumped? to what version? in what order do dependents get updated? what goes in
each changelog?) that Changesets automates end to end:

1. A contributor making a user-facing change runs `pnpm changeset` locally, which asks
   "which packages changed, and is this a patch/minor/major bump?" and writes a small
   markdown file into `.changeset/` describing it. That file gets committed alongside the
   code change, in the same PR.
2. On every push to `main`, the release workflow checks: are there unconsumed
   `.changeset/*.md` files? If yes, it opens (or updates) a standing **"Version Packages"
   pull request** that bumps every affected `package.json` version and rewrites
   changelogs — automatically, via the `changesets/action` GitHub Action.
3. When a maintainer merges _that_ PR, there are no more unconsumed changesets, so the
   same workflow instead runs `pnpm changeset publish` — which publishes every package
   whose version just changed to the npm registry (with [provenance](https://docs.npmjs.com/generating-provenance-statements),
   a cryptographic attestation that the published artifact came from this exact CI run).

[`.changeset/config.json`](../.changeset/config.json) sets `"baseBranch": "main"`,
`"access": "public"` (packages publish publicly, not as npm's default private), and
`"updateInternalDependencies": "patch"` (if `core` bumps, every package depending on it via
`workspace:^` gets at least a patch bump too, so a consumer installing `button` always
gets a `core` version that actually has the fix). The release workflow needs two repo
secrets to do anything (`NPM_TOKEN` for publish rights, `GITHUB_TOKEN` is automatic) — see
the comment block at the top of `release.yml`.

---

## 15. Root config file cheat-sheet

| File                                                          | What it's for                                                                                                                                                                                              |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`package.json`](../package.json)                             | Root scripts (`build`/`dev`/`test`/`typecheck`), pinned `packageManager`, root devDependencies (TypeScript, test runner, Changesets CLI). `"private": true` — this root package itself is never published. |
| [`pnpm-workspace.yaml`](../pnpm-workspace.yaml)               | Declares `packages/*` as workspace members.                                                                                                                                                                |
| [`tsconfig.base.json`](../tsconfig.base.json)                 | Shared compiler options every package's own `tsconfig.json` extends — target ES2022, strict mode, decorators enabled for Lit, etc.                                                                         |
| [`.npmrc`](../.npmrc)                                         | pnpm behavior tuning — prefer local workspace links over the registry, auto-install peer deps.                                                                                                             |
| [`web-test-runner.config.mjs`](../web-test-runner.config.mjs) | Test runner setup — see section 13.                                                                                                                                                                        |
| [`.changeset/config.json`](../.changeset/config.json)         | Versioning/publishing policy — see section 14.                                                                                                                                                             |
| [`.gitignore`](../.gitignore)                                 | Excludes `node_modules/`, `dist/`, `**/src/generated/`, `*.tsbuildinfo`, etc. — anything reproducible from source never gets committed.                                                                    |
| [`examples/`](../examples)                                    | Plain static `.html` files (no build step) for manually loading components in a real browser tab while developing — `index.html`, `darkmode.html`, `forms.html`, etc.                                      |

---

## 16. Follow one request, start to finish

Tracing what actually happens for the snippet in the README:

```html
<script type="module" src="https://esm.sh/@loomidev/button"></script>
<loomi-button color="red" outline radius="full" icon="trash">Delete</loomi-button>
```

1. The browser fetches the ESM module from the CDN (or, with a real install, your
   bundler resolves `@loomidev/button` to `node_modules/@loomidev/button/dist/index.js`
   per its `package.json`'s `"exports"` map).
2. That module is the compiled `index.js`, which (transitively) runs
   `@customElement("loomi-button")` — this calls `customElements.define(...)` under the
   hood, registering the tag with the browser's **CustomElementRegistry**.
3. The browser parses `<loomi-button>...</loomi-button>` in the HTML. Because the tag is
   now registered, the browser "upgrades" that plain element node into a real
   `LoomiButton` instance — Lit's `connectedCallback()` runs, attaching a Shadow DOM root.
4. Lit reads the element's attributes into the `@property()`-decorated fields:
   `color="red"` → `this.color = "red"`, `outline` (present, no value) →
   `this.outline = true`, `radius="full"` → `this.radius = "full"`, `icon="trash"` →
   `this.icon = "trash"`.
5. Lit calls `render()`. `computeClasses()` builds a string like
   `"loomi-btn ... bg-transparent text-red-600 border-2 border-solid border-red-600
hover:bg-red-50 rounded-full ..."` based on those property values, and `renderIcon()`
   looks up `"trash"` in the icon registry (`@loomidev/icons`, via `@loomidev/button`'s own
   `icons.ts` re-export) to inline its SVG.
6. Lit diffs the new template against the previous render and patches only what changed
   into the element's Shadow DOM — `<button class="...">...</button>`.
7. The browser paints. The Tailwind class names on that `<button>` resolve against the CSS
   rules `buttonStyles` already injected into this element's shadow root at construction
   time (section 4) — rules that were compiled from Tailwind source _months earlier_, at
   `@loomidev/button`'s own `pnpm build` time, not now. Each color utility resolves through
   `var(--loomi-red-600, var(--_loomi-red-600-default))` (section 6); since this page never
   set `--loomi-red-600` on `:root`, it falls through to the private default — Tailwind's
   own `red-600`.
8. "Delete" — the light-DOM text node between the tags — is rendered wherever the
   component's `<slot></slot>` sits inside its shadow tree, visually appearing inside the
   button without that text ever actually living in the shadow DOM.

If the consumer later adds `:root { --loomi-red-600: #cc0000; }` anywhere in their own page
CSS, this exact button (and every other red-colored loomi component on the page) repaints
to that color immediately — no rebuild, because step 7's `var()` lookup is resolved live
by the browser on every paint, not baked in at compile time.

---

## 17. Common gotchas to recognize

These are not exotic bugs. They are the ordinary places this kind of repo can feel
confusing until you know what layer you are looking at.

**"I changed `src/`, but the test still sees old behavior."**
Tests import `dist/`, not `src/`. Rebuild the package first:

```sh
pnpm --filter @loomidev/button build
pnpm test
```

If you are avoiding workspace-wide commands while debugging, run the package's own build
script from its folder or call the same commands its `package.json` uses.

**"I edited `src/generated/styles.css.ts`, but my change disappeared."**
Generated files are outputs. Edit the source that creates them: usually `src/styles.css`,
the shared build script (`scripts/lib/build-component-styles.mjs` at the repo root),
`packages/theme/palette.json`, or the safelist options in the package's
`scripts/build-styles.mjs` shim. Then rebuild.

**"My new Tailwind class does not have any CSS."**
Tailwind only generates classes it can find or classes the build script safelists. Literal
strings like `"bg-red-600"` are easy for Tailwind to see. Dynamic strings like
`` `bg-${color}-600` `` need the build script to safelist every possible result.

**"My event works inside the component but React/plain HTML cannot hear it."**
Check the event options. For public component events, use `{ bubbles: true, composed:
true }` unless there is a deliberate reason not to. `composed` is what lets the event
cross Shadow DOM.

**"My form component renders, but it does not submit a value."**
Rendering an `<input>` inside Shadow DOM is not enough. The host custom element must be
form-associated (`static formAssociated = true`) and call
`this.internals.setFormValue(...)` when its value changes.

**"The page CSS cannot style my internal button/input."**
That is Shadow DOM doing its job. Expose deliberate styling hooks with CSS custom
properties, `part="..."`, reflected host attributes, or the host-level name class from
`LoomiElement`. Do not rely on a page selector like `.loomi-btn` reaching into a shadow
root.

**"A workspace import cannot be resolved after a package rename."**
Check three places together: `package.json` names/dependencies, source imports, and
`pnpm-lock.yaml`/`node_modules` symlinks. Workspace links are created during install; if a
package name changes, re-run install and update imports/lockfile in the same piece of
work.

---

## 18. How to change a component without getting lost

Use this checklist when you get a task like "add an attribute to `<loomi-select>`" or
"make `<loomi-button>` support a new visual state."

1. **Find the package.** The tag name usually maps directly to a folder:
   `<loomi-button>` → `packages/button`, `<loomi-tag-input>` → `packages/tag-input`.
2. **Read `package.json`.** Confirm the package name, build script, dependencies, and
   exported entry points before editing.
3. **Open `src/loomi-*.ts`.** Look for the public properties first. They are the component
   API: every `@property()` usually maps to an HTML attribute or JS property.
4. **Find the render path.** Start at `render()`, then follow helper methods like
   `computeClasses()`, `renderContent()`, or `renderOption()`. This tells you what DOM the
   browser actually sees.
5. **Check styling generation.** If your change adds new Tailwind utility classes, make
   sure they are literal strings or safelisted via the options object in the package's
   `scripts/build-styles.mjs` shim (`packages/button` is the reference example).
6. **Check events and forms.** If outside code needs to know something changed, dispatch a
   public event. If the component participates in forms, update `setFormValue(...)` and
   validation behavior.
7. **Update exports if you add public types.** Public type aliases should usually be
   re-exported from `src/index.ts`, otherwise consumers cannot import them cleanly.
8. **Update docs.** Component packages have their own `README.md`; user-facing attributes,
   events, slots, methods, and examples should be reflected there.
9. **Build before testing.** Because tests read `dist/`, run the package build first, then
   the relevant tests.

The most useful reading order for an unfamiliar component is:

```text
package.json
README.md
src/index.ts
src/loomi-*.ts
scripts/build-styles.mjs
test/*.test.ts
```

That order starts with the public contract, then moves inward to implementation, then
finishes with the behavior the repo already protects.

---

## 19. Where to go next

- [`README.md`](../README.md) — the public-facing pitch, install instructions, theming
  quick-reference, and the full component table.
- [`CONTRIBUTING.md`](../CONTRIBUTING.md) — the detailed, procedural version of a lot of what
  this file covered conceptually: exact steps to add a new component, the npm publishing
  mechanics, translation contribution workflow, and an "open-source readiness" checklist.
- Any individual package's own `README.md` (e.g. [`packages/button/README.md`](../packages/button/README.md))
  — full attribute tables and usage examples for that one component.
- [`examples/`](../examples) — open any `.html` file directly in a browser (no build/server
  needed) to see components live and poke at them.
- [loomiui.com](https://loomiui.com) — the rendered docs site, if you want to see the
  finished product rather than read source.
