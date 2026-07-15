# @loomidev/alert

`<loomi-alert>` — an inline alert message. The default uses the primary palette with no
leading icon. Four explicit types add semantic colors and icons. Alerts also support
`faint`/`dark` shades, palette overrides, an optional avatar, and a dismiss button.
For floating/overlay alerts instead, see [`@loomidev/notification`](../notification).

```bash
npm install @loomidev/alert lit
```

```js
import "@loomidev/alert";
```

## Basic Usage

Use `<loomi-alert>` for concise, inline messages that keep users informed without
interrupting their workflow.

```html
<loomi-alert>
  Your subscription expires in 19 days. <a href="#">Renew now</a>
</loomi-alert>
```

## Types

Use the `type` attribute to clearly express the purpose of your message. The component has four types: `info`, `success`, `warning` and `error`.
Each type automatically applies matching semantic colors and a leading icon, making alerts easier for users to scan and understand at a glance.

### Info

Use the `info` alert for neutral, contextual updates that help users stay aware of changes without requiring immediate action.

```html
<loomi-alert type="info">
  A new version is available.
</loomi-alert>
```

### Error

Use the `error` alert for critical issues that block progress or require immediate user attention.

```html
<loomi-alert type="error">
  You do not have permission to upload files.
</loomi-alert>
```

### Warning

Use the `warning` alert for important notices about potential issues or risky actions that users should review before continuing.

```html
<loomi-alert type="warning">
  Well, this is your first warning.
</loomi-alert>
```

### Success

Use the `success` alert to confirm completed actions and reassure users that a task finished as expected.

```html
<loomi-alert type="success">
  Files were successfully uploaded.
</loomi-alert>
```

## Shades

Use the `shade` attribute to control how strong the alert looks:
The default is `shade="faint"`. This provides a softer, tinted background for everyday messages.
Set `shade="dark"` to get a stronger, solid-fill style for higher visual emphasis.

```html
<loomi-alert shade="dark">Your subscription is expiring in 19 days.</loomi-alert>
<loomi-alert type="info" shade="dark">Your subscription has expired.</loomi-alert>
<loomi-alert type="error" shade="dark">You do not have permission to upload files.</loomi-alert>
<loomi-alert type="warning" shade="dark">Continuing will delete all your files.</loomi-alert>
<loomi-alert type="success" shade="dark">Transfer completed successfully.</loomi-alert>
```

## Showing and Hiding Icons

The close icon is hidden by default. Set `show-close-icon` to make the alert dismissible.
Leading icons are displayed when you set either the `type` or `icon` attribute.

```html
<loomi-alert icon="archive-box" show-close-icon>
  You should archive some mails now to free up space. <a href="#">Archive</a>
</loomi-alert>
```

<p>&nbsp;</p>

It is possible to also hide the leading icon by setting `show-icon="false"`.

```html
<loomi-alert type="error" show-icon="false">
  Pay up your bill to prevent service interruption.
</loomi-alert>
```

<p>&nbsp;</p>

With the default close-icon behavior, setting `show-icon="false"` hides both icons.

```html
<loomi-alert type="warning" show-icon="false">
  We have noticed multiple logins on your account.
</loomi-alert>
```

## Icon Placement

Leading icons, avatars, and the close icon are vertically centered by default. Set
`icon-placement="top"` when you want them aligned with the first line of longer content.

```html
<loomi-alert type="info">
  Your subscription is expiring in 19 days. Renew now to keep
  uninterrupted access. Your current plan and workspace settings
  will stay the same.  If you are broke, just call our support line
  and we'll figure something out. What are friends for!
</loomi-alert>
```

<p>&nbsp;</p>

```html
<loomi-alert type="warning" icon-placement="top">
  Your payment method needs attention. Update it before the next
  billing date. This will prevent an interruption to your subscription.
  If you are broke, just call our support line and we'll figure something
  out. What are friends for!
</loomi-alert>
```

## Custom Colors

Setting `type` to `info`, `error`, `warning` and `success` automatically sets default colours.
You can override these colours by setting `color`, giving you direct control over the
alert's visual treatment. You can use any standard loomi color token (for example,
`primary`, `success`, `warning`, or `error`) and pair it with either `shade="light"` or
`shade="dark"`.

Use `color="transparent"` when you want a minimal, borderless, no-fill presentation that
still preserves alert structure and content spacing.

```html
<loomi-alert color="error">I am an error alert.</loomi-alert>
<loomi-alert color="gray" shade="dark">I am a dark shaded error alert.</loomi-alert>
<loomi-alert color="warning">I am a warning alert.</loomi-alert>
<loomi-alert color="success">I am a violet alert.</loomi-alert>
<loomi-alert color="transparent">I am a transparent alert.</loomi-alert>
```

