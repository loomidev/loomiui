/**
 * The accessible name of a native form control, following the accname steps the
 * loomi fields rely on: `aria-labelledby`, then `aria-label`, then associated
 * `<label>` elements. Enough to assert how a field is named without depending on a
 * browser-specific accessibility-tree API.
 *
 * @param {HTMLInputElement | HTMLTextAreaElement} control
 * @returns {string}
 */
export function accessibleName(control) {
  const root = control.getRootNode();
  const labelledBy = control.getAttribute("aria-labelledby");
  if (labelledBy) {
    return labelledBy
      .split(/\s+/)
      .map((id) => root.getElementById(id)?.textContent?.trim() ?? "")
      .join(" ")
      .trim();
  }
  const ariaLabel = control.getAttribute("aria-label")?.trim();
  if (ariaLabel) return ariaLabel;
  return [...(control.labels ?? [])]
    .map((l) => l.textContent?.trim() ?? "")
    .join(" ")
    .trim();
}
