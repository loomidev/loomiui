# @loomidev/icons

The shared icon registry used across loomi components. It is generated from the
official Heroicons 24px outline and solid sets, then published as plain Lit SVG
templates — no React or Heroicons runtime dependency ships to consumers.

```bash
npm install @loomidev/icons lit
```

```ts
import { getLoomiIcon, registerLoomiIcon, loomiIconNames } from "@loomidev/icons";
import { svg } from "lit";

registerLoomiIcon("rocket", svg`<path d="…" />`);
getLoomiIcon("bell-alert", "solid");
loomiIconNames(); // -> ["arrow-path", "bell-alert", …]
```

Components that render icons (`<loomi-icon>`, `<loomi-button>`, `<loomi-input>`,
`<loomi-alert>`, `<loomi-tabs>`) all read from this one registry, so an icon you register
is available everywhere.

| Export | Description |
| --- | --- |
| `getLoomiIcon(name, variant)` | Returns the icon's inner SVG (a Lit `SVGTemplateResult`) or `undefined`. `variant` is `outline` or `solid`; default is `outline`. |
| `registerLoomiIcon(name, svg, variant)` | Register or override an icon for `outline` or `solid`; default is `outline`. |
| `loomiIconNames(variant)` | List all registered icon names for a variant; default is `outline`. |
