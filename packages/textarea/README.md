# @loomi/textarea

`<loomi-textarea>` — a themeable multi-line text input with a floating label and inline
validation. **Form-associated**: its value submits with the surrounding form.

```bash
npm install @loomi/textarea lit
```

```js
import "@loomi/textarea/loomi-textarea.js";
```

## Basic Usage

By default the textarea renders with three rows. Use `placeholder` for simple hint text.

```html
<loomi-textarea placeholder="Comment"></loomi-textarea>
```

## With Labels

Set `label` instead of (or together with) `placeholder` for a label that sits as
placeholder text until the field is focused, then floats to the top border — a compact
way to build forms without separate `<label>` elements taking up space.

```html
<loomi-textarea label="Comment"></loomi-textarea>
```

## Required Fields

Marks the field with a red asterisk next to the label/placeholder, and fails
`validate()` while empty.

```html
<loomi-textarea required label="Comment"></loomi-textarea>
```

## Rows & Resizing

Increase `rows` to make the textarea taller by default.

```html
<loomi-textarea label="Bio" rows="6"></loomi-textarea>
```

## Validation

`validate()` returns `true`/`false` and, with `show-error-inline`, renders
`error-message` directly beneath the field instead of you wiring up your own error UI.

```html
<loomi-textarea
  required
  label="Bio"
  error-message="Write something about yourself"
  show-error-inline
></loomi-textarea>

<script type="module">
  const el = document.querySelector("loomi-textarea");
  submitButton.addEventListener("click", () => {
    if (!el.validate()) return;
    // proceed
  });
</script>
```

## Events

```html
<loomi-textarea
  label="Comment"
  onfocus="this.part.field?.classList.add('ring-2')"
></loomi-textarea>
```

Like any element, you can attach standard listeners (`input`, `focus`, `blur`) directly,
or use the exported `field`/`textarea` CSS parts to style focus/blur states from outside
the shadow root.

```js
document.querySelector("loomi-textarea").addEventListener("input", (e) => {
  console.log(e.target.value);
});
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

## Full Example

```html
<loomi-textarea
  name="message"
  label="Enter message"
  required
  rows="5"
  show-error-inline
  error-message="A comment is required"
></loomi-textarea>
```
