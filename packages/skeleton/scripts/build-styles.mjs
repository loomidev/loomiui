// Thin shim — the shared build lives at <repo-root>/scripts/lib/build-component-styles.mjs.
import { buildComponentStyles } from "../../../scripts/lib/build-component-styles.mjs";

buildComponentStyles(import.meta.url);
