# @loomidev/copy-to-clipboard

`<loomi-copy-to-clipboard>` wraps text or content and appends a copy icon button.
When clicked, it copies the wrapped text and briefly shows subtle copied feedback.

```bash
npm install @loomidev/copy-to-clipboard lit
```

```js
import "@loomidev/copy-to-clipboard";
```


## Basic Usage

```html
<loomi-copy-to-clipboard>INV-2048</loomi-copy-to-clipboard>
```

## Copy Wrapped Content

If the component wraps a `div`, it copies the text content of that `div`.

```html
<loomi-copy-to-clipboard>
  <div>https://example.com/invite/team-alpha</div>
</loomi-copy-to-clipboard>
```

## Explicit Value

Use `value` when the visible content differs from the clipboard value.

```html
<loomi-copy-to-clipboard value="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA...">
  <span>SSH key fingerprint copied from account settings</span>
</loomi-copy-to-clipboard>
```

## Events

```js
document.querySelector("loomi-copy-to-clipboard").addEventListener("copied", (event) => {
  console.log(event.detail.value);
});
```

## Accessibility

loomi-copy-to-clipboard is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior

loomi-copy-to-clipboard is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.


## Dark mode

loomi-copy-to-clipboard uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `value` | _(blank)_ | Explicit clipboard value. Falls back to slotted text content. |
| `copy-label` | `Copy to clipboard` | Accessible label before copy. |
| `copied-label` | `Copied` | Feedback text and accessible label after copy. |
| `disabled` | `false` | Disables the copy button. _(boolean)_ |

**Slot:** default text or content to display and copy.

## Dependencies

- `@loomidev/core`
- `@loomidev/icons`
