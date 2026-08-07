---
"@loomidev/timezonepicker": patch
---

Fixed the "use my timezone" row vanishing for anyone whose browser reports a zone id
outside the canonical IANA set — most commonly a machine set to UTC, which resolves to a
bare `"UTC"` that `Intl.supportedValuesOf("timeZone")` does not list. The lookup for the
browser's own zone found nothing, so the pinned detect row silently rendered as nothing
and the feature was simply unavailable, with no error. The browser's zone is now unioned
into the list so it is always present and selectable.
