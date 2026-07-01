import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-password.js";
import type { LoomiPassword } from "../dist/index.js";
import type { LoomiNotification } from "@loomidev/notification";

function nativeInput(el: LoomiPassword): HTMLInputElement {
  return el.shadowRoot!.querySelector("input")!;
}

async function typeValue(el: LoomiPassword, value: string): Promise<void> {
  const input = nativeInput(el);
  input.value = value;
  input.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
  await el.updateComplete;
}

describe("loomi-password", () => {
  afterEach(() => {
    document.querySelectorAll("loomi-notification").forEach((el) => el.remove());
  });

  it("renders only requested strength requirements and turns met checks green", async () => {
    const el = await fixture<LoomiPassword>(html`<loomi-password strength="Aa1#"></loomi-password>`);

    let items = Array.from(el.shadowRoot!.querySelectorAll(".loomi-strength-item"));
    expect(items).to.have.length(4);
    expect(items.map((item) => item.textContent?.trim())).to.deep.equal([
      "One uppercase letter",
      "One lowercase letter",
      "One number",
      "One special character",
    ]);
    expect(items.filter((item) => item.classList.contains("met"))).to.have.length(0);

    await typeValue(el, "Ab1!");
    items = Array.from(el.shadowRoot!.querySelectorAll(".loomi-strength-item"));
    expect(items.filter((item) => item.classList.contains("met"))).to.have.length(4);
  });

  it("fails validation while strength requirements are unmet", async () => {
    const el = await fixture<LoomiPassword>(
      html`<loomi-password strength="A1" error-message="Choose a stronger password" show-error-inline></loomi-password>`,
    );

    await typeValue(el, "abc");

    expect(el.validate()).to.equal(false);
    await el.updateComplete;
    expect(el.invalid).to.equal(true);
    expect(el.shadowRoot!.querySelector(".loomi-error")!.textContent).to.equal("Choose a stronger password");

    await typeValue(el, "abc1D");
    expect(el.validate()).to.equal(true);
    await el.updateComplete;
    expect(el.invalid).to.equal(false);
  });

  it("supports prefix dropdowns", async () => {
    const el = await fixture<LoomiPassword>(
      html`<loomi-password prefix-options="personal,admin,service" prefix-value="admin"></loomi-password>`,
    );
    const select = el.shadowRoot!.querySelector(".loomi-prefix select") as HTMLSelectElement;
    let detail: { value: string } | undefined;
    el.addEventListener("prefix-change", (event) => {
      detail = (event as CustomEvent<{ value: string }>).detail;
    });

    expect(select.value).to.equal("admin");
    select.value = "service";
    select.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(el.prefixValue).to.equal("service");
    expect(detail).to.deep.equal({ value: "service" });
  });

  it("matches loomi-input required validation behavior", async () => {
    const el = await fixture<LoomiPassword>(
      html`<loomi-password required label="Password" error-message="Password is required"></loomi-password>`,
    );

    expect(el.validate()).to.equal(false);
    await el.updateComplete;

    const host = document.body.querySelector("loomi-notification") as LoomiNotification;
    expect(host).to.exist;
    await host.updateComplete;
    expect(host.shadowRoot!.querySelector(".loomi-message")!.textContent).to.equal("Password is required");
  });
});
