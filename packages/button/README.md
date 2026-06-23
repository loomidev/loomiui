# @loomi/button

`<loomi-button>` — a themeable, framework-agnostic button web component built with Lit.

The button renders as an HTML `<button>` by default. Structural variant (`type`) and
palette (`color`) are independent attributes, and styling is composed from orthogonal
attributes (`size`, `radius`, `outline`, `border-width`) rather than combined variant
strings. All colors resolve through `--loomi-*` custom properties, so the whole button can
be re-skinned from your page with no rebuild.

## Installation

```bash
npm install @loomi/button lit
```

```js
import "@loomi/button/loomi-button.js"; // registers <loomi-button>
```

`lit` is a peer dependency. `@loomi/theme` (the shared design tokens) is pulled in
automatically.

## Basic Usage

```html
<loomi-button>Subscribe Now</loomi-button>

<!-- uppercase the label -->
<loomi-button uppercase>Subscribe Now</loomi-button>

<!-- render as an <a> tag -->
<loomi-button tag="a" href="/pricing">Subscribe Now</loomi-button>
```

## Button Types

`type` selects the structural treatment. `primary` is a bold fill; `secondary` is a soft,
tinted variant.

```html
<loomi-button>Primary Button</loomi-button>
<loomi-button outline>Primary Outline</loomi-button>

<loomi-button type="secondary">Secondary Button</loomi-button>
<loomi-button type="secondary" outline>Secondary Outline</loomi-button>
```

## Outline

Set `outline` on any button to drop the fill and keep a colored border + text.

```html
<loomi-button outline color="cyan" radius="full">Cyan Outline</loomi-button>
<loomi-button type="secondary" outline radius="full">Secondary Outline</loomi-button>

<!-- custom border width (default is 2) -->
<loomi-button outline border-width="4">Border 4</loomi-button>
<loomi-button outline border-width="8">Border 8</loomi-button>
```

## Sizes

Available sizes: `tiny`, `small`, `regular` (default), `medium`, `big`.

```html
<loomi-button size="tiny">Tiny</loomi-button>
<loomi-button size="small">Small</loomi-button>
<loomi-button>Regular (default)</loomi-button>
<loomi-button size="medium">Medium</loomi-button>
<loomi-button size="big">Big</loomi-button>
```

## Radii

```html
<loomi-button radius="none">None</loomi-button>
<loomi-button radius="small">Small</loomi-button>
<loomi-button radius="medium">Medium</loomi-button>
<loomi-button radius="full">Full</loomi-button>
```

## Colors

`color` overrides the palette independently of `type`. Useful when you need a hue that
differs from your project's primary (e.g. a red delete button).

```html
<loomi-button color="red">Red Button</loomi-button>
<loomi-button color="red" outline>Red Outline</loomi-button>
<loomi-button type="secondary" color="green">Soft Green</loomi-button>
```

Available colors: `primary` `secondary` `red` `blue` `green` `purple` `pink` `orange`
`black` `cyan` `violet` `indigo` `fuchsia` `gray`

> Leaving `color` unset derives it from `type`: `primary` → the `primary` palette,
> `secondary` → the `secondary` palette.

## Icons

Set `icon` to a name from the built-in registry. Icons default to the left; add
`icon-right` to move them after the label. `icon-right` is ignored while a spinner is
showing.

```html
<loomi-button icon="arrow-path">Refresh Page</loomi-button>
<loomi-button icon="arrow-small-right" icon-right>Next Chapter</loomi-button>
<loomi-button icon="trash" color="red" outline>Delete</loomi-button>
```

Built-in icons (a subset of Heroicons outline): `arrow-path`, `bell-alert`,
`lock-closed`, `arrow-right`, `arrow-small-right`, `chevron-right`, `check`, `plus`,
`trash`, `x-mark`, `magnifying-glass`, `paper-airplane`.

Need more? Register your own — no slot or icon font required:

```js
import { registerLoomiIcon } from "@loomi/button";
import { svg } from "lit";

registerLoomiIcon("star", svg`<path stroke-linecap="round" stroke-linejoin="round" d="..." />`);
```

## Spinners

`has-spinner` includes a spinner (hidden by default). `show-spinner` makes it visible.
To toggle it on click, call the instance methods `startSpinner()` / `stopSpinner()`.

