import { html, fixture, expect } from "@open-wc/testing";
import { accessibleName } from "../../../test/accessible-name.js";
import "../dist/loomi-password.js";

function control(el: Element): HTMLElement {
  return el.shadowRoot!.querySelector("input")! as HTMLElement;
}

describe("loomi-password accessible name", () => {
  it("is the label when label is set", async () => {
    const el = await fixture(html`<loomi-password label="Email"></loomi-password>`);
    expect(accessibleName(control(el) as HTMLInputElement)).to.equal("Email");
  });

  it("is accessible-label when there is no label", async () => {
    const el = await fixture(
      html`<loomi-password accessible-label="Search the docs"></loomi-password>`,
    );
    expect(control(el).getAttribute("aria-label")).to.equal("Search the docs");
    expect(accessibleName(control(el) as HTMLInputElement)).to.equal("Search the docs");
  });

  it("accepts aria-label on the host as an alias", async () => {
    const el = await fixture(html`<loomi-password aria-label="Search the docs"></loomi-password>`);
    expect(accessibleName(control(el) as HTMLInputElement)).to.equal("Search the docs");
  });

  it("ignores accessible-label when label is set", async () => {
    const el = await fixture(
      html`<loomi-password label="Email" accessible-label="Ignored"></loomi-password>`,
    );
    expect(accessibleName(control(el) as HTMLInputElement)).to.equal("Email");
  });

  it("is the top label, tied to the control by for/id", async () => {
    const el = await fixture(
      html`<loomi-password label="Email" label-position="top" required></loomi-password>`,
    );
    const ctl = control(el) as HTMLInputElement;
    const label = el.shadowRoot!.querySelector(".loomi-top-label") as HTMLLabelElement;
    expect(label).to.exist;
    expect(label.control).to.equal(ctl);
    expect(ctl.hasAttribute("aria-label")).to.be.false;
    expect(el.shadowRoot!.querySelector(".loomi-field .loomi-label")).to.be.null;
    expect(accessibleName(ctl).replace(/\*$/, "")).to.equal("Email");
  });

  it("renders the top label outside the bordered field", async () => {
    const el = await fixture(
      html`<loomi-password label="Email" label-position="top"></loomi-password>`,
    );
    const label = el.shadowRoot!.querySelector(".loomi-top-label")!;
    const field = el.shadowRoot!.querySelector(".loomi-field")!;
    expect(field.contains(label)).to.be.false;
    expect(label.getBoundingClientRect().bottom).to.be.at.most(
      field.getBoundingClientRect().top + 0.5,
    );
  });

  it("has no name with neither label nor accessible-label", async () => {
    const el = await fixture(html`<loomi-password></loomi-password>`);
    expect(accessibleName(control(el) as HTMLInputElement)).to.equal("");
  });
});
