# @loomi/dropmenu

`<loomi-dropmenu>` — a dropdown action menu. Different from [`<loomi-select>`](../select)
in purpose: select submits a value with a form, dropmenu doesn't carry a value at all —
it's for quick actions, like "Edit / Delete" on a row.

```bash
npm install @loomi/dropmenu lit
```

```js
import "@loomi/dropmenu";
```

## Basic Usage

The default trigger is a horizontal-ellipsis icon.

```html
<loomi-dropmenu>
  <loomi-dropmenu-item>Invite to Project</loomi-dropmenu-item>
  <loomi-dropmenu-item>Assign Task</loomi-dropmenu-item>
  <loomi-dropmenu-item>Send Message</loomi-dropmenu-item>
</loomi-dropmenu>
```

## Trigger Icon

Swap the trigger for any icon from [`@loomi/icons`](../icons).

```html
<loomi-dropmenu trigger="musical-note">
  <loomi-dropmenu-item>Add to playlist</loomi-dropmenu-item>
  <loomi-dropmenu-item>Play again</loomi-dropmenu-item>
</loomi-dropmenu>

<loomi-dropmenu trigger="cog-6-tooth">
  <loomi-dropmenu-item>Company settings</loomi-dropmenu-item>
  <loomi-dropmenu-item>User settings</loomi-dropmenu-item>
</loomi-dropmenu>
```

## Trigger on Hover

Opens on `click` by default; switch to `mouseover` for a hover-activated menu.

```html
<loomi-dropmenu trigger="musical-note" trigger-on="mouseover">
  <loomi-dropmenu-item>Add to playlist</loomi-dropmenu-item>
  <loomi-dropmenu-item>Play again</loomi-dropmenu-item>
</loomi-dropmenu>
```

## Custom Trigger Markup

Use the `trigger` slot to make a button, avatar, or any other element the trigger
instead of an icon.

```html
<loomi-dropmenu>
  <loomi-button slot="trigger" type="secondary" size="tiny">Options</loomi-button>
  <loomi-dropmenu-item>Add to playlist</loomi-dropmenu-item>
  <loomi-dropmenu-item>Play again</loomi-dropmenu-item>
</loomi-dropmenu>

<loomi-dropmenu>
  <div slot="trigger" style="display:flex;align-items:center;gap:0.5rem;box-shadow:0 1px 2px rgb(0 0 0 / 0.1);padding:0 1rem;border-radius:0.375rem">
    <loomi-avatar size="small" image="/john.jpg"></loomi-avatar>
    <div>
      <div><strong>John C. Doe</strong></div>
      <div style="font-size:0.875rem">Tech, IT Support</div>
    </div>
    <loomi-icon name="chevron-down" style="width:1rem;height:1rem"></loomi-icon>
  </div>
  <loomi-dropmenu-item>Deactivate my account</loomi-dropmenu-item>
  <loomi-dropmenu-item>Delete Profile</loomi-dropmenu-item>
</loomi-dropmenu>
```

## Item Actions

Each `<loomi-dropmenu-item>` can contain any markup — a link, a button, or just text —
and you're free to attach a regular `click` listener.

```html
<loomi-dropmenu trigger="light-bulb">
  <loomi-dropmenu-item><a href="/library" target="_blank">Go to Library</a></loomi-dropmenu-item>
  <loomi-dropmenu-item id="show-modal-item">Show a Modal</loomi-dropmenu-item>
</loomi-dropmenu>

<script type="module">
  import { showLoomiModal } from "@loomi/modal";
  document.getElementById("show-modal-item").addEventListener("click", () => showLoomiModal("dropmenu-demo"));
</script>
```

## Headers, Icons and Dividers

### Headers

A header is still a `<loomi-dropmenu-item>`, just without hover styling or a pointer
cursor, and with a divider line separating it from the items below.

```html
<loomi-dropmenu>
  <loomi-dropmenu-item header>Project</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="paper-airplane">Invite</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="trash">Delete</loomi-dropmenu-item>
</loomi-dropmenu>
```

### Icons

```html
<loomi-dropmenu-item icon="pencil-square">Edit Profile</loomi-dropmenu-item>
```

By default an item's icon sits on the left. Set `icon-right` on the menu (applies to
every item) or on an individual item to flip it.

```html
<loomi-dropmenu icon-right>
  <loomi-dropmenu-item icon="pencil-square">Edit Profile</loomi-dropmenu-item>
</loomi-dropmenu>
```

### Dividers

```html
<loomi-dropmenu>
  <loomi-dropmenu-item>Edit</loomi-dropmenu-item>
  <loomi-dropmenu-item divider></loomi-dropmenu-item>
  <loomi-dropmenu-item>Delete</loomi-dropmenu-item>
</loomi-dropmenu>
```

Use `divided` on the menu itself for a thin line between every item instead, regardless
of explicit divider items.

```html
<loomi-dropmenu divided>
  <loomi-dropmenu-item>Add to playlist</loomi-dropmenu-item>
  <loomi-dropmenu-item>Play again</loomi-dropmenu-item>
</loomi-dropmenu>
```

## Menu Position

By default the menu chooses the side with the most visible space. This helps menus
inside documentation shells, tables and sidebars avoid opening underneath nearby page
chrome.

```html
<loomi-dropmenu position="auto">…</loomi-dropmenu>
<loomi-dropmenu position="left">…</loomi-dropmenu>
<loomi-dropmenu position="right">…</loomi-dropmenu>
```

## Scrollable Menus

