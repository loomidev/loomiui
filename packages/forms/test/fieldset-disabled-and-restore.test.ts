import { html, fixture, expect } from "@open-wc/testing";
import "../../input/dist/loomi-input.js";
import "../../select/dist/loomi-select.js";
import "../../checkbox/dist/loomi-checkbox.js";
import "../../textarea/dist/loomi-textarea.js";

type Ctl = HTMLElement & { updateComplete: Promise<boolean>; isDisabled: boolean };

describe("<fieldset disabled>", () => {
  it("disables loomi controls inside it, and re-enables them", async () => {
    const form = await fixture<HTMLFormElement>(html`<form>
      <fieldset>
        <loomi-input name="a" value="x"></loomi-input>
        <loomi-textarea name="b" value="y"></loomi-textarea>
        <loomi-checkbox name="c" value="on" checked></loomi-checkbox>
      </fieldset>
    </form>`);
    const fieldset = form.querySelector("fieldset")!;
    const input = form.querySelector<Ctl>("loomi-input")!;
    fieldset.disabled = true;
    await input.updateComplete;
    expect(input.isDisabled).to.equal(true);
    expect(input.shadowRoot!.querySelector("input")!.disabled).to.equal(true);
    expect(form.querySelector<Ctl>("loomi-checkbox")!.isDisabled).to.equal(true);
    // Disabled controls are left out of the submission, like native ones.
    expect([...new FormData(form).keys()]).to.deep.equal([]);

    fieldset.disabled = false;
    await input.updateComplete;
    expect(input.isDisabled).to.equal(false);
    expect(input.shadowRoot!.querySelector("input")!.disabled).to.equal(false);
    expect([...new FormData(form).keys()]).to.deep.equal(["a", "b", "c"]);
  });

  it("keeps an author-disabled control disabled after the fieldset is enabled", async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form><fieldset disabled><loomi-input name="a" disabled></loomi-input></fieldset></form>`,
    );
    const input = form.querySelector<Ctl>("loomi-input")!;
    form.querySelector("fieldset")!.disabled = false;
    await input.updateComplete;
    expect(input.isDisabled).to.equal(true);
  });
});

describe("form state restore", () => {
  it("restores value-based and checked controls", async () => {
    const input = await fixture<
      HTMLElement & { value: string; formStateRestoreCallback(s: unknown): void }
    >(html`<loomi-input></loomi-input>`);
    input.formStateRestoreCallback("restored", "restore");
    expect(input.value).to.equal("restored");

    const box = await fixture<
      HTMLElement & { checked: boolean; formStateRestoreCallback(s: unknown): void }
    >(html`<loomi-checkbox value="on"></loomi-checkbox>`);
    box.formStateRestoreCallback("on");
    expect(box.checked).to.equal(true);
  });
});
