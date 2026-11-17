import { html, fixture, expect } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";
import { inForm } from "../../../test/form-events.js";
import "../../number/dist/loomi-number.js";
import "../../input/dist/loomi-input.js";
import "../../textarea/dist/loomi-textarea.js";
import "../../select/dist/loomi-select.js";
import "../../checkbox/dist/loomi-checkbox.js";
import "../../toggle/dist/loomi-toggle.js";

/**
 * A `change` (or `input`) listener must see the new value in the form's data, so
 * submit-on-change handlers send what the user just picked.
 */
function recordFormData(el: HTMLElement, formValue: () => FormDataEntryValue | null) {
  const log: string[] = [];
  for (const type of ["input", "change"])
    el.addEventListener(type, () => log.push(`${type}:${String(formValue())}`));
  return log;
}

describe("form value is current when input/change fire", () => {
  it("loomi-number stepper", async () => {
    const el = await fixture<HTMLElement>(html`<loomi-number value="1"></loomi-number>`);
    const { formValue } = inForm(el, "qty");
    const log = recordFormData(el, formValue);
    el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".loomi-step")[1].click();
    expect(log).to.deep.equal(["input:2", "change:2"]);
  });

  it("loomi-input typing", async () => {
    const el = await fixture<HTMLElement>(html`<loomi-input></loomi-input>`);
    const { formValue } = inForm(el, "q");
    const log = recordFormData(el, formValue);
    el.shadowRoot!.querySelector("input")!.focus();
    await sendKeys({ type: "ab" });
    expect(log).to.deep.equal(["input:a", "input:ab"]);
  });

  it("loomi-textarea typing", async () => {
    const el = await fixture<HTMLElement>(html`<loomi-textarea></loomi-textarea>`);
    const { formValue } = inForm(el, "t");
    const log = recordFormData(el, formValue);
    el.shadowRoot!.querySelector("textarea")!.focus();
    await sendKeys({ type: "x" });
    expect(log).to.deep.equal(["input:x"]);
  });

  it("loomi-select pick", async () => {
    const el = await fixture<HTMLElement & { updateComplete: Promise<boolean> }>(
      html`<loomi-select data='[{"value":"a","label":"A"},{"value":"b","label":"B"}]'></loomi-select>`,
    );
    const { formValue } = inForm(el, "s");
    const log = recordFormData(el, formValue);
    el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-trigger")!.click();
    await el.updateComplete;
    el.shadowRoot!.querySelectorAll<HTMLElement>('[role="option"]')[1].click();
    expect(log.filter((e) => e.startsWith("change"))).to.deep.equal(["change:b"]);
  });

  it("loomi-checkbox and loomi-toggle", async () => {
    for (const tpl of [
      html`<loomi-checkbox value="yes"></loomi-checkbox>`,
      html`<loomi-toggle value="yes"></loomi-toggle>`,
    ]) {
      const el = await fixture<HTMLElement>(tpl);
      const { formValue } = inForm(el, "c");
      const log = recordFormData(el, formValue);
      el.shadowRoot!.querySelector<HTMLInputElement>("input")!.click();
      expect(log.filter((e) => e.startsWith("change"))).to.deep.equal(["change:yes"]);
    }
  });
});
