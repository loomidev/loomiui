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
