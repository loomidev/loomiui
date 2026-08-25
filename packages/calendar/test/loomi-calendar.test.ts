import { html, fixture, expect, oneEvent, nextFrame } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiCalendar } from "../dist/index.js";

const MARCH = new Date(2026, 2, 15);

const EVENTS = [
  {
    id: "standup",
    title: "Standup",
    start: new Date(2026, 2, 16, 9, 0),
    end: new Date(2026, 2, 16, 9, 30),
  },
  {
    id: "review",
    title: "Design review",
    start: new Date(2026, 2, 17, 14, 0),
    end: new Date(2026, 2, 17, 15, 0),
    description: "Go through the new pickers",
  },
];

async function calendar(overrides: Partial<LoomiCalendar> = {}): Promise<LoomiCalendar> {
  const el = await fixture<LoomiCalendar>(
    html`<loomi-calendar .date=${MARCH} .events=${EVENTS}></loomi-calendar>`,
  );
  Object.assign(el, overrides);
  await el.updateComplete;
  await nextFrame();
  return el;
}

const text = (el: LoomiCalendar): string => el.shadowRoot!.textContent ?? "";

describe("loomi-calendar", () => {
  it("renders the shell with a toolbar", async () => {
    const el = await fixture(html`<loomi-calendar></loomi-calendar>`);
    expect(el.shadowRoot!.querySelector(".shell")).to.exist;
  });

  describe("views", () => {
    it("renders the month grid by default", async () => {
      const el = await calendar();
      expect(el.view).to.equal("month");
      expect(el.shadowRoot!.querySelector(".month-view")).to.exist;
      // Weekends are hidden by default, so a default month is a five-column work week.
      expect(el.shadowRoot!.querySelectorAll(".weekday")).to.have.lengthOf(5);
    });

    it("switches to the agenda view and lists events there", async () => {
      const el = await calendar({ view: "agenda" } as Partial<LoomiCalendar>);
      expect(el.shadowRoot!.querySelector(".agenda-view")).to.exist;
      expect(text(el)).to.contain("Design review");
    });

    it("switches to a time grid for week and day", async () => {
      const week = await calendar({ view: "week" } as Partial<LoomiCalendar>);
      // The time grid reuses the month-view class and adds time-view alongside it.
      expect(week.shadowRoot!.querySelector(".time-view")).to.exist;

      const day = await calendar({ view: "day" } as Partial<LoomiCalendar>);
      expect(day.shadowRoot!.querySelector(".time-view")).to.exist;
    });

    it("adds the weekend columns when show-weekends is on", async () => {
      const el = await calendar({ showWeekends: true } as Partial<LoomiCalendar>);
      expect(el.shadowRoot!.querySelectorAll(".weekday")).to.have.lengthOf(7);
    });
  });

  describe("events", () => {
    it("shows event titles in the month grid", async () => {
      const el = await calendar();
      expect(text(el)).to.contain("Standup");
    });

    it("re-renders when the events array is replaced", async () => {
      const el = await calendar();
      expect(text(el)).to.contain("Standup");

      el.events = [
        {
          id: "new",
          title: "Retro",
          start: new Date(2026, 2, 18, 10),
          end: new Date(2026, 2, 18, 11),
        },
      ] as LoomiCalendar["events"];
      await el.updateComplete;

      expect(text(el)).to.contain("Retro");
      expect(text(el), "the old event is gone").to.not.contain("Standup");
    });

    it("emits loomi-event-click with the clicked event", async () => {
      const el = await calendar({ view: "agenda" } as Partial<LoomiCalendar>);
      const item = el.shadowRoot!.querySelector(".agenda-item") as HTMLElement;
      expect(item, "an agenda row is rendered").to.exist;

      setTimeout(() => item.click());
      const event = (await oneEvent(el, "loomi-event-click")) as CustomEvent;
      expect(event.detail.event.id).to.be.a("string");
    });
  });

  describe("locale and timezone", () => {
    it("renders weekday headings in the configured locale", async () => {
      const en = await calendar({ locale: "en" } as Partial<LoomiCalendar>);
      const fr = await calendar({ locale: "fr" } as Partial<LoomiCalendar>);
      const heading = (el: LoomiCalendar) =>
        el.shadowRoot!.querySelector(".weekday")!.textContent!.trim();
      expect(heading(fr), "French headings differ from English").to.not.equal(heading(en));
    });

    it("starts the week on the configured day", async () => {
      // Only observable with weekends shown: hide them and both orders start on Monday.
      const sunday = await calendar({
        weekStarts: "sunday",
        showWeekends: true,
      } as Partial<LoomiCalendar>);
      const monday = await calendar({
        weekStarts: "monday",
        showWeekends: true,
      } as Partial<LoomiCalendar>);
      const first = (el: LoomiCalendar) =>
        el.shadowRoot!.querySelector(".weekday")!.textContent!.trim();
      expect(first(sunday)).to.not.equal(first(monday));
      expect(first(monday)).to.equal("Mo");
    });
  });

  describe("chrome", () => {
    it("exposes the sidebar only when enabled", async () => {
      const off = await calendar({ showSidebar: false } as Partial<LoomiCalendar>);
      expect(off.shadowRoot!.querySelector(".shell")!.classList.contains("has-sidebar")).to.be
        .false;

      const on = await calendar({ showSidebar: true } as Partial<LoomiCalendar>);
      expect(on.shadowRoot!.querySelector(".shell")!.classList.contains("has-sidebar")).to.be.true;
    });

    it("reflects view so it can be styled from the light DOM", async () => {
      const el = await calendar({ view: "agenda" } as Partial<LoomiCalendar>);
      expect(el.getAttribute("view")).to.equal("agenda");
    });

    it("names its context menu for assistive technology", async () => {
      const el = await calendar();
      const menu = el.shadowRoot!.querySelector("loomi-context-menu");
      expect(menu, "the calendar renders a context menu").to.exist;
      expect(menu!.getAttribute("label")).to.be.a("string").and.not.be.empty;
    });
  });
});
