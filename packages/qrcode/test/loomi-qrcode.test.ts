import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-qrcode.js";
import type { LoomiQrCode } from "../dist/index.js";
import { generateQrCode } from "../dist/qrcode-generator.js";

describe("loomi-qrcode", () => {
  it("renders an SVG QR code from a url", async () => {
    const el = await fixture<LoomiQrCode>(html`<loomi-qrcode url="https://loomiui.com"></loomi-qrcode>`);
    const svg = el.shadowRoot!.querySelector("svg")!;
    const modules = el.shadowRoot!.querySelector(".loomi-qrcode-modules")!;

    expect(svg.getAttribute("role")).to.equal("img");
    expect(svg.getAttribute("aria-label")).to.equal("QR code for https://loomiui.com");
    expect(modules).to.exist;
  });

  it("shows optional corner borders and scan beam", async () => {
    const el = await fixture<LoomiQrCode>(
      html`<loomi-qrcode url="https://loomiui.com" corner-borders gradient-scan></loomi-qrcode>`,
    );

    expect(el.shadowRoot!.querySelectorAll(".loomi-corner")).to.have.length(4);
    expect(el.shadowRoot!.querySelector(".loomi-scan")).to.exist;
  });

  it("defaults the scan animation to loop infinitely", async () => {
    const el = await fixture<LoomiQrCode>(
      html`<loomi-qrcode url="https://loomiui.com" gradient-scan></loomi-qrcode>`,
    );

    const wrapper = el.shadowRoot!.querySelector<HTMLElement>(".loomi-qrcode")!;
    expect(wrapper.style.getPropertyValue("--_loomi-qrcode-scan-count").trim()).to.equal("infinite");
  });

  it("passes through a finite scan-count as the iteration count", async () => {
    const el = await fixture<LoomiQrCode>(
      html`<loomi-qrcode url="https://loomiui.com" gradient-scan scan-count="3"></loomi-qrcode>`,
    );

    const wrapper = el.shadowRoot!.querySelector<HTMLElement>(".loomi-qrcode")!;
    expect(wrapper.style.getPropertyValue("--_loomi-qrcode-scan-count").trim()).to.equal("3");
  });

  it("falls back to infinite for an invalid scan-count", async () => {
    const el = await fixture<LoomiQrCode>(
      html`<loomi-qrcode url="https://loomiui.com" gradient-scan scan-count="not-a-number"></loomi-qrcode>`,
    );

    const wrapper = el.shadowRoot!.querySelector<HTMLElement>(".loomi-qrcode")!;
    expect(wrapper.style.getPropertyValue("--_loomi-qrcode-scan-count").trim()).to.equal("infinite");
  });

  it("uses value when url is absent", async () => {
    const el = await fixture<LoomiQrCode>(html`<loomi-qrcode value="hello"></loomi-qrcode>`);

    expect(el.shadowRoot!.querySelector("svg")!.getAttribute("aria-label")).to.equal("QR code for hello");
  });

  it("renders a placeholder when no value is provided", async () => {
    const el = await fixture<LoomiQrCode>(html`<loomi-qrcode></loomi-qrcode>`);

    expect(el.shadowRoot!.querySelector(".loomi-qrcode")!.classList.contains("empty")).to.be.true;
    expect(el.shadowRoot!.querySelector("svg")).to.not.exist;
  });

  it("adds a generated loomi name class to the host", async () => {
    const el = await fixture<LoomiQrCode>(html`<loomi-qrcode url="https://loomiui.com"></loomi-qrcode>`);

    expect([...el.classList].some((cls) => /^loomi-qrcode-[a-z0-9]{5}$/.test(cls))).to.be.true;
  });

  it("encodes longer values that require QR version information", () => {
    const qr = generateQrCode("x".repeat(110), "M");

    expect(qr.version).to.equal(7);
    expect(qr.size).to.equal(45);
    expect(qr.modules).to.have.length(45);
  });
});
