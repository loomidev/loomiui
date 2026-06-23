# @loomi/code

`<loomi-code>` — a verification-code (PIN) input of N boxes with auto-advance and paste support. Form-associated: submits the joined code under `name`.

```bash
npm install @loomi/code lit
```

```js
import "@loomi/code/loomi-code.js";
```

## Usage

```html
<loomi-code total-digits="4"></loomi-code>
<loomi-code total-digits="6" mask size="big"></loomi-code>

<script type="module">
  document.querySelector("loomi-code").addEventListener("verify", (e) => {
    if (e.detail.code !== "1234") e.target.showError();
  });
</script>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `total-digits` | 4 | Number of input boxes. |
| `size` | small | `small` \| `big` |
| `mask` | false | Hide entered characters. _(boolean)_ |
| `error-message` | Verification code is invalid | Shown when `showError()` is called. |

**Methods:** `clear()`, `showError()`. **Property:** `code`. **Event:** `verify` (`detail: { code }`, fired when all boxes are filled).
