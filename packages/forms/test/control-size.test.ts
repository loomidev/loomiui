import { html, fixture, expect } from "@open-wc/testing";
import "../../button/dist/loomi-button.js";
import "../../input/dist/loomi-input.js";
import "../../select/dist/loomi-select.js";
import "../../datepicker/dist/loomi-datepicker.js";
import "../../timepicker/dist/loomi-timepicker.js";

const sizes = ["tiny", "small", "regular", "medium", "big"] as const;
const selectors = [
  ["loomi-button", ".loomi-btn"],
  ["loomi-input", ".loomi-field"],
  ["loomi-select", ".loomi-trigger"],
  ["loomi-datepicker", ".loomi-field"],
  ["loomi-timepicker", ".loomi-field"],
] as const;

describe("form control sizes", () => {
  for (const size of sizes) {
    it(`renders matching ${size} control heights`, async () => {
      const wrapper = await fixture<HTMLElement>(html`
        <div style="display:flex;align-items:flex-start;gap:8px">
          <loomi-button size=${size}>Save</loomi-button>
          <loomi-input size=${size} placeholder="Name" no-clearing></loomi-input>
          <loomi-select size=${size} placeholder="Status" no-clearing></loomi-select>
          <loomi-datepicker size=${size} placeholder="Date"></loomi-datepicker>
          <loomi-timepicker size=${size} placeholder="Time"></loomi-timepicker>
        </div>
      `);

      await Promise.all(Array.from(wrapper.children).map((child) => (child as { updateComplete?: Promise<unknown> }).updateComplete));

      const heights = selectors.map(([tag, selector]) => {
        const el = wrapper.querySelector(tag)!;
        const target = el.shadowRoot!.querySelector(selector)!;
        return target.getBoundingClientRect().height;
      });
      const [expected, ...rest] = heights;

      for (const height of rest) {
        expect(Math.abs(height - expected)).to.be.lessThan(0.5);
      }
    });
  }
});
