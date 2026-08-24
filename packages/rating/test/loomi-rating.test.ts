import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiRating } from "../dist/index.js";

const stars = (el: LoomiRating): HTMLButtonElement[] =>
  Array.from(el.shadowRoot!.querySelectorAll('[role="radio"]'));

describe("loomi-rating", () => {
  it("renders five choices in a radiogroup", async () => {
    const el = await fixture<LoomiRating>(html`<loomi-rating></loomi-rating>`);
    expect(el.shadowRoot!.querySelector('[role="radiogroup"]')).to.exist;
    expect(stars(el)).to.have.lengthOf(5);
  });

  it("sets the rating to the chosen star", async () => {
    const el = await fixture<LoomiRating>(html`<loomi-rating></loomi-rating>`);
    stars(el)[3].click();
    await el.updateComplete;
    expect(el.rating).to.equal(4);
  });

  it("reports the chosen rating in the change detail", async () => {
    const el = await fixture<LoomiRating>(html`<loomi-rating></loomi-rating>`);
    setTimeout(() => stars(el)[1].click());
    const ev = (await oneEvent(el, "change")) as CustomEvent;
    expect(ev.detail.rating).to.equal(2);
  });

  it("fills exactly as many stars as the current rating", async () => {
    const el = await fixture<LoomiRating>(html`<loomi-rating rating="3"></loomi-rating>`);
    expect(el.shadowRoot!.querySelectorAll(".loomi-star.on")).to.have.lengthOf(3);
  });

  it("marks only the current rating as checked", async () => {
    const el = await fixture<LoomiRating>(html`<loomi-rating rating="3"></loomi-rating>`);
    const checked = stars(el).map((s) => s.getAttribute("aria-checked"));
    expect(checked).to.eql(["false", "false", "true", "false", "false"]);
  });

  it("ignores clicks and emits nothing when not clickable", async () => {
    const el = await fixture<LoomiRating>(
      html`<loomi-rating rating="2" .clickable=${false}></loomi-rating>`,
    );
    let emitted = false;
    el.addEventListener("change", () => (emitted = true));

    stars(el)[4].click();
    await el.updateComplete;

    expect(el.rating, "rating is unchanged").to.equal(2);
    expect(emitted, "no change event").to.be.false;
  });

  it("submits its rating through a native form", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form><loomi-rating name="score" rating="4"></loomi-rating></form>
    `);
    const el = form.querySelector("loomi-rating") as LoomiRating;
    await el.updateComplete;
    expect(new FormData(form).get("score")).to.equal("4");
  });

  it("restores its initial rating on form reset", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form><loomi-rating name="score" rating="2"></loomi-rating></form>
    `);
    const el = form.querySelector("loomi-rating") as LoomiRating;
    await el.updateComplete;

    stars(el)[4].click();
    await el.updateComplete;
    expect(el.rating).to.equal(5);

    form.reset();
    await el.updateComplete;
    expect(el.rating).to.equal(2);
  });

  it("names each choice for assistive technology", async () => {
    const el = await fixture<LoomiRating>(html`<loomi-rating></loomi-rating>`);
    for (const star of stars(el)) {
      expect(star.getAttribute("aria-label")).to.be.a("string").and.not.be.empty;
    }
  });
});