```html
<!-- visible immediately -->
<loomi-button has-spinner show-spinner>Saving…</loomi-button>

<!-- triggered on click -->
<loomi-button id="save" has-spinner>Save User</loomi-button>
<script type="module">
  const btn = document.getElementById("save");
  btn.addEventListener("click", () => {
    btn.startSpinner();
    saveUser().finally(() => btn.stopSpinner());
  });
</script>
```

## Form Submission

By default the button renders as `<button type="button">` and won't submit forms. Add
`can-submit` to render as `<button type="submit">`.

```html
<loomi-button can-submit>Submit Form</loomi-button>
```

## Disabled

```html
<loomi-button disabled>Disabled</loomi-button>
<loomi-button disabled type="secondary">Disabled Secondary</loomi-button>
<loomi-button disabled outline>Disabled Outline</loomi-button>
```

## Render as a link

```html
<loomi-button tag="a" href="https://example.com" icon="paper-airplane">
  Open
</loomi-button>
```

When `tag="a"` and `disabled` is set, the `href` is removed and the link is taken out of
the tab order.

## Focus Rings

```html
<!-- hide the keyboard focus ring -->
<loomi-button show-focus-ring="false">No Focus Ring</loomi-button>
```

## Slots

For arbitrary content, use the named slots. (For known icon sets, prefer the `icon`
attribute above.)

```html
<loomi-button>
  <img slot="prefix" src="/avatar.png" width="16" height="16" alt="" />
  Profile
  <span slot="suffix">▾</span>
</loomi-button>
```

| Slot | Description |
| --- | --- |
| _(default)_ | The button label. |
| `prefix` | Content rendered before the icon/label. |
| `suffix` | Content rendered after the label. |

## Events

The native `click` event is composed and crosses the shadow boundary, so you listen for
it exactly as you would on a normal button:

```html
<loomi-button onclick="alert('you clicked me')">Click Me</loomi-button>
```

Clicks are suppressed while the button is `disabled`.

## Theming

Override any palette slot from your page — no build step, no Tailwind:

```css
:root {
  --loomi-primary-600: #16a34a; /* every primary button turns green */
  --loomi-primary-700: #15803d;
}
```

See the [root README](../../README.md#theming-the-edit-tailwindconfigjs-replacement) for
the full theming model.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `type` | `primary` | Structural variant. `primary` \| `secondary` |
| `color` | _(derived from `type`)_ | Palette override. See available colors above. |
| `size` | `regular` | `tiny` \| `small` \| `regular` \| `medium` \| `big` |
| `radius` | `medium` | `none` \| `small` \| `medium` \| `full` |
| `outline` | `false` | Outline only, no fill. _(boolean)_ |
| `border-width` | `2` | Outline border width. `2` \| `4` \| `8` |
| `icon` | _(blank)_ | Built-in or registered icon name. |
| `icon-right` | `false` | Position the icon after the label. Ignored while spinning. _(boolean)_ |
| `has-spinner` | `false` | Include a spinner (hidden until shown). _(boolean)_ |
| `show-spinner` | `false` | Show the spinner. Only when `has-spinner`. _(boolean)_ |
| `disabled` | `false` | Disable the button. _(boolean)_ |
| `tag` | `button` | Element to render. `button` \| `a` |
| `href` | _(blank)_ | Link target when `tag="a"`. |
| `can-submit` | `false` | Render as `type="submit"`. _(boolean)_ |
| `show-focus-ring` | `true` | Show the keyboard focus ring. _(boolean)_ |
| `uppercase` | `false` | Uppercase the label. _(boolean)_ |
| `name` | _(blank)_ | Optional name, reflected as an attribute for targeting. |

### Properties & methods (JS)

| Member | Description |
| --- | --- |
| All attributes above | Available as camelCase properties (e.g. `el.iconRight`, `el.hasSpinner`). |
| `startSpinner()` | Show the spinner (no-op unless `has-spinner` is set). |
| `stopSpinner()` | Hide the spinner. |

## CSS Parts

| Part | Description |
| --- | --- |
| `button` | The underlying `<button>` / `<a>` element. |

## Full Example

```html
<loomi-button
  type="secondary"
  size="big"
  name="btn-subscribe"
  has-spinner
  tag="a"
  href="/subscribe"
  outline
  border-width="2"
  show-focus-ring="false"
  radius="medium"
  icon="lock-closed"
>
  Subscribe
</loomi-button>
```
