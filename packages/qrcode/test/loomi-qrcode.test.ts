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
