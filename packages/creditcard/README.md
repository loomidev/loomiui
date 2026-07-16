# @loomidev/creditcard

`<loomi-creditcard>` — a flippable credit-card input. The front face holds the card
number, cardholder name, and expiry; an edge button flips the card to its back to enter
the CVC. The network logo (Visa, Mastercard, American Express, Discover, Diners Club,
JCB, UnionPay, Maestro) is detected live from the number's prefix, and a
contactless-payment glyph sits in the front's top-right corner.

```bash
npm install @loomidev/creditcard lit
```

```js
import "@loomidev/creditcard";
```

## Basic Usage

```html
<loomi-creditcard cardholder-name="Ama Osei"></loomi-creditcard>
```

Typing a number auto-detects and shows the matching network logo, auto-groups the digits
(`4-6-5` for Amex, `4-4-4-4` for most others), and caps the length to that network's real
card-number length.

## Flipping to the CVC

Click the small round button on the card's right edge to flip to the back and focus the
CVC field (Amex shows 4 digits, every other network shows 3). The same button flips back;
`Escape` while flipped does too.

```html
<loomi-creditcard flipped></loomi-creditcard>
```

```js
document.querySelector("loomi-creditcard").addEventListener("flip", (e) => {
  console.log(e.detail.flipped);
});
```

## Reading the value

Not form-associated by design — card data is sensitive and is typically handed to a
payment provider's tokenization SDK rather than posted through a plain HTML form. Read
the structured value from the `value` getter, or listen for `input`/`change`:

```js
const el = document.querySelector("loomi-creditcard");
el.addEventListener("change", (e) => {
  const { number, numberDigits, cardholderName, expiryMonth, expiryYear, cvc, brand } = e.detail;
  // hand off to your payment SDK
});
console.log(el.value); // same shape, read on demand
```

## Pre-filling fields

`number`, `cardholder-name`, `expiry-month`, `expiry-year`, and `cvc` are all plain
attributes/properties. `number` accepts either raw digits or a masked saved-card value
such as `**** **** **** 4242`:

```html
<loomi-creditcard
  cardholder-name="Ama Osei"
  number="4242424242424242"
  expiry-month="07"
  expiry-year="28"
></loomi-creditcard>
```

## Forcing a network logo

