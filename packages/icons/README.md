# @loomi/icons

The shared icon registry used across loomi components (a Heroicons outline subset).

```bash
npm install @loomi/icons lit
```

```ts
import { getLoomiIcon, registerLoomiIcon, loomiIconNames } from "@loomi/icons";
import { svg } from "lit";

registerLoomiIcon("rocket", svg`<path d="…" />`);
loomiIconNames(); // -> ["arrow-path", "bell-alert", …]
```

Components that render icons (`<loomi-icon>`, `<loomi-button>`, `<loomi-input>`,
`<loomi-alert>`, `<loomi-tabs>`) all read from this one registry, so an icon you register
is available everywhere.

| Export | Description |
| --- | --- |
| `getLoomiIcon(name)` | Returns the icon's inner SVG (a Lit `SVGTemplateResult`) or `undefined`. |
| `registerLoomiIcon(name, svg)` | Register or override an icon. |
| `loomiIconNames()` | List all registered icon names. |
