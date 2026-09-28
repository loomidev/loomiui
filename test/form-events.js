/* global document, FormData */
/**
 * Helpers for the native-parity tests every form control carries (see "Value and events
 * contract" in packages/core/README.md).
 *
 * `recordFormEvents` logs each `input`/`change` that reaches the host together with what
 * the control reported at that moment — `input:ab` means an `input` event arrived while
 * `value` read "ab". Native parity means exactly one entry per user edit, in order, with
 * the new value already in place, and no entries at all for programmatic sets.
 */
export function recordFormEvents(el, read = () => el.value) {
  const log = [];
  for (const type of ["input", "change"]) {
    el.addEventListener(type, () => log.push(`${type}:${read()}`));
  }
  return log;
}

/** Wraps `el` in a fresh `<form>` (plus an outside `<button>` to move focus to) and returns both. */
export function inForm(el, name = "field") {
  const form = document.createElement("form");
  el.setAttribute("name", name);
  el.parentNode?.insertBefore(form, el);
  form.append(el);
  const elsewhere = document.createElement("button");
  elsewhere.type = "button";
  elsewhere.textContent = "elsewhere";
  form.after(elsewhere);
  return { form, elsewhere, formValue: () => new FormData(form).get(name) };
}
