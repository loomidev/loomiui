# @loomidev/text-editor

`<loomi-text-editor>` is a themeable rich-text editor web component with a native
browser editing surface, a configurable toolbar, Loomi icons, Loomi tooltips, floating
labels, inline validation, and native form submission.

The editor stores its value as HTML. That means users can format text visually, and your
form or application receives markup such as `<p>Hello <strong>world</strong></p>`.

```bash
npm install @loomidev/text-editor lit
```

```js
import "@loomidev/text-editor";
```


## Basic Usage

```html
<loomi-text-editor name="comment" label="Comment"></loomi-text-editor>
```

Use `placeholder` for a hint inside the editing area:

```html
<loomi-text-editor
  name="comment"
  label="Comment"
  placeholder="Write a thoughtful response"
></loomi-text-editor>
```

## Choosing Toolbar Tools

The `tools` prop controls what appears in the toolbar.

For plain HTML, pass a comma-separated list:

```html
<loomi-text-editor
  label="Release notes"
  tools="basic,headings,lists,link"
></loomi-text-editor>
```

For JavaScript frameworks, you can also assign an array property. This is nicer when the
tools come from configuration:

```js
const editor = document.querySelector("loomi-text-editor");
editor.tools = ["basic", "colors", "lists", "embed"];
```

Both forms are supported on purpose:

- Use a comma-separated string for HTML, Blade, Astro, or server-rendered templates.
- Use an array when you are already in JavaScript, React refs, Vue refs, Svelte actions,
  or another framework layer.

If `tools` is not set, the editor uses:

```txt
default = basic, headings, lists, align, embed
```

Use `tools="all"` for the complete toolbar, or `tools="none"` to hide the toolbar and
use the editor as a plain rich-text field.

## Individual Tools

| Tool value | What it shows |
| --- | --- |
| `heading` | A block style picker with Body and H1-H6. |
| `font-family` | Font family picker. |
| `font-size` | Relative font size picker. |
| `bold` | Bold text. |
| `italic` | Italic text. `italics` is accepted as an alias. |
| `underline` | Underlined text. |
| `strikethrough` | Struck-through text. `strike` is accepted as an alias. |
| `font-color` | Text color picker. `color`, `text-color`, and `font-colour` are accepted aliases. |
| `highlight-color` | Highlight/background color picker. `highlight` and `highlight-colour` are accepted aliases. |
| `bullet-list` | Dotted list. `bullets`, `dots`, and `unordered-list` are accepted aliases. |
| `ordered-list` | Numbered list. `numbers` and `numbered-list` are accepted aliases. |
| `align-left` | Left alignment. |
| `align-center` | Center alignment. `centre` and `align-centre` are accepted aliases. |
| `align-right` | Right alignment. |
| `align-justify` | Justified alignment. |
| `inline-code` | Inline code formatting. |
| `superscript` | Superscript text. |
| `subscript` | Subscript text. |
| `blockquote` | Blockquote formatting. |
| `code-block` | Preformatted code block. |
| `link` | Opens a Loomi modal with URL and display text inputs. |
| `image` | Opens a Loomi modal with URL, alt text, and a `loomi-filepicker` image option. |
| `video` | Opens a Loomi modal with URL and a `loomi-filepicker` video option. YouTube and Vimeo URLs are normalized to embed URLs. |
| `ai` | Shows an AI generate button and dispatches `loomi-ai-generate` for your app to handle. `generate` and `ai-generate` are accepted aliases. |

## Tool Groups

Groups let you keep templates readable.

| Group | Expands to |
| --- | --- |
| `default` | `basic`, `heading`, `lists`, `align`, `embed` |
| `basic` | `bold`, `italic`, `underline`, `strikethrough` |
| `marks` | `basic`, `inline-code`, `superscript`, `subscript` |
| `colors` | `font-color`, `highlight-color` |
| `font` | `font-family`, `font-size` |
| `typography` | `heading`, `font-family`, `font-size`, `font-color`, `highlight-color` |
| `lists` | `bullet-list`, `ordered-list` |
| `align` | `align-left`, `align-center`, `align-right`, `align-justify` |
| `script` | `superscript`, `subscript` |
| `code` | `inline-code`, `code-block` |
| `blocks` | `blockquote`, `code-block` |
| `embed` | `link`, `image`, `video` |
| `media` | `image`, `video` |
| `all` | Everything listed above, including `ai` |
| `none` | No toolbar |

You can mix groups and individual values:

```html
<loomi-text-editor
  label="Article body"
  tools="typography,basic,lists,blockquote,link,image"
></loomi-text-editor>
```

Duplicate tools are ignored, and the toolbar keeps a consistent Loomi order.

## Headings vs Font Size

The editor includes H1-H6 through the `heading` tool, even though `font-size` also exists.
They are not the same thing:

