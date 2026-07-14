import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../dist/loomi-tag-input.js";
import type { LoomiTagInput } from "../dist/index.js";

const pressEnter = (input: HTMLInputElement) => {
  input.dispatchEvent(
    new KeyboardEvent("keydown", { key: "Enter", bubbles: true, composed: true }),
  );
};

describe("loomi-tag-input", () => {
  it("turns the draft text into an inside tag on Enter", async () => {
    const el = await fixture<LoomiTagInput>(
      html`<loomi-tag-input placeholder="Add tag"></loomi-tag-input>`,
    );
    const input = el.shadowRoot!.querySelector("input")!;

    input.value = "Design";
    input.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
    const changed = oneEvent(el, "change");
    pressEnter(input);
    await changed;
    await el.updateComplete;

    expect(el.value).to.equal("Design");
    expect(el.tags).to.deep.equal(["Design"]);
    expect(input.value).to.equal("");
    expect(el.shadowRoot!.querySelector(".loomi-field .loomi-tag")!.textContent!.trim()).to.equal(
      "Design",
    );
  });

  it("keeps tags beneath the field in below mode", async () => {
    const el = await fixture<LoomiTagInput>(
      html`<loomi-tag-input mode="below" value="Marketing,mike"></loomi-tag-input>`,
    );
    await el.updateComplete;

    const fieldTags = el.shadowRoot!.querySelectorAll(".loomi-field .loomi-tag");
    const belowTags = el.shadowRoot!.querySelectorAll(".mode-below + .loomi-tags .loomi-tag");

    expect(fieldTags.length).to.equal(0);
    expect(belowTags.length).to.equal(2);
    expect(el.tags).to.deep.equal(["Marketing", "mike"]);
  });

  it("removes a tag with its x button", async () => {
    const el = await fixture<LoomiTagInput>(
      html`<loomi-tag-input value="Design,Engineering"></loomi-tag-input>`,
    );
    await el.updateComplete;

    const changed = oneEvent(el, "change");
    (el.shadowRoot!.querySelector(".loomi-tag-remove") as HTMLButtonElement).click();
    await changed;
    await el.updateComplete;

    expect(el.value).to.equal("Engineering");
    expect(el.tags).to.deep.equal(["Engineering"]);
  });

  it("submits the comma-separated tag value with a form", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <loomi-tag-input name="teams" value="Design,Engineering"></loomi-tag-input>
      </form>
    `);
    const data = new FormData(form);

    expect(data.get("teams")).to.equal("Design,Engineering");
  });

  it("validates required when no tags exist", async () => {
    const el = await fixture<LoomiTagInput>(html`<loomi-tag-input required></loomi-tag-input>`);

    const ok = el.validate();
    await el.updateComplete;

    expect(ok).to.be.false;
    expect(el.invalid).to.be.true;
    expect(el.hasAttribute("invalid")).to.be.true;
  });
});
