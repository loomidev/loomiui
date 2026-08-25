import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiContactCard } from "../dist/index.js";

describe("loomi-contact-card", () => {
  it("renders shadow content", async () => {
    const el = await fixture<LoomiContactCard>(html`<loomi-contact-card></loomi-contact-card>`);
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot!.childElementCount).to.be.greaterThan(0);
  });

  it("renders the person's name and position", async () => {
    const el = await fixture<LoomiContactCard>(
      html`<loomi-contact-card name="Ama Serwaa" position="Engineer"></loomi-contact-card>`,
    );
    expect(el.shadowRoot!.querySelector(".loomi-name")!.textContent).to.contain("Ama Serwaa");
    expect(el.shadowRoot!.querySelector(".loomi-position")!.textContent).to.contain("Engineer");
  });

  it("renders a row per contact detail that is supplied", async () => {
    const bare = await fixture<LoomiContactCard>(
      html`<loomi-contact-card name="Ama"></loomi-contact-card>`,
    );
    const withDetails = await fixture<LoomiContactCard>(
      html`<loomi-contact-card
        name="Ama"
        email="ama@example.com"
        mobile="+233200000000"
      ></loomi-contact-card>`,
    );
    expect(withDetails.shadowRoot!.querySelectorAll(".loomi-row").length).to.be.greaterThan(
      bare.shadowRoot!.querySelectorAll(".loomi-row").length,
    );
  });

  it("links an email address so it can be actioned", async () => {
    const el = await fixture<LoomiContactCard>(
      html`<loomi-contact-card name="Ama" email="ama@example.com"></loomi-contact-card>`,
    );
    const link = el.shadowRoot!.querySelector('a[href^="mailto:"]');
    expect(link, "the email is a mailto link").to.exist;
    expect(link!.getAttribute("href")).to.contain("ama@example.com");
  });
});
