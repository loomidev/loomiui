import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-otp.js";
import type { LoomiOtp } from "../dist/index.js";

const boxes = (el: LoomiOtp): HTMLInputElement[] =>
  Array.from(el.shadowRoot!.querySelectorAll<HTMLInputElement>('[part="box"]'));
const row = (el: LoomiOtp): HTMLElement =>
  el.shadowRoot!.querySelector<HTMLElement>('[part="boxes"]')!;
const gap = (el: LoomiOtp): number => parseFloat(getComputedStyle(row(el)).columnGap);

describe("loomi-otp fluid", () => {
  it("exposes the row and each box as parts", async () => {
    const el = await fixture<LoomiOtp>(html`<loomi-otp total-digits="6"></loomi-otp>`);
    expect(row(el)).to.exist;
    expect(boxes(el)).to.have.lengthOf(6);
  });

  it("fits six big boxes in a 320px host with no overflow", async () => {
    const el = await fixture<LoomiOtp>(
      html`<loomi-otp fluid size="big" total-digits="6" style="width: 320px"></loomi-otp>`,
    );
    const host = el.getBoundingClientRect();
    const all = boxes(el);
    expect(row(el).scrollWidth).to.be.at.most(320);
    expect(all.at(-1)!.getBoundingClientRect().right).to.be.at.most(host.right + 0.5);
    const widths = all.map((b) => b.getBoundingClientRect().width);
    // Shrunk evenly, below the 60px big size, and still square.
    for (const w of widths) expect(w).to.be.closeTo(widths[0], 0.5);
    expect(widths[0]).to.be.below(60);
    expect(all[0].getBoundingClientRect().height).to.be.closeTo(widths[0], 0.5);
  });

  it("never grows past the size maximum when there is room", async () => {
    const el = await fixture<LoomiOtp>(
      html`<loomi-otp fluid size="big" total-digits="6" style="width: 800px"></loomi-otp>`,
    );
    expect(boxes(el)[0].getBoundingClientRect().width).to.be.closeTo(60, 0.5);
  });

  it("keeps the gap fixed while the boxes shrink", async () => {
    const wide = await fixture<LoomiOtp>(
      html`<loomi-otp fluid size="big" total-digits="6" style="width: 800px"></loomi-otp>`,
    );
    const narrow = await fixture<LoomiOtp>(
      html`<loomi-otp fluid size="big" total-digits="6" style="width: 320px"></loomi-otp>`,
    );
    expect(gap(narrow)).to.equal(gap(wide));
    const [a, b] = boxes(narrow).map((x) => x.getBoundingClientRect());
    expect(b.left - a.right).to.be.closeTo(gap(wide), 0.5);
  });

  it("lets --loomi-otp-size on the host win over the size class", async () => {
    const el = await fixture<LoomiOtp>(
      html`<loomi-otp size="big" total-digits="4" style="--loomi-otp-size: 30px"></loomi-otp>`,
    );
    expect(boxes(el)[0].getBoundingClientRect().width).to.be.closeTo(30, 0.5);
  });

  it("caps fluid boxes at the host override", async () => {
    const el = await fixture<LoomiOtp>(
      html`<loomi-otp fluid size="big" total-digits="4" style="--loomi-otp-size: 30px; width: 800px"></loomi-otp>`,
    );
    expect(boxes(el)[0].getBoundingClientRect().width).to.be.closeTo(30, 0.5);
  });

  it("fits in RTL, with the first box on the right", async () => {
    const el = await fixture<LoomiOtp>(
      html`<loomi-otp dir="rtl" fluid size="big" total-digits="6" style="width: 320px"></loomi-otp>`,
    );
    const host = el.getBoundingClientRect();
    const rects = boxes(el).map((b) => b.getBoundingClientRect());
    expect(row(el).scrollWidth).to.be.at.most(320);
    expect(rects[0].right).to.be.closeTo(host.right, 0.5);
    expect(rects[0].left).to.be.greaterThan(rects[5].left);
    expect(rects[5].left).to.be.at.least(host.left - 0.5);
  });
});
