import { html, fixture, expect } from "@open-wc/testing";
import { recordFormEvents, inForm } from "../../../test/form-events.js";
import "../dist/loomi-filepicker.js";
import type { LoomiFilepicker } from "../dist/index.js";

// Native parity: see "Value and events contract" in packages/core/README.md.
describe("loomi-filepicker native parity", () => {
  async function choose(el: LoomiFilepicker, name: string) {
    const input = el.shadowRoot!.querySelector("input")!;
    const dt = new DataTransfer();
    dt.items.add(new File(["x"], name, { type: "application/pdf" }));
    input.files = dt.files;
    input.dispatchEvent(new Event("change"));
    await new Promise((resolve) => setTimeout(resolve, 0));
    await el.updateComplete;
  }

  it("a user pick fires input then change, and value mirrors a native file input", async () => {
    const el = await fixture<LoomiFilepicker>(html`<loomi-filepicker></loomi-filepicker>`);
    const { formValue } = inForm(el, "doc");
    const log = recordFormEvents(el);

    await choose(el, "report.pdf");
    expect(log).to.deep.equal([
      "input:C:\\fakepath\\report.pdf",
      "change:C:\\fakepath\\report.pdf",
    ]);
    expect((formValue() as File).name).to.equal("report.pdf");
  });

  it("setting value to '' clears silently; any other value is ignored", async () => {
    const el = await fixture<LoomiFilepicker>(html`<loomi-filepicker></loomi-filepicker>`);
    const { formValue } = inForm(el, "doc");
    await choose(el, "report.pdf");
    const log = recordFormEvents(el);

    el.value = "C:\\fakepath\\other.pdf";
    expect(el.value).to.equal("C:\\fakepath\\report.pdf");

    el.value = "";
    await el.updateComplete;
    expect(el.value).to.equal("");
    expect(el.selectedFiles).to.have.length(0);
    expect(formValue()).to.be.null;
    expect(log).to.deep.equal([]);
  });
});
