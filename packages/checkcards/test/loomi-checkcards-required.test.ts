import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-checkcards.js";
import type { LoomiCheckcards } from "../dist/index.js";

const clickCard = (el: LoomiCheckcards, value: string) =>
  (
    el
      .querySelector(`loomi-checkcard[value="${value}"]`)!
      .shadowRoot!.querySelector(".loomi-card") as HTMLElement
  ).click();

describe("loomi-checkcards required", () => {
  async function make(selected = "") {
    const form = await fixture<HTMLFormElement>(html`<form>
      <loomi-checkcards name="ship" required selected-value=${selected}>
        <loomi-checkcard value="std" title="Standard"></loomi-checkcard>
        <loomi-checkcard value="exp" title="Express"></loomi-checkcard>
      </loomi-checkcards>
    </form>`);
    const el = form.querySelector<LoomiCheckcards>("loomi-checkcards")!;
    await el.updateComplete;
    return { form, el };
  }

  it("blocks submission while nothing is selected", async () => {
    const { form, el } = await make();
    expect(form.checkValidity()).to.be.false;
    expect(el.validity.valueMissing).to.be.true;
    clickCard(el, "std");
    expect(form.checkValidity()).to.be.true;
  });

  it("can't click off the only selected card", async () => {
    const { el } = await make("std");
    clickCard(el, "std");
    expect(el.value).to.equal("std");
    clickCard(el, "exp");
    expect(el.value).to.equal("exp");
  });

  it("without required, a card still toggles off", async () => {
    const el = await fixture<LoomiCheckcards>(html`<loomi-checkcards selected-value="std">
      <loomi-checkcard value="std" title="Standard"></loomi-checkcard>
    </loomi-checkcards>`);
    await el.updateComplete;
    clickCard(el, "std");
    expect(el.value).to.equal("");
  });
});
