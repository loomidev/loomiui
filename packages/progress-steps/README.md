# @loomidev/progress-steps

`<loomi-progress-steps>` and `<loomi-progress-step>` show where a user is in a
multi-step flow such as checkout, onboarding, import wizards, or approval workflows.

```bash
npm install @loomidev/progress-steps lit
```

```js
import "@loomidev/progress-steps";
```

## Basic Usage

```html
<loomi-progress-steps current="2">
  <loomi-progress-step label="Account" description="Create your profile"></loomi-progress-step>
  <loomi-progress-step label="Billing" description="Add payment details"></loomi-progress-step>
  <loomi-progress-step label="Confirm" description="Review and finish"></loomi-progress-step>
</loomi-progress-steps>
```

## Accessibility

loomi-progress-steps is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

The wrapper renders a list of steps, marks the current step with `aria-current="step"`,
and uses real buttons or links when steps are clickable. Completed and error states are
visible through both icon shape and text/state styling.

## Responsive behavior

loomi-progress-steps is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.

Horizontal steps share the available width and keep labels aligned with their markers.
Use `orientation="vertical"` for narrow panels, sidebars, or flows with longer
descriptions.

## Dark mode

loomi-progress-steps uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

Markers, connector lines, labels, and focus treatments use Loomi semantic tokens, so
the stepper follows `.dark` mode and custom themes without hard-coded light borders.

## Dependencies

- `@loomidev/progress`
