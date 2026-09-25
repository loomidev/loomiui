import { html, fixture, expect, oneEvent, waitUntil } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";
import "../dist/loomi-button-group.js";
import type { LoomiButtonGroup, LoomiButtonGroupItem } from "../dist/index.js";

describe("loomi-button-group", () => {
  it("applies theme vars on the host so slotted items inherit them", async () => {
    const el = await fixture<LoomiButtonGroup>(html`
      <loomi-button-group color="primary" size="small">
        <loomi-button-group-item label="A" selected></loomi-button-group-item>
      </loomi-button-group>
    `);

    expect(el.style.getPropertyValue("--_loomi-accent")).to.not.equal("");
    expect(el.style.getPropertyValue("--loomi-bg-preset-pad-x")).to.equal("0.75rem");
  });

  it("renders a shrink-wrapped system-style track", async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div style="width: 600px;">
        <loomi-button-group radius="small">
          <loomi-button-group-item label="Day" selected></loomi-button-group-item>
          <loomi-button-group-item label="Week"></loomi-button-group-item>
        </loomi-button-group>
      </div>
    `);
    const el = wrapper.querySelector<LoomiButtonGroup>("loomi-button-group")!;
    const track = el.shadowRoot!.querySelector<HTMLElement>(".loomi-bg-group")!;

    expect(getComputedStyle(track).display).to.equal("inline-flex");
    expect(track.getBoundingClientRect().width).to.be.lessThan(
      wrapper.getBoundingClientRect().width,
    );
  });

  it("applies button-compatible radius vars on the host and inner buttons", async () => {
    const el = await fixture<LoomiButtonGroup>(html`
      <loomi-button-group radius="full">
        <loomi-button-group-item label="A" selected></loomi-button-group-item>
        <loomi-button-group-item label="B"></loomi-button-group-item>
      </loomi-button-group>
    `);

    expect(el.style.getPropertyValue("--loomi-bg-radius")).to.equal("9999px");
    expect(el.style.getPropertyValue("--loomi-bg-preset-item-radius")).to.equal("9999px");
  });

  it("supports outline and group-level icon-only buttons with accessible labels", async () => {
    const el = await fixture<LoomiButtonGroup>(html`
      <loomi-button-group outline icon-only aria-label="Formatting">
        <loomi-button-group-item label="Bold" value="bold" icon="bold" selected></loomi-button-group-item>
        <loomi-button-group-item label="Italic" value="italic" icon="italic"></loomi-button-group-item>
      </loomi-button-group>
    `);
    const group = el.shadowRoot!.querySelector<HTMLElement>(".loomi-bg-group")!;
    const first = el.querySelector<LoomiButtonGroupItem>("loomi-button-group-item")!;
    const button = first.shadowRoot!.querySelector<HTMLButtonElement>("button")!;
    const label = first.shadowRoot!.querySelector<HTMLElement>(".loomi-bg-label")!;

    expect(el.outline).to.be.true;
    expect(el.iconOnly).to.be.true;
    expect(group.getAttribute("aria-label")).to.equal("Formatting");
    expect(button.getAttribute("aria-label")).to.equal("Bold");
    expect(label.hidden).to.be.true;
  });

  it("disables item buttons when the whole group is disabled", async () => {
    const el = await fixture<LoomiButtonGroup>(html`
      <loomi-button-group disabled>
        <loomi-button-group-item label="Day" selected></loomi-button-group-item>
      </loomi-button-group>
    `);
    const item = el.querySelector<LoomiButtonGroupItem>("loomi-button-group-item")!;
    const button = item.shadowRoot!.querySelector<HTMLButtonElement>("button")!;

    expect(button.disabled).to.be.true;
  });

  it("selects a clicked item and emits loomi-button-group-change", async () => {
    const el = await fixture<LoomiButtonGroup>(html`
      <loomi-button-group>
        <loomi-button-group-item label="Day" value="day" selected></loomi-button-group-item>
        <loomi-button-group-item label="Week" value="week"></loomi-button-group-item>
      </loomi-button-group>
    `);
    const items = el.querySelectorAll<LoomiButtonGroupItem>("loomi-button-group-item");
    const weekBtn = items[1].shadowRoot!.querySelector("button")!;

    setTimeout(() => weekBtn.click());
    const { detail } = await oneEvent(el, "loomi-button-group-change");

    expect(detail.value).to.equal("week");
    expect(detail.index).to.equal(1);
    expect(items[0].selected).to.be.false;
    expect(items[1].selected).to.be.true;
  });

  it("renders circle items as square, full-radius icon buttons implying icon-only", async () => {
    const el = await fixture<LoomiButtonGroup>(html`
      <loomi-button-group circle radius="none" aria-label="Actions">
        <loomi-button-group-item label="Edit" icon="pencil" aria-label="Edit"></loomi-button-group-item>
      </loomi-button-group>
    `);
    const item = el.querySelector<LoomiButtonGroupItem>("loomi-button-group-item")!;
    const button = item.shadowRoot!.querySelector<HTMLButtonElement>("button")!;
    const label = item.shadowRoot!.querySelector<HTMLElement>(".loomi-bg-label")!;

    expect(el.circle).to.be.true;
    expect(button.getAttribute("aria-label")).to.equal("Edit");
    expect(label.hidden).to.be.true;

    const rect = button.getBoundingClientRect();
    expect(rect.width).to.be.closeTo(rect.height, 1);
    expect(getComputedStyle(button).borderRadius).to.equal("9999px");
    // The track becomes a pill too, even against radius="none", so the round items
    // aren't boxed in square corners.
    const track = el.shadowRoot!.querySelector<HTMLElement>(".loomi-bg-group")!;
    expect(getComputedStyle(track).borderTopLeftRadius).to.equal("9999px");
  });

  it("lets a single item be circular without setting it on the whole group", async () => {
    const el = await fixture<LoomiButtonGroup>(html`
      <loomi-button-group>
        <loomi-button-group-item label="Day" value="day" selected></loomi-button-group-item>
        <loomi-button-group-item circle icon="plus" aria-label="Add" value="add"></loomi-button-group-item>
      </loomi-button-group>
    `);
    const items = el.querySelectorAll<LoomiButtonGroupItem>("loomi-button-group-item");
    const dayLabel = items[0].shadowRoot!.querySelector<HTMLElement>(".loomi-bg-label")!;
    const addButton = items[1].shadowRoot!.querySelector<HTMLButtonElement>("button")!;
    const addLabel = items[1].shadowRoot!.querySelector<HTMLElement>(".loomi-bg-label")!;

    expect(dayLabel.hidden).to.be.false;
    expect(addLabel.hidden).to.be.true;
    expect(getComputedStyle(addButton).borderRadius).to.equal("9999px");
  });

  describe("icon-only accessible names", () => {
    it("names every icon-only item from its label and passes axe", async () => {
      const el = await fixture<LoomiButtonGroup>(html`
        <loomi-button-group icon-only aria-label="Layout">
          <loomi-button-group-item label="View as list" icon="list-bullet" value="list" selected></loomi-button-group-item>
          <loomi-button-group-item label="View as grid" icon="squares-2x2" value="grid"></loomi-button-group-item>
        </loomi-button-group>
      `);
      const buttons = Array.from(
        el.querySelectorAll<LoomiButtonGroupItem>("loomi-button-group-item"),
        (item) => item.shadowRoot!.querySelector<HTMLButtonElement>("button")!,
      );

      expect(buttons.map((b) => b.getAttribute("aria-label"))).to.deep.equal([
        "View as list",
        "View as grid",
      ]);
      expect(buttons.map((b) => b.getAttribute("aria-pressed"))).to.deep.equal(["true", "false"]);
      await expect(el).to.be.accessible();
    });

    it("prefers an item's own aria-label and names circle and item-level icon-only buttons", async () => {
      const el = await fixture<LoomiButtonGroup>(html`
        <loomi-button-group aria-label="Actions">
          <loomi-button-group-item label="Add" icon="plus" circle aria-label="Add a row"></loomi-button-group-item>
          <loomi-button-group-item label="Remove" icon="minus" icon-only></loomi-button-group-item>
        </loomi-button-group>
      `);
      const [add, remove] = Array.from(
        el.querySelectorAll<LoomiButtonGroupItem>("loomi-button-group-item"),
        (item) => item.shadowRoot!.querySelector<HTMLButtonElement>("button")!,
      );

      expect(add.getAttribute("aria-label")).to.equal("Add a row");
      expect(remove.getAttribute("aria-label")).to.equal("Remove");
      await expect(el).to.be.accessible();
    });

    it("follows the group's icon-only attribute through a wrapper element", async () => {
      // The label is hidden by an inherited custom property keyed off the group's
      // attribute, so the aria-label has to come from the same source — not from the
      // item's direct parent.
      const el = await fixture<LoomiButtonGroup>(html`
        <loomi-button-group icon-only aria-label="Layout">
          <span>
            <loomi-button-group-item label="View as list" icon="list-bullet"></loomi-button-group-item>
          </span>
        </loomi-button-group>
      `);
      const item = el.querySelector<LoomiButtonGroupItem>("loomi-button-group-item")!;
      const button = item.shadowRoot!.querySelector<HTMLButtonElement>("button")!;
      const label = item.shadowRoot!.querySelector<HTMLElement>(".loomi-bg-label")!;

      expect(getComputedStyle(label).display).to.equal("none");
      expect(button.getAttribute("aria-label")).to.equal("View as list");
      await expect(el).to.be.accessible();
    });

    it("drops the aria-label again when icon-only is removed from the group", async () => {
      const el = await fixture<LoomiButtonGroup>(html`
        <loomi-button-group icon-only>
          <loomi-button-group-item label="View as list" icon="list-bullet"></loomi-button-group-item>
        </loomi-button-group>
      `);
      const item = el.querySelector<LoomiButtonGroupItem>("loomi-button-group-item")!;
      el.iconOnly = false;
      await el.updateComplete;
      await item.updateComplete;

      const button = item.shadowRoot!.querySelector<HTMLButtonElement>("button")!;
      expect(button.hasAttribute("aria-label")).to.be.false;
      expect(button.textContent!.trim()).to.equal("View as list");
    });
  });

  describe("built-in tooltip", () => {
    const parts = (item: LoomiButtonGroupItem) => {
      const tooltip = item.shadowRoot!.querySelector<HTMLElement & { placement: string }>(
        "loomi-tooltip",
      )!;
      const tip = () => tooltip.shadowRoot!.querySelector<HTMLElement>(".loomi-tip")!;
      return { tooltip, tip, button: item.shadowRoot!.querySelector<HTMLButtonElement>("button")! };
    };

    it("shows on hover and on keyboard focus", async () => {
      const el = await fixture<LoomiButtonGroup>(html`
        <loomi-button-group icon-only aria-label="Views">
          <loomi-button-group-item icon="list-bullet" label="View as list" selected></loomi-button-group-item>
          <loomi-button-group-item icon="map" label="View as map" tooltip="View as map"></loomi-button-group-item>
        </loomi-button-group>
      `);
      const item = el.querySelectorAll<LoomiButtonGroupItem>("loomi-button-group-item")[1];
      const { tooltip, tip, button } = parts(item);
      expect(tooltip.placement).to.equal("top");
      expect(tip().textContent!.trim()).to.equal("View as map");

      tooltip.dispatchEvent(new MouseEvent("mouseenter"));
      await waitUntil(() => tip().matches(":popover-open"), "tooltip didn't open on hover");
      tooltip.dispatchEvent(new MouseEvent("mouseleave"));
      await waitUntil(() => !tip().matches(":popover-open"));

      const before = document.createElement("button");
      el.before(before);
      before.focus();
      await sendKeys({ press: "Tab" });
      await sendKeys({ press: "Tab" });
      expect(item.shadowRoot!.activeElement).to.equal(button);
      await waitUntil(() => tip().matches(":popover-open"), "tooltip didn't open on focus");
      before.remove();
    });

    it("leaves selection, sizing and the segmented look unchanged", async () => {
      const el = await fixture<LoomiButtonGroup>(html`
        <loomi-button-group icon-only aria-label="Views">
          <loomi-button-group-item icon="list-bullet" label="List" value="list" selected></loomi-button-group-item>
          <loomi-button-group-item icon="map" label="Map" value="map" tooltip="View as map"></loomi-button-group-item>
        </loomi-button-group>
      `);
      const [plain, tipped] = el.querySelectorAll<LoomiButtonGroupItem>("loomi-button-group-item");
      const a = plain.shadowRoot!.querySelector("button")!.getBoundingClientRect();
      const b = parts(tipped).button.getBoundingClientRect();
      expect(b.width).to.equal(a.width);
      expect(b.height).to.equal(a.height);
      expect(b.top).to.equal(a.top);

      setTimeout(() => parts(tipped).button.click());
      const { detail } = await oneEvent(el, "loomi-button-group-change");
      expect(detail.value).to.equal("map");
      expect(tipped.selected).to.be.true;
      expect(parts(tipped).button.getAttribute("aria-pressed")).to.equal("true");
      await expect(el).to.be.accessible();
    });

    it("honours tooltip-position", async () => {
      const el = await fixture<LoomiButtonGroup>(html`
        <loomi-button-group>
          <loomi-button-group-item label="Day" tooltip="Daily view" tooltip-position="bottom"></loomi-button-group-item>
        </loomi-button-group>
      `);
      const item = el.querySelector<LoomiButtonGroupItem>("loomi-button-group-item")!;
      expect(parts(item).tooltip.placement).to.equal("bottom");
    });

    it("describes the button with tooltip text that adds to its name, and only then", async () => {
      const el = await fixture<LoomiButtonGroup>(html`
        <loomi-button-group icon-only aria-label="Views">
          <loomi-button-group-item icon="map" label="View as map" tooltip="View as map"></loomi-button-group-item>
          <loomi-button-group-item icon="list-bullet" label="List" tooltip="Shows every farm as a list"></loomi-button-group-item>
        </loomi-button-group>
      `);
      const [same, extra] = el.querySelectorAll<LoomiButtonGroupItem>("loomi-button-group-item");
      expect(parts(same).button.hasAttribute("aria-describedby")).to.be.false;

      const extraButton = parts(extra).button;
      const id = extraButton.getAttribute("aria-describedby")!;
      expect(extra.shadowRoot!.getElementById(id)!.textContent).to.equal(
        "Shows every farm as a list",
      );
      await expect(el).to.be.accessible();
    });

    it("renders no tooltip wrapper without the attribute", async () => {
      const el = await fixture<LoomiButtonGroup>(html`
        <loomi-button-group><loomi-button-group-item label="Day"></loomi-button-group-item></loomi-button-group>
      `);
      const item = el.querySelector<LoomiButtonGroupItem>("loomi-button-group-item")!;
      expect(item.shadowRoot!.querySelector("loomi-tooltip")).to.be.null;
    });
  });
});
