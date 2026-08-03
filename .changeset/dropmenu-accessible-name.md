---
"@loomidev/dropmenu": minor
---

Added a `label` property to `<loomi-dropmenu>`, which names both the trigger button
and the menu panel for assistive technology.

An icon-only dropmenu previously had no accessible name at all, and there was no way
for a consumer to give it one: the trigger is a `<button>` inside the component's
shadow root, so an `aria-label` placed on the host element never reaches it. A screen
reader announced the control as an unnamed button, and a name-based query such as
Playwright's `getByRole("button", { name })` could not find it.

A trigger slotted with visible text names itself and should leave `label` unset,
rather than have an invisible name override the words on screen.
