import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-countries.js";
import type { LoomiCountries } from "../dist/index.js";

describe("loomi-countries", () => {
  describe("names mode (default)", () => {
    it("defaults to mode=\"names\" and lists the full built-in country set", async () => {
      const el = await fixture<LoomiCountries>(html`<loomi-countries></loomi-countries>`);
      expect(el.mode).to.equal("names");
      const trigger = el.shadowRoot!.querySelector(".loomi-trigger") as HTMLButtonElement;
      trigger.click();
      await el.updateComplete;
      expect(el.shadowRoot!.querySelectorAll(".loomi-option").length).to.be.greaterThan(200);
    });

    it("opens on Enter and highlights the first option", async () => {
      const el = await fixture<LoomiCountries>(html`<loomi-countries></loomi-countries>`);
      const trigger = el.shadowRoot!.querySelector(".loomi-trigger") as HTMLButtonElement;
      trigger.focus();
      trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
      await el.updateComplete;

      expect(trigger.getAttribute("aria-expanded")).to.equal("true");
      expect(trigger.getAttribute("aria-activedescendant")).to.equal("loomi-country-0");
    });

    it("ArrowDown moves the highlight without choosing a value yet", async () => {
      const el = await fixture<LoomiCountries>(html`<loomi-countries></loomi-countries>`);
      const wrapper = el.shadowRoot!.querySelector(".loomi-countries") as HTMLElement;
      const trigger = el.shadowRoot!.querySelector(".loomi-trigger") as HTMLButtonElement;
      trigger.click();
      await el.updateComplete;

      wrapper.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
      await el.updateComplete;

      expect(trigger.getAttribute("aria-activedescendant")).to.equal("loomi-country-1");
      expect(el.shadowRoot!.querySelectorAll(".loomi-option.active")).to.have.lengthOf(1);
      expect(el.selection).to.equal("");
    });

    it("Enter chooses the highlighted option, closes the panel, and shows its flag", async () => {
      const el = await fixture<LoomiCountries>(html`<loomi-countries></loomi-countries>`);
      const wrapper = el.shadowRoot!.querySelector(".loomi-countries") as HTMLElement;
      const trigger = el.shadowRoot!.querySelector(".loomi-trigger") as HTMLButtonElement;
      trigger.click();
      await el.updateComplete;

      const secondOptionName = el.shadowRoot!.querySelectorAll(".loomi-option")[1].textContent!.trim();
      wrapper.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
      await el.updateComplete;
      wrapper.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
      await el.updateComplete;

      expect(trigger.getAttribute("aria-expanded")).to.equal("false");
      expect(trigger.textContent).to.include(secondOptionName);
      expect(trigger.querySelector(".loomi-flag")).to.exist;
      expect(el.selection).to.not.equal("");
    });

    it("Escape closes the panel without changing the selection", async () => {
      const el = await fixture<LoomiCountries>(html`<loomi-countries selection="GH"></loomi-countries>`);
      const wrapper = el.shadowRoot!.querySelector(".loomi-countries") as HTMLElement;
      const trigger = el.shadowRoot!.querySelector(".loomi-trigger") as HTMLButtonElement;
      trigger.click();
      await el.updateComplete;

      wrapper.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
      await el.updateComplete;

      expect(trigger.getAttribute("aria-expanded")).to.equal("false");
      expect(trigger.textContent).to.include("Ghana");
    });

    it("filters the list via the search box", async () => {
      const el = await fixture<LoomiCountries>(html`<loomi-countries></loomi-countries>`);
      const trigger = el.shadowRoot!.querySelector(".loomi-trigger") as HTMLButtonElement;
      trigger.click();
      await el.updateComplete;

      const search = el.shadowRoot!.querySelector(".loomi-search") as HTMLInputElement;
      search.value = "ghana";
      search.dispatchEvent(new Event("input"));
      await el.updateComplete;

      const options = el.shadowRoot!.querySelectorAll(".loomi-option");
      expect(options).to.have.lengthOf(1);
      expect(options[0].textContent).to.include("Ghana");
    });

    it("reserves width for the closed floating label before the select is opened", async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div style="display:inline-flex">
          <loomi-countries label="Where are you from?" required></loomi-countries>
        </div>
      `);
      const el = wrapper.querySelector<LoomiCountries>("loomi-countries")!;
      const trigger = el.shadowRoot!.querySelector(".loomi-trigger") as HTMLButtonElement;
      const label = el.shadowRoot!.querySelector(".loomi-label") as HTMLLabelElement;
      const sizer = el.shadowRoot!.querySelector(".loomi-value.sizer") as HTMLElement;

      expect(sizer.textContent).to.equal("Where are you from? *");
      expect(getComputedStyle(sizer).visibility).to.equal("hidden");
      expect(trigger.getBoundingClientRect().width).to.be.greaterThan(label.getBoundingClientRect().width);
    });
  });

  describe("selection property", () => {
    it("resolves by ISO alpha-2 code", async () => {
      const el = await fixture<LoomiCountries>(html`<loomi-countries selection="GH"></loomi-countries>`);
      expect(el.shadowRoot!.querySelector(".loomi-trigger")!.textContent).to.include("Ghana");
    });

    it("resolves by country name, case-insensitively", async () => {
      const el = await fixture<LoomiCountries>(html`<loomi-countries selection="ghana"></loomi-countries>`);
      expect(el.shadowRoot!.querySelector(".loomi-trigger")!.textContent).to.include("Ghana");
    });

    it("resolves by dial code", async () => {
      const el = await fixture<LoomiCountries>(html`<loomi-countries selection="+233"></loomi-countries>`);
      expect(el.shadowRoot!.querySelector(".loomi-trigger")!.textContent).to.include("Ghana");
    });

    it("leaves nothing selected when the value doesn't match any country", async () => {
      const el = await fixture<LoomiCountries>(html`<loomi-countries selection="not-a-country"></loomi-countries>`);
      expect(el.shadowRoot!.querySelector(".loomi-value")!.classList.contains("placeholder")).to.be.true;
    });
  });

  describe("phone mode", () => {
    it("shows a placeholder flag and no dial code until a country is chosen", async () => {
      const el = await fixture<LoomiCountries>(html`<loomi-countries mode="phone"></loomi-countries>`);
      expect(el.shadowRoot!.querySelector(".loomi-dial-code")).to.not.exist;
      expect(el.shadowRoot!.querySelector(".loomi-flag-trigger .loomi-flag")).to.exist;
    });

    it("shows the dial code once a country is selected", async () => {
      const el = await fixture<LoomiCountries>(html`<loomi-countries mode="phone" selection="GH"></loomi-countries>`);
      expect(el.shadowRoot!.querySelector(".loomi-dial-code")!.textContent).to.equal("+233");
    });

    it("typing a number updates .value and the form-submitted value includes the dial code", async () => {
      const form = await fixture<HTMLFormElement>(html`
        <form><loomi-countries mode="phone" selection="GH" name="phone"></loomi-countries></form>
      `);
      const el = form.querySelector<LoomiCountries>("loomi-countries")!;
      const input = el.shadowRoot!.querySelector(".loomi-phone-input") as HTMLInputElement;
      input.value = "241234567";
      input.dispatchEvent(new Event("input"));
      await el.updateComplete;

      expect(el.value).to.equal("241234567");
      expect(new FormData(form).get("phone")).to.equal("+233241234567");
    });

    it("strips non-digit characters as the user types", async () => {
      const el = await fixture<LoomiCountries>(html`<loomi-countries mode="phone" selection="GH"></loomi-countries>`);
      const input = el.shadowRoot!.querySelector(".loomi-phone-input") as HTMLInputElement;
      input.value = "24abc 12-34!567";
      input.dispatchEvent(new Event("input"));
      await el.updateComplete;

      expect(el.value).to.equal("241234567");
      expect(input.value).to.equal("241234567");
    });

    it("applies a mask as the user types, same syntax as <loomi-input>", async () => {
      const el = await fixture<LoomiCountries>(
        html`<loomi-countries mode="phone" mask="(999) 999-9999"></loomi-countries>`,
      );
      const input = el.shadowRoot!.querySelector(".loomi-phone-input") as HTMLInputElement;
      input.value = "2412345678";
      input.dispatchEvent(new Event("input"));
      await el.updateComplete;

      expect(el.value).to.equal("(241) 234-5678");
      expect(input.value).to.equal("(241) 234-5678");
    });

    it("doesn't render a dangling trailing literal for partial masked input", async () => {
      const el = await fixture<LoomiCountries>(
        html`<loomi-countries mode="phone" mask="(999) 999-9999"></loomi-countries>`,
      );
      const input = el.shadowRoot!.querySelector(".loomi-phone-input") as HTMLInputElement;
      input.value = "241";
      input.dispatchEvent(new Event("input"));
      await el.updateComplete;

      expect(el.value).to.equal("(241");
    });

    it("re-applies the mask to a value set programmatically", async () => {
      const el = await fixture<LoomiCountries>(
        html`<loomi-countries mode="phone" mask="999-999" value="241234"></loomi-countries>`,
      );
      expect(el.value).to.equal("241-234");
    });

    it("strips non-digit characters set programmatically via the .value property", async () => {
      const el = await fixture<LoomiCountries>(
        html`<loomi-countries mode="phone" selection="GH" value="call-me-maybe"></loomi-countries>`,
      );
      expect(el.value).to.equal("");
    });

    it("choosing a country from the panel updates the dial code", async () => {
      const el = await fixture<LoomiCountries>(html`<loomi-countries mode="phone"></loomi-countries>`);
      const flagTrigger = el.shadowRoot!.querySelector(".loomi-flag-trigger") as HTMLButtonElement;
      flagTrigger.click();
      await el.updateComplete;

      const search = el.shadowRoot!.querySelector(".loomi-search") as HTMLInputElement;
      search.value = "ghana";
      search.dispatchEvent(new Event("input"));
      await el.updateComplete;

      (el.shadowRoot!.querySelector(".loomi-option") as HTMLElement).click();
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector(".loomi-dial-code")!.textContent).to.equal("+233");
      expect(el.selection).to.equal("GH");
    });
  });

  describe("reset()", () => {
    it("clears the selection and phone value", async () => {
      const el = await fixture<LoomiCountries>(
        html`<loomi-countries mode="phone" selection="GH" value="241234567"></loomi-countries>`,
      );
      el.reset();
      await el.updateComplete;

      expect(el.selection).to.equal("");
      expect(el.value).to.equal("");
      expect(el.shadowRoot!.querySelector(".loomi-dial-code")).to.not.exist;
    });
  });
});
