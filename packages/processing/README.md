# @loomi/processing

`<loomi-processing>` — a process indicator with `processing` (spinner), `success` and `failed` states. Switch `state` (and `title`/`message`) as your async task progresses.

```bash
npm install @loomi/processing lit
```

```js
import "@loomi/processing/loomi-processing.js";
```

## Usage

```html
<loomi-processing title="Uploading…" message="Please wait."></loomi-processing>
<loomi-processing state="success" title="Done!"></loomi-processing>
<loomi-processing state="failed" title="Failed"></loomi-processing>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `state` | processing | `processing` \| `success` \| `failed` |
| `title` | _(blank)_ | Heading text. |
| `message` | _(blank)_ | Supporting text. |
| `color` | primary | Spinner color (processing state). |
