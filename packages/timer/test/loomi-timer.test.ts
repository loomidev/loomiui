import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../dist/loomi-timer.js";
import type { LoomiTimer } from "../dist/index.js";

describe("loomi-timer", () => {
  it("renders a countdown from duration by default", async () => {
    const el = await fixture<LoomiTimer>(html`<loomi-timer duration="90"></loomi-timer>`);

    expect(el.direction).to.equal("down");
    expect(el.shadowRoot!.querySelector(".loomi-time")!.textContent).to.equal("01:30");
  });

  it("renders unbounded count-up mode from zero when duration is omitted", async () => {
    const el = await fixture<LoomiTimer>(html`<loomi-timer direction="up"></loomi-timer>`);

    expect(el.shadowRoot!.querySelector(".loomi-time")!.textContent).to.equal("00:00");
  });

  it("supports seconds format", async () => {
    const el = await fixture<LoomiTimer>(
      html`<loomi-timer format="seconds" direction="down" duration="42"></loomi-timer>`,
    );

    expect(el.shadowRoot!.querySelector(".loomi-time")!.textContent).to.equal("42");
  });

  it("renders optional controls", async () => {
    const el = await fixture<LoomiTimer>(html`<loomi-timer show-controls></loomi-timer>`);

    expect(el.shadowRoot!.querySelectorAll(".loomi-controls button")).to.have.length(2);
  });

  it("inherits font size from normal host styles and classes", async () => {
    const style = document.createElement("style");
    style.textContent = ".timer-large { font-size: 32px; }";
    document.head.append(style);

    const inline = await fixture<LoomiTimer>(html`<loomi-timer style="font-size: 28px"></loomi-timer>`);
    const classed = await fixture<LoomiTimer>(html`<loomi-timer class="timer-large"></loomi-timer>`);

    expect(getComputedStyle(inline.shadowRoot!.querySelector(".loomi-timer")!).fontSize).to.equal("28px");
    expect(getComputedStyle(classed.shadowRoot!.querySelector(".loomi-timer")!).fontSize).to.equal("32px");

    style.remove();
  });

  it("reflects running state and emits start events", async () => {
    const el = await fixture<LoomiTimer>(html`<loomi-timer></loomi-timer>`);
    const event = oneEvent(el, "timer-start");

    el.start();
    await event;

    expect(el.running).to.equal(true);
    expect(el.hasAttribute("running")).to.equal(true);
    el.pause();
  });
});
