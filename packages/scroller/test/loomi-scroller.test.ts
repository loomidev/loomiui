import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../dist/loomi-scroller.js";
import type { LoomiScroller } from "../dist/index.js";

const settleClones = async (el: LoomiScroller): Promise<void> => {
  await el.updateComplete;
  await new Promise<void>((resolve) => window.setTimeout(resolve));
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
};

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

  it("emits completion details after a finite scroll count", async () => {
    const el = await fixture<LoomiScroller>(html`
      <loomi-scroller direction="down" scroll-count="2">
        <span>First</span>
        <span>Second</span>
      </loomi-scroller>
    `);
    const track = el.shadowRoot!.querySelector<HTMLElement>(".loomi-track")!;
    let completionCount = 0;
    el.addEventListener("loomi-scroll-complete", () => completionCount++);

    el.firstElementChild!.dispatchEvent(
      new AnimationEvent("animationend", {
        animationName: "item-animation",
        bubbles: true,
        composed: true,
      }),
    );
    expect(completionCount).to.equal(0);

    const eventPromise = oneEvent(el, "loomi-scroll-complete");

    track.dispatchEvent(
      new AnimationEvent("animationend", {
        animationName: "loomi-scroller-down",
        bubbles: true,
      }),
    );
    const event = (await eventPromise) as CustomEvent<{ count: number; direction: string }>;

    expect(event.detail).to.deep.equal({ count: 2, direction: "down" });
  });

  it("resynchronizes seamless clones when items are added or removed", async () => {
    const el = await fixture<LoomiScroller>(html`
      <loomi-scroller><span>First</span></loomi-scroller>
    `);
    const second = document.createElement("span");
    second.textContent = "Second";

    el.append(second);
    await settleClones(el);

    const addedClone = el.shadowRoot!.querySelector<HTMLElement>(
      '[data-loomi-scroller-clone-index="1"]',
    );
    expect(addedClone?.textContent).to.equal("Second");

    el.firstElementChild?.remove();
    await settleClones(el);

    const remainingClone = el.shadowRoot!.querySelector<HTMLElement>(
      '[data-loomi-scroller-clone-index="0"]',
    );
    expect(remainingClone?.textContent).to.equal("Second");
    expect(el.shadowRoot!.querySelector('[data-loomi-scroller-clone-index="1"]')).to.equal(null);
  });

  it("keeps externally styled vertical clones geometrically identical to their originals", async () => {
    const fixtureRoot = await fixture<HTMLDivElement>(html`
      <div>
        <style>
          .styled-testimonial {
            margin: 11px 0 17px;
            border: 3px solid transparent;
            padding: 13px;
            font-size: 19px;
            line-height: 27px;
          }
        </style>
        <loomi-scroller direction="up">
          <blockquote class="styled-testimonial">A styled testimonial</blockquote>
        </loomi-scroller>
      </div>
    `);
    const el = fixtureRoot.querySelector<LoomiScroller>("loomi-scroller")!;
    await settleClones(el);
    const original = el.firstElementChild as HTMLElement;
    const clone = el.shadowRoot!.querySelector<HTMLElement>(
      '[data-loomi-scroller-clone-index="0"]',
    )!;
    const originalStyle = getComputedStyle(original);
    const cloneStyle = getComputedStyle(clone);
    const primaryGroup = el.shadowRoot!.querySelector<HTMLElement>(".loomi-group.primary")!;
    const sequenceOffset = clone.getBoundingClientRect().top - original.getBoundingClientRect().top;

    expect(cloneStyle.marginTop).to.equal(originalStyle.marginTop);
    expect(cloneStyle.marginBottom).to.equal(originalStyle.marginBottom);
    expect(cloneStyle.paddingTop).to.equal(originalStyle.paddingTop);
    expect(cloneStyle.lineHeight).to.equal(originalStyle.lineHeight);
    expect(sequenceOffset).to.be.closeTo(primaryGroup.getBoundingClientRect().height, 0.5);
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
