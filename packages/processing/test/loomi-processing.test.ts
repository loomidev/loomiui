import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiProcessing } from "../dist/index.js";

describe("loomi-processing", () => {
  it("renders shadow content", async () => {
    const el = await fixture<LoomiProcessing>(html`<loomi-processing></loomi-processing>`);
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot!.childElementCount).to.be.greaterThan(0);
  });

  it("renders its title and message", async () => {
    const el = await fixture<LoomiProcessing>(
      html`<loomi-processing title="Uploading" message="This may take a moment"></loomi-processing>`,
    );
    expect(el.shadowRoot!.querySelector(".loomi-title")!.textContent).to.contain("Uploading");
    expect(el.shadowRoot!.querySelector(".loomi-message")!.textContent).to.contain(
      "This may take a moment",
    );
  });

  it("spins while processing and stops once settled", async () => {
    const busy = await fixture<LoomiProcessing>(html`<loomi-processing></loomi-processing>`);
    expect(busy.shadowRoot!.querySelector(".loomi-spin"), "spinner while working").to.exist;

    busy.state = "success";
    await busy.updateComplete;
    expect(busy.shadowRoot!.querySelector(".loomi-spin"), "no spinner once done").to.not.exist;
  });

  it("shows an icon for each settled state", async () => {
    for (const state of ["success", "error"] as const) {
      const el = await fixture<LoomiProcessing>(html`<loomi-processing></loomi-processing>`);
      el.state = state;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector(".loomi-icon"), state).to.exist;
    }
  });
});
