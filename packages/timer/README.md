# @loomidev/timer

`<loomi-timer>` is an animated count up/down timer with a progress halo, subtle
tick motion, and optional controls.

```bash
npm install @loomidev/timer lit
```

```js
import "@loomidev/timer";
```

## Basic Usage

```html
<loomi-timer auto-start></loomi-timer>
```

The default timer counts down from 60 seconds.

## Count Down

```html
<loomi-timer
  direction="down"
  duration="300"
  label="Focus"
  auto-start
  show-controls
></loomi-timer>
```

## Count Up

Without `duration`, count-up mode behaves like a stopwatch.

```html
<loomi-timer direction="up" auto-start show-controls></loomi-timer>
```

Add `duration` to stop at a target.

```html
<loomi-timer direction="up" duration="90" label="Sprint" auto-start></loomi-timer>
```

## Font Size

The display scales from the host element's normal `font-size`, so plain HTML
styling works.

```html
<loomi-timer style="font-size: 28px" duration="120"></loomi-timer>

<style>
  .large-timer {
    font-size: 40px;
  }
</style>

<loomi-timer class="large-timer" direction="up" auto-start></loomi-timer>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `direction` | `down` | `down` counts to zero; `up` counts upward. |
| `duration` | `60` | Timer length in seconds. In count-up mode, omitted `duration` means unbounded. |
| `start-value` | `0` | Initial displayed seconds. In countdown mode, `0` falls back to `duration`. |
| `format` | `clock` | `clock` or `seconds`. |
| `label` | _(blank)_ | Optional label above the time. |
| `color` | `primary` | Any loomi color. |
| `auto-start` | `false` | Starts when connected. _(boolean)_ |
| `show-controls` | `false` | Shows Start/Pause and Reset controls. _(boolean)_ |
| `animated` | `true` | Enables subtle tick animation. _(boolean)_ |
| `running` | `false` | Reflects the current running state. |

## Methods

```js
const timer = document.querySelector("loomi-timer");

timer.start();
timer.pause();
timer.reset();
```

## Events

`timer-start`, `timer-pause`, `timer-reset`, `timer-tick`, and `timer-complete`
bubble and include:

```ts
{
  value: number;
  direction: "up" | "down";
  duration: number;
  progress: number;
  complete: boolean;
}
```
