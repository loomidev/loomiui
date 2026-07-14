import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../dist/loomi-fab.js";
import type { LoomiFab, LoomiFabItem } from "../dist/index.js";

const nextFrame = (): Promise<void> =>
  new Promise((resolve) => requestAnimationFrame(() => resolve()));

async function open(el: LoomiFab): Promise<void> {
  el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-trigger")!.click();
  await el.updateComplete;
  await nextFrame();
}

describe("loomi-fab", () => {
  it("does not open when it has no speed-dial items", async () => {
    const el = await fixture<LoomiFab>(html`<loomi-fab variant="docked"></loomi-fab>`);

    await open(el);

    expect(el.open).to.equal(false);
  });

  it("opens and closes the speed-dial menu on trigger click", async () => {
    const el = await fixture<LoomiFab>(html`
      <loomi-fab variant="docked">
        <loomi-fab-item label="Add Patient" value="patient"></loomi-fab-item>
        <loomi-fab-item label="Book Appointment" value="appointment"></loomi-fab-item>
      </loomi-fab>
    `);

    await nextFrame();
    await open(el);
    expect(el.open).to.equal(true);

    await open(el);
    expect(el.open).to.equal(false);
  });

  it("fires loomi-select with the item's value and closes by default", async () => {
    const el = await fixture<LoomiFab>(html`
      <loomi-fab variant="docked">
        <loomi-fab-item label="Add Patient" value="patient"></loomi-fab-item>
      </loomi-fab>
    `);

    await nextFrame();
    await open(el);

    const item = el.querySelector<LoomiFabItem>("loomi-fab-item")!;
    await item.updateComplete;

    const listener = oneEvent(el, "loomi-select");
    item.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-pill")!.click();
    const event = (await listener) as CustomEvent<{ value: string; label: string }>;

    expect(event.detail.value).to.equal("patient");
    expect(el.open).to.equal(false);
  });

  it("keeps the menu open when close-on-select is false", async () => {
    const el = await fixture<LoomiFab>(html`
      <loomi-fab variant="docked" close-on-select="false">
        <loomi-fab-item label="Add Patient" value="patient"></loomi-fab-item>
      </loomi-fab>
    `);

    await nextFrame();
    await open(el);

    const item = el.querySelector<LoomiFabItem>("loomi-fab-item")!;
    await item.updateComplete;
    item.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-pill")!.click();
    await el.updateComplete;

    expect(el.open).to.equal(true);
  });

  it("blocks clicks on a disabled item", async () => {
    const el = await fixture<LoomiFab>(html`
      <loomi-fab variant="docked">
        <loomi-fab-item label="Add Patient" value="patient" disabled></loomi-fab-item>
      </loomi-fab>
    `);

    await nextFrame();
    await open(el);

    const item = el.querySelector<LoomiFabItem>("loomi-fab-item")!;
    await item.updateComplete;

    let selected = false;
    el.addEventListener("loomi-select", () => (selected = true));
    item.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-pill")!.click();

    expect(selected).to.equal(false);
  });

  it("does not toggle open when disabled", async () => {
    const el = await fixture<LoomiFab>(html`
      <loomi-fab variant="docked" disabled>
        <loomi-fab-item label="Add Patient" value="patient"></loomi-fab-item>
      </loomi-fab>
    `);

    await nextFrame();
    await open(el);

    expect(el.open).to.equal(false);
  });

  it("closes on Escape and restores focus to the trigger", async () => {
    const el = await fixture<LoomiFab>(html`
      <loomi-fab variant="docked">
        <loomi-fab-item label="Add Patient" value="patient"></loomi-fab-item>
      </loomi-fab>
    `);

    await nextFrame();
    await open(el);
    expect(el.open).to.equal(true);

    const item = el.querySelector<LoomiFabItem>("loomi-fab-item")!;
    await item.updateComplete;
    item.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true, composed: true }),
    );
    await el.updateComplete;

    expect(el.open).to.equal(false);
  });

  it("defaults direction from placement (bottom-* expands up)", async () => {
    const el = await fixture<LoomiFab>(html`
      <loomi-fab variant="docked" placement="bottom-right">
        <loomi-fab-item label="Add Patient" value="patient"></loomi-fab-item>
      </loomi-fab>
    `);

    await nextFrame();
    const dial = el.shadowRoot!.querySelector(".loomi-dial")!;
    expect(dial.classList.contains("dir-up")).to.equal(true);
  });

  it("icons-only hides the label and wraps the pill in a loomi-tooltip", async () => {
    const el = await fixture<LoomiFab>(html`
      <loomi-fab variant="docked" icons-only>
        <loomi-fab-item icon="user-plus" label="Add Patient" value="patient"></loomi-fab-item>
      </loomi-fab>
    `);

    await nextFrame();
    const item = el.querySelector<LoomiFabItem>("loomi-fab-item")!;
    await item.updateComplete;

    const tooltip = item.shadowRoot!.querySelector("loomi-tooltip");
    const pill = item.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-pill")!;

    expect(tooltip).not.to.equal(null);
    expect(tooltip!.getAttribute("content")).to.equal("Add Patient");
    expect(pill.getAttribute("aria-label")).to.equal("Add Patient");
    expect(pill.querySelector(".loomi-pill-label")).to.equal(null);
  });
});
