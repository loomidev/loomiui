import { html, fixture, expect } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";
import "../../input/dist/loomi-input.js";
import "../../password/dist/loomi-password.js";
import "../../textarea/dist/loomi-textarea.js";
import "../../select/dist/loomi-select.js";
import "../../number/dist/loomi-number.js";
import "../../filepicker/dist/loomi-filepicker.js";

type Control = HTMLElement & {
  error: string;
  invalid: boolean;
  checkValidity(): boolean;
  updateComplete: Promise<boolean>;
};

const errorEl = (el: Control) => el.shadowRoot!.querySelector<HTMLElement>("#loomi-error");

const cases = [
  [
    "loomi-input",
    html`<loomi-input name="phone" label="Phone" value="12" error="Enter a 10-digit phone number"></loomi-input>`,
    "input",
  ],
  [
    "loomi-password",
    html`<loomi-password name="pw" label="Password" error="Enter a 10-digit phone number"></loomi-password>`,
    "input",
  ],
  [
    "loomi-textarea",
    html`<loomi-textarea name="bio" label="Bio" error="Enter a 10-digit phone number"></loomi-textarea>`,
    "textarea",
  ],
  [
    "loomi-select",
    html`<loomi-select name="s" label="Pick" error="Enter a 10-digit phone number"></loomi-select>`,
    "button",
  ],
  [
    "loomi-number",
    html`<loomi-number name="n" label="Qty" error="Enter a 10-digit phone number"></loomi-number>`,
    "input",
  ],
  [
    "loomi-filepicker",
    html`<loomi-filepicker name="f" error="Enter a 10-digit phone number"></loomi-filepicker>`,
    "input",
  ],
] as const;

describe("external `error` attribute", () => {
  for (const [tag, tpl, controlSel] of cases) {
    it(`${tag} renders the error on load, wired to aria`, async () => {
      const el = await fixture<Control>(tpl);
      await el.updateComplete;
      expect(el.invalid).to.equal(true);
      expect(el.hasAttribute("invalid")).to.equal(true);
      expect(errorEl(el)?.textContent?.trim()).to.equal("Enter a 10-digit phone number");
      expect(el.checkValidity()).to.equal(false);
      const control = el.shadowRoot!.querySelector(`${controlSel}#loomi-control, ${controlSel}`)!;
      expect(control.getAttribute("aria-invalid")).to.equal("true");
      expect(control.getAttribute("aria-describedby")).to.equal("loomi-error");
    });

    it(`${tag} clears when error is emptied`, async () => {
      const el = await fixture<Control>(tpl);
      el.error = "";
      await el.updateComplete;
      expect(errorEl(el)).to.equal(null);
      expect(el.invalid).to.equal(false);
      expect(el.checkValidity()).to.equal(true);
    });
  }

  it("clears on user edit (input)", async () => {
    const el = await fixture<Control>(cases[0][1]);
    el.shadowRoot!.querySelector<HTMLInputElement>("input")!.focus();
    await sendKeys({ type: "3" });
    await el.updateComplete;
    expect(el.error).to.equal("");
    expect(errorEl(el)).to.equal(null);
    expect(el.invalid).to.equal(false);
  });

  it("clears on user edit (number)", async () => {
    const el = await fixture<Control>(cases[4][1]);
    el.shadowRoot!.querySelector<HTMLInputElement>("input")!.focus();
    await sendKeys({ type: "3" });
    await el.updateComplete;
    await el.updateComplete;
    expect(el.error).to.equal("");
    expect(errorEl(el)).to.equal(null);
  });
});
