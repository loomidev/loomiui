# @loomidev/filepicker

`<loomi-filepicker>` — a drag-and-drop file picker with previews. Keeps a real
`<input type="file">` in sync, so it submits inside a `<form>` with
`enctype="multipart/form-data"`. A lightweight take on the older Filepond-style wrapper —
the crop dialog is a `<loomi-modal>` and oversized-file errors surface through
`<loomi-notification>`.

```bash
npm install @loomidev/filepicker lit
```

```js
import "@loomidev/filepicker";
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

## Internationalization

`<loomi-filepicker>` uses Loomi's shared i18n defaults for the drop-zone placeholder,
required validation message, and remove-file label. Custom `placeholder-line1` and
`placeholder-line2` attributes still override the translated defaults.

```js
import { setLoomiLocale, defineLoomiTranslations } from "@loomidev/core";
import "@loomidev/filepicker";

setLoomiLocale("es");

defineLoomiTranslations("ak", {
  filepicker: {
    placeholderLine1: "Paw fael anaa twe bra ha",
    placeholderLine2: "%s kosi %s",
  },
});
```

```html
<!-- Override only this filepicker. -->
<loomi-filepicker locale="pt_BR"></loomi-filepicker>
```

Built-in locales: `en`, `ar`, `de`, `es`, `fr`, `it`, `ml`, `pt_BR`, `tr`, and
`zh_CN`.

## Drag-and-Drop or Browse Only

```html
<!-- drag and drop only -->
<loomi-filepicker can-browse="false" placeholder-line1="Drag and drop files"></loomi-filepicker>

<!-- browse only -->
<loomi-filepicker can-drop="false" placeholder-line1="Click here to select your file"></loomi-filepicker>
```

## File Size Limits

Files over `max-file-size` are skipped and reported with a `<loomi-notification>` error
toast (auto-created on `document.body` if one isn't already on the page).

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

## Transparent and Borderless

Use `transparent` to remove the drop-zone background and `has-border="false"` to hide
its border. The props work independently or together.

```html
<loomi-filepicker transparent has-border="false"></loomi-filepicker>
```

## Image Cropping

Set `crop` to launch a crop dialog as soon as the user selects or drops an image. Drag
the box to reposition it (in any direction) and drag the handle on its corner to resize;
the file added to the picker is the cropped result. Non-image files skip the dialog
entirely.

Constrain the crop box with `crop-aspect-ratio`: `16:9` (default), `4:3`, `2:3`, `1:1`, or
`free` (no fixed ratio — drag the handle to any width/height).

The dialog itself is a `<loomi-modal>`, so Escape and backdrop clicks cancel it the same
way they would any other Loomi modal.

```html
<loomi-filepicker crop crop-aspect-ratio="1:1" accepted-file-types="image/*"></loomi-filepicker>
```

## Image Resizing

Set `resize` to scale every uploaded image to fit within `resize-width` /
`resize-height` (pixels) before it's added to the picker — no dialog, it just happens.
Aspect ratio is preserved; pass only one of the two to constrain a single dimension.
Runs after cropping when both are enabled.

```html
<loomi-filepicker resize resize-width="800" resize-height="600"></loomi-filepicker>
```

## Stealth Mode

Set `stealth` to hide the drop-zone and file list entirely. The native `<input>` and
crop dialog still work — drive them imperatively from your own trigger element with
`open()` (opens the native file picker) and `clear()` (resets the current selection, so
the next `open()` replaces rather than appends — relevant for `max-files="1"`, which
otherwise stops accepting new files once a pick has been made).

```html
<button id="trigger">Change photo</button>
<loomi-filepicker id="fp" stealth crop crop-aspect-ratio="1:1" accepted-file-types="image/*"></loomi-filepicker>

<script type="module">
  const fp = document.getElementById("fp");
  document.getElementById("trigger").addEventListener("click", () => {
    fp.clear();
    fp.open();
  });
  fp.addEventListener("change", (e) => {
    const file = e.detail.files[0];
    // upload `file` …
  });