Leave `brand` unset to auto-detect from `number`. Set it explicitly to override (e.g. a
saved card where you already know the network but don't want to show the full number):

```html
<loomi-creditcard brand="visa" number="•••• •••• •••• 4242"></loomi-creditcard>
```

## Theming

Like every loomi component, `color` picks the gradient from the shared palette and
recolors instantly from plain page CSS — no rebuild:

```html
<loomi-creditcard color="success"></loomi-creditcard>
```

```css
:root {
  --loomi-success-600: #15803d;
  --loomi-success-700: #166534;
}
```

Set `variant="outline"` for a bare card silhouette instead of the full-color gradient
face — a soft gray border with no background fill, for light or minimal UIs:

```html
<loomi-creditcard variant="outline" cardholder-name="Ama Osei"></loomi-creditcard>
```

## Inline Card Information

Use `variant="inline"` for the compact card-information layout: card number on the
first row, expiry and CVC on the second row, with no cardholder-name field.

```html
<loomi-creditcard variant="inline"></loomi-creditcard>
```

## Validation

`validate()` checks that every field is complete (full-length number for the detected
network, a non-blank name, a non-expired `MM/YY`, and a full-length CVC) when `required`
is set, and returns whether it passed:

```html
<loomi-creditcard
  required
  show-error-inline
  error-message="Complete the card details to continue"
></loomi-creditcard>

<script type="module">
  const el = document.querySelector("loomi-creditcard");
  payButton.addEventListener("click", () => {
    if (!el.validate()) return;
    // proceed
  });
</script>
```

## Accessibility

For the library-wide baseline, see [Foundations — Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

For the shared container and viewport rules, see [Foundations — Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

- Filled card faces keep brand accent gradients with `--loomi-text-on-primary` labels.

For theme activation, token overrides, and contrast guidance, see [Foundations — Dark mode](https://loomiui.com/foundations/#dark-mode).

## Attributes

| Attribute           | Default           | Description                                                                                                                                  |
| ------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`              | _(blank)_         | Targeting class only (see `LoomiElement`) — not a form field, since this component doesn't submit.                                           |
| `cardholder-name`   | _(blank)_         | Name printed on the card.                                                                                                                    |
| `number`            | _(blank)_         | Card number, auto-grouped per network as the user types. Masked saved-card values like `**** **** **** 4242` are preserved for edit screens. |
| `expiry-month`      | _(blank)_         | Two-digit month, `"01"`–`"12"`.                                                                                                              |
| `expiry-year`       | _(blank)_         | Two-digit year.                                                                                                                              |
| `cvc`               | _(blank)_         | Security code (3 digits, 4 for Amex).                                                                                                        |
| `brand`             | _(auto-detected)_ | Force a network logo: `visa`, `mastercard`, `amex`, `discover`, `diners`, `jcb`, `unionpay`, `maestro`.                                      |
| `color`             | `"primary"`       | Gradient color, from the shared loomi palette. Ignored in `outline` variant.                                                                 |
| `variant`           | `"gradient"`      | `"gradient"` for the full-color accent face, `"outline"` for a bare silhouette, or `"inline"` for card number, expiry, and CVC fields only.  |
| `locale`            | _(blank)_         | Overrides the global locale for this instance.                                                                                               |
| `flipped`           | `false`           | Shows the back face. _(boolean)_                                                                                                             |
| `disabled`          | `false`           | Disables every field and the flip button. _(boolean)_                                                                                        |
| `readonly`          | `false`           | Read-only fields. _(boolean)_                                                                                                                |
| `required`          | `false`           | Fails `validate()` while any field is incomplete. _(boolean)_                                                                                |
| `error-message`     | _(blank)_         | Message shown when validation fails.                                                                                                         |
| `show-error-inline` | `false`           | Render the error beneath the card. _(boolean)_                                                                                               |
| `no-clearing`       | `false`           | Remove the default bottom margin. _(boolean)_                                                                                                |

**Properties:** `value` (read-only `LoomiCreditcardValue`), `activeBrand` (read-only,
the currently displayed `LoomiCardBrand`).
**Methods:** `validate()`.
**Parts:** `front`, `back`, `number`, `name`, `expiry`, `cvc`, `flip-button`.

## Events

| Event        | Description                                   |
| ------------ | --------------------------------------------- |
| `change`     | Fired when the value is committed or changed. |
| `input`      | Fired while the value is edited.              |
| `loomi-flip` | Fired when the visible card face changes.     |

## Full Example

```html
<loomi-creditcard
  cardholder-name="Ama Osei"
  number="5555555555554444"
  expiry-month="11"
  expiry-year="27"
  color="secondary"
  required
></loomi-creditcard>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-creditcard>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/creditcard` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/creditcard lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/creditcard build
pnpm --filter @loomidev/creditcard typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/creditcard"></script>

<loomi-creditcard cardholder-name="Ama Osei"></loomi-creditcard>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/creditcard";
```

This component does not submit through a native `<form>` — read its `value` getter or listen for `input`/`change` instead (see "Reading the value" above).

</loomi-tab>
<loomi-tab label="Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/creditcard lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/creditcard";
```

```blade
<loomi-creditcard cardholder-name="{{ $name }}"></loomi-creditcard>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/creditcard";

export function LoomiExample() {
  return (
    <loomi-creditcard cardholder-name="Ama Osei"></loomi-creditcard>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/creditcard";
</script>

<template>
  <loomi-creditcard cardholder-name="Ama Osei"></loomi-creditcard>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/creditcard";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-creditcard cardholder-name="Ama Osei"></loomi-creditcard>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte / Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/creditcard";
</script>

<loomi-creditcard cardholder-name="Ama Osei"></loomi-creditcard>
```

```astro
---
import "@loomidev/creditcard";
---

<loomi-creditcard cardholder-name="Ama Osei"></loomi-creditcard>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
- `@loomidev/theme`
