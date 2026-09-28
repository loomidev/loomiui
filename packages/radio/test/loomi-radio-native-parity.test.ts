import { html, fixture, expect } from "@open-wc/testing";
import { recordFormEvents } from "../../../test/form-events.js";
import "../dist/loomi-radio.js";
import type { LoomiRadio } from "../dist/index.js";

// Native parity: see "Value and events contract" in packages/core/README.md.
describe("loomi-radio native parity", () => {
  async function group() {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <loomi-radio name="size" value="s"></loomi-radio>
        <loomi-radio name="size" value="m" checked></loomi-radio>
      </form>
    `);
    const [small, medium] = Array.from(form.querySelectorAll("loomi-radio")) as LoomiRadio[];
    await Promise.all([small.updateComplete, medium.updateComplete]);
    return { form, small, medium };
  }

  it("reports type 'radio' and ignores writes to it", async () => {
    const el = await fixture<LoomiRadio>(html`<loomi-radio></loomi-radio>`);
    expect(el.type).to.equal("radio");
    (el as unknown as { type: string }).type = "checkbox";
    expect(el.type).to.equal("radio");
  });

  it("setting checked unchecks the rest of the group and updates the form, without events", async () => {
    const { form, small, medium } = await group();
    const log = [...recordFormEvents(small, () => small.checked), ...recordFormEvents(medium)];

    small.checked = true;
    await small.updateComplete;
    await medium.updateComplete;
    expect(medium.checked).to.be.false;
    expect(small.shadowRoot!.querySelector("input")!.checked).to.be.true;
    expect(medium.shadowRoot!.querySelector("input")!.checked).to.be.false;
    expect(new FormData(form).get("size")).to.equal("s");
    expect(log).to.deep.equal([]);
  });

  it("a user pick fires input then change once each, with the group already updated", async () => {
    const { small, medium } = await group();
    const log = recordFormEvents(small, () => `${small.checked}/${medium.checked}`);
    small.shadowRoot!.querySelector("input")!.click();
    expect(log).to.deep.equal(["input:true/false", "change:true/false"]);
  });

  it("clicking an already-checked radio fires nothing", async () => {
    const { medium } = await group();
    const log = recordFormEvents(medium, () => medium.checked);
    medium.shadowRoot!.querySelector("input")!.click();
    expect(log).to.deep.equal([]);
  });
});
