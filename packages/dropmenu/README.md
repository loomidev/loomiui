# @loomidev/dropmenu

`<loomi-dropmenu>` is for quick actions: profile menus, row actions, account menus,
and small command lists. It is different from [`<loomi-select>`](../select): a select
stores a value for a form, while a dropmenu simply shows actions the user can choose.

```bash
npm install @loomidev/dropmenu lit
```

```js
import "@loomidev/dropmenu";
```

## Basic Usage

Import the package once, then place `<loomi-dropmenu-item>` elements inside the menu.
The default trigger is a horizontal ellipsis.

```html
<loomi-dropmenu>
  <loomi-dropmenu-item>Invite to Project</loomi-dropmenu-item>
  <loomi-dropmenu-item>Assign Task</loomi-dropmenu-item>
  <loomi-dropmenu-item>Send Message</loomi-dropmenu-item>
</loomi-dropmenu>
```

## Trigger Icon

Swap the default ellipsis for any icon from [`@loomidev/icons`](../icons). You can
write the icon name with or without the `-icon` suffix.

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

Menus open on `click` by default. Use `trigger-on="mouseover"` when the surrounding UI
already behaves like a hover menu.

```html
<loomi-dropmenu trigger="musical-note" trigger-on="mouseover">
  <loomi-dropmenu-item>Add to playlist</loomi-dropmenu-item>
  <loomi-dropmenu-item>Play again</loomi-dropmenu-item>
</loomi-dropmenu>
```

## Custom Trigger Markup

Use the `trigger` slot when the trigger should look like text, an avatar row, or a
custom control. The component wraps this slot in its own button, so keep the slotted
markup non-interactive.

```html
<loomi-dropmenu>
  <span slot="trigger" style="font-weight:600">Options</span>
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

Each `<loomi-dropmenu-item>` can be plain text, a link, or markup that you handle with
a regular `click` listener.

```html
<loomi-dropmenu trigger="light-bulb">
  <loomi-dropmenu-item><a href="/library" target="_blank">Go to Library</a></loomi-dropmenu-item>
  <loomi-dropmenu-item id="show-modal-item">Show a Modal</loomi-dropmenu-item>
</loomi-dropmenu>

<script type="module">
  import { showLoomiModal } from "@loomidev/modal";
  document.getElementById("show-modal-item").addEventListener("click", () => showLoomiModal("dropmenu-demo"));
</script>
```

## Headers, Icons and Dividers

### Headers

Use `header` for a non-clickable section label. It keeps the same spacing as the rest
of the menu but does not get pointer or hover behavior.

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

By default an item's icon sits on the left. Set `icon-right` on the menu to flip every
item, or set it on one item to flip just that row.

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

Use `divided` on the menu itself when every row should have a thin separator.

```html
<loomi-dropmenu divided>
  <loomi-dropmenu-item>Add to playlist</loomi-dropmenu-item>
  <loomi-dropmenu-item>Play again</loomi-dropmenu-item>
</loomi-dropmenu>
```

## Checkboxes

Set `checkbox` on an item to turn it into a toggle row. It shows a checkmark when
`checked`, keeps the menu open on click (unlike a normal item), and fires a `change`
event you can use to sync application state.

```html
<loomi-dropmenu>
  <loomi-dropmenu-item header>Appearance</loomi-dropmenu-item>
  <loomi-dropmenu-item checkbox checked>Status Bar</loomi-dropmenu-item>
  <loomi-dropmenu-item checkbox>Activity Bar</loomi-dropmenu-item>
  <loomi-dropmenu-item checkbox>Panel</loomi-dropmenu-item>
</loomi-dropmenu>

<script type="module">
  document.querySelectorAll("loomi-dropmenu-item[checkbox]").forEach((item) => {
    item.addEventListener("change", () => console.log(item.textContent.trim(), item.checked));
  });
</script>
```

## Radio Groups

Set `radio` plus a shared `group` name to make a set of items mutually exclusive,
similar to a native radio group. Give each item a `value`; the previously checked
item in the same `group` is unchecked automatically.

```html
<loomi-dropmenu>
  <loomi-dropmenu-item header>Panel Position</loomi-dropmenu-item>
  <loomi-dropmenu-item radio group="position" value="top">Top</loomi-dropmenu-item>
  <loomi-dropmenu-item radio group="position" value="bottom" checked>Bottom</loomi-dropmenu-item>
  <loomi-dropmenu-item radio group="position" value="right">Right</loomi-dropmenu-item>
</loomi-dropmenu>

<script type="module">
  document.querySelectorAll("loomi-dropmenu-item[radio]").forEach((item) => {
    item.addEventListener("change", () => console.log("position:", item.value));
  });
</script>
```

## Disabled Items

Set `disabled` on an item to make it non-interactive: it's skipped by arrow-key
navigation, dimmed, and clicks on it are blocked.

```html
<loomi-dropmenu>
  <loomi-dropmenu-item>GitHub</loomi-dropmenu-item>
  <loomi-dropmenu-item>Support</loomi-dropmenu-item>
  <loomi-dropmenu-item disabled>API</loomi-dropmenu-item>