## Custom Icons

The untyped default has no leading icon. The four explicit types have default icons:

| Type    | Description                           | Icon                   |
| ------- | ------------------------------------- | ---------------------- |
| info    | General informational messages.       | `information-circle`   |
| error   | Errors that require immediate action. | `hand-raised`          |
| warning | Cautions about potential issues.      | `exclamation-triangle` |
| success | Confirmations of successful actions.  | `check-circle`         |

<p>&nbsp;</p>

Use the `icon` prop to replace the default alert icon with any icon from the shared
[`@loomidev/icons`](/icons) registry.

This is especially helpful when you want alerts that feel more specific (for example,
using a `bell-alert` icon for reminders) and it works best when paired with a custom
`color` so the icon and message style match.

```html
<loomi-alert color="primary" icon="bell-alert">No more snoozing. Wake up!</loomi-alert>
<loomi-alert color="primary" shade="dark" icon="key">We've mailed your new license key.</loomi-alert>
```

## Avatars

Want alerts to feel more personal? Use an image as the leading visual instead of an
icon by setting `avatar` to an image URL.

This works well for user activity, invites, mentions, and team updates where a person
or profile image makes the message easier to scan.

Tip: combine `avatar` with `show-ring` when you want the avatar to stand out more.

```html
<loomi-alert avatar="/avatars/female.jpg">
  Jane has been added to your friends list. <a href="#">Say hello</a>
</loomi-alert>
```

```html
<!-- with a ring -->
<loomi-alert shade="dark" avatar="/avatars/female.jpg" show-ring>
  <strong>New friend request</strong><br />
  Jane C. Doe wants to be your friend.
</loomi-alert>
```

## Dismissing

When `show-close-icon` is enabled, clicking the close icon immediately closes the alert
by removing it from the DOM.

If you want more control, listen for the `close` event. Inside that handler, call
`event.preventDefault()` to stop the default removal behavior. This is useful when
you want to run custom logic first, for example, saving a "dismissed" state to local
storage, sending an analytics event, or asking for confirmation before hiding the
alert.

Once your custom work is complete, you can decide whether to remove the alert or keep
it visible.

```js
// assuming the alert was defined as
// <loomi-alert id="subscription-expiry" show-close-icon>...</loomi-alert>

const alert = document.querySelector("#subscription-expiry");

alert.addEventListener("close", async (event) => {
  event.preventDefault();

  // Run custom logic.
  localStorage.setItem("subscription-alert-dismissed", "true");
  await sendAnalyticsEvent();

  // Programmatically remove the alert from the DOM.
  alert.remove();
});
```

## Accessibility

`<loomi-alert>` uses semantic HTML first, so browsers and assistive technology get reliable behavior out of the box. ARIA is added only when needed for custom interactions.

To keep alerts accessible and easy to understand for everyone:

- Make sure keyboard users can reach and use the same actions as mouse or touch users.
- Keep visible focus styles enabled so people can always see where they are on the page. (Only disable this with `show-focus-ring="false"` when you have a clear design reason.)
- Use clear, plain-language alert text that explains what happened and what the user should do next.
- When showing status, progress, validation, or temporary feedback, include nearby labels or helper text so screen reader users get the same context as sighted users.

