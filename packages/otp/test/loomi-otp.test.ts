import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../dist/loomi-otp.js";
import type { LoomiOtp } from "../dist/index.js";

const inputs = (el: LoomiOtp): HTMLInputElement[] =>
  Array.from(el.shadowRoot!.querySelectorAll<HTMLInputElement>("input"));

describe("loomi-otp", () => {
  it("splits odd digit counts with the larger group on the right", async () => {
    const el = await fixture<LoomiOtp>(html`<loomi-otp total-digits="7" separator></loomi-otp>`);
    const children = Array.from(el.shadowRoot!.querySelector(".loomi-otp")!.children);
    const separatorIndex = children.findIndex((child) =>
      child.classList.contains("loomi-separator"),
    );

    expect(inputs(el)).to.have.lengthOf(7);
    expect(separatorIndex).to.equal(3);
    expect(
      children
        .slice(0, separatorIndex)
        .filter((child) => child.classList.contains("loomi-box-wrap")),
    ).to.have.lengthOf(3);
    expect(
      children
        .slice(separatorIndex + 1)
        .filter((child) => child.classList.contains("loomi-box-wrap")),
    ).to.have.lengthOf(4);
  });

  it("splits even digit counts equally around the separator", async () => {
    const el = await fixture<LoomiOtp>(html`<loomi-otp total-digits="6" separator></loomi-otp>`);
    const children = Array.from(el.shadowRoot!.querySelector(".loomi-otp")!.children);
    const separatorIndex = children.findIndex((child) =>
      child.classList.contains("loomi-separator"),
    );

    expect(separatorIndex).to.equal(3);
    expect(
      children
        .slice(0, separatorIndex)
        .filter((child) => child.classList.contains("loomi-box-wrap")),
    ).to.have.lengthOf(3);
    expect(
      children
        .slice(separatorIndex + 1)
        .filter((child) => child.classList.contains("loomi-box-wrap")),
    ).to.have.lengthOf(3);
  });

  it("hides entered digits behind custom dot elements", async () => {
    const el = await fixture<LoomiOtp>(html`<loomi-otp hide-digits></loomi-otp>`);
    const [first] = inputs(el);

    first.value = "7";
    first.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(first.value).to.equal("7");
    expect(first.classList.contains("is-masked")).to.equal(true);
    expect(el.shadowRoot!.querySelectorAll(".loomi-dot")).to.have.lengthOf(1);
  });

  it("keeps mask as an alias for hiding digits", async () => {
    const el = await fixture<LoomiOtp>(html`<loomi-otp mask></loomi-otp>`);
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
        <loomi-otp name="otp"></loomi-otp>
      </form>
    `);
    const el = form.querySelector<LoomiOtp>("loomi-otp")!;
    const verify = oneEvent(el, "loomi-verify") as Promise<
      CustomEvent<{ pin: string; code: string }>
    >;

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

  describe("keyboard navigation between boxes", () => {
    const boxes = (el: LoomiOtp): HTMLInputElement[] =>
      Array.from(el.shadowRoot!.querySelectorAll(".loomi-box"));

    const press = (box: HTMLInputElement, key: string): KeyboardEvent => {
      const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
      box.dispatchEvent(event);
      return event;
    };

    it("walks between boxes with the left and right arrows", async () => {
      const el = await fixture<LoomiOtp>(html`<loomi-otp total-digits="4"></loomi-otp>`);
      const inputs = boxes(el);
      inputs[2].focus();

      press(inputs[2], "ArrowLeft");
      expect(el.shadowRoot!.activeElement).to.equal(inputs[1]);

      press(inputs[1], "ArrowRight");
      expect(el.shadowRoot!.activeElement).to.equal(inputs[2]);
    });

    it("stops at each end rather than wrapping", async () => {
      const el = await fixture<LoomiOtp>(html`<loomi-otp total-digits="4"></loomi-otp>`);
      const inputs = boxes(el);

      inputs[0].focus();
      press(inputs[0], "ArrowLeft");
      expect(el.shadowRoot!.activeElement, "first box holds").to.equal(inputs[0]);

      inputs[3].focus();
      press(inputs[3], "ArrowRight");
      expect(el.shadowRoot!.activeElement, "last box holds").to.equal(inputs[3]);
    });

    it("jumps to the first and last box with Home and End", async () => {
      const el = await fixture<LoomiOtp>(html`<loomi-otp total-digits="6"></loomi-otp>`);
      const inputs = boxes(el);
      inputs[3].focus();

      press(inputs[3], "Home");
      expect(el.shadowRoot!.activeElement).to.equal(inputs[0]);

      press(inputs[0], "End");
      expect(el.shadowRoot!.activeElement).to.equal(inputs[5]);
    });

    it("consumes the navigation keys so the caret does not also move", async () => {
      const el = await fixture<LoomiOtp>(html`<loomi-otp total-digits="4"></loomi-otp>`);
      const inputs = boxes(el);
      inputs[1].focus();
      expect(press(inputs[1], "ArrowRight").defaultPrevented).to.be.true;
      expect(press(inputs[1], "Home").defaultPrevented).to.be.true;
    });

    it("still steps back on Backspace in an empty box", async () => {
      const el = await fixture<LoomiOtp>(html`<loomi-otp total-digits="4"></loomi-otp>`);
      const inputs = boxes(el);
      inputs[2].focus();
      press(inputs[2], "Backspace");
      expect(el.shadowRoot!.activeElement).to.equal(inputs[1]);
    });
  });
});
