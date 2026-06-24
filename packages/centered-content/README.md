# @loomi/centered-content

`<loomi-centered-content>` — vertically and horizontally centers its content. Great for
sign-in screens, empty pages and hero sections.

```bash
npm install @loomi/centered-content lit
```

```js
import "@loomi/centered-content/loomi-centered-content.js";
```

## Basic Usage

```html
<loomi-centered-content>
  <h1>Welcome back</h1>
  <p>Sign in to continue.</p>
</loomi-centered-content>
```

## Custom Dimensions

`min-height` controls how tall the centering area is; `max-width` caps the width of the
content inside it. Both accept any CSS length.

```html
<loomi-centered-content min-height="100vh" max-width="20rem">
  <h1>Welcome back</h1>
</loomi-centered-content>
```

## Practical Example: Sign-In Screen

```html
<loomi-centered-content min-height="100vh" max-width="24rem">
  <loomi-card>
    <h1 style="margin:0 0 1rem">Sign in</h1>
    <loomi-input type="email" label="Email"></loomi-input>
    <loomi-input type="password" label="Password"></loomi-input>
    <loomi-button block>Sign in</loomi-button>
  </loomi-card>
</loomi-centered-content>
```

## Practical Example: Empty Page

Pair it with [`<loomi-empty-state>`](../empty-state) for a centered "nothing here yet"
screen.

```html
<loomi-centered-content min-height="70vh" max-width="28rem">
  <loomi-empty-state
    heading="No projects yet"
    message="Create your first project to get started."
    button-label="New project"
  ></loomi-empty-state>
</loomi-centered-content>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `min-height` | `60vh` | Height of the centering area (any CSS length). |
| `max-width` | `28rem` | Max width of the inner content (any CSS length). |

**Slot:** default (centered content).

## Full Example

```html
<loomi-centered-content min-height="100vh" max-width="22rem">
  <loomi-card>
    <h1>404</h1>
    <p>This page doesn't exist.</p>
    <loomi-button url="/">Back home</loomi-button>
  </loomi-card>
</loomi-centered-content>
```
