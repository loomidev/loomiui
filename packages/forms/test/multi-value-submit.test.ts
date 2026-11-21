import { html, fixture, expect } from "@open-wc/testing";
import "../../select/dist/loomi-select.js";

describe("multi-value form submission", () => {
  it("select multiple submits one entry per value", async () => {
    const form = await fixture<HTMLFormElement>(html`<form>
      <loomi-select
        name="tags[]"
        multiple
        selected-value="a,b"
        data='[{"value":"a","label":"A"},{"value":"b","label":"B"},{"value":"c","label":"C"}]'
      ></loomi-select>
    </form>`);
    await (form.firstElementChild as HTMLElement & { updateComplete: Promise<boolean> })
      .updateComplete;
    expect(new FormData(form).getAll("tags[]")).to.deep.equal(["a", "b"]);
  });

  it("select multiple with nothing picked submits nothing; single select submits its value", async () => {
    const form = await fixture<HTMLFormElement>(html`<form>
      <loomi-select name="m" multiple data='[{"value":"a","label":"A"}]'></loomi-select>
      <loomi-select name="s" selected-value="a" data='[{"value":"a","label":"A"}]'></loomi-select>
    </form>`);
    for (const el of form.children)
      await (el as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete;
    const data = new FormData(form);
    expect(data.has("m")).to.equal(false);
    expect(data.get("s")).to.equal("a");
  });
});
