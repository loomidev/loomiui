import { html, fixture, expect, nextFrame } from "@open-wc/testing";
import "../dist/index.js";

describe("loomi-side-nav", () => {
  it("is not collapsible by default", async () => {
    const el = await fixture(html`<loomi-side-nav></loomi-side-nav>`);
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot!.querySelector(".toggle")).not.to.exist;
  });

  it("collapses to icons when its toggle is clicked", async () => {
    const el = (await fixture(html`
      <loomi-side-nav collapsible>
        <loomi-side-nav-item icon="home" label="Home"></loomi-side-nav-item>
      </loomi-side-nav>
    `)) as HTMLElement & { state: string; updateComplete: Promise<boolean> };

    (el.shadowRoot!.querySelector(".toggle") as HTMLButtonElement).click();
    await el.updateComplete;

    expect(el.state).to.equal("icons");
    const item = el.querySelector("loomi-side-nav-item") as HTMLElement & { compact: boolean };
    expect(item.compact).to.equal(true);
    expect(item.shadowRoot!.querySelector("button")!.getAttribute("aria-label")).to.equal("Home");
  });

  it("applies named icon sizes and optional dividers", async () => {
    const el = (await fixture(html`
      <loomi-side-nav icon-size="large" divided>
        <loomi-side-nav-item icon="home" label="Home"></loomi-side-nav-item>
        <loomi-side-nav-item icon="cog-6-tooth" label="Settings"></loomi-side-nav-item>
      </loomi-side-nav>
    `)) as HTMLElement;

    const item = el.querySelector("loomi-side-nav-item") as HTMLElement;
    expect(item.style.getPropertyValue("--loomi-side-nav-item-icon-size")).to.equal("1.6rem");
    expect(el.hasAttribute("divided")).to.equal(true);
  });

  it("marks the active item so it can be styled and announced", async () => {
    const el = await fixture(html`
      <loomi-side-nav label="Main">
        <loomi-side-nav-item label="Home" active></loomi-side-nav-item>
        <loomi-side-nav-item label="Reports"></loomi-side-nav-item>
      </loomi-side-nav>
    `);
    await nextFrame();
    const [home, reports] = Array.from(el.querySelectorAll("loomi-side-nav-item"));
    expect(home.hasAttribute("active")).to.be.true;
    expect(reports.hasAttribute("active")).to.be.false;
  });

  it("renders an item with an href as a real link", async () => {
    const el = await fixture(html`
      <loomi-side-nav label="Main">
        <loomi-side-nav-item label="Reports" href="/reports"></loomi-side-nav-item>
      </loomi-side-nav>
    `);
    await nextFrame();
    const item = el.querySelector("loomi-side-nav-item")!;
    const anchor = item.shadowRoot!.querySelector("a");
    expect(anchor, "an href renders an anchor").to.exist;
    expect(anchor!.getAttribute("href")).to.equal("/reports");
  });
});
