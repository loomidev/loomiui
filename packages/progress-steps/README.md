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

## Vertical Steps

Set `orientation="vertical"` on the group to stack steps from top to bottom, with
connector lines beneath the markers. This layout works well in sidebars, narrow
panels, and flows that need longer descriptions or additional content for each step.
Connectors stay centered beneath the circles in both `regular` and `small` sizes,
and additional step content aligns with the labels.
The default orientation is `horizontal`.

```html
<loomi-progress-steps orientation="vertical" current="2">
  <loomi-progress-step label="Account" description="Create your profile"></loomi-progress-step>
  <loomi-progress-step label="Billing" description="Add payment details"></loomi-progress-step>
  <loomi-progress-step label="Confirm" description="Review and finish"></loomi-progress-step>
</loomi-progress-steps>
```

`current` uses one-based numbering in both orientations. In this example, Account
is complete, Billing is current, and Confirm is upcoming. The group applies its
orientation to every child, so you do not need to set it on individual steps.

### Additional Step Content

Place content inside a step to show it below that step's label and description.
In the vertical layout, this content sits beside the connector line.

```html
<loomi-progress-steps orientation="vertical" current="2" size="small">
  <loomi-progress-step label="Account" description="Profile created"></loomi-progress-step>
  <loomi-progress-step label="Billing" description="Choose your payment method">
    Your payment details will be used for future subscription renewals.
  </loomi-progress-step>
  <loomi-progress-step label="Confirm" description="Review your details before continuing"></loomi-progress-step>
</loomi-progress-steps>
```

Use `size="small"` for smaller markers; the default is `regular`. Step content
remains visible regardless of which step is current. If content should appear only
for the current step, control that rendering in your application.

## Accessibility

The wrapper renders a list of steps, marks the current step with `aria-current="step"`,
and uses real buttons or links when steps are clickable. Completed and error states are
visible through both icon shape and text/state styling.

For the library-wide baseline, see [Foundations - Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

Horizontal steps share the available width and keep labels aligned with their markers.
The horizontal group resets step block margins so surrounding prose styles cannot
shift individual steps out of alignment.
Use `orientation="vertical"` for narrow panels, sidebars, or flows with longer
descriptions. The component does not switch orientation automatically at a
breakpoint; update the group's `orientation` in your application if the layout
should change with the available space.

For the shared container and viewport rules, see [Foundations - Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

Markers, connector lines, labels, and focus treatments use Loomi semantic tokens, so
the stepper follows `.dark` mode and custom themes without hard-coded light borders.

For theme activation, token overrides, and contrast guidance, see [Foundations - Dark mode](https://loomiui.com/foundations/#dark-mode).

## Dependencies

- `@loomidev/progress`
