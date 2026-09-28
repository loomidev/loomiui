import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiTextEditor, LoomiTextEditorToolDetail } from "../dist/index.js";

const surface = (el: LoomiTextEditor) =>
  el.shadowRoot!.querySelector(".loomi-editor") as HTMLElement;

/** The selection object the editor itself reads (the shadow root's where supported). */
function selectionFor(el: LoomiTextEditor): Selection {
  const root = el.shadowRoot as ShadowRoot & { getSelection?: () => Selection | null };
  return root.getSelection?.() ?? document.getSelection()!;
}

/** Selects `[start, end)` of the editor's first text node, and lets selectionchange land. */
async function selectText(el: LoomiTextEditor, start: number, end = start): Promise<void> {
  surface(el).focus();
  const walker = document.createTreeWalker(surface(el), NodeFilter.SHOW_TEXT);
  const text = walker.nextNode()!;
  // setBaseAndExtent: WebKit ignores addRange() for nodes inside a shadow root.
  selectionFor(el).setBaseAndExtent(text, start, text, end);
  await new Promise((resolve) => setTimeout(resolve, 20));
}

async function editor(value: string): Promise<LoomiTextEditor> {
  const el = await fixture<LoomiTextEditor>(
    html`<loomi-text-editor tools="bold" .value=${value}></loomi-text-editor>`,
  );
  await el.updateComplete;
  return el;
}

describe("loomi-text-editor insert API", () => {
  it("insertText inserts at the caret, updates value and fires input once", async () => {
    const el = await editor("<p>ab</p>");
    await selectText(el, 1);
    let inputs = 0;
    el.addEventListener("input", () => inputs++);

    el.insertText("\\frac{a}{b}");

    expect(el.value).to.equal("<p>a\\frac{a}{b}b</p>");
    expect(inputs).to.equal(1);
  });

  it("insertText replaces a selected range", async () => {
    const el = await editor("<p>hello world</p>");
    await selectText(el, 6, 11);
    el.insertText("there");
    expect(el.value).to.equal("<p>hello there</p>");
  });

  it("insertHTML inserts markup at the caret", async () => {
    const el = await editor("<p>ab</p>");
    await selectText(el, 1);
    el.insertHTML("<strong>X</strong>");
    expect(el.value).to.equal("<p>a<strong>X</strong>b</p>");
  });

  it("restores the last selection after an external toolbar button takes focus", async () => {
    const wrapper = await fixture<HTMLDivElement>(html`<div>
      <button id="frac">a/b</button>
      <p id="elsewhere">outside text</p>
      <loomi-text-editor tools="bold" .value=${"<p>x=</p>"}></loomi-text-editor>
    </div>`);
    const el = wrapper.querySelector("loomi-text-editor")!;
    await el.updateComplete;
    await selectText(el, 2);

    const button = wrapper.querySelector<HTMLButtonElement>("#frac")!;
    button.addEventListener("click", () => el.insertText("\\frac{a}{b}"));
    button.focus();
    // Clicking elsewhere on the page moves the live selection out of the editor too.
    document.getSelection()!.selectAllChildren(wrapper.querySelector("#elsewhere")!);
    button.click();

    expect(el.value).to.equal("<p>x=\\frac{a}{b}</p>");
  });

  it("appends at the end when nothing in the editor was ever selected", async () => {
    const el = await editor("<p>end</p>");
    el.insertText("!");
    expect(el.value).to.equal("<p>end!</p>");
  });

  it("getSelection returns the selected text and HTML", async () => {
    const el = await editor("<p>hello world</p>");
    expect(el.getSelection(), "nothing selected yet").to.be.null;
    await selectText(el, 0, 5);
    expect(el.getSelection()).to.deep.equal({ text: "hello", html: "hello" });
  });

  it("does nothing when readonly", async () => {
    const el = await editor("<p>ab</p>");
    el.readonly = true;
    await el.updateComplete;
    el.insertText("X");
    expect(el.value).to.equal("<p>ab</p>");
  });
});

describe("loomi-text-editor custom tools", () => {
  it("renders custom tools with the built-in look and a tooltip", async () => {
    const el = await editor("<p></p>");
    el.customTools = [{ id: "frac", label: "Fraction", text: "a/b" }];
    await el.updateComplete;
    const button = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-tool="frac"]')!;
    expect(button.classList.contains("loomi-tool-button")).to.be.true;
    expect(button.getAttribute("aria-label")).to.equal("Fraction");
    expect(button.textContent!.trim()).to.equal("a/b");
    expect(button.closest("loomi-tooltip")?.getAttribute("content")).to.equal("Fraction");
  });

  it("clicking one calls run and fires loomi-tool with working insert helpers", async () => {
    const el = await editor("<p>ab</p>");
    let ran: LoomiTextEditor | undefined;
    el.customTools = [{ id: "sqrt", label: "Square root", run: (editor) => (ran = editor) }];
    await el.updateComplete;
    await selectText(el, 1);

    let detail: LoomiTextEditorToolDetail | undefined;
    el.addEventListener("loomi-tool", (e) => {
      detail = e.detail;
      e.detail.insertText("\\sqrt{x}");
    });
    el.shadowRoot!.querySelector<HTMLButtonElement>('[data-tool="sqrt"]')!.click();

    expect(ran).to.equal(el);
    expect(detail?.id).to.equal("sqrt");
    expect(el.value).to.equal("<p>a\\sqrt{x}b</p>");
  });

  it("renders toolbar slots", async () => {
    const el = await fixture<LoomiTextEditor>(html`<loomi-text-editor tools="">
      <button slot="toolbar-end">Σ</button>
    </loomi-text-editor>`);
    await el.updateComplete;
    const slot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="toolbar-end"]')!;
    expect(slot.assignedElements()).to.have.length(1);
  });
});
