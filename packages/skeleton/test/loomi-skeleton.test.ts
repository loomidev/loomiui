import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiSkeleton } from "../dist/index.js";

describe("loomi-skeleton", () => {
  it("renders a single text placeholder by default", async () => {
    const el = await fixture<LoomiSkeleton>(html`<loomi-skeleton></loomi-skeleton>`);
    const bars = el.shadowRoot!.querySelectorAll(".loomi-skeleton");

    expect(bars).to.have.length(1);
    expect(bars[0].getAttribute("role")).to.equal("status");
    expect(bars[0].getAttribute("aria-label")).to.equal("Loading");
    expect(bars[0].classList.contains("shimmer")).to.be.true;
  });

  it("supports a custom accessible name", async () => {
    const el = await fixture<LoomiSkeleton>(
      html`<loomi-skeleton label="Fetching your data"></loomi-skeleton>`,
    );
    const bar = el.shadowRoot!.querySelector(".loomi-skeleton")!;

    expect(bar.getAttribute("aria-label")).to.equal("Fetching your data");
  });

  it("sizes a circle variant from width when height is unset", async () => {
    const el = await fixture<LoomiSkeleton>(
      html`<loomi-skeleton variant="circle" width="2.5rem"></loomi-skeleton>`,
    );
    const bar = el.shadowRoot!.querySelector<HTMLElement>(".loomi-skeleton")!;

    expect(bar.style.width).to.equal("2.5rem");
    expect(bar.style.height).to.equal("2.5rem");
    expect(bar.style.borderRadius).to.equal("9999px");
  });

  it("renders stacked lines with a shorter last line for lines > 1", async () => {
    const el = await fixture<LoomiSkeleton>(html`<loomi-skeleton lines="3"></loomi-skeleton>`);
    const group = el.shadowRoot!.querySelector(".loomi-skeleton-lines")!;
    const bars = el.shadowRoot!.querySelectorAll<HTMLElement>(".loomi-skeleton");

    expect(group.getAttribute("role")).to.equal("status");
    expect(bars).to.have.length(3);
    expect(bars[0].getAttribute("role")).to.be.null;
    expect(bars[0].style.width).to.equal("100%");
    expect(bars[2].style.width).to.equal("60%");
  });

  it("ignores lines for non-text variants", async () => {
    const el = await fixture<LoomiSkeleton>(
      html`<loomi-skeleton variant="circle" lines="3"></loomi-skeleton>`,
    );

    expect(el.shadowRoot!.querySelectorAll(".loomi-skeleton")).to.have.length(1);
    expect(el.shadowRoot!.querySelector(".loomi-skeleton-lines")).to.not.exist;
  });

  it("switches to the pulse animation and none disables both", async () => {
    const pulse = await fixture<LoomiSkeleton>(
      html`<loomi-skeleton animation="pulse"></loomi-skeleton>`,
    );
    const none = await fixture<LoomiSkeleton>(
      html`<loomi-skeleton animation="none"></loomi-skeleton>`,
    );

    expect(pulse.shadowRoot!.querySelector(".loomi-skeleton.pulse")).to.exist;
    const noneBar = none.shadowRoot!.querySelector(".loomi-skeleton")!;
    expect(noneBar.classList.contains("shimmer")).to.be.false;
    expect(noneBar.classList.contains("pulse")).to.be.false;
  });

  it("lets width/height/radius override every default", async () => {
    const el = await fixture<LoomiSkeleton>(
      html`<loomi-skeleton
        variant="rect"
        width="4rem"
        height="4rem"
        radius="0.75rem"
      ></loomi-skeleton>`,
    );
    const bar = el.shadowRoot!.querySelector<HTMLElement>(".loomi-skeleton")!;

    expect(bar.style.width).to.equal("4rem");
    expect(bar.style.height).to.equal("4rem");
    expect(bar.style.borderRadius).to.equal("0.75rem");
  });
});
