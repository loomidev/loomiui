import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-button.js";
import type { LoomiButton } from "../dist/index.js";

describe("loomi-button", () => {
  it("renders with default attributes", async () => {
    const el = await fixture<LoomiButton>(html`<loomi-button>Click me</loomi-button>`);
    expect(el.type).to.equal("primary");
    expect(el.size).to.equal("regular");
    expect(el.shadowRoot!.querySelector("button")).to.exist;
    // "Click me" is light-DOM content projected through the default <slot> — it lives
    // on the host's own textContent, not the shadow-DOM slot's (slots don't include
    // distributed nodes in their own .textContent).
    expect(el.textContent!.trim()).to.equal("Click me");
  });

  it("renders as an anchor when tag is a", async () => {
    const el = await fixture<LoomiButton>(
      html`<loomi-button tag="a" href="https://example.com">Link</loomi-button>`,
    );
    const a = el.shadowRoot!.querySelector("a");
    expect(a).to.exist;
    expect(a!.getAttribute("href")).to.equal("https://example.com");
  });

  it("strips href and suppresses click on a disabled link-button", async () => {
    const el = await fixture<LoomiButton>(
      html`<loomi-button tag="a" href="https://example.com" disabled>Open</loomi-button>`,
    );
    const a = el.shadowRoot!.querySelector("a")!;
    expect(a.hasAttribute("href")).to.be.false;
    let clicked = false;
    el.addEventListener("click", () => (clicked = true));
    a.click();
    expect(clicked).to.be.false;
  });

  it("toggles the spinner via startSpinner()/stopSpinner()", async () => {
    const el = await fixture<LoomiButton>(html`<loomi-button has-spinner>Save</loomi-button>`);
    expect(el.showSpinner).to.be.false;
    el.startSpinner();
    expect(el.showSpinner).to.be.true;
    el.stopSpinner();
    expect(el.showSpinner).to.be.false;
  });

  it("reflects the ancestor `dark` class as `.is-dark` without relying on :host-context()", async () => {
    const el = await fixture<LoomiButton>(html`<loomi-button outline>Save</loomi-button>`);
    const btn = () => el.shadowRoot!.querySelector("button")!;
    expect(btn().classList.contains("is-dark")).to.be.false;

    // MutationObserver callbacks land in a microtask after the mutating script finishes,
    // so give it a frame before checking updateComplete (which may already be settled
    // from an earlier render at the moment the mutation is made).
    const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    document.documentElement.classList.add("dark");
    await nextFrame();
    await el.updateComplete;
    expect(btn().classList.contains("is-dark")).to.be.true;

    document.documentElement.classList.remove("dark");
    await nextFrame();
    await el.updateComplete;
    expect(btn().classList.contains("is-dark")).to.be.false;
  });

  it("focuses the inner control when the host is focused", async () => {
    // Components that hand focus back to a trigger — a menu closing, a dialog
    // returning — call focus() on the host. Without delegatesFocus that is a
    // silent no-op, and the failure only shows up in keyboard testing.
    const el = await fixture<LoomiButton>(html`<loomi-button>Save</loomi-button>`);
    el.focus();
    await el.updateComplete;

    expect(el.shadowRoot!.activeElement).to.equal(el.shadowRoot!.querySelector("button"));
  });

  it("submits the form it sits in, across the shadow boundary", async () => {
    // `type="submit"` alone does nothing here: the rendered <button> is inside
    // this component's shadow root, and form association never crosses one — so
    // the consumer's <form> never hears about it.
    const form = await fixture<HTMLFormElement>(
      html`<form><loomi-button can-submit>Save</loomi-button></form>`,
    );
    let submitted = false;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitted = true;
    });

    const el = form.querySelector<LoomiButton>("loomi-button")!;
    await el.updateComplete;
    el.shadowRoot!.querySelector("button")!.click();
    expect(submitted).to.be.true;
  });

  it("does not submit when it is not a submit button", async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form><loomi-button>Cancel</loomi-button></form>`,
    );
    let submitted = false;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitted = true;
    });

    const el = form.querySelector<LoomiButton>("loomi-button")!;
    await el.updateComplete;
    el.shadowRoot!.querySelector("button")!.click();
    expect(submitted).to.be.false;
  });

  it("does not submit while disabled", async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form><loomi-button can-submit disabled>Save</loomi-button></form>`,
    );
    let submitted = false;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitted = true;
    });

    const el = form.querySelector<LoomiButton>("loomi-button")!;
    await el.updateComplete;
    el.shadowRoot!.querySelector("button")!.click();
    expect(submitted).to.be.false;
  });

  it("renders as a circle: square dimensions, full radius, hidden label", async () => {
    const el = await fixture<LoomiButton>(
      html`<loomi-button circle icon="check" aria-label="Confirm"></loomi-button>`,
    );
    const btn = el.shadowRoot!.querySelector("button")!;
    expect(el.hasAttribute("circle")).to.be.true;

    const rect = btn.getBoundingClientRect();
    expect(rect.width).to.be.closeTo(rect.height, 1);
    expect(getComputedStyle(btn).borderRadius).to.equal("9999px");

    const label = el.shadowRoot!.querySelector(".loomi-label")!;
    expect(getComputedStyle(label).display).to.equal("none");
  });

  describe('type="secondary" with a color', () => {
    /** Resolve a CSS color expression inside the button's shadow root, where the theme's palette defaults live. */
    function resolveColor(el: LoomiButton, value: string): string {
      const probe = document.createElement("span");
      probe.style.color = value;
      el.shadowRoot!.appendChild(probe);
      const resolved = getComputedStyle(probe).color;
      probe.remove();
      return resolved;
    }
    const shade = (c: string, n: number) =>
      `var(--loomi-${c}-${n}, var(--_loomi-${c}-${n}-default))`;

    for (const color of ["primary", "info", "success", "error", "warning", "gray"]) {
      it(`color="${color}" is an outline: surface fill, ${color} border and text`, async () => {
        const el = await fixture<LoomiButton>(
          html`<loomi-button type="secondary" color=${color}>Go</loomi-button>`,
        );
        const btn = el.shadowRoot!.querySelector("button")!;
        const style = getComputedStyle(btn);

        expect(style.backgroundColor).to.equal(resolveColor(el, "var(--loomi-surface)"));
        expect(style.backgroundColor).not.to.equal(resolveColor(el, shade(color, 600)));
        expect(style.borderTopColor).to.equal(resolveColor(el, shade(color, 300)));
        expect(style.borderTopWidth).to.equal("1px");
        expect(style.color).to.equal(resolveColor(el, shade(color, 600)));

        // Same hover and focus treatment as `outline color="…"`.
        expect(btn.classList.contains(`loomi-btn--outline-${color}`)).to.be.true;
        expect(btn.classList.contains(`focus-visible:ring-${color}-400`)).to.be.true;
        expect(btn.classList.contains(`hover:bg-${color}-700`)).to.be.false;
      });
    }

    it("renders identically to outline with the same color", async () => {
      const secondary = await fixture<LoomiButton>(
        html`<loomi-button type="secondary" color="error">Go</loomi-button>`,
      );
      const outline = await fixture<LoomiButton>(
        html`<loomi-button outline color="error">Go</loomi-button>`,
      );
      const a = getComputedStyle(secondary.shadowRoot!.querySelector("button")!);
      const b = getComputedStyle(outline.shadowRoot!.querySelector("button")!);
      for (const prop of ["backgroundColor", "borderTopColor", "color", "borderRadius"] as const) {
        expect(a[prop], prop).to.equal(b[prop]);
      }
    });

    it("plain secondary keeps its neutral gray border and dark text", async () => {
      for (const markup of [
        html`<loomi-button type="secondary">Go</loomi-button>`,
        html`<loomi-button type="secondary" color="secondary">Go</loomi-button>`,
      ]) {
        const el = await fixture<LoomiButton>(markup);
        const btn = el.shadowRoot!.querySelector("button")!;
        const style = getComputedStyle(btn);
        expect(btn.classList.contains("loomi-btn--secondary")).to.be.true;
        expect(style.backgroundColor).to.equal(resolveColor(el, "var(--loomi-surface)"));
        expect(style.borderTopColor).to.equal(resolveColor(el, shade("gray", 300)));
        expect(style.color).to.equal(resolveColor(el, "var(--loomi-text)"));
      }
    });
  });

  it("fills its container and centers the label with full-width", async () => {
    const wrap = await fixture<HTMLDivElement>(
      html`<div style="width: 300px"><loomi-button full-width>Go</loomi-button></div>`,
    );
    const el = wrap.querySelector<LoomiButton>("loomi-button")!;
    await el.updateComplete;
    expect(el.fullWidth).to.be.true;
    expect(getComputedStyle(el).display).to.equal("block");
    expect(el.offsetWidth).to.equal(300);
    const inner = el.shadowRoot!.querySelector<HTMLElement>('[part="button"]')!;
    expect(inner.offsetWidth).to.equal(300);
    expect(getComputedStyle(inner).justifyContent).to.equal("center");

    el.fullWidth = false;
    await el.updateComplete;
    expect(el.hasAttribute("full-width")).to.be.false;
    expect(el.offsetWidth).to.be.lessThan(300);
  });

  it("hides the icon slot for an unknown icon name", async () => {
    const el = await fixture<LoomiButton>(html`<loomi-button icon="not-an-icon">Go</loomi-button>`);
    const svg = el.shadowRoot!.querySelector(".loomi-icon")!;
    expect(getComputedStyle(svg).display).to.equal("none");
  });

  it("shows an icon once it loads", async () => {
    const el = await fixture<LoomiButton>(html`<loomi-button icon="x-mark">Close</loomi-button>`);
    const svg = el.shadowRoot!.querySelector(".loomi-icon")!;
    await new Promise<void>((resolve) => {
      const check = () => (svg.querySelector("path") ? resolve() : setTimeout(check, 10));
      check();
    });
    expect(getComputedStyle(svg).display).to.not.equal("none");
  });
});
