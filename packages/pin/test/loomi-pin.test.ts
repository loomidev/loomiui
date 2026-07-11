import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../dist/loomi-pin.js";
import type { LoomiPin } from "../dist/index.js";

const inputs = (el: LoomiPin): HTMLInputElement[] =>
  Array.from(el.shadowRoot!.querySelectorAll<HTMLInputElement>("input"));

describe("loomi-pin", () => {
  it("splits odd digit counts with the larger group on the right", async () => {
    const el = await fixture<LoomiPin>(html`<loomi-pin total-digits="7" separator></loomi-pin>`);
    const children = Array.from(el.shadowRoot!.querySelector(".loomi-pin")!.children);
    const separatorIndex = children.findIndex((child) => child.classList.contains("loomi-separator"));

    expect(inputs(el)).to.have.lengthOf(7);
    expect(separatorIndex).to.equal(3);
    expect(children.slice(0, separatorIndex).filter((child) => child.classList.contains("loomi-box-wrap"))).to.have.lengthOf(3);
    expect(children.slice(separatorIndex + 1).filter((child) => child.classList.contains("loomi-box-wrap"))).to.have.lengthOf(4);
  });

  it("splits even digit counts equally around the separator", async () => {
    const el = await fixture<LoomiPin>(html`<loomi-pin total-digits="6" separator></loomi-pin>`);
    const children = Array.from(el.shadowRoot!.querySelector(".loomi-pin")!.children);
    const separatorIndex = children.findIndex((child) => child.classList.contains("loomi-separator"));

    expect(separatorIndex).to.equal(3);
    expect(children.slice(0, separatorIndex).filter((child) => child.classList.contains("loomi-box-wrap"))).to.have.lengthOf(3);
    expect(children.slice(separatorIndex + 1).filter((child) => child.classList.contains("loomi-box-wrap"))).to.have.lengthOf(3);
  });

  it("hides entered digits behind custom dot elements", async () => {
    const el = await fixture<LoomiPin>(html`<loomi-pin hide-digits></loomi-pin>`);
    const [first] = inputs(el);

    first.value = "7";
    first.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(first.value).to.equal("7");
    expect(first.classList.contains("is-masked")).to.equal(true);
    expect(el.shadowRoot!.querySelectorAll(".loomi-dot")).to.have.lengthOf(1);
  });

  it("keeps mask as an alias for hiding digits", async () => {
    const el = await fixture<LoomiPin>(html`<loomi-pin mask></loomi-pin>`);
    const [first] = inputs(el);

    first.value = "3";
    first.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(first.classList.contains("is-masked")).to.equal(true);
    expect(el.shadowRoot!.querySelectorAll(".loomi-dot")).to.have.lengthOf(1);
  });

  it("submits and verifies the joined PIN", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <loomi-pin name="otp"></loomi-pin>
      </form>
    `);
    const el = form.querySelector<LoomiPin>("loomi-pin")!;
    const verify = oneEvent(el, "loomi-verify") as Promise<CustomEvent<{ pin: string; code: string }>>;

    for (const [index, value] of ["1", "2", "3", "4"].entries()) {
      const box = inputs(el)[index];
      box.value = value;
      box.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
    }

    const event = await verify;
    expect(event.detail.pin).to.equal("1234");
    expect(event.detail.code).to.equal("1234");
    expect(el.pin).to.equal("1234");
    expect(el.code).to.equal("1234");
    expect(new FormData(form).get("otp")).to.equal("1234");
  });
});
