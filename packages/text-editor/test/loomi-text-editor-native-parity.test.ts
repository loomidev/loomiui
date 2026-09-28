import { html, fixture, expect } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";
import { recordFormEvents, inForm } from "../../../test/form-events.js";
import "../dist/loomi-text-editor.js";
import type { LoomiTextEditor } from "../dist/index.js";

// Native parity: see "Value and events contract" in packages/core/README.md.
describe("loomi-text-editor native parity", () => {
  const editor = (el: LoomiTextEditor) =>
    el.shadowRoot!.querySelector(".loomi-editor") as HTMLElement;

  it("setting value renders it, updates the form and fires nothing", async () => {
    const el = await fixture<LoomiTextEditor>(html`<loomi-text-editor></loomi-text-editor>`);
    const { formValue } = inForm(el, "body");
    const log = recordFormEvents(el);

    el.value = "<p>Hello</p>";
    await el.updateComplete;
    expect(editor(el).innerHTML).to.equal("<p>Hello</p>");
    expect(formValue()).to.equal("<p>Hello</p>");
    expect(log).to.deep.equal([]);
  });

  it("typing fires one input per keystroke, then change once on leaving", async () => {
    const el = await fixture<LoomiTextEditor>(html`<loomi-text-editor></loomi-text-editor>`);
    const { elsewhere } = inForm(el, "body");
    const log: string[] = [];
    el.addEventListener("input", () => log.push("input"));
    el.addEventListener("change", () => log.push("change"));

    el.focus();
    await sendKeys({ type: "hi" });
    elsewhere.focus();
    expect(log).to.deep.equal(["input", "input", "change"]);
    expect(editor(el).textContent).to.equal("hi");
    expect(el.value).to.contain("hi");
  });

  it("leaving without editing fires no change", async () => {
    const el = await fixture<LoomiTextEditor>(
      html`<loomi-text-editor value="<p>Hi</p>"></loomi-text-editor>`,
    );
    const { elsewhere } = inForm(el, "body");
    const log = recordFormEvents(el);
    el.focus();
    elsewhere.focus();
    expect(log).to.deep.equal([]);
  });
});
