---
"@loomidev/core": minor
"@loomidev/text-editor": minor
"@loomidev/input": minor
"@loomidev/password": minor
"@loomidev/textarea": minor
"@loomidev/react": minor
---

Insert content at the caret from your own controls.

- `<loomi-text-editor>` gains `insertText(text)`, `insertHTML(html)` and `getSelection()`. The editor remembers its last selection, so inserts from an external toolbar land at the caret (or at the end if nothing was ever selected). New `customTools` property renders app-defined toolbar buttons with the built-in look and tooltip; clicking one calls its `run(editor)` and fires `loomi-tool` with `{ id, insertText, insertHTML }`. New `toolbar-start` and `toolbar-end` slots.
- `<loomi-input>`, `<loomi-password>` and `<loomi-textarea>` gain `insertText(text)` (replaces the selection and fires `input`), plus `selectionStart`, `selectionEnd` and `setSelectionRange()` forwarded to the inner field.
- Fixes in `<loomi-text-editor>`: toolbar commands fired `input` twice per edit. It read the selection from the host's root instead of its own shadow root, so in Chromium its link, embed and AI tools didn't see the selection, and in WebKit a saved selection couldn't be restored.
- `@loomidev/core` exports the `insertTextAtCaret()` helper; `@loomidev/react` adds `onLoomiTool` to `TextEditor`.
