# @loomidev/avatar

`<loomi-avatar>` — a rounded image or initials avatar with an optional status dot. Wrap
several in `<loomi-avatars>` to stack them with an optional `+N` bubble. A logged-in user
header, a contact list, or an employee directory are all good fits.

```bash
npm install @loomidev/avatar lit
```

```js
import "@loomidev/avatar";
```

## Basic Usage

```html
<!-- /avatars/john.svg is an image in the docs site public directory -->
<loomi-avatar image="/avatars/john.svg" />
```

## Different Sizes

```html
<loomi-avatar image="/avatars/ada.svg" size="tiny"></loomi-avatar>
<loomi-avatar image="/avatars/robert.svg" size="small"></loomi-avatar>
<loomi-avatar image="/avatars/sara.svg" size="medium"></loomi-avatar>
<loomi-avatar image="/avatars/john.svg" size="regular"></loomi-avatar>
<loomi-avatar image="/avatars/male.jpg" size="big"></loomi-avatar>
<loomi-avatar image="/avatars/female2.jpg" size="huge"></loomi-avatar>
<loomi-avatar image="/avatars/female.jpg" size="omg"></loomi-avatar>
```

## Labels (Initials)

Skip `image` and set `label` to show initials instead — useful as a placeholder for
users without a profile picture.

```html
<loomi-avatar label="JD"></loomi-avatar>
<loomi-avatar label="PK" bg-color="primary"></loomi-avatar>
```

## Stacked Avatars

Wrap avatars in `<loomi-avatars stacked>` to overlap them — most visually consistent
when every child is the same size.

```html
<loomi-avatars stacked>
  <loomi-avatar image="/avatars/female.jpg"></loomi-avatar>
  <loomi-avatar image="/avatars/sara.svg"></loomi-avatar>
  <loomi-avatar label="RB"></loomi-avatar>
</loomi-avatars>
```

### Plus More

Set `plus` to a number to cap the visible avatars and show a trailing `+N` bubble
instead (this implies `stacked`).

```html
<loomi-avatars plus="34">
  <loomi-avatar label="SF"></loomi-avatar>
  <loomi-avatar label="ZH"></loomi-avatar>
  <loomi-avatar label="RB"></loomi-avatar>
</loomi-avatars>
```

## Dot Indicator

Add a status dot — for online/offline/busy presence.

```html
<loomi-avatar image="/avatars/male.jpg" dotted></loomi-avatar>
<loomi-avatar image="/avatars/robert.svg" dotted dot-position="top"></loomi-avatar>
```

The dot accepts any loomi color via `dot-color`:

```html
<loomi-avatars dotted>
  <loomi-avatar image="/avatars/female2.jpg" dot-color="primary"></loomi-avatar>
  <loomi-avatar image="/avatars/male2.jpg" dot-color="gray"></loomi-avatar>
  <loomi-avatar image="/avatars/female.jpg" dot-color="error"></loomi-avatar>
</loomi-avatars>
```

## Custom Background & Dot Colors

```html
<loomi-avatars dotted>
  <loomi-avatar label="SF" bg-color="warning" dot-color="warning"></loomi-avatar>
  <loomi-avatar label="ZH" bg-color="blue" dot-color="blue"></loomi-avatar>
  <loomi-avatar label="RB" bg-color="purple" dot-color="purple"></loomi-avatar>
</loomi-avatars>
```

## Verified Badge

Set `verified` to show a primary-colored check badge in the bottom-right corner —
useful for confirmed accounts, identity-verified users, etc.

```html
<loomi-avatar image="/avatars/ada.svg" verified></loomi-avatar>
```

It sits in the same corner as the default (`bottom`) status dot. If you're also using
`dotted` on a verified avatar, move the dot to the top so the two don't overlap:

```html
<loomi-avatar image="/avatars/sara.svg" verified dotted dot-position="top"></loomi-avatar>
```

## Editable Avatars