</loomi-dropmenu>
```

## Destructive Items

Set `variant="destructive"` for irreversible actions like deleting a resource. It
tints the label, icon, and hover state red.

```html
<loomi-dropmenu>
  <loomi-dropmenu-item icon="pencil-square">Edit</loomi-dropmenu-item>
  <loomi-dropmenu-item divider></loomi-dropmenu-item>
  <loomi-dropmenu-item variant="destructive" icon="trash">Delete</loomi-dropmenu-item>
</loomi-dropmenu>
```

## Keyboard Shortcut Hints

Use `shortcut` to show a keyboard shortcut or command hint on the right side of an
item, like `⌘S` or `⌘K>P`.

```html
<loomi-dropmenu>
  <loomi-dropmenu-item icon="user" shortcut="⌘K>P">View profile</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="cog-6-tooth" shortcut="⌘S">Settings</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="moon">Dark mode</loomi-dropmenu-item>
</loomi-dropmenu>
```

The shortcut text is a visual hint. Wire the actual keyboard command in your app, then
trigger the same action you use for the item click.

## Multi-level Menus

Add submenu items with `slot="submenu"` inside the parent item. The parent keeps the
menu open and shows a chevron automatically.

```html
<loomi-dropmenu>
  <loomi-dropmenu-item icon="user" shortcut="⌘K>P">View profile</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="cog-6-tooth" shortcut="⌘S">Settings</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="question-mark-circle">
    Support
    <loomi-dropmenu-item slot="submenu">Documentation</loomi-dropmenu-item>
    <loomi-dropmenu-item slot="submenu">Contact support</loomi-dropmenu-item>
    <loomi-dropmenu-item slot="submenu">System status</loomi-dropmenu-item>
  </loomi-dropmenu-item>
  <loomi-dropmenu-item icon="cube">
    API
    <loomi-dropmenu-item slot="submenu">API keys</loomi-dropmenu-item>
    <loomi-dropmenu-item slot="submenu">Webhooks</loomi-dropmenu-item>
  </loomi-dropmenu-item>
</loomi-dropmenu>
```

## Menu Placement

By default the menu chooses the side with the most visible space. This helps menus in
tables, sidebars, and documentation shells stay on screen.

```html
<loomi-dropmenu placement="auto">…</loomi-dropmenu>
<loomi-dropmenu placement="left">…</loomi-dropmenu>
<loomi-dropmenu placement="right">…</loomi-dropmenu>
```

## Scrollable Menus

For long lists, cap the menu's height and let the menu body scroll.

```html
<loomi-dropmenu scrollable height="150">
  <loomi-dropmenu-item>Item 1</loomi-dropmenu-item>
  <loomi-dropmenu-item>Item 2</loomi-dropmenu-item>
  <!-- … -->
</loomi-dropmenu>
```

## Keeping the Menu Open After a Click

By default, clicking an item closes the menu. Set `hide-after-click="false"` when the
items contain controls such as toggles or checkboxes.

```html
<loomi-dropmenu hide-after-click="false">
  <loomi-dropmenu-item><loomi-checkbox>Email notifications</loomi-checkbox></loomi-dropmenu-item>
  <loomi-dropmenu-item><loomi-checkbox>SMS notifications</loomi-checkbox></loomi-dropmenu-item>
