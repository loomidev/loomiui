# @loomi/tab

`<loomi-tabs>` builds a heading bar from its `<loomi-tab>` children and toggles the active panel. Three styles: `simple` (default), `system`, `pills`.

```bash
npm install @loomi/tab lit
```

```js
import "@loomi/tab/loomi-tab.js";
```

## Usage

```html
<loomi-tabs color="primary">
  <loomi-tab label="Overview" icon="information-circle" active>…</loomi-tab>
  <loomi-tab label="Activity" icon="bell-alert">…</loomi-tab>
</loomi-tabs>

<loomi-tabs tab-style="pills" color="purple">
  <loomi-tab label="One" active>…</loomi-tab>
  <loomi-tab label="Two">…</loomi-tab>
</loomi-tabs>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `color` | primary | Active-tab color (any loomi color). On `<loomi-tabs>`. |
| `tab-style` | simple | `simple` \| `system` \| `pills`. On `<loomi-tabs>`. |

### `<loomi-tab>`

| Attribute | Default | Description |
| --- | --- | --- |
| `label` | _(blank)_ | Heading text. |
| `icon` | _(blank)_ | Heading icon name. |
| `active` | `false` | Selected by default. _(boolean)_ |
| `disabled` | `false` | Disabled tab. _(boolean)_ |
| `url` | _(blank)_ | Navigate instead of switching. |

**Event:** `tab-change` (`detail: { label }`).
