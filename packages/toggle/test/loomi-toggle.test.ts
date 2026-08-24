import { html, fixture, expect } from "@open-wc/testing";
import { oneEvent } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiToggle } from "../dist/index.js";

describe("loomi-toggle", () => {
  it("flips checked and fires change on click", async () => {
    const el = await fixture<LoomiToggle>(html`<loomi-toggle label="Notify"></loomi-toggle>`);
    const native = el.shadowRoot!.querySelector(".loomi-native") as HTMLInputElement;
    expect(el.checked).to.equal(false);

    setTimeout(() => native.click());
    await oneEvent(el, "change");
    expect(el.checked).to.equal(true);
  });

  it("does not toggle when disabled", async () => {
    const el = await fixture<LoomiToggle>(html`<loomi-toggle disabled></loomi-toggle>`);
    const native = el.shadowRoot!.querySelector(".loomi-native") as HTMLInputElement;
    native.click();
    await el.updateComplete;
    expect(el.checked).to.equal(false);
  });

  it("submits its value only while checked", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form><loomi-toggle name="alerts" value="on" checked></loomi-toggle></form>
    `);
    const el = form.querySelector("loomi-toggle") as LoomiToggle;
    await el.updateComplete;
    expect(new FormData(form).get("alerts")).to.equal("on");

    el.checked = false;
    await el.updateComplete;
    expect(new FormData(form).get("alerts")).to.be.null;
  });

  it("renders a label slot when a label is set", async () => {
    const el = await fixture<LoomiToggle>(
      html`<loomi-toggle label="Email notifications"></loomi-toggle>`,
    );
    expect(el.shadowRoot!.querySelector(".loomi-label")!.textContent).to.contain(
      "Email notifications",
    );
  });

  it("reflects checked so it can be styled from the light DOM", async () => {
    const el = await fixture<LoomiToggle>(html`<loomi-toggle></loomi-toggle>`);
    expect(el.hasAttribute("checked")).to.be.false;

    el.checked = true;
    await el.updateComplete;
    expect(el.hasAttribute("checked")).to.be.true;
  });
});
