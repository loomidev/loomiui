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

## Variants

Set `variant` on the group to switch how every step renders. The default is
`circle`: numbered/checkmark markers inside a bordered card, connected by chevron
separators. `bar` instead renders a colored segment above each step's label, with
no marker or connector — useful for a more compact, form-wizard-style header.

```html
<loomi-progress-steps variant="bar" current="2">
  <loomi-progress-step label="Job details"></loomi-progress-step>
  <loomi-progress-step label="Application form"></loomi-progress-step>
  <loomi-progress-step label="Preview"></loomi-progress-step>
</loomi-progress-steps>
```

Horizontal circle steps use thin, full-height chevron dividers that meet the card's
top and bottom borders. Dividers keep the same neutral border color for every state.

The group applies its `variant` to every child, so you do not need to set it on
individual steps. The card frame and chevron separators only apply to
`variant="circle"` in the horizontal orientation; vertical steps keep the plain
connector line.

## Interactive Steps

Steps are interactive by default: headers are selectable and only the current step's
content is shown. Horizontal interactive steps place the active content in a full-width
panel beneath the header row. Hidden content stays mounted, preserving form values. This works with
both variants and orientations. Set `interactive="false"` to keep all step content
visible with non-clickable headers; `clickable` alone (without `interactive`) enables
header navigation without hiding content.

```html
<loomi-progress-steps id="signup" validate>
  <loomi-progress-step label="Account" description="Your profile">
    <div style="display: grid; gap: 1rem; max-width: 36rem;">
      <div>
        <h3>Create your workspace profile</h3>
        <p>Tell us who will manage this workspace. We will use your work email
          for account updates and invitations from your team.</p>
      </div>
      <loomi-input label="Full name" name="name" placeholder="Alex Morgan" required></loomi-input>
      <loomi-input label="Work email" name="email" type="email" placeholder="alex@company.com" required></loomi-input>
      <loomi-input label="Workspace name" name="workspace" placeholder="Acme Design" required></loomi-input>
      <div><loomi-button id="continue-account">Continue to billing</loomi-button></div>
    </div>
  </loomi-progress-step>
  <loomi-progress-step label="Billing" description="Invoice details">
    <div style="display: grid; gap: 1rem; max-width: 36rem;">
      <div>
        <h3>Choose where invoices should go</h3>
        <p>Enter the business name and email address that should appear on your
          invoices. You can update these details later in workspace settings.</p>
      </div>
      <loomi-input label="Business name" name="business" placeholder="Acme Ltd" required></loomi-input>
      <loomi-input label="Billing email" name="billing-email" type="email" placeholder="accounts@company.com" required></loomi-input>
      <p>This example collects invoice details only. No payment will be taken.</p>
      <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
        <loomi-button id="back-account" color="gray">Back to account</loomi-button>
        <loomi-button id="continue-billing">Review details</loomi-button>
      </div>
    </div>
  </loomi-progress-step>
  <loomi-progress-step label="Review" description="Check your details">
    <div style="display: grid; gap: 1rem; max-width: 36rem;">
      <div>
        <h3>Review your workspace details</h3>
        <p>Check the profile and invoice information below. Use the back button
          to make changes; your entries will be preserved.</p>
      </div>
      <dl style="display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 0.75rem 1.5rem;">
        <dt>Full name</dt><dd data-review="name"></dd>
        <dt>Work email</dt><dd data-review="email"></dd>
        <dt>Workspace</dt><dd data-review="workspace"></dd>
        <dt>Business name</dt><dd data-review="business"></dd>
        <dt>Billing email</dt><dd data-review="billing-email"></dd>
      </dl>
      <p>This is a preview. Your details have not been submitted.</p>
      <div><loomi-button id="back-billing" color="gray">Edit billing details</loomi-button></div>
    </div>
  </loomi-progress-step>
</loomi-progress-steps>

<script type="module">
  import "@loomidev/progress-steps";
  import "@loomidev/input";
  import "@loomidev/button";

  const steps = document.querySelector("#signup");
  document.querySelector("#continue-account").onclick = () => steps.next();
  document.querySelector("#continue-billing").onclick = () => steps.next();
  document.querySelector("#back-account").onclick = () => steps.previous();
  document.querySelector("#back-billing").onclick = () => steps.previous();
  steps.addEventListener("loomi-progress-steps-change", () => {
    steps.querySelectorAll("[data-review]").forEach((item) => {
      const field = steps.querySelector(`[name="${item.dataset.review}"]`);
      item.textContent = field.value || "Not provided";
    });
  });
</script>
```

The review panel displays the values entered in the earlier steps. Connect your
own submission action when using this pattern in an application.

### Validation

`validate` calls `reportValidity()` on controls in the current step before moving
forward, including custom controls exposing that method. Invalid fields block
navigation and mark the step as an error. Correct the fields and try again to
clear the validation error. Moving backward does not validate.

For custom rules, assign a callback returning a boolean or a promise of a boolean.
When `validate` is also enabled, field validation runs first.

```js
steps.validateStep = async (step, nextIndex) => {
  if (step.stepIndex !== 1) return true;
  const name = step.querySelector('[name="name"]').value.trim();
  return name.length >= 2;
};
```

Returning `false` or rejecting the promise blocks navigation and marks an error.
Your application should show explanatory messages and any loading indicators.
Additional navigation requests are ignored while validation is pending.

An application-assigned `error` or `state="error"` on the current step blocks
forward navigation without running validation. Clear that error when its cause is
resolved. Disabled steps cannot be selected. Forward jumps validate only the current
step, not skipped intermediate steps.

| API | Behavior |
| --- | --- |
| `interactive` | Selectable headers and current-step-only content. Default: `true`. |
| `validate` | Check current-step controls before moving forward. Default: `false`. |
| `validateStep(step, nextIndex)` | Optional synchronous or asynchronous validation callback. |
| `next()` | Move forward one step. Returns `Promise<boolean>`. |
| `previous()` | Move backward one step. Returns `Promise<boolean>`. |
| `goTo(index)` | Select a one-based step. Returns `Promise<boolean>`. |

Methods return `false` when blocked, out of range, or already pending. Successful
changes emit `loomi-progress-steps-change` with `{ current, step }`. Setting `current`
directly is an application override: it bypasses validation and does not emit this
event. Use navigation methods for user-triggered changes.

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
<loomi-progress-steps orientation="vertical" current="2" size="small" interactive="false">
  <loomi-progress-step label="Account" description="Profile created"></loomi-progress-step>
  <loomi-progress-step label="Billing" description="Choose your payment method">
    Your payment details will be used for future subscription renewals.
  </loomi-progress-step>
  <loomi-progress-step label="Confirm" description="Review your details before continuing"></loomi-progress-step>
</loomi-progress-steps>
```

Use `size="small"` for smaller markers; the default is `regular`. Steps are
interactive by default, so add `interactive="false"` when every step's content
should stay visible instead of only the current step's.

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
