import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-emoji-picker.js";
import type { LoomiEmojiPicker } from "../dist/index.js";

describe("loomi-emoji-picker", () => {
  it("filters the default emoji list by search", async () => {
    const el = await fixture<LoomiEmojiPicker>(html`<loomi-emoji-picker></loomi-emoji-picker>`);
    el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-trigger")!.click();
    await el.updateComplete;

    const search = el.shadowRoot!.querySelector<HTMLInputElement>(".loomi-search")!;
    search.value = "pizza";
    search.dispatchEvent(new Event("input"));
    await el.updateComplete;

    const options = Array.from(el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".loomi-option"));
    expect(options).to.have.lengthOf(1);
    expect(options[0].textContent?.trim()).to.equal("🍕");
  });

  it("selects an emoji and emits the selected item", async () => {
    const el = await fixture<LoomiEmojiPicker>(html`<loomi-emoji-picker></loomi-emoji-picker>`);
    let selected = "";
    el.addEventListener("emoji-select", (event) => {
      selected = (event as CustomEvent).detail.emoji;
    });

    el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-trigger")!.click();
    await el.updateComplete;
    const first = el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-option")!;
    const emoji = first.textContent!.trim();
    first.click();
    await el.updateComplete;

    expect(el.value).to.equal(emoji);
    expect(selected).to.equal(emoji);
    expect(el.shadowRoot!.querySelector(".loomi-trigger")!.getAttribute("aria-expanded")).to.equal("false");
  });

  it("submits selected-value under name", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form><loomi-emoji-picker name="mood" selected-value="🚀"></loomi-emoji-picker></form>
    `);

    expect(new FormData(form).get("mood")).to.equal("🚀");
  });

  it("supports custom data and keyboard selection", async () => {
    const data = [
      { emoji: "🟢", name: "Green status", value: "green", category: "status" },
      { emoji: "🔴", name: "Red status", value: "red", category: "status" },
    ];
    const el = await fixture<LoomiEmojiPicker>(html`<loomi-emoji-picker .data=${data}></loomi-emoji-picker>`);
    const wrapper = el.shadowRoot!.querySelector<HTMLElement>(".loomi-emoji-picker")!;
    const trigger = el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-trigger")!;

    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    await el.updateComplete;
    wrapper.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
    await el.updateComplete;
    wrapper.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    await el.updateComplete;

    expect(el.value).to.equal("red");
    expect(trigger.textContent).to.include("Red status");
  });

  it("renders the picker inline without a trigger", async () => {
    const el = await fixture<LoomiEmojiPicker>(html`<loomi-emoji-picker inline></loomi-emoji-picker>`);

    expect(el.shadowRoot!.querySelector(".loomi-trigger")).to.not.exist;
    expect(el.shadowRoot!.querySelector(".loomi-panel.inline")).to.exist;
    expect(el.shadowRoot!.querySelectorAll(".loomi-option").length).to.be.greaterThan(20);
  });
});
