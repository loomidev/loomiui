// Thin shim — the shared build lives at <repo-root>/scripts/lib/build-component-styles.mjs.
import { buildComponentStyles } from "../../../scripts/lib/build-component-styles.mjs";

buildComponentStyles(import.meta.url, {
  // Runtime-interpolated class names like `bg-${color}-600` are invisible to
  // Tailwind's scanner, so safelist exactly the ones computeClasses() can build —
  // keep in sync with treatmentClasses() and the focus ring in loomi-button.ts.
  // (A blanket bg/text/border/ring x shade x variant cross-product used to ship
  // ~750 unused rules, most of this package's size.)
  safelistClasses: [
    "bg-{color}-600",
    "hover:bg-{color}-700",
    "text-{color}-600",
    "focus-visible:ring-{color}-400",
  ],
  safelistColors: ["primary", "secondary", "info", "success", "error", "warning", "gray"],
  // Authored sources scanned for statically-used utilities.
  sources: ["./src/loomi-button.ts", "./src/icons.ts"],
  exportName: "buttonStyles",
  styleDoc:
    "Compiled, Shadow-DOM-scoped styles for <loomi-button>. Colors resolve via `var(--loomi-*)`.",
});