Set `editable` to let the user replace the picture themselves. Clicking the avatar (or
focusing it and pressing Enter/Space — it's a real `role="button"`) launches a crop
dialog; applying the crop swaps the avatar's image immediately.

```html
<loomi-avatar image="/avatars/john.svg" editable></loomi-avatar>
```

Hovering or focusing an editable avatar shows a camera icon over a dark overlay as a
visual affordance. Customize the screen-reader label (and the overlay's `aria-label`)
with `edit-label`:

```html
<loomi-avatar label="JD" editable edit-label="Change profile photo"></loomi-avatar>
```

### How it works

Internally, `editable` launches a [`<loomi-filepicker>`](https://www.npmjs.com/package/@loomidev/filepicker)
in `stealth` mode (`crop`, `crop-aspect-ratio="1:1"`, `accepted-file-types="image/*"`) —
the same filepicker package, just with its drop-zone UI hidden and driven imperatively
by the avatar's click handler instead of a visible drag-and-drop box. `@loomidev/filepicker`
is only loaded (via a dynamic `import()`) the first time an `<loomi-avatar editable>` is
actually used, so avatars that don't need editing don't pay for the filepicker/modal/notification
bundle.

Once a crop is applied, the avatar:

1. Creates an object URL for the cropped `File` and sets it as `image`, so the new
   picture shows immediately (no network round-trip needed for the UI to update).
2. Fires a `change` event with `detail: { file, image }` — `file` is the cropped
   `File`, `image` is the object URL now showing in the avatar.

`<loomi-avatar>` itself never uploads anything — saving the file is your app's job. See
below.

### Saving the picked file in the background

Listen for `change` and upload `detail.file` however your backend expects it (typically
`FormData` to a REST/upload endpoint). The avatar has already swapped to the new image
optimistically, so the UI doesn't need to wait on the request:

```html
<loomi-avatar id="profile-pic" image="/avatars/me.jpg" editable></loomi-avatar>

<script type="module">
  const avatar = document.getElementById("profile-pic");

  avatar.addEventListener("change", async (e) => {
    const { file } = e.detail;
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch("/api/profile/avatar", { method: "POST", body: formData });
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      // Optionally swap `image` to the server's final URL once it's known, e.g.
      // const { url } = await res.json();
      // avatar.image = url;
    } catch (err) {
      // The avatar is already showing the new picture locally (via the object URL) —
      // on failure, revert it and let the user know.
      avatar.image = "/avatars/me.jpg";
      console.error(err);
    }
  });
</script>
```

If you'd rather drive the same crop-and-pick flow from your own button instead of the
avatar's built-in click target, see `<loomi-filepicker>`'s `stealth` mode — it's the
exact same mechanism `editable` uses under the hood.

## Hiding the Ring

By default avatars show a ring around them. Turn it off for a flatter look.

```html
<loomi-avatar image="/avatars/sara.svg" show-ring="false"></loomi-avatar>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `image` | _(blank)_ | Image URL. Shown as initials if 3 chars or fewer. |
| `label` | _(blank)_ | Initials shown when no image. |
| `size` | `regular` | `tiny` \| `small` \| `medium` \| `regular` \| `big` \| `huge` \| `omg` |
| `bg-color` | `gray` | Background/ring color for initials (any loomi color). |
| `dotted` | `false` | Show a status dot. _(boolean)_ |
| `dot-color` | `green` | Status dot color. |
| `dot-position` | `bottom` | `top` \| `bottom` |
| `show-ring` | `true` | Show the ring around the avatar. _(boolean)_ |
| `verified` | `false` | Show a primary-colored check badge in the bottom-right corner. _(boolean)_ |
| `editable` | `false` | Clicking (or Enter/Space) launches a crop dialog to replace the image. _(boolean)_ |
| `edit-label` | `Edit avatar` | Accessible label for the editable avatar's button role. |

**Event:** `change` (fires after `editable` applies a crop) — `detail: { file, image }`.

### `<loomi-avatars>` (group)

| Attribute | Default | Description |
| --- | --- | --- |
| `stacked` | `false` | Overlap children. _(boolean)_ |
| `plus` | `0` | Append a `+N` bubble (also forces stacking). |
| `size` | `regular` | Propagated to children. |
| `dotted` | `false` | Show a status dot on each child. _(boolean)_ |
| `dot-color` | `green` | Propagated to children without their own `dot-color`. |
| `dot-position` | `bottom` | Propagated to children without their own `dot-position`. |

> Not (yet) ported from BladewindUI: a clickable `plus_action` callback on the `+N`
> bubble — listen for a `click` on the avatars group element instead.

## Full Example

```html
<loomi-avatars size="big" dotted dot-color="error" dot-position="top" plus="33" stacked>
  <loomi-avatar image="/avatars/robert.svg"></loomi-avatar>
  <loomi-avatar image="/avatars/female.jpg"></loomi-avatar>
  <loomi-avatar label="ZH" bg-color="cyan"></loomi-avatar>
</loomi-avatars>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-avatar>` and `<loomi-avatars>` are standard custom elements, so the browser can use them in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/avatar` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/avatar lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/avatar build
pnpm --filter @loomidev/avatar typecheck
```

### Plain HTML

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/avatar"></script>

<loomi-avatars>
  <loomi-avatar label="AO" bg-color="success"></loomi-avatar>
  <loomi-avatar image="/avatars/female.jpg" alt="Ama" show-ring></loomi-avatar>
</loomi-avatars>
```

### Bundlers and single-page apps

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/avatar";
```


### Laravel Blade

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/avatar lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/avatar";
```

```blade
<loomi-avatars>
  <loomi-avatar label="AO" bg-color="success"></loomi-avatar>
  <loomi-avatar image="/images/team/jdoe.jpg" alt="Ama" show-ring></loomi-avatar>
</loomi-avatars>
```

### React

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/avatar";

export function LoomiExample() {
  return (
    <loomi-avatars>
      <loomi-avatar label="AO" bg-color="success"></loomi-avatar>
      <loomi-avatar image="/images/team/jdoe.jpg" alt="Ama"></loomi-avatar>
    </loomi-avatars>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

### Vue

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/avatar";
</script>

<template>
  <loomi-avatars>
    <loomi-avatar label="AO" bg-color="success"></loomi-avatar>
    <loomi-avatar image="/images/team/jdoe.jpg" alt="Ama" show-ring></loomi-avatar>
  </loomi-avatars>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

### Angular

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/avatar";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-avatars>
      <loomi-avatar label="AO" bg-color="success"></loomi-avatar>
      <loomi-avatar image="/images/team/jdoe.jpg" alt="Ama" show-ring></loomi-avatar>
    </loomi-avatars>
  `,
})
export class AppComponent {}
```

### Svelte and Astro

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/avatar";
</script>

<loomi-avatars>
  <loomi-avatar label="AO" bg-color="success"></loomi-avatar>
  <loomi-avatar image="/images/team/jdoe.jpg" alt="Ama" show-ring></loomi-avatar>
</loomi-avatars>
```

```astro
---
import "@loomidev/avatar";
---

<loomi-avatars>
  <loomi-avatar label="AO" bg-color="success"></loomi-avatar>
  <loomi-avatar image="/images/team/jdoe.jpg" alt="Ama" show-ring></loomi-avatar>
</loomi-avatars>
```

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->
