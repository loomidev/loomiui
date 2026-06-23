import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-checkbox.js";
import type { LoomiCheckbox } from "../dist/index.js";

describe("loomi-checkbox", () => {
  it("submits its value inside a form when checked", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form><loomi-checkbox name="agree" value="yes" checked></loomi-checkbox></form>
    `);
    const el = form.querySelector("loomi-checkbox") as LoomiCheckbox;
    await el.updateComplete;
    expect(new FormData(form).get("agree")).to.equal("yes");
  });

  it("omits its value from form data when unchecked", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form><loomi-checkbox name="agree" value="yes"></loomi-checkbox></form>
    `);
    const el = form.querySelector("loomi-checkbox") as LoomiCheckbox;
    await el.updateComplete;
    expect(new FormData(form).get("agree")).to.be.null;
  });

  it("toggles checked when the native input is clicked", async () => {
    const el = await fixture<LoomiCheckbox>(html`<loomi-checkbox></loomi-checkbox>`);
    el.shadowRoot!.querySelector("input")!.click();
    await el.updateComplete;
    expect(el.checked).to.be.true;
  });

  it("does not toggle when disabled", async () => {
    const el = await fixture<LoomiCheckbox>(html`<loomi-checkbox disabled></loomi-checkbox>`);
    const input = el.shadowRoot!.querySelector("input")!;
    expect(input.disabled).to.be.true;
  });
});
