import { expect } from "@open-wc/testing";
import "../../input/dist/loomi-input.js";
import "../../number/dist/loomi-number.js";
import "../../password/dist/loomi-password.js";
import "../../textarea/dist/loomi-textarea.js";
import "../../select/dist/loomi-select.js";
import "../../autocomplete/dist/loomi-autocomplete.js";
import "../../tag-input/dist/loomi-tag-input.js";
import "../../datepicker/dist/loomi-datepicker.js";
import "../../timepicker/dist/loomi-timepicker.js";
import "../../timezonepicker/dist/loomi-timezonepicker.js";

const sizes = ["tiny", "small", "regular", "medium", "big"] as const;
const positions = ["default", "inside"] as const;

/** Each size's control height in rem, from core's `controlSizeStyles`. */
const REM = { tiny: 2, small: 2.25, regular: 2.5, medium: 2.75, big: 3 } as const;
const rootFontSize = (): number => parseFloat(getComputedStyle(document.documentElement).fontSize);

interface Control {
  tag: string;
  /** The bordered box whose top edge the label is measured against. */
  field: string;
  /** Attributes that put the control in its "has a value" state, so a default-position
   * label is floated into the border instead of sitting in the middle as a placeholder. */
  filled: string;
  /** Multi-line controls grow with their content, so only their label offset is compared. */
  fixedHeight: boolean;
  /** Tag chips are taller than the compact sizes' inner height, so a tag input with a
   * value grows; its empty height is still compared. */
  valueGrows?: boolean;
}

const controls: Control[] = [
  { tag: "loomi-input", field: ".loomi-field", filled: 'value="Ann"', fixedHeight: true },
  { tag: "loomi-number", field: ".loomi-field", filled: 'value="5"', fixedHeight: true },
  { tag: "loomi-password", field: ".loomi-field", filled: 'value="secret"', fixedHeight: true },
  { tag: "loomi-textarea", field: ".loomi-field", filled: 'value="Hi"', fixedHeight: false },
  {
    tag: "loomi-select",
    field: ".loomi-trigger",
    filled: `selected-value="a" data='[{"label":"A","value":"a"}]'`,
    fixedHeight: true,
  },
  {
    tag: "loomi-autocomplete",
    field: ".loomi-field",
    filled: `selected-value="a" data='[{"label":"A","value":"a"}]'`,
    fixedHeight: true,
  },
  {
    tag: "loomi-tag-input",
    field: ".loomi-field",
    filled: 'value="one"',
    fixedHeight: true,
    valueGrows: true,
  },
  {
    tag: "loomi-datepicker",
    field: ".loomi-field",
    filled: 'selected-value="2024-05-12"',
    fixedHeight: true,
  },
  {
    tag: "loomi-timepicker",
    field: ".loomi-field",
    filled: 'selected-value="10:30 AM"',
    fixedHeight: true,
  },
  {
    tag: "loomi-timezonepicker",
    field: ".loomi-trigger",
    filled: 'selection="Africa/Accra"',
    fixedHeight: true,
  },
];

const mount = async (markup: string): Promise<HTMLElement> => {
  const host = document.createElement("div");
  host.style.cssText = "width:20rem;padding:2rem 0";
  host.innerHTML = markup;
  document.body.append(host);
  const el = host.firstElementChild as HTMLElement & { updateComplete?: Promise<unknown> };
  await el.updateComplete;
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  return el;
};

const boxOf = (el: HTMLElement, selector: string): DOMRect => {
  const target = el.shadowRoot!.querySelector(selector);
  expect(target, `${el.localName} ${selector}`).to.exist;
  return target!.getBoundingClientRect();
};

/**
 * `default` draws the label notched into the field's top border; `inside` draws it
 * compactly just under the top edge. Every form control has to agree on both, otherwise a
 * form mixing them doesn't line up.
 */
describe("form control labels", () => {
  for (const position of positions) {
    it(`places the ${position} label at the same offset from the top border in every control`, async () => {
      const offsets: Array<[string, number]> = [];
      for (const control of controls) {
        const el = await mount(
          `<${control.tag} label="Label" label-position="${position}" ${control.filled}></${control.tag}>`,
        );
        const field = boxOf(el, control.field);
        const label = boxOf(el, ".loomi-label");
        // The notched label straddles the border, so compare its centre; the inside label
        // sits wholly below the edge, so compare its top.
        const offset =
          position === "default" ? label.top + label.height / 2 - field.top : label.top - field.top;
        offsets.push([control.tag, offset]);
        el.parentElement!.remove();
      }
      const [, expected] = offsets[0];
      const drifted = offsets.filter(([, offset]) => Math.abs(offset - expected) >= 1);
      expect(drifted, `${position} label offsets (loomi-input is ${expected})`).to.deep.equal([]);
    });
  }

  for (const size of sizes) {
    for (const position of positions) {
      it(`gives every control the same ${size} height with a ${position} label`, async () => {
        const heights: Array<[string, number]> = [];
        for (const control of controls.filter((c) => c.fixedHeight && !c.valueGrows)) {
          const el = await mount(
            `<${control.tag} size="${size}" label="Label" label-position="${position}" ${control.filled}></${control.tag}>`,
          );
          heights.push([control.tag, boxOf(el, control.field).height]);
          el.parentElement!.remove();
        }
        const [, expected] = heights[0];
        const drifted = heights.filter(([, height]) => Math.abs(height - expected) >= 1);
        expect(drifted, `${size}/${position} heights (loomi-input is ${expected})`).to.deep.equal(
          [],
        );
      });
    }
  }

  // `inside` only reserves a label line when there is a label to put in it, so an unlabelled
  // control is exactly its size's height whatever the label position.
  for (const size of sizes) {
    for (const position of positions) {
      it(`reserves no label space with no label (${size}, ${position})`, async () => {
        const heights: Array<[string, number]> = [];
        for (const control of controls.filter((c) => c.fixedHeight)) {
          const el = await mount(
            `<${control.tag} size="${size}" label-position="${position}" placeholder="Placeholder"></${control.tag}>`,
          );
          heights.push([control.tag, boxOf(el, control.field).height]);
          el.parentElement!.remove();
        }
        const expected = REM[size] * rootFontSize();
        const drifted = heights.filter(([, height]) => Math.abs(height - expected) >= 1);
        expect(drifted, `${size}/${position} heights, expected ${expected}`).to.deep.equal([]);
      });
    }
  }
});
