import { expect, fixture } from "@open-wc/testing";
import { html as staticHtml, unsafeStatic } from "lit/static-html.js";
import "../../input/dist/loomi-input.js";
import "../../password/dist/loomi-password.js";
import "../../textarea/dist/loomi-textarea.js";
import "../../number/dist/loomi-number.js";
import "../../otp/dist/loomi-otp.js";
import "../../select/dist/loomi-select.js";
import "../../datepicker/dist/loomi-datepicker.js";
import "../../timepicker/dist/loomi-timepicker.js";
import "../../autocomplete/dist/loomi-autocomplete.js";
import "../../tag-input/dist/loomi-tag-input.js";
import "../../text-editor/dist/loomi-text-editor.js";

// Native <input> coerces whatever is assigned to `value` to a string (null → ""), so
// frameworks and app code routinely assign numbers. Every control must do the same, and
// must keep rendering.
type Control = HTMLElement & { value: unknown; updateComplete: Promise<boolean> };

const ASSIGNED: [unknown, string][] = [
  [7, "7"],
  [null, ""],
  [undefined, ""],
  [true, "true"],
];

/** Controls whose `value` is free text, so the coerced string comes back verbatim. */
const TEXT_CONTROLS = [
  ["loomi-input", ""],
  ["loomi-input", 'mask="99/99"'],
  ["loomi-password", ""],
  ["loomi-textarea", ""],
  ["loomi-autocomplete", ""],
  ["loomi-text-editor", ""],
] as const;

/** Controls that parse or filter the value: assert only that it's a string and nothing throws. */
const PARSING_CONTROLS = [
  "loomi-input numeric",
  "loomi-input numeric min=1 max=10",
  "loomi-number",
  "loomi-otp",
  "loomi-select",
  "loomi-datepicker",
  "loomi-timepicker",
  "loomi-tag-input",
];

async function mount(markup: string): Promise<Control> {
  const [tag, ...attrs] = markup.split(" ");
  return fixture<Control>(
    staticHtml`<${unsafeStatic(tag)} ${unsafeStatic(attrs.join(" "))}></${unsafeStatic(tag)}>`,
  );
}

const rendered = (el: Control) => (el.shadowRoot?.childElementCount ?? 0) > 0;

describe("control value coercion", () => {
  for (const [tag, attrs] of TEXT_CONTROLS) {
    for (const [assigned, expected] of ASSIGNED) {
      it(`<${tag}${attrs ? ` ${attrs}` : ""}> coerces ${String(assigned)} to "${expected}"`, async () => {
        const el = await mount(`${tag} ${attrs}`);
        el.value = assigned;
        expect(el.value, "read back immediately, like a native input").to.equal(
          attrs.startsWith("mask") ? el.value : expected,
        );
        await el.updateComplete;
        expect(el.value).to.be.a("string");
        if (!attrs) expect(el.value).to.equal(expected);
        expect(rendered(el)).to.be.true;
      });
    }
  }

  for (const markup of PARSING_CONTROLS) {
    for (const [assigned] of ASSIGNED) {
      it(`<${markup}> accepts ${String(assigned)} without throwing`, async () => {
        const el = await mount(markup);
        el.value = assigned;
        await el.updateComplete;
        expect(el.value).to.be.a("string");
        expect(rendered(el)).to.be.true;
      });
    }
  }

  it("<loomi-input numeric> shows an assigned number in its field", async () => {
    const el = await mount("loomi-input numeric");
    el.value = 10;
    await el.updateComplete;
    expect(el.value).to.equal("10");
    expect(el.shadowRoot!.querySelector("input")!.value).to.equal("10");
  });

  it("<loomi-input numeric min=1 max=10> keeps an assigned number as its string", async () => {
    const el = await mount("loomi-input numeric min=1 max=10");
    el.value = 5.5;
    await el.updateComplete;
    expect(el.value).to.equal("5.5");
  });

  it("<loomi-input mask> masks an assigned number", async () => {
    const el = await mount('loomi-input mask="99/99"');
    el.value = 1234;
    await el.updateComplete;
    expect(el.value).to.equal("12/34");
  });

  it("<loomi-number> and <loomi-otp> keep an assigned number", async () => {
    const num = await mount("loomi-number");
    num.value = 7;
    await num.updateComplete;
    expect(num.value).to.equal("7");

    const otp = await mount("loomi-otp");
    otp.value = 1234;
    await otp.updateComplete;
    expect(otp.value).to.equal("1234");
  });

  it("<loomi-input> keeps rendering when a custom mask throws", async () => {
    const el = await mount("loomi-input");
    (el as unknown as { dynamicMask: () => string }).dynamicMask = () => {
      throw new Error("bad mask");
    };
    el.value = "abc";
    await el.updateComplete;
    expect(el.value).to.equal("abc");
    expect(rendered(el)).to.be.true;
  });
});
