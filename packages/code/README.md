# @loomi/code

`<loomi-code>` — a verification-code (PIN) input of N boxes with auto-advance and paste
support. It's common to send users a 4–6 digit code via email or SMS for them to enter
here. **Form-associated**: submits the joined code under `name`.

```bash
npm install @loomi/code lit
```

```js
import "@loomi/code";
```

## Basic Usage

The default number of boxes is four.

```html
<loomi-code></loomi-code>
```

```html
<loomi-code size="big"></loomi-code>
```

Set `total-digits` to show more or fewer boxes — there's no upper limit, so this also
works well for collecting longer numeric codes like account numbers.

```html
<loomi-code total-digits="6"></loomi-code>
```

## Masking

Hide the entered characters, like a password field.

```html
<loomi-code mask></loomi-code>
```

## Reacting to a Completed Code

The `verify` event fires once every box is filled. `e.detail.code` is the joined string.

```html
<loomi-code></loomi-code>

<script type="module">
  document.querySelector("loomi-code").addEventListener("verify", (e) => {
    console.log(e.detail.code); // "1234"
  });
</script>
```

## Showing an Error & Clearing

Call `showError()` on the element to display `error-message` and shake the boxes red;
call `clear()` to empty them so the user can try again.

```html
<loomi-code error-message="Yikes, check your code"></loomi-code>

<script type="module">
  const el = document.querySelector("loomi-code");
  el.addEventListener("verify", (e) => {
    if (e.detail.code !== "1234") {
      el.showError();
      el.clear();
    }
  });
</script>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `total-digits` | `4` | Number of input boxes. |
| `size` | `small` | `small` \| `big` |
| `mask` | `false` | Hide entered characters. _(boolean)_ |
| `error-message` | `Verification code is invalid` | Shown when `showError()` is called. |

**Methods:** `clear()`, `showError()`. **Property:** `code`. **Event:** `verify`
(`detail: { code }`, fired when all boxes are filled).

> Not (yet) ported from BladewindUI: the built-in resend countdown timer, spinner and
> success-checkmark helpers — wire those up yourself from the `verify` event and your own
> async verification call.

## Full Example

```html
<loomi-code
  name="pin-code"
  total-digits="5"
  error-message="Please enter the correct code"
></loomi-code>

<script type="module">
  const el = document.querySelector("loomi-code");
  el.addEventListener("verify", async (e) => {
    const ok = await verifyPin(e.detail.code);
    if (!ok) {
      el.showError();
      el.clear();
    }
  });
</script>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-code>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/code` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomi/code lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomi/code build
pnpm --filter @loomi/code typecheck
```

### Plain HTML

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomi/code"></script>

<loomi-code name="otp" total-digits="6" mask="number"></loomi-code>
```

### Bundlers and single-page apps

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomi/code";
```


Because this is a form-capable component, give it a `name` when it should submit with a native `<form>`. Read its value with `new FormData(form).get("the-name")` just like you would for a built-in input.

### Laravel Blade

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomi/code lit
npm run dev
```

```js
// resources/js/app.js
import "@loomi/code";
```

```blade
<loomi-code name="otp" total-digits="6" mask="number"></loomi-code>
```

### React

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomi/code";

export function LoomiExample() {
  return (
    <loomi-code name="otp" total-digits="6" mask="number"></loomi-code>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

### Vue

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomi/code";
</script>

<template>
  <loomi-code name="otp" total-digits="6" mask="number"></loomi-code>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

### Angular

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomi/code";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-code name="otp" total-digits="6" mask="number"></loomi-code>
  `,
})
export class AppComponent {}
```

### Svelte and Astro

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomi/code";
</script>

<loomi-code name="otp" total-digits="6" mask="number"></loomi-code>
```

```astro
---
import "@loomi/code";
---

<loomi-code name="otp" total-digits="6" mask="number"></loomi-code>
```

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->
