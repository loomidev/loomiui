import { expect } from "@open-wc/testing";
import "../dist/index.js";

type FormControl = HTMLElement & {
  value?: string;
  selected?: number | string[];
  selectedValue?: string;
  checked?: boolean;
};

async function settle(): Promise<void> {
  await Promise.resolve();
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
}

function formFixture(markup: string): HTMLFormElement {
  const form = document.createElement("form");
  form.innerHTML = markup;
  document.body.append(form);
  return form;
}

describe("form-associated control integration", () => {
  it("submits scalar, choice, checked, and range values through native FormData", async () => {
    const form = formFixture(`
        <loomi-input name="input" value="Alpha"></loomi-input>
        <loomi-textarea name="textarea" value="Notes"></loomi-textarea>
        <loomi-number name="number" value="42"></loomi-number>
        <loomi-password name="password" value="secret"></loomi-password>
        <loomi-select name="role" selected-value="admin">
          <option value="admin">Admin</option>
          <option value="member">Member</option>
        </loomi-select>
        <loomi-checkbox name="terms" value="accepted" checked>Terms</loomi-checkbox>
        <loomi-radio name="plan" value="pro" checked>Pro</loomi-radio>
        <loomi-toggle name="alerts" value="enabled" checked>Alerts</loomi-toggle>
        <loomi-slider name="volume" selected="25"></loomi-slider>
        <loomi-datepicker name="date" selected-value="2026-08-12"></loomi-datepicker>
        <loomi-timepicker name="time" format="24" selected-value="14:30"></loomi-timepicker>
    `);
    await settle();

    expect(Object.fromEntries(new FormData(form))).to.deep.equal({
      input: "Alpha",
      textarea: "Notes",
      number: "42",
      password: "secret",
      role: "admin",
      terms: "accepted",
      plan: "pro",
      alerts: "enabled",
      volume: "25",
      date: "2026-08-12",
      time: "14:30",
    });
    form.remove();
  });

  it("updates submitted values after programmatic property changes", async () => {
    const form = formFixture(`
        <loomi-input name="query"></loomi-input>
        <loomi-select name="filters" multiple>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </loomi-select>
        <loomi-slider name="range" range></loomi-slider>
    `);
    const input = form.querySelector("loomi-input") as FormControl;
    const select = form.querySelector("loomi-select") as FormControl;
    const slider = form.querySelector("loomi-slider") as FormControl;

    input.value = "updated";
    select.selectedValue = "open,closed";
    slider.selected = 20;
    (slider as FormControl & { selectedEnd: number }).selectedEnd = 80;
    await settle();

    expect(Object.fromEntries(new FormData(form))).to.deep.equal({
      query: "updated",
      filters: "open,closed",
      range: "20 - 80",
    });
    form.remove();
  });

  it("omits unchecked, disabled, and unnamed controls", async () => {
    const form = formFixture(`
        <loomi-checkbox name="unchecked" value="no"></loomi-checkbox>
        <loomi-input name="disabled" value="hidden" disabled></loomi-input>
        <loomi-input value="unnamed"></loomi-input>
        <loomi-toggle name="included" value="yes" checked></loomi-toggle>
    `);
    await settle();

    expect(Object.fromEntries(new FormData(form))).to.deep.equal({ included: "yes" });
    form.remove();
  });

  it("clears reset-aware controls through the native form reset lifecycle", async () => {
    const form = formFixture(`
        <loomi-input name="search"></loomi-input>
        <loomi-password name="password"></loomi-password>
        <loomi-autocomplete name="country"></loomi-autocomplete>
    `);
    await settle();

    (form.querySelector("loomi-input") as FormControl).value = "query";
    (form.querySelector("loomi-password") as FormControl).value = "secret";
    (form.querySelector("loomi-autocomplete") as FormControl).value = "Ghana";
    await settle();

    form.reset();
    await settle();

    expect(Object.fromEntries(new FormData(form))).to.deep.equal({
      search: "",
      password: "",
      country: "",
    });
    form.remove();
  });
});