For long item lists, cap the menu's height and let it scroll instead of growing
indefinitely.

```html
<loomi-dropmenu scrollable height="150">
  <loomi-dropmenu-item>Item 1</loomi-dropmenu-item>
  <loomi-dropmenu-item>Item 2</loomi-dropmenu-item>
  <!-- … -->
</loomi-dropmenu>
```

## Keeping the Menu Open After a Click

By default clicking any item closes the menu. Set `hide-after-click="false"` to keep it
open — useful when items are themselves toggles or checkboxes.

```html
<loomi-dropmenu hide-after-click="false">
  <loomi-dropmenu-item><loomi-checkbox>Email notifications</loomi-checkbox></loomi-dropmenu-item>
  <loomi-dropmenu-item><loomi-checkbox>SMS notifications</loomi-checkbox></loomi-dropmenu-item>
</loomi-dropmenu>
```

## Pairing with `<loomi-bell>`

See [`<loomi-bell>`'s README](../bell#wrapping-it-in-a-trigger) for a worked example of
`<loomi-dropmenu>` as a notifications panel.

## Attributes

### `<loomi-dropmenu>`

| Attribute | Default | Description |
| --- | --- | --- |
| `trigger` | _(ellipsis)_ | Icon name (with `-icon` suffix) for the trigger. |
| `trigger-on` | `click` | `click` \| `mouseover` |
| `position` | `auto` | Menu alignment. `auto` \| `left` \| `right` |
| `divided` | `false` | Divider lines between items. _(boolean)_ |
| `scrollable` | `false` | Scroll items past `height`. _(boolean)_ |
| `height` | `200` | Max menu height (px) when scrollable. |
| `hide-after-click` | `true` | Close the menu after an item click. _(boolean)_ |
| `icon-right` | `false` | Place every item's icon after its label. _(boolean)_ |

### `<loomi-dropmenu-item>`

| Attribute | Default | Description |
| --- | --- | --- |
| `icon` | _(blank)_ | Leading icon name. |
| `icon-right` | `false` | Place the icon after the label. _(boolean)_ |
| `header` | `false` | Non-clickable section header. _(boolean)_ |
| `divider` | `false` | Render a divider line. _(boolean)_ |

**Slots:** default (items), `trigger` (custom trigger markup).

## Full Example

```html
<loomi-dropmenu trigger="pencil-square" trigger-on="mouseover" divided scrollable height="150" position="left">
  <loomi-dropmenu-item header>Profile</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="user">View Profile</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="pencil-square">Edit Profile</loomi-dropmenu-item>
  <loomi-dropmenu-item divider></loomi-dropmenu-item>
  <loomi-dropmenu-item icon="trash">Delete Account</loomi-dropmenu-item>
</loomi-dropmenu>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-dropmenu-item>` and `<loomi-dropmenu>` are standard custom elements, so the browser can use them in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/dropmenu` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomi/dropmenu lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomi/dropmenu build
pnpm --filter @loomi/dropmenu typecheck
```

### Plain HTML

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomi/dropmenu"></script>

<loomi-dropmenu>
  <loomi-button slot="trigger">Actions</loomi-button>
  <loomi-dropmenu-item icon="pencil-square">Edit</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="trash">Delete</loomi-dropmenu-item>
</loomi-dropmenu>
```

### Bundlers and single-page apps

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomi/dropmenu";
```


### Laravel Blade

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomi/dropmenu lit
npm run dev
```

```js
// resources/js/app.js
import "@loomi/dropmenu";
```

```blade
<loomi-dropmenu>
  <loomi-button slot="trigger">Actions</loomi-button>
  <loomi-dropmenu-item icon="pencil-square">Edit</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="trash">Delete</loomi-dropmenu-item>
</loomi-dropmenu>
```

### React

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomi/dropmenu";

export function LoomiExample() {
  return (
    <loomi-dropmenu>
      <loomi-button slot="trigger">Actions</loomi-button>
      <loomi-dropmenu-item icon="pencil-square">Edit</loomi-dropmenu-item>
      <loomi-dropmenu-item icon="trash">Delete</loomi-dropmenu-item>
    </loomi-dropmenu>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

### Vue

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomi/dropmenu";
</script>

<template>
  <loomi-dropmenu>
    <loomi-button slot="trigger">Actions</loomi-button>
    <loomi-dropmenu-item icon="pencil-square">Edit</loomi-dropmenu-item>
    <loomi-dropmenu-item icon="trash">Delete</loomi-dropmenu-item>
  </loomi-dropmenu>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

### Angular

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomi/dropmenu";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-dropmenu>
      <loomi-button slot="trigger">Actions</loomi-button>
      <loomi-dropmenu-item icon="pencil-square">Edit</loomi-dropmenu-item>
      <loomi-dropmenu-item icon="trash">Delete</loomi-dropmenu-item>
    </loomi-dropmenu>
  `,
})
export class AppComponent {}
```

### Svelte and Astro

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomi/dropmenu";
</script>

<loomi-dropmenu>
  <loomi-button slot="trigger">Actions</loomi-button>
  <loomi-dropmenu-item icon="pencil-square">Edit</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="trash">Delete</loomi-dropmenu-item>
</loomi-dropmenu>
```

```astro
---
import "@loomi/dropmenu";
---

<loomi-dropmenu>
  <loomi-button slot="trigger">Actions</loomi-button>
  <loomi-dropmenu-item icon="pencil-square">Edit</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="trash">Delete</loomi-dropmenu-item>
</loomi-dropmenu>
```

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->
