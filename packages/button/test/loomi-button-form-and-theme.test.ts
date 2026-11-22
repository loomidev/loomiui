import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-button.js";
import type { LoomiButton } from "../dist/index.js";

function resolveColor(el: LoomiButton, value: string): string {
  const probe = document.createElement("span");
  probe.style.color = value;
  el.shadowRoot!.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved;
}

const inner = (el: LoomiButton) => el.shadowRoot!.querySelector("button")!;

describe("loomi-button colours", () => {
  it('color="secondary" on a solid button fills with the secondary palette', async () => {
    const el = await fixture<LoomiButton>(html`<loomi-button color="secondary">Go</loomi-button>`);
    const btn = inner(el);
    expect(btn.classList.contains("loomi-btn--secondary")).to.be.false;
    expect(getComputedStyle(btn).backgroundColor).to.equal(
      resolveColor(el, "var(--loomi-secondary-600, var(--_loomi-secondary-600-default))"),
    );
  });

  it("filled text follows --loomi-text-on-<color> set on :root", async () => {
    document.documentElement.style.setProperty("--loomi-text-on-primary", "rgb(1, 2, 3)");
    document.documentElement.style.setProperty("--loomi-text-on-warning", "rgb(4, 5, 6)");
    try {
      const primary = await fixture<LoomiButton>(html`<loomi-button>Go</loomi-button>`);
      expect(getComputedStyle(inner(primary)).color).to.equal("rgb(1, 2, 3)");
      const warning = await fixture<LoomiButton>(
        html`<loomi-button color="warning">Go</loomi-button>`,
      );
      expect(getComputedStyle(inner(warning)).color).to.equal("rgb(4, 5, 6)");
    } finally {
      document.documentElement.style.removeProperty("--loomi-text-on-primary");
      document.documentElement.style.removeProperty("--loomi-text-on-warning");
    }
  });

  it("filled text defaults to white", async () => {
    const el = await fixture<LoomiButton>(html`<loomi-button color="error">Go</loomi-button>`);
    expect(getComputedStyle(inner(el)).color).to.equal("rgb(255, 255, 255)");
  });

  it("a :root override of a semantic token reaches inside the component", async () => {
    document.documentElement.style.setProperty("--loomi-surface", "rgb(7, 8, 9)");
    try {
      const el = await fixture<LoomiButton>(html`<loomi-button type="secondary">Go</loomi-button>`);
      expect(getComputedStyle(inner(el)).backgroundColor).to.equal("rgb(7, 8, 9)");
    } finally {
      document.documentElement.style.removeProperty("--loomi-surface");
    }
  });
});

describe("loomi-button form submission", () => {
  async function form(markup: ReturnType<typeof html>) {
    const f = await fixture<HTMLFormElement>(markup);
    const submitted: FormData[] = [];
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      submitted.push(new FormData(f));
    });
    return { f, submitted };
  }

  it("sends the pressed button's name=value with the form", async () => {
    const { f, submitted } = await form(html`<form>
      <input name="id" value="7" />
      <loomi-button can-submit name="action" value="approve">Approve</loomi-button>
      <loomi-button can-submit name="action" value="reject">Reject</loomi-button>
    </form>`);
    const [approve, reject] = f.querySelectorAll<LoomiButton>("loomi-button");
    await reject.updateComplete;
    inner(reject).click();
    inner(approve).click();
    expect(submitted.map((d) => d.getAll("action"))).to.deep.equal([["reject"], ["approve"]]);
    expect(submitted[0].get("id")).to.equal("7");
    // Only while submitting: the form's own data doesn't carry it afterwards.
    expect(new FormData(f).has("action")).to.be.false;
  });

  it("a button without a name adds nothing", async () => {
    const { f, submitted } = await form(html`<form>
      <input name="q" value="x" />
      <loomi-button can-submit>Go</loomi-button>
    </form>`);
    const el = f.querySelector<LoomiButton>("loomi-button")!;
    await el.updateComplete;
    inner(el).click();
    expect([...submitted[0].keys()]).to.deep.equal(["q"]);
  });

  it("element.click() on the host submits, like a native button", async () => {
    const { f, submitted } = await form(html`<form>
      <loomi-button can-submit name="step" value="next">Next</loomi-button>
    </form>`);
    const el = f.querySelector<LoomiButton>("loomi-button")!;
    await el.updateComplete;
    el.click();
    await Promise.resolve();
    expect(submitted.length).to.equal(1);
    expect(submitted[0].get("step")).to.equal("next");
  });

  it("host click() does nothing when a listener prevents it or the button is disabled", async () => {
    const { f, submitted } = await form(html`<form>
      <loomi-button can-submit id="a">A</loomi-button>
      <loomi-button can-submit disabled id="b">B</loomi-button>
    </form>`);
    const a = f.querySelector<LoomiButton>("#a")!;
    const b = f.querySelector<LoomiButton>("#b")!;
    a.addEventListener("click", (e) => e.preventDefault());
    a.click();
    b.click();
    await Promise.resolve();
    expect(submitted.length).to.equal(0);
  });

  it("a disabled fieldset disables the button", async () => {
    const f = await fixture<HTMLFormElement>(html`<form>
      <fieldset disabled><loomi-button can-submit>Go</loomi-button></fieldset>
    </form>`);
    const el = f.querySelector<LoomiButton>("loomi-button")!;
    await el.updateComplete;
    expect(inner(el).disabled).to.be.true;
  });
});
