import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../dist/loomi-timer.js";
import type { LoomiTimer } from "../dist/index.js";

const segmentText = (el: LoomiTimer) =>
  Array.from(el.shadowRoot!.querySelectorAll(".loomi-time")).map((node) => node.textContent);

describe("loomi-timer", () => {
  it("renders a countdown from days/hours/mins by default", async () => {
    const el = await fixture<LoomiTimer>(
      html`<loomi-timer mins="1" hours="0" days="0"></loomi-timer>`,
    );

    expect(el.direction).to.equal("down");
    expect(segmentText(el)).to.deep.equal(["00", "00", "01", "00"]);
  });

  it("combines days, hours, and mins into a single countdown", async () => {
    const el = await fixture<LoomiTimer>(
      html`<loomi-timer days="1" hours="2" mins="3"></loomi-timer>`,
    );

    expect(segmentText(el)).to.deep.equal(["01", "02", "03", "00"]);
  });

  it("renders unbounded count-up mode from zero when days/hours/mins are omitted", async () => {
    const el = await fixture<LoomiTimer>(html`<loomi-timer direction="up"></loomi-timer>`);

    expect(segmentText(el)).to.deep.equal(["00", "00", "00", "00"]);
  });

  it("shows a label under each digit segment", async () => {
    const el = await fixture<LoomiTimer>(html`<loomi-timer></loomi-timer>`);
    const units = Array.from(el.shadowRoot!.querySelectorAll(".loomi-unit")).map(
      (node) => node.textContent,
    );

    expect(units).to.deep.equal(["Days", "Hours", "Mins", "Secs"]);
  });

  it("hides the background and border by default, and shows them with show-border", async () => {
    const plain = await fixture<LoomiTimer>(html`<loomi-timer></loomi-timer>`);
    const bordered = await fixture<LoomiTimer>(html`<loomi-timer show-border></loomi-timer>`);

    expect(plain.shadowRoot!.querySelector(".loomi-face")!.classList.contains("bordered")).to.equal(
      false,
    );
    expect(
      bordered.shadowRoot!.querySelector(".loomi-face")!.classList.contains("bordered"),
    ).to.equal(true);
  });

  it("renders optional controls", async () => {
    const el = await fixture<LoomiTimer>(html`<loomi-timer show-controls></loomi-timer>`);

    expect(el.shadowRoot!.querySelectorAll(".loomi-controls button")).to.have.length(2);
  });

  it("inherits font size from normal host styles and classes", async () => {
    const style = document.createElement("style");
    style.textContent = ".timer-large { font-size: 32px; }";
    document.head.append(style);

    const inline = await fixture<LoomiTimer>(
      html`<loomi-timer style="font-size: 28px"></loomi-timer>`,
    );
    const classed = await fixture<LoomiTimer>(
      html`<loomi-timer class="timer-large"></loomi-timer>`,
    );

    expect(getComputedStyle(inline.shadowRoot!.querySelector(".loomi-timer")!).fontSize).to.equal(
      "28px",
    );
    expect(getComputedStyle(classed.shadowRoot!.querySelector(".loomi-timer")!).fontSize).to.equal(
      "32px",
    );

    style.remove();
  });

  it("reflects running state and emits start events", async () => {
    const el = await fixture<LoomiTimer>(html`<loomi-timer></loomi-timer>`);
    const event = oneEvent(el, "loomi-timer-start");

    el.start();
    await event;

    expect(el.running).to.equal(true);
    expect(el.hasAttribute("running")).to.equal(true);
    el.pause();
  });
});
