import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../dist/loomi-scroller.js";
import type { LoomiScroller } from "../dist/index.js";

describe("loomi-scroller", () => {
  it("uses sensible ticker defaults", async () => {
    const el = await fixture<LoomiScroller>(
      html`<loomi-scroller><span>Breaking news</span></loomi-scroller>`,
    );

    expect(el.speed).to.equal(50);
    expect(el.direction).to.equal("left");
    expect(el.pauseOnHover).to.be.true;
    expect(el.scrollCount).to.equal("infinite");
    expect(el.blurredEdges).to.be.true;
  });

  it("keeps every slotted item in the primary scrolling group", async () => {
    const el = await fixture<LoomiScroller>(html`
      <loomi-scroller>
        <span>One</span>
        <span>Two</span>
        <span>Three</span>
      </loomi-scroller>
    `);
    const slot = el.shadowRoot!.querySelector<HTMLSlotElement>("slot")!;

    expect(slot.assignedElements()).to.have.length(3);
    expect(slot.assignedElements().map((item) => item.textContent?.trim())).to.deep.equal([
      "One",
      "Two",
      "Three",
    ]);
  });

  it("supports all four physical directions", async () => {
    const el = await fixture<LoomiScroller>(
      html`<loomi-scroller direction="up"><span>Item</span></loomi-scroller>`,
    );
    const track = el.shadowRoot!.querySelector<HTMLElement>(".loomi-track")!;

    expect(track.classList.contains("vertical")).to.be.true;
    expect(track.classList.contains("direction-up")).to.be.true;

    el.direction = "right";
    await el.updateComplete;
    expect(track.classList.contains("horizontal")).to.be.true;
    expect(track.classList.contains("direction-right")).to.be.true;
  });

  it("accepts false-valued boolean attributes and a finite count", async () => {
    const el = await fixture<LoomiScroller>(html`
      <loomi-scroller pause-on-hover="false" blurred-edges="false" scroll-count="3">
        <span>Item</span>
      </loomi-scroller>
    `);

    expect(el.pauseOnHover).to.be.false;
    expect(el.blurredEdges).to.be.false;
    expect(el.scrollCount).to.equal(3);
  });

  it("emits the original item and index when an item is clicked", async () => {
    const el = await fixture<LoomiScroller>(html`
      <loomi-scroller>
        <button>First</button>
        <button>Second</button>
      </loomi-scroller>
    `);
    const item = el.children[1] as HTMLButtonElement;
    const eventPromise = oneEvent(el, "loomi-scroller-item-click");

    item.click();
    const event = (await eventPromise) as CustomEvent<{ item: HTMLElement; index: number }>;

    expect(event.detail.item).to.equal(item);
    expect(event.detail.index).to.equal(1);
  });

  it("maps clicks on seamless clones back to the original item", async () => {
    const el = await fixture<LoomiScroller>(html`
      <loomi-scroller>
        <button>First</button>
        <button>Second</button>
      </loomi-scroller>
    `);
    const original = el.children[0] as HTMLButtonElement;
    const clone = el.shadowRoot!.querySelector<HTMLElement>(
      '[data-loomi-scroller-clone-index="0"]',
    )!;
    const eventPromise = oneEvent(el, "loomi-scroller-item-click");

    clone.click();
    const event = (await eventPromise) as CustomEvent<{ item: HTMLElement; index: number }>;

    expect(event.detail.item).to.equal(original);
    expect(event.detail.index).to.equal(0);
  });

  it("uses RTL item ordering without changing an explicit direction", async () => {
    const el = await fixture<LoomiScroller>(
      html`<loomi-scroller dir="rtl" direction="left"><span>خبر</span></loomi-scroller>`,
    );
    const group = el.shadowRoot!.querySelector<HTMLElement>(".loomi-group.primary")!;
    const track = el.shadowRoot!.querySelector<HTMLElement>(".loomi-track")!;

    expect(getComputedStyle(group).direction).to.equal("rtl");
    expect(getComputedStyle(track).direction).to.equal("ltr");
    expect(track.classList.contains("direction-left")).to.be.true;
  });
});
