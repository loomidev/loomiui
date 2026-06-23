# @loomi/select

`<loomi-select>` — a themeable custom select. Supports a `data` array (or JSON string),
manual `<option>` children, search, multiple selection, images and a floating label.
**Form-associated**: submits the selected value(s) under `name` (comma-joined for multiple).

```bash
npm install @loomi/select lit
```

```js
import "@loomi/select/loomi-select.js";
```

## Data-driven

Pass an array via the `.data` property, or a JSON string via the `data` attribute. Keys
default to `label` / `value`; remap with `label-key` / `value-key` / `image-key`.

```html
<loomi-select
  name="country"
  label="Country"
  searchable
  selected-value="gh"
  data='[{"label":"Ghana","value":"gh"},{"label":"Nigeria","value":"ng"}]'
></loomi-select>
```

```js
document.querySelector("loomi-select").data = [
  { label: "Ghana", value: "gh" },
  { label: "Nigeria", value: "ng" },
];
```

## Manual options

```html
<loomi-select name="gender" placeholder="Select gender">
  <option value="male">Male</option>
  <option value="female">Female</option>
  <option value="other">Prefer not to say</option>
</loomi-select>
```

## Multiple & searchable

```html
<loomi-select multiple searchable max-selectable="3"
  selected-value="pop,jazz"
  data='[{"label":"Pop","value":"pop"},{"label":"Jazz","value":"jazz"},{"label":"Rock","value":"rock"}]'>
</loomi-select>
```

## Reacting to selection

```js
const el = document.querySelector("loomi-select");
el.addEventListener("select", (e) => {
  console.log(e.detail); // { value, label, values }
});
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `placeholder` | `Select One` | Trigger text when nothing is selected. |
| `label` | _(blank)_ | Floating label (takes precedence over placeholder). |
| `data` | `[]` | Options array — property (`.data`) or JSON-string attribute. |
| `label-key` / `value-key` | `label` / `value` | Keys to read from each row. |
| `image-key` | _(blank)_ | Key holding an image URL to show beside each option. |
| `selected-value` | _(blank)_ | Default value(s); comma-separated for multiple. |
| `searchable` | `false` | Show a search box. _(boolean)_ |
| `multiple` | `false` | Allow multiple selection. _(boolean)_ |
| `max-selectable` | `-1` | Max items when multiple (`-1` = no limit). |
| `disabled` | `false` | Disable the select. _(boolean)_ |
| `readonly` | `false` | Read-only (cannot open). _(boolean)_ |
| `required` | `false` | Marks the field required. _(boolean)_ |
| `size` | `medium` | `small` \| `regular` \| `medium` \| `big` |
| `empty-placeholder` | `No options available` | Text shown when there are no options. |
| `no-clearing` | `false` | Remove the default bottom margin. _(boolean)_ |

**Slot:** default (manual `<option>` children). **Parts:** `trigger`, `panel`.
**Methods:** `reset()`, `validate()`. **Events:** `select` (`detail: { value, label, values }`),
`change` (composed).

> Not (yet) ported from BladewindUI: country flags, empty-state integration and
> cross-select filtering.
