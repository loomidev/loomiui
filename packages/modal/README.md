# @loomidev/modal

`<loomi-modal>` — an overlay dialog with types, sizes, and action buttons.

```bash
npm install @loomidev/modal lit
```

```js
import "@loomidev/modal";
```

## Default Modal

Modals are usually triggered by an action — a button click, say. Every LoomiUI modal is
opened and closed by its unique `name`, using the exported `showLoomiModal()` /
`hideLoomiModal()` helpers (or the instance methods `show()`/`hide()` if you already
have a reference to the element).

> **Important:** give every modal on a page a unique `name` — it's how `showLoomiModal()`
> finds the right one.

The default modal keeps its content left aligned and places action buttons in a gray
footer, right aligned. Clicking the backdrop, pressing <kbd>Esc</kbd>, or clicking a
footer button all dismiss the modal by default. See
[Non-Dismissible Modal](#non-dismissible-modal) to change that.

```html
<loomi-button onclick="showLoomiModal('tnc-agreement')">Basic modal</loomi-button>

<loomi-modal name="tnc-agreement" title="Agree or Disagree">
  Please agree to the terms and conditions before proceeding.
</loomi-modal>

<script type="module">
  import { showLoomiModal } from "@loomidev/modal";
</script>
```

## Different Types

Four prebuilt types add a left-side icon and matching action color. The default (no
`type` set) has no icon.

```html
<loomi-button onclick="showLoomiModal('info')">Info Modal</loomi-button>
<loomi-modal type="info" title="General Info" name="info">
  We really think you should consider it. What say you?
</loomi-modal>

<loomi-button onclick="showLoomiModal('error')">Error Modal</loomi-button>
<loomi-modal type="error" title="Delete Not Allowed" name="error">
  You do not have permission to delete this user.
</loomi-modal>

<loomi-button onclick="showLoomiModal('warning')">Warning Modal</loomi-button>
<loomi-modal type="warning" title="First Warning" name="warning">
  This is your first warning. Two more and you're off the platform.
</loomi-modal>

<loomi-button onclick="showLoomiModal('success')">Success Modal</loomi-button>
<loomi-modal type="success" title="User Deleted" name="success">
  User deleted successfully.
</loomi-modal>
```

## Using Different Icons

Set `icon` to use any icon from [`@loomidev/icons`](../icons) instead of (or together with)
a prebuilt `type`'s default icon. Modal icons render through `<loomi-icon>`.

```html
<loomi-button onclick="showLoomiModal('big-file')">Custom Icon</loomi-button>
<loomi-modal icon="cloud-arrow-down" title="Large File Size" name="big-file">
  This file is quite large. Continue with the download?
</loomi-modal>

<!-- combine a custom icon with a predefined color -->
<loomi-button onclick="showLoomiModal('big-file-warn')">Custom Icon + Type</loomi-button>
<loomi-modal type="warning" icon="cloud-arrow-down" title="Large File Size" name="big-file-warn">
  This file is quite large. Continue with the download?
</loomi-modal>
```

### Icon Source

`icon` renders from `heroicons` by default. Set `icon-source` to pull from a different
set instead — `iconsax` or `untitledui` — matching `<loomi-icon>`'s own `source` attribute.

```html
<loomi-button onclick="showLoomiModal('iconsax-modal')">Iconsax Icon</loomi-button>
<loomi-modal icon="home" icon-source="iconsax" title="Iconsax Icon" name="iconsax-modal">
  This modal's icon comes from the iconsax set.
</loomi-modal>
```

## Different Sizes

```html
<loomi-button onclick="showLoomiModal('tiny-modal')">Tiny</loomi-button>
<loomi-modal size="tiny" title="Tiny Modal" name="tiny-modal">I'm the tiniest.</loomi-modal>

<loomi-button onclick="showLoomiModal('small-modal')">Small</loomi-button>
<loomi-modal size="small" title="Small Modal" name="small-modal">I'm small.</loomi-modal>

<loomi-button onclick="showLoomiModal('medium-modal')">Medium</loomi-button>
<loomi-modal size="medium" title="Medium Modal" name="medium-modal">The default size.</loomi-modal>

<loomi-button onclick="showLoomiModal('large-modal')">Large</loomi-button>
<loomi-modal size="large" title="Large Modal" name="large-modal">I'm large.</loomi-modal>

<loomi-button onclick="showLoomiModal('xl-modal')">XL</loomi-button>
<loomi-modal size="xl" title="XL Modal" name="xl-modal">I'm extra large.</loomi-modal>

<loomi-button onclick="showLoomiModal('omg-modal')">Full Width</loomi-button>
<loomi-modal size="omg" title="Full Width Modal" name="omg-modal">I'm full width.</loomi-modal>
```

## Backdrop Blur Intensity

```html
<loomi-button onclick="showLoomiModal('no-blur')">No Blur</loomi-button>
<loomi-modal blur-size="none" title="See Through Me" name="no-blur">
  The backdrop behind this modal isn't blurred at all.
</loomi-modal>

<loomi-button onclick="showLoomiModal('small-blur')">Small Blur</loomi-button>
<loomi-modal blur-size="small" title="Small Blur" name="small-blur">A light blur.</loomi-modal>

<loomi-button onclick="showLoomiModal('medium-blur')">Medium Blur</loomi-button>
<loomi-modal blur-size="medium" title="Medium Blur" name="medium-blur">The default blur.</loomi-modal>

<loomi-button onclick="showLoomiModal('large-blur')">Large Blur</loomi-button>
<loomi-modal blur-size="large" title="Large Blur" name="large-blur">A stronger blur.</loomi-modal>

<loomi-button onclick="showLoomiModal('xl-blur')">XL Blur</loomi-button>
<loomi-modal blur-size="xl" title="XL Blur" name="xl-blur">A very soft backdrop.</loomi-modal>

<loomi-button onclick="showLoomiModal('omg-blur')">OMG Blur</loomi-button>
<loomi-modal blur-size="omg" title="OMG Blur" name="omg-blur">The strongest blur preset.</loomi-modal>
```

Available: `none` `small` `medium` `large` `xl` `omg`.

## Action Buttons

By default the footer shows `Cancel` and `Okay`. Customize the labels, or set a label to
an empty string to hide that button entirely. Footer actions render as
`<loomi-button size="small">`.

```html
<!-- custom labels -->
<loomi-button onclick="showLoomiModal('rename')">Custom Labels</loomi-button>
<loomi-modal name="rename" ok-button-label="Rename" cancel-button-label="Not now">
  Rename this file?
</loomi-modal>

<!-- no cancel button -->
<loomi-button onclick="showLoomiModal('no-cancel')">No Cancel Button</loomi-button>
<loomi-modal name="no-cancel" cancel-button-label="">I only have an Okay button.</loomi-modal>

<!-- no buttons at all (e.g. you have your own submit button inside the modal) -->
<loomi-button onclick="showLoomiModal('no-buttons')">No Buttons</loomi-button>
<loomi-modal name="no-buttons" show-action-buttons="false">
  Only the backdrop or Escape can close me now.
</loomi-modal>
```

### Reacting to Action Buttons

Loomi modals fire real DOM events — listen for `ok`/`cancel` on the modal element:

```html
<loomi-button onclick="showLoomiModal('confirm-delete')">Delete User</loomi-button>
<loomi-modal name="confirm-delete" type="warning" title="Delete user?"
  ok-button-label="Yes, delete" cancel-button-label="Keep it" close-after-action="false">
  This action cannot be undone.
</loomi-modal>

<script type="module">
  const modal = document.querySelector('loomi-modal[name="confirm-delete"]');
  modal.addEventListener("ok", () => {
    deleteUser().then(() => modal.hide());
  });
  modal.addEventListener("cancel", () => console.log("kept the user"));
</script>
```

`close-after-action="false"` keeps the modal open after a button click — useful when the
action is asynchronous and you want to close it yourself once it resolves (as above).

### Alignment & Stretching

```html
<loomi-button onclick="showLoomiModal('left-aligned')">Left Aligned</loomi-button>
<loomi-modal name="left-aligned" align-buttons="left" title="Left Aligned">…</loomi-modal>

<loomi-button onclick="showLoomiModal('stretched')">Stretched Buttons</loomi-button>
<loomi-modal name="stretched" stretch-action-buttons title="Stretched">
  Each button gets its own full-width row.
</loomi-modal>
```

## Non-Dismissible Modal

Set `backdrop-can-close="false"` to stop the backdrop and <kbd>Esc</kbd> from closing
it — useful for a "lock screen" or a form that must be explicitly submitted or
cancelled.

```html
<loomi-button onclick="showLoomiModal('lock-screen')">Lock Screen</loomi-button>
<loomi-modal name="lock-screen" backdrop-can-close="false" show-action-buttons="false">
  <p>Enter your password to continue.</p>
  <loomi-input type="password" label="Password"></loomi-input>
  <loomi-button block onclick="hideLoomiModal('lock-screen')">Unlock</loomi-button>
</loomi-modal>
```

## Focus Handling

Opening a modal moves focus into it (the close icon if shown, otherwise the first
focusable element, otherwise the dialog itself) and traps <kbd>Tab</kbd> inside it while
open. Closing it restores focus to whatever was focused before — all automatic, no setup
needed.

## Accessibility

loomi-modal is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

## Responsive behavior

loomi-modal is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.

## Dark mode

loomi-modal uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

## Attributes

| Attribute                | Default     | Description                                                      |
| ------------------------ | ----------- | ---------------------------------------------------------------- |
| `name`                   | _(blank)_   | Unique name for `showLoomiModal()` / `hideLoomiModal()`.         |
| `title`                  | _(blank)_   | Modal heading.                                                   |
| `type`                   | _(blank)_   | `info` \| `error` \| `warning` \| `success` (sets icon + color). |
| `icon`                   | _(blank)_   | Custom icon name (overrides the type icon).                      |
| `icon-source`            | `heroicons` | Icon set for `icon` — `heroicons` \| `iconsax` \| `untitledui`.  |
| `size`                   | `medium`    | `tiny` \| `small` \| `medium` \| `large` \| `xl` \| `omg`        |
| `open`                   | `false`     | Open state (reflected). _(boolean)_                              |
| `ok-button-label`        | `Okay`      | Primary button text (blank hides it).                            |
| `cancel-button-label`    | `Cancel`    | Secondary button text (blank hides it).                          |
| `show-action-buttons`    | `true`      | Show the footer buttons. _(boolean)_                             |
| `show-close-icon`        | `false`     | Show the top-right close icon. _(boolean)_                       |
| `backdrop-can-close`     | `true`      | Backdrop click / Escape closes. _(boolean)_                      |
| `close-after-action`     | `true`      | Close after an action button is clicked. _(boolean)_             |
| `prevent-scroll`         | `true`      | Prevent document scrolling while open. _(boolean)_               |
| `blur-size`              | `medium`    | `none` \| `small` \| `medium` \| `large` \| `xl` \| `omg`        |
| `align-buttons`          | `right`     | `left` \| `center` \| `right`                                    |
| `stretch-action-buttons` | `false`     | Full-width stacked buttons. _(boolean)_                          |

Boolean attributes can be omitted, present, or set to `"false"` in HTML, for example
`backdrop-can-close="false"` or `show-close-icon`.

**Methods:** `show()`, `hide()`. **Helpers:** `showLoomiModal(name)`, `hideLoomiModal(name)`.
**Events:** `ok`, `cancel`, `close`, `open`. **Slot:** default (body).

## Full Example

```html
<loomi-button onclick="showLoomiModal('full-modal')">Open Full Example</loomi-button>
<loomi-modal
  type="warning"
  title="Confirm deletion"
  name="full-modal"
  ok-button-label="Yes, delete"
  cancel-button-label="Keep it"
  close-after-action="false"
  backdrop-can-close="false"
  show-close-icon="true"
  blur-size="large"
  size="medium"
>
  Are you sure you want to delete this user? This action cannot be undone.
</loomi-modal>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-modal>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/modal` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/modal lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/modal build
pnpm --filter @loomidev/modal typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/modal"></script>

<loomi-modal name="confirm-delete" title="Delete customer?" type="warning">
  This action cannot be undone.
</loomi-modal>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/modal";
```

</loomi-tab>
<loomi-tab label="Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/modal lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/modal";
```

```blade
<loomi-modal name="confirm-delete" title="Delete customer?" type="warning">
  This action cannot be undone.
</loomi-modal>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/modal";

export function LoomiExample() {
  return (
    <loomi-modal name="confirm-delete" title="Delete customer?" type="warning">
      This action cannot be undone.
    </loomi-modal>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/modal";
</script>

<template>
  <loomi-modal name="confirm-delete" title="Delete customer?" type="warning">
    This action cannot be undone.
  </loomi-modal>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/modal";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-modal name="confirm-delete" title="Delete customer?" type="warning">
      This action cannot be undone.
    </loomi-modal>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte / Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/modal";
</script>

<loomi-modal name="confirm-delete" title="Delete customer?" type="warning">
  This action cannot be undone.
</loomi-modal>
```

```astro
---
import "@loomidev/modal";
---

<loomi-modal name="confirm-delete" title="Delete customer?" type="warning">
  This action cannot be undone.
</loomi-modal>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/button`
- `@loomidev/core`
- `@loomidev/icon`
