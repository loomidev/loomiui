import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiTextarea } from "../dist/index.js";

describe("loomi-textarea", () => {
  it("reflects its value into the shadow textarea", async () => {
    const el = await fixture<LoomiTextarea>(html`<loomi-textarea label="Notes"></loomi-textarea>`);
    el.value = "hello";
    await el.updateComplete;
    const textarea = el.shadowRoot!.querySelector(".loomi-textarea") as HTMLTextAreaElement;
    expect(textarea.value).to.equal("hello");
  });

  it("writes user input back to its value property", async () => {
    const el = await fixture<LoomiTextarea>(html`<loomi-textarea></loomi-textarea>`);
    const field = el.shadowRoot!.querySelector("textarea")!;
    field.value = "Hello there";
    field.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;
    expect(el.value).to.equal("Hello there");
  });

  it("submits its value through a native form", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form><loomi-textarea name="bio" value="Hi"></loomi-textarea></form>
    `);
    const el = form.querySelector("loomi-textarea") as LoomiTextarea;
    await el.updateComplete;
    expect(new FormData(form).get("bio")).to.equal("Hi");
  });

  it("honours the configured row count", async () => {
    const el = await fixture<LoomiTextarea>(html`<loomi-textarea rows="7"></loomi-textarea>`);
    expect(el.shadowRoot!.querySelector("textarea")!.rows).to.equal(7);
  });

  it("passes disabled and readonly through to the native control", async () => {
    const disabled = await fixture<LoomiTextarea>(html`<loomi-textarea disabled></loomi-textarea>`);
    expect(disabled.shadowRoot!.querySelector("textarea")!.disabled).to.be.true;

    const readonly = await fixture<LoomiTextarea>(html`<loomi-textarea readonly></loomi-textarea>`);
    expect(readonly.shadowRoot!.querySelector("textarea")!.readOnly).to.be.true;
  });
});
