import { html, fixture, expect, nextFrame } from "@open-wc/testing";
import { oneEvent } from "@open-wc/testing";
import "../dist/index.js";

describe("loomi-tag", () => {
  it("renders its label and fires loomi-tag-click on click", async () => {
    const el = await fixture(html`<loomi-tag label="beta" value="beta"></loomi-tag>`);
    expect(el.shadowRoot!.textContent).to.include("beta");

    const inner = el.shadowRoot!.querySelector(".loomi-tag") as HTMLElement;
    setTimeout(() => inner.click());
    await oneEvent(el, "loomi-tag-click");
  });

  it("removes itself when its close button is clicked", async () => {
    const host = await fixture(html`
      <div><loomi-tag label="Draft" can-close></loomi-tag></div>
    `);
    const tag = host.querySelector("loomi-tag") as LoomiTag;
    (tag.shadowRoot!.querySelector(".loomi-close") as HTMLElement).click();
    await nextFrame();
    expect(host.querySelector("loomi-tag"), "the tag removes itself").to.not.exist;
  });

  it("stays in the DOM when close is prevented", async () => {
    const host = await fixture(html`
      <div><loomi-tag label="Draft" can-close></loomi-tag></div>
    `);
    const tag = host.querySelector("loomi-tag") as LoomiTag;
    tag.addEventListener("close", (e) => e.preventDefault());

    (tag.shadowRoot!.querySelector(".loomi-close") as HTMLElement).click();
    await nextFrame();
    expect(host.querySelector("loomi-tag"), "preventDefault keeps the tag").to.exist;
  });

  it("renders no close button unless can-close is set", async () => {
    const el = await fixture<LoomiTag>(html`<loomi-tag label="Draft"></loomi-tag>`);
    expect(el.shadowRoot!.querySelector(".loomi-close")).to.not.exist;
  });
});

describe("loomi-tags", () => {
  it("submits the selected values as a comma-separated list", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <loomi-tags name="labels" selected-value="a,b">
          <loomi-tag value="a" label="A"></loomi-tag>
          <loomi-tag value="b" label="B"></loomi-tag>
          <loomi-tag value="c" label="C"></loomi-tag>
        </loomi-tags>
      </form>
    `);
    const tags = form.querySelector("loomi-tags") as HTMLElement & {
      updateComplete: Promise<unknown>;
    };
    await tags.updateComplete;
    await nextFrame();
    expect(new FormData(form).get("labels")).to.equal("a,b");
  });

  it("marks the pre-selected tags as selected", async () => {
    const el = await fixture(html`
      <loomi-tags name="labels" selected-value="b">
        <loomi-tag value="a" label="A"></loomi-tag>
        <loomi-tag value="b" label="B"></loomi-tag>
      </loomi-tags>
    `);
    await nextFrame();
    const [a, b] = Array.from(el.querySelectorAll("loomi-tag"));
    expect(a.hasAttribute("selected")).to.be.false;
    expect(b.hasAttribute("selected")).to.be.true;
  });

  it("is display-only until it is given a name", async () => {
    // Selection is deliberately tied to form participation: an unnamed <loomi-tags>
    // submits nothing, so it marks nothing selectable and ignores selected-value.
    const el = await fixture(html`
      <loomi-tags selected-value="b">
        <loomi-tag value="a" label="A"></loomi-tag>
        <loomi-tag value="b" label="B"></loomi-tag>
      </loomi-tags>
    `);
    await nextFrame();
    const tags = Array.from(el.querySelectorAll("loomi-tag"));
    expect(tags.some((t) => t.hasAttribute("selected"))).to.be.false;
    expect(tags.some((t) => t.hasAttribute("selectable"))).to.be.false;
  });
});
