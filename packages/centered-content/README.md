# @loomi/centered-content

`<loomi-centered-content>` — vertically and horizontally centers its content. Great for sign-in screens, empty pages and hero sections.

```bash
npm install @loomi/centered-content lit
```

```js
import "@loomi/centered-content/loomi-centered-content.js";
```

## Usage

```html
<loomi-centered-content min-height="80vh" max-width="24rem">
  <h1>Welcome back</h1>
  <p>Sign in to continue.</p>
</loomi-centered-content>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `min-height` | 60vh | Height of the centering area (any CSS length). |
| `max-width` | 28rem | Max width of the inner content (any CSS length). |

**Slot:** default (centered content).
