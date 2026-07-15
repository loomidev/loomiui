# @loomidev/otp

`<loomi-otp>` — a one-time-passcode (OTP) input of N boxes with auto-advance and paste
support. It's common to send users a 4–6 character code via email or SMS for them to enter
here. Accepts digits only by default (the classic PIN); set `type` to also allow letters.
**Form-associated**: submits the joined code under `name`.

```bash
npm install @loomidev/otp lit
```

```js
import "@loomidev/otp";
```

## Basic Usage

The default number of boxes is four.

```html
<loomi-otp></loomi-otp>
```

```html
<loomi-otp size="big"></loomi-otp>
```

Set `total-digits` to show more or fewer boxes — there's no upper limit, so this also
works well for collecting longer numeric codes like account numbers.

```html
<loomi-otp total-digits="6"></loomi-otp>
```

## Character Type

`type` controls which characters each box accepts. Non-matching characters are dropped as
the user types or pastes, so the code is always clean. Digits-only (`numeric`) is the
default and sets `inputmode="numeric"` for a numeric mobile keypad; the others use a full
keyboard.

```html
<loomi-otp type="numeric"></loomi-otp>      <!-- default: 0–9 only -->
<loomi-otp type="alphanumeric"></loomi-otp> <!-- letters + digits -->
<loomi-otp type="text"></loomi-otp>         <!-- any non-whitespace character -->
```

## Masking

Hide the entered characters and show large dots, like a password field.

```html
<loomi-otp mask></loomi-otp>
<loomi-otp hide-digits></loomi-otp>
```

## Dash Separator

Add `separator` to split the inputs around a dash. Even counts split equally. Odd counts
put the smaller group on the left and the larger group on the right.

```html
<loomi-otp total-digits="6" separator></loomi-otp>
<loomi-otp total-digits="7" separator></loomi-otp>
```

## Reacting to a Completed Code

The `loomi-verify` event fires once every box is filled. `e.detail.code` is the joined string.

```html
<loomi-otp></loomi-otp>

<script type="module">
  document.querySelector("loomi-otp").addEventListener("verify", (e) => {
    console.log(e.detail.code); // "1234"
  });
</script>
```

## Showing an Error & Clearing

Call `showError()` on the element to display `error-message` and turn every box red;
call `clear()` to empty them so the user can try again.

```html
<loomi-otp error-message="Yikes, check your code"></loomi-otp>

<script type="module">
  const el = document.querySelector("loomi-otp");
  el.addEventListener("verify", (e) => {
    if (e.detail.code !== "1234") {
      el.showError();
      el.clear();
    }
  });
</script>
```

`error-message` controls what (if anything) is displayed _in addition to_ the red
border — the border shows either way, even if `error-message` is left blank.

## Async Validation: Spinner → Checkmark or Red Boxes

Call `startValidating()` as soon as the `loomi-verify` event fires to show a spinner in the
status slot (next to the boxes) while you check the code with your server. Then call
either `showSuccess()` (spinner → green checkmark, green boxes) or `showError()`
(spinner → red boxes, plus the error message) once the check resolves. The boxes are
disabled while `validating` is true so the user can't edit mid-check; typing again after
a success/error clears all three states back to idle.

```html
<loomi-otp
  label="Verification code"
  error-message="That code didn't work, try again"
></loomi-otp>

<script type="module">
  const el = document.querySelector("loomi-otp");
  el.addEventListener("verify", async (e) => {
    el.startValidating();
    const ok = await verifyPin(e.detail.code);
    if (ok) {
      el.showSuccess();
    } else {
      el.showError();
      el.clear();
    }
  });
</script>
```

Same as [`<loomi-input>`](../input): when the code just became invalid, `error-message`
surfaces inline below the boxes if `show-error-inline` is set, otherwise as a
`loomi-notification` toast (see [`@loomidev/notification`](../notification)) titled with
`label`, so the message isn't silently dropped.

```html
<loomi-otp error-message="That code didn't work, try again" show-error-inline></loomi-otp>
<!-- show-error-inline omitted (false): a failed showError() shows this message as a
     toast instead of inline text, but the red boxes still appear either way -->
```