For the library-wide baseline, see [Foundations — Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

`loomi-alert` is built to adapt to the space you give it, from wide desktop layouts to narrow mobile screens. It uses fluid sizing, `min-width: 0`, and layout fallbacks (wrapping, truncation, or stacked content) to stay readable and usable in cards, forms, sidebars, and compact containers.

To get the best responsive behavior:

- Set a clear width on the parent container and let the alert expand to fill available space.
- Prefer real, flexible text content that can wrap naturally for longer messages.
- Use truncation only when space is truly limited and the message remains understandable.
- Test at common breakpoints (mobile, tablet, desktop) to confirm actions and text stay visible.
- Avoid fixed pixel assumptions for message length, icon spacing, or button labels.

In dense layouts, keep alert content short and action labels clear so users can scan and respond quickly on smaller screens.

For the shared container and viewport rules, see [Component Foundations — Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

`loomi-alert` supports dark mode out of the box.

It uses Loomi semantic tokens like `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded colors. This means borders, backgrounds, hover states, and muted text automatically adapt when the theme changes.

To enable dark mode:

- Add `.dark` to your app root using `@loomidev/theme-switcher`, **or**
- Provide your own dark token overrides in your app theme.

Because the component reads theme tokens through shadow DOM, it inherits your dark values automatically without extra component-level setup.

For the best results:

- Check contrast for alert text, icons, and action labels in both light and dark themes.
- Verify hover and focus-visible states are still clear in dark backgrounds.
- Test each alert type (`info`, `warning`, `error`, `success`) to confirm status colors remain distinct.

For theme activation, token overrides, and contrast guidance, see [Component Foundations — Dark mode](https://loomiui.com/foundations/#dark-mode).

## Attributes

| Attribute         | Default   | Description                                                        |
| ----------------- | --------- | ------------------------------------------------------------------ |
| `type`            | _(blank)_ | `info` \| `error` \| `warning` \| `success`                        |
| `shade`           | `faint`   | `faint` \| `dark`                                                  |
| `color`           | _(blank)_ | Override color — any loomi color, or `transparent`.                |
| `icon`            | _(blank)_ | Icon name override (see [`@loomidev/icons`](../icons)).            |
| `icon-placement`  | `center`  | `center` \| `top`; applies to the leading icon/avatar and dismiss. |
| `avatar`          | _(blank)_ | Image URL shown instead of the icon.                               |
| `show-icon`       | `true`    | Show the type icon. _(boolean)_                                    |
| `show-close-icon` | `false`   | Show the dismiss button. _(boolean)_                               |
| `show-ring`       | `false`   | Ring around the avatar. _(boolean)_                                |

## Slots

| Slot      | Description                                                                  |
| --------- | ---------------------------------------------------------------------------- |
| _default_ | Alert message content. Supports plain text or inline HTML (links, emphasis). |

## Events

| Event   | Description                                                                          |
| ------- | ------------------------------------------------------------------------------------ |
| `close` | Fired when the dismiss button is activated. Cancelable via `event.preventDefault()`. |

## Full Example

```html
<loomi-alert
  type="warning"
  shade="dark"
  color="error"
  icon="key"
  show-close-icon>
  Your key is being used on another device.
</loomi-alert>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-alert>` is a standard custom element, which means it works in plain HTML and in most modern frameworks (Blade, React, Vue, Angular, Svelte, Astro, and more). If you are new to web components, think of setup in 3 simple steps:

1. install the package,
2. import it once in your app startup or entry file, and
3. use the `<loomi-alert>` tag in your page/template. As long as the import runs before the component is rendered, it should work as expected.

### Where to run commands

Run install commands from the **app project** where you plan to use `<loomi-alert>`. In practice, this means opening a terminal in the folder that contains your app's `package.json` (for example, your React/Vue/Angular app root).

If you're unsure you're in the right place, run `ls` (or `dir` on Windows) and confirm you can see a `package.json` file before installing.

```bash
cd /path/to/your-app
npm install @loomidev/alert lit
```

<p>&nbsp;</p>

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/alert build
pnpm --filter @loomidev/alert typecheck
```

### Choose your framework

Pick the setup that matches how your app is built. Each option below shows the recommended way to load `<loomi-alert>` so it is registered before use.

<p>&nbsp;</p>

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/alert"></script>

<loomi-alert type="success" show-close-icon>Settings saved.</loomi-alert>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/alert";
```

</loomi-tab>
<loomi-tab label="Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/alert lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/alert";
```

```blade
<loomi-alert type="success" show-close-icon>Settings saved.</loomi-alert>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/alert";

export function LoomiExample() {
  return (
    <loomi-alert type="success" show-close-icon>Settings saved.</loomi-alert>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/alert";
</script>

<template>
  <loomi-alert type="success" show-close-icon>Settings saved.</loomi-alert>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/alert";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-alert type="success" show-close-icon>Settings saved.</loomi-alert>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte / Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/alert";
</script>

<loomi-alert type="success" show-close-icon>Settings saved.</loomi-alert>
```

```astro
---
import "@loomidev/alert";
---

<loomi-alert type="success" show-close-icon>Settings saved.</loomi-alert>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks like Next.js, Nuxt, SvelteKit, and Astro can render pages on the server first. Because Loomi components rely on browser APIs, importing them during server render can sometimes cause errors.

If you see messages such as `window is not defined`, `customElements is not defined`, or hydration warnings, move the Loomi import so it runs only in the browser.

- **Next.js (App Router):** import Loomi inside a component marked with `"use client"`.
- **Nuxt:** register Loomi in a client-only plugin (for example, `plugins/loomi.client.ts`).
- **SvelteKit / Astro:** keep the import in code that runs on the client side where the component is used.

Once loaded on the client, `<loomi-alert>` works as expected.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
- `@loomidev/icons`
