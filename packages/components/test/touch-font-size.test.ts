import { expect } from "@open-wc/testing";
import { executeServerCommand, setViewport } from "@web/test-runner-commands";
import "../../input/dist/loomi-input.js";
import "../../number/dist/loomi-number.js";
import "../../password/dist/loomi-password.js";
import "../../textarea/dist/loomi-textarea.js";
import "../../select/dist/loomi-select.js";
import "../../autocomplete/dist/loomi-autocomplete.js";
import "../../tag-input/dist/loomi-tag-input.js";
import "../../datepicker/dist/loomi-datepicker.js";
import "../../timepicker/dist/loomi-timepicker.js";
import "../../countries/dist/loomi-countries.js";
import "../../timezonepicker/dist/loomi-timezonepicker.js";
import "../../otp/dist/loomi-otp.js";
import "../../creditcard/dist/loomi-creditcard.js";
import "../../emoji-picker/dist/loomi-emoji-picker.js";
import "../../filter-builder/dist/loomi-filter-builder.js";
import "../../command-palette/dist/loomi-command-palette.js";
import "../../chat/dist/loomi-chat-window.js";
import "../../text-editor/dist/loomi-text-editor.js";
import "../../data-grid/dist/loomi-data-grid.js";
import { filteringModule } from "../../data-grid/dist/modules/filtering.js";

/**
 * iOS Safari zooms the page when a form control under 16px takes focus. On a coarse
 * pointer every text control in the library (fields, search boxes, editors, composers)
 * must compute to at least 16px; on desktop the size scale stays as it was
 * (regular = 0.875rem).
 */
const fields = [
  ["loomi-input", "input"],
  ["loomi-number", "input"],
  ["loomi-password", "input"],
  ["loomi-textarea", "textarea"],
  ["loomi-autocomplete", "input"],
  ["loomi-tag-input", "input"],
  ["loomi-datepicker", "[part=input]"],
  ["loomi-timepicker", ".loomi-field"],
  ["loomi-countries", ".loomi-trigger"],
  ["loomi-timezonepicker", ".loomi-trigger"],
  ["loomi-select", ".loomi-trigger"],
  ["loomi-otp", "input"],
  ["loomi-creditcard", ".loomi-cc-number"],
  ["loomi-creditcard", ".loomi-cc-name"],
  ["loomi-creditcard", ".loomi-cc-expiry"],
  ["loomi-creditcard", ".loomi-cc-cvc"],
  ["loomi-creditcard.inline", ".loomi-cc-number"],
  ["loomi-creditcard.inline", ".loomi-cc-expiry"],
  ["loomi-creditcard.inline", ".loomi-cc-cvc"],
  ["loomi-emoji-picker", ".loomi-search"],
  ["loomi-filter-builder", "select"],
  ["loomi-filter-builder", "input"],
  ["loomi-command-palette", ".search"],
  ["loomi-chat-window", "textarea"],
  ["loomi-text-editor", "[contenteditable]"],
  ["loomi-data-grid", "input[type=search]"],
  ["loomi-data-grid", ".pagination select"],
] as const;

/** Fields on core's control size scale: 0.875rem at the default size on desktop. */
const ON_SCALE = new Set([
  "loomi-input",
  "loomi-number",
  "loomi-password",
  "loomi-autocomplete",
  "loomi-tag-input",
  "loomi-datepicker",
  "loomi-timepicker",
  "loomi-countries",
  "loomi-timezonepicker",
  "loomi-select",
]);

const markup = `
  <loomi-input placeholder="Name"></loomi-input>
  <loomi-number></loomi-number>
  <loomi-password placeholder="Password"></loomi-password>
  <loomi-textarea placeholder="Notes"></loomi-textarea>
  <loomi-autocomplete placeholder="Search"></loomi-autocomplete>
  <loomi-tag-input placeholder="Tags"></loomi-tag-input>
  <loomi-datepicker placeholder="Date"></loomi-datepicker>
  <loomi-timepicker placeholder="Time"></loomi-timepicker>
  <loomi-countries></loomi-countries>
  <loomi-timezonepicker></loomi-timezonepicker>
  <loomi-select searchable placeholder="Status"></loomi-select>
  <loomi-otp size="tiny"></loomi-otp>
  <loomi-creditcard></loomi-creditcard>
  <loomi-creditcard class="inline" variant="inline"></loomi-creditcard>
  <loomi-emoji-picker inline></loomi-emoji-picker>
  <loomi-filter-builder></loomi-filter-builder>
  <loomi-command-palette open></loomi-command-palette>
  <loomi-chat-window></loomi-chat-window>
  <loomi-text-editor></loomi-text-editor>
  <loomi-data-grid pagination></loomi-data-grid>
`;

