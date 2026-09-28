// Public entry point.
//
// - heroicons.ts owns the default Heroicons registry. Every icon is its own module,
//   loaded on first use (see scripts/build-heroicon-modules.mjs); nothing here
//   imports icon data statically. `@loomidev/icons/all` opts back into the eager set.
// - directive.ts is the `loomiIcon()` Lit directive components render through.
// - disk-icons.ts owns every *disk-based* set (Iconsax, Untitled UI, …). Those are
//   opt-in per source (`@loomidev/icons/iconsax`), so an app that never uses one
//   bundles none of it.
export * from "./heroicons.js";
export * from "./directive.js";
export * from "./disk-icons.js";
