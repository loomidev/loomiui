import { html, fixture, expect, aTimeout } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiTabs } from "../dist/index.js";

describe("loomi-tabs overflow + links", () => {
  it("url headings render as anchors", async () => {
    const el = await fixture<LoomiTabs>(
      html`<loomi-tabs><loomi-tab label="All" url="/shop" active></loomi-tab><loomi-tab label="Rice" url="/shop?c=rice"></loomi-tab></loomi-tabs>`,
    );
    const links = el.shadowRoot!.querySelectorAll<HTMLAnchorElement>("a.loomi-head");
    expect(links.length).to.equal(2);
    expect(links[1].getAttribute("href")).to.equal("/shop?c=rice");
    expect(links[0].getAttribute("aria-current")).to.equal("page");
  });

  it('overflow="scroll" keeps one line and shows the end scroll button', async () => {
    const labels = Array.from({ length: 20 }, (_, i) => `Category ${i + 1}`);
    const el = await fixture<LoomiTabs>(
      html`<div style="width: 300px"><loomi-tabs overflow="scroll">${labels.map((l) => html`<loomi-tab label=${l}></loomi-tab>`)}</loomi-tabs></div>`,
    ).then((d) => (d as unknown as HTMLElement).querySelector("loomi-tabs") as LoomiTabs);
    await el.updateComplete;
    await aTimeout(100);
    const headings = el.shadowRoot!.querySelector<HTMLElement>(".loomi-headings")!;
    expect(headings.scrollWidth).to.be.greaterThan(headings.clientWidth);
    const heads = el.shadowRoot!.querySelectorAll<HTMLElement>(".loomi-head");
    expect(heads[0].offsetTop).to.equal(heads[19].offsetTop);
    const end = el.shadowRoot!.querySelector<HTMLElement>(".loomi-scroll-btn.end")!;
    expect(getComputedStyle(end).display).to.not.equal("none");
    const start = el.shadowRoot!.querySelector<HTMLElement>(".loomi-scroll-btn.start")!;
    expect(getComputedStyle(start).display).to.equal("none");
  });
});
