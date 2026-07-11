import { html, fixture, expect } from "@open-wc/testing";
import { oneEvent } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiRating } from "../dist/index.js";

describe("loomi-rating", () => {
  it("renders the configured number of active stars", async () => {
    const el = await fixture<LoomiRating>(html`<loomi-rating rating="3"></loomi-rating>`);
    expect(el.shadowRoot!.querySelectorAll(".loomi-star.on").length).to.equal(3);
  });

  it("fires change with the clicked value", async () => {
    const el = await fixture<LoomiRating>(html`<loomi-rating rating="1"></loomi-rating>`);
    const stars = el.shadowRoot!.querySelectorAll(".loomi-star");
    setTimeout(() => (stars[3] as HTMLElement).click());
    await oneEvent(el, "change");
    expect(el.rating).to.equal(4);
  });
});
