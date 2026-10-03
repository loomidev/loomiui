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

  const desc = (el: LoomiStatistic) => el.shadowRoot!.querySelector<HTMLElement>(".loomi-desc");
  const rect = (el: LoomiStatistic, sel: string) =>
    el.shadowRoot!.querySelector(sel)!.getBoundingClientRect();

  it("hides the description line when neither attribute nor slot is set", async () => {
    const el = await fixture<LoomiStatistic>(
      html`<loomi-statistic label="Revenue" number="99"></loomi-statistic>`,
    );
    expect(getComputedStyle(desc(el)!).display).to.equal("none");
  });

  for (const labelPosition of ["top", "bottom"] as const) {
    for (const iconPosition of ["left", "right"] as const) {
      it(`renders the description under the number (label ${labelPosition}, icon ${iconPosition})`, async () => {
        const el = await fixture<LoomiStatistic>(html`
          <loomi-statistic
            label="Revenue"
            number="99"
            description="vs last month"
            label-position=${labelPosition}
            icon-position=${iconPosition}
          >
            <span slot="icon" style="display:inline-block">*</span>
          </loomi-statistic>
        `);
        expect(desc(el)!.textContent).to.contain("vs last month");
        const number = rect(el, ".loomi-number");
        const d = rect(el, ".loomi-desc");
        const label = rect(el, ".loomi-label");
        expect(d.top).to.be.at.least(number.bottom - 1);
        if (labelPosition === "top") expect(label.bottom).to.be.at.most(number.top + 1);
        else expect(label.top).to.be.at.least(d.bottom - 1);
        const icon = rect(el, ".loomi-ico");
        if (iconPosition === "left") expect(icon.right).to.be.at.most(d.left);
        else expect(icon.left).to.be.at.least(d.right);
      });
    }
  }

  it("lets the description slot win over the attribute", async () => {
    const el = await fixture<LoomiStatistic>(html`
      <loomi-statistic number="99" description="plain">
        <span slot="description" class="trend">▲ 12%</span>
      </loomi-statistic>
    `);
    const slot = desc(el)!.querySelector<HTMLSlotElement>("slot")!;
    expect(slot.assignedElements()[0].classList.contains("trend")).to.be.true;
    expect(getComputedStyle(desc(el)!).display).not.to.equal("none");
    expect(rect(el, ".loomi-desc").top).to.be.at.least(rect(el, ".loomi-number").bottom - 1);
  });

  it("hides the description while the spinner shows", async () => {
    const el = await fixture<LoomiStatistic>(
      html`<loomi-statistic label="Revenue" description="vs last month" show-spinner></loomi-statistic>`,
    );
    expect(el.shadowRoot!.querySelector(".loomi-spinner")).to.exist;
    expect(desc(el)).to.be.null;
    el.showSpinner = false;
    el.number = "99";
    await el.updateComplete;
    expect(desc(el)!.textContent).to.contain("vs last month");
  });

  it("mirrors the layout in RTL", async () => {
    const el = await fixture<LoomiStatistic>(html`
      <div dir="rtl">
        <loomi-statistic label="Revenue" number="99" description="vs last month">
          <span slot="icon" style="display:inline-block">*</span>
        </loomi-statistic>
      </div>
    `).then((wrap) => wrap.querySelector<LoomiStatistic>("loomi-statistic")!);
    await el.updateComplete;
    const icon = rect(el, ".loomi-ico");
    const d = rect(el, ".loomi-desc");
    expect(icon.left).to.be.at.least(d.right);
    expect(d.top).to.be.at.least(rect(el, ".loomi-number").bottom - 1);
  });

  it("puts the icon in a tinted circle with icon-background", async () => {
    const el = await fixture<LoomiStatistic>(html`
      <loomi-statistic number="99" icon-color="rgb(21, 128, 61)" icon-background="rgb(220, 252, 231)">
        <span slot="icon">*</span>
      </loomi-statistic>
    `);
    const ico = el.shadowRoot!.querySelector<HTMLElement>(".loomi-ico")!;
    const cs = getComputedStyle(ico);
    expect(cs.backgroundColor).to.equal("rgb(220, 252, 231)");
    expect(cs.color).to.equal("rgb(21, 128, 61)");
    expect(cs.borderTopLeftRadius).to.not.equal("0px");
  });

  it("collapses the icon wrapper when no icon is slotted", async () => {
    const el = await fixture<LoomiStatistic>(
      html`<loomi-statistic label="Revenue" number="99"></loomi-statistic>`,
    );
    await el.updateComplete; // hasIcon is measured in firstUpdated
    const ico = el.shadowRoot!.querySelector<HTMLElement>(".loomi-ico")!;
    expect(getComputedStyle(ico).display).to.equal("none");
  });
});
