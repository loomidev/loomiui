import { html, fixture, expect } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";
import "../dist/loomi-input.js";
import "../../password/dist/loomi-password.js";
import "../../textarea/dist/loomi-textarea.js";
import "../../button/dist/loomi-button.js";
import type { LoomiInput } from "../dist/index.js";

// Implicit submission: Enter in a single-line field submits its form, like a native <input>.
describe("loomi-input implicit submission", () => {
  const inner = (el: Element, selector = "input") =>
    el.shadowRoot!.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement;

  /** Counts `submit` events and cancels them so the test page doesn't navigate. */
  const countSubmits = (form: HTMLFormElement) => {
    const submits: (HTMLElement | null)[] = [];
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      submits.push(e.submitter);
    });
    return submits;
  };

  const pressEnterIn = async (el: Element, selector = "input") => {
    inner(el, selector).focus();
    await sendKeys({ press: "Enter" });
  };

  it("fires submit exactly once on Enter", async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form><loomi-input name="q"></loomi-input></form>`,
    );
    const submits = countSubmits(form);
    await pressEnterIn(form.querySelector("loomi-input")!);
    expect(submits).to.have.length(1);
  });

  it("uses <loomi-button can-submit> as the default button with several fields", async () => {
    const form = await fixture<HTMLFormElement>(html`<form>
      <loomi-input name="email"></loomi-input>
      <loomi-password name="password"></loomi-password>
      <loomi-button can-submit>Sign in</loomi-button>
    </form>`);
    const submits = countSubmits(form);
    await pressEnterIn(form.querySelector("loomi-password")!);
    expect(submits).to.have.length(1);
  });

  it("clicks a native default button so it becomes the submitter", async () => {
    const form = await fixture<HTMLFormElement>(html`<form>
      <loomi-input name="a"></loomi-input>
      <button type="submit" name="go">Go</button>
    </form>`);
    const submits = countSubmits(form);
    await pressEnterIn(form.querySelector("loomi-input")!);
    expect(submits).to.deep.equal([form.querySelector("button")]);
  });

  it("does nothing when the default button is disabled", async () => {
    const form = await fixture<HTMLFormElement>(html`<form>
      <loomi-input name="a"></loomi-input>
      <loomi-button can-submit disabled>Go</loomi-button>
    </form>`);
    const submits = countSubmits(form);
    await pressEnterIn(form.querySelector("loomi-input")!);
    expect(submits).to.have.length(0);
  });

  it("does nothing with no default button and more than one blocking field", async () => {
    const form = await fixture<HTMLFormElement>(html`<form>
      <loomi-input name="a"></loomi-input>
      <loomi-input name="b"></loomi-input>
    </form>`);
    const submits = countSubmits(form);
    await pressEnterIn(form.querySelector("loomi-input")!);
    expect(submits).to.have.length(0);
  });

  it("runs constraint validation first", async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form><loomi-input name="a" required></loomi-input></form>`,
    );
    const submits = countSubmits(form);
    await pressEnterIn(form.querySelector("loomi-input")!);
    expect(submits).to.have.length(0);
  });

  it("respects no-implicit-submit", async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form><loomi-input name="a" no-implicit-submit></loomi-input></form>`,
    );
    const submits = countSubmits(form);
    await pressEnterIn(form.querySelector("loomi-input")!);
    expect(submits).to.have.length(0);
  });

  it("ignores the Enter that commits an IME composition", async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form><loomi-input name="a"></loomi-input></form>`,
    );
    const submits = countSubmits(form);
    const el = form.querySelector<LoomiInput>("loomi-input")!;
    inner(el).dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        isComposing: true,
        bubbles: true,
        composed: true,
      }),
    );
    expect(submits).to.have.length(0);
  });

  it("doesn't submit from <loomi-textarea>", async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form><loomi-textarea name="notes"></loomi-textarea></form>`,
    );
    const submits = countSubmits(form);
    await pressEnterIn(form.querySelector("loomi-textarea")!, "textarea");
    expect(submits).to.have.length(0);
  });

  it("is a no-op outside a form", async () => {
    const el = await fixture<LoomiInput>(html`<loomi-input></loomi-input>`);
    await pressEnterIn(el);
    expect(el.value).to.equal("");
  });
});
