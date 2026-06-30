// Public entry point. `heroicons.ts` is generated (see scripts/generate-heroicons.mjs,
// `pnpm generate`) and owns the inlined Heroicons registry. `disk-icons.ts` is
// hand-written and owns every *disk-based* icon set (Iconsax, Untitled UI, …) —
// real .svg files shipped under dist/svg/, fetched and cached on demand instead
// of being inlined as JS strings. Adding a future disk-based source means adding
// files under src/svg/ and, if needed, extending disk-icons.ts — this file stays
// untouched.
export * from "./heroicons.js";
export * from "./disk-icons.js";
