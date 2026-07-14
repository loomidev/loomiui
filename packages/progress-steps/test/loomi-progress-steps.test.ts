import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiProgressSteps } from "../dist/index.js";

// progress-steps is a thin re-export of @loomidev/progress. These smoke tests verify the
// standalone package actually registers its custom elements and renders — the component
// logic itself is covered by @loomidev/progress's own suite.
describe("loomi-progress-steps (standalone package)", () => {
  it("registers both custom elements when the package is imported", () => {
    expect(customElements.get("loomi-progress-steps")).to.exist;
    expect(customElements.get("loomi-progress-step")).to.exist;
  });

  it("renders its steps into the shadow root", async () => {
    const el = await fixture<LoomiProgressSteps>(html`
      <loomi-progress-steps current="1">
        <loomi-progress-step label="One"></loomi-progress-step>
        <loomi-progress-step label="Two"></loomi-progress-step>
        <loomi-progress-step label="Three"></loomi-progress-step>
      </loomi-progress-steps>
    `);
    await el.updateComplete;

    expect(el.shadowRoot).to.exist;
    expect(el.querySelectorAll("loomi-progress-step")).to.have.lengthOf(3);
  });
});
