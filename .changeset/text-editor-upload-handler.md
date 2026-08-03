---
"@loomidev/text-editor": minor
---

Added an `uploadHandler` property and a `no-file-upload` attribute to
`<loomi-text-editor>`, so a file picked in the image or video embed dialog no longer has
to be inlined as a `data:` URL.

Set `editor.uploadHandler = async (file, kind) => url` to upload the file yourself and
insert the returned URL instead. `kind` is `"image"` or `"video"`, so images and video can
be routed to different endpoints with different validation. Without a handler the previous
`data:` URL behavior is unchanged.

This matters for any app that sanitizes editor HTML on save: a media allowlist of
`http`/`https` strips a `data:` URL outright, so the author's image would vanish with no
explanation, and nothing could track which uploads a document referenced. If the handler
rejects or resolves `undefined`, nothing is inserted, the dialog stays open, and the
failure is surfaced as a `<loomi-notification>` error toast rather than being swallowed.

`no-file-upload` hides the picker in both embed dialogs, leaving URL entry only, for apps
that accept media library URLs exclusively.
