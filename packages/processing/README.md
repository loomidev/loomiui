# @loomi/processing

`<loomi-processing>` — a process indicator with `processing` (spinner), `success` and
`failed` states. Best used inside a [`<loomi-modal>`](../modal) while an async task runs,
switching `state` (and `title`/`message`) once it resolves.

```bash
npm install @loomi/processing lit
```

```js
import "@loomi/processing/loomi-processing.js";
```

## Basic Usage

```html
<loomi-processing title="Uploading…" message="Please wait."></loomi-processing>
```

## States

```html
<loomi-processing state="processing" title="Deleting pending payment"></loomi-processing>
<loomi-processing state="success" title="Done!" message="Pending payment was deleted successfully."></loomi-processing>
<loomi-processing state="failed" title="Failed" message="Pending payment could not be deleted."></loomi-processing>
```

## Color

The spinner color (only relevant in the `processing` state) accepts any loomi color.

```html
<loomi-processing color="violet" title="Uploading…"></loomi-processing>
```

## Full Flow Example

A typical pattern shows `<loomi-processing>` inside a modal while an API call runs,
then swaps `state` based on the result.

```html
<loomi-modal name="delete-payment" show-action-buttons="false">
  <loomi-processing id="delete-status" state="processing" title="Deleting pending payment"></loomi-processing>
</loomi-modal>

<script type="module">
  import { showLoomiModal } from "@loomi/modal/loomi-modal.js";

  async function deletePayment(id) {
    const status = document.getElementById("delete-status");
    status.state = "processing";
    status.title = "Deleting pending payment";
    showLoomiModal("delete-payment");

    try {
      await fetch(`/payments/${id}`, { method: "DELETE" });
      status.state = "success";
      status.title = "Done!";
      status.message = "Pending payment was deleted successfully.";
    } catch {
      status.state = "failed";
      status.title = "Failed";
      status.message = "Pending payment could not be deleted.";
    }
  }
</script>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `state` | `processing` | `processing` \| `success` \| `failed` |
| `title` | _(blank)_ | Heading text. |
| `message` | _(blank)_ | Supporting text. |
| `color` | `primary` | Spinner color (processing state). |

## Full Example

```html
<loomi-processing
  id="status"
  state="processing"
  title="Deleting pending payment"
  message="This will only take a moment."
  color="red"
></loomi-processing>
```
