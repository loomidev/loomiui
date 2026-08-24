import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiStatistic } from "../dist/index.js";

describe("loomi-statistic", () => {
  it("renders shadow content", async () => {
    const el = await fixture(html`<loomi-statistic ></loomi-statistic>`);
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot!.childElementCount).to.be.greaterThan(0);
  });

  it("renders its label and number", async () => {
    const el = await fixture<LoomiStatistic>(
      html`<loomi-statistic label="Revenue" number="1,204"></loomi-statistic>`,
    );
    expect(el.shadowRoot!.querySelector(".loomi-label")!.textContent).to.contain("Revenue");
    expect(el.shadowRoot!.querySelector(".loomi-number")!.textContent).to.contain("1,204");
  });

  it("renders a currency symbol alongside the number", async () => {
    const el = await fixture<LoomiStatistic>(
      html`<loomi-statistic label="Revenue" number="99" currency="$"></loomi-statistic>`,
    );
    expect(el.shadowRoot!.querySelector(".loomi-currency")!.textContent).to.contain("$");
  });

  it("moves the currency to the right when asked", async () => {
    const el = await fixture<LoomiStatistic>(html`
      <loomi-statistic
        label="Revenue"
        number="99"
        currency="kr"
        currency-position="right"
      ></loomi-statistic>
    `);
    expect(el.shadowRoot!.querySelector(".loomi-number")!.classList.contains("currency-right")).to
      .be.true;
  });
});
