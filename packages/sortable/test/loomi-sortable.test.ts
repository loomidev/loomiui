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
    const el = await fixture<LoomiSortable>(
      html`<loomi-sortable filter=".filtered"></loomi-sortable>`,
    );
    el.items = [
      { id: "a", label: "A", className: "filtered" },
      { id: "b", label: "B" },
    ];
    let filtered = "";
    el.addEventListener("loomi-filter", (event) => {
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

  describe("light-DOM rows", () => {
    const lightList = (attrs = "") => {
      const handle = attrs === "has-handle";
      return fixture<HTMLElement>(html`
        <div>
          <style>
            .styled {
              color: rgb(1, 2, 3);
            }
          </style>
          <loomi-sortable ?has-handle=${handle}>
            <div class="styled" data-id="a"><span>Alpha</span> <button>Edit A</button></div>
            <div class="styled" data-id="b"><a href="#b">Beta</a></div>
            <div class="styled" data-id="c"><input value="Gamma" /></div>
          </loomi-sortable>
        </div>
      `).then((wrap) => wrap.querySelector<LoomiSortable>("loomi-sortable")!);
    };

    const lightRows = (el: LoomiSortable) =>
      Array.from(el.querySelectorAll<HTMLElement>(":scope > [data-id]"));
    const handleOf = (row: HTMLElement) => row.querySelector<HTMLElement>("[data-handle]")!;
    const visual = (el: LoomiSortable) =>
      lightRows(el)
        .sort((x, y) => Number(x.style.order || 0) - Number(y.style.order || 0))
        .map((r) => r.dataset.id);
    const listen = (el: LoomiSortable) => {
      const orders: string[][] = [];
      el.addEventListener("loomi-reorder", (e) => orders.push(e.detail.order));
      return orders;
    };
    const key = (target: Element, k: string, init: KeyboardEventInit = {}) =>
      target.dispatchEvent(
        new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...init }),
      );
    const pointer = (type: string, target: Element | Document, x: number, y: number) =>
      target.dispatchEvent(
        new PointerEvent(type, {
          pointerType: "touch",
          pointerId: 1,
          clientX: x,
          clientY: y,
          bubbles: true,
          cancelable: true,
          composed: true,
        }),
      );

    it("keeps rows in the light DOM, reports the order and keeps page styles", async () => {
      const el = await lightList();
      await el.updateComplete;
      expect(el.order).to.deep.equal(["a", "b", "c"]);
      lightRows(el).forEach((row) => {
        expect(row.parentElement).to.equal(el);
        expect(getComputedStyle(row).color).to.equal("rgb(1, 2, 3)");
      });
      expect(el.shadowRoot!.querySelector(".loomi-empty-hint")).to.equal(null);
    });

    it("reorders with the mouse without moving DOM nodes", async () => {
      const el = await lightList();
      const orders = listen(el);
      const [a, , c] = lightRows(el);

      a.dispatchEvent(dragEvent("dragstart"));
      c.dispatchEvent(dragEvent("dragover"));
      c.dispatchEvent(dragEvent("drop"));
      await el.updateComplete;

      expect(orders).to.deep.equal([["b", "c", "a"]]);
      expect(el.order).to.deep.equal(["b", "c", "a"]);
      expect(visual(el)).to.deep.equal(["b", "c", "a"]);
      expect(lightRows(el).map((r) => r.dataset.id)).to.deep.equal(["a", "b", "c"]);
      expect(a.hasAttribute("data-loomi-dragging")).to.equal(false);
    });

    it("lets buttons, links and inputs click without starting a drag", async () => {
      const el = await lightList();
      const orders = listen(el);
      const [a, b, c] = lightRows(el);
      const button = a.querySelector("button")!;
      let clicks = 0;
      button.addEventListener("click", () => clicks++);

      button.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true }));
      expect(a.draggable).to.equal(false);
      button.click();
      expect(clicks).to.equal(1);
      document.dispatchEvent(new PointerEvent("pointerup"));
      expect(a.draggable).to.equal(true);

      for (const [row, target] of [
        [a, button],
        [b, b.querySelector("a")!],
        [c, c.querySelector("input")!],
      ] as const) {
        const start = dragEvent("dragstart");
        target.dispatchEvent(start);
        expect(start.defaultPrevented, row.dataset.id).to.equal(true);
        expect(row.hasAttribute("data-loomi-dragging")).to.equal(false);
      }
      expect(orders).to.deep.equal([]);
    });

    it("starts drags only from the handle in handle mode", async () => {
      const el = await lightList("has-handle");
      await el.updateComplete;
      const orders = listen(el);
      const [a, , c] = lightRows(el);
      expect(a.draggable).to.equal(false);
      expect(handleOf(a).draggable).to.equal(true);

      const fromRow = dragEvent("dragstart");
      a.querySelector("button")!.dispatchEvent(fromRow);
      expect(fromRow.defaultPrevented).to.equal(true);

      handleOf(a).dispatchEvent(dragEvent("dragstart"));
      c.dispatchEvent(dragEvent("dragover"));
      c.dispatchEvent(dragEvent("drop"));
      expect(orders).to.deep.equal([["b", "c", "a"]]);
    });

    it("reorders with touch from the handle", async () => {
      const el = await lightList("has-handle");
      await el.updateComplete;
      const orders = listen(el);
      const [a, , c] = lightRows(el);
      el.scrollIntoView({ block: "center" });
      const from = handleOf(a).getBoundingClientRect();
      const to = c.getBoundingClientRect();

      pointer("pointerdown", handleOf(a), from.left + 4, from.top + 4);
      pointer("pointermove", handleOf(a), to.left + 20, to.top + to.height / 2);
      expect(c.hasAttribute("data-loomi-over")).to.equal(true);
      pointer("pointerup", handleOf(a), to.left + 20, to.top + to.height / 2);

      expect(orders).to.deep.equal([["b", "c", "a"]]);
      expect(a.hasAttribute("data-loomi-dragging")).to.equal(false);
    });

    it("moves a row with Alt+Arrow and announces it", async () => {
      const el = await lightList("has-handle");
      await el.updateComplete;
      const orders = listen(el);
      const [, b] = lightRows(el);
      expect(handleOf(b).tabIndex).to.equal(0);

      key(handleOf(b), "ArrowUp", { altKey: true });
      await el.updateComplete;

      expect(orders).to.deep.equal([["b", "a", "c"]]);
      expect(el.shadowRoot!.querySelector(".loomi-live")!.textContent).to.contain(
        "position 1 of 3",
      );

      key(handleOf(b), "ArrowUp", { altKey: true }); // already first: no-op
      expect(orders).to.have.length(1);
    });

    it("picks up with Space, moves with arrows and drops with Space", async () => {
      const el = await lightList("has-handle");
      await el.updateComplete;
      const orders = listen(el);
      const [a] = lightRows(el);

      key(handleOf(a), " ");
      key(handleOf(a), "ArrowDown");
      key(handleOf(a), "ArrowDown");
      expect(orders).to.deep.equal([]);
      key(handleOf(a), " ");
      await el.updateComplete;

      expect(orders).to.deep.equal([["b", "c", "a"]]);
      expect(el.shadowRoot!.querySelector(".loomi-live")!.textContent).to.contain("Dropped");
    });

    it("restores the order when a keyboard move is cancelled with Escape", async () => {
      const el = await lightList("has-handle");
      await el.updateComplete;
      const orders = listen(el);
      const [a] = lightRows(el);

      key(handleOf(a), " ");
      key(handleOf(a), "ArrowDown");
      key(handleOf(a), "Escape");

      expect(orders).to.deep.equal([]);
      expect(el.order).to.deep.equal(["a", "b", "c"]);
    });

    it("resets the visual order when the app re-renders its rows", async () => {
      const el = await lightList("has-handle");
      await el.updateComplete;
      const [a, b, c] = lightRows(el);
      key(handleOf(a), "ArrowDown", { altKey: true });
      expect(el.order).to.deep.equal(["b", "a", "c"]);

      el.append(a); // app re-renders in its own order
      await el.updateComplete;
      await new Promise((r) => setTimeout(r));

      expect(el.order).to.deep.equal(["b", "c", "a"]);
      expect(b.style.order).to.equal("");
      expect(c.style.order).to.equal("");
    });
  });
});
