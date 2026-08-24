import { fixture, expect, nextFrame } from "@open-wc/testing";
import "../dist/index.js";

/**
 * Library-wide accessibility sweep. Every custom element the library defines is rendered
 * and checked with axe-core (via `chai-a11y-axe`, which `@open-wc/testing` registers).
 *
 * Each entry is `[tag, markup]`. `null` markup means the element is rendered bare, which
 * is only correct for components that are already meaningful with no attributes or
 * content. Anything else gets markup representing **correct, realistic use** — a form
 * control with its label, a menu item inside its menu, a button with a name. That
 * distinction is the whole point: a bare `<loomi-input>` legitimately has no accessible
 * name, and asserting on it would only measure the fixture, not the component. A
 * violation from the markup below, by contrast, is a real defect a consumer would hit.
 *
 * `scripts/check-a11y-coverage.mjs` fails CI if a tag in any custom-elements.json is
 * missing here, so a new component cannot silently skip this sweep.
 *
 */
const CASES: Array<[string, string | null]> = [
  ["loomi-accordion", null],
  [
    "loomi-accordion-item",
    '<loomi-accordion><loomi-accordion-item title="Section">Body</loomi-accordion-item></loomi-accordion>',
  ],
  ["loomi-alert", null],
  ["loomi-arc-meter", null],
  ["loomi-autocomplete", null],
  ["loomi-avatar", null],
  ["loomi-avatars", null],
  ["loomi-bell", null],
  ["loomi-bottom-nav", null],
  [
    "loomi-bottom-nav-item",
    '<loomi-bottom-nav><loomi-bottom-nav-item label="Home"></loomi-bottom-nav-item></loomi-bottom-nav>',
  ],
  ["loomi-button", "<loomi-button>Save</loomi-button>"],
  ["loomi-button-group", null],
  [
    "loomi-button-group-item",
    '<loomi-button-group aria-label="Views"><loomi-button-group-item label="List"></loomi-button-group-item></loomi-button-group>',
  ],
  ["loomi-calendar", null],
  ["loomi-card", null],
  ["loomi-card-action", null],
  ["loomi-card-content", null],
  ["loomi-card-description", null],
  ["loomi-card-footer", null],
  ["loomi-card-header", null],
  ["loomi-card-title", null],
  ["loomi-centered-content", null],
  ["loomi-chart", null],
  ["loomi-chat-message", null],
  ["loomi-chat-window", null],
  ["loomi-checkbox", '<loomi-checkbox label="Accept terms"></loomi-checkbox>'],
  [
    "loomi-checkcard",
    '<loomi-checkcards><loomi-checkcard value="pro" title="Pro plan"></loomi-checkcard></loomi-checkcards>',
  ],
  ["loomi-checkcards", null],
  ["loomi-clipboard", null],
  ["loomi-colorpicker", null],
  ["loomi-command-palette", null],
  ["loomi-contact-card", null],
  [
    "loomi-context-menu",
    '<loomi-context-menu><span slot="target">Right-click me</span><loomi-context-menu-item>Copy</loomi-context-menu-item></loomi-context-menu>',
  ],
  [
    "loomi-context-menu-item",
    '<loomi-context-menu><span slot="target">Right-click me</span><loomi-context-menu-item>Copy</loomi-context-menu-item></loomi-context-menu>',
  ],
  ["loomi-countries", null],
  ["loomi-creditcard", null],
  ["loomi-data-grid", null],
  ["loomi-date-range-picker", null],
  ["loomi-datepicker", null],
  ["loomi-divider", null],
  ["loomi-drawer", null],
  [
    "loomi-dropmenu",
    '<loomi-dropmenu label="Actions"><loomi-dropmenu-item>Edit</loomi-dropmenu-item></loomi-dropmenu>',
  ],
  [
    "loomi-dropmenu-item",
    '<loomi-dropmenu label="Actions"><loomi-dropmenu-item>Edit</loomi-dropmenu-item></loomi-dropmenu>',
  ],
  ["loomi-emoji-picker", null],
  ["loomi-empty-state", null],
  ["loomi-fab", null],
  [
    "loomi-fab-item",
    '<loomi-fab label="Actions"><loomi-fab-item label="New file"></loomi-fab-item></loomi-fab>',
  ],
  ["loomi-filepicker", null],
  ["loomi-filter-builder", null],
  ["loomi-floating-panel", null],
  ["loomi-horizontal-line-graph", null],
  ["loomi-icon", null],
  ["loomi-input", '<loomi-input label="Full name"></loomi-input>'],
  ["loomi-lightbox-image", null],
  ["loomi-listview", null],
  [
    "loomi-listview-item",
    "<loomi-listview><loomi-listview-item>Row one</loomi-listview-item></loomi-listview>",
  ],
  ["loomi-modal", null],
  ["loomi-notification", null],
  ["loomi-number", '<loomi-number label="Quantity"></loomi-number>'],
  ["loomi-otp", null],
  ["loomi-pagination", null],
  ["loomi-password", '<loomi-password label="Password"></loomi-password>'],
  ["loomi-photo-gallery", null],
  ["loomi-photo-gallery-item", null],
  [
    "loomi-popover",
    '<loomi-popover title="Details"><span slot="trigger">Open</span>Body text</loomi-popover>',
  ],
  ["loomi-processing", null],
  ["loomi-profile-menu", null],
  ["loomi-progress-bar", null],
  ["loomi-progress-circle", null],
  [
    "loomi-progress-step",
    '<loomi-progress-steps><loomi-progress-step label="Details"></loomi-progress-step></loomi-progress-steps>',
  ],
  ["loomi-progress-steps", null],
  ["loomi-qrcode", null],
  ["loomi-radio", '<loomi-radio label="Standard shipping"></loomi-radio>'],
  ["loomi-rating", null],
  ["loomi-resizable-handle", null],
  ["loomi-resizable-panel", null],
  ["loomi-resizable-panel-group", null],
  ["loomi-scroller", null],
  ["loomi-select", null],
  ["loomi-side-nav", null],
  [
    "loomi-side-nav-item",
    '<loomi-side-nav label="Main"><loomi-side-nav-item label="Dashboard"></loomi-side-nav-item></loomi-side-nav>',
  ],
  ["loomi-slider", null],
  ["loomi-sortable", null],
  ["loomi-spinner", null],
  ["loomi-split-button", '<loomi-split-button menu-label="More actions">Save</loomi-split-button>'],
  ["loomi-statistic", null],
  ["loomi-tab", null],
  ["loomi-table", null],
  ["loomi-tabs", null],
  ["loomi-tag", null],
  ["loomi-tag-input", '<loomi-tag-input label="Tags"></loomi-tag-input>'],
  ["loomi-tags", null],
  ["loomi-text-editor", null],
  ["loomi-textarea", '<loomi-textarea label="Message"></loomi-textarea>'],
  ["loomi-theme-switcher", null],
  ["loomi-timeline", null],
  ["loomi-timeline-item", null],
  ["loomi-timepicker", null],
  ["loomi-timer", null],
  ["loomi-timezonepicker", null],
  ["loomi-toggle", '<loomi-toggle label="Email notifications"></loomi-toggle>'],
  ["loomi-tooltip", '<loomi-tooltip content="Saves your work">Save</loomi-tooltip>'],
  ["loomi-video", null],
];

