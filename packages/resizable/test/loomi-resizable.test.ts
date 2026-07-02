import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../dist/loomi-resizable.js";
import type { LoomiResizablePanelGroup } from "../dist/index.js";

describe("loomi-resizable", () => {
  it("splits space evenly when no default sizes are provided", async () => {
    const group = await fixture<LoomiResizablePanelGroup>(html`
      <loomi-resizable-panel-group style="width:400px;height:200px">
        <loomi-resizable-panel id="a">One</loomi-resizable-panel>
        <loomi-resizable-handle></loomi-resizable-handle>
        <loomi-resizable-panel id="b">Two</loomi-resizable-panel>
      </loomi-resizable-panel-group>
    `);

    await group.updateComplete;
    await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));

    const [left, right] = Array.from(group.querySelectorAll("loomi-resizable-panel"));
    expect(left.style.flex).to.equal("0 0 50%");
    expect(right.style.flex).to.equal("0 0 50%");
  });

  it("honors default-size percentages", async () => {
    const group = await fixture<LoomiResizablePanelGroup>(html`
      <loomi-resizable-panel-group style="width:400px;height:200px">
        <loomi-resizable-panel default-size="25%">One</loomi-resizable-panel>
        <loomi-resizable-handle></loomi-resizable-handle>
        <loomi-resizable-panel default-size="75%">Two</loomi-resizable-panel>
      </loomi-resizable-panel-group>
    `);

    await group.updateComplete;

    const [left, right] = Array.from(group.querySelectorAll("loomi-resizable-panel"));
    expect(left.style.flex).to.equal("0 0 25%");
    expect(right.style.flex).to.equal("0 0 75%");
  });

  it("emits loomi-layout-change when a handle is resized via keyboard", async () => {
    const group = await fixture<LoomiResizablePanelGroup>(html`
      <loomi-resizable-panel-group style="width:400px;height:200px">
        <loomi-resizable-panel panel-id="left" default-size="50">One</loomi-resizable-panel>
        <loomi-resizable-handle></loomi-resizable-handle>
        <loomi-resizable-panel panel-id="right" default-size="50">Two</loomi-resizable-panel>
      </loomi-resizable-panel-group>
    `);

    await group.updateComplete;

    const handle = group.querySelector("loomi-resizable-handle")!;
    const grip = handle.shadowRoot!.querySelector(".loomi-handle") as HTMLElement;

    const layoutChange = oneEvent(group, "loomi-layout-change");
    grip.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    const { detail } = await layoutChange;

    expect(detail.sizes).to.have.lengthOf(2);
    expect(detail.layout.left).to.be.greaterThan(50);
    expect(detail.layout.right).to.be.lessThan(50);
  });

  it("renders a visible grip when with-handle is set", async () => {
    const group = await fixture<LoomiResizablePanelGroup>(html`
      <loomi-resizable-panel-group style="width:400px;height:200px">
        <loomi-resizable-panel>One</loomi-resizable-panel>
        <loomi-resizable-handle with-handle></loomi-resizable-handle>
        <loomi-resizable-panel>Two</loomi-resizable-panel>
      </loomi-resizable-panel-group>
    `);

    const handle = group.querySelector("loomi-resizable-handle")!;
    expect(handle.shadowRoot!.querySelector(".loomi-grip")).to.exist;
  });
});
