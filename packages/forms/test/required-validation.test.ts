import { expect } from "@open-wc/testing";
import "../../filepicker/dist/loomi-filepicker.js";
import "../../input/dist/loomi-input.js";
import "../../number/dist/loomi-number.js";
import "../../password/dist/loomi-password.js";
import "../../select/dist/loomi-select.js";
import "../../textarea/dist/loomi-textarea.js";
import "../../timepicker/dist/loomi-timepicker.js";

type Validatable = HTMLElement & {
  validate: () => boolean;
  checkValidity: () => boolean;
  updateComplete?: Promise<unknown>;
};

const REQUIRED_FIELDS: Array<{ tag: string; blurTarget: string }> = [
  { tag: "loomi-input", blurTarget: "input" },
  { tag: "loomi-select", blurTarget: ".loomi-trigger" },
  { tag: "loomi-filepicker", blurTarget: "input" },
  { tag: "loomi-timepicker", blurTarget: ".loomi-field" },
  { tag: "loomi-textarea", blurTarget: "textarea" },
  { tag: "loomi-number", blurTarget: "input" },
  { tag: "loomi-password", blurTarget: "input" },
] as const;

describe("required form validation", () => {
  for (const { tag, blurTarget } of REQUIRED_FIELDS) {
    it(`${tag} marks required empty fields invalid`, async () => {
      const el = document.createElement(tag) as Validatable;
      el.setAttribute("required", "");
      el.setAttribute("name", "field");
      document.body.append(el);
      await el.updateComplete;

      expect(el.hasAttribute("invalid")).to.equal(false);
      expect(el.checkValidity()).to.equal(false);
      await el.updateComplete;
      expect(el.hasAttribute("invalid")).to.equal(false);

      el.shadowRoot!.querySelector(blurTarget)!.dispatchEvent(new FocusEvent("blur"));
      await el.updateComplete;
      expect(el.hasAttribute("invalid")).to.equal(true);

      el.remove();
    });

    it(`${tag} can be explicitly validated`, async () => {
      const el = document.createElement(tag) as Validatable;
      el.setAttribute("required", "");
      el.setAttribute("name", "field");
      document.body.append(el);
      await el.updateComplete;

      expect(el.validate()).to.equal(false);
      await el.updateComplete;
      expect(el.hasAttribute("invalid")).to.equal(true);

      el.remove();
    });
  }

  it("participates in native form validation", async () => {
    const form = document.createElement("form");
    form.innerHTML = `
      <loomi-input required name="input"></loomi-input>
      <loomi-select required name="select"></loomi-select>
      <loomi-filepicker required name="file"></loomi-filepicker>
      <loomi-timepicker required name="time"></loomi-timepicker>
      <loomi-textarea required name="textarea"></loomi-textarea>
      <loomi-number required name="number"></loomi-number>
      <loomi-password required name="password"></loomi-password>
    `;
    document.body.append(form);
    await Promise.all(
      Array.from(form.children).map((child) => (child as Validatable).updateComplete),
    );

    expect(form.checkValidity()).to.equal(false);
    form.remove();
  });
});
