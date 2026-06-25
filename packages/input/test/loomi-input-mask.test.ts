import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-input.js";

type TestInput = HTMLElement & {
  value: string;
  updateComplete: Promise<unknown>;
};

type DynamicMaskInput = TestInput & {
  dynamicMask: (input: string) => string;
};

function nativeInput(el: TestInput): HTMLInputElement {
  return el.shadowRoot!.querySelector("input")!;
}

async function typeValue(el: TestInput, value: string): Promise<void> {
  const input = nativeInput(el);
  input.value = value;
  input.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
  await el.updateComplete;
}

describe("loomi-input masks", () => {
  it("applies Alpine-style numeric masks", async () => {
    const el = await fixture<TestInput>(html`<loomi-input mask="99/99/9999"></loomi-input>`);

    await typeValue(el, "12312026");

    expect(el.value).to.equal("12/31/2026");
    expect(nativeInput(el).value).to.equal("12/31/2026");
  });

  it("supports alpha and wildcard mask tokens", async () => {
    const el = await fixture<TestInput>(html`<loomi-input mask="aa-**"></loomi-input>`);

    await typeValue(el, "A1b$9");

    expect(el.value).to.equal("Ab-$9");
  });

  it("uses the built-in dynamic creditcard mask for standard cards", async () => {
    const el = await fixture<TestInput>(
      html`<loomi-input dynamic-mask="creditcard"></loomi-input>`,
    );

    await typeValue(el, "4111111111111111");

    expect(el.value).to.equal("4111 1111 1111 1111");
  });

  it("switches the built-in creditcard mask for Amex prefixes", async () => {
    const el = await fixture<TestInput>(
      html`<loomi-input dynamic-mask="creditcard"></loomi-input>`,
    );

    await typeValue(el, "371449635398431");

    expect(el.value).to.equal("3714 496353 98431");
  });

  it("allows mask=\"creditcard\" as a shortcut", async () => {
    const el = await fixture<TestInput>(html`<loomi-input mask="creditcard"></loomi-input>`);

    await typeValue(el, "5555555555554444");

    expect(el.value).to.equal("5555 5555 5555 4444");
  });

  it("accepts a custom dynamic mask function", async () => {
    const el = await fixture<DynamicMaskInput>(html`<loomi-input></loomi-input>`);
    el.dynamicMask = (input: string) => (input.startsWith("P") ? "a-999" : "999-999");

    await typeValue(el, "P123");

    expect(el.value).to.equal("P-123");

    await typeValue(el, "123456");

    expect(el.value).to.equal("123-456");
  });
});
