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
 *
 * Reference them with `animation: loomi-pop-in var(--loomi-motion-duration) var(--loomi-motion-ease);`
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

  /* Near-zero rather than 0s: animation shorthands still resolve (no "no animation"
     browser quirks) and any future animationend listener still fires. */
  @media (prefers-reduced-motion: reduce) {
    :host {
      --loomi-motion-duration: 0.01ms;
    }
  }
`;
