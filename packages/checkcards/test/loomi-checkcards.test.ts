import { html, fixture, expect, nextFrame } from "@open-wc/testing";
import "../dist/index.js";

describe("loomi-checkcards", () => {
  it("renders a card and toggles selection on click", async () => {
    const el = await fixture(html`<loomi-checkcard label="Basic" value="basic"></loomi-checkcard>`);
    const card = el.shadowRoot!.querySelector(".loomi-card") as HTMLElement;
    expect(card).to.exist;
    card.click();
    await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    expect(el.shadowRoot!.childElementCount).to.be.greaterThan(0);
  });

  it("selects the pre-selected card", async () => {
    const el = await fixture(html`
      <loomi-checkcards name="plan" selected-value="pro">
        <loomi-checkcard value="basic" title="Basic"></loomi-checkcard>
        <loomi-checkcard value="pro" title="Pro"></loomi-checkcard>
      </loomi-checkcards>
    `);
    await nextFrame();
    const [basic, pro] = Array.from(el.querySelectorAll("loomi-checkcard"));
    expect(basic.hasAttribute("selected")).to.be.false;
    expect(pro.hasAttribute("selected")).to.be.true;
  });

  it("submits the selected value through a native form", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <loomi-checkcards name="plan" selected-value="pro">
          <loomi-checkcard value="basic" title="Basic"></loomi-checkcard>
          <loomi-checkcard value="pro" title="Pro"></loomi-checkcard>
        </loomi-checkcards>
      </form>
    `);
    const group = form.querySelector("loomi-checkcards") as HTMLElement & {
      updateComplete: Promise<unknown>;
    };
    await group.updateComplete;
    await nextFrame();
    expect(new FormData(form).get("plan")).to.equal("pro");
  });

  it("keeps a single selection when max is 1", async () => {
    const el = await fixture(html`
      <loomi-checkcards name="plan" max="1">
        <loomi-checkcard value="basic" title="Basic"></loomi-checkcard>
        <loomi-checkcard value="pro" title="Pro"></loomi-checkcard>
      </loomi-checkcards>
    `);
    await nextFrame();
    const cards = Array.from(el.querySelectorAll("loomi-checkcard"));
    for (const card of cards) {
      (card.shadowRoot!.querySelector(".loomi-card") as HTMLElement).click();
      await nextFrame();
    }
    expect(cards.filter((c) => c.hasAttribute("selected"))).to.have.lengthOf(1);
  });

  it("allows several selections when max is raised", async () => {
    const el = await fixture(html`
      <loomi-checkcards name="plan" max="2">
        <loomi-checkcard value="basic" title="Basic"></loomi-checkcard>
        <loomi-checkcard value="pro" title="Pro"></loomi-checkcard>
      </loomi-checkcards>
    `);
    await nextFrame();
    const cards = Array.from(el.querySelectorAll("loomi-checkcard"));
    for (const card of cards) {
      (card.shadowRoot!.querySelector(".loomi-card") as HTMLElement).click();
      await nextFrame();
    }
    expect(cards.filter((c) => c.hasAttribute("selected"))).to.have.lengthOf(2);
  });
});
