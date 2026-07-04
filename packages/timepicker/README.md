# @loomidev/timepicker

`<loomi-timepicker>` — pick a time, as a `popup` (input + panel) or `inline`, in 12- or
24-hour format. **Form-associated**: submits a formatted time (e.g. `3:25PM` or `03:25`)
under `name`.

```bash
npm install @loomidev/timepicker lit
```

```js
import "@loomidev/timepicker";
```


## Basic Usage

```html
<loomi-timepicker></loomi-timepicker>
```

## Inline Style

By default the timepicker is a popup — an input that opens a panel. Set `tp-style` to
`inline` to render the hour/minute pickers directly on the page instead, with no input
or popup involved (handy for a settings page where the field is always visible).

```html
<loomi-timepicker tp-style="inline"></loomi-timepicker>
```

> The attribute is `tp-style`, not `style` — `style` is a reserved HTML attribute for
> inline CSS.

## Clock Style

Set `tp-style="clock"` to launch an analog clock in a modal instead of the dropdown
panel. The outer ring picks the hour, the inner ring picks the minute — click a
5-minute mark, or click anywhere on the ring's background for an exact minute (any of
00–59). The center button toggles between 12- and 24-hour format, converting the
currently selected time so it stays correct across the switch.

```html
<loomi-timepicker tp-style="clock" label="Meeting time"></loomi-timepicker>
```

## Time Formats

The default is 12-hour format (1–12 with AM/PM). Set `format="24"` for 24-hour format
(00–23, no AM/PM).

```html
<loomi-timepicker format="24"></loomi-timepicker>
<loomi-timepicker tp-style="inline" format="24"></loomi-timepicker>
```

## Required Fields

```html
<loomi-timepicker required></loomi-timepicker>
<loomi-timepicker label="Start Time" required></loomi-timepicker>
```

## Default Values

```html
<!-- 12-hour format -->
<loomi-timepicker selected-value="3:25PM"></loomi-timepicker>

<!-- 24-hour format -->
<loomi-timepicker selected-value="14:30" format="24"></loomi-timepicker>

<!-- inline, pre-selected -->
<loomi-timepicker tp-style="inline" selected-value="3:25PM"></loomi-timepicker>
```

## Form Values

Specify a `name` to retrieve the value on form submission.

```html
<loomi-timepicker name="event_time" format="24"></loomi-timepicker>
```

```js
new FormData(form).get("event_time"); // "14:30" (format="24") or "2:30PM" (default)
```

## Reacting to a Selection

```js
document.querySelector("loomi-timepicker").addEventListener("change", (e) => {
  console.log(e.detail.value); // "3:25PM" or "15:25"
});
```

## Accessibility

loomi-timepicker is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior

loomi-timepicker is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.


## Dark mode

loomi-timepicker uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `tp-style` | `popup` | `popup` \| `inline` \| `clock` (analog clock in a modal; the attribute is `tp-style`, `style` is reserved). |
| `format` | `12` | `12` \| `24` |
| `variant` | `default` | `default` \| `minimal` (bottom border only, no box) |
| `selected-value` | _(blank)_ | Default time (e.g. `3:25PM` or `03:25`). |
| `label` / `placeholder` | _(blank)_ / `HH:MM` | Popup field label / placeholder. |
| `required` | `false` | Append an asterisk. _(boolean)_ |

**Property:** `value`. **Event:** `change` (`detail: { value }`).

## Full Example

```html
<loomi-timepicker
  name="start_time"
  format="24"
  required
  label="Start Time"
  placeholder="HH:MM"
  tp-style="inline"
  selected-value="00:35"
></loomi-timepicker>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-timepicker>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/timepicker` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/timepicker lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/timepicker build
pnpm --filter @loomidev/timepicker typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="Plain HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/timepicker"></script>

<loomi-timepicker name="meeting_time" label="Meeting time" format="24"></loomi-timepicker>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/timepicker";
```


Because this is a form-capable component, give it a `name` when it should submit with a native `<form>`. Read its value with `new FormData(form).get("the-name")` just like you would for a built-in input.

</loomi-tab>
<loomi-tab label="Laravel Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/timepicker lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/timepicker";
```

```blade
<loomi-timepicker name="meeting_time" label="Meeting time" format="24"></loomi-timepicker>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/timepicker";

export function LoomiExample() {
  return (
    <loomi-timepicker name="meeting_time" label="Meeting time" format="24"></loomi-timepicker>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/timepicker";
</script>

<template>
  <loomi-timepicker name="meeting_time" label="Meeting time" format="24"></loomi-timepicker>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/timepicker";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-timepicker name="meeting_time" label="Meeting time" format="24"></loomi-timepicker>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte and Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/timepicker";
</script>

<loomi-timepicker name="meeting_time" label="Meeting time" format="24"></loomi-timepicker>
```

```astro
---
import "@loomidev/timepicker";
---

<loomi-timepicker name="meeting_time" label="Meeting time" format="24"></loomi-timepicker>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
- `@loomidev/icons`
- `@loomidev/modal` (used by the `clock` style)
