import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../dist/loomi-photo-gallery.js";
import type { LoomiPhotoGallery, LoomiPhotoGalleryItem } from "../dist/index.js";

const THREE_PHOTOS = html`
  <loomi-photo-gallery>
    <loomi-photo-gallery-item src="/a-full.jpg" thumb="/a-thumb.jpg" alt="Photo A"></loomi-photo-gallery-item>
    <loomi-photo-gallery-item src="/b-full.jpg" thumb="/b-thumb.jpg" alt="Photo B" album="Trips"></loomi-photo-gallery-item>
    <loomi-photo-gallery-item src="/c-full.jpg" thumb="/c-thumb.jpg" alt="Photo C" album="Trips"></loomi-photo-gallery-item>
  </loomi-photo-gallery>
`;

describe("loomi-photo-gallery", () => {
  // openLightbox() reparents the gallery to document.body, which escapes the fixture
  // container @open-wc/testing's fixtureCleanup() removes after each test — close any
  // lightbox left open so it doesn't leak into the next test's DOM.
  afterEach(() => {
    document.querySelectorAll<LoomiPhotoGallery>("loomi-photo-gallery").forEach((gallery) => gallery.closeLightbox());
  });

  it("renders a grid tile per item and hides the items themselves", async () => {
    const el = await fixture<LoomiPhotoGallery>(THREE_PHOTOS);
    const tiles = el.shadowRoot!.querySelectorAll(".loomi-tile");
    expect(tiles.length).to.equal(3);

    const item = el.querySelector("loomi-photo-gallery-item") as LoomiPhotoGalleryItem;
    expect(getComputedStyle(item).display).to.equal("none");
  });

  it("opens the lightbox on tile click, moving the gallery to document.body", async () => {
    const el = await fixture<LoomiPhotoGallery>(THREE_PHOTOS);
    const tileButton = el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".loomi-tile-btn")[1];

    const opened = oneEvent(el, "loomi-photo-open");
    tileButton.click();
    const { detail } = await opened;

    expect(detail.index).to.equal(1);
    expect(detail.src).to.equal("/b-full.jpg");
    expect(el.parentNode).to.equal(document.body);
    expect(el.shadowRoot!.querySelector(".loomi-lightbox-img")?.getAttribute("src")).to.equal("/b-full.jpg");
  });

  it("closes on Escape and restores the gallery to its original position", async () => {
    const wrapper = await fixture<HTMLDivElement>(html`<div>${THREE_PHOTOS}</div>`);
    const el = wrapper.querySelector("loomi-photo-gallery") as LoomiPhotoGallery;

    el.openLightbox(0);
    await el.updateComplete;
    expect(el.parentNode).to.equal(document.body);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector(".loomi-lightbox")).to.not.exist;
    expect(el.parentNode).to.equal(wrapper);
  });

  it("navigates next/prev and wraps around", async () => {
    const el = await fixture<LoomiPhotoGallery>(THREE_PHOTOS);
    el.openLightbox(2);
    await el.updateComplete;

    el.nextPhoto();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".loomi-lightbox-img")?.getAttribute("src")).to.equal("/a-full.jpg");

    el.prevPhoto();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".loomi-lightbox-img")?.getAttribute("src")).to.equal("/c-full.jpg");
  });

  it("toggles favourite from the grid tile and fires loomi-favourite", async () => {
    const el = await fixture<LoomiPhotoGallery>(THREE_PHOTOS);
    const favButton = el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".loomi-fav-btn")[0];

    const favourited = oneEvent(el, "loomi-favourite");
    favButton.click();
    const { detail } = await favourited;

    expect(detail).to.deep.equal({ index: 0, src: "/a-full.jpg", favourite: true });
    const item = el.querySelectorAll("loomi-photo-gallery-item")[0] as LoomiPhotoGalleryItem;
    expect(item.favourite).to.be.true;
  });

  it("keeps rotation cumulative across multiple clicks", async () => {
    const el = await fixture<LoomiPhotoGallery>(THREE_PHOTOS);
    el.openLightbox(0);
    await el.updateComplete;
    const rotateButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
      ".loomi-lightbox-actions .loomi-lightbox-btn:nth-child(4)",
    )!;

    rotateButton.click();
    rotateButton.click();
    rotateButton.click();
    await el.updateComplete;

    const img = el.shadowRoot!.querySelector<HTMLImageElement>(".loomi-lightbox-img")!;
    expect(img.style.transform).to.include("rotate(-270deg)");
  });

  it("only shows the album panel toggle when there's more than one album", async () => {
    const single = await fixture<LoomiPhotoGallery>(html`
      <loomi-photo-gallery><loomi-photo-gallery-item src="/x.jpg"></loomi-photo-gallery-item></loomi-photo-gallery>
    `);
    expect(single.shadowRoot!.querySelector(".loomi-toolbar-btn.is-active, .loomi-albums")).to.not.exist;

    const multi = await fixture<LoomiPhotoGallery>(THREE_PHOTOS);
    expect(multi.shadowRoot!.querySelector(".loomi-albums")).to.exist;
  });

  it("filters the grid by the selected album", async () => {
    const el = await fixture<LoomiPhotoGallery>(THREE_PHOTOS);
    const tripsButton = Array.from(el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".loomi-album-btn")).find(
      (btn) => btn.textContent?.includes("Trips"),
    )!;

    tripsButton.click();
    await el.updateComplete;

    expect(el.shadowRoot!.querySelectorAll(".loomi-tile").length).to.equal(2);
  });

  it("clamps thumb-size between the min and max on zoom", async () => {
    const el = await fixture<LoomiPhotoGallery>(html`<loomi-photo-gallery thumb-size="300">${THREE_PHOTOS}</loomi-photo-gallery>`);
    const zoomIn = Array.from(el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".loomi-toolbar-btn")).find(
      (btn) => btn.getAttribute("aria-label") === "Zoom in",
    )!;

    zoomIn.click();
    await el.updateComplete;
    expect(el.thumbSize).to.equal(320);

    zoomIn.click();
    await el.updateComplete;
    expect(el.thumbSize).to.equal(320);
  });

  it("hides individual toolbar buttons via their show-* attribute", async () => {
    const el = await fixture<LoomiPhotoGallery>(html`
      <loomi-photo-gallery show-slideshow="false" lightbox-show-share="false">${THREE_PHOTOS}</loomi-photo-gallery>
    `);
    expect(el.shadowRoot!.querySelectorAll(".loomi-toolbar-btn").length).to.equal(4); // album, zoom out, zoom in, square — minus slideshow

    el.openLightbox(0);
    await el.updateComplete;
    const labels = Array.from(el.shadowRoot!.querySelectorAll(".loomi-lightbox-btn")).map((btn) =>
      btn.getAttribute("aria-label"),
    );
    expect(labels).to.not.include("Share photo");
  });

  it("starts and stops the slideshow", async () => {
    const el = await fixture<LoomiPhotoGallery>(html`<loomi-photo-gallery slideshow-interval="20">${THREE_PHOTOS}</loomi-photo-gallery>`);

    const started = oneEvent(el, "loomi-slideshow-start");
    el.startSlideshow();
    await started;
    expect(el.shadowRoot!.querySelector(".loomi-lightbox")).to.exist;

    const ended = oneEvent(el, "loomi-slideshow-end");
    el.stopSlideshow();
    await ended;
  });
});
