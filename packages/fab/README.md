# @loomidev/fab

`<loomi-fab>` — a floating action button. On its own it's a single circular action
button; add `<loomi-fab-item>` children and it becomes a speed-dial menu.

```bash
npm install @loomidev/fab lit
```

```js
import "@loomidev/fab";
```

## Single Action Button

With no children, `<loomi-fab>` is just a floating button. It fires a normal `click`
event — wire it up like any button.

```html
<loomi-fab icon="plus" onclick="router.push('/patients/create')"></loomi-fab>
```

## Speed-Dial Menu

Add `<loomi-fab-item>` children and the trigger becomes a menu toggle. Listen for
`loomi-select` on the `<loomi-fab>` to route each choice.

```html
<loomi-fab placement="bottom-right" icon="plus">
  <loomi-fab-item icon="user-plus" label="Add Patient" value="patient"></loomi-fab-item>
  <loomi-fab-item icon="calendar" label="Book Appointment" value="appointment"></loomi-fab-item>
  <loomi-fab-item icon="document-plus" label="Create Report" value="report"></loomi-fab-item>
</loomi-fab>

<script type="module">
  document.querySelector("loomi-fab").addEventListener("loomi-select", (event) => {
    const { value } = event.detail;
    if (value === "patient") router.push("/patients/create");
    if (value === "appointment") router.push("/appointments/create");
    if (value === "report") router.push("/reports/create");
  });
</script>
```

The trigger's icon rotates 45° when the menu opens — a plain "plus" glyph reads as a
close (×) button without needing a second icon.

## Placement

`placement` picks a viewport corner in the default `variant="floating"` and, in
`variant="docked"`, which edge the menu aligns its items to.

```html
<loomi-fab placement="bottom-right">
  <loomi-fab-item icon="user-plus" label="Add Patient" value="patient"></loomi-fab-item>
  <loomi-fab-item icon="calendar" label="Book Appointment" value="appointment"></loomi-fab-item>
</loomi-fab>
<loomi-fab placement="bottom-left">
  <loomi-fab-item icon="user-plus" label="Add Patient" value="patient"></loomi-fab-item>
  <loomi-fab-item icon="calendar" label="Book Appointment" value="appointment"></loomi-fab-item>
</loomi-fab>
<loomi-fab placement="top-right">
  <loomi-fab-item icon="user-plus" label="Add Patient" value="patient"></loomi-fab-item>
  <loomi-fab-item icon="calendar" label="Book Appointment" value="appointment"></loomi-fab-item>
</loomi-fab>
<loomi-fab placement="top-left">
  <loomi-fab-item icon="user-plus" label="Add Patient" value="patient"></loomi-fab-item>
  <loomi-fab-item icon="calendar" label="Book Appointment" value="appointment"></loomi-fab-item>
</loomi-fab>
```

## Direction

`direction` controls which way the menu expands. Left blank (the default), it's inferred
from `placement` — `bottom-*` expands `up`, `top-*` expands `down` — so items always grow
into free space instead of off-screen.

```html
<loomi-fab placement="bottom-right" direction="up">
  <loomi-fab-item icon="user-plus" label="Add Patient" value="patient"></loomi-fab-item>
  <loomi-fab-item icon="calendar" label="Book Appointment" value="appointment"></loomi-fab-item>
</loomi-fab>
<loomi-fab placement="bottom-left" direction="down">
  <loomi-fab-item icon="user-plus" label="Add Patient" value="patient"></loomi-fab-item>
  <loomi-fab-item icon="calendar" label="Book Appointment" value="appointment"></loomi-fab-item>
</loomi-fab>
<loomi-fab placement="top-right" direction="left">
  <loomi-fab-item icon="user-plus" label="Add Patient" value="patient"></loomi-fab-item>
  <loomi-fab-item icon="calendar" label="Book Appointment" value="appointment"></loomi-fab-item>
</loomi-fab>
<loomi-fab placement="top-left" direction="right">
  <loomi-fab-item icon="user-plus" label="Add Patient" value="patient"></loomi-fab-item>
  <loomi-fab-item icon="calendar" label="Book Appointment" value="appointment"></loomi-fab-item>
</loomi-fab>
```

## Trigger

`trigger="click"` (default) toggles the menu on click. `trigger="hover"` opens it on
mouseenter/focus, closing shortly after the pointer or focus leaves — clicking still
works too, so touch and keyboard users aren't left without a way in.

