import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-input.js";
import "../../password/dist/loomi-password.js";
import "../../textarea/dist/loomi-textarea.js";

type Field = HTMLElement & {
  value: string;
  insertText(text: string): void;
  selectionStart: number | null;
  selectionEnd: number | null;
  setSelectionRange(start: number, end: number): void;
  updateComplete: Promise<boolean>;
};

for (const tag of ["loomi-input", "loomi-password", "loomi-textarea"]) {
  describe(`${tag} caret API`, () => {
    const mount = async () => {
      const el = document.createElement(tag) as Field;
      el.value = "x = ";
      await fixture(html`<div></div>`).then((host) => host.append(el));
      await el.updateComplete;
      return el;
    };

    it("inserts at the caret and fires input once", async () => {
      const el = await mount();
      el.setSelectionRange(2, 2);
      let inputs = 0;
      el.addEventListener("input", () => inputs++);
      el.insertText("y");
      expect(el.value).to.equal("x y= ");
      expect(inputs).to.equal(1);
      expect(el.selectionStart, "caret after the insert").to.equal(3);
    });

    it("replaces the selected range", async () => {
      const el = await mount();
      el.setSelectionRange(0, 1);
      el.insertText("\\frac{a}{b}");
      expect(el.value).to.equal("\\frac{a}{b} = ");
    });

    it("forwards selectionStart and selectionEnd", async () => {
      const el = await mount();
      el.selectionStart = 1;
      el.selectionEnd = 3;
      expect([el.selectionStart, el.selectionEnd]).to.deep.equal([1, 3]);
    });

    it("keeps the caret after focus moves to an outside button", async () => {
      const el = await mount();
      el.setSelectionRange(4, 4);
      const button = document.createElement("button");
      document.body.append(button);
      button.focus();
      el.insertText("1");
      button.remove();
      expect(el.value).to.equal("x = 1");
    });
  });
}

describe("loomi-input caret API on an email field", () => {
  it("appends, since email inputs have no caret API", async () => {
    const el = await fixture<Field>(html`<loomi-input type="email" value="a@b"></loomi-input>`);
    el.insertText(".c");
    expect(el.value).to.equal("a@b.c");
  });
});
