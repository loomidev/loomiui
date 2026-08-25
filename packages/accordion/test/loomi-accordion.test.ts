import { html, fixture, expect, oneEvent, nextFrame } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiAccordion, LoomiAccordionItem } from "../dist/index.js";

const head = (item: LoomiAccordionItem): HTMLButtonElement =>
  item.shadowRoot!.querySelector(".loomi-head") as HTMLButtonElement;

const items = (el: LoomiAccordion): LoomiAccordionItem[] =>
  Array.from(el.querySelectorAll("loomi-accordion-item"));

const group = () =>
  fixture<LoomiAccordion>(html`
    <loomi-accordion>
      <loomi-accordion-item title="One">First</loomi-accordion-item>
      <loomi-accordion-item title="Two">Second</loomi-accordion-item>
      <loomi-accordion-item title="Three">Third</loomi-accordion-item>
    </loomi-accordion>
  `);

describe("loomi-accordion-item", () => {
  it("is closed by default and opens when its header is clicked", async () => {
    const el = await fixture<LoomiAccordionItem>(
      html`<loomi-accordion-item title="Section">Body</loomi-accordion-item>`,
    );
    expect(el.open).to.be.false;

    head(el).click();
    await el.updateComplete;
    expect(el.open).to.be.true;
  });

  it("closes again on a second click", async () => {
    const el = await fixture<LoomiAccordionItem>(
      html`<loomi-accordion-item title="Section" open>Body</loomi-accordion-item>`,
    );
    head(el).click();
    await el.updateComplete;
    expect(el.open).to.be.false;
  });

  it("fires loomi-accordion-toggle on each change", async () => {
    const el = await fixture<LoomiAccordionItem>(
      html`<loomi-accordion-item title="Section">Body</loomi-accordion-item>`,
    );
    setTimeout(() => head(el).click());
    await oneEvent(el, "loomi-accordion-toggle");
    expect(el.open).to.be.true;
  });

  it("keeps aria-expanded in step with the open state", async () => {
    const el = await fixture<LoomiAccordionItem>(
      html`<loomi-accordion-item title="Section">Body</loomi-accordion-item>`,
    );
    expect(head(el).getAttribute("aria-expanded")).to.equal("false");

    el.open = true;
    await el.updateComplete;
    expect(head(el).getAttribute("aria-expanded")).to.equal("true");
  });
});

describe("loomi-accordion", () => {
  it("closes the previously open item when another opens", async () => {
    const el = await group();
    await nextFrame();
    const [first, second] = items(el);

    head(first).click();
    await first.updateComplete;
    expect(first.open).to.be.true;

    head(second).click();
    await second.updateComplete;
    await el.updateComplete;

    expect(second.open, "the newly clicked item opens").to.be.true;
    expect(first.open, "the previous item closes").to.be.false;
  });

  it("keeps multiple items open when can-open-multiple is set", async () => {
    const el = await fixture<LoomiAccordion>(html`
      <loomi-accordion can-open-multiple>
        <loomi-accordion-item title="One">First</loomi-accordion-item>
        <loomi-accordion-item title="Two">Second</loomi-accordion-item>
      </loomi-accordion>
    `);
    await nextFrame();
    const [first, second] = items(el);

    head(first).click();
    await first.updateComplete;
    head(second).click();
    await second.updateComplete;
    await el.updateComplete;

    expect(first.open).to.be.true;
    expect(second.open).to.be.true;
  });

  it("marks its children standalone only when ungrouped", async () => {
    const grouped = await group();
    await nextFrame();
    expect(items(grouped).every((item) => item.standalone === false)).to.be.true;

    const loose = await fixture<LoomiAccordion>(html`
      <loomi-accordion .grouped=${false}>
        <loomi-accordion-item title="One">First</loomi-accordion-item>
      </loomi-accordion>
    `);
    await nextFrame();
    expect(items(loose)[0].standalone).to.be.true;
  });

  it("passes its color down to children that do not set their own", async () => {
    const el = await fixture<LoomiAccordion>(html`
      <loomi-accordion color="success">
        <loomi-accordion-item title="Inherits">First</loomi-accordion-item>
        <loomi-accordion-item title="Overrides" color="error">Second</loomi-accordion-item>
      </loomi-accordion>
    `);
    await nextFrame();
    const [inherits, overrides] = items(el);
    expect(inherits.color).to.equal("success");
    expect(overrides.color, "an explicit color wins").to.equal("error");
  });
});
