import { expect } from "@open-wc/testing";
import "../dist/loomi-modal.js";
import { loomiConfirm, type LoomiModal } from "../dist/index.js";

function modalEl(): LoomiModal {
  return document.querySelector("loomi-modal")!;
}
async function opened(): Promise<LoomiModal> {
  const deadline = Date.now() + 1000;
  while (!(modalEl()?.open && modalEl().shadowRoot?.querySelector(".loomi-footer loomi-button"))) {
    if (Date.now() > deadline) throw new Error("confirm dialog never opened");
    await new Promise((r) => setTimeout(r, 16));
  }
  const el = modalEl();
  await el.updateComplete;
  return el;
}
function click(el: LoomiModal, which: "ok" | "cancel"): void {
  const buttons = el.shadowRoot!.querySelectorAll<HTMLElement>(".loomi-footer loomi-button");
  const target = which === "cancel" ? buttons[0] : buttons[1];
  target.shadowRoot!.querySelector<HTMLButtonElement>('[part="button"]')!.click();
}

describe("loomiConfirm", () => {
  it("resolves true on OK", async () => {
    const p = loomiConfirm("Sure?");
    click(await opened(), "ok");
    expect(await p).to.be.true;
  });

  it("resolves false on Cancel", async () => {
    const p = loomiConfirm("Sure?");
    click(await opened(), "cancel");
    expect(await p).to.be.false;
  });

  it("resolves false on Escape", async () => {
    const p = loomiConfirm("Sure?");
    await opened();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(await p).to.be.false;
  });

  it("resolves false on backdrop click", async () => {
    const p = loomiConfirm("Sure?");
    const el = await opened();
    el.shadowRoot!.querySelector<HTMLElement>(".loomi-backdrop")!.click();
    expect(await p).to.be.false;
  });

  it("resolves false on the close icon", async () => {
    const p = loomiConfirm("Sure?");
    const el = await opened();
    el.shadowRoot!.querySelector<HTMLElement>(".loomi-close")!.click();
    expect(await p).to.be.false;
  });

  it("applies options and sets text via textContent", async () => {
    const p = loomiConfirm("<b>Title</b>", {
      body: "<img src=x onerror=alert(1)>",
      type: "error",
      okLabel: "Go",
      cancelLabel: "Stop",
      size: "tiny",
    });
    const el = await opened();
    expect(el.title).to.equal("<b>Title</b>");
    expect(el.querySelector("img")).to.not.exist;
    expect(el.textContent).to.equal("<img src=x onerror=alert(1)>");
    expect(el.type).to.equal("error");
    expect(el.size).to.equal("tiny");
    expect(el.okButtonLabel).to.equal("Go");
    expect(el.cancelButtonLabel).to.equal("Stop");
    click(el, "cancel");
    await p;
  });

  it("defaults to the warning type and resets options between calls", async () => {
    const first = loomiConfirm("A", { okLabel: "Custom", body: "text" });
    click(await opened(), "ok");
    await first;
    const second = loomiConfirm("B");
    const el = await opened();
    expect(el.title).to.equal("B");
    expect(el.type).to.equal("warning");
    expect(el.okButtonLabel).to.not.equal("Custom");
    expect(el.textContent).to.equal("");
    click(el, "ok");
    await second;
  });

  it("reuses a single modal element", async () => {
    const p = loomiConfirm("A");
    click(await opened(), "ok");
    await p;
    const q = loomiConfirm("B");
    click(await opened(), "ok");
    await q;
    expect(document.querySelectorAll("loomi-modal")).to.have.length(1);
  });

  it("queues concurrent calls and resolves them in order", async () => {
    const order: string[] = [];
    const a = loomiConfirm("A").then((v) => order.push(`A:${v}`));
    const b = loomiConfirm("B").then((v) => order.push(`B:${v}`));
    const c = loomiConfirm("C").then((v) => order.push(`C:${v}`));

    let el = await opened();
    expect(el.title).to.equal("A");
    click(el, "ok");
    await a;

    await new Promise((r) => setTimeout(r, 0));
    el = await opened();
    expect(el.title).to.equal("B");
    click(el, "cancel");
    await b;

    await new Promise((r) => setTimeout(r, 0));
    el = await opened();
    expect(el.title).to.equal("C");
    click(el, "ok");
    await c;

    expect(order).to.deep.equal(["A:true", "B:false", "C:true"]);
  });

  it("moves focus into the dialog and restores it to the trigger", async () => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();
    const p = loomiConfirm("Sure?");
    const el = await opened();
    await new Promise((r) => setTimeout(r, 50));
    expect(document.activeElement).to.equal(el);
    click(el, "ok");
    await p;
    expect(document.activeElement).to.equal(trigger);
    trigger.remove();
  });

  it("is exposed on window", () => {
    expect(window.loomiConfirm).to.equal(loomiConfirm);
  });
});
