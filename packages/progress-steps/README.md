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

The wrapper renders a list of steps, marks the current step with `aria-current="step"`,
and uses real buttons or links when steps are clickable. Completed and error states are
visible through both icon shape and text/state styling.

For the library-wide baseline, see [Foundations — Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

Horizontal steps share the available width and keep labels aligned with their markers.
Use `orientation="vertical"` for narrow panels, sidebars, or flows with longer
descriptions.

For the shared container and viewport rules, see [Foundations — Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

Markers, connector lines, labels, and focus treatments use Loomi semantic tokens, so
the stepper follows `.dark` mode and custom themes without hard-coded light borders.

For theme activation, token overrides, and contrast guidance, see [Foundations — Dark mode](https://loomiui.com/foundations/#dark-mode).

## Dependencies

- `@loomidev/progress`
