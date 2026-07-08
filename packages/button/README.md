# @loomidev/button

`<loomi-button>` — a themeable, framework-agnostic button web component built with Lit.

The button renders as an HTML `<button>` by default. Its look is controlled with separate,
easy-to-combine attributes: `type` controls the style, `color` controls the palette, and
`size`, `radius`, `outline`, and `border-width` adjust the details. This is easier to mix
and match than one long variant string. All colors resolve through `--loomi-*` custom
properties, so the whole button can be re-skinned from your page with no rebuild.

## Installation

```bash
npm install @loomidev/button lit
```

```js
import "@loomidev/button"; // registers <loomi-button>
```

Install `lit` alongside the component. `@loomidev/theme` (the shared design tokens) is
installed automatically.

## Basic Usage

```html
<loomi-button>Subscribe Now</loomi-button>

<!-- uppercase the label -->
<loomi-button uppercase>Subscribe Now</loomi-button>

<!-- render as an <a> tag -->
<loomi-button tag="a" href="/pricing">Subscribe Now</loomi-button>
```

## Button Types

`type` selects the default hue when `color` is unset — both render as a bold fill.
`primary` uses the primary palette; `secondary` uses the secondary palette.

```html
<loomi-button>Primary Button</loomi-button>
<loomi-button outline>Primary Outline</loomi-button>

<loomi-button type="secondary">Secondary Button</loomi-button>
<loomi-button type="secondary" outline>Secondary Outline</loomi-button>
```

## Outline

Set `outline` on any button to drop the fill and keep a colored border + text.

```html
<loomi-button outline color="error" radius="full">Error Outline</loomi-button>
<loomi-button type="secondary" outline radius="full">Secondary Outline</loomi-button>

<!-- custom border width (default is 2) -->
<loomi-button outline border-width="4">Border 4</loomi-button>
<loomi-button outline border-width="8">Border 8</loomi-button>
```

## Sizes

Available sizes: `tiny`, `small`, `regular` (default), `medium`, `big`.

```html
<loomi-button size="tiny">Tiny</loomi-button>
<loomi-button size="small">Small</loomi-button>
<loomi-button>Regular (default)</loomi-button>
<loomi-button size="medium">Medium</loomi-button>
<loomi-button size="big">Big</loomi-button>
```

## Radii

```html
<loomi-button radius="none">None</loomi-button>
<loomi-button radius="small">Small</loomi-button>
<loomi-button radius="medium">Medium</loomi-button>
<loomi-button radius="full">Full</loomi-button>
```

## Colors

`color` overrides the palette independently of `type`. Useful for semantic actions that
shouldn't use the brand colors (e.g. a destructive delete button).

```html
<loomi-button color="error">Delete Account</loomi-button>
<loomi-button color="error" outline>Error Outline</loomi-button>
<loomi-button color="success">Confirm</loomi-button>
<loomi-button color="warning" outline>Proceed with Caution</loomi-button>
```

Available colors: `primary` `secondary` `success` `error` `warning` `gray`

> Leaving `color` unset derives it from `type`: `primary` → the `primary` palette,
> `secondary` → the `secondary` palette.

## Icons

Set `icon` to a name from the built-in registry. Icons default to the left; add
`icon-right` to move them after the label. `icon-right` is ignored while a spinner is
showing.

```html
<loomi-button icon="arrow-path">Refresh Page</loomi-button>
<loomi-button icon="arrow-small-right" icon-right>Next Chapter</loomi-button>
<loomi-button icon="trash" color="error" outline>Delete</loomi-button>
```

Built-in icons (a subset of Heroicons outline): `arrow-path`, `bell-alert`,
`lock-closed`, `arrow-right`, `arrow-small-right`, `chevron-right`, `check`, `plus`,
`trash`, `x-mark`, `magnifying-glass`, `paper-airplane`.

Need more? Register your own — no slot or icon font required:

```js
import { registerLoomiIcon } from "@loomidev/button";
import { svg } from "lit";

registerLoomiIcon("star", svg`<path stroke-linecap="round" stroke-linejoin="round" d="..." />`);
```

## Spinners

`has-spinner` includes a spinner (hidden by default). `show-spinner` makes it visible.
To toggle it on click, call the instance methods `startSpinner()` / `stopSpinner()`.

```html
<!-- visible immediately -->
<loomi-button has-spinner show-spinner>Saving…</loomi-button>

<!-- triggered on click -->
<loomi-button id="save" has-spinner>Save User</loomi-button>
<script type="module">
  const btn = document.getElementById("save");
  btn.addEventListener("click", () => {
    btn.startSpinner();
    saveUser().finally(() => btn.stopSpinner());
  });
</script>
```

## Form Submission

By default the button renders as `<button type="button">` and won't submit forms. Add
`can-submit` to render as `<button type="submit">`.

```html
<loomi-button can-submit>Submit Form</loomi-button>
```

