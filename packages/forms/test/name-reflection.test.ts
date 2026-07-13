import { expect } from "@open-wc/testing";
import "../../button/dist/loomi-button.js";
import "../../checkbox/dist/loomi-checkbox.js";
import "../../checkcards/dist/loomi-checkcards.js";
import "../../otp/dist/loomi-otp.js";
import "../../colorpicker/dist/loomi-colorpicker.js";
import "../../datepicker/dist/loomi-datepicker.js";
import "../../filepicker/dist/loomi-filepicker.js";
import "../../input/dist/loomi-input.js";
import "../../number/dist/loomi-number.js";
import "../../password/dist/loomi-password.js";
import "../../radio/dist/loomi-radio.js";
import "../../rating/dist/loomi-rating.js";
import "../../select/dist/loomi-select.js";
import "../../slider/dist/loomi-slider.js";
import "../../sortable/dist/loomi-sortable.js";
import "../../tag-input/dist/loomi-tag-input.js";
import "../../timepicker/dist/loomi-timepicker.js";
import "../../toggle/dist/loomi-toggle.js";

const NAMED_FORM_TAGS = [
  "loomi-button",
  "loomi-checkbox",
  "loomi-checkcards",
  "loomi-otp",
  "loomi-colorpicker",
  "loomi-datepicker",
  "loomi-filepicker",
  "loomi-input",
  "loomi-number",
  "loomi-password",
  "loomi-radio",
  "loomi-rating",
  "loomi-select",
  "loomi-slider",
  "loomi-sortable",
  "loomi-tag-input",
  "loomi-timepicker",
  "loomi-toggle",
];

describe("named form controls", () => {
  for (const tag of NAMED_FORM_TAGS) {
    it(`${tag} reflects programmatic name changes`, async () => {
      const el = document.createElement(tag) as HTMLElement & { name: string; updateComplete?: Promise<unknown> };
      document.body.append(el);
      el.name = "field";
      await el.updateComplete;

      expect(el.getAttribute("name")).to.equal("field");
      el.remove();
    });
  }
});
