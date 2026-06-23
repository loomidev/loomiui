# @loomi/textarea

`<loomi-textarea>` — a themeable multi-line text input with a floating label and inline
validation. **Form-associated**: its value submits with the surrounding form.

```bash
npm install @loomi/textarea lit
```

```js
import "@loomi/textarea/loomi-textarea.js";
```

```html
<loomi-textarea placeholder="Comment"></loomi-textarea>
<loomi-textarea label="Comment" rows="5"></loomi-textarea>
<loomi-textarea required label="Bio" error-message="Write something" show-error-inline></loomi-textarea>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `label` | _(blank)_ | Floating label. |
| `placeholder` | _(blank)_ | Placeholder text. |
| `value` | _(blank)_ | Current value (also a property). |
| `rows` | `3` | Height in rows. |
| `required` | `false` | Marks the field required. _(boolean)_ |
| `disabled` | `false` | Disable the field. _(boolean)_ |
| `readonly` | `false` | Read-only field. _(boolean)_ |
| `error-message` | _(blank)_ | Message shown when validation fails. |
| `show-error-inline` | `false` | Render the error beneath the field. _(boolean)_ |
| `no-clearing` | `false` | Remove the default bottom margin. _(boolean)_ |

**Methods:** `focus()`, `validate()`. **Events:** `input`, `change` (composed).
**Parts:** `field`, `textarea`.

> Not ported from BladewindUI: the Quill rich-text toolbar.
