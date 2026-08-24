import { html, fixture, expect, nextFrame } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiTimeline, LoomiTimelineItem } from "../dist/index.js";

const timeline = () =>
  fixture<LoomiTimeline>(html`
    <loomi-timeline>
      <loomi-timeline-item date="Mon" content="Opened"></loomi-timeline-item>
      <loomi-timeline-item date="Tue" content="Reviewed"></loomi-timeline-item>
    </loomi-timeline>
  `);

const items = (el: LoomiTimeline): LoomiTimelineItem[] =>
  Array.from(el.querySelectorAll("loomi-timeline-item"));

describe("loomi-timeline", () => {
  it("renders shadow content", async () => {
    const el = await timeline();
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot!.childElementCount).to.be.greaterThan(0);
  });

  it("renders each item's date and content", async () => {
    const el = await timeline();
    await nextFrame();
    const first = items(el)[0];
    expect(first.shadowRoot!.textContent).to.contain("Mon");
    expect(first.shadowRoot!.textContent).to.contain("Opened");
  });

  it("passes its placement down to items that do not set their own", async () => {
    const el = await fixture<LoomiTimeline>(html`
      <loomi-timeline placement="right">
        <loomi-timeline-item date="Mon" content="Opened"></loomi-timeline-item>
        <loomi-timeline-item date="Tue" content="Reviewed" placement="left"></loomi-timeline-item>
      </loomi-timeline>
    `);
    await nextFrame();
    const [inherits, explicit] = items(el);
    expect(inherits.placement).to.equal("right");
    expect(explicit.placement, "an explicit placement wins").to.equal("left");
  });

  it("passes completed down to its items", async () => {
    const el = await fixture<LoomiTimeline>(html`
      <loomi-timeline completed>
        <loomi-timeline-item date="Mon" content="Opened"></loomi-timeline-item>
      </loomi-timeline>
    `);
    await nextFrame();
    expect(items(el)[0].completed).to.be.true;
  });
});
