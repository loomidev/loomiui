# @loomidev/input

`<loomi-input>` — a themeable text input with a floating label, text/icon prefixes &
suffixes, contextual hints, selectable affixes, a clearable field, numeric filtering and inline validation.
It is **form-associated**: its value submits with the surrounding `<form>` under `name`.

## Installation

```bash
npm install @loomidev/input lit
```

```js
import "@loomidev/input"; // registers <loomi-input>
```

## Basic Usage

```html
<loomi-input label="Full name"></loomi-input>
<loomi-input placeholder="Full name"></loomi-input>
<loomi-input type="email" label="Email"></loomi-input>
```

## Passwords

```html
<loomi-password label="Password" strength="Aa1#"></loomi-password>
```

Use [`@loomidev/password`](../password) for password reveal and strength requirements.
`<loomi-input type="password">` remains a native password input, but password-specific
features live in `<loomi-password>`.

## Numeric

```html
<loomi-input numeric label="Phone"></loomi-input>
<loomi-input numeric with-dots label="Amount"></loomi-input>
<loomi-input numeric min="3" max="12" label="Days off"></loomi-input>
```

## Masking

Masks follow Alpine's `x-mask` wildcard syntax: `9` accepts digits, `a` accepts letters,
and `*` accepts any character. Literal characters in the mask are inserted as the user
types.

```html
<loomi-input mask="99/99/9999" placeholder="MM/DD/YYYY"></loomi-input>
<loomi-input mask="(999) 999-9999" label="Phone"></loomi-input>
```

Use the built-in dynamic credit card mask to switch between standard card grouping and
Amex grouping (`34`/`37` prefixes).

```html
<loomi-input dynamic-mask="creditcard" label="Card number"></loomi-input>
```

`mask="creditcard"` is also accepted as a shortcut.

For a complete payment-card field with brand detection, expiry, CVC, and validation,
use [`<loomi-creditcard>`](../creditcard) instead of wiring several masked inputs by
hand.

For custom dynamic masks, assign a function to the `dynamicMask` property in JavaScript.
The function receives the current input value before the next mask is applied and must
return a mask string using the same `9` / `a` / `*` syntax.

```html
<loomi-input id="product-code" label="Product code"></loomi-input>
```

```js
const input = document.querySelector("#product-code");

input.dynamicMask = (value) => {
  return value.startsWith("P") ? "a-999" : "999-999";
};
```

Custom dynamic masks are property-only because HTML attributes can only pass strings.
Use `dynamic-mask="creditcard"` for named built-ins and `el.dynamicMask = fn` for your
own switching logic.

## Prefixes, Suffixes & Icons

Use text or a built-in [icon](../icons) (set `prefix-icon` / `suffix-icon`). Set
`transparent-prefix="false"` / `transparent-suffix="false"` for a solid affix.

```html
<loomi-input prefix="https://" placeholder="website"></loomi-input>
<loomi-input prefix="USD" transparent-prefix="false" placeholder="0.00" numeric></loomi-input>
<loomi-input suffix=".loomiui.dev" transparent-suffix="false" placeholder="workspace"></loomi-input>
<loomi-input prefix-icon="envelope" placeholder="me@loomiui.dev"></loomi-input>
<loomi-input prefix-icon="key" type="password" viewable placeholder="Password"></loomi-input>
```

Need full control? Use the `prefix` / `suffix` slots.

### Dropdown affixes

Use `prefix-options` or `suffix-options` for selectable affixes. Values can be comma
separated, pipe separated, or a JSON array.

```html
<loomi-input prefix-options="http://,https://,ftp://" prefix-value="https://" placeholder="example.com"></loomi-input>
<loomi-input suffix-options="kg,g,tons" suffix-value="kg" placeholder="0" numeric></loomi-input>
```

The selected values are exposed as `.prefixValue` / `.suffixValue`. Changing a dropdown
also emits `loomi-prefix-change` or `loomi-suffix-change` with `{ value }`.

## Hints

Set `hint` to show a help icon in the suffix. Clicking it opens a `loomi-popover`.
When the hint points to a named DOM hint like `career.html`, the input looks for
`[data-hint="career"]` and renders that element's HTML inside the popover.

```html
<loomi-input label="Career path" hint="career.html"></loomi-input>

<div data-hint="career" hidden>
  Add the role family this person is growing toward.
</div>
```

## Clearable

