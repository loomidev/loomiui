import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import type { LoomiFilterBuilder } from "../dist/index.js";
import "../dist/index.js";

describe("loomi-filter-builder", () => {
  it("renders shadow content", async () => {
    const el = await fixture(html`<loomi-filter-builder ></loomi-filter-builder>`);
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot!.childElementCount).to.be.greaterThan(0);
  });

  const FIELDS = [
    { key: "name", label: "Name", type: "text" as const },
    { key: "age", label: "Age", type: "number" as const },
  ];

  const build = async (): Promise<LoomiFilterBuilder> => {
    const el = await fixture<LoomiFilterBuilder>(
      html`<loomi-filter-builder></loomi-filter-builder>`,
    );
    el.fields = FIELDS;
    await el.updateComplete;
    return el;
  };

  const addButton = (el: LoomiFilterBuilder): HTMLButtonElement =>
    Array.from(el.shadowRoot!.querySelectorAll("button.command")).find(
      (b) => !b.classList.contains("apply"),
    ) as HTMLButtonElement;

  it("starts empty and says so", async () => {
    const el = await build();
    expect(el.rules).to.have.lengthOf(0);
    expect(el.shadowRoot!.querySelector(".empty")).to.exist;
  });

  it("adds a rule seeded from the first field", async () => {
    const el = await build();
    addButton(el).click();
    await el.updateComplete;

    expect(el.rules).to.have.lengthOf(1);
    expect(el.rules[0].field).to.equal("name");
    expect(el.shadowRoot!.querySelector(".empty"), "the empty note goes away").to.not.exist;
  });

  it("emits loomi-filter-change when a rule is added", async () => {
    const el = await build();
    setTimeout(() => addButton(el).click());
    const event = (await oneEvent(el, "loomi-filter-change")) as CustomEvent;
    expect(event.detail).to.be.an("object");
  });

  it("removes a rule again", async () => {
    const el = await build();
    addButton(el).click();
    await el.updateComplete;
    expect(el.rules).to.have.lengthOf(1);

    (el.shadowRoot!.querySelector(".remove") as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.rules).to.have.lengthOf(0);
  });

  it("does nothing when there are no fields to filter on", async () => {
    const el = await fixture<LoomiFilterBuilder>(
      html`<loomi-filter-builder></loomi-filter-builder>`,
    );
    await el.updateComplete;
    addButton(el)?.click();
    await el.updateComplete;
    expect(el.rules).to.have.lengthOf(0);
  });

  it("emits loomi-filter-apply from the apply button", async () => {
    const el = await build();
    addButton(el).click();
    await el.updateComplete;

    const apply = el.shadowRoot!.querySelector("button.command.apply") as HTMLButtonElement;
    setTimeout(() => apply.click());
    const event = (await oneEvent(el, "loomi-filter-apply")) as CustomEvent;
    expect(event.detail).to.be.an("object");
  });

  it("names every control for assistive technology", async () => {
    const el = await build();
    addButton(el).click();
    await el.updateComplete;
    for (const control of el.shadowRoot!.querySelectorAll("select, .remove")) {
      expect(control.getAttribute("aria-label"), control.className).to.be.a("string").and.not.be
        .empty;
    }
  });
});
