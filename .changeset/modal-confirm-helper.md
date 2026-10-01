---
"@loomidev/modal": minor
---

New `loomiConfirm()` helper, a promise-based counterpart to `window.confirm()` (also available as `window.loomiConfirm`). It resolves `true` only when OK is clicked, and `false` for Cancel, Escape, a backdrop click or the close icon. One modal is reused, and calls made while a dialog is open are queued and shown in order.
