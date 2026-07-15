# @loomidev/clipboard

`<loomi-clipboard>` wraps text or content and appends a copy icon button.
When clicked, it copies the wrapped text and briefly shows subtle copied feedback.

```bash
npm install @loomidev/clipboard lit
```

```js
import "@loomidev/clipboard";
```

## Basic Usage

```html
<loomi-clipboard>INV-2048</loomi-clipboard>
```

## Copy Wrapped Content

If the component wraps a `div`, it copies the text content of that `div`.

```html
<loomi-clipboard>
  <div>https://example.com/invite/team-alpha</div>
</loomi-clipboard>
```

## Explicit Value

Use `value` when the visible content differs from the clipboard value.

```html
<loomi-clipboard value="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA...">
  <span>SSH key fingerprint copied from account settings</span>
</loomi-clipboard>
```

## Events

```js
document.querySelector("loomi-clipboard").addEventListener("copied", (event) => {
  console.log(event.detail.value);
});
```

## Accessibility

For the library-wide baseline, see [Component foundations — Accessibility](https://loomiui.com/customization/component-foundations/#accessibility).

## Responsive behavior

For the shared container and viewport rules, see [Component foundations — Responsive behavior](https://loomiui.com/customization/component-foundations/#responsive-behavior).

## Dark mode

For theme activation, token overrides, and contrast guidance, see [Component foundations — Dark mode](https://loomiui.com/customization/component-foundations/#dark-mode).

## Attributes

| Attribute      | Default             | Description                                                   |
| -------------- | ------------------- | ------------------------------------------------------------- |
| `value`        | _(blank)_           | Explicit clipboard value. Falls back to slotted text content. |
| `copy-label`   | `Copy to clipboard` | Accessible label before copy.                                 |
| `copied-label` | `Copied`            | Feedback text and accessible label after copy.                |
| `disabled`     | `false`             | Disables the copy button. _(boolean)_                         |

**Slot:** default text or content to display and copy.

## Dependencies

- `@loomidev/core`
- `@loomidev/icons`
