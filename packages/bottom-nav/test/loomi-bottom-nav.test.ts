import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../dist/loomi-bottom-nav.js";
import type { LoomiBottomNav, LoomiBottomNavItem } from "../dist/index.js";

describe("loomi-bottom-nav", () => {
  it("marks the item matching `active` and updates it on click, emitting loomi-change", async () => {
    const el = await fixture<LoomiBottomNav>(html`
      <loomi-bottom-nav active="home">
        <loomi-bottom-nav-item name="home" icon="home">Home</loomi-bottom-nav-item>
        <loomi-bottom-nav-item name="orders" icon="package">Orders</loomi-bottom-nav-item>
      </loomi-bottom-nav>
    `);
    const items = el.querySelectorAll<LoomiBottomNavItem>("loomi-bottom-nav-item");
    expect(items[0].active).to.be.true;
    expect(items[1].active).to.be.false;

    const ordersButton = items[1].shadowRoot!.querySelector("button")!;
    setTimeout(() => ordersButton.click());
    const { detail } = await oneEvent(el, "loomi-change");

    expect(detail.value).to.equal("orders");
    expect(detail.item).to.equal(items[1]);
    expect(el.active).to.equal("orders");
    expect(items[0].active).to.be.false;
    expect(items[1].active).to.be.true;
  });

  it("renders a real <a> when href is set, with the given href", async () => {
    const el = await fixture<LoomiBottomNav>(html`
      <loomi-bottom-nav active="home">
        <loomi-bottom-nav-item name="home" icon="home" href="/home">Home</loomi-bottom-nav-item>
      </loomi-bottom-nav>
    `);
    const item = el.querySelector<LoomiBottomNavItem>("loomi-bottom-nav-item")!;
    const anchor = item.shadowRoot!.querySelector("a")!;
    expect(anchor.getAttribute("href")).to.equal("/home");
  });

  it("prevent-default suppresses navigation but still fires loomi-change", async () => {
    const el = await fixture<LoomiBottomNav>(html`
      <loomi-bottom-nav active="home">
        <loomi-bottom-nav-item name="settings" icon="cog" href="/settings" prevent-default
          >Settings</loomi-bottom-nav-item
        >
      </loomi-bottom-nav>
    `);
    const item = el.querySelector<LoomiBottomNavItem>("loomi-bottom-nav-item")!;
    const anchor = item.shadowRoot!.querySelector("a")!;

    setTimeout(() => anchor.click());
    const { detail } = await oneEvent(el, "loomi-change");
    expect(detail.href).to.equal("/settings");
    expect(el.active).to.equal("settings");
  });

  it("renders a badge part with the given content", async () => {
    const el = await fixture<LoomiBottomNavItem>(html`
      <loomi-bottom-nav-item name="cart" icon="shopping-cart" badge="3">Cart</loomi-bottom-nav-item>
    `);
    const badge = el.shadowRoot!.querySelector('[part="badge"]');
    expect(badge?.textContent?.trim()).to.equal("3");
  });

  it("End moves roving focus to the last enabled item, skipping a disabled one", async () => {
    const el = await fixture<LoomiBottomNav>(html`
      <loomi-bottom-nav active="home">
        <loomi-bottom-nav-item name="home" icon="home">Home</loomi-bottom-nav-item>
        <loomi-bottom-nav-item name="orders" icon="package" disabled>Orders</loomi-bottom-nav-item>
        <loomi-bottom-nav-item name="profile" icon="user">Profile</loomi-bottom-nav-item>
      </loomi-bottom-nav>
    `);
    const items = el.querySelectorAll<LoomiBottomNavItem>("loomi-bottom-nav-item");

    el.shadowRoot!.querySelector("nav")!.dispatchEvent(
      new KeyboardEvent("keydown", { key: "End", bubbles: true, cancelable: true }),
    );
    await el.updateComplete;

    const profileButton = items[2].shadowRoot!.querySelector("button")!;
    expect(items[2].shadowRoot!.activeElement).to.equal(profileButton);
  });
});
