import { css, html, nothing, type TemplateResult } from "lit";

// Its own module so a control that only needs the top label (otp) doesn't pull in the
// rest of field.ts's chrome.

/**
 * \`label-position="top"\`: a static label above the box, outside its border. Part of
 * \`fieldStyles\`; exported for controls (otp) that don't take the field chrome.
 */
export const fieldTopLabelStyles = css`
  .loomi-top-label {
    display: block;
    margin: 0 0 0.375rem;
    color: var(--loomi-text-muted);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25;
  }
  .loomi-top-label .loomi-req {
    color: var(--loomi-error-500, var(--_loomi-error-500-default));
    margin-inline-start: 0.15rem;
  }
`;

/** Id of the \`label-position="top"\` label, for \`aria-labelledby\`. */
export const TOP_LABEL_ID = "loomi-top-label";

/**
 * The \`label-position="top"\` label. \`forId\` points it at a labelable control (input,
 * button) in the same shadow root; other triggers reference {@link TOP_LABEL_ID} through
 * \`aria-labelledby\`.
 */
export function loomiTopLabel(label: string, required: boolean, forId?: string): TemplateResult {
  return html`<label id=${TOP_LABEL_ID} class="loomi-top-label" part="label" for=${forId ?? nothing}>${label}${required ? html`<span class="loomi-req">*</span>` : nothing}</label>`;
}
