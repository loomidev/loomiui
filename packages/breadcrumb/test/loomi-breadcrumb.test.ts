import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiBreadcrumb, LoomiBreadcrumbItem } from "../dist/index.js";

describe("loomi-breadcrumb", () => {
  it("renders a nav landmark with the default accessible name", async () => {
    const el = await fixture<LoomiBreadcrumb>(html`<loomi-breadcrumb></loomi-breadcrumb>`);
    const nav = el.shadowRoot!.querySelector("nav")!;

    expect(nav.getAttribute("aria-label")).to.equal("Breadcrumb");
  });

  it("supports a custom accessible name", async () => {
    const el = await fixture<LoomiBreadcrumb>(
      html`<loomi-breadcrumb label="You are here"></loomi-breadcrumb>`,
    );
    const nav = el.shadowRoot!.querySelector("nav")!;

    expect(nav.getAttribute("aria-label")).to.equal("You are here");
  });

  it("marks only the last item as current", async () => {
    const el = await fixture<LoomiBreadcrumb>(html`<loomi-breadcrumb>
      <loomi-breadcrumb-item href="/" label="Home"></loomi-breadcrumb-item>
      <loomi-breadcrumb-item href="/settings" label="Settings"></loomi-breadcrumb-item>
      <loomi-breadcrumb-item label="Billing"></loomi-breadcrumb-item>
    </loomi-breadcrumb>`);
    await el.updateComplete;
    const items = Array.from(el.querySelectorAll<LoomiBreadcrumbItem>("loomi-breadcrumb-item"));
    await Promise.all(items.map((item) => item.updateComplete));

    expect(items[0].last).to.be.false;
    expect(items[1].last).to.be.false;
    expect(items[2].last).to.be.true;

    const [home, settings, billing] = items.map(
      (item) => item.shadowRoot!.querySelector(".loomi-crumb-control")!,
    );
    expect(home.tagName).to.equal("A");
    expect(settings.tagName).to.equal("A");
    expect(billing.tagName).to.equal("SPAN");
    expect(billing.getAttribute("aria-current")).to.equal("page");
  });

  it("never renders the last item as a link even with an href", async () => {
    const el = await fixture<LoomiBreadcrumb>(html`<loomi-breadcrumb>
      <loomi-breadcrumb-item href="/current" label="Current"></loomi-breadcrumb-item>
    </loomi-breadcrumb>`);
    await el.updateComplete;
    const item = el.querySelector<LoomiBreadcrumbItem>("loomi-breadcrumb-item")!;
    await item.updateComplete;

    const control = item.shadowRoot!.querySelector(".loomi-crumb-control")!;
    expect(control.tagName).to.equal("SPAN");
  });

  it("omits the separator after the last item", async () => {
    const el = await fixture<LoomiBreadcrumb>(html`<loomi-breadcrumb>
      <loomi-breadcrumb-item href="/" label="Home"></loomi-breadcrumb-item>
      <loomi-breadcrumb-item label="Current"></loomi-breadcrumb-item>
    </loomi-breadcrumb>`);
    await el.updateComplete;
    const items = Array.from(el.querySelectorAll<LoomiBreadcrumbItem>("loomi-breadcrumb-item"));
    await Promise.all(items.map((item) => item.updateComplete));

    expect(items[0].shadowRoot!.querySelector(".loomi-crumb-separator")).to.exist;
    expect(items[1].shadowRoot!.querySelector(".loomi-crumb-separator")).to.not.exist;
  });

  it("switches the separator glyph for every item", async () => {
    const el = await fixture<LoomiBreadcrumb>(html`<loomi-breadcrumb separator="slash">
      <loomi-breadcrumb-item href="/" label="Home"></loomi-breadcrumb-item>
      <loomi-breadcrumb-item label="Current"></loomi-breadcrumb-item>
    </loomi-breadcrumb>`);
    await el.updateComplete;
    const first = el.querySelector<LoomiBreadcrumbItem>("loomi-breadcrumb-item")!;
    await first.updateComplete;

    expect(first.shadowRoot!.querySelector(".loomi-sep-slash")).to.exist;
    expect(first.shadowRoot!.querySelector(".loomi-sep-chevron")).to.not.exist;
  });

  it("fires a cancelable loomi-breadcrumb-item-click and can be prevented", async () => {
    const el = await fixture<LoomiBreadcrumb>(html`<loomi-breadcrumb>
      <loomi-breadcrumb-item href="/reports" label="Reports"></loomi-breadcrumb-item>
      <loomi-breadcrumb-item label="Current"></loomi-breadcrumb-item>
    </loomi-breadcrumb>`);
    await el.updateComplete;
    const item = el.querySelector<LoomiBreadcrumbItem>("loomi-breadcrumb-item")!;
    await item.updateComplete;
    const link = item.shadowRoot!.querySelector<HTMLAnchorElement>("a.loomi-crumb-control")!;

    el.addEventListener("loomi-breadcrumb-item-click", (event) => event.preventDefault(), {
      once: true,
    });

    const listener = oneEvent(el, "loomi-breadcrumb-item-click");
    link.click();
    const event = (await listener) as CustomEvent<{ href: string; label: string }>;

    expect(event.detail).to.deep.equal({ href: "/reports", label: "Reports" });
  });
});