```html
<loomi-fab trigger="hover">
  <loomi-fab-item icon="user-plus" label="Add Patient" value="patient"></loomi-fab-item>
  <loomi-fab-item icon="calendar" label="Book Appointment" value="appointment"></loomi-fab-item>
</loomi-fab>
```

## Variant

`variant="floating"` (default) anchors the button to a viewport corner via
`position: fixed`, matching `<loomi-bottom-nav>`. Like any `position: fixed` element, an
ancestor with its own `transform`/`filter`/`contain` establishes a new containing block
and confines it to that ancestor instead of the real viewport — usually not what you
want on a live page, but handy for demoing several placements in one scrollable frame
(see `<loomi-bottom-nav>`'s example page for the technique). `variant="docked"` renders
in normal document flow — drop it into a toolbar, card footer, or bottom bar and it
stays exactly where you put it.

```html
<div class="my-toolbar">
  <loomi-fab variant="docked" placement="bottom-right">
    <loomi-fab-item icon="user-plus" label="Add Patient" value="patient"></loomi-fab-item>
    <loomi-fab-item icon="calendar" label="Book Appointment" value="appointment"></loomi-fab-item>
  </loomi-fab>
</div>
```

## Sizes

```html
<loomi-fab size="small" placement="bottom-right">
  <loomi-fab-item icon="user-plus" label="Add Patient" value="patient"></loomi-fab-item>
</loomi-fab>
<loomi-fab size="medium" placement="bottom-left">
  <loomi-fab-item icon="user-plus" label="Add Patient" value="patient"></loomi-fab-item>
</loomi-fab>
<loomi-fab size="regular" placement="top-right">
  <loomi-fab-item icon="user-plus" label="Add Patient" value="patient"></loomi-fab-item>
</loomi-fab>
<!-- regular is the default -->
```

## Backdrop & Closing

- `backdrop` (default `false`) — dims the rest of the page while the menu is open;
  clicking it closes the menu.
- `close-on-select` (default `true`) — closes the menu after a `loomi-fab-item` is
  selected. Set it to `false` for menus where picking one action shouldn't dismiss the
  others.
- Clicking outside the button and menu, or pressing <kbd>Esc</kbd> while focus is inside,
  always closes it.

```html
<loomi-fab backdrop close-on-select="false">
  <loomi-fab-item icon="user-plus" label="Add Patient" value="patient"></loomi-fab-item>
  <loomi-fab-item icon="calendar" label="Book Appointment" value="appointment"></loomi-fab-item>
</loomi-fab>
```

## Color

`color` accents the trigger's fill and softly tints each item's icon circle —
`primary` (default), `secondary`, `info`, `success`, `error`, `warning`, or `gray`.

```html
<loomi-fab color="success" icon="check">
  <loomi-fab-item icon="user-plus" label="Add Patient" value="patient"></loomi-fab-item>
</loomi-fab>
```

## Icons

Icons render through `<loomi-icon>` — the same registry and `source` attribute
(`heroicons` default, `iconsax`, `untitledui`) used by `<loomi-bottom-nav>`. Set
`icon-source` on `<loomi-fab>` to change the set for every icon at once, or on a single
`<loomi-fab-item>` to override just that one.

```html
<loomi-fab icon="add" icon-source="iconsax">
  <loomi-fab-item icon="user" label="Profile" value="profile"></loomi-fab-item>
  <loomi-fab-item icon="calendar" icon-source="heroicons" label="Book" value="book"></loomi-fab-item>
</loomi-fab>
```

## Icons Only

Set `icons-only` on `<loomi-fab>` to hide every item's visible label, showing only the
icon circle. Each `label` still reaches assistive tech (as the button's `aria-label`) and
sighted users (as a `<loomi-tooltip>` that appears on hover/focus) — it just isn't
rendered as inline text. The tooltip's side is inferred the same way the label's position
inside the pill normally is: away from the nearest screen edge (e.g. to the left for a
`bottom-right`-placed FAB).

```html
<loomi-fab icons-only>
  <loomi-fab-item icon="user-plus" label="Add Patient" value="patient"></loomi-fab-item>
  <loomi-fab-item icon="calendar" label="Book Appointment" value="appointment"></loomi-fab-item>
</loomi-fab>
```

## Styling

Every visual is a CSS custom property on `:host`, so re-theming needs no rebuild:

| Property                                  | Default                                                                                                                                                                    |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--loomi-fab-offset`                      | `1.5rem` — distance from the viewport edge (`variant="floating"`)                                                                                                          |
| `--loomi-fab-gap`                         | `0.875rem` — space between items                                                                                                                                           |
| `--loomi-fab-trigger-gap`                 | `calc(var(--loomi-fab-gap) + 0.375rem)` — space between the trigger and the menu (a bit more than `--loomi-fab-gap`, since the trigger's bigger and more heavily shadowed) |
| `--loomi-fab-z-index`                     | `1000`                                                                                                                                                                     |
| `--loomi-fab-diameter`                    | `2.75rem` / `3.25rem` / `3.75rem` per `size`                                                                                                                               |
| `--loomi-fab-icon-size`                   | `1.125rem` / `1.25rem` / `1.5rem` per `size`                                                                                                                               |
| `--loomi-fab-item-diameter`               | `2rem` / `2.25rem` / `2.5rem` per `size`                                                                                                                                   |
| `--loomi-fab-item-icon-size`              | `0.9rem` / `1rem` / `1.125rem` per `size`                                                                                                                                  |
| `--loomi-fab-bg` / `--loomi-fab-bg-hover` | derived from `color`                                                                                                                                                       |
| `--loomi-fab-fg`                          | `var(--loomi-text-on-primary)`                                                                                                                                             |
| `--loomi-fab-shadow`                      | a soft drop shadow                                                                                                                                                         |
| `--loomi-fab-backdrop`                    | `rgba(15, 23, 42, 0.45)` — matches `<loomi-modal>`'s backdrop tint                                                                                                         |
| `--loomi-fab-backdrop-blur`               | `blur(5px)` — matches `<loomi-modal>`'s default `blur-size="medium"`                                                                                                       |

```css
loomi-fab {
  --loomi-fab-offset: 2rem;
  --loomi-fab-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
}
```

## Accessibility

- The trigger is a real `<button>`; when it has items it carries `aria-haspopup="menu"`
  and `aria-expanded`. Give it a custom label with `label` — otherwise it falls back to a
  localized "Actions".
- Each `<loomi-fab-item>` is a real `<button role="menuitem">`; `disabled` removes
  it from click and keyboard navigation.
- With the menu open: the arrow key pointing away from the trigger (matching
  `direction` — e.g. <kbd>↑</kbd> for `up`) moves focus outward through items, the
  opposite arrow moves back and returns focus to the trigger past the first item,
  <kbd>Home</kbd>/<kbd>End</kbd> jump to the first/last item, and <kbd>Esc</kbd> closes
  the menu and refocuses the trigger.
- Supports keyboard focus with visible `:focus-visible` styling on the trigger and every
  item.

For the library-wide baseline, see [Foundations — Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

The trigger is a fixed-diameter circle and the menu sizes to its content — both work
unmodified from small phone screens to desktop. `variant="floating"` keeps a
`--loomi-fab-offset` margin from the viewport edge on any screen size; `variant="docked"`
just follows its parent's own responsive layout.

For the shared container and viewport rules, see [Foundations — Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

Item pills and their icon circles use `--loomi-surface`, `--loomi-surface-border`, and
`--loomi-text-secondary`; the trigger and item-icon accent flow through the same
`--loomi-<color>-*` tokens as every other component. Respects `.dark` on `<html>` via
`@loomidev/theme-switcher` or your app theme.

For theme activation, token overrides, and contrast guidance, see [Foundations — Dark mode](https://loomiui.com/foundations/#dark-mode).

## Attributes — `<loomi-fab>`

| Attribute         | Default        | Description                                                                                         |
| ----------------- | -------------- | --------------------------------------------------------------------------------------------------- |
| `placement`       | `bottom-right` | `bottom-right` \| `bottom-left` \| `top-right` \| `top-left`                                        |
| `direction`       | _(blank)_      | `up` \| `down` \| `left` \| `right`. Blank = infer from `placement`.                                |
| `trigger`         | `click`        | `click` \| `hover`                                                                                  |
| `variant`         | `floating`     | `floating` \| `docked`                                                                              |
| `size`            | `regular`      | `small` \| `medium` \| `regular`                                                                    |
| `color`           | `primary`      | `primary` \| `secondary` \| `info` \| `success` \| `error` \| `warning` \| `gray`                   |
| `icon`            | `plus`         | Trigger icon name.                                                                                  |
| `icon-source`     | `heroicons`    | `heroicons` \| `iconsax` \| `untitledui`                                                            |
| `icons-only`      | `false`        | Hide every item's visible label; show it as a `<loomi-tooltip>` on hover/focus instead. _(boolean)_ |
| `label`           | _(blank)_      | Accessible label for the trigger and menu.                                                          |
| `open`            | `false`        | Menu open state (reflected). _(boolean)_                                                            |
| `disabled`        | `false`        | Disable the trigger entirely. _(boolean)_                                                           |
| `close-on-select` | `true`         | Close the menu after an item is selected. _(boolean)_                                               |
| `backdrop`        | `false`        | Dim the page while the menu is open. _(boolean)_                                                    |
| `locale`          | _(blank)_      | Locale override for the built-in aria label.                                                        |

Boolean attributes can be omitted, present, or set to `"false"` in HTML.

**Methods:** `show()`, `hide()`, `toggle()` (all void; no-ops when there are no items).
**Events:** `open`, `close`.
**Slot:** default (`<loomi-fab-item>` children).

## Attributes — `<loomi-fab-item>`

| Attribute     | Default   | Description                                                |
| ------------- | --------- | ---------------------------------------------------------- |
| `icon`        | _(blank)_ | Icon name.                                                 |
| `icon-source` | _(blank)_ | Overrides the parent's `icon-source` for just this item.   |
| `label`       | _(blank)_ | Visible text next to the icon.                             |
| `value`       | _(blank)_ | Reported on `event.detail.value` when selected.            |
| `disabled`    | `false`   | Excludes the item from click and keyboard nav. _(boolean)_ |

**Fires:** `loomi-select` — `detail: { value, label }`, bubbles/composed (also reaches a
listener on the parent `<loomi-fab>`).

## Full Example

```html
<loomi-fab
  placement="bottom-right"
  direction="up"
  trigger="click"
  size="regular"
  color="primary"
  icon="plus"
  close-on-select
  backdrop
>
  <loomi-fab-item icon="user-plus" label="Add Patient" value="patient"></loomi-fab-item>
  <loomi-fab-item icon="calendar" label="Book Appointment" value="appointment"></loomi-fab-item>
  <loomi-fab-item icon="document-plus" label="Create Report" value="report"></loomi-fab-item>
</loomi-fab>

<script type="module">
  document.querySelector("loomi-fab").addEventListener("loomi-select", (event) => {
    console.log("selected:", event.detail.value);
  });
</script>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-fab>` is a standard custom element, so the browser can use it in plain HTML,
Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important
beginner rule is: install the package, import it once before the tag is rendered, then
write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the
folder that contains that app's `package.json`. Do not run these install commands from
`packages/fab` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/fab lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components`
folder. That is where the main `package.json` for all packages lives, and
`pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/fab build
pnpm --filter @loomidev/fab typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The
import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/fab"></script>

<loomi-fab icon="plus">
  <loomi-fab-item label="Add Patient" value="patient"></loomi-fab-item>
</loomi-fab>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and
import it once in your main app JavaScript file. After that, you can use the Loomi tag
anywhere in your app.

```js
import "@loomidev/fab";
```

</loomi-tab>
<loomi-tab label="Blade">

Run the install command from your Laravel project root, then import the component in
`resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and
`npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/fab lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/fab";
```

```blade
<loomi-fab icon="plus">
  <loomi-fab-item label="Add Patient" value="patient"></loomi-fab-item>
</loomi-fab>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass
arrays, objects, or functions, use a ref and assign those values after the component
mounts.

```jsx
import "@loomidev/fab";

export function LoomiExample() {
  return (
    <loomi-fab icon="plus" onloomi-select={(e) => console.log(e.detail.value)}>
      <loomi-fab-item label="Add Patient" value="patient"></loomi-fab-item>
    </loomi-fab>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type
declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue
templates can use Loomi tags directly. For arrays, objects, or functions, pass the value
as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/fab";
</script>

<template>
  <loomi-fab icon="plus">
    <loomi-fab-item label="Add Patient" value="patient"></loomi-fab-item>
  </loomi-fab>
</template>
```

If Vue warns that the tag is an unknown component, configure
`compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue
config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with
`CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the
standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/fab";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-fab icon="plus">
      <loomi-fab-item label="Add Patient" value="patient"></loomi-fab-item>
    </loomi-fab>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte / Astro">

Svelte can import the package inside a component script. Astro can import it in the
frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/fab";
</script>

<loomi-fab icon="plus">
  <loomi-fab-item label="Add Patient" value="patient"></loomi-fab-item>
</loomi-fab>
```

```astro
---
import "@loomidev/fab";
---

<loomi-fab icon="plus">
  <loomi-fab-item label="Add Patient" value="patient"></loomi-fab-item>
</loomi-fab>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the
server before browser-only code runs. If your framework complains, move the Loomi import
to client-side code. In Next.js, that usually means a component with `"use client"`; in
Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
- `@loomidev/icon`
- `@loomidev/tooltip`
