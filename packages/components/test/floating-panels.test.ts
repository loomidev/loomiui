import { fixture, expect, nextFrame } from "@open-wc/testing";
import "../dist/index.js";

/**
 * Every dropdown-style panel opens in the top layer, so a container with `overflow` — a
 * modal body, a card, a table's scroll wrapper — neither grows a scrollbar to make room
 * for it nor clips it. These panels used to be in-flow `position: absolute` boxes, and
 * opening one inside a modal made the whole modal scroll.
 *
 * Each case is `[tag, markup, open state, panel selector, prepare?]`. The panel is opened
 * through its internal state rather than by simulating each component's own gesture:
 * what's under test is where the panel renders, not how it gets opened (each package's
 * own tests cover that).
 */
type Case = [
  tag: string,
  markup: string,
  openState: string,
  panel: string,
  prepare?: (el: HTMLElement & Record<string, unknown>) => void,
];

const CASES: Case[] = [
  [
    "loomi-select",
    '<loomi-select label="Fruit"><option value="a">Apple</option><option value="b">Banana</option></loomi-select>',
    "open",
    ".loomi-panel",
  ],
  [
    "loomi-countries",
    '<loomi-countries label="Country"></loomi-countries>',
    "open",
    ".loomi-panel",
  ],
  [
    "loomi-timezonepicker",
    '<loomi-timezonepicker label="Timezone"></loomi-timezonepicker>',
    "open",
    ".loomi-panel",
  ],
  ["loomi-datepicker", '<loomi-datepicker label="Date"></loomi-datepicker>', "open", ".loomi-cal"],
  [
    "loomi-timepicker",
    '<loomi-timepicker label="Time"></loomi-timepicker>',
    "open",
    ".loomi-panel",
  ],
  [
    "loomi-colorpicker",
    '<loomi-colorpicker label="Colour" colors="#ef4444,#f59e0b,#22c55e,#3b82f6"></loomi-colorpicker>',
    "open",
    ".loomi-panel",
  ],
  [
    "loomi-autocomplete",
    '<loomi-autocomplete label="City"></loomi-autocomplete>',
    "open",
    ".loomi-panel",
  ],
  [
    "loomi-tag-input",
    '<loomi-tag-input label="Tags"></loomi-tag-input>',
    "autocompleteOpen",
    ".loomi-autocomplete-panel",
    (el) => {
      el.autocompleteData = [{ label: "Accra" }, { label: "Kumasi" }];
      el.draft = "a";
    },
  ],
  [
    "loomi-password",
    '<loomi-password label="Password" prefix-options="personal,admin,service"></loomi-password>',
    "prefixOpen",
    ".loomi-affix-panel",
  ],
  ["loomi-popover", '<loomi-popover title="Help">Details</loomi-popover>', "open", ".loomi-panel"],
];

describe("floating panels", () => {
  for (const [tag, markup, openState, selector, prepare] of CASES) {
    it(`${tag} opens its panel without growing a scrolling ancestor`, async () => {
      const box = await fixture<HTMLDivElement>(
        `<div style="overflow:auto;height:140px;width:360px;padding:8px">${markup}</div>`,
      );
      const el = box.querySelector(tag) as HTMLElement &
        Record<string, unknown> & {
          updateComplete: Promise<boolean>;
        };
      await el.updateComplete;
      prepare?.(el);
      await el.updateComplete;
      const before = { height: box.scrollHeight, width: box.scrollWidth };

      el[openState] = true;
      await el.updateComplete;
      await nextFrame();

      const panel = el.shadowRoot!.querySelector<HTMLElement>(selector);
      expect(panel, `${tag} rendered no ${selector}`).to.exist;
      expect(panel!.matches(":popover-open"), `${tag} panel is not in the top layer`).to.be.true;
      expect(box.scrollHeight).to.equal(before.height);
      expect(box.scrollWidth).to.equal(before.width);
      el[openState] = false;
      await el.updateComplete;
    });
  }
});
