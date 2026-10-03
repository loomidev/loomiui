import { html, fixture, expect } from "@open-wc/testing";
import { recordFormEvents, inForm } from "../../../test/form-events.js";
import "../dist/loomi-filepicker.js";
import type { LoomiFilepicker } from "../dist/index.js";

// Native parity: see "Value and events contract" in packages/core/README.md.
describe("loomi-filepicker native parity", () => {
  async function choose(el: LoomiFilepicker, ...names: string[]) {
    const input = el.shadowRoot!.querySelector("input")!;
    const dt = new DataTransfer();
    for (const name of names) dt.items.add(new File(["x"], name, { type: "application/pdf" }));
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

  it("type is always 'file' and cannot be changed", async () => {
    const el = await fixture<LoomiFilepicker>(html`<loomi-filepicker></loomi-filepicker>`);
    expect(el.type).to.equal("file");
    expect(() => ((el as unknown as { type: string }).type = "text")).to.throw(TypeError);
    expect(el.type).to.equal("file");
  });

  it("files is a FileList holding the same files as selectedFiles", async () => {
    const el = await fixture<LoomiFilepicker>(
      html`<loomi-filepicker max-files="3"></loomi-filepicker>`,
    );
    expect(el.files).to.be.instanceOf(FileList);
    expect(el.files).to.have.length(0);

    await choose(el, "a.pdf", "b.pdf");
    const files = el.files;
    expect(files).to.be.instanceOf(FileList);
    expect(Array.from(files)).to.deep.equal(el.selectedFiles);
    expect(Array.from(files, (f) => f.name)).to.deep.equal(["a.pdf", "b.pdf"]);
    expect(el.files).to.equal(files, "same FileList until the selection changes");

    el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-remove")!.click();
    await el.updateComplete;
    expect(el.files).to.not.equal(files);
    expect(Array.from(el.files, (f) => f.name)).to.deep.equal(["b.pdf"]);

    el.value = "";
    expect(el.files).to.have.length(0);
  });

  it("removing a file fires input then change, with files already updated", async () => {
    const el = await fixture<LoomiFilepicker>(
      html`<loomi-filepicker max-files="3"></loomi-filepicker>`,
    );
    await choose(el, "a.pdf", "b.pdf");
    const log = recordFormEvents(el, () => Array.from(el.files, (f) => f.name).join(","));

    el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-remove")!.click();
    expect(log).to.deep.equal(["input:b.pdf", "change:b.pdf"]);
  });

  it("programmatic clear() fires nothing", async () => {
    const el = await fixture<LoomiFilepicker>(html`<loomi-filepicker></loomi-filepicker>`);
    await choose(el, "report.pdf");
    const log = recordFormEvents(el);

    el.clear();
    expect(el.files).to.have.length(0);
    expect(log).to.deep.equal([]);
  });
});
