/**
 * Implicit form submission ("press Enter to submit") for form-associated
 * single-line text controls.
 *
 * A native `<input>` submits its form when Enter is pressed in it. A
 * form-associated custom element gets none of that for free: the inner
 * `<input>` sits in a shadow root, so it has no form of its own and Enter does
 * nothing. Each single-line control calls `implicitlySubmit()` from its inner
 * input's `keydown` handler to restore the native behaviour.
 *
 * The algorithm mirrors the HTML spec's "implicit submission":
 *
 * 1. If the form has a default button (the first submit button in tree order),
 *    activate it. A disabled default button means nothing happens.
 * 2. Otherwise submit the form, unless more than one of its fields blocks
 *    implicit submission (single-line text-like inputs, native or Loomi).
 *
 * `<loomi-button can-submit>` counts as a submit button when picking the
 * default: its real `<button>` lives in its shadow root, where the form can't
 * see it. Activating it submits via `form.requestSubmit()` — the same call its
 * own click makes — so validation runs and `submit` fires once, but without a
 * `submitter` (a custom element can't be one) and without a `click` event on
 * the `<loomi-button>`.
 */

/**
 * Marker a form-associated control class sets (`static blocksImplicitSubmission = true`)
 * to count as a field that blocks implicit submission, like a native text `<input>`.
 */
export interface LoomiImplicitSubmitControl {
  blocksImplicitSubmission?: boolean;
}

/** Native input types that block implicit submission (HTML spec). */
const BLOCKING_INPUT_TYPES = new Set([
  "text",
  "search",
  "url",
  "tel",
  "email",
  "password",
  "date",
  "month",
  "week",
  "time",
  "datetime-local",
  "number",
]);

/**
 * Whether `event` is a plain Enter that should trigger implicit submission:
 * not already handled, and not the Enter that commits an IME composition.
 */
export function isImplicitSubmitKey(event: KeyboardEvent): boolean {
  return (
    event.key === "Enter" &&
    !event.defaultPrevented &&
    !event.isComposing &&
    // Safari reports the composition-commit Enter with isComposing=false but keyCode 229.
    event.keyCode !== 229
  );
}

function blocksImplicitSubmission(el: Element): boolean {
  if (el instanceof HTMLInputElement) return BLOCKING_INPUT_TYPES.has(el.type);
  const ctor = el.constructor as LoomiImplicitSubmitControl;
  return ctor.blocksImplicitSubmission === true;
}

type SubmitCandidate =
  | HTMLButtonElement
  | HTMLInputElement
  | (HTMLElement & { canSubmit?: boolean; disabled?: boolean });

function isSubmitButton(el: Element): el is HTMLButtonElement | HTMLInputElement {
  return (
    (el instanceof HTMLButtonElement && el.type === "submit") ||
    (el instanceof HTMLInputElement && (el.type === "submit" || el.type === "image"))
  );
}

/** The form's default button: the first native submit button or `<loomi-button can-submit>` in tree order. */
export function defaultButtonOf(form: HTMLFormElement): SubmitCandidate | null {
  const candidates: SubmitCandidate[] = [];
  for (const el of Array.from(form.elements)) {
    if (isSubmitButton(el)) candidates.push(el);
  }
  for (const el of Array.from(
    form.querySelectorAll<HTMLElement & { canSubmit?: boolean }>("loomi-button"),
  )) {
    if (el.canSubmit || el.hasAttribute("can-submit")) candidates.push(el);
  }
  if (candidates.length === 0) return null;
  // Native submit buttons can live outside the form (form="…" attribute), so sort by
  // document position rather than trusting either list's order.
  candidates.sort((a, b) =>
    a === b ? 0 : a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
  );
  return candidates[0] ?? null;
}

/**
 * Handles an Enter keydown from a single-line control's inner input. Returns
 * `true` when it acted on the form (submitted it or activated its default
 * button), after calling `event.preventDefault()`.
 *
 * Callers stay responsible for the cases where Enter means something else —
 * picking a highlighted suggestion, committing a tag — and should call this
 * only once they've decided Enter is theirs to pass on.
 */
export function implicitlySubmit(
  event: KeyboardEvent,
  internals: ElementInternals,
  options: { disabled?: boolean } = {},
): boolean {
  if (options.disabled || !isImplicitSubmitKey(event)) return false;
  const form = internals.form;
  if (!form) return false;

  const defaultButton = defaultButtonOf(form);
  if (defaultButton) {
    event.preventDefault();
    if (defaultButton.disabled || defaultButton.matches(":disabled")) return true;
    if (isSubmitButton(defaultButton)) defaultButton.click();
    else form.requestSubmit();
    return true;
  }

  const blocking = Array.from(form.elements).filter(blocksImplicitSubmission);
  if (blocking.length > 1) return false;

  event.preventDefault();
  form.requestSubmit();
  return true;
}
