// `import "@loomidev/icons/all";` — every Heroicon, eagerly, in the importing chunk.
//
// Opt-in for apps that would rather pay the whole set (~73 KB gzipped, both variants) up front than
// load icons one by one: every `icon="<name>"` then renders synchronously on first
// paint. Icons an app registered with registerLoomiIcon() still win.
import { provideLoomiIcons } from "./heroicons.js";
import outline from "./heroicons/outline/all.js";
import solid from "./heroicons/solid/all.js";

provideLoomiIcons(outline, "outline");
provideLoomiIcons(solid, "solid");
