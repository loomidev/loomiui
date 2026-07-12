import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";

describe("loomi-side-nav", () => {
  it("is not collapsible by default", async () => {
    const el = await fixture(html`<loomi-side-nav></loomi-side-nav>`);
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot!.querySelector(".toggle")).not.to.exist;
  });

  it("collapses to icons when its toggle is clicked", async () => {
    const el = await fixture(html`
      <loomi-side-nav collapsible>
        <loomi-side-nav-item icon="home" label="Home"></loomi-side-nav-item>
      </loomi-side-nav>
    `) as HTMLElement & { state: string; updateComplete: Promise<boolean> };

    (el.shadowRoot!.querySelector(".toggle") as HTMLButtonElement).click();
    await el.updateComplete;

    expect(el.state).to.equal("icons");
    const item = el.querySelector("loomi-side-nav-item") as HTMLElement & { compact: boolean };
    expect(item.compact).to.equal(true);
    expect(item.shadowRoot!.querySelector("button")!.getAttribute("aria-label")).to.equal("Home");
  });

  it("applies named icon sizes and optional dividers", async () => {
    const el = await fixture(html`
      <loomi-side-nav icon-size="large" divided>
        <loomi-side-nav-item icon="home" label="Home"></loomi-side-nav-item>
        <loomi-side-nav-item icon="cog-6-tooth" label="Settings"></loomi-side-nav-item>
      </loomi-side-nav>
    `) as HTMLElement;

    const item = el.querySelector("loomi-side-nav-item") as HTMLElement;
    expect(item.style.getPropertyValue("--loomi-side-nav-item-icon-size")).to.equal("1.6rem");
    expect(el.hasAttribute("divided")).to.equal(true);
  });
});
