import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-emoji-picker.js";
import type { LoomiEmojiPicker } from "../dist/index.js";

async function openPicker(el: LoomiEmojiPicker): Promise<HTMLElement> {
  const popover = el.shadowRoot!.querySelector("loomi-popover") as HTMLElement & { updateComplete: Promise<unknown> };
  el.shadowRoot!.querySelector<HTMLElement>(".loomi-emoji-trigger")!.click();
  await el.updateComplete;
  await popover.updateComplete;
  return popover;
}

describe("loomi-emoji-picker", () => {
  it("shows only the emoji on the trigger by default (no text)", async () => {
    const el = await fixture<LoomiEmojiPicker>(html`<loomi-emoji-picker selected-value="🚀"></loomi-emoji-picker>`);

    const trigger = el.shadowRoot!.querySelector<HTMLElement>(".loomi-emoji-trigger")!;
    expect(trigger.classList.contains("with-text")).to.be.false;
    expect(trigger.querySelector(".loomi-value")).to.not.exist;
    expect(trigger.textContent?.trim()).to.equal("🚀");
    expect(trigger.getAttribute("aria-label")).to.equal("Rocket");
  });

  it("shows the name text next to the trigger emoji when show-text is set", async () => {
    const el = await fixture<LoomiEmojiPicker>(
      html`<loomi-emoji-picker .showText=${true} selected-value="🚀"></loomi-emoji-picker>`,
    );

    const trigger = el.shadowRoot!.querySelector<HTMLElement>(".loomi-emoji-trigger")!;
    expect(trigger.classList.contains("with-text")).to.be.true;
    expect(trigger.querySelector(".loomi-value")!.textContent).to.equal("Rocket");
  });

  it("filters the default emoji list by search", async () => {
    const el = await fixture<LoomiEmojiPicker>(html`<loomi-emoji-picker></loomi-emoji-picker>`);
    await openPicker(el);

    const search = el.shadowRoot!.querySelector<HTMLInputElement>(".loomi-search")!;
    search.value = "taco";
    search.dispatchEvent(new Event("input"));
    await el.updateComplete;

    const options = Array.from(el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".loomi-option"));
    expect(options).to.have.lengthOf(1);
    expect(options[0].textContent?.trim()).to.equal("🌮");
  });

  it("selects an emoji, emits the selected item, and closes the dropdown", async () => {
    const el = await fixture<LoomiEmojiPicker>(html`<loomi-emoji-picker></loomi-emoji-picker>`);
    let selected = "";
    el.addEventListener("emoji-select", (event) => {
      selected = (event as CustomEvent).detail.emoji;
    });

    const popover = await openPicker(el);
    const first = el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-option")!;
    const emoji = first.textContent!.trim();
    first.click();
    await el.updateComplete;
    await popover.updateComplete;

    expect(el.value).to.equal(emoji);
    expect(selected).to.equal(emoji);
    expect(popover.shadowRoot!.querySelector(".loomi-panel")).to.not.exist;
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

    await openPicker(el);
    wrapper.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
    await el.updateComplete;
    wrapper.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    await el.updateComplete;

    expect(el.value).to.equal("red");
  });

  it("opens via ArrowDown on the wrapper when closed", async () => {
    const el = await fixture<LoomiEmojiPicker>(html`<loomi-emoji-picker></loomi-emoji-picker>`);
    const wrapper = el.shadowRoot!.querySelector<HTMLElement>(".loomi-emoji-picker")!;
    const popover = el.shadowRoot!.querySelector("loomi-popover") as HTMLElement & { updateComplete: Promise<unknown> };

    wrapper.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    await el.updateComplete;
    await popover.updateComplete;

    expect(el.shadowRoot!.querySelector(".loomi-grid")).to.exist;
  });

  it("also fixes show-categories and searchable literal \"false\" attributes", async () => {
    const el = await fixture<LoomiEmojiPicker>(
      html`<loomi-emoji-picker show-categories="false" searchable="false"></loomi-emoji-picker>`,
    );

    expect(el.showCategories).to.be.false;
    expect(el.searchable).to.be.false;

    await openPicker(el);

    expect(el.shadowRoot!.querySelector(".loomi-categories")).to.not.exist;
    expect(el.shadowRoot!.querySelector(".loomi-search")).to.not.exist;
  });

  it("renders 7 emojis per row", async () => {
    const el = await fixture<LoomiEmojiPicker>(html`<loomi-emoji-picker></loomi-emoji-picker>`);
    await openPicker(el);

    const grid = el.shadowRoot!.querySelector<HTMLElement>(".loomi-grid")!;
    const columns = getComputedStyle(grid).gridTemplateColumns.split(" ").length;
    expect(columns).to.equal(7);
  });

  it("does not open when disabled", async () => {
    const el = await fixture<LoomiEmojiPicker>(html`<loomi-emoji-picker disabled></loomi-emoji-picker>`);
    const popover = el.shadowRoot!.querySelector("loomi-popover") as HTMLElement & {
      show: () => void;
      updateComplete: Promise<unknown>;
    };

    popover.show();
    await popover.updateComplete;

    expect(popover.shadowRoot!.querySelector(".loomi-panel")).to.not.exist;
  });

  it("renders the picker inline without a dropdown trigger", async () => {
    const el = await fixture<LoomiEmojiPicker>(html`<loomi-emoji-picker inline></loomi-emoji-picker>`);

    expect(el.shadowRoot!.querySelector("loomi-popover")).to.not.exist;
    expect(el.shadowRoot!.querySelector(".loomi-emoji-panel")).to.exist;
    expect(el.shadowRoot!.querySelectorAll(".loomi-option").length).to.be.greaterThan(20);
  });

  describe("skin tone picker", () => {
    afterEach(() => {
      localStorage.removeItem("loomi-emoji-picker:skin-tone");
    });

    it("shows a hand suffix next to search that opens a 6-way tone menu", async () => {
      const el = await fixture<LoomiEmojiPicker>(html`<loomi-emoji-picker></loomi-emoji-picker>`);
      await openPicker(el);

      const toneTrigger = el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-tone-trigger")!;
      expect(toneTrigger).to.exist;
      expect(toneTrigger.textContent?.trim()).to.equal("✋");
      expect(el.shadowRoot!.querySelector(".loomi-tone-menu")).to.not.exist;

      toneTrigger.click();
      await el.updateComplete;

      const toneOptions = Array.from(el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".loomi-tone-option"));
      expect(toneOptions).to.have.lengthOf(6);
    });

    it("applies the chosen tone to matching emoji and to the selected value", async () => {
      const el = await fixture<LoomiEmojiPicker>(html`<loomi-emoji-picker></loomi-emoji-picker>`);
      await openPicker(el);

      const search = el.shadowRoot!.querySelector<HTMLInputElement>(".loomi-search")!;
      search.value = "waving hand";
      search.dispatchEvent(new Event("input"));
      await el.updateComplete;

      el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-tone-trigger")!.click();
      await el.updateComplete;
      const toneOptions = el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".loomi-tone-option");
      toneOptions[5].click(); // dark skin tone
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector(".loomi-tone-menu")).to.not.exist;
      expect(el.shadowRoot!.querySelector(".loomi-tone-trigger")!.textContent?.trim()).to.equal("✋🏿");

      const option = el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-option")!;
      expect(option.textContent?.trim()).to.equal("👋🏿");

      option.click();
      await el.updateComplete;

      expect(el.value).to.equal("👋🏿");
    });

    it("closes the tone menu on an outside click without picking a tone", async () => {
      const el = await fixture<LoomiEmojiPicker>(html`<loomi-emoji-picker></loomi-emoji-picker>`);
      await openPicker(el);

      el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-tone-trigger")!.click();
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector(".loomi-tone-menu")).to.exist;

      // Click elsewhere within the still-open panel (not document.body, which would
      // also dismiss the whole popover and trivially take the menu with it).
      el.shadowRoot!.querySelector<HTMLInputElement>(".loomi-search")!.click();
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector(".loomi-tone-menu")).to.not.exist;
      expect(el.shadowRoot!.querySelector(".loomi-tone-trigger")!.textContent?.trim()).to.equal("✋");
    });
  });
});
