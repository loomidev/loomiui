// Thin shim — the shared build lives at <repo-root>/scripts/lib/build-component-styles.mjs.
import { buildComponentStyles } from "../../../scripts/lib/build-component-styles.mjs";

buildComponentStyles(import.meta.url, {
  // Runtime-interpolated class names like `bg-${color}-600` are invisible to
  // Tailwind's scanner, so safelist every palette color for the variants,
  // props, and shades a button can apply at runtime.
  safelist: {
    variants: ["", "hover:", "focus-visible:"],
    props: ["bg", "text", "border", "ring"],
    shades: [50, 100, 200, 300, 400, 500, 600, 700, 800],
  },
  // Authored sources scanned for statically-used utilities.
  sources: ["./src/loomi-button.ts", "./src/icons.ts"],
  exportName: "buttonStyles",
  styleDoc:
    "Compiled, Shadow-DOM-scoped styles for <loomi-button>. Colors resolve via `var(--loomi-*)`.",
});
