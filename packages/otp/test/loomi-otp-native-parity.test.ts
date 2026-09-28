import { html, fixture, expect } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";
import { recordFormEvents, inForm } from "../../../test/form-events.js";
import "../dist/loomi-otp.js";
import type { LoomiOtp } from "../dist/index.js";

// Native parity: see "Value and events contract" in packages/core/README.md.
describe("loomi-otp native parity", () => {
  const boxes = (el: LoomiOtp) =>
    Array.from(el.shadowRoot!.querySelectorAll("input")).map((b) => b.value);

  it("setting value fills the boxes and form value without firing events", async () => {
    const el = await fixture<LoomiOtp>(html`<loomi-otp></loomi-otp>`);
    const { formValue } = inForm(el, "code");
    const log = recordFormEvents(el);
    el.addEventListener("loomi-verify", () => log.push("loomi-verify"));

    el.value = "12a345";
    expect(el.value).to.equal("1234");
    await el.updateComplete;
    expect(boxes(el)).to.deep.equal(["1", "2", "3", "4"]);
    expect(formValue()).to.equal("1234");
    expect(log).to.deep.equal([]);
  });

  it("keeps a value set before the element is connected", async () => {
    const el = document.createElement("loomi-otp") as LoomiOtp;
    el.value = "98";
    document.body.append(el);
    await el.updateComplete;
    expect(boxes(el)).to.deep.equal(["9", "8", "", ""]);
    el.remove();
  });

  it("typing fires one input per digit; change fires once when focus leaves the boxes", async () => {
    const el = await fixture<LoomiOtp>(html`<loomi-otp></loomi-otp>`);
    const { elsewhere } = inForm(el, "code");
    const log = recordFormEvents(el);

    el.shadowRoot!.querySelector("input")!.focus();
    await sendKeys({ type: "12" });
    elsewhere.focus();
    expect(log).to.deep.equal(["input:1", "input:12", "change:12"]);
  });
});
