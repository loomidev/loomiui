---
"@loomidev/react": minor
---

Add per-component entry points to `@loomidev/react`. Every wrapper now lives in its own
module and is exported under a subpath named after its tag:

```tsx
import { DataGrid } from "@loomidev/react/data-grid";
import { CommandPalette } from "@loomidev/react/command-palette";
```

Importing from the package root still works and is unchanged, but it registers all ~100
custom elements because the root barrel side-effect imports every component package. Apps
that use a handful of components can now import them individually and ship only those
elements.
