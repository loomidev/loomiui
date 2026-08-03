import { css, type CSSResultGroup } from "lit";

/**
 * Shared entrance-animation keyframes + motion tokens, prepended into every component's
 * styles via `loomiStyles()`. Reuse one of these `@keyframes` names instead of hand-rolling
 * a new fade/pop/slide keyframe per package:
 *
 * | keyframe | motion |
 * | --- | --- |
 * | `loomi-fade-in` | opacity only |
 * | `loomi-pop-in` | fade + scale up from 0.98 |
 * | `loomi-rise-in` | fade + rise 8px + scale up from 0.98 |
 * | `loomi-drop-in` | fade + drop down 4px (opens downward, e.g. a menu) |
 * | `loomi-slide-in` | fade + slide in 12px from the trailing edge |
 * | `loomi-spin` | continuous 360° rotation, for loading spinners |
 * | `loomi-fade-out` | reverse of `loomi-fade-in` |
 * | `loomi-drop-out` | reverse of `loomi-drop-in` |
 * | `loomi-rise-out` | reverse of `loomi-rise-in` |
 *
 * The `-out` halves exist because an overlay that eases in and then snaps out of existence
 * reads as no animation at all. Pair them with `onExitAnimationEnd()` below, which is what
 * keeps the element around long enough to play them, and give them
 * `animation-fill-mode: forwards` so the last frame holds instead of flashing back to
 * full opacity before it is hidden.
 *
 * Reference them with `animation: loomi-pop-in var(--loomi-motion-duration) var(--loomi-motion-ease);`
 * (or `animation: loomi-spin var(--loomi-spin-duration) linear infinite;` for the spinner)
 * so `prefers-reduced-motion` is handled for free. Only add a new keyframe here if it's a
 * genuinely new motion primitive — a component that layers its own positioning transform
 * (e.g. a centered overlay combining `translate(-50%, -50%)` with a scale-in) should keep
 * that composite keyframe local rather than forcing this list to carry a variable transform
 * base (see `@loomidev/floating-panel`'s centered variant).
 */
export const motionStyles: CSSResultGroup = css`
  :host {
    --loomi-motion-duration: 0.16s;
    --loomi-motion-ease: ease;
    --loomi-spin-duration: 0.7s;
  }

  @keyframes loomi-fade-in {
    from {
      opacity: 0;
    }
  }
  @keyframes loomi-pop-in {
    from {
      opacity: 0;
      transform: scale(0.98);
    }
  }
  @keyframes loomi-rise-in {
    from {
      opacity: 0;
      transform: translateY(8px) scale(0.98);
    }
  }
  @keyframes loomi-drop-in {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
  }
  @keyframes loomi-slide-in {
    from {
      opacity: 0;
      transform: translateX(12px);
    }
  }
  @keyframes loomi-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes loomi-fade-out {
    to {
      opacity: 0;
    }
  }
  @keyframes loomi-drop-out {
    to {
      opacity: 0;
      transform: translateY(-4px);
    }
  }
  @keyframes loomi-rise-out {
    to {
      opacity: 0;
      transform: translateY(8px) scale(0.98);
    }
  }

  /* Near-zero rather than 0s: animation shorthands still resolve (no "no animation"
     browser quirks) and any future animationend listener still fires. Spinners slow down
     instead, since removing the loading motion entirely would hide that work is in progress. */
  @media (prefers-reduced-motion: reduce) {
    :host {
      --loomi-motion-duration: 0.01ms;
      --loomi-spin-duration: 1.6s;
    }
  }
`;

/** Reads a computed `animation-duration`/`animation-delay` (`"0.16s"`, `"0.01ms"`) as ms. */
function timeToMs(value: string): number {
  const first = value.split(",")[0]?.trim() ?? "";
  const amount = Number.parseFloat(first);
  if (!Number.isFinite(amount)) return 0;
  return first.endsWith("ms") ? amount : amount * 1000;
}

/**
 * Calls `done` once `el` has finished playing its exit animation.
 *
 * The half of a closing overlay that isn't CSS: something has to keep the element rendered
 * (and, for a popover, still in the top layer) until the `-out` keyframe has run, then
 * actually hide it. Components hold a `closing` flag for exactly as long as this takes.
 *
 * Returns a cancel function — call it if the overlay is reopened mid-close, or torn down,
 * so `done` never fires against a element that has moved on.
 *
 * `done` is called at most once, and always eventually: a timer backs up the
 * `animationend` event, because an element that ends up with no animation at all (an
 * ancestor went `display: none`, a consumer overrode the rule) would otherwise sit there
 * half-closed forever.
 */
export function onExitAnimationEnd(el: HTMLElement, done: () => void): () => void {
  let settled = false;
  const style = getComputedStyle(el);
  const fallback = timeToMs(style.animationDuration) + timeToMs(style.animationDelay) + 50;

  const finish = (): void => {
    if (settled) return;
    settled = true;
    cleanup();
    done();
  };
  const onAnimationEnd = (event: AnimationEvent): void => {
    // Ignore animations bubbling up from children — only this element's own exit counts.
    if (event.target === el) finish();
  };
  const timer = window.setTimeout(finish, fallback);
  const cleanup = (): void => {
    window.clearTimeout(timer);
    el.removeEventListener("animationend", onAnimationEnd);
  };

  el.addEventListener("animationend", onAnimationEnd);

  return () => {
    settled = true;
    cleanup();
  };
}
