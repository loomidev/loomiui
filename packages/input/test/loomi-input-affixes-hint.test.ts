import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-input.js";
import type { LoomiInput } from "../dist/index.js";

describe("loomi-input affixes and hints", () => {
  it("renders a prefix dropdown and emits prefix-change", async () => {
    const el = await fixture<LoomiInput>(
      html`<loomi-input prefix-options="http://,https://,ftp://" prefix-value="https://"></loomi-input>`,
    );
    const select = el.shadowRoot!.querySelector(".loomi-prefix select") as HTMLSelectElement;
    let detail: { value: string } | undefined;
    el.addEventListener("prefix-change", (event) => {
      detail = (event as CustomEvent<{ value: string }>).detail;
    });

    expect(select).to.exist;
    expect(select.value).to.equal("https://");

    select.value = "ftp://";
    select.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(el.prefixValue).to.equal("ftp://");
    expect(el.prefix).to.equal("ftp://");
    expect(detail).to.deep.equal({ value: "ftp://" });
  });

  it("renders a suffix dropdown and keeps the typed value separate", async () => {
    const el = await fixture<LoomiInput>(
      html`<loomi-input suffix-options="kg,g,tons" suffix-value="kg" value="12"></loomi-input>`,
    );
    const select = el.shadowRoot!.querySelector(".loomi-suffix select") as HTMLSelectElement;

    expect(select).to.exist;
    expect(select.value).to.equal("kg");
    expect(el.value).to.equal("12");

    select.value = "tons";
    select.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(el.suffixValue).to.equal("tons");
    expect(el.value).to.equal("12");
  });

  it("renders hint content from a matching data-hint element", async () => {
    const source = document.createElement("div");
    source.dataset.hint = "career";
    source.innerHTML = "<strong>Career path</strong>";
    document.body.append(source);

    const el = await fixture<LoomiInput>(html`<loomi-input hint="career.html"></loomi-input>`);

    const popover = el.shadowRoot!.querySelector("loomi-popover");
    expect(popover).to.exist;
    expect(popover!.textContent).to.include("Career path");

    source.remove();
  });
});
