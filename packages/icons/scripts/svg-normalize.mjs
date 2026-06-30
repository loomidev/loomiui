// Shared by the icon-set import scripts (see import-icon-set.mjs). Rewrites
// hardcoded ink colors to `currentColor` so disk-based icon sets (Iconsax,
// Untitled UI, …) theme the same way Heroicons already does: inherit the
// host's text color instead of always painting a fixed gray/black.
//
// `fill="none"` / `stroke="none"` are left alone — those mean "no paint",
// not "a color", and must stay that way for layered/cutout shapes to render
// correctly.
const COLOR_ATTR = /(fill|stroke)="([^"]*)"/g;

export function normalizeSvgColors(source) {
  return source.replace(COLOR_ATTR, (match, attr, value) => {
    if (value === "none" || value === "") return match;
    return `${attr}="currentColor"`;
  });
}
