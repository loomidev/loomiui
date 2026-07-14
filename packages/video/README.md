# @loomidev/video

`<loomi-video>` is a themeable wrapper around the native `<video>` element. The
browser's real media element does all the codec/format/network work under the
hood; on top of it, `loomi-video` layers a themeable, keyboard-accessible
control bar built from `@loomidev/button` and `@loomidev/slider` — instead of
the browser's native control UI.

```bash
npm install @loomidev/video lit
```

```js
import "@loomidev/video";
```

## Basic Usage

```html
<loomi-video src="/demo.mp4" controls poster="/poster.jpg"></loomi-video>
```

Without `controls`, `loomi-video` is a bare, unstyled passthrough — exactly
like a plain `<video>` with no `controls` attribute. Set `controls` to opt
into the loading state, error state, click-to-play overlay, and themed
control bar (play/pause, seek, volume, captions, picture-in-picture,
fullscreen).

## Multiple Sources & Subtitle Tracks

`<source>` and `<track>` children work exactly like plain HTML — they're
moved onto the real internal `<video>` element on connect (Shadow DOM
slotting alone can't make a native media element discover them itself, so
`loomi-video` does this move for you).

```html
<loomi-video controls poster="/poster.jpg">
  <source src="/demo.webm" type="video/webm" />
  <source src="/demo.mp4" type="video/mp4" />
  <track kind="subtitles" src="/captions-en.vtt" srclang="en" label="English" default />
  <track kind="subtitles" src="/captions-fr.vtt" srclang="fr" label="Français" />
</loomi-video>
```

When one or more `<track>` children are present, a captions button appears in
the control bar. Clicking it opens a small menu listing "Off" plus each
track's label; press "c" while the player is focused to cycle captions on/off
without opening the menu.

## Theme Integration

`color` picks the accent used for the seek/volume sliders, the play button,
and focus rings — any loomi color.

```html
<loomi-video src="/demo.mp4" controls color="success"></loomi-video>
<loomi-video src="/demo.mp4" controls color="error"></loomi-video>
```

## Aspect Ratio & Fit

```html
<loomi-video src="/demo.mp4" controls aspect-ratio="1 / 1" fit="cover"></loomi-video>
```

`aspect-ratio` reserves the right amount of space before metadata loads (no
layout shift). `fit` maps to `object-fit` — `contain` (default), `cover`, or
`fill`.

## Custom Controls

Replace the entire built-in control bar with your own markup via the
`controls` slot — loading, error, and click-to-play overlays are unaffected.

```html
<loomi-video src="/demo.mp4" controls>
  <div slot="controls">
    <button onclick="this.closest('loomi-video').togglePlay()">Play / Pause</button>
  </div>
</loomi-video>
```

## Loading & Error States

While the browser is buffering (initial load or a mid-playback stall),
`loomi-video` shows a themed `@loomidev/spinner` overlay. If the media fails
to load — a bad URL, an unsupported format, a network error — it shows a
friendly message with a "Retry" button that reloads the source. Listen for
the `loomi-video-error` event to hook in your own logging/telemetry.

## Keyboard Accessibility

With the player focused (click it, or Tab to it):

| Key            | Action                                  |
| -------------- | --------------------------------------- |
| `Space` / `k`  | Toggle play/pause                       |
| `←` / `→`      | Seek 5s back/forward                    |
| `↑` / `↓`      | Volume up/down                          |
| `m`            | Toggle mute                             |
| `f`            | Toggle fullscreen                       |
| `c`            | Toggle captions (if a track is present) |
| `Home` / `End` | Seek to start/end                       |

Every control in the bar (buttons, sliders) is independently focusable and
reachable by Tab, in addition to these shortcuts.

## Fullscreen & Picture-in-Picture

Both use the standard browser APIs (`requestFullscreen`/`exitFullscreen`,
`requestPictureInPicture`/`exitPictureInPicture`) on the player itself, so
your control bar stays visible in both modes. The picture-in-picture button
is hidden automatically when the browser doesn't support it (or set
`disable-pip` to always hide it); set `disable-fullscreen` to hide the
fullscreen button.

## Accessibility

`loomi-video` is built on semantic markup where the browser gives us the
right behavior, and adds ARIA only where the component has custom
interaction. Every icon-only control has an accessible label (`aria-label` or
visually-hidden text), the error overlay uses `role="alert"`, and the
captions menu uses `role="menu"`/`menuitemradio`.

- Supports keyboard focus with visible `:focus-visible` styling on the player
  and every interactive control.
