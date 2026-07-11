# @loomidev/timer

`<loomi-timer>` is an animated count up/down timer that displays separate
day/hour/minute/second digit segments, each labeled underneath, with a
progress halo, subtle tick motion, and optional controls.

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

The default timer counts down from 1 minute (`mins="1"`).

## Count Down

Set any combination of `days`, `hours`, and `mins` — they're summed together
to form the countdown length.

```html
<loomi-timer
  direction="down"
  hours="1"
  mins="30"
  label="Focus"
  auto-start
  show-controls
></loomi-timer>
```

```html
<loomi-timer direction="down" days="2" hours="6" label="Sale ends in" auto-start></loomi-timer>
```

## Count Up

Without `days`/`hours`/`mins`, count-up mode behaves like a stopwatch and
counts unbounded.

```html
<loomi-timer direction="up" auto-start show-controls></loomi-timer>
```

Set `days`/`hours`/`mins` to stop the count-up at a target.

```html
<loomi-timer direction="up" mins="90" label="Sprint" auto-start></loomi-timer>
```

## Border & Background

By default the timer renders as plain digits with no background or border.
Add `show-border` to render the card-style background and progress border.

```html
<loomi-timer show-border direction="down" mins="5" auto-start></loomi-timer>
```

## Font Size

The display scales from the host element's normal `font-size`, so plain HTML
styling works.

```html
<loomi-timer style="font-size: 28px" mins="2"></loomi-timer>

<style>
  .large-timer {
    font-size: 40px;
  }
</style>

<loomi-timer class="large-timer" direction="up" auto-start></loomi-timer>
```

## Accessibility

loomi-timer is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior

loomi-timer is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.


## Dark mode

loomi-timer uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `direction` | `down` | `down` counts to zero; `up` counts upward. |
| `days` | `0` | Days added to the timer's length. |
| `hours` | `0` | Hours added to the timer's length. |
| `mins` | `1` | Minutes added to the timer's length. In count-up mode, `days`/`hours`/`mins` are unbounded unless at least one is explicitly set. |
| `start-value` | `0` | Initial displayed seconds. In countdown mode, `0` falls back to the `days`/`hours`/`mins` total. |
| `label` | _(blank)_ | Optional label above the digit segments. |
| `color` | `primary` | Any loomi color. |
| `auto-start` | `false` | Starts when connected. _(boolean)_ |
| `show-controls` | `false` | Shows Start/Pause and Reset controls. _(boolean)_ |
| `show-border` | `false` | Shows the background and border around the timer face. _(boolean)_ |
| `animated` | `true` | Enables subtle tick animation. _(boolean)_ |
| `running` | `false` | Reflects the current running state. |

Each digit segment (Days, Hours, Mins, Secs) is always shown, with its label
rendered directly underneath.

## Methods

```js
const timer = document.querySelector("loomi-timer");

timer.start();
timer.pause();
timer.reset();
```

## Events

`loomi-timer-start`, `loomi-timer-pause`, `loomi-timer-reset`, `loomi-timer-tick`, and `loomi-timer-complete`
bubble and include:

```ts
{
  value: number;
  direction: "up" | "down";
  days: number;
  hours: number;
  mins: number;
  progress: number;
  complete: boolean;
}
```

## Dependencies

- `@loomidev/core`