async function render(extra = ""): Promise<HTMLElement> {
  const wrapper = document.createElement("div");
  // A page with a 14px base, so controls that inherit their size would trip iOS zoom too.
  wrapper.style.fontSize = "14px";
  wrapper.innerHTML = markup + extra;
  document.body.append(wrapper);
  const select = wrapper.querySelector("loomi-select") as HTMLElement & {
    data: unknown;
    updateComplete: Promise<unknown>;
  };
  select.data = [
    { label: "Active", value: "active" },
    { label: "Paused", value: "paused" },
  ];
  const builder = wrapper.querySelector("loomi-filter-builder") as HTMLElement & {
    fields: unknown;
    rules: unknown;
  };
  builder.fields = [{ key: "name", label: "Name", type: "text" }];
  builder.rules = [{ id: "r1", field: "name", operator: "contains", value: "" }];
  const palette = wrapper.querySelector("loomi-command-palette") as HTMLElement & {
    items: unknown;
  };
  palette.items = [{ id: "a", label: "Open" }];
  const grid = wrapper.querySelector("loomi-data-grid") as HTMLElement & {
    columns: unknown;
    data: unknown;
    modules: unknown;
  };
  grid.columns = [{ key: "name", label: "Name" }];
  grid.data = [{ id: 1, name: "Ada" }];
  grid.modules = [filteringModule()];
  await Promise.all(
    Array.from(wrapper.children).map(
      (child) => (child as { updateComplete?: Promise<unknown> }).updateComplete,
    ),
  );
  return wrapper;
}

function fontSize(wrapper: HTMLElement, tag: string, selector: string): number {
  const target = wrapper.querySelector(tag)!.shadowRoot!.querySelector(selector);
  expect(target, `${tag} ${selector}`).to.exist;
  return parseFloat(getComputedStyle(target!).fontSize);
}

async function searchBoxSize(wrapper: HTMLElement): Promise<number> {
  const select = wrapper.querySelector("loomi-select") as HTMLElement & {
    updateComplete: Promise<unknown>;
  };
  select.shadowRoot!.querySelector<HTMLElement>(".loomi-trigger")!.click();
  await select.updateComplete;
  const search = select.shadowRoot!.querySelector(".loomi-search");
  expect(search, "select search box").to.exist;
  return parseFloat(getComputedStyle(search!).fontSize);
}

describe("touch font size floor", () => {
  let wrapper: HTMLElement | undefined;
  afterEach(() => wrapper?.remove());

  describe("coarse pointer at 375px", () => {
    before(async function () {
      const supported = await executeServerCommand("emulate-coarse-pointer", { enabled: true });
      if (!supported) this.skip();
      await setViewport({ width: 375, height: 812 });
    });
    after(async () => {
      await executeServerCommand("emulate-coarse-pointer", { enabled: false });
      await setViewport({ width: 800, height: 600 });
    });

    it("matches (pointer: coarse)", () => {
      expect(matchMedia("(pointer: coarse)").matches).to.equal(true);
    });

    it("renders every field's text box at 16px or more", async () => {
      wrapper = await render();
      for (const [tag, selector] of fields) {
        expect(fontSize(wrapper, tag, selector), `${tag} ${selector}`).to.be.at.least(16);
      }
    });

    it("renders a searchable select's search box at 16px or more", async () => {
      wrapper = await render();
      expect(await searchBoxSize(wrapper)).to.be.at.least(16);
    });

    it("keeps larger sizes above the floor", async () => {
      wrapper = await render(`<loomi-input size="big" class="big"></loomi-input>`);
      const big = wrapper.querySelector("loomi-input.big")!.shadowRoot!.querySelector("input")!;
      expect(parseFloat(getComputedStyle(big).fontSize)).to.equal(18);
    });

    it("lets a page move the floor with --loomi-control-touch-font-size", async () => {
      wrapper = await render();
      wrapper.style.setProperty("--loomi-control-touch-font-size", "17px");
      expect(fontSize(wrapper, "loomi-input", "input")).to.equal(17);
    });
  });

  describe("fine pointer (desktop)", () => {
    it("keeps the regular 0.875rem size", async () => {
      expect(matchMedia("(pointer: coarse)").matches).to.equal(false);
      wrapper = await render();
      for (const [tag, selector] of fields) {
        if (!ON_SCALE.has(tag)) continue;
        expect(fontSize(wrapper, tag, selector), tag).to.equal(14);
      }
      expect(await searchBoxSize(wrapper)).to.equal(14);
    });
  });
});
