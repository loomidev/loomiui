---
"@loomidev/select": patch
"@loomidev/button": minor
"@loomidev/core": minor
---

Fixed `<loomi-select>` discarding an empty `selected-value`. A filter whose unfiltered
choice carries `value=""` — "All categories", "Any status" — was read as "nothing
selected", so the trigger fell back to its placeholder instead of showing the option the
caller had chosen. An empty value now counts when the options actually offer one, and
the selection is re-resolved when `data` arrives after `selected-value`, which is the
usual order in a framework binding.

Gave `<loomi-button>` `delegatesFocus`. The host was not focusable, so `el.focus()` on it
did nothing at all — a silent no-op that only surfaces in keyboard testing, and the
reason a component needing to hand focus back to a button trigger had to reach through
the shadow root for it. `<loomi-split-button>` already did this; the two now agree.

Fixed `<loomi-button can-submit>` never submitting anything. It set `type="submit"` on
its rendered `<button>` — but that button is inside the component's shadow root, and form
association does not cross a shadow boundary, so a consumer's `<form>` in the light DOM
never heard about it. Clicking did nothing at all: no error, no submit, just a form that
would not send. It now walks out through its shadow hosts to find the owning form and
calls `requestSubmit()`, so the form's validation and its `submit` listeners still run.

Added `positionFloatingPanel()` to `@loomidev/core`, extracted from
`<loomi-split-button>`. It places a panel beside its anchor in viewport coordinates,
flipping and shifting to stay on screen, so components that take their panel out of flow
share one implementation rather than each growing their own.
