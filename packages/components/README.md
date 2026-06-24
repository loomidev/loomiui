# @loomi/components

The whole [LoomiUI](../../README.md) component library in one install. This umbrella package
re-exports every individual `@loomi/*` component, so you can get everything with a single
dependency.

```bash
npm install @loomi/components lit
```

```js
// register every LoomiUI custom element
import "@loomi/components";

// …or just one component's entry
import "@loomi/components/button";
```

It also re-exports the theming utilities from `@loomi/theme`:

```js
import { LOOMI_COLORS, isLoomiColor, type LoomiColor } from "@loomi/components";
```

## Want a smaller footprint?

Install only the components you use — each is a standalone package:

```bash
npm install @loomi/button lit
```

See the [root README](../../README.md) for the full "install everything vs. install just
what you need" comparison and the theming model.

```js
// per-component entries are available too
import "@loomi/components/input";
import "@loomi/components/select";
```

## Included components

| Element | Package |
| --- | --- |
| `<loomi-button>` | [`@loomi/button`](../button) |
| `<loomi-input>` | [`@loomi/input`](../input) |
| `<loomi-textarea>` | [`@loomi/textarea`](../textarea) |
| `<loomi-checkbox>` | [`@loomi/checkbox`](../checkbox) |
| `<loomi-radio>` | [`@loomi/radio`](../radio) |
| `<loomi-toggle>` | [`@loomi/toggle`](../toggle) |
| `<loomi-number>` | [`@loomi/number`](../number) |
| `<loomi-select>` | [`@loomi/select`](../select) |
