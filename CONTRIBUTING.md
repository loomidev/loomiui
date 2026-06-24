# Contributing to LoomiUI

This is the maintainer's guide: what's been built, how the pieces fit together, how to
get a dev environment running, how to add a component, and how to publish. Read this
before touching the codebase — it answers "why is it built this way" for the decisions
that aren't obvious from the code alone.

> **Status note:** this is a single git repository (initialized on `main`) — see
> [§10](#10-should-each-component-be-its-own-git-repository) for why components aren't
> split into separate repos. It hasn't been pushed to a remote yet; do that before
> relying on the CI/release workflows in [§9](#9-publishing-to-npm), which only run on
> GitHub Actions.

## Table of contents

1. [What this is](#1-what-this-is-in-one-paragraph)
2. [pnpm vs npm, and how to set it up](#2-pnpm-vs-npm-and-how-to-set-it-up)
3. [Root-level folders and files](#3-root-level-folders-and-files)
4. [Anatomy of one component package](#4-anatomy-of-one-component-package)
5. [The three foundation packages](#5-the-three-foundation-packages)
6. [Why is there a `components` folder inside `packages`?](#6-why-is-there-a-components-folder-inside-packages)
7. [The theming model](#7-the-theming-model-so-you-dont-break-it)
8. [Adding a new component, step by step](#8-adding-a-new-component-step-by-step)
   - [8a. Automated smoke tests](#8a-automated-smoke-tests)
9. [Publishing to npm](#9-publishing-to-npm)
10. [Should each component be its own git repository?](#10-should-each-component-be-its-own-git-repository)
11. [Open-source readiness — status](#11-open-source-readiness--status)
12. [Quick reference](#12-quick-reference)

---

## 1. What this is, in one paragraph

`loomi` is a **monorepo** containing **52 independent npm packages** that together make
up a Lit-based web component library — the spiritual equivalent of BladewindUI, but for
plain web components instead of Laravel Blade. Every component is shadow-DOM-encapsulated,
authored with Tailwind utility classes for speed, but **Tailwind itself never ships to
consumers** — it's compiled once at build time per-package and the resulting CSS is
inlined into the component's `static styles`. Theming happens entirely through CSS custom
properties (`--loomi-*`), so a consumer can re-skin every component from their own page
CSS with zero build step and zero Tailwind dependency.

---

## 2. pnpm vs npm, and how to set it up

This project uses **pnpm**, not npm, as its package manager. If you've only used npm
before, here's what's different and why it matters for this specific repo.

### What pnpm actually changes

- **Single content-addressable store, not duplicated copies.** npm and Yarn Classic copy
  every dependency into every project's `node_modules`. pnpm downloads each exact
  package version **once** to a global store (`~/.pnpm-store`) and links it into every
  project that needs it via hard links. In a monorepo with 52 packages that mostly share
  `lit`, `typescript`, and `tailwindcss` as dependencies, this is the difference between
  52 copies of those packages on disk and effectively one.
- **Strict, non-flat `node_modules` by default.** npm "hoists" transitive dependencies
  into a flat top-level `node_modules`, which means your code can accidentally `import`
  a package you never declared as a dependency, just because some *other* dependency
  happened to pull it in (a "phantom dependency"). pnpm uses a symlink structure where
  only packages you actually listed in `package.json` are resolvable from your source —
  this catches real bugs (an undeclared dependency that works today and breaks the
  moment a sibling package's dependency tree changes) at install time instead of in
  production.
- **First-class workspace support, including the `workspace:` protocol.** This repo's
  internal cross-package dependencies are declared as `"workspace:^"` (see
  `packages/button/package.json`'s `dependencies`). This is a pnpm-specific protocol that
  means "resolve this from the local workspace, not the registry" during development, and
  **automatically rewrites itself to a real semver range at publish time** (see
  [§9](#9-publishing-to-npm)). npm 7+ has workspace support too, but doesn't have this
  same publish-time rewriting behavior in the same mature form, and historically dedupes
  less aggressively than pnpm in large workspaces.

### Commands you already know, translated

| npm | pnpm | Notes |
| --- | --- | --- |
| `npm install` | `pnpm install` | Installs every workspace package's deps and symlinks workspace packages into each other. |
| `npm install <pkg>` | `pnpm add <pkg>` | |
| `npm uninstall <pkg>` | `pnpm remove <pkg>` | |
| `npm run build` | `pnpm build` | (`run` is optional in pnpm for script names that don't collide with a built-in command) |
| `npm run build --workspaces` | `pnpm -r build` | `-r` = recursive, run in every workspace package. |
| n/a | `pnpm --filter @loomi/<name> build` | Run a script in exactly one workspace package. |
| n/a | `pnpm -r --parallel dev` | Run in every package, all at once instead of sequentially. |

### Setting it up on a fresh machine

1. **Install Node.js.** Tailwind CSS v4's CLI (used by every component's build script)
   requires a reasonably modern Node — **Node 20 or later** is the safe baseline; don't
   go below that.
2. **Install pnpm.** The cleanest path is via Corepack, which ships built into Node 16.9+:
   ```bash
   corepack enable
   corepack use pnpm@9.15.9
   ```
   The root `package.json` pins `"packageManager": "pnpm@9.15.9"` specifically so that,
   once Corepack is enabled, running `pnpm` *anywhere in this repo* transparently fetches
   and uses exactly that version regardless of what else is installed globally — this
   keeps the lockfile behavior identical across every contributor's machine.

   **If `corepack enable` fails with an `EACCES` permission error** (this happened on the
   machine this project was originally built on, when `/usr/local/bin` wasn't
   user-writable), fall back to installing pnpm directly to a location you do own:
   ```bash
   mkdir -p "$HOME/.npm-global"
   npm config set prefix "$HOME/.npm-global"
   npm install -g pnpm@9
   export PATH="$HOME/.npm-global/bin:$PATH"   # add this to your shell profile too
   ```
   Or use the official standalone installer, which doesn't touch global npm config at
   all: `curl -fsSL https://get.pnpm.io/install.sh | sh -`
3. **Verify:** `pnpm -v` should print `9.x.x`.
4. **Install everything:**
   ```bash
   pnpm install
   ```
   This installs every package's `dependencies`/`devDependencies` and symlinks every
   `@loomi/*` workspace package into every other package that depends on it.
5. **Build everything:**
   ```bash
   pnpm build
   ```

---

## 3. Root-level folders and files

```
components/                          (repo root)
├─ package.json                      workspace root manifest (private, never published)
├─ pnpm-workspace.yaml                tells pnpm which folders are workspace packages
├─ tsconfig.base.json                 shared compiler options, extended by every package
├─ web-test-runner.config.mjs         smoke-test runner config (see §8a)
├─ .npmrc                             pnpm linking behavior
├─ .gitignore
├─ .changeset/                        Changesets config + pending changelog entries
├─ .github/                           CI/release workflows, issue & PR templates
├─ LICENSE                            MIT
├─ SECURITY.md                        private vulnerability disclosure policy
├─ README.md                          user-facing docs: what it is, quick start, theming
├─ CONTRIBUTING.md                    this file — architecture, workflow, publishing
├─ examples/                          hand-written HTML demo pages (not published)
└─ packages/                          every package lives here, one folder each
```

### `package.json` (root)
```json
{
  "name": "@loomi/root",
  "private": true,
  "packageManager": "pnpm@9.15.9",
  "engines": { "node": ">=20" },
  "workspaces": ["packages/*"],
  "scripts": {
    "build": "pnpm -r --filter \"./packages/*\" build",
    "clean": "pnpm -r exec rm -rf dist tsconfig.tsbuildinfo && rm -rf node_modules/.cache",
    "dev": "pnpm -r --parallel dev",
    "typecheck": "pnpm -r typecheck",
    "test": "web-test-runner"
  }
}
```
`"private": true` physically prevents this package from ever being published by accident.
It has no `dependencies` of its own — it's purely a script runner. `pnpm -r` runs a script
in every workspace package that defines it, in dependency order (pnpm topologically sorts
by each package's own `dependencies`, so `@loomi/theme` always builds before anything that
depends on it).

### `pnpm-workspace.yaml`
```yaml
packages:
  - "packages/*"
```
Makes pnpm treat every immediate subfolder of `packages/` as its own installable package.
Without this file, `workspace:^` ranges wouldn't resolve.

### `tsconfig.base.json`
Shared `compilerOptions`. Every package's own `tsconfig.json` is two lines —
`"extends": "../../tsconfig.base.json"` plus its own `rootDir`/`outDir`. Changing a
compiler flag for the whole library is a one-file edit, not 52.

### `.npmrc`
```
link-workspace-packages=true
prefer-workspace-packages=true
auto-install-peers=true
```
Tells pnpm to symlink in-workspace `@loomi/*` dependencies locally instead of fetching
them from the registry, and to silently satisfy `peerDependencies` (like `lit`) so you
don't get nagged about them in local dev.

### `examples/`
Plain `.html` files (`index.html`, `forms.html`, `widgets.html`, `data.html`,
`pickers.html`, `dataviz.html`, `content.html`, `theme-test.html`). Each uses an
`importmap` pointing at the *built* `dist/` output of specific packages and exercises
every attribute/variant by hand. This is how every component in this project was
**visually** verified during development, and is still the right tool for checking
rendering/layout/interaction by eye — it's a complement to, not a replacement for, the
automated smoke tests in `packages/*/test/` (see [§8a](#8a-automated-smoke-tests)). These
files are not part of any published package; you need `pnpm build` to have run first so
`dist/` exists before opening them.

---

## 4. Anatomy of one component package

This is the shape **every** one of the 44 individual components follows exactly (using
`button` as the example):

```
packages/button/
├─ package.json
├─ tsconfig.json
├─ scripts/
│  └─ build-styles.mjs        ← compiles Tailwind, never hand-edited per-package
├─ src/
│  ├─ styles.css               ← hand-authored plain CSS + Tailwind utility classes
│  ├─ icons.ts                 ← (only if the component needs icons)
│  ├─ loomi-button.ts          ← the LitElement itself
│  ├─ index.ts                 ← public JS API barrel
│  └─ generated/                ← BUILD OUTPUT, gitignored, regenerated every build
│     └─ styles.css.ts          (created by build-styles.mjs, do not hand-edit)
└─ dist/                        ← BUILD OUTPUT, gitignored, this is what gets published
   ├─ index.js / .d.ts / .js.map / .d.ts.map
   ├─ loomi-button.js / .d.ts / ...
   └─ generated/styles.css.js / .d.ts / ...
```

### `package.json`
```json
{
  "name": "@loomi/button",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
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
  "dependencies": {
    "@loomi/icons": "workspace:^",
    "@loomi/theme": "workspace:^"
  },
  "peerDependencies": { "lit": "^3.0.0" },
  "devDependencies": {
    "@tailwindcss/cli": "^4.0.0", "lit": "^3.3.3", "tailwindcss": "^4.0.0", "typescript": "^5.6.3"
  }
}
```

Things worth understanding line by line:

- **`"files": ["dist"]`** — the publish allowlist. `npm publish`/`pnpm publish` packs
  *only* these paths into the tarball. `src/`, `scripts/`, `node_modules/` never leave
  your machine. No `.npmignore` needed.
- **`"exports"` has two entries.** `"."` is the barrel
  (`import { LoomiButton } from "@loomi/button"`). `"./loomi-button.js"` is a
  *side-effecting* entry point — `import "@loomi/button/loomi-button.js"` executes the
  `@customElement("loomi-button")` decorator and registers the custom element. Consumers
  who just want the tag to work use the second form.
- **`dependencies` vs `peerDependencies` vs `devDependencies`** — the part most likely to
  trip you up:
  - `dependencies`: things this package genuinely needs at runtime that aren't already
    guaranteed by the consumer. `@loomi/theme` and `@loomi/icons` qualify — npm/pnpm's
    dedup logic ensures only one copy of each ends up installed even if five different
    `@loomi/*` packages all depend on them.
  - `peerDependencies`: `lit`. We deliberately do **not** bundle Lit or list it as a
    regular dependency — if every one of the 44 packages bundled its own copy, a consumer
    installing three LoomiUI components could end up with three copies of Lit on the page
    (multiple custom element registries, broken reactivity, bloated bundle). A peer
    dependency means "I need *a* copy of Lit ^3.0.0 to exist somewhere in your tree, you
    supply it." `auto-install-peers=true` satisfies this silently in local dev.
  - `devDependencies`: build-only tools (`tailwindcss`, `@tailwindcss/cli`, `typescript`,
    plus a dev-time copy of `lit`/`@loomi/theme` for the build script and type-checker to
    resolve against). None of this ships.
- **`workspace:^`** — pnpm-specific: "resolve from the local workspace; rewrite to
  `^<published-version>` at publish time." See [§9](#9-publishing-to-npm).

### `scripts/build-styles.mjs`
**Byte-for-byte identical across every component package** except `button` (which has
one extra safelist block — see below). Don't hand-edit it per-package; if the build logic
needs to change, change the master copy and re-copy it everywhere.

What it does, in order:
1. Reads `@loomi/theme/palette.json` (real `node_modules` resolution) for the color
   names, shades, and `prefix` (currently `"loomi"`).
2. Builds a Tailwind `@theme inline` block mapping every Tailwind color utility
   (`bg-red-600`, etc.) onto `var(--loomi-red-600, var(--_loomi-red-600-default))` —
   never a literal hex value.
3. Reads the package's own `src/styles.css` and **auto-expands** any bare
   `var(--loomi-color-shade)` reference into that same public-token-with-private-fallback
   form, so you can just write plain-looking CSS by hand.
4. Feeds all of that, plus `@source` directives pointing at the package's `.ts` files, into
   the real Tailwind v4 CLI (`@tailwindcss/cli`) as a child process.
5. Writes the compiled CSS into `src/generated/styles.css.ts`, wrapped as a Lit
   `CSSResult` via `unsafeCSS(...)`, exported as `componentStyles`.

`@loomi/button` additionally defines a **safelist** (`@source inline(...)`) because its
color classes are built from a runtime template string (`` `bg-${color}-600` ``) that
Tailwind's static scanner can't see — without it, those classes would get purged. Every
other component avoids this by themeing through the `--_loomi-accent` mechanism (see
[§7](#7-the-theming-model-so-you-dont-break-it)) instead of interpolated class names —
simpler, and the pattern I'd recommend for any new component over interpolated utilities.

### `src/styles.css`
Hand-authored, the real design-source-of-truth — borders, padding, `:host` rules, hover
states, etc. It's allowed to reference colors as plain `var(--loomi-gray-300)` because the
build script rewrites them with the fallback chain automatically.

### `src/loomi-button.ts`
```ts
import { loomiStyles } from "@loomi/core";
import { componentStyles } from "./generated/styles.css.js";

@customElement("loomi-button")
export class LoomiButton extends LitElement {
  static override styles = loomiStyles(componentStyles);
  // properties, render()...
}
```
The import is `./generated/styles.css.js` — the **compiled output path**, `.js`
extension even from a `.ts` file. With `"moduleResolution": "Bundler"`, TypeScript
resolves this against what *will* exist after build, not what's in `src/` right now.
**You must run `pnpm build` at least once on a fresh checkout** before TypeScript stops
complaining about a missing module — the generated file doesn't exist until the
style-build step creates it.

### `src/index.ts`
The public API surface — re-exports the component class and any exported
types/helpers. This is what `"."` in `exports` points at.

---

## 5. The three foundation packages

These aren't components — every component depends on them.

### `packages/theme/` — `@loomi/theme`
Single source of truth for the color palette. Key file: `palette.json` (committed,
hand-edited, **not** generated):
```json
{
  "prefix": "loomi",
  "colors": ["primary", "secondary", "red", "blue", "green", "..."],
  "shades": [50, 100, 200, "...", 950],
  "ramps": { "primary": "blue", "secondary": "slate", "red": "red", "..." }
}
```
`scripts/build-tokens.mjs` reads this plus Tailwind's own bundled default color ramps
(so default colors are never hand-typed hex — they come straight from Tailwind's oklch
values) and generates:
- `src/generated/tokens.css.ts` → exports `themeStyles`, a
  `:host { --_loomi-red-600-default: oklch(...); ... }` block. The **only** place default
  color values are declared.
- `src/generated/palette.gen.ts` → typed `LOOMI_COLORS`/`LOOMI_SHADES` consts and types.

To rebrand the entire library's custom-property prefix (e.g. `--loomi-*` →
`--acme-*`), `palette.json`'s `"prefix"` field is the **single line** to change — both
`build-tokens.mjs` and every component's `build-styles.mjs` read it from there.

### `packages/core/` — `@loomi/core`
Shared runtime helpers every component imports. Re-exports `themeStyles` and the palette
from `@loomi/theme`, plus:
- `loomiStyles(...styles)` — `return [themeStyles, ...styles]`. Used in every component's
  `static styles`.
- `accentVars(color)` — the per-instance theming mechanism, see
  [§7](#7-the-theming-model-so-you-dont-break-it).
- `cssColor(color, shade)` — single themed value for inline use (e.g. a status dot).
- `onClickOutside(el, handler)` — used by dropdowns/popovers/selects to close on outside
  click.

### `packages/icons/` — `@loomi/icons`
A single `Record<string, SVGTemplateResult>` (a subset of Heroicons outline paths), plus
`registerLoomiIcon()`/`getLoomiIcon()`/`loomiIconNames()`. Every component that needs an
icon pulls from this **one shared registry** rather than maintaining its own copy — early
in this project `button` and `input` each had separate icon maps, which caused a name
collision once both got re-exported from the umbrella package. Don't reintroduce that.

---

## 6. Why is there a `components` folder inside `packages`?

Two similarly-named things, easy to conflate:

- **`packages/`** — the *folder*. Not itself a package; pnpm just uses it as the
  location for every workspace package per `pnpm-workspace.yaml`. No `package.json` of
  its own.
- **`packages/components/`** — **one ordinary sibling package** among the other 51, whose
  npm name happens to be `@loomi/components`. It's the "install everything" umbrella
  package: it depends on all 44 component packages plus `core`/`icons`/`theme`, and
  re-exports every one of them:

```json
// packages/components/package.json (abridged)
{
  "name": "@loomi/components",
  "dependencies": { "@loomi/core": "workspace:^", "@loomi/button": "workspace:^", "...": "..." },
  "exports": {
    ".": { "import": "./dist/index.js" },
    "./button": { "import": "./dist/button.js" }
  }
}
```
```ts
// packages/components/src/button.ts — one of 44 tiny re-export files
export * from "@loomi/button";
```
That last pattern is what makes `import "@loomi/components/button"` work — it points at
the `"./button"` entry in `exports`, letting someone who installs the umbrella still
cherry-pick a single component without pulling the whole barrel into their bundle.

It's named `components` because that's its npm package name — same logic as `@loomi/button`
living in `packages/button/`. The folder name colliding visually with its parent
(`packages/`) is purely cosmetic; pnpm resolves packages by the `name` field in
`package.json`, never by folder name, so renaming the folder to e.g. `packages/all/` is
safe if the similarity keeps confusing people.

Two more "bundle" packages work identically but for a subset, with no styles of their own
and no per-component subpaths:
- `packages/forms/` → `@loomi/forms` (14 form controls)
- `packages/content/` → `@loomi/content` (18 content/display components)
- `packages/navigation/` → `@loomi/navigation` (4 navigation components)

Their `"build"` script is just `tsc -p tsconfig.json` — nothing to compile.

---

## 7. The theming model (so you don't break it)

**The rule:** never declare the *public* `--loomi-<color>-<shade>` custom property on
`:host`. Only ever declare the *private* `--_loomi-<color>-<shade>-default` (leading
underscore) on `:host`, and reference colors everywhere else as
`var(--loomi-X, var(--_loomi-X-default))`.

**Why:** CSS custom property resolution checks an element's own declarations before
inherited ones. If a component's `:host` declared `--loomi-primary-600: #2563eb`
directly, that would **always win** over a consumer's
`:root { --loomi-primary-600: #16a34a }` — the override would silently do nothing. (This
is exactly the bug that shipped and got caught by testing in a real browser early in this
project.) By only declaring the underscore-prefixed private default, the public slot
stays empty on the component, so a consumer's `:root` override inherits straight through
the shadow boundary and wins; absent an override, `var(..., fallback)` resolves to the
private default.

This is why `@loomi/core` exports **`accentVars(color)`**, used by any component needing a
*per-instance* color (a red checkbox next to a green one can't both just read the global
`--loomi-primary-*`):
```ts
export function accentVars(color: LoomiColor | string): string {
  const c = color || "primary";
  return [
    `--_loomi-accent:${token(c, 600)}`,        // token() = var(--loomi-X-600, var(--_loomi-X-600-default))
    `--_loomi-accent-strong:${token(c, 700)}`,
    `--_loomi-accent-soft:${token(c, 100)}`,
    `--_loomi-accent-softer:${token(c, 50)}`,
    `--_loomi-accent-ring:${token(c, 200)}`,
    `--_loomi-accent-fg:${token(c, 700)}`,
    `--_loomi-accent-border:${token(c, 200)}`,
  ].join(";");
}
```
A component sets this as its inline `style` (`style=${accentVars(this.color)}`), and its
plain CSS reads `background: var(--_loomi-accent)`. Because `accentVars` resolves through
`token()` — which reads the *public* slot first — a global `:root` override still
cascades correctly even though the accent is per-instance. This is the mechanism behind
checkbox/radio/toggle/tag/alert/chart/etc. supporting global theming *and* a per-instance
`color` attribute at once.

**If you write a new component with a `color` attribute, use `accentVars()` — don't
reinvent it.**

---

## 8. Adding a new component, step by step

1. **Decide deps first.** Needs icons? → depends on `@loomi/icons`. Composes another
   component (like `table` needs `checkbox` + `pagination`)? → build those first, depend
   on them as regular `dependencies`.
2. **Scaffold:** `mkdir -p packages/<name>/{src,scripts}`
3. **Copy two files unchanged** from any existing sibling (e.g. `packages/timeline/`):
   `scripts/build-styles.mjs` and `tsconfig.json`.
4. **Write `package.json`** — copy a similar component's, change `name`, `description`,
   `keywords`, the `./loomi-<name>.js` exports path, and `dependencies` (always
   `@loomi/core`; add `@loomi/icons`/other components as needed; always `workspace:^`).
5. **Write `src/styles.css`** — plain CSS, reference colors as `var(--loomi-gray-300)`
   or `var(--_loomi-accent)` if using `accentVars()`.
6. **Write `src/loomi-<name>.ts`**:
   ```ts
   import { loomiStyles /*, accentVars */ } from "@loomi/core";
   import { componentStyles } from "./generated/styles.css.js";

   @customElement("loomi-<name>")
   export class Loomi<Name> extends LitElement {
     static override styles = loomiStyles(componentStyles);
   }
   declare global {
     interface HTMLElementTagNameMap { "loomi-<name>": Loomi<Name>; }
   }
   ```
7. **Write `src/index.ts`** — `export { Loomi<Name>, type ... } from "./loomi-<name>.js";`
8. **Build it in isolation first:**
   ```bash
   pnpm install
   pnpm --filter @loomi/<name> build
   ```
9. **Wire it into its grouping package(s)** (`forms`/`content`/`navigation`) — add to
   `dependencies` and add `export * from "@loomi/<name>";` to `src/index.ts`.
10. **Wire it into the umbrella (`packages/components`)** — add to `dependencies`, add an
    `exports["./<name>"]` entry, add `src/<name>.ts` (`export * from "@loomi/<name>";`),
    add the export line to `src/index.ts`.
11. **Reinstall + full rebuild:** `pnpm install && pnpm build`
12. **Write `packages/<name>/README.md`** — usage examples + full attribute table; copy
    an existing one as a template.
13. **Manually verify in a browser.** Add a section to an `examples/*.html` page,
    import via an import map pointing at `../packages/<name>/dist/loomi-<name>.js`,
    exercise every attribute/variant, check the console for errors. Use this for visual
    correctness — it's not a substitute for the smoke test in the next step.
14. **Add at least one smoke test** at `packages/<name>/test/loomi-<name>.test.ts`
    covering its core behavior (and form-association if applicable). See
    [§8a](#8a-automated-smoke-tests) for the pattern and how to run it.
15. **Add it to the root `README.md`'s component table.**
16. **Record the change:** `pnpm changeset` (see [§9.3](#93-versioning-strategy)).

---

## 8a. Automated smoke tests

There is a real, running test suite — `packages/*/test/**/*.test.ts` — using
[`@web/test-runner`](https://modern-web.dev/docs/test-runner/overview/) with a real
headless Chromium (via `@web/test-runner-puppeteer`) and
[`@open-wc/testing`](https://open-wc.org/docs/testing/testing-package/)'s `fixture()` /
`expect()` / `oneEvent()` helpers. Tests run against the **built `dist/` output**, not
the TypeScript source — they exercise the same artifact a consumer would install, so
`pnpm build` must run before `pnpm test`.

```bash
pnpm build
pnpm test                                          # the whole suite
pnpm web-test-runner --files "packages/button/test/**/*.test.ts"   # one package only
```

Config lives at the repo root in `web-test-runner.config.mjs`. Two things in there are
deliberate, not defaults:

- **`concurrency: 1`.** Running multiple test files' browser pages concurrently caused
  real, reproducible timeouts under CPU contention on a dev machine — every failing test
  was independently verified to pass reliably in isolation, confirming it was a resource
  contention issue, not a bug. Serial execution removes the variable; at this suite's
  size (dozens of tests) the wall-clock cost is negligible (a few seconds). Revisit if
  the suite grows large enough for this to matter.
- **`esbuildPlugin({ ts: true })`** strips TypeScript types when serving test files —
  it does **not** type-check them. `pnpm typecheck` doesn't cover `test/` either (each
  package's `tsconfig.json` only includes `src/**/*.ts`). A test file with a type error
  will still run; catch type issues by eye or add `test/**/*.ts` to a package's
  `tsconfig.json` `include` if you want stricter coverage.

### Current coverage (a starting point, not full coverage)

Smoke tests exist today for **button**, **checkbox**, **modal**, **tab**, and
**select** — chosen to cover the recurring patterns every other component reuses:

| Pattern | Covered by | What to copy for a new component |
| --- | --- | --- |
| Plain attributes/properties, slotted content | `button` | Any standalone component. |
| Form association (`ElementInternals`) | `checkbox` | Any form control — `input`, `radio`, `toggle`, `slider`, `code`, `checkcards`, `rating`, the pickers, etc. all follow the same `willUpdate() { this.internals.setFormValue(...) }` shape. |
| Focus management on an overlay (trap, restore, global open/close registry) | `modal` | `dropmenu`, `popover` — anything that opens a floating panel and should trap/restore focus. |
| Roving-tabindex keyboard navigation (WAI-ARIA APG) | `tab` | Any component with a row of selectable headings. |
| Listbox-button keyboard pattern (`aria-activedescendant`, Arrow/Home/End/Enter) | `select` | `dropmenu`'s menu items, `colorpicker`'s swatch grid — anything presenting a list of choices in a popup. |

The other ~39 components do **not** have smoke tests yet — they've been verified
manually via the `examples/*.html` pages only. Extending coverage as you touch a
component (step 14 above) is the expected way this fills in over time, not a dedicated
backlog effort.

---

## 9. Publishing to npm

### 9.1 One-time account setup
1. Create an npm account: https://www.npmjs.com/signup
2. **Decide who owns the `@loomi` scope.** Scoped packages require *someone* own the
   `loomi` organization on npm. Either create a free npm org at
   https://www.npmjs.com/org/create (free orgs publish unlimited **public** scoped
   packages — what we need), or, if `loomi` is taken, rename the scope everywhere
   (every `package.json` + every internal `@loomi/...` import) *before* the first
   publish — not after.
3. `npm login` (shared auth token, also used by `pnpm publish`).
4. Add `"publishConfig": { "access": "public" }` to every package's `package.json` so you
   don't need to remember `--access public` on every command (npm defaults new scoped
   packages to requiring a paid private plan unless told otherwise).

### 9.2 The mechanic you must understand before publishing anything
`packages/forms/package.json` says `"@loomi/input": "workspace:^"`. That syntax is **not
valid outside this monorepo** — published literally, `npm install @loomi/forms` would
fail for anyone, since the npm registry doesn't understand `workspace:^`.

**`pnpm publish` automatically rewrites `workspace:^` to the dependency's actual
currently-published version** (a real `^x.y.z` range) inside the tarball it uploads — it
does not touch your local `package.json`. This is why it's safe to use `workspace:^`
everywhere during development. You must use `pnpm publish` (not bare `npm publish`) for
this rewriting to happen.

### 9.3 Versioning strategy
**Already set up.** This repo uses [Changesets](https://github.com/changesets/changesets)
(`@changesets/cli`, config at `.changeset/config.json`) — `access` is set to `"public"`
(required for new scoped packages) and `@loomi/root` is in `ignore` (it's private and
never published). Every package's `package.json` already has
`"publishConfig": { "access": "public" }` too, so a raw `pnpm publish` never needs the
flag remembered by hand. Workflow:
1. After a meaningful change, run `pnpm changeset` — interactively records which
   packages changed and the bump type, writing a markdown file under `.changeset/` to
   commit alongside the change.
2. On release day, `pnpm changeset version` — bumps affected `package.json` versions,
   rewrites internal `workspace:^` ranges where needed, updates each package's
   `CHANGELOG.md`. Commit this.
3. `pnpm changeset publish` — changesets' own publish wrapper; only publishes packages
   whose version actually changed, and tags each in git.

### 9.4 Manual publish (no tooling, one-off release)
```bash
pnpm build
pnpm -r publish --access public --dry-run   # ALWAYS dry-run first
pnpm -r publish --access public             # the real thing
```
`pnpm -r publish` runs in every workspace package in dependency order automatically. The
dry run shows exactly what `npm pack` would include per package — confirm only `dist/`
(and, for `@loomi/theme`, also `palette.json` + `src/tailwind-colors.css` per its `files`
field) is being uploaded.

### 9.5 Does publish order matter?
For the **very first release**, yes in one sense: if `@loomi/button` finished publishing
before `@loomi/theme`/`@loomi/icons` existed on the registry at all, `npm install
@loomi/button` would fail for end users immediately. `pnpm -r publish` already publishes
dependency-first (`theme`, `core`, `icons` → components → groupings → `components`
umbrella) — don't fight this by publishing one package manually out of order on the first
release. After that, every package exists at *some* version, so order matters less, but
keep doing dependencies-first anyway.

### 9.6 CI

**Already set up**, in `.github/workflows/`:

- **`ci.yml`** — runs on every push to `main` and every PR: `pnpm install
  --frozen-lockfile && pnpm build && pnpm typecheck && pnpm test`. This is your real gate
  against broken PRs; it runs the full smoke-test suite from [§8a](#8a-automated-smoke-tests)
  in a real headless Chromium via `actions/setup-node` + `pnpm/action-setup`.
- **`release.yml`** — the [Changesets GitHub Action](https://github.com/changesets/action)
  pattern: on push to `main`, it either opens/updates a "Version Packages" PR (if there
  are unconsumed `.changeset/*.md` files) or publishes to npm with **provenance**
  (`id-token: write` permission, so npm can cryptographically attest the package was
  built from this exact commit in CI rather than someone's laptop) once that PR merges.

Neither workflow can actually run until two things exist: the repo is pushed to a GitHub
remote, and these two repo secrets are set —
- `NPM_TOKEN` — an npm **automation** token with publish rights on the `@loomi` org
  (create one at npmjs.com under your account's Access Tokens, scoped to "Automation").
- `GITHUB_TOKEN` is provided automatically by Actions; no setup needed.

---

## 10. Should each component be its own git repository?

**No — keep one monorepo, single git repository.**

This question likely comes from seeing BladewindUI's `monorepo-builder.php` and
per-package `composer.json` files — on Packagist (PHP's registry), each Composer package
conventionally maps to its own dedicated git repo, and BladewindUI's script does a **git
subtree split**: mirroring each `packages/<x>/` subfolder out into its own read-only
GitHub repo, purely because Packagist needs something per-package to point at.

**npm has no such requirement.** The registry only ever sees the tarball `npm
publish`/`pnpm publish` uploads — it has no concept of "this package's repository" beyond
an optional, purely informational `"repository"` field that npm displays as a link and
never validates. `npm publish` works identically whether run from inside a folder that's
part of a huge monorepo or from no repo at all.

Splitting into 52 repos here would be pure overhead with no benefit, and would actively
hurt this project specifically:
- **Cross-cutting changes are common and need to be atomic.** Renaming the
  `--loomi-accent` mechanism touched `core`, `checkbox`, `radio`, and `toggle` in one
  change; making the CSS prefix configurable touched `theme`'s `palette.json` plus every
  component's build script. In one repo that's one reviewable commit. Across 52 repos
  that's 52 PRs that all need to land together, with real risk of drift.
- **This is the standard pattern** for many small, independently-versioned, interdependent
  npm packages maintained by one team — Babel, Jest, Vite's first-party plugins, MUI, and
  Changesets itself all ship this way.
- **You lose nothing at scale.** GitHub issue templates/labels can route "this is about
  the button" without a dedicated repo per component.

Concretely: `git init` at the repo root, commit the tree with the existing `.gitignore` in
place, push as a single repository.

---

## 11. Open-source readiness — status

### Done

- **`LICENSE`** at the repo root (MIT, matching every package's `"license"` field).
- **CI**: `.github/workflows/ci.yml` (build + typecheck + test on every push/PR) and
  `release.yml` (Changesets-driven publish with npm provenance) — see [§9.6](#96-ci).
- **Smoke-level automated tests** via `@web/test-runner` — see [§8a](#8a-automated-smoke-tests).
  Covers 5 of 44 components today (the recurring patterns), not all of them.
- **`SECURITY.md`** with a private disclosure path, plus GitHub issue templates
  (`bug_report.yml`, `feature_request.yml`) and a PR template.
- **npm publish provenance**: wired into `release.yml` (`id-token: write` +
  Changesets' action) — will take effect once the repo has a GitHub remote and the
  `NPM_TOKEN` secret is set; can't be exercised before that.
- **Versioning/changelog automation** via Changesets — see [§9.3](#93-versioning-strategy).
- **Explicit browser support matrix**, a **React/Vue/Angular interop note**, a
  **zero-install CDN quick start**, and the **`@loomi/mcp-server`** highlight — all now
  in the user-facing `README.md` rather than buried here.
- **A *partial* accessibility pass** — not a full audit. Fixed: `modal` now traps Tab
  focus, moves focus into the dialog on open, and restores it to the trigger on close;
  `tabs` now supports the WAI-ARIA APG roving-tabindex pattern (Arrow/Home/End, with
  automatic activation matching its existing click behavior); `select`'s open listbox
  now supports the standard listbox-button keyboard pattern (Arrow/Home/End/Enter with
  `aria-activedescendant`, previously mouse-only). All three are covered by the smoke
  tests in [§8a](#8a-automated-smoke-tests).

### Still open

- **Accessibility coverage beyond the three components above.** `dropmenu` and
  `popover` open floating panels but don't trap/restore focus the way `modal` now does;
  `dropmenu`'s menu items and `colorpicker`'s swatch grid are mouse-only, the same gap
  `select` had. These are the next-most-valuable targets, using the exact same patterns
  already implemented (copy `modal`'s focus-trap helpers; copy `select`'s
  `aria-activedescendant` pattern).
- **Test coverage** for the other ~39 components — extend opportunistically per
  [§8a](#8a-automated-smoke-tests), not as a dedicated backlog effort.
- **An actual GitHub remote.** Nothing in `.github/workflows/` can run, and the
  provenance publish can't be exercised, until this repo is pushed somewhere and its
  secrets are configured.

---

## 12. Quick reference

| I want to... | Do this |
|---|---|
| Build everything | `pnpm build` (from root) |
| Build one package | `pnpm --filter @loomi/<name> build` |
| Clean build artifacts | `pnpm clean` |
| Run the smoke-test suite | `pnpm build && pnpm test` — see [§8a](#8a-automated-smoke-tests) |
| Run one package's tests | `pnpm web-test-runner --files "packages/<name>/test/**/*.test.ts"` |
| Add a new component | See [§8](#8-adding-a-new-component-step-by-step) |
| Theme a color globally | `:root { --loomi-primary-600: #16a34a; }` on the consumer's page |
| Give a component a per-instance color attribute | Use `accentVars(color)` from `@loomi/core`, see [§7](#7-the-theming-model-so-you-dont-break-it) |
| Publish (no tooling) | `pnpm build && pnpm -r publish --access public --dry-run` then drop `--dry-run` |
| Publish (with Changesets, recommended) | `pnpm changeset` → `pnpm changeset version` → `pnpm changeset publish` |
| Diagnose "my color override isn't working" | Check the component declared `--_loomi-X-default` on `:host`, never the public `--loomi-X` ([§7](#7-the-theming-model-so-you-dont-break-it)) |