- Full keyboard shortcut set (see above) in addition to individually tabbable
  controls.

## Responsive behavior

The player fills its container width (`width: 100%`) and reserves height via
`aspect-ratio`, so it behaves predictably in cards, grids, and flexible
layouts. The control bar's volume slider and time labels hide automatically
in narrow containers (via CSS container queries) rather than overflowing or
wrapping awkwardly.

## Dark mode

`loomi-video`'s control bar is designed to sit over video content regardless
of your page's theme — it uses a translucent dark scrim and white icons by
design, not the light/dark semantic tokens. The accent color (play button,
sliders, focus rings) still follows `color` and picks up `.dark` overrides
from `@loomidev/theme-switcher` the same as every other loomi component.

## Attributes

| Attribute            | Default    | Description                                                                                                                                                                                                                              |
| -------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src`                | _(blank)_  | Video URL. Omit it and use `<source>` children instead for format fallback.                                                                                                                                                              |
| `poster`             | _(blank)_  | Poster image URL, shown before playback starts.                                                                                                                                                                                          |
| `controls`           | `false`    | Shows the themed control bar, loading/error states, and click-to-play overlay. _(boolean)_                                                                                                                                               |
| `autoplay`           | `false`    | _(boolean)_                                                                                                                                                                                                                              |
| `loop`               | `false`    | _(boolean)_                                                                                                                                                                                                                              |
| `muted`              | `false`    | _(boolean)_                                                                                                                                                                                                                              |
| `preload`            | `metadata` | `none` \| `metadata` \| `auto`.                                                                                                                                                                                                          |
| `playsinline`        | `true`     | Defaults to `true` (unlike native `<video>`) so iOS Safari doesn't hijack playback into its own native fullscreen player, which would hide the control bar. Set `playsinline="false"` to opt back into that native behavior. _(boolean)_ |
| `crossorigin`        | _(blank)_  | `""` \| `anonymous` \| `use-credentials`.                                                                                                                                                                                                |
| `color`              | `primary`  | Accent color for the control bar. Any loomi color.                                                                                                                                                                                       |
| `aspect-ratio`       | `16 / 9`   | Any valid CSS `aspect-ratio` value.                                                                                                                                                                                                      |
| `fit`                | `contain`  | `contain` \| `cover` \| `fill` — maps to `object-fit`.                                                                                                                                                                                   |
| `autohide-controls`  | `true`     | Hides the control bar after a few seconds of inactivity while playing. _(boolean)_                                                                                                                                                       |
| `disable-pip`        | `false`    | Always hides the picture-in-picture button. _(boolean)_                                                                                                                                                                                  |
| `disable-fullscreen` | `false`    | Always hides the fullscreen button. _(boolean)_                                                                                                                                                                                          |

## Slots

| Slot        | Description                                                           |
| ----------- | --------------------------------------------------------------------- |
| _(default)_ | `<source>`/`<track>` children, forwarded onto the internal `<video>`. |
| `controls`  | Replaces the entire built-in control bar with custom markup.          |

## Methods

```js
const player = document.querySelector("loomi-video");

player.play();
player.pause();
player.togglePlay();
player.seek(30); // seconds
player.toggleMute();
player.setVolume(0.5); // 0–1
player.toggleFullscreen();
player.togglePictureInPicture();
player.selectTrack(0); // index into player's text tracks, or -1 for "off"
```

Read-only getters mirror the underlying media element: `paused`, `ended`,
`currentTime`, `duration`. `currentTime` is also settable (`player.currentTime
= 30`), and forwards to `seek()`.

## Events

`loomi-video` re-dispatches key media events from the host element (the real
`<video>` lives behind the Shadow DOM boundary, so this is how consumers
observe it without reaching into internals):

| Event                                             | Detail                                                                                                                                              |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `play` / `pause` / `ended`                        | _(none)_                                                                                                                                            |
| `timeupdate`                                      | `{ currentTime, duration }`                                                                                                                         |
| `volumechange`                                    | `{ volume, muted }`                                                                                                                                 |
| `fullscreenchange`                                | `{ fullscreen }`                                                                                                                                    |
| `enterpictureinpicture` / `leavepictureinpicture` | _(none)_                                                                                                                                            |
| `loomi-video-error`                               | `{ code, message }`. Not named `error` — that type bubbling to `window` reads as an uncaught page error to test harnesses and error-tracking tools. |

## Dependencies

- `@loomidev/core`
- `@loomidev/button`
- `@loomidev/icon`
- `@loomidev/slider`
- `@loomidev/spinner`