`showError()` also accepts a one-off message that overrides `error-message` for that
call, handy for server-provided errors (e.g. "Too many attempts, try again in 30s"):

```js
el.showError("Too many attempts, try again in 30s");
```

## Accessibility

For the library-wide baseline, see [Component foundations — Accessibility](https://loomiui.com/customization/component-foundations/#accessibility).

## Responsive behavior

For the shared container and viewport rules, see [Component foundations — Responsive behavior](https://loomiui.com/customization/component-foundations/#responsive-behavior).

## Dark mode

For theme activation, token overrides, and contrast guidance, see [Component foundations — Dark mode](https://loomiui.com/customization/component-foundations/#dark-mode).

## Attributes

| Attribute           | Default                        | Description                                                                                                                               |
| ------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `name`              | _(blank)_                      | Submitted with the form.                                                                                                                  |
| `label`             | _(blank)_                      | Used as the title of the `loomi-notification` toast (see below); has no visible effect otherwise.                                         |
| `total-digits`      | `4`                            | Number of input boxes.                                                                                                                    |
| `type`              | `numeric`                      | Accepted characters. `numeric` \| `alphanumeric` \| `text`                                                                                |
| `size`              | `small`                        | `small` \| `big`                                                                                                                          |
| `variant`           | `default`                      | `default` \| `minimal` (bottom border only, no box)                                                                                       |
| `separator`         | `false`                        | Show a dash separator between the left and right input groups. _(boolean)_                                                                |
| `hide-digits`       | `false`                        | Hide entered characters and show large dots. _(boolean)_                                                                                  |
| `mask`              | `false`                        | Alias for hiding entered characters. _(boolean)_                                                                                          |
| `error-message`     | `Verification code is invalid` | Shown when `showError()` is called. The red border shows either way, even if this is left blank.                                          |
| `show-error-inline` | `false`                        | Render `error-message` beneath the boxes. When `false`, a failed validation shows it as a `loomi-notification` toast instead. _(boolean)_ |

**Methods:** `clear()`, `startValidating()`, `showSuccess()`, `showError(message?)`.
**Properties:** `code` (`pin` is a deprecated alias), `validating` (reflected), `valid`
(reflected), `invalid` (reflected). **Event:** `loomi-verify` (`detail: { code, pin }`, where
`pin` is a deprecated alias of `code`; fired when all boxes are filled).

## Full Example

```html
<loomi-otp
  name="otp-code"
  total-digits="5"
  label="Verification code"
  error-message="Please enter the correct code"
></loomi-otp>

<script type="module">
  const el = document.querySelector("loomi-otp");
  el.addEventListener("verify", async (e) => {
    el.startValidating();
    const ok = await verifyPin(e.detail.code);
    if (ok) {
      el.showSuccess();
    } else {
      el.showError();
      el.clear();
    }
  });
</script>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-otp>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/otp` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/otp lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/otp build
pnpm --filter @loomidev/otp typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/otp"></script>

<loomi-otp name="otp" total-digits="6" hide-digits separator></loomi-otp>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/otp";
```

Because this is a form-capable component, give it a `name` when it should submit with a native `<form>`. Read its value with `new FormData(form).get("the-name")` just like you would for a built-in input.

</loomi-tab>
<loomi-tab label="Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/otp lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/otp";
```

```blade
<loomi-otp name="otp" total-digits="6" hide-digits separator></loomi-otp>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/otp";

export function LoomiExample() {
  return <loomi-otp name="otp" total-digits="6" hide-digits separator></loomi-otp>;
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/otp";
</script>

<template>
  <loomi-otp name="otp" total-digits="6" hide-digits separator></loomi-otp>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/otp";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
  <loomi-otp name="otp" total-digits="6" hide-digits separator></loomi-otp>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte / Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/otp";
</script>

<loomi-otp name="otp" total-digits="6" hide-digits separator></loomi-otp>
```

```astro
---
import "@loomidev/otp";
---

<loomi-otp name="otp" total-digits="6" hide-digits separator></loomi-otp>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
- `@loomidev/notification`