```html
<loomi-input clearable placeholder="I am clearable"></loomi-input>
```

## Sizes

`small` · `regular` · `medium` (default) · `big`.

```html
<loomi-input size="small" label="Small"></loomi-input>
<loomi-input size="big" label="Big"></loomi-input>
```

`size` is the per-instance preset. To shift the density of every control at once, set the
`--loomi-density` token at `:root` — an unitless multiplier (default `1`) that scales control
height and horizontal padding together (font size is unchanged), composing with `size`
rather than replacing it:

```css
:root {
  --loomi-density: 0.85; /* compact */
}
```

## Validation

A `required` field shows a red border as soon as it's invalid, whether or not
`error-message` is set — the border doesn't depend on having a message to show.
`error-message` controls what (if anything) is displayed _in addition to_ that border:

```html
<loomi-input required label="Full name" error-message="Your name is required" show-error-inline></loomi-input>
```

```js
const input = document.querySelector("loomi-input");
const ok = input.validate();
```

`validate()` runs the required-field check immediately, independent of `blur` (a `blur`
on the field already triggers the same check automatically — call `validate()` yourself
before a manual submit or API call). It:

- Returns `true` if the field passes (or isn't `required`), `false` otherwise.
- Sets the reflected `invalid` attribute to match, which is what actually drives the red
  border in CSS — this happens regardless of `error-message`.
- When the field just became invalid, shows `error-message` (if set): inline below the
  field when `show-error-inline` is set, otherwise as a `loomi-notification` toast (see
  [`@loomidev/notification`](../notification)) so the message isn't silently dropped.

```html
<loomi-input required label="Full name" error-message="Your name is required"></loomi-input>
<!-- show-error-inline omitted (false): a failed validate()/blur shows this message as a
     toast instead of inline text, but the red border still appears either way -->
```

## Field appearance

Use `variant="minimal"` for a bottom-border-only input:

```html
<loomi-input label="Email" type="email" variant="minimal"></loomi-input>
```

Use `label-position="inside"` to keep a compact label inside the top of the input,
with the entered text displayed beneath it:

```html
<loomi-input label="Email" type="email" label-position="inside" required></loomi-input>
```

## Accessibility

For the library-wide baseline, see [Foundations — Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

For the shared container and viewport rules, see [Foundations — Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

For theme activation, token overrides, and contrast guidance, see [Foundations — Dark mode](https://loomiui.com/foundations/#dark-mode).

## Attributes

| Attribute                 | Default   | Description                                                                                                                               |
| ------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                    | _(blank)_ | Submitted with the form.                                                                                                                  |
| `type`                    | `text`    | `text` \| `email` \| `password` \| `search` \| `tel` \| `url`                                                                             |
| `label`                   | _(blank)_ | Floating label (sits in the placeholder spot, floats on focus/fill).                                                                      |
| `label-position`          | `default` | `default` keeps the floating label; `inside` keeps a compact label inside the top of the field.                                           |
| `placeholder`             | _(blank)_ | Placeholder text.                                                                                                                         |
| `value`                   | _(blank)_ | Current value (also a property).                                                                                                          |
| `required`                | `false`   | Marks the field required (red asterisk on the label). _(boolean)_                                                                         |
| `disabled`                | `false`   | Disable the field. _(boolean)_                                                                                                            |
| `readonly`                | `false`   | Read-only field. _(boolean)_                                                                                                              |
| `numeric`                 | `false`   | Allow digits only. _(boolean)_                                                                                                            |
| `with-dots`               | `true`    | Allow one decimal point when `numeric`. _(boolean)_                                                                                       |
| `mask`                    | _(blank)_ | Alpine-style mask using `9`, `a`, and `*` wildcards, or `creditcard`.                                                                     |
| `dynamic-mask`            | _(blank)_ | Built-in dynamic mask attribute. Currently supports `creditcard`.                                                                         |
| `min`                     | _(blank)_ | Clamp numeric values below this on change.                                                                                                |
| `max`                     | _(blank)_ | Clamp numeric values above this on change.                                                                                                |
| `size`                    | `medium`  | `small` \| `regular` \| `medium` \| `big`                                                                                                 |
| `variant`                 | `default` | `default` \| `minimal` (bottom border only, no box)                                                                                       |
| `prefix`                  | _(blank)_ | Leading text affix.                                                                                                                       |
| `suffix`                  | _(blank)_ | Trailing text affix.                                                                                                                      |
| `prefix-options`          | _(blank)_ | Comma, pipe, or JSON array of dropdown options for the leading affix.                                                                     |
| `suffix-options`          | _(blank)_ | Comma, pipe, or JSON array of dropdown options for the trailing affix.                                                                    |
| `prefix-value`            | _(blank)_ | Selected leading dropdown affix value.                                                                                                    |
| `suffix-value`            | _(blank)_ | Selected trailing dropdown affix value.                                                                                                   |
| `prefix-icon`             | _(blank)_ | Leading icon-name affix (see `@loomidev/icons`).                                                                                          |
| `suffix-icon`             | _(blank)_ | Trailing icon-name affix (see `@loomidev/icons`).                                                                                         |
| `transparent-prefix`      | `true`    | Transparent (vs solid) leading affix. _(boolean)_                                                                                         |
| `transparent-suffix`      | `true`    | Transparent (vs solid) trailing affix. _(boolean)_                                                                                        |
| `viewable`                | `false`   | Deprecated on `<loomi-input>`; use `<loomi-password>` for reveal. _(boolean)_                                                             |
| `clearable`               | `false`   | Show a clear (✕) button when the field has a value. _(boolean)_                                                                           |
| `hint`                    | _(blank)_ | Show a suffix help icon and render a `loomi-popover`; `career.html` resolves `[data-hint="career"]`.                                      |
| `error-message`           | _(blank)_ | Message shown when validation fails. The red invalid border shows either way, even if this is left blank.                                 |
| `show-error-inline`       | `false`   | Render `error-message` beneath the field. When `false`, a failed validation shows it as a `loomi-notification` toast instead. _(boolean)_ |
| `show-placeholder-always` | `false`   | Keep the placeholder visible even with a label. _(boolean)_                                                                               |
| `no-clearing`             | `false`   | Remove the default bottom margin. _(boolean, attribute on host)_                                                                          |

### Methods

| Member                | Description                                                                                                                                     |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `.value`              | Get/set the current value.                                                                                                                      |
| `.dynamicMask`        | Set a custom dynamic mask function, or a named built-in such as `"creditcard"`.                                                                 |
| `focus()` / `clear()` | Focus or clear the field.                                                                                                                       |
| `validate()`          | Run the required check now (independent of `blur`); sets `invalid` and surfaces `error-message` inline or via toast. Returns `true` when valid. |

### Parts

| Part    | Description             |
| ------- | ----------------------- |
| `field` | The bordered container. |
| `input` | The native `<input>`.   |

## Slots

| Slot     | Description                                      |
| -------- | ------------------------------------------------ |
| `prefix` | Content rendered before the main value or label. |
| `suffix` | Content rendered after the main value or label.  |

## Events

| Event                 | Description                                   |
| --------------------- | --------------------------------------------- |
| `change`              | Fired when the value is committed or changed. |
| `input`               | Fired while the value is edited.              |
| `loomi-prefix-change` | Fired when the prefix changes.                |
| `loomi-suffix-change` | Fired when the suffix changes.                |

## Theming

Inputs use the primary palette for focus and the gray palette for borders. Override from
your page — see the [root README](../../README.md#theming-the-edit-tailwindconfigjs-replacement).

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-input>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/input` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/input lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/input build
pnpm --filter @loomidev/input typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/input"></script>

<loomi-input name="email" type="email" label="Email address" required></loomi-input>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/input";
```

Because this is a form-capable component, give it a `name` when it should submit with a native `<form>`. Read its value with `new FormData(form).get("the-name")` just like you would for a built-in input.

</loomi-tab>
<loomi-tab label="Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/input lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/input";
```

```blade
<loomi-input name="email" type="email" label="Email address" required></loomi-input>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/input";

export function LoomiExample() {
  return (
    <loomi-input name="email" type="email" label="Email address" required></loomi-input>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/input";
</script>

<template>
  <loomi-input name="email" type="email" label="Email address" required></loomi-input>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/input";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-input name="email" type="email" label="Email address" required></loomi-input>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte / Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/input";
</script>

<loomi-input name="email" type="email" label="Email address" required></loomi-input>
```

```astro
---
import "@loomidev/input";
---

<loomi-input name="email" type="email" label="Email address" required></loomi-input>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
- `@loomidev/icons`
- `@loomidev/notification`
- `@loomidev/popover`
- `@loomidev/theme`
