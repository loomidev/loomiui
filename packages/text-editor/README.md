# @loomidev/text-editor

`<loomi-text-editor>` — a themeable rich-text editor with a floating label and inline
validation, powered by [Quill](https://quilljs.com) (bold/italic/lists/links). `value`
holds HTML. **Form-associated**: its value submits with the surrounding form.

```bash
npm install @loomidev/text-editor lit
```

```js
import "@loomidev/text-editor";
```

## Basic Usage

```html
<loomi-text-editor placeholder="Comment"></loomi-text-editor>
```

## With Labels

Set `label` instead of (or together with) `placeholder` for a label that sits above
the editor.

```html
<loomi-text-editor label="Comment"></loomi-text-editor>
```

## Required Fields

Marks the field with a red asterisk next to the label, and fails `validate()` while
empty.

```html
<loomi-text-editor required label="Comment"></loomi-text-editor>
```

## Initial Height

`rows` sets the editor's minimum height (in text rows) before content pushes it taller.

```html
<loomi-text-editor label="Bio" rows="6"></loomi-text-editor>
```

## Validation

`validate()` returns `true`/`false` and, with `show-error-inline`, renders
`error-message` directly beneath the field instead of you wiring up your own error UI.

```html
<loomi-text-editor
  required
  label="Bio"
  error-message="Write something about yourself"
  show-error-inline
></loomi-text-editor>

<script type="module">
  const el = document.querySelector("loomi-text-editor");
  submitButton.addEventListener("click", () => {
    if (!el.validate()) return;
    // proceed
  });
</script>
```

## Events

```js
document.querySelector("loomi-text-editor").addEventListener("input", (e) => {
  console.log(e.target.value); // HTML
});
```

Like any element, you can attach standard listeners (`input`, `focus`, `blur`)
directly, or use the exported `field` CSS part to style focus/blur states from
outside the shadow root.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `label` | _(blank)_ | Label above the editor. |
| `placeholder` | _(blank)_ | Placeholder text. |
| `value` | _(blank)_ | Current value as HTML (also a property). |
| `rows` | `3` | Minimum height in text rows. |
| `required` | `false` | Marks the field required. _(boolean)_ |
| `disabled` | `false` | Disable the field. _(boolean)_ |
| `readonly` | `false` | Read-only field. _(boolean)_ |
| `error-message` | _(blank)_ | Message shown when validation fails. |
| `show-error-inline` | `false` | Render the error beneath the field. _(boolean)_ |
| `no-clearing` | `false` | Remove the default bottom margin. _(boolean)_ |

**Methods:** `focus()`, `validate()`. **Events:** `input`, `change` (composed).
**Parts:** `field`.

> Split out of `@loomidev/textarea`'s former `toolbar` mode, which was itself not
> ported from BladewindUI.

## Full Example

```html
<loomi-text-editor
  name="message"
  label="Enter message"
  required
  rows="5"
  show-error-inline
  error-message="A comment is required"
></loomi-text-editor>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-text-editor>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/text-editor` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/text-editor lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/text-editor build
pnpm --filter @loomidev/text-editor typecheck
```

### Plain HTML

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/text-editor"></script>

<loomi-text-editor name="notes" label="Notes" rows="4"></loomi-text-editor>
```

### Bundlers and single-page apps

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/text-editor";
```


Because this is a form-capable component, give it a `name` when it should submit with a native `<form>`. Read its value with `new FormData(form).get("the-name")` just like you would for a built-in input.

### Laravel Blade

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/text-editor lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/text-editor";
```

```blade
<loomi-text-editor name="notes" label="Notes" rows="4"></loomi-text-editor>
```

### React

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/text-editor";

export function LoomiExample() {
  return (
    <loomi-text-editor name="notes" label="Notes" rows="4"></loomi-text-editor>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

### Vue

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/text-editor";
</script>

<template>
  <loomi-text-editor name="notes" label="Notes" rows="4"></loomi-text-editor>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

### Angular

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/text-editor";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-text-editor name="notes" label="Notes" rows="4"></loomi-text-editor>
  `,
})
export class AppComponent {}
```

### Svelte and Astro

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/text-editor";
</script>

<loomi-text-editor name="notes" label="Notes" rows="4"></loomi-text-editor>
```

```astro
---
import "@loomidev/text-editor";
---

<loomi-text-editor name="notes" label="Notes" rows="4"></loomi-text-editor>
```

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->
