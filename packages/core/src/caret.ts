/**
 * Inserts `text` at the caret of a native text control, replacing any selected range,
 * then leaves the caret after it and fires the control's own `input` event, so the
 * owning component runs its usual edit path (masking, validation, its host `input`).
 *
 * Input types with no selection API (`email`, `number`) report a null caret and make
 * `setRangeText` throw, so the text is appended there instead.
 */
export function insertTextAtCaret(
  control: HTMLInputElement | HTMLTextAreaElement,
  text: string,
): void {
  const start = control.selectionStart;
  if (start === null) {
    control.value += text;
  } else {
    control.setRangeText(text, start, control.selectionEnd ?? start, "end");
  }
  control.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
}
