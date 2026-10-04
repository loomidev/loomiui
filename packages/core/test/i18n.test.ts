import { expect, fixture, html as fixtureHtml } from "@open-wc/testing";
import { html } from "lit";
import {
  LoomiElement,
  builtinTranslations,
  defineLoomiTranslations,
  getLoomiLocale,
  loadLoomiLocale,
  loomiT,
  loomiTranslations,
  setLoomiLocale,
} from "../dist/index.js";

/** How many times the page has fetched built-in locale files other than en (or just `locale`'s). */
function localeRequests(locale?: string): number {
  return performance.getEntriesByType("resource").filter((entry) => {
    const name = new URL(entry.name).pathname.match(/\/core\/dist\/locales\/([^/]+)\.js$/)?.[1];
    return locale ? name === locale : !!name && !["en", "index", "types"].includes(name);
  }).length;
}

class I18nProbe extends LoomiElement {
  override render() {
    return html`${loomiT("common.close")}`;
  }
}
customElements.define("loomi-i18n-probe", I18nProbe);

// These run first, before any other test has a reason to load a locale, so the request
// counts start from zero.
describe("Loomi on-demand locales", () => {
  afterEach(async () => {
    await setLoomiLocale("en");
  });

  it("ships en statically and every other built-in locale as a loader", () => {
    expect(Object.keys(loomiTranslations)).to.deep.equal(["en"]);
    expect(Object.keys(builtinTranslations)).to.include.members(["en", "de", "fr", "pt_BR"]);
    for (const loader of Object.values(builtinTranslations)) expect(loader).to.be.a("function");
    expect(localeRequests()).to.equal(0);
  });

  it("loads a locale once, switches after it arrives and re-renders open components", async () => {
    const probe = await fixture<I18nProbe>(fixtureHtml`<loomi-i18n-probe></loomi-i18n-probe>`);
    expect(probe.shadowRoot!.textContent).to.equal("Close");

    const first = setLoomiLocale("de");
    // Nothing switches until the file has arrived.
    expect(getLoomiLocale()).to.equal("en");
    const second = setLoomiLocale("de-AT"); // regional: loads its base, `de`
    await Promise.all([first, second]);
    await probe.updateComplete;

    expect(getLoomiLocale()).to.equal("de");
    expect(probe.shadowRoot!.textContent).to.equal("Schließen");

    await setLoomiLocale("en");
    await setLoomiLocale("de");
    await probe.updateComplete;
    expect(probe.shadowRoot!.textContent).to.equal("Schließen");
    expect(localeRequests("de")).to.equal(1);
  });

  it("keeps translations registered before the locale loads on top of the built-in copy", async () => {
    defineLoomiTranslations("it", { common: { close: "Chiudi subito" } });
    await loadLoomiLocale("it");

    expect(loomiT("common.close", {}, "it")).to.equal("Chiudi subito");
    expect(loomiT("common.dismiss", {}, "it")).to.equal(loomiT("common.dismiss", {}, "it_IT"));
    expect(loomiT("common.dismiss", {}, "it")).not.to.equal("Dismiss");
  });

  it("loads a locale a component names through its own `locale` and re-renders it", async () => {
    class LocalProbe extends LoomiElement {
      override render() {
        return html`${loomiT("common.close", {}, "es")}`;
      }
    }
    customElements.define("loomi-i18n-local-probe", LocalProbe);
    const probe = await fixture<LocalProbe>(
      fixtureHtml`<loomi-i18n-local-probe></loomi-i18n-local-probe>`,
    );
    // The first render falls back to English while `es` is fetched...
    expect(probe.shadowRoot!.textContent).to.equal("Close");
    await loadLoomiLocale("es");
    await probe.updateComplete;
    // ...and the arrival re-renders it.
    expect(probe.shadowRoot!.textContent).to.equal("Cerrar");
    expect(getLoomiLocale()).to.equal("en");
  });

  it("falls back to en for an unknown locale without a request", async () => {
    const before = localeRequests();
    const probe = await fixture<I18nProbe>(fixtureHtml`<loomi-i18n-probe></loomi-i18n-probe>`);

    await setLoomiLocale("qq");
    await probe.updateComplete;

    expect(loomiT("common.close")).to.equal("Close");
    expect(probe.shadowRoot!.textContent).to.equal("Close");
    expect(localeRequests()).to.equal(before);
  });

  it("lets the last of two overlapping switches win", async () => {
    const slow = setLoomiLocale("tr");
    await setLoomiLocale("en");
    await slow;
    expect(getLoomiLocale()).to.equal("en");
  });
});

describe("Loomi i18n fallbacks", () => {
  const originalLocale = getLoomiLocale();

  afterEach(async () => {
    await setLoomiLocale(originalLocale);
  });

  it("falls back from an exact regional locale to its base locale and then English", () => {
    defineLoomiTranslations("zz", {
      common: { close: "Base close" },
    });
    defineLoomiTranslations("zz-ZZ", {
      common: { dismiss: "Regional dismiss" },
    });

    expect(loomiT("common.dismiss", {}, "zz-ZZ")).to.equal("Regional dismiss");
    expect(loomiT("common.close", {}, "zz-ZZ")).to.equal("Base close");
    expect(loomiT("common.remove", {}, "zz-ZZ")).to.equal("Remove");
  });

  it("keeps regional translations separate from an existing built-in base locale", async () => {
    defineLoomiTranslations("fr-CA", {
      common: { dismiss: "Fermer la notification" },
    });
    await loadLoomiLocale("fr-CA");

    expect(loomiT("common.dismiss", {}, "fr-CA")).to.equal("Fermer la notification");
    expect(loomiT("common.close", {}, "fr-CA")).to.equal("Fermer");
    expect(loomiT("fab.trigger", {}, "fr-CA")).to.equal("Actions");
    expect(loomiT("common.dismiss", {}, "fr")).to.equal("Masquer");
  });

  it("uses the active locale and preserves interpolation through fallback values", async () => {
    defineLoomiTranslations("xy", {});
    await setLoomiLocale("xy-XY");

    expect(getLoomiLocale()).to.equal("xy");
    expect(loomiT("pagination.pageOf", { page: 2, pages: 8 })).to.equal("Page 2 of 8");
  });

  it("returns the path when no locale defines a value", () => {
    expect(loomiT("missing.translation", {}, "zz-ZZ")).to.equal("missing.translation");
  });
});
