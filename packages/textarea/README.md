# @loomidev/textarea

`<loomi-textarea>` — a themeable multi-line text input with a floating label and inline
validation. **Form-associated**: its value submits with the surrounding form.

```bash
npm install @loomidev/textarea lit
```

```js
import "@loomidev/textarea";
```

## Basic Usage

By default the textarea renders with three rows. Use `placeholder` for simple hint text.

```html
<loomi-textarea placeholder="Comment"></loomi-textarea>
```

## With Labels

Set `label` instead of (or together with) `placeholder` for a label that sits as
placeholder text until the field is focused, then floats to the top border — a compact
way to build forms without separate `<label>` elements taking up space.

```html
<loomi-textarea label="Comment"></loomi-textarea>
```

## Required Fields

Marks the field with a red asterisk next to the label/placeholder, and fails
`validate()` while empty.

```html
<loomi-textarea required label="Comment"></loomi-textarea>
```

## Rows & Resizing

Increase `rows` to make the textarea taller by default.

```html
<loomi-textarea label="Bio" rows="6"></loomi-textarea>
```

## Validation

`validate()` returns `true`/`false` and, with `show-error-inline`, renders
`error-message` directly beneath the field instead of you wiring up your own error UI.

```html
<loomi-textarea
  required
  label="Bio"
  error-message="Write something about yourself"
  show-error-inline
></loomi-textarea>

<script type="module">
  const el = document.querySelector("loomi-textarea");
  submitButton.addEventListener("click", () => {
    if (!el.validate()) return;
    // proceed
  });
</script>
```

## Events

```html
<loomi-textarea
  label="Comment"
  onfocus="this.part.field?.classList.add('ring-2')"
></loomi-textarea>
```

Like any element, you can attach standard listeners (`input`, `focus`, `blur`) directly,
or use the exported `field`/`textarea` CSS parts to style focus/blur states from outside
the shadow root.

```js
document.querySelector("loomi-textarea").addEventListener("input", (e) => {
  console.log(e.target.value);
});
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `label` | _(blank)_ | Floating label. |
| `placeholder` | _(blank)_ | Placeholder text. |
| `value` | _(blank)_ | Current value (also a property). |
| `rows` | `3` | Height in rows. |
| `required` | `false` | Marks the field required. _(boolean)_ |
| `disabled` | `false` | Disable the field. _(boolean)_ |
| `readonly` | `false` | Read-only field. _(boolean)_ |
| `error-message` | _(blank)_ | Message shown when validation fails. |
| `show-error-inline` | `false` | Render the error beneath the field. _(boolean)_ |
| `no-clearing` | `false` | Remove the default bottom margin. _(boolean)_ |

**Methods:** `focus()`, `validate()`. **Events:** `input`, `change` (composed).
**Parts:** `field`, `textarea`.

> Looking for a rich-text editor? See [`@loomidev/text-editor`](../text-editor),
> split out from this component's former `toolbar` mode.

## Full Example

```html
<loomi-textarea
  name="message"
  label="Enter message"
  required
  rows="5"
  show-error-inline
  error-message="A comment is required"
></loomi-textarea>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-textarea>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/textarea` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/textarea lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/textarea build
pnpm --filter @loomidev/textarea typecheck
```

### Plain HTML

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/textarea"></script>

<loomi-textarea name="notes" label="Notes" rows="4"></loomi-textarea>
```

### Bundlers and single-page apps

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/textarea";
```


Because this is a form-capable component, give it a `name` when it should submit with a native `<form>`. Read its value with `new FormData(form).get("the-name")` just like you would for a built-in input.

### Laravel Blade

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/textarea lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/textarea";
```

```blade
<loomi-textarea name="notes" label="Notes" rows="4"></loomi-textarea>
```

### React

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/textarea";

export function LoomiExample() {
  return (
    <loomi-textarea name="notes" label="Notes" rows="4"></loomi-textarea>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

### Vue

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/textarea";
</script>

<template>
  <loomi-textarea name="notes" label="Notes" rows="4"></loomi-textarea>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

### Angular

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/textarea";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-textarea name="notes" label="Notes" rows="4"></loomi-textarea>
  `,
})
export class AppComponent {}
```

### Svelte and Astro

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/textarea";
</script>

<loomi-textarea name="notes" label="Notes" rows="4"></loomi-textarea>
```

```astro
---
import "@loomidev/textarea";
---

<loomi-textarea name="notes" label="Notes" rows="4"></loomi-textarea>
```

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->
