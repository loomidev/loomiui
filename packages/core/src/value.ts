/**
 * Coerces whatever is assigned to a control's `value` to a string, the way a native
 * `<input>` does: `null` and `undefined` become `""`, anything else goes through
 * `String()`. Frameworks and app code routinely assign numbers (`el.value = 7`), and a
 * control that then calls string methods on its value would throw mid-update and stop
 * rendering.
 *
 * Use it in the setter of a coercing accessor:
 *
 * ```ts
 * private _value = "";
 * @property()
 * get value(): string { return this._value; }
 * set value(value: string) { this._value = toControlValue(value); }
 * ```
 */
export function toControlValue(value: unknown): string {
  return value == null ? "" : String(value);
}

/**
 * The form value for a control holding several values, matching a native
 * `<select multiple>`: one entry per value under `name` (so `name="tags[]"` arrives as an
 * array in PHP/Laravel, and repeated keys in everything else), nothing at all when empty.
 * A single-value control (`multiple` false) submits its one value as a plain string.
 *
 * Pass the result to `setFormValue(formValue, values.join(","))` so form-state restore
 * still gets a string.
 */
export function multiValueFormValue(
  name: string,
  values: readonly string[],
  multiple = true,
): FormData | string | null {
  if (!multiple) return values[0] ?? "";
  if (!values.length || !name) return null;
  const data = new FormData();
  for (const value of values) data.append(name, value);
  return data;
}
