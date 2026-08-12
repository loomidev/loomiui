import { expect } from "@open-wc/testing";
import {
  defineLoomiTranslations,
  getLoomiLocale,
  loomiT,
  setLoomiLocale,
} from "../dist/index.js";

describe("Loomi i18n fallbacks", () => {
  const originalLocale = getLoomiLocale();

  afterEach(() => {
    setLoomiLocale(originalLocale);
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

  it("keeps regional translations separate from an existing built-in base locale", () => {
    defineLoomiTranslations("fr-CA", {
      common: { dismiss: "Fermer la notification" },
    });

    expect(loomiT("common.dismiss", {}, "fr-CA")).to.equal("Fermer la notification");
    expect(loomiT("common.close", {}, "fr-CA")).to.equal("Fermer");
    expect(loomiT("fab.trigger", {}, "fr-CA")).to.equal("Actions");
    expect(loomiT("common.dismiss", {}, "fr")).to.equal("Masquer");
  });

  it("uses the active locale and preserves interpolation through fallback values", () => {
    defineLoomiTranslations("xy", {});
    setLoomiLocale("xy-XY");

    expect(getLoomiLocale()).to.equal("xy");
    expect(loomiT("pagination.pageOf", { page: 2, pages: 8 })).to.equal("Page 2 of 8");
  });

  it("returns the path when no locale defines a value", () => {
    expect(loomiT("missing.translation", {}, "zz-ZZ")).to.equal("missing.translation");
  });
});
