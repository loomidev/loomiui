import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-dropmenu.js";
import type { LoomiDropmenu } from "../dist/index.js";

const nextFrame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));

async function open(el: LoomiDropmenu): Promise<HTMLElement> {
  el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-trigger")!.click();
  await el.updateComplete;
  await nextFrame();
  await el.updateComplete;
  return el.shadowRoot!.querySelector<HTMLElement>(".loomi-menu")!;
}

describe("loomi-dropmenu", () => {
  it("opens to the right when there is not enough room on the left", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu style="position:fixed;left:12px;top:12px">
        <loomi-dropmenu-item>Profile</loomi-dropmenu-item>
        <loomi-dropmenu-item>Settings</loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    const menu = await open(el);

    expect(menu.classList.contains("left")).to.equal(true);
    expect(menu.classList.contains("right")).to.equal(false);
  });

  it("opens to the left when there is not enough room on the right", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu style="position:fixed;right:12px;top:12px">
        <loomi-dropmenu-item>Profile</loomi-dropmenu-item>
        <loomi-dropmenu-item>Settings</loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    const menu = await open(el);

    expect(menu.classList.contains("right")).to.equal(true);
    expect(menu.classList.contains("left")).to.equal(false);
  });

  it("respects explicit positioning", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu position="right" style="position:fixed;left:12px;top:12px">
        <loomi-dropmenu-item>Profile</loomi-dropmenu-item>
        <loomi-dropmenu-item>Settings</loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    const menu = await open(el);

    expect(menu.classList.contains("right")).to.equal(true);
  });
});
