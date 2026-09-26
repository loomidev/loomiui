import { expect } from "@open-wc/testing";
import "../../button/dist/loomi-button.js";
import "../../input/dist/loomi-input.js";
import "../../number/dist/loomi-number.js";
import "../../password/dist/loomi-password.js";
import "../../select/dist/loomi-select.js";
import "../../datepicker/dist/loomi-datepicker.js";
import "../../timepicker/dist/loomi-timepicker.js";

const sizes = ["tiny", "small", "regular", "medium", "big"] as const;
const selectors = [
  ["loomi-button", ".loomi-btn"],
  ["loomi-input", ".loomi-field"],
  ["loomi-number", ".loomi-field"],
  ["loomi-password", ".loomi-field"],
  ["loomi-select", ".loomi-trigger"],
  ["loomi-datepicker", ".loomi-field"],
  ["loomi-timepicker", ".loomi-field"],
] as const;

/**
 * Equal size names must give equal control heights, so a `regular` button lines up with
 * a `regular` input. `undefined` checks the defaults: every control defaults to `regular`,
 * so controls with no `size` attribute at all must line up too.
 */
describe("form control sizes", () => {
  for (const size of [undefined, ...sizes]) {
    it(`renders matching ${size ?? "default"} control heights`, async () => {
      const attr = size ? `size="${size}"` : "";
      const wrapper = document.createElement("div");
      wrapper.style.cssText = "display:flex;align-items:flex-start;gap:8px";
      wrapper.innerHTML = `
        <loomi-button ${attr}>Save</loomi-button>
        <loomi-input ${attr} placeholder="Name" no-clearing></loomi-input>
        <loomi-number ${attr} no-clearing></loomi-number>
        <loomi-password ${attr} placeholder="Password" no-clearing></loomi-password>
        <loomi-select ${attr} placeholder="Status" no-clearing></loomi-select>
        <loomi-datepicker ${attr} placeholder="Date"></loomi-datepicker>
        <loomi-timepicker ${attr} placeholder="Time"></loomi-timepicker>
      `;
      document.body.append(wrapper);

      await Promise.all(
        Array.from(wrapper.children).map(
          (child) => (child as { updateComplete?: Promise<unknown> }).updateComplete,
        ),
      );

      const heights = selectors.map(([tag, selector]) => {
        const el = wrapper.querySelector(tag)!;
        const target = el.shadowRoot!.querySelector(selector)!;
        return target.getBoundingClientRect().height;
      });
      const [expected, ...rest] = heights;

      if (!size) {
        const regular = parseFloat(getComputedStyle(document.documentElement).fontSize) * 2.5;
        expect(Math.abs(expected - regular), "default is the 2.5rem regular height").to.be.lessThan(
          0.5,
        );
      }
      rest.forEach((height, index) => {
        const tag = selectors[index + 1][0];
        expect(Math.abs(height - expected), `${tag} vs loomi-button`).to.be.lessThan(0.5);
      });
      wrapper.remove();
    });
  }
});
