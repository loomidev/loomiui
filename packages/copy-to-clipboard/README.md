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
- Implements ARIA roles/states for custom interaction surfaces.
- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior
- Includes layout breakpoints for narrow viewports (see component CSS).

## Dark mode
- Uses semantic `--loomi-surface`, `--loomi-surface-border`, and `--loomi-text` tokens where applicable.
- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.
- ⚠️ Audit raw `--loomi-gray-*` / hex fills and migrate to semantic tokens.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `value` | _(blank)_ | Explicit clipboard value. Falls back to slotted text content. |
| `copy-label` | `Copy to clipboard` | Accessible label before copy. |
| `copied-label` | `Copied` | Feedback text and accessible label after copy. |
| `disabled` | `false` | Disables the copy button. _(boolean)_ |

**Slot:** default text or content to display and copy.