</script>
```

`<loomi-avatar editable>` is built on exactly this pattern — see its README for a
complete example, including how to upload the picked file in the background.

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

## Accessibility

For the library-wide baseline, see [Component foundations — Accessibility](https://loomiui.com/customization/component-foundations/#accessibility).

## Responsive behavior

For the shared container and viewport rules, see [Component foundations — Responsive behavior](https://loomiui.com/customization/component-foundations/#responsive-behavior).

## Dark mode

For theme activation, token overrides, and contrast guidance, see [Component foundations — Dark mode](https://loomiui.com/customization/component-foundations/#dark-mode).

## Attributes

| Attribute             | Default                                   | Description                                                                       |
| --------------------- | ----------------------------------------- | --------------------------------------------------------------------------------- |
| `name`                | _(blank)_                                 | File input name (becomes `name[]` when `max-files > 1`).                          |
| `accepted-file-types` | `image/*,application/pdf`                 | Comma-separated MIME types / extensions.                                          |
| `placeholder-line1`   | `Choose files or drag and drop to upload` | Drop-zone heading text.                                                           |
| `placeholder-line2`   | `%s up to %s`                             | Drop-zone subtext (`%s` → accepted types, then max size).                         |
| `locale`              | _(global)_                                | Override the shared Loomi locale for this filepicker.                             |
| `max-files`           | `1`                                       | Maximum number of files.                                                          |
| `max-file-size`       | `5mb`                                     | Max size per file (`kb` / `mb` / `gb`).                                           |
| `can-browse`          | `true`                                    | Allow click-to-browse. _(boolean)_                                                |
| `can-drop`            | `true`                                    | Allow drag-and-drop. _(boolean)_                                                  |
| `show-image-preview`  | `true`                                    | Thumbnail previews for images. _(boolean)_                                        |
| `disabled`            | `false`                                   | Disable the picker. _(boolean)_                                                   |
| `required`            | `false`                                   | Mark the field required. _(boolean)_                                              |
| `crop`                | `false`                                   | Launch a crop dialog when an image is selected/dropped. _(boolean)_               |
| `crop-aspect-ratio`   | `16:9`                                    | `16:9`, `4:3`, `2:3`, `1:1`, or `free`.                                           |
| `resize`              | `false`                                   | Resize uploaded images to fit `resize-width`/`resize-height`. _(boolean)_         |
| `resize-width`        | _(unset)_                                 | Target width in pixels; aspect ratio is preserved.                                |
| `resize-height`       | _(unset)_                                 | Target height in pixels; aspect ratio is preserved.                               |
| `transparent`         | `false`                                   | Make the drop-zone background transparent. _(boolean)_                            |
| `has-border`          | `true`                                    | Show the drop-zone border. _(boolean)_                                            |
| `stealth`             | `false`                                   | Hide the drop-zone/file list; drive selection via `open()`/`clear()`. _(boolean)_ |

**Property:** `selectedFiles`. **Methods:** `open()`, `clear()`. **Event:** `change` (`detail: { files }`).

> Not ported from the older Filepond-style wrapper: auto-upload-to-route. Use the `change`
> event with your own upload logic, or submit the form for manual upload.

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
npm install @loomidev/filepicker lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/filepicker build
pnpm --filter @loomidev/filepicker typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/filepicker"></script>

<loomi-filepicker name="documents" accepted-file-types=".pdf,.docx" max-files="3"></loomi-filepicker>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/filepicker";
```

Because this is a form-capable component, give it a `name` when it should submit with a native `<form>`. Read its value with `new FormData(form).get("the-name")` just like you would for a built-in input.

</loomi-tab>
<loomi-tab label="Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/filepicker lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/filepicker";
```

```blade
<loomi-filepicker name="documents" accepted-file-types=".pdf,.docx" max-files="3"></loomi-filepicker>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/filepicker";

export function LoomiExample() {
  return (
    <loomi-filepicker name="documents" accepted-file-types=".pdf,.docx" max-files="3"></loomi-filepicker>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/filepicker";
</script>

<template>
  <loomi-filepicker name="documents" accepted-file-types=".pdf,.docx" max-files="3"></loomi-filepicker>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/filepicker";

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

</loomi-tab>
<loomi-tab label="Svelte / Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/filepicker";
</script>

<loomi-filepicker name="documents" accepted-file-types=".pdf,.docx" max-files="3"></loomi-filepicker>
```

```astro
---
import "@loomidev/filepicker";
---

<loomi-filepicker name="documents" accepted-file-types=".pdf,.docx" max-files="3"></loomi-filepicker>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
- `@loomidev/icons`
- `@loomidev/modal`
- `@loomidev/notification`