</loomi-dropmenu>
```

## Pairing with `<loomi-bell>`

See [`<loomi-bell>`'s README](../bell#wrapping-it-in-a-trigger) for a worked example of
`<loomi-dropmenu>` as a notifications panel.

## Accessibility

For the library-wide baseline, see [Component foundations — Accessibility](https://loomiui.com/customization/component-foundations/#accessibility).

## Responsive behavior

For the shared container and viewport rules, see [Component foundations — Responsive behavior](https://loomiui.com/customization/component-foundations/#responsive-behavior).

## Dark mode

For theme activation, token overrides, and contrast guidance, see [Component foundations — Dark mode](https://loomiui.com/customization/component-foundations/#dark-mode).

## Attributes

### `<loomi-dropmenu>`

| Attribute          | Default      | Description                                                |
| ------------------ | ------------ | ---------------------------------------------------------- |
| `trigger`          | _(ellipsis)_ | Icon name for the trigger. The `-icon` suffix is optional. |
| `trigger-on`       | `click`      | Open interaction: `click` or `mouseover`.                  |
| `placement`        | `auto`       | Menu alignment. `auto` \| `left` \| `right`                |
| `divided`          | `false`      | Divider lines between items. _(boolean)_                   |
| `scrollable`       | `false`      | Scroll items past `height`. _(boolean)_                    |
| `height`           | `200`        | Max menu height (px) when scrollable.                      |
| `hide-after-click` | `true`       | Close the menu after an item click. _(boolean)_            |
| `icon-right`       | `false`      | Place every item's icon after its label. _(boolean)_       |

### `<loomi-dropmenu-item>`

| Attribute    | Default   | Description                                                       |
| ------------ | --------- | ----------------------------------------------------------------- |
| `icon`       | _(blank)_ | Leading icon name.                                                |
| `shortcut`   | _(blank)_ | Right-aligned keyboard shortcut hint.                             |
| `icon-right` | `false`   | Place the icon after the label. _(boolean)_                       |
| `header`     | `false`   | Non-clickable section header. _(boolean)_                         |
| `divider`    | `false`   | Render a divider line. _(boolean)_                                |
| `hover`      | `true`    | Enable hover styling for a normal item. _(boolean)_               |
| `disabled`   | `false`   | Skip navigation/clicks and dim the row. _(boolean)_               |
| `variant`    | `default` | `default` \| `destructive` (tints the row red).                   |
| `checkbox`   | `false`   | Render as a checkbox row; toggles `checked` on click. _(boolean)_ |
| `radio`      | `false`   | Render as a radio row; use with `group` and `value`. _(boolean)_  |
| `group`      | _(blank)_ | Shared name that makes `radio` items mutually exclusive.          |
| `value`      | _(blank)_ | Value carried by a `radio` item.                                  |
| `checked`    | `false`   | Current state of a `checkbox`/`radio` item. _(boolean)_           |

**Events:** `change` — fired on a `checkbox`/`radio` item when its `checked` state
changes (bubbles, composed).

**Slots:** default (items), `trigger` (custom trigger markup), `submenu` (nested
`<loomi-dropmenu-item>` children on an item).

## Full Example

```html
<loomi-dropmenu placement="right">
  <loomi-dropmenu-item header>Profile</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="user" shortcut="⌘K>P">View profile</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="cog-6-tooth" shortcut="⌘S">Settings</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="question-mark-circle">
    Support
    <loomi-dropmenu-item slot="submenu">Documentation</loomi-dropmenu-item>
    <loomi-dropmenu-item slot="submenu">Contact support</loomi-dropmenu-item>
  </loomi-dropmenu-item>
  <loomi-dropmenu-item divider></loomi-dropmenu-item>
  <loomi-dropmenu-item icon="log-out-01">Sign out</loomi-dropmenu-item>
</loomi-dropmenu>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-dropmenu-item>` and `<loomi-dropmenu>` are standard custom elements, so the browser can use them in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/dropmenu` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/dropmenu lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/dropmenu build
pnpm --filter @loomidev/dropmenu typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/dropmenu"></script>

<loomi-dropmenu>
  <span slot="trigger" style="font-weight:600">Actions</span>
  <loomi-dropmenu-item icon="pencil-square">Edit</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="trash">Delete</loomi-dropmenu-item>
</loomi-dropmenu>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/dropmenu";
```

</loomi-tab>
<loomi-tab label="Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/dropmenu lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/dropmenu";
```

```blade
<loomi-dropmenu>
  <span slot="trigger" style="font-weight:600">Actions</span>
  <loomi-dropmenu-item icon="pencil-square">Edit</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="trash">Delete</loomi-dropmenu-item>
</loomi-dropmenu>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/dropmenu";

export function LoomiExample() {
  return (
    <loomi-dropmenu>
      <span slot="trigger" style="font-weight:600">Actions</span>
      <loomi-dropmenu-item icon="pencil-square">Edit</loomi-dropmenu-item>
      <loomi-dropmenu-item icon="trash">Delete</loomi-dropmenu-item>
    </loomi-dropmenu>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/dropmenu";
</script>

<template>
  <loomi-dropmenu>
    <span slot="trigger" style="font-weight:600">Actions</span>
    <loomi-dropmenu-item icon="pencil-square">Edit</loomi-dropmenu-item>
    <loomi-dropmenu-item icon="trash">Delete</loomi-dropmenu-item>
  </loomi-dropmenu>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/dropmenu";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-dropmenu>
      <span slot="trigger" style="font-weight:600">Actions</span>
      <loomi-dropmenu-item icon="pencil-square">Edit</loomi-dropmenu-item>
      <loomi-dropmenu-item icon="trash">Delete</loomi-dropmenu-item>
    </loomi-dropmenu>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte / Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/dropmenu";
</script>

<loomi-dropmenu>
  <span slot="trigger" style="font-weight:600">Actions</span>
  <loomi-dropmenu-item icon="pencil-square">Edit</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="trash">Delete</loomi-dropmenu-item>
</loomi-dropmenu>
```

```astro
---
import "@loomidev/dropmenu";
---

<loomi-dropmenu>
  <span slot="trigger" style="font-weight:600">Actions</span>
  <loomi-dropmenu-item icon="pencil-square">Edit</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="trash">Delete</loomi-dropmenu-item>
</loomi-dropmenu>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
- `@loomidev/icons`
