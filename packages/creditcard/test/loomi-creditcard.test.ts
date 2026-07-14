import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../dist/loomi-creditcard.js";
import type { LoomiCreditcard } from "../dist/index.js";

describe("loomi-creditcard", () => {
  it("auto-detects the network from the number prefix and groups the digits", async () => {
    const el = await fixture<LoomiCreditcard>(html`<loomi-creditcard></loomi-creditcard>`);
    const input = el.shadowRoot!.querySelector(".loomi-cc-number") as HTMLInputElement;
    input.value = "4242424242424242";
    input.dispatchEvent(new Event("input"));
    await el.updateComplete;
    expect(el.activeBrand).to.equal("visa");
    expect(el.number).to.equal("4242 4242 4242 4242");
  });

  it("preserves masked card numbers passed for edit mode", async () => {
    const el = await fixture<LoomiCreditcard>(
      html`<loomi-creditcard brand="visa" number="************4242"></loomi-creditcard>`,
    );
    const input = el.shadowRoot!.querySelector(".loomi-cc-number") as HTMLInputElement;

    expect(el.activeBrand).to.equal("visa");
    expect(el.number).to.equal("•••• •••• •••• 4242");
    expect(input.value).to.equal("•••• •••• •••• 4242");
  });

  it("groups Amex numbers 4-6-5 and caps the CVC at 4 digits", async () => {
    const el = await fixture<LoomiCreditcard>(html`<loomi-creditcard></loomi-creditcard>`);
    const numberInput = el.shadowRoot!.querySelector(".loomi-cc-number") as HTMLInputElement;
    numberInput.value = "378282246310005";
    numberInput.dispatchEvent(new Event("input"));
    await el.updateComplete;
    expect(el.activeBrand).to.equal("amex");
    expect(el.number).to.equal("3782 822463 10005");

    const cvcInput = el.shadowRoot!.querySelector(".loomi-cc-cvc") as HTMLInputElement;
    cvcInput.value = "12345";
    cvcInput.dispatchEvent(new Event("input"));
    await el.updateComplete;
    expect(el.cvc).to.equal("1234");
  });

  it("parses typed expiry digits into clamped month/year, auto-padding single-digit months", async () => {
    const el = await fixture<LoomiCreditcard>(html`<loomi-creditcard></loomi-creditcard>`);
    const input = el.shadowRoot!.querySelector(".loomi-cc-expiry") as HTMLInputElement;
    input.value = "7";
    input.dispatchEvent(new Event("input"));
    await el.updateComplete;
    expect(el.expiryMonth).to.equal("07");

    input.value = "079";
    input.dispatchEvent(new Event("input"));
    await el.updateComplete;
    expect(el.expiryMonth).to.equal("07");
    expect(el.expiryYear).to.equal("9");
  });

  it("flips on button click, fires `flip`, and toggles which face is inert", async () => {
    const el = await fixture<LoomiCreditcard>(html`<loomi-creditcard></loomi-creditcard>`);
    const button = el.shadowRoot!.querySelector(".loomi-cc-flip-btn") as HTMLButtonElement;
    const front = el.shadowRoot!.querySelector(".loomi-cc-front") as HTMLElement;
    const back = el.shadowRoot!.querySelector(".loomi-cc-back") as HTMLElement;
    expect(front.inert).to.be.false;
    expect(back.inert).to.be.true;

    const flipEvent = oneEvent(el, "loomi-flip");
    button.click();
    const { detail } = await flipEvent;
    await el.updateComplete;

    expect(el.flipped).to.be.true;
    expect(detail.flipped).to.be.true;
    expect(front.inert).to.be.true;
    expect(back.inert).to.be.false;
  });

  it("reflects the `variant` attribute so outline styling can be targeted from CSS", async () => {
    const el = await fixture<LoomiCreditcard>(
      html`<loomi-creditcard variant="outline"></loomi-creditcard>`,
    );
    expect(el.variant).to.equal("outline");
    expect(el.getAttribute("variant")).to.equal("outline");
  });

  it("validate() fails when required fields are incomplete and passes once they're filled", async () => {
    const el = await fixture<LoomiCreditcard>(html`<loomi-creditcard required></loomi-creditcard>`);
    expect(el.validate()).to.be.false;
    expect(el.invalid).to.be.true;

    el.number = "4242 4242 4242 4242";
    el.cardholderName = "Ama Osei";
    el.expiryMonth = "07";
    el.expiryYear = "99";
    el.cvc = "123";
    await el.updateComplete;

    expect(el.validate()).to.be.true;
    expect(el.invalid).to.be.false;
  });
});
