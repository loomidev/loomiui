# @loomidev/button-group

`<loomi-button-group>` and `<loomi-button-group-item>` — a horizontal row of
outline-style toggle buttons with shared sizing, palette, icons, and disabled states.

```bash
npm install @loomidev/button-group lit
```

```js
import "@loomidev/button-group";
```

## Basic Usage

Place `<loomi-button-group-item>` elements inside a group. One item can be marked
`selected` for the initial state.

```html
<loomi-button-group>
  <loomi-button-group-item label="Day" value="day" selected></loomi-button-group-item>
  <loomi-button-group-item label="Week" value="week"></loomi-button-group-item>
  <loomi-button-group-item label="Month" value="month"></loomi-button-group-item>
</loomi-button-group>
```

Listen for selection changes on the group:

```html
<loomi-button-group id="range">
  <loomi-button-group-item label="Day" value="day" selected></loomi-button-group-item>
  <loomi-button-group-item label="Week" value="week"></loomi-button-group-item>
</loomi-button-group>

<script type="module">
  document.querySelector("#range").addEventListener("button-group-change", (event) => {
    console.log(event.detail.value);
  });
</script>
```

## Icons

Use the same built-in icon names as `<loomi-button>`. Set `icon-right` to place the
icon after the label.

```html
<loomi-button-group>
  <loomi-button-group-item label="List" value="list" icon="list" selected></loomi-button-group-item>
  <loomi-button-group-item label="Grid" value="grid" icon="grid-2x2"></loomi-button-group-item>
</loomi-button-group>
```

Icon-only items work too — omit `label` and set `icon` only.

```html
<loomi-button-group color="primary">
  <loomi-button-group-item value="bold" icon="bold" selected></loomi-button-group-item>
  <loomi-button-group-item value="italic" icon="italic"></loomi-button-group-item>
</loomi-button-group>
```

## Sizes and Colors

`size` accepts `tiny`, `small`, `regular` (default), `medium`, and `big`.
`color` accepts any loomi palette name such as `primary`, `secondary`, `success`,
`error`, or `warning`.

```html
<loomi-button-group size="small" color="secondary">
  <loomi-button-group-item label="Left" value="left" selected></loomi-button-group-item>
  <loomi-button-group-item label="Right" value="right"></loomi-button-group-item>
</loomi-button-group>
```

## Disabled States

Disable a single item with `disabled` on `<loomi-button-group-item>`, or disable the
entire group with `disabled` on `<loomi-button-group>`.

```html
<loomi-button-group disabled>
  <loomi-button-group-item label="Day" value="day" selected></loomi-button-group-item>
  <loomi-button-group-item label="Week" value="week"></loomi-button-group-item>
</loomi-button-group>
```

## Events

| Event | Detail |
| --- | --- |
| `button-group-change` | `{ value, label, index }` when the selected item changes |
