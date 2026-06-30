import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-timezonepicker.js";
import type { LoomiTimezonepicker } from "../dist/index.js";

describe("loomi-timezonepicker", () => {
  it("lists the full IANA timezone set when opened", async () => {
    const el = await fixture<LoomiTimezonepicker>(html`<loomi-timezonepicker></loomi-timezonepicker>`);
    const trigger = el.shadowRoot!.querySelector(".loomi-trigger") as HTMLButtonElement;
    trigger.click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll(".loomi-option").length).to.be.greaterThan(300);
  });

  it("opens on Enter and highlights the first option", async () => {
    const el = await fixture<LoomiTimezonepicker>(html`<loomi-timezonepicker></loomi-timezonepicker>`);
    const trigger = el.shadowRoot!.querySelector(".loomi-trigger") as HTMLButtonElement;
    trigger.focus();
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    await el.updateComplete;

    expect(trigger.getAttribute("aria-expanded")).to.equal("true");
    expect(trigger.getAttribute("aria-activedescendant")).to.equal("loomi-timezone-0");
  });

  it("ArrowDown moves the highlight without choosing a value yet", async () => {
    const el = await fixture<LoomiTimezonepicker>(html`<loomi-timezonepicker></loomi-timezonepicker>`);
    const wrapper = el.shadowRoot!.querySelector(".loomi-timezonepicker") as HTMLElement;
    const trigger = el.shadowRoot!.querySelector(".loomi-trigger") as HTMLButtonElement;
    trigger.click();
    await el.updateComplete;

    wrapper.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    await el.updateComplete;

    expect(trigger.getAttribute("aria-activedescendant")).to.equal("loomi-timezone-1");
    expect(el.shadowRoot!.querySelectorAll(".loomi-option.active")).to.have.lengthOf(1);
    expect(el.selection).to.equal("");
  });

  it("Enter chooses the highlighted option and closes the panel", async () => {
    const el = await fixture<LoomiTimezonepicker>(html`<loomi-timezonepicker></loomi-timezonepicker>`);
    const wrapper = el.shadowRoot!.querySelector(".loomi-timezonepicker") as HTMLElement;
    const trigger = el.shadowRoot!.querySelector(".loomi-trigger") as HTMLButtonElement;
    trigger.click();
    await el.updateComplete;

    wrapper.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    await el.updateComplete;
    wrapper.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    await el.updateComplete;

    expect(trigger.getAttribute("aria-expanded")).to.equal("false");
    expect(el.selection).to.not.equal("");
    expect(trigger.textContent).to.include("UTC");
  });

  it("Escape closes the panel without changing the selection", async () => {
    const el = await fixture<LoomiTimezonepicker>(html`<loomi-timezonepicker selection="Africa/Accra"></loomi-timezonepicker>`);
    const wrapper = el.shadowRoot!.querySelector(".loomi-timezonepicker") as HTMLElement;
    const trigger = el.shadowRoot!.querySelector(".loomi-trigger") as HTMLButtonElement;
    trigger.click();
    await el.updateComplete;

    wrapper.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    await el.updateComplete;

    expect(trigger.getAttribute("aria-expanded")).to.equal("false");
    expect(trigger.textContent).to.include("Accra");
  });

  it("filters the list via the search box", async () => {
    const el = await fixture<LoomiTimezonepicker>(html`<loomi-timezonepicker></loomi-timezonepicker>`);
    const trigger = el.shadowRoot!.querySelector(".loomi-trigger") as HTMLButtonElement;
    trigger.click();
    await el.updateComplete;

    const search = el.shadowRoot!.querySelector(".loomi-search") as HTMLInputElement;
    search.value = "accra";
    search.dispatchEvent(new Event("input"));
    await el.updateComplete;

    const options = el.shadowRoot!.querySelectorAll(".loomi-option");
    expect(options).to.have.lengthOf(1);
    expect(options[0].textContent).to.include("Accra");
  });

  describe("selection property", () => {
    it("resolves by canonical IANA id", async () => {
      const el = await fixture<LoomiTimezonepicker>(html`<loomi-timezonepicker selection="Africa/Accra"></loomi-timezonepicker>`);
      expect(el.shadowRoot!.querySelector(".loomi-trigger")!.textContent).to.include("Accra");
      expect(el.shadowRoot!.querySelector(".loomi-trigger")!.textContent).to.include("UTC+00:00");
    });

    it("resolves by bare city name, case-insensitively", async () => {
      const el = await fixture<LoomiTimezonepicker>(html`<loomi-timezonepicker selection="accra"></loomi-timezonepicker>`);
      expect(el.shadowRoot!.querySelector(".loomi-trigger")!.textContent).to.include("Accra");
    });

    it("leaves nothing selected when the value doesn't match any zone", async () => {
      const el = await fixture<LoomiTimezonepicker>(html`<loomi-timezonepicker selection="not-a-zone"></loomi-timezonepicker>`);
      expect(el.shadowRoot!.querySelector(".loomi-value")!.classList.contains("placeholder")).to.be.true;
    });
  });

  describe("form association", () => {
    it("submits the IANA id under name", async () => {
      const form = await fixture<HTMLFormElement>(html`
        <form><loomi-timezonepicker name="tz" selection="Africa/Accra"></loomi-timezonepicker></form>
      `);
      expect(new FormData(form).get("tz")).to.equal("Africa/Accra");
    });
  });

  describe("use my timezone", () => {
    it("shows a pinned detect row and selects the browser's zone when clicked", async () => {
      const el = await fixture<LoomiTimezonepicker>(html`<loomi-timezonepicker></loomi-timezonepicker>`);
      const trigger = el.shadowRoot!.querySelector(".loomi-trigger") as HTMLButtonElement;
      trigger.click();
      await el.updateComplete;

      const detect = el.shadowRoot!.querySelector(".loomi-detect") as HTMLButtonElement;
      expect(detect).to.exist;
      detect.click();
      await el.updateComplete;

      expect(el.selection).to.equal(Intl.DateTimeFormat().resolvedOptions().timeZone);
    });
  });

  describe("reset()", () => {
    it("clears the selection", async () => {
      const el = await fixture<LoomiTimezonepicker>(html`<loomi-timezonepicker selection="Africa/Accra"></loomi-timezonepicker>`);
      el.reset();
      await el.updateComplete;

      expect(el.selection).to.equal("");
      expect(el.shadowRoot!.querySelector(".loomi-value")!.classList.contains("placeholder")).to.be.true;
    });
  });
});
