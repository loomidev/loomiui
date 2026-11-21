import { html, fixture, expect } from "@open-wc/testing";
import "../../checkbox/dist/loomi-checkbox.js";
import "../../datepicker/dist/loomi-datepicker.js";
import "../../toggle/dist/loomi-toggle.js";

type Ctl = HTMLElement & { error: string; updateComplete: Promise<boolean> };

/** Validity through the owning form: not every control exposes checkValidity(). */
const formValid = (el: HTMLElement) => {
  const form = el.closest("form") ?? document.createElement("form");
  if (!el.closest("form")) {
    el.before(form);
    form.append(el);
  }
  return form.checkValidity();
};

describe("`error` on the remaining controls", () => {
  for (const [tag, tpl] of [
    [
      "loomi-checkbox",
      html`<loomi-checkbox name="terms" label="I agree" error="You must accept the terms"></loomi-checkbox>`,
    ],
    [
      "loomi-toggle",
      html`<loomi-toggle name="t" error="You must accept the terms"></loomi-toggle>`,
    ],
    [
      "loomi-datepicker",
      html`<loomi-datepicker name="d" error="You must accept the terms"></loomi-datepicker>`,
    ],
  ] as const) {
    it(`${tag} shows the message, wires aria and blocks submission`, async () => {
      const el = await fixture<Ctl>(tpl);
      await el.updateComplete;
      const msg = el.shadowRoot!.querySelector("#loomi-error")!;
      expect(msg.textContent).to.equal("You must accept the terms");
      expect(formValid(el)).to.equal(false);
      const described = el.shadowRoot!.querySelector('[aria-describedby~="loomi-error"]');
      expect(described).to.exist;
      expect(described!.getAttribute("aria-invalid")).to.equal("true");

      el.error = "";
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector("#loomi-error")).to.equal(null);
      expect(formValid(el)).to.equal(true);
    });
  }

  it("clears when the user changes the value", async () => {
    const el = await fixture<Ctl>(
      html`<loomi-checkbox name="terms" label="I agree" error="Accept the terms"></loomi-checkbox>`,
    );
    el.shadowRoot!.querySelector<HTMLInputElement>("input")!.click();
    await el.updateComplete;
    expect(el.error).to.equal("");
    expect(el.shadowRoot!.querySelector("#loomi-error")).to.equal(null);
  });
});