- Use headings when the text has document structure, such as article titles, section
  headings, or email headings.
- Use font size when you only want visual emphasis inside otherwise normal content.

This keeps submitted HTML more useful for accessibility, search, server-side rendering,
and later content processing.

## Icons and Tooltips

Toolbar buttons use `<loomi-icon>` where the shared icon registry has a suitable icon.
Every toolbar icon control is wrapped in `<loomi-tooltip>`, so compact controls still
explain themselves on hover or keyboard focus.

Some text-formatting controls, such as superscript and subscript, use short text labels
when that is clearer than forcing an unrelated icon.

## Labels, Height, and Validation

`label` renders above the editor. `rows` controls the minimum editor height before content
pushes it taller.

```html
<loomi-text-editor
  name="bio"
  label="Bio"
  rows="6"
  required
  show-error-inline
  error-message="Tell us a little about yourself"
></loomi-text-editor>
```

`validate()` returns `true` or `false`:

```js
const editor = document.querySelector("loomi-text-editor");

saveButton.addEventListener("click", () => {
  if (!editor.validate()) return;
  // continue with a valid value
});
```

## Reading Values

`value` is always HTML:

```js
const editor = document.querySelector("loomi-text-editor");

editor.addEventListener("input", () => {
  console.log(editor.value);
});
```

Example value:

```html
<h2>Project update</h2>
<p>The <strong>new dashboard</strong> is ready for review.</p>
<ul>
  <li>Confirm the final copy.</li>
  <li>Share feedback before Friday.</li>
</ul>
```

## Submitting Values

`<loomi-text-editor>` is form-associated. Give it a `name`, and it submits with native
`FormData` just like an input:

```html
<form id="post-form">
  <loomi-text-editor
    name="body"
    label="Post body"
    tools="all"
    required
  ></loomi-text-editor>

  <button>Publish</button>
</form>

<script type="module">
  import "@loomidev/text-editor";

  const form = document.querySelector("#post-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const html = data.get("body");

    console.log(html);
  });
</script>
```

## Handling Submitted HTML Safely

Because the value is HTML, treat it as user-generated HTML.

Recommended flow:

1. Validate that required content exists in the browser with `required`, `validate()`, or
   your form library.
2. Submit `value` or `new FormData(form).get(name)` to your server.
3. Sanitize the HTML on the server with your platform's trusted HTML sanitizer.
4. Store the sanitized HTML, or store both the original and sanitized versions if your
   moderation workflow needs that.
5. When rendering saved content, render only sanitized HTML.

Do not trust client-side sanitizing as your only protection. The browser can be modified,
requests can be replayed, and `value` can be assigned directly from JavaScript.

For simple previews where you only need plain text, convert HTML to text in your app:

```js
function htmlToText(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || "";
}
```

## Links, Images, and Videos

The `link`, `image`, and `video` tools open a `<loomi-modal>` instead of using browser
prompts.

- Link inserts use `<loomi-input>` fields for the URL and optional display text.
- Image inserts use `<loomi-input>` for an image URL and alt text, plus
  `<loomi-filepicker>` for choosing an image file.
- Video inserts use `<loomi-input>` for a video URL, plus `<loomi-filepicker>` for choosing
  a video file.

Links are hardened with `target="_blank"` and `rel="noopener noreferrer"`. Image and video
URL fields accept HTTP, HTTPS, and relative URLs. YouTube and Vimeo links render as iframe
embeds. Files chosen through `loomi-filepicker` are inserted as data URLs, which works
well for immediate previews and simple forms; production upload flows should upload the
file first and insert the returned CDN or storage URL.

If your product needs a media library, upload flow, or custom link picker, keep `image`,
`video`, or `link` out of `tools` and provide your own buttons outside the editor. Those
buttons can update `editor.value` or use your own app-level insertion flow.

## AI Generate Option

Add `ai` to `tools` to show a sparkles button in the toolbar. Aliases `generate` and
`ai-generate` are also accepted when configuring `tools`.

```html
<loomi-text-editor tools="basic,lists,ai"></loomi-text-editor>
```

When clicked, the editor dispatches `loomi-ai-generate`. LoomiUI does not call any AI
provider itself — your app listens for the event, runs the request against OpenAI,
Anthropic, a local model, or your own backend, then inserts the returned HTML through
`event.detail.insert(html)`.

```js
editor.addEventListener("loomi-ai-generate", async (event) => {
  const { html, selection, insert } = event.detail;

  const prompt = selection
    ? `Improve this selected text while keeping the same meaning:\n\n${selection}`
    : "Write a short introduction paragraph for this document.";

  const result = await generateText({
    html,
    selection,
    prompt,
  });

  insert(result.html);
});
```

### Event detail

