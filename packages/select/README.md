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

## Basic Usage (Data-Driven)

Pass an array via the `.data` property, or a JSON string via the `data` attribute. Keys
default to `label` / `value`.

```html
<loomi-select
  name="country"
  label="Country"
  data='[{"label":"Ghana","value":"gh"},{"label":"Nigeria","value":"ng"},{"label":"Kenya","value":"ke"}]'
></loomi-select>
```

```js
document.querySelector("loomi-select").data = [
  { label: "Ghana", value: "gh" },
  { label: "Nigeria", value: "ng" },
];
```

### Custom Key Names

It's not always practical to rewrite your data to use `label`/`value` keys. Remap them
with `label-key` / `value-key`.

```html
<loomi-select
  label-key="country"
  value-key="code"
  data='[{"country":"Ghana","code":"gh"},{"country":"Nigeria","code":"ng"}]'
></loomi-select>
```

### Placeholder vs Label

`placeholder` shows hint text that disappears once something is selected. `label` is
always visible (floats above the trigger once a value is chosen). When both are set,
`label` takes precedence.

```html
<loomi-select placeholder="What is your nationality" data="..."></loomi-select>
<loomi-select label="Where are you from?" required data="..."></loomi-select>
```

### Selecting a Value by Default

```html
<loomi-select selected-value="gh" placeholder="What is your nationality" data="..."></loomi-select>
```

`selected-value` isn't just a one-time initial value — setting it again later (as an
attribute or the `.selectedValue` property) re-syncs the visible selection, which is
useful for swapping which record a select reflects (e.g. re-pointing one "assignee"
select at a different task) without re-creating the element.

```js
document.querySelector("loomi-select").selectedValue = "ng"; // updates immediately
```

### Disabled & Readonly

```html
<loomi-select disabled placeholder="What is your nationality" data="..."></loomi-select>
<loomi-select readonly placeholder="What is your nationality" data="..."></loomi-select>
```

## With Images

Set `image-key` to the key in your data that holds an image URL, to render a small image
beside each option — handy for "assign to" pickers.

```html
<loomi-select
  placeholder="Assign task to"
  label-key="name"
  value-key="id"
  image-key="picture"
  data='[{"id":1,"name":"Ada","picture":"/avatars/ada.jpg"}]'
></loomi-select>
```

## Searchable Select

```html
<loomi-select searchable label-key="country" value-key="code" data="..."></loomi-select>
```

## Empty Select

When there's no data yet (e.g. waiting on an API response), the select shows
`empty-placeholder`. If `searchable` is also set, the search box automatically hides
since there's nothing to search.

```html
<loomi-select searchable empty-placeholder="No countries available" data="[]"></loomi-select>
```

## Select Multiple Items

Set `multiple` to allow more than one selection. Unlike the single select, a multiple
select stays open after each pick — click outside it to close.

```html
<loomi-select
  multiple
  searchable
  max-selectable="3"
  label="Select a country"
  label-key="country"
  value-key="code"
  data="..."
></loomi-select>
```

Trying to select past `max-selectable` blocks the extra selection.

### Pre-Selecting Multiple Values

Use a comma-separated list for `selected-value`.

```html
<loomi-select multiple selected-value="gh,ng,ke" label-key="country" value-key="code" data="..."></loomi-select>
```

## Manual Options

When your data isn't coming from an array, use plain `<option>` children instead.

```html
<loomi-select name="gender" placeholder="Select gender">
  <option value="male">Male</option>
  <option value="female">Female</option>
  <option value="other">Prefer not to say</option>
</loomi-select>
```

## Reacting to Selection

```js
const el = document.querySelector("loomi-select");
el.addEventListener("select", (e) => {
  console.log(e.detail); // { value, label, values }
});
```

## Get the Selected Value on Form Submission

Every `<loomi-select>` participates in `ElementInternals` form association, so its value
submits like a native form control under whatever `name` you gave it — comma-joined for
multiple selects.

```js
new FormData(form).get("country"); // "gh"
new FormData(form).get("tags");     // "pop,jazz" (multiple)
```

## Sizes

```html
<loomi-select size="small" data="..."></loomi-select>
<loomi-select size="regular" data="..."></loomi-select>
<loomi-select size="medium" data="..."></loomi-select>
<loomi-select size="big" data="..."></loomi-select>
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

## Full Example

```html
<loomi-select
  name="country"
  label="What is your nationality"
  data='[{"label":"Ghana","value":"gh"},{"label":"Nigeria","value":"ng"}]'
  value-key="value"
  label-key="label"
  required
  selected-value="gh"
  searchable
  size="big"
></loomi-select>
```
