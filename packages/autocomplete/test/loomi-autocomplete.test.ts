import { html, fixture, expect } from "@open-wc/testing";
import { oneEvent } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiAutocomplete } from "../dist/index.js";

const DATA = [
  { label: "Ghana", value: "gh" },
  { label: "Guinea", value: "gn" },
  { label: "Kenya", value: "ke" },
];

describe("loomi-autocomplete", () => {
  it("opens a filtered panel while typing", async () => {
    const el = await fixture<LoomiAutocomplete>(
      html`<loomi-autocomplete .data=${DATA}></loomi-autocomplete>`,
    );
    const input = el.shadowRoot!.querySelector("input")!;
    input.focus();
    input.value = "g";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;

    const options = el.shadowRoot!.querySelectorAll(".loomi-option");
    expect(options.length).to.equal(2);
  });

  it("fires loomi-select when an option is chosen", async () => {
    const el = await fixture<LoomiAutocomplete>(
      html`<loomi-autocomplete .data=${DATA}></loomi-autocomplete>`,
    );
    const input = el.shadowRoot!.querySelector("input")!;
    input.focus();
    input.value = "ken";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;

    const option = el.shadowRoot!.querySelector(".loomi-option") as HTMLElement;
    setTimeout(() => option.click());
    const ev = (await oneEvent(el, "loomi-select")) as CustomEvent;
    expect(ev.detail.value).to.equal("ke");
  });
});
