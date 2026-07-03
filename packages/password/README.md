# @loomidev/password

`<loomi-password>` — a form-associated password field with reveal, prefixes, validation
and neutral strength hints.

## Installation

```bash
npm install @loomidev/password lit
```

```js
import "@loomidev/password"; // registers <loomi-password>
```

## Basic Usage

```html
<loomi-password name="password" label="Password"></loomi-password>
<loomi-password name="password" label="Password" required></loomi-password>
```

## Strength Requirements

Set `strength` with any combination of these optional tokens:

| Token | Requirement |
| --- | --- |
| `A` | At least one uppercase letter. |
| `a` | At least one lowercase letter. |
| `1` | At least one number. |
| `#` | At least one special character. |

```html
<loomi-password label="Password" strength="Aa1#"></loomi-password>
```

The matching requirements render beneath the field with gray check marks. A requirement's
check mark and label turn green once the current value satisfies it.

Set `strength-color` to customize that met-state label color.

```html
<loomi-password label="Password" strength="Aa1#" strength-color="#14532d"></loomi-password>
```

## Prefixes

Use text, a built-in icon, a slot, or a prefix dropdown.

```html
<loomi-password prefix-icon="key" label="Password"></loomi-password>
<loomi-password prefix-options="personal,admin,service" label="Password"></loomi-password>
```

The selected dropdown value is available on `.prefixValue` and emits a composed
`prefix-change` event with `{ value }`.

## Validation

`required`, `error-message`, `show-error-inline`, `validate()`, `checkValidity()` and
`reportValidity()` match `<loomi-input>`. Strength requirements also participate in
validity when `strength` is set.

```html
<loomi-password
  required
  strength="Aa1#"
  label="Password"
  error-message="Choose a stronger password"
  show-error-inline
></loomi-password>
```

## Accessibility
- Implements ARIA roles/states for custom interaction surfaces.
- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior
- Fluid width (`width: 100%`, `min-width: 0`) within flex and grid layouts.

## Dark mode
- Uses semantic `--loomi-surface`, `--loomi-surface-border`, and `--loomi-text` tokens where applicable.
- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.
- ⚠️ Audit raw `--loomi-gray-*` / hex fills and migrate to semantic tokens.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `label` | _(blank)_ | Floating label. |
| `placeholder` | _(blank)_ | Placeholder text. |
| `value` | _(blank)_ | Current value. |
| `required` | `false` | Marks the field required. _(boolean)_ |
| `disabled` | `false` | Disable the field. _(boolean)_ |
| `readonly` | `false` | Read-only field. _(boolean)_ |
| `size` | `medium` | `tiny` \| `small` \| `regular` \| `medium` \| `big` |
| `prefix` | _(blank)_ | Text prefix. |
| `prefix-icon` | _(blank)_ | Icon-name prefix. |
| `prefix-options` | _(blank)_ | Comma, pipe, or JSON array of dropdown options. |
| `prefix-value` | _(blank)_ | Selected prefix dropdown value. |
| `transparent-prefix` | `true` | Transparent (vs solid) prefix. _(boolean)_ |
| `viewable` | `true` | Show a reveal eye. _(boolean)_ |
| `clearable` | `false` | Show a clear button when the field has a value. _(boolean)_ |
| `strength` | _(blank)_ | Requirement tokens: `A`, `a`, `1`, `#`. |
| `strength-color` | _(blank)_ | Custom color for met strength labels. Defaults to a darker success green. |
| `error-message` | _(blank)_ | Message shown when validation fails. |
| `show-error-inline` | `false` | Render `error-message` beneath the field. _(boolean)_ |
| `show-placeholder-always` | `false` | Keep the placeholder visible even with a label. _(boolean)_ |

### Methods & Events

| Member | Description |
| --- | --- |
| `.value` | Get/set the current value. |
| `focus()` / `clear()` | Focus or clear the field. |
| `validate()` | Run validation now; returns `true` when valid. |
| `input` / `change` | Native events (composed). |
| `prefix-change` | Fired when a prefix dropdown changes. |
