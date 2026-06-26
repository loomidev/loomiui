# @loomi/filepicker

`<loomi-filepicker>` — a drag-and-drop file picker with previews. Keeps a real
`<input type="file">` in sync, so it submits inside a `<form>` with
`enctype="multipart/form-data"`. A lightweight, dependency-free take on BladewindUI's
Filepond wrapper.

```bash
npm install @loomi/filepicker lit
```

```js
import "@loomi/filepicker";
```

## Basic Usage

Supports both click-to-browse and drag-and-drop out of the box.

```html
<loomi-filepicker name="certs"></loomi-filepicker>
```

## Placeholder Text

The default placeholder shows "Browse or drag and drop files" with accepted file types
and max size on the second line. Customize either line — use `%s` in
`placeholder-line2` to inject the accepted types and max size dynamically.

```html
<loomi-filepicker
  placeholder-line1="Upload proof of payment"
  placeholder-line2="Only PDF files are allowed"
></loomi-filepicker>

<loomi-filepicker
  placeholder-line1="Drag and drop proof of payment here"
  placeholder-line2="Files allowed: %s up to %s"
></loomi-filepicker>
```

## Drag-and-Drop or Browse Only

```html
<!-- drag and drop only -->
<loomi-filepicker can-browse="false" placeholder-line1="Drag and drop files"></loomi-filepicker>

<!-- browse only -->
<loomi-filepicker can-drop="false" placeholder-line1="Click here to select your file"></loomi-filepicker>
```

## File Size Limits

```html
<loomi-filepicker max-file-size="15kb"></loomi-filepicker>
```

## File Type Restrictions

```html
<loomi-filepicker accepted-file-types="application/pdf,.doc,.docx"></loomi-filepicker>
```

## Multiple Files

When `max-files` is greater than `1`, the `name` is submitted as an array
(`name[]`).

```html
<loomi-filepicker name="photos" max-files="5"></loomi-filepicker>
```

## Image Previews

Thumbnails for selected images are shown by default; turn them off if you'd rather show
just file names.

```html
<loomi-filepicker max-files="3" show-image-preview="false"></loomi-filepicker>
```

## Disabled & Required

```html
<loomi-filepicker disabled></loomi-filepicker>
<loomi-filepicker required></loomi-filepicker>
```

## Reacting to a Selection

Listen for `change` to read the currently-selected files — useful for building your own
upload progress UI or client-side validation before the form is submitted.

```html
<loomi-filepicker name="docs" max-files="3"></loomi-filepicker>

<script type="module">
  document.querySelector("loomi-filepicker").addEventListener("change", (e) => {
    console.log(e.detail.files); // FileList-like array
  });
</script>
```

## Form Submission

Since the component keeps a real `<input type="file">` in sync internally, a normal
form submit with `enctype="multipart/form-data"` just works.

```html
<form method="POST" action="/upload" enctype="multipart/form-data">
  <loomi-filepicker name="attachments" max-files="3" max-file-size="2mb"></loomi-filepicker>
  <loomi-button can-submit>Upload</loomi-button>
</form>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | File input name (becomes `name[]` when `max-files > 1`). |
| `accepted-file-types` | `image/*,application/pdf` | Comma-separated MIME types / extensions. |
| `placeholder-line1` / `placeholder-line2` | … | Drop-zone text (`%s` → types, then max size). |
| `max-files` | `1` | Maximum number of files. |
| `max-file-size` | `5mb` | Max size per file (`kb` / `mb` / `gb`). |
| `can-browse` / `can-drop` | `true` | Allow click-to-browse / drag-and-drop. _(boolean)_ |
| `show-image-preview` | `true` | Thumbnail previews for images. _(boolean)_ |
| `disabled` / `required` | `false` | Disable / mark required. _(boolean)_ |

**Property:** `selectedFiles`. **Event:** `change` (`detail: { files }`).

> Not ported from BladewindUI's Filepond wrapper: built-in image cropping/resizing and
> auto-upload-to-route. Use the `change` event with your own upload logic, or submit the
> form for manual upload.

## Full Example

```html
<loomi-filepicker
  name="profile_pic"
  placeholder-line1="Choose a profile picture"
  placeholder-line2="Only jpg/png files allowed, up to %s"
  accepted-file-types=".jpg,.jpeg,.png"
  max-files="1"
  max-file-size="1mb"
  show-image-preview
  can-browse
  can-drop
></loomi-filepicker>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-filepicker>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/filepicker` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomi/filepicker lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomi/filepicker build
pnpm --filter @loomi/filepicker typecheck
```

### Plain HTML

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomi/filepicker"></script>

<loomi-filepicker name="documents" accepted-file-types=".pdf,.docx" max-files="3"></loomi-filepicker>
```

### Bundlers and single-page apps

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomi/filepicker";
```


Because this is a form-capable component, give it a `name` when it should submit with a native `<form>`. Read its value with `new FormData(form).get("the-name")` just like you would for a built-in input.

### Laravel Blade

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomi/filepicker lit
npm run dev
```

```js
// resources/js/app.js
import "@loomi/filepicker";
```

```blade
<loomi-filepicker name="documents" accepted-file-types=".pdf,.docx" max-files="3"></loomi-filepicker>
```

### React

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomi/filepicker";

export function LoomiExample() {
  return (
    <loomi-filepicker name="documents" accepted-file-types=".pdf,.docx" max-files="3"></loomi-filepicker>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

### Vue

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomi/filepicker";
</script>

<template>
  <loomi-filepicker name="documents" accepted-file-types=".pdf,.docx" max-files="3"></loomi-filepicker>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

### Angular

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomi/filepicker";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-filepicker name="documents" accepted-file-types=".pdf,.docx" max-files="3"></loomi-filepicker>
  `,
})
export class AppComponent {}
```

### Svelte and Astro

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomi/filepicker";
</script>

<loomi-filepicker name="documents" accepted-file-types=".pdf,.docx" max-files="3"></loomi-filepicker>
```

```astro
---
import "@loomi/filepicker";
---

<loomi-filepicker name="documents" accepted-file-types=".pdf,.docx" max-files="3"></loomi-filepicker>
```

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->
