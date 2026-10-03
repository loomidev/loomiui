import { html, fixture, expect } from "@open-wc/testing";
import { accessibleName } from "../../../test/accessible-name.js";
import "../../input/dist/loomi-input.js";
import "../../select/dist/loomi-select.js";
import "../../datepicker/dist/loomi-datepicker.js";
import "../../timepicker/dist/loomi-timepicker.js";
import "../../autocomplete/dist/loomi-autocomplete.js";
import "../../tag-input/dist/loomi-tag-input.js";
import "../../number/dist/loomi-number.js";
import "../../otp/dist/loomi-otp.js";

/**
 * `label-position="top"` across the form controls: one plain label above the box,
 * rendered like <loomi-input>'s, naming the control's trigger.
 */
const CONTROLS: Array<{ tag: string; box: string; trigger: string }> = [
  { tag: "loomi-input", box: ".loomi-field", trigger: "input" },
  { tag: "loomi-select", box: ".loomi-trigger", trigger: ".loomi-trigger" },
  { tag: "loomi-datepicker", box: ".loomi-field", trigger: ".loomi-field" },
  { tag: "loomi-timepicker", box: ".loomi-field", trigger: ".loomi-field" },
  { tag: "loomi-autocomplete", box: ".loomi-field", trigger: "input" },
  { tag: "loomi-tag-input", box: ".loomi-field", trigger: "input" },
  { tag: "loomi-number", box: ".loomi-field", trigger: "input" },
  { tag: "loomi-otp", box: "[part='boxes']", trigger: "[part='boxes']" },
];

const q = (el: Element, sel: string) => el.shadowRoot!.querySelector(sel) as HTMLElement;

async function row(): Promise<HTMLElement[]> {
  const wrap = await fixture<HTMLDivElement>(html`
    <div style="display: flex; align-items: flex-start; gap: 12px; width: 1600px">
      ${CONTROLS.map(
        ({ tag }) =>
          html`<div style="flex: 1">${document.createRange().createContextualFragment(`<${tag} label="Field" label-position="top"></${tag}>`)}</div>`,
      )}
    </div>
  `);
  const els = CONTROLS.map(({ tag }) => wrap.querySelector(tag) as HTMLElement);
  await Promise.all(
    els.map((el) => (el as unknown as { updateComplete: Promise<unknown> }).updateComplete),
  );
  return els;
}

describe('label-position="top"', () => {
  it("renders one plain label above the box, outside its border, on every control", async () => {
    const els = await row();
    els.forEach((el, i) => {
      const { tag, box } = CONTROLS[i];
      const label = q(el, ".loomi-top-label");
      expect(label, tag).to.exist;
      expect(label.textContent!.trim(), tag).to.equal("Field");
      // No floating/inside label alongside it.
      expect(q(el, ".loomi-label"), tag).to.equal(null);
      expect(label.getBoundingClientRect().bottom, tag).to.be.at.most(
        q(el, box).getBoundingClientRect().top,
      );
    });
  });

  it("puts every top label at the same offset and lines the fields up in a row", async () => {
    const els = await row();
    const metrics = els.map((el, i) => {
      const host = el.getBoundingClientRect();
      const label = q(el, ".loomi-top-label").getBoundingClientRect();
      const box = q(el, CONTROLS[i].box).getBoundingClientRect();
      return {
        tag: CONTROLS[i].tag,
        labelOffset: label.top - host.top,
        labelHeight: label.height,
        labelLeft: label.left - host.left,
        boxTop: box.top,
      };
    });
    const [ref] = metrics;
    for (const m of metrics) {
      expect(Math.abs(m.labelOffset - ref.labelOffset), `${m.tag} label offset`).to.be.below(0.5);
      expect(Math.abs(m.labelHeight - ref.labelHeight), `${m.tag} label height`).to.be.below(0.5);
      expect(Math.abs(m.labelLeft - ref.labelLeft), `${m.tag} label start`).to.be.below(0.5);
      expect(Math.abs(m.boxTop - ref.boxTop), `${m.tag} field top`).to.be.below(0.5);
    }
  });

  it("names each control's trigger with the label", async () => {
    const els = await row();
    els.forEach((el, i) => {
      const trigger = q(el, CONTROLS[i].trigger) as HTMLInputElement;
      expect(accessibleName(trigger), CONTROLS[i].tag).to.equal("Field");
    });
  });

  it("keeps the label's required marker and the default floating label otherwise", async () => {
    for (const { tag } of CONTROLS.filter((c) => c.tag !== "loomi-otp")) {
      const wrap = await fixture<HTMLDivElement>(
        html`<div>${document.createRange().createContextualFragment(`<${tag} label="Field" label-position="top" required></${tag}>`)}</div>`,
      );
      const el = wrap.firstElementChild as HTMLElement;
      await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
      expect(q(el, ".loomi-top-label .loomi-req"), tag).to.exist;

      const plain = await fixture<HTMLDivElement>(
        html`<div>${document.createRange().createContextualFragment(`<${tag} label="Field"></${tag}>`)}</div>`,
      );
      const p = plain.firstElementChild as HTMLElement;
      await (p as unknown as { updateComplete: Promise<unknown> }).updateComplete;
      expect(q(p, ".loomi-top-label"), tag).to.equal(null);
      expect(q(p, ".loomi-label"), tag).to.exist;
    }
  });
});
