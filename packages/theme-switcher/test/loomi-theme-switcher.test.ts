import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-theme-switcher.js";
import type { LoomiThemeSwitcher } from "../dist/index.js";

describe("loomi-theme-switcher", () => {
  beforeEach(() => {
    localStorage.removeItem("loomi-theme");
    document.documentElement.classList.remove("dark");
  });

  it("renders the horizontal variant by default", async () => {
    const el = await fixture<LoomiThemeSwitcher>(html`<loomi-theme-switcher></loomi-theme-switcher>`);

    expect(el.variant).to.equal("horizontal");
    expect(el.shadowRoot!.querySelector(".loomi-switch")).to.exist;
    expect(el.shadowRoot!.querySelector("loomi-dropmenu")).not.to.exist;
  });

  it("renders a dropmenu variant that selects themes", async () => {
    const el = await fixture<LoomiThemeSwitcher>(html`<loomi-theme-switcher variant="dropmenu"></loomi-theme-switcher>`);
    const dropmenu = el.shadowRoot!.querySelector("loomi-dropmenu") as HTMLElement & { updateComplete: Promise<unknown> };
    const changes: string[] = [];
    el.addEventListener("theme-change", (event) => changes.push((event as CustomEvent<{ theme: string }>).detail.theme));

    dropmenu.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-trigger")!.click();
    await dropmenu.updateComplete;
    dropmenu.querySelectorAll("loomi-dropmenu-item")[1].click();
    await el.updateComplete;

    expect(changes).to.deep.equal(["dark"]);
    expect(document.documentElement.classList.contains("dark")).to.equal(true);
    expect(el.shadowRoot!.querySelector(".loomi-menu-trigger")!.textContent).to.include("Dark");
  });
});