| Detail | Description |
| --- | --- |
| `html` | The editor's current HTML value. Use this for full-document prompts such as summarize, expand, or rewrite. |
| `selection` | The plain-text selection at click time, if any. Empty when the caret is collapsed or nothing is selected. |
| `insert(html)` | Helper that restores the saved selection and inserts generated HTML at that point. If the user had text selected, replace or wrap that range in your handler before calling `insert`. |

### Selection behavior

The editor saves the current range when the sparkles button is clicked. Call
`event.detail.insert(html)` after your async request finishes and the generated markup
will land at that saved position. This works whether the user selected a sentence,
placed the caret mid-paragraph, or clicked with no selection (insertion happens at the
caret).

Typical flows:

- **Selection present:** send `selection` (and optionally surrounding `html`) to your model,
  then call `insert()` with the rewritten fragment.
- **No selection:** treat `html` as document context and insert new content at the caret.
- **Replace vs append:** `insert()` uses `document.execCommand("insertHTML")` under the hood.
  Pass only the fragment you want added or swapped in.

### Integration notes

- The button is disabled when the editor is `disabled` or `readonly`.
- Handle errors in your listener — the editor will not show a built-in AI error state.
- Sanitize model output before insertion if your provider can return raw HTML.
- Keep prompts, API keys, and rate limiting in application code so the component stays
  provider-neutral.

This keeps LoomiUI provider-neutral while still giving users a real toolbar affordance.

## Accessibility

loomi-text-editor is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior

loomi-text-editor is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.

## Dark mode

loomi-text-editor uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.

## Attributes and Properties

| Attribute / property | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the nearest form. |
| `label` | _(blank)_ | Label above the editor. |
| `placeholder` | _(blank)_ | Placeholder text shown when the editor is empty. |
| `value` | _(blank)_ | Current value as HTML. |
| `tools` | `default` | Comma-separated string attribute, or string array property. |
| `rows` | `3` | Minimum height in text rows. |
| `required` | `false` | Marks the editor required. |
| `disabled` | `false` | Disables editing and toolbar controls. |
| `readonly` | `false` | Makes content readable but not editable. |
| `error-message` | _(blank)_ | Message used when validation fails. |
| `show-error-inline` | `false` | Shows `error-message` under the field. |
| `no-clearing` | `false` | Removes the default bottom margin. |
| `variant` | `default` | `default` \| `minimal` (bottom border only, no box) |

**Methods:** `focus()`, `validate()`, `checkValidity()`, `reportValidity()`.

**Events:** `input`, `change`, `loomi-ai-generate`.

**CSS parts:** `field`, `toolbar`, `editor`.

## Framework integration

`<loomi-text-editor>` is a standard custom element, so it works in plain HTML, Blade,
React, Vue, Angular, Svelte, Astro, and most other frameworks. Import the package once
before the tag renders.

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/text-editor"></script>

<loomi-text-editor name="notes" label="Notes" tools="basic,lists,embed"></loomi-text-editor>
```

</loomi-tab>
<loomi-tab label="React">

React can render the custom element directly. If you want to pass an array to `tools`,
assign it with a ref after mount.

```jsx
import { useEffect, useRef } from "react";
import "@loomidev/text-editor";

export function Editor() {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.tools = ["basic", "colors", "lists", "embed"];
  }, []);

  return <loomi-text-editor ref={ref} name="body" label="Body" />;
}
```

</loomi-tab>
<loomi-tab label="Vue">

```vue
<script setup>
import "@loomidev/text-editor";
</script>

<template>
  <loomi-text-editor name="body" label="Body" tools="all" />
</template>
```

</loomi-tab>
<loomi-tab label="Angular">

Add `CUSTOM_ELEMENTS_SCHEMA`, then use the tag in your template.

```ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/text-editor";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<loomi-text-editor name="body" label="Body" tools="all"></loomi-text-editor>`,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte / Astro">

```svelte
<script>
  import "@loomidev/text-editor";
</script>

<loomi-text-editor name="body" label="Body" tools="typography,basic,embed"></loomi-text-editor>
```

```astro
---
import "@loomidev/text-editor";
---

<loomi-text-editor name="body" label="Body" tools="typography,basic,embed"></loomi-text-editor>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro may render HTML before browser-only
custom elements run. If a framework complains, move the import to client-side code. In
Next.js that usually means a component with `"use client"`; in Nuxt it often means a
`.client.ts` plugin.

## Developing This Package

Run commands from the top-level `components` workspace:

```bash
pnpm --filter @loomidev/text-editor build
pnpm --filter @loomidev/text-editor typecheck
```

## Dependencies

- `@loomidev/core`
- `@loomidev/filepicker`
- `@loomidev/icon`
- `@loomidev/input`
- `@loomidev/modal`
- `@loomidev/select`
- `@loomidev/theme`
- `@loomidev/tooltip`
