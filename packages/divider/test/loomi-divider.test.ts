import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-divider.js";
import type { LoomiDivider } from "../dist/index.js";

describe("loomi-divider", () => {
  it("renders a horizontal separator by default", async () => {
    const el = await fixture<LoomiDivider>(html`<loomi-divider></loomi-divider>`);
    const divider = el.shadowRoot!.querySelector<HTMLElement>(".loomi-divider")!;

    expect(divider.getAttribute("role")).to.equal("separator");
    expect(divider.getAttribute("aria-orientation")).to.equal("horizontal");
    expect(divider.classList.contains("horizontal")).to.be.true;
    expect(el.shadowRoot!.querySelectorAll(".loomi-line")).to.have.length(1);
  });

  it("supports vertical orientation", async () => {
    const el = await fixture<LoomiDivider>(
      html`<loomi-divider orientation="vertical"></loomi-divider>`,
    );
    const divider = el.shadowRoot!.querySelector<HTMLElement>(".loomi-divider")!;

    expect(divider.getAttribute("aria-orientation")).to.equal("vertical");
    expect(divider.classList.contains("vertical")).to.be.true;
  });

  it("splits the rule around label content", async () => {
    const el = await fixture<LoomiDivider>(html`<loomi-divider label="or"></loomi-divider>`);

    expect(el.shadowRoot!.querySelector(".loomi-content")?.textContent?.trim()).to.equal("or");
    expect(el.shadowRoot!.querySelectorAll(".loomi-line")).to.have.length(2);
  });

  it("uses slotted content in place of the label fallback", async () => {
    const el = await fixture<LoomiDivider>(
      html`<loomi-divider label="fallback"><span>custom</span></loomi-divider>`,
    );
    const slot = el.shadowRoot!.querySelector<HTMLSlotElement>("slot")!;

    expect(slot.assignedElements()).to.have.length(1);
    expect(slot.assignedElements()[0].textContent).to.equal("custom");
  });

  it("adds a generated loomi name class to the host", async () => {
    const el = await fixture<LoomiDivider>(html`<loomi-divider></loomi-divider>`);

    expect([...el.classList].some((cls) => /^loomi-divider-[a-z0-9]{5}$/.test(cls))).to.be.true;
  });
});
