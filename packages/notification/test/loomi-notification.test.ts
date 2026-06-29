import { html, fixture, expect } from "@open-wc/testing";
import type { TemplateResult } from "lit";
import "../dist/loomi-notification.js";
import type { LoomiNotification } from "../dist/index.js";

// `<loomi-notification>` relocates itself to `document.body` synchronously in
// `connectedCallback` (see the "moves to document.body" test below), which happens
// *during* `fixture()`'s own render call. Fixturing the tag directly would have
// `fixture()` hand back `wrapper.firstElementChild` — but by then the element has
// already moved itself out of that wrapper, so it would resolve to `null`. Fixturing a
// plain wrapper div and reading the relocated element back off `document.body` sidesteps
// that, the same way the dedicated relocation test (and `loomi-modal`'s tests) do.
async function mountNotification(template: TemplateResult): Promise<LoomiNotification> {
  await fixture(html`<div>${template}</div>`);
  return document.body.querySelector("loomi-notification") as LoomiNotification;
}

describe("loomi-notification", () => {
  afterEach(() => {
    document.querySelectorAll("loomi-notification").forEach((el) => el.remove());
  });

  it("renders notification icons through loomi-icon", async () => {
    const el = await mountNotification(html`<loomi-notification></loomi-notification>`);

    el.notify({ title: "Saved", message: "Your changes were saved.", type: "success", dismissIn: 0 });
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('.loomi-toast > loomi-icon[name="check-circle"]')).to.exist;
    expect(el.shadowRoot!.querySelector('.loomi-close loomi-icon[name="x-mark"]')).to.exist;
  });

  it("dismisses a notification from the close button", async () => {
    const el = await mountNotification(html`<loomi-notification></loomi-notification>`);

    el.notify({ title: "Saved", message: "Your changes were saved.", type: "success", dismissIn: 0 });
    await el.updateComplete;

    const close = el.shadowRoot!.querySelector(".loomi-close") as HTMLButtonElement;
    expect(close.type).to.equal("button");
    close.click();
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector(".loomi-toast")).to.not.exist;
  });

  it("renders above app chrome by default", async () => {
    const el = await mountNotification(html`<loomi-notification></loomi-notification>`);

    el.notify({ title: "Saved", message: "Your changes were saved.", dismissIn: 0 });
    await el.updateComplete;

    expect(getComputedStyle(el).zIndex).to.equal("2147480000");
  });

  it("positions the stack from the selected corner", async () => {
    const el = await mountNotification(html`<loomi-notification position="bottom-left"></loomi-notification>`);

    el.notify({ title: "Saved", message: "Your changes were saved.", dismissIn: 0 });
    await el.updateComplete;

    const stack = el.shadowRoot!.querySelector(".loomi-stack") as HTMLElement;
    const style = getComputedStyle(stack);
    expect(style.bottom).to.equal("16px");
    expect(style.left).to.equal("16px");

    el.position = "top-right";
    await el.updateComplete;

    const updatedStyle = getComputedStyle(stack);
    expect(updatedStyle.top).to.equal("16px");
    expect(updatedStyle.right).to.equal("16px");
  });

  it("centers the stack horizontally for top-center and bottom-center", async () => {
    // `left`/`translate` resolve to used pixel values in getComputedStyle (not the
    // authored "50%"/"-50% 0"), so centering is verified geometrically instead: the
    // stack's own horizontal midpoint should land on the viewport's horizontal midpoint.
    const isCentered = (stack: HTMLElement) => {
      const rect = stack.getBoundingClientRect();
      return Math.abs(rect.left + rect.width / 2 - window.innerWidth / 2) < 1;
    };

    const el = await mountNotification(html`<loomi-notification position="top-center"></loomi-notification>`);

    el.notify({ title: "Saved", message: "Your changes were saved.", dismissIn: 0 });
    await el.updateComplete;

    const stack = el.shadowRoot!.querySelector(".loomi-stack") as HTMLElement;
    expect(getComputedStyle(stack).top).to.equal("16px");
    expect(isCentered(stack)).to.be.true;

    el.position = "bottom-center";
    await el.updateComplete;

    expect(getComputedStyle(stack).bottom).to.equal("16px");
    expect(isCentered(stack)).to.be.true;
  });

  it("spans the full viewport width and anchors flush to the top edge", async () => {
    const el = await mountNotification(html`<loomi-notification position="top-left" full-width></loomi-notification>`);

    el.notify({ title: "Saved", message: "Your changes were saved.", dismissIn: 0 });
    await el.updateComplete;

    const stack = el.shadowRoot!.querySelector(".loomi-stack") as HTMLElement;
    const style = getComputedStyle(stack);
    expect(style.top).to.equal("0px");
    expect(style.left).to.equal("0px");
    expect(style.right).to.equal("0px");
    expect(stack.getBoundingClientRect().width).to.equal(window.innerWidth);
  });

  it("anchors flush to the bottom edge when full-width with a bottom position", async () => {
    const el = await mountNotification(html`<loomi-notification position="bottom-center" full-width></loomi-notification>`);

    el.notify({ title: "Saved", message: "Your changes were saved.", dismissIn: 0 });
    await el.updateComplete;

    const stack = el.shadowRoot!.querySelector(".loomi-stack") as HTMLElement;
    expect(getComputedStyle(stack).bottom).to.equal("0px");
  });

  it("treats full-width=\"false\" as off, matching other boolean attributes", async () => {
    const el = await mountNotification(html`<loomi-notification full-width="false"></loomi-notification>`);

    expect(el.fullWidth).to.be.false;
  });

  it("moves to document.body to escape nested stacking contexts", async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div style="position: relative; z-index: 1; transform: translateZ(0)">
        <loomi-notification></loomi-notification>
      </div>
    `);
    const el = document.body.querySelector("loomi-notification") as LoomiNotification;

    expect(el).to.exist;
    expect(el.parentElement).to.equal(document.body);
    expect(wrapper.querySelector("loomi-notification")).to.not.exist;
  });
});