## Disabled

```html
<loomi-button disabled>Disabled</loomi-button>
<loomi-button disabled type="secondary">Disabled Secondary</loomi-button>
<loomi-button disabled outline>Disabled Outline</loomi-button>
```

## Render as a link

```html
<loomi-button tag="a" href="https://example.com" icon="paper-airplane">
  Open
</loomi-button>
```

When `tag="a"` and `disabled` is set, the `href` is removed and the link is taken out of
the tab order.

## Focus Rings

```html
<!-- hide the keyboard focus ring -->
<loomi-button show-focus-ring="false">No Focus Ring</loomi-button>
```

## Slots

For arbitrary content, use the named slots. (For known icon sets, prefer the `icon`
attribute above.)

```html
<loomi-button>
  <img slot="prefix" src="/avatar.png" width="16" height="16" alt="" />
  Profile
  <span slot="suffix">▾</span>
</loomi-button>
```

| Slot | Description |
| --- | --- |
| _(default)_ | The button label. |
| `prefix` | Content rendered before the icon/label. |
| `suffix` | Content rendered after the label. |

## Events

The native `click` event is composed and crosses the shadow boundary, so you listen for
it exactly as you would on a normal button:

```html
<loomi-button onclick="alert('you clicked me')">Click Me</loomi-button>
```

Clicks are suppressed while the button is `disabled`.

## Theming

Override any palette slot from your page — no build step, no Tailwind:

```css
:root {
  --loomi-primary-600: #16a34a; /* every primary button turns green */
  --loomi-primary-700: #15803d;
}
```

See the [root README](../../README.md#theming-the-edit-tailwindconfigjs-replacement) for
the full theming model.

## Accessibility

loomi-button is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.


## Responsive behavior

loomi-button is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.


## Dark mode

loomi-button uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.


## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `type` | `primary` | Structural variant. `primary` \| `secondary` |
| `color` | _(derived from `type`)_ | Palette override. See available colors above. |
| `size` | `regular` | `tiny` \| `small` \| `regular` \| `medium` \| `big` |
| `radius` | `medium` | `none` \| `small` \| `medium` \| `full` |
| `outline` | `false` | Outline only, no fill. _(boolean)_ |
| `border-width` | `2` | Outline border width. `2` \| `4` \| `8` |
| `icon` | _(blank)_ | Built-in or registered icon name. |
| `icon-right` | `false` | Position the icon after the label. Ignored while spinning. _(boolean)_ |
| `has-spinner` | `false` | Include a spinner (hidden until shown). _(boolean)_ |
| `show-spinner` | `false` | Show the spinner. Only when `has-spinner`. _(boolean)_ |
| `disabled` | `false` | Disable the button. _(boolean)_ |
| `tag` | `button` | Element to render. `button` \| `a` |
| `href` | _(blank)_ | Link target when `tag="a"`. |
| `can-submit` | `false` | Render as `type="submit"`. _(boolean)_ |
| `show-focus-ring` | `true` | Show the keyboard focus ring. _(boolean)_ |
| `uppercase` | `false` | Uppercase the label. _(boolean)_ |
| `name` | _(blank)_ | Optional name, reflected as an attribute for targeting. |

### Properties & methods (JS)

| Member | Description |
| --- | --- |
| All attributes above | Available as camelCase properties (e.g. `el.iconRight`, `el.hasSpinner`). |
| `startSpinner()` | Show the spinner (no-op unless `has-spinner` is set). |
| `stopSpinner()` | Hide the spinner. |

## CSS Parts

| Part | Description |
| --- | --- |
| `button` | The underlying `<button>` / `<a>` element. |

## Full Example

```html
<loomi-button
  type="secondary"
  size="big"
  name="btn-subscribe"
  has-spinner
  tag="a"
  href="/subscribe"
  outline
  border-width="2"
  show-focus-ring="false"
  radius="medium"
  icon="lock-closed"
>
  Subscribe
</loomi-button>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-button>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/button` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/button lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/button build
pnpm --filter @loomidev/button typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="Plain HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/button"></script>

<loomi-button color="primary" icon="check">Save changes</loomi-button>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/button";
```

</loomi-tab>
<loomi-tab label="Laravel Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/button lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/button";
```

```blade
<loomi-button color="primary" icon="check">Save changes</loomi-button>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/button";

export function LoomiExample() {
  return (
    <loomi-button color="primary" icon="check">Save changes</loomi-button>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/button";
</script>

<template>
  <loomi-button color="primary" icon="check">Save changes</loomi-button>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/button";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-button color="primary" icon="check">Save changes</loomi-button>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte and Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/button";
</script>

<loomi-button color="primary" icon="check">Save changes</loomi-button>
```

```astro
---
import "@loomidev/button";
---

<loomi-button color="primary" icon="check">Save changes</loomi-button>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
- `@loomidev/icons`
- `@loomidev/theme`
