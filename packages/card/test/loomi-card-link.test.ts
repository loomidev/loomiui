import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";

describe("loomi-card url", () => {
  it("renders a real anchor", async () => {
    const el = await fixture<HTMLElement>(html`<loomi-card url="/orders/1">Order</loomi-card>`);
    const a = el.shadowRoot!.querySelector("a")!;
    expect(a.getAttribute("href")).to.equal("/orders/1");
    expect(a.hasAttribute("target")).to.equal(false);
  });

  it("opens absolute URLs in a new tab", async () => {
    const el = await fixture<HTMLElement>(
      html`<loomi-card url="https://example.com">x</loomi-card>`,
    );
    const a = el.shadowRoot!.querySelector("a")!;
    expect(a.getAttribute("target")).to.equal("_blank");
    expect(a.getAttribute("rel")).to.equal("noopener noreferrer");
  });

  it("never runs a url as script", async () => {
    (window as unknown as { pwned?: boolean }).pwned = false;
    const el = await fixture<HTMLElement>(
      html`<loomi-card url="window.pwned=true;void(0)">x</loomi-card>`,
    );
    const a = el.shadowRoot!.querySelector("a")!;
    a.addEventListener("click", (e) => e.preventDefault());
    a.click();
    expect((window as unknown as { pwned?: boolean }).pwned).to.equal(false);
  });
});
