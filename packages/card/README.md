# @loomidev/card

shadcn/ui-style card primitives for LoomiUI. Compose a card from `<loomi-card>` and its
`loomi-card-*` parts — the same structure as [shadcn/ui Card](https://ui.shadcn.com/docs/components/radix/card).

```bash
npm install @loomidev/card lit
```

```js
import "@loomidev/card";
```


## Composition

```text
loomi-card
├── loomi-card-header
│   ├── loomi-card-title
│   ├── loomi-card-description
│   └── loomi-card-action
├── loomi-card-content
└── loomi-card-footer
```

## Basic Usage

```html
<loomi-card>
  <loomi-card-header>
    <loomi-card-title>Card Title</loomi-card-title>
    <loomi-card-description>Card Description</loomi-card-description>
  </loomi-card-header>
  <loomi-card-content>
    <p>Card Content</p>
  </loomi-card-content>
  <loomi-card-footer>
    <p>Card Footer</p>
  </loomi-card-footer>
</loomi-card>
```

## Login Example

```html
<loomi-card style="max-width: 24rem">
  <loomi-card-header>
    <loomi-card-title>Login to your account</loomi-card-title>
    <loomi-card-description>
      Enter your email below to login to your account
    </loomi-card-description>
    <loomi-card-action>
      <loomi-button variant="link">Sign Up</loomi-button>
    </loomi-card-action>
  </loomi-card-header>
  <loomi-card-content>
    <form><!-- fields --></form>
  </loomi-card-content>
  <loomi-card-footer style="flex-direction: column; gap: 0.5rem">
    <loomi-button block>Login</loomi-button>
    <loomi-button block outline>Login with Google</loomi-button>
  </loomi-card-footer>
</loomi-card>
```

## Small Size

Use `size="sm"` on `<loomi-card>` for tighter spacing (matches shadcn's `size="sm"`).

```html
<loomi-card size="sm" style="max-width: 24rem">
  <loomi-card-header>
    <loomi-card-title>Small Card</loomi-card-title>
    <loomi-card-description>This card uses the small size variant.</loomi-card-description>
  </loomi-card-header>
  <loomi-card-content>
    <p>More compact spacing between sections.</p>
  </loomi-card-content>
  <loomi-card-footer>
    <loomi-button size="small" outline block>Action</loomi-button>
  </loomi-card-footer>
</loomi-card>
```

## Clickable Cards

Set `url` to make the whole card act as a link — a path, a full URL, or a JS function
call. Pair it with `has-hover` for a hover-shadow cue.

```html
<loomi-card has-hover url="/dashboard">
  <loomi-card-content>Click anywhere on me</loomi-card-content>
</loomi-card>
```

## Image Cards

Place an `<img>` as the first child of `<loomi-card>` to get a flush top image with rounded
top corners (same pattern as shadcn's image example).

```html
<loomi-card style="max-width: 24rem">
  <img src="/cover.jpg" alt="Event cover" />
  <loomi-card-header>
    <loomi-card-action>
      <loomi-tag label="Featured" color="secondary"></loomi-tag>
    </loomi-card-action>
    <loomi-card-title>Design systems meetup</loomi-card-title>
    <loomi-card-description>A practical talk on component APIs.</loomi-card-description>
  </loomi-card-header>
  <loomi-card-footer>
    <loomi-button block>View Event</loomi-button>
  </loomi-card-footer>
</loomi-card>
```

## Card Styling

`<loomi-card>` renders as a clean, solid panel by default: a semantic surface fill,
hairline border, theme-aware panel radius, and restrained shadow. This keeps dense
dashboard and settings layouts clear without adding a glass effect. Turn the border or
shadow off with `has-border` / `has-shadow`. Add `transparent` when you want to keep
card spacing and composition but let the parent surface show through.

```html
<loomi-card has-shadow="false" has-border="false" style="max-width: 20rem">
  <loomi-card-content>Flat, no border or shadow</loomi-card-content>
</loomi-card>
<loomi-card has-shadow="false" style="max-width: 20rem">
  <loomi-card-content>Border only</loomi-card-content>
</loomi-card>
<loomi-card transparent has-shadow="false" has-border="false" style="max-width: 20rem">
  <loomi-card-content>Transparent card shell</loomi-card-content>
</loomi-card>
```

## Spacing

Section spacing is controlled by the `--loomi-card-spacing` custom property on
`<loomi-card>` (defaults to `1rem`, `0.75rem` when `size="sm"`). Override it for custom
layouts:

```html
<loomi-card style="--loomi-card-spacing: 1.5rem">...</loomi-card>
```

The card also reads the Pro theme tokens `--loomi-component-panel-radius` and
`--loomi-component-card-shadow`. You can override `--loomi-card-radius` or
`--loomi-card-shadow` directly when a single card needs a different treatment.

## Accessibility

loomi-card is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Compose headings with `loomi-card-title` for page structure.

## Responsive behavior

loomi-card is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.


## Dark mode

loomi-card uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.


## Attributes

### `<loomi-card>`

| Attribute | Default | Description |
| --- | --- | --- |
| `size` | `default` | `default` \| `sm` — controls section spacing. |
| `has-shadow` | `true` | Restrained, theme-aware panel shadow. _(boolean)_ |
| `has-border` | `true` | Hairline border. _(boolean)_ |
| `has-hover` | `false` | Extra shadow on hover. _(boolean)_ |
| `transparent` | `false` | Remove the card surface fill. _(boolean)_ |
| `url` | _(blank)_ | Navigate on click (path, `fn()` call, or full URL). |

### Parts

| Element | Description |
| --- | --- |
| `<loomi-card-header>` | Title, description, and optional action. |
| `<loomi-card-title>` | Card heading. |
| `<loomi-card-description>` | Muted helper text under the title. |
| `<loomi-card-action>` | Top-right header action (button, badge, link). |
| `<loomi-card-content>` | Main card body. |
| `<loomi-card-footer>` | Bottom actions; gets a muted background and top border. |

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-card>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/card` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/card lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/card build
pnpm --filter @loomidev/card typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/card"></script>

<loomi-card>
  <loomi-card-header>
    <loomi-card-title>Billing</loomi-card-title>
  </loomi-card-header>
  <loomi-card-content>
    <p>Your next invoice is due on Friday.</p>
  </loomi-card-content>
</loomi-card>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/card";
```

</loomi-tab>
<loomi-tab label="Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/card lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/card";
```

```blade
<loomi-card>
  <loomi-card-header>
    <loomi-card-title>Billing</loomi-card-title>
  </loomi-card-header>
  <loomi-card-content>
    <p>Your next invoice is due on Friday.</p>
  </loomi-card-content>
</loomi-card>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/card";

export function LoomiExample() {
  return (
    <loomi-card>
      <loomi-card-header>
        <loomi-card-title>Billing</loomi-card-title>
      </loomi-card-header>
      <loomi-card-content>
        <p>Your next invoice is due on Friday.</p>
      </loomi-card-content>
    </loomi-card>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/card";
</script>

<template>
  <loomi-card>
    <loomi-card-header>
      <loomi-card-title>Billing</loomi-card-title>
    </loomi-card-header>
    <loomi-card-content>
      <p>Your next invoice is due on Friday.</p>
    </loomi-card-content>
  </loomi-card>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/card";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-card>
      <loomi-card-header>
        <loomi-card-title>Billing</loomi-card-title>
      </loomi-card-header>
      <loomi-card-content>
        <p>Your next invoice is due on Friday.</p>
      </loomi-card-content>
    </loomi-card>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte / Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/card";
</script>

<loomi-card>
  <loomi-card-header>
    <loomi-card-title>Billing</loomi-card-title>
  </loomi-card-header>
  <loomi-card-content>
    <p>Your next invoice is due on Friday.</p>
  </loomi-card-content>
</loomi-card>
```

```astro
---
import "@loomidev/card";
---

<loomi-card>
  <loomi-card-header>
    <loomi-card-title>Billing</loomi-card-title>
  </loomi-card-header>
  <loomi-card-content>
    <p>Your next invoice is due on Friday.</p>
  </loomi-card-content>
</loomi-card>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
