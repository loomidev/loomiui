---
"@loomidev/filepicker": minor
---

`<loomi-filepicker>` now exposes a read-only `type` (always `"file"`) and a `files` getter returning a `FileList` of the current selection (the same files as `selectedFiles`), so framework bindings that special-case file inputs work with it. `clear()` no longer fires `input`/`change`, matching `value = ""`; only user changes to the selection fire events, `input` before `change`.
