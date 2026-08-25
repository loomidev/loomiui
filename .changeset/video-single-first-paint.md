---
"@loomidev/video": patch
---

`<loomi-video>` no longer renders twice on first paint. It kept a `mediaReady` flag whose
only job was to force a second pass so the picture-in-picture check could see the internal
`<video>`; PiP support is a property of the browser, so it is now read from
`HTMLVideoElement.prototype` and the control bar gets the button on the first render
instead of growing one a frame later. The redundant volume read-back is gone too, and the
one piece of state that genuinely depends on the rendered DOM — the subtitle track list —
is read just after the update cycle rather than inside it.
