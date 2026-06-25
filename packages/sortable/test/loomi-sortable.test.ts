import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-sortable.js";
import type { LoomiSortable } from "../dist/index.js";

const items = (ids: string[]) => ids.map((id) => ({ id, label: id.toUpperCase() }));

function rows(el: LoomiSortable): HTMLElement[] {
  return Array.from(el.shadowRoot!.querySelectorAll<HTMLElement>(".loomi-row"));
}

function dragEvent(type: string): DragEvent {
  const event = new DragEvent(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, "dataTransfer", {
    value: { effectAllowed: "move", setData: () => undefined, getData: () => "" },
  });
  return event;
}

async function drag(source: Element, target: Element): Promise<void> {
  source.dispatchEvent(dragEvent("dragstart"));
  target.dispatchEvent(dragEvent("dragover"));
  target.dispatchEvent(dragEvent("drop"));
  await Promise.all(
    [source.getRootNode(), target.getRootNode()]
      .map((root) => (root as ShadowRoot).host as { updateComplete?: Promise<unknown> })
      .filter((host) => host.updateComplete)
      .map((host) => host.updateComplete),
  );
}

describe("loomi-sortable", () => {
  it("reorders a simple list", async () => {
    const el = await fixture<LoomiSortable>(html`<loomi-sortable></loomi-sortable>`);
    el.items = items(["a", "b", "c"]);
    await el.updateComplete;

    await drag(rows(el)[0], rows(el)[2]);

    expect(el.order).to.deep.equal(["b", "a", "c"]);
  });

  it("moves items between lists with the same group", async () => {
    const wrapper = await fixture<HTMLElement>(html`
      <div>
        <loomi-sortable id="left" group="shared"></loomi-sortable>
        <loomi-sortable id="right" group="shared"></loomi-sortable>
      </div>
    `);
    const left = wrapper.querySelector<LoomiSortable>("#left")!;
    const right = wrapper.querySelector<LoomiSortable>("#right")!;
    left.items = items(["a", "b"]);
    right.items = items(["c"]);
    await Promise.all([left.updateComplete, right.updateComplete]);

    await drag(rows(left)[0], rows(right)[0]);

    expect(left.order).to.deep.equal(["b"]);
    expect(right.order).to.deep.equal(["a", "c"]);
  });

  it("clones from pull clone groups", async () => {
    const wrapper = await fixture<HTMLElement>(html`
      <div>
        <loomi-sortable id="left"></loomi-sortable>
        <loomi-sortable id="right" group="shared"></loomi-sortable>
      </div>
    `);
    const left = wrapper.querySelector<LoomiSortable>("#left")!;
    const right = wrapper.querySelector<LoomiSortable>("#right")!;
    left.group = { name: "shared", pull: "clone" };
    left.items = items(["a"]);
    right.items = items(["b"]);
    await Promise.all([left.updateComplete, right.updateComplete]);

    await drag(rows(left)[0], rows(right)[0]);

    expect(left.order).to.deep.equal(["a"]);
    expect(right.order).to.deep.equal(["a", "b"]);
  });

  it("honors put false and sort false", async () => {
    const wrapper = await fixture<HTMLElement>(html`
      <div>
        <loomi-sortable id="source" group="shared"></loomi-sortable>
        <loomi-sortable id="target"></loomi-sortable>
      </div>
    `);
    const source = wrapper.querySelector<LoomiSortable>("#source")!;
    const target = wrapper.querySelector<LoomiSortable>("#target")!;
    source.sort = false;
    target.group = { name: "shared", put: false };
    source.items = items(["a", "b", "c"]);
    target.items = items(["d"]);
    await Promise.all([source.updateComplete, target.updateComplete]);

    await drag(rows(source)[0], rows(source)[2]);
    expect(source.order).to.deep.equal(["a", "b", "c"]);

    await drag(rows(source)[0], rows(target)[0]);
    expect(source.order).to.deep.equal(["a", "b", "c"]);
    expect(target.order).to.deep.equal(["d"]);
  });

  it("starts drags from the handle in handle mode", async () => {
    const el = await fixture<LoomiSortable>(html`<loomi-sortable has-handle></loomi-sortable>`);
    el.items = items(["a", "b", "c"]);
    await el.updateComplete;

    rows(el)[0].dispatchEvent(dragEvent("dragstart"));
    rows(el)[2].dispatchEvent(dragEvent("drop"));
    expect(el.order).to.deep.equal(["a", "b", "c"]);

    await drag(rows(el)[0].querySelector(".loomi-handle")!, rows(el)[2]);
    expect(el.order).to.deep.equal(["b", "a", "c"]);
  });

  it("filters rows by selector", async () => {
    const el = await fixture<LoomiSortable>(html`<loomi-sortable filter=".filtered"></loomi-sortable>`);
    el.items = [{ id: "a", label: "A", className: "filtered" }, { id: "b", label: "B" }];
    let filtered = "";
    el.addEventListener("filter", (event) => {
      filtered = (event as CustomEvent<{ item: { id: string } }>).detail.item.id;
    });
    await el.updateComplete;

    rows(el)[0].dispatchEvent(dragEvent("dragstart"));

    expect(filtered).to.equal("a");
    expect(rows(el)[0].classList.contains("filtered")).to.equal(true);
  });

  it("moves selected rows together in multi-drag mode", async () => {
    const el = await fixture<LoomiSortable>(html`<loomi-sortable multi-drag></loomi-sortable>`);
    el.items = items(["a", "b", "c", "d"]);
    await el.updateComplete;
    rows(el)[0].click();
    rows(el)[2].click();
    await el.updateComplete;

    await drag(rows(el)[0], rows(el)[3]);

    expect(el.order).to.deep.equal(["b", "a", "c", "d"]);
  });

  it("swaps rows in swap mode", async () => {
    const el = await fixture<LoomiSortable>(html`<loomi-sortable swap></loomi-sortable>`);
    el.items = items(["a", "b", "c"]);
    await el.updateComplete;

    await drag(rows(el)[0], rows(el)[2]);

    expect(el.order).to.deep.equal(["c", "b", "a"]);
  });
});