// axe runs with its default rule set, color-contrast included: the theme's text tokens
// are tuned so every tier clears WCAG AA against both the light and dark surface (see
// packages/theme/scripts/build-tokens.mjs). A contrast failure here means a token
// regressed, not that the rule needs muting.
const AXE_OPTIONS = {};

describe("accessibility sweep", () => {
  // Self-relocating components append themselves directly to <body>, outside the fixture
  // wrapper that fixtureCleanup() tears down, so they would otherwise accumulate across
  // cases. Fixture content itself lives inside a wrapper div, so a loomi-* element that
  // is a direct child of <body> is always such a leftover.
  afterEach(() => {
    for (const stray of Array.from(document.body.children)) {
      if (stray.tagName.toLowerCase().startsWith("loomi-")) stray.remove();
    }
  });

  for (const [tag, markup] of CASES) {
    it(tag, async () => {
      const el = await fixture(markup ?? `<${tag}></${tag}>`);
      await nextFrame();
      // Components that host overlays — loomi-notification, and the modal/drawer family —
      // move themselves to document.body on connect, which leaves the fixture handle
      // pointing outside the rendered tree and makes axe reject it. Find the relocated
      // element rather than falling back to scanning the whole document, which would
      // fold in leftovers from earlier cases and report them against this component.
      const target = el instanceof Element && el.isConnected ? el : document.querySelector(tag);
      expect(target, `no element rendered for ${tag}`).to.be.instanceOf(Element);
      await expect(target as Element).to.be.accessible(AXE_OPTIONS);
    });
  }
});
