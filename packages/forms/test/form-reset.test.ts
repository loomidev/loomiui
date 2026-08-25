import { expect } from "@open-wc/testing";
import "../dist/index.js";
import "../../rating/dist/loomi-rating.js";
import "../../sortable/dist/loomi-sortable.js";
import "../../tag/dist/loomi-tag.js";

type TestControl = HTMLElement & {
  updateComplete: Promise<unknown>;
  [property: string]: unknown;
};

async function settle(form: HTMLFormElement): Promise<void> {
  await Promise.all(
    Array.from(
      form.querySelectorAll(
        "loomi-input, loomi-password, loomi-autocomplete, loomi-textarea, loomi-text-editor, loomi-number, loomi-tag-input, loomi-checkbox, loomi-radio, loomi-toggle, loomi-select, loomi-checkcards, loomi-emoji-picker, loomi-datepicker, loomi-timepicker, loomi-timezonepicker, loomi-countries, loomi-colorpicker, loomi-slider, loomi-otp, loomi-filepicker, loomi-rating, loomi-tags, loomi-sortable",
      ),
    ).map((control) => (control as TestControl).updateComplete),
  );
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
}

function formFixture(markup: string): HTMLFormElement {
  const form = document.createElement("form");
  form.innerHTML = markup;
  document.body.append(form);
  return form;
}

describe("form reset integration", () => {
  it("restores initial scalar values without firing change events", async () => {
    const form = formFixture(`
      <loomi-input name="input" value="Initial input"></loomi-input>
      <loomi-password name="password" value="Initial password"></loomi-password>
      <loomi-autocomplete name="autocomplete" value="Initial choice"></loomi-autocomplete>
      <loomi-textarea name="textarea" value="Initial notes"></loomi-textarea>
      <loomi-text-editor name="editor" value="Initial content"></loomi-text-editor>
      <loomi-number name="number" value="12"></loomi-number>
      <loomi-tag-input name="tags" value="one,two"></loomi-tag-input>
    `);
    await settle(form);

    let changes = 0;
    form.addEventListener("change", () => changes++);
    for (const control of Array.from(form.children) as TestControl[]) {
      control.value = "Changed";
    }
    await settle(form);

    form.reset();
    await settle(form);

    expect(Object.fromEntries(new FormData(form))).to.deep.equal({
      input: "Initial input",
      password: "Initial password",
      autocomplete: "Initial choice",
      textarea: "Initial notes",
      editor: "Initial content",
      number: "12",
      tags: "one,two",
    });
    expect(changes).to.equal(0);
    form.remove();
  });

  it("restores initial checked states", async () => {
    const form = formFixture(`
      <loomi-checkbox name="checkbox" value="yes" checked>Checkbox</loomi-checkbox>
      <loomi-radio name="radio" value="yes" checked>Radio</loomi-radio>
      <loomi-toggle name="toggle" value="yes" checked>Toggle</loomi-toggle>
    `);
    await settle(form);

    for (const control of Array.from(form.children) as TestControl[]) {
      control.checked = false;
    }
    await settle(form);

    form.reset();
    await settle(form);

    expect(Object.fromEntries(new FormData(form))).to.deep.equal({
      checkbox: "yes",
      radio: "yes",
      toggle: "yes",
    });
    form.remove();
  });

  it("restores initial selections, dates, ranges, and ratings", async () => {
    const form = formFixture(`
      <loomi-select name="select" selected-value="admin">
        <option value="admin">Admin</option>
        <option value="member">Member</option>
      </loomi-select>
      <loomi-emoji-picker name="emoji" selected-value="😀" emojis="😀 😎"></loomi-emoji-picker>
      <loomi-datepicker name="date" selected-value="2026-08-12"></loomi-datepicker>
      <loomi-timepicker name="time" format="24" selected-value="14:30"></loomi-timepicker>
      <loomi-timezonepicker name="timezone" selection="America/Toronto"></loomi-timezonepicker>
      <loomi-countries name="country" selection="CA"></loomi-countries>
      <loomi-colorpicker name="color" selected-value="#336699"></loomi-colorpicker>
      <loomi-slider name="range" range selected="20" selected-end="80"></loomi-slider>
      <loomi-rating name="rating" rating="4"></loomi-rating>
    `);
    await settle(form);

    const controls = Array.from(form.children) as TestControl[];
    controls[0].selectedValue = "member";
    controls[1].selectedValue = "😎";
    controls[2].selectedValue = "2027-01-02";
    controls[3].hour = 9;
    controls[3].minute = 15;
    controls[4].selection = "Asia/Kolkata";
    controls[5].selection = "IN";
    controls[6].selectedValue = "#ff0000";
    controls[7].selected = 30;
    controls[7].selectedEnd = 60;
    controls[8].rating = 1;
    await settle(form);

    form.reset();
    await settle(form);

    expect(Object.fromEntries(new FormData(form))).to.deep.equal({
      select: "admin",
      emoji: "😀",
      date: "2026-08-12",
      time: "14:30",
      timezone: "America/Toronto",
      country: "CA",
      color: "#336699",
      range: "20 - 80",
      rating: "4",
    });
    form.remove();
  });

  it("restores collection controls and clears transient controls", async () => {
    const form = formFixture(`
      <loomi-checkcards name="cards" selected-value="a" max="2">
        <loomi-checkcard value="a" title="A"></loomi-checkcard>
        <loomi-checkcard value="b" title="B"></loomi-checkcard>
      </loomi-checkcards>
      <loomi-tags name="tag-group" selected-value="a">
        <loomi-tag value="a">A</loomi-tag>
        <loomi-tag value="b">B</loomi-tag>
      </loomi-tags>
      <loomi-otp name="code"></loomi-otp>
      <loomi-filepicker name="files"></loomi-filepicker>
    `);
    const sortable = document.createElement("loomi-sortable") as TestControl;
    sortable.name = "order";
    sortable.items = [
      { id: "a", label: "A" },
      { id: "b", label: "B" },
    ];
    form.append(sortable);
    await settle(form);

    const cards = form.querySelector("loomi-checkcards")!;
    cards.querySelectorAll("loomi-checkcard")[1].dispatchEvent(
      new CustomEvent("loomi-checkcard-click", {
        bubbles: true,
        composed: true,
        detail: { value: "b" },
      }),
    );
    const tags = form.querySelector("loomi-tags")!;
    tags.querySelectorAll("loomi-tag")[1].dispatchEvent(
      new CustomEvent("loomi-tag-click", {
        bubbles: true,
        composed: true,
        detail: { value: "b" },
      }),
    );
    sortable.items = [...(sortable.items as unknown[]).reverse()];
    const otp = form.querySelector("loomi-otp") as TestControl;
    otp.digits = ["1", "2", "3", "4"];
    await settle(form);

    form.reset();
    await settle(form);

    expect(Object.fromEntries(new FormData(form))).to.deep.equal({
      cards: "a",
      "tag-group": "a",
      order: '["a","b"]',
      code: "",
    });
    expect((sortable.items as Array<{ id: string }>).map((item) => item.id)).to.deep.equal([
      "a",
      "b",
    ]);
    form.remove();
  });
});
