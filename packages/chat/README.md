# @loomidev/chat

`<loomi-chat-window>` and `<loomi-chat-message>` for one-to-one and group chat UIs.

```bash
npm install @loomidev/chat lit
```

```js
import "@loomidev/chat";
```

## Chat Window

```html
<loomi-chat-window
  title="Design review"
  description="Product, design, and eng"
  current-user-id="you"
  show-avatars
  input-max-rows="5"
></loomi-chat-window>
```

```js
const chat = document.querySelector("loomi-chat-window");

chat.participants = [
  { id: "you", name: "You", label: "YO", color: "primary" },
  { id: "sara", name: "Sara", label: "SA", color: "success", image: "/avatars/sara.png" },
  { id: "alex", name: "Alex", label: "AL", color: "warning" },
];

chat.addEventListener("send", (event) => {
  const sender = chat.participants.find((person) => person.id !== "you");
  if (!sender) return;

  chat.appendMessage({
    senderId: sender.id,
    text: "Got it — I'll follow up after standup.",
  });
});
```

Each participant gets a distinct bubble color automatically. Messages from `current-user-id` align to the right; everyone else aligns left with optional avatars and sender labels in group chats.

## Message Bubble

Use `<loomi-chat-message>` directly when building a custom transcript:

```html
<loomi-chat-message
  text="Can we ship this today?"
  sender="Sara"
  sender-id="sara"
  bubble-color="success"
  show-avatar
  show-sender
></loomi-chat-message>

<loomi-chat-message
  text="Yes — I'll push the release branch now."
  sender="You"
  sender-id="you"
  bubble-color="primary"
  outgoing
  show-avatar
></loomi-chat-message>
```

Bubbles include a directional tail and a visible tinted background per participant color.

## Typing and Loading State

Set `typing` to show the default three-dot typing indicator. If you want a branded
loading row instead, combine `busy` with `loading-icon`, `loading-text`, or both; the
custom content gets a subtle shimmer treatment while the composer is disabled.

```html
<loomi-chat-window
  current-user-id="you"
  typing
></loomi-chat-window>

<loomi-chat-window
  current-user-id="you"
  busy
  loading-icon="sparkles"
  loading-text="Drafting a reply"
></loomi-chat-window>
```

## Conversation List

Set `show-conversations` and assign `conversations` to render an inbox-style list pane
on the left of the transcript. Each conversation carries `id`, `name`, and optional
`preview`, `time`, `unread`, `image`, `label`, and `color`. Clicking a row sets
`active-conversation-id` and fires `conversation-select` — swap in that conversation's
`messages` (and header `title`/`description`) from your handler.

```html
<loomi-chat-window show-conversations active-conversation-id="akosua"></loomi-chat-window>

<script type="module">
  const chat = document.querySelector("loomi-chat-window");
  chat.conversations = [
    { id: "akosua", name: "Akosua Boateng", preview: "Can you share the wireframes?", time: "10:24 AM", unread: 2, image: "/avatars/akosua.jpg" },
    { id: "kofi", name: "Kofi Asare", preview: "API integration is complete.", time: "9:15 AM", unread: 1 },
  ];
  chat.addEventListener("conversation-select", (event) => {
    chat.messages = loadTranscript(event.detail.conversation.id);
  });
</script>
```

Add `conversations-avatars-only` to collapse the pane into a slim avatar rail — names
move into tooltips and unread counts become a dot on the avatar. Use the
`conversations-header` slot for custom controls (filter chips, a compose button) above
the list; the slot hides in avatars-only mode.

## Attachments

Give any message an `attachment` (`{ name, meta?, icon? }`) to render a file card under
the bubble. A message with an attachment and no `text` renders just the card.

```js
chat.appendMessage({
  senderId: "you",
  text: "Updated wireframes attached.",
  attachment: { name: "dashboard_wireframes_v2.fig", meta: "Figma File - 4.6 MB", icon: "document" },
});
```

## Header Actions

Use the `header-actions` slot to add controls (call buttons, info toggles) to the chat
header, between the title block and the reset button.

## Accessibility

loomi-chat-window is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- The composer keeps native textarea keyboard behavior and disables itself during `busy`.

## Responsive behavior

loomi-chat-window is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.

- Message bubbles cap their width so long messages remain readable on narrow screens.

## Dark mode

loomi-chat-window uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.


## Attributes

### `<loomi-chat-window>`

| Attribute | Default | Description |
| --- | --- | --- |
| `title` | `New Chat` | Header title. |
| `description` | `How can I help you today?` | Header subtitle. |
| `current-user-id` | `you` | Outgoing messages use this sender id. |
| `participants` | `[]` | Group roster with `id`, `name`, optional `image`, `label`, `color`. |
| `empty-title` | `Morning!` | Empty-state heading. |
| `empty-description` | … | Empty-state body copy. |
| `input-placeholder` | `Message…` | Composer placeholder. |
| `input-rows` | `1` | Initial composer height in rows. |
| `input-max-rows` | `5` | Maximum composer growth in rows. |
| `window-height` | `35rem` | Card height. |
| `auto-scroll` | `true` | Follow new messages while pinned to the bottom. |
| `show-avatars` | `false` | Show avatars beside transcript messages. Auto-enabled when there are more than two participants. |
| `show-header-avatars` | `true` | Show stacked participant avatars in the header. |
| `busy` | `false` | Disables composer and marks transcript busy. |
| `typing` | `false` | Shows a three-dot typing indicator, or the custom loading row when loading content is provided. |
| `loading-icon` | `""` | Icon name to show in the typing/loading row. |
| `loading-text` | `""` | Text to show in the typing/loading row. |
| `read-only` | `false` | Disables the composer. |
| `show-reset` | `true` | Shows the reset button. |
| `show-conversations` | `false` | Render the conversation list pane. |
| `conversations` | `[]` | Conversation rows with `id`, `name`, optional `preview`, `time`, `unread`, `image`, `label`, `color`. |
| `active-conversation-id` | `""` | Highlights the active conversation row. |
| `conversations-avatars-only` | `false` | Collapse the conversation pane to an avatar rail. |

### `<loomi-chat-message>`

| Attribute | Default | Description |
| --- | --- | --- |
| `text` | `""` | Message body. |
| `sender` | `""` | Display name shown above the bubble. |
| `time` | `""` | Optional message time label shown beneath the bubble text. |
| `sender-id` | `""` | Used to pick a fallback bubble color. |
| `bubble-color` | auto | Any loomi palette color (`primary`, `success`, `warning`, …). |
| `image` | `""` | Avatar image URL. |
| `avatar-label` | initials | Avatar fallback label. |
| `outgoing` | `false` | Right-align the bubble with a trailing tail. |
| `show-avatar` | `false` | Render an avatar beside the bubble. |
| `show-sender` | `false` | Render the sender name above the bubble. |
| `attachment` | — | File card under the bubble: `{ name, meta?, icon? }`. Property or JSON attribute. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `send` | `{ message }` | Current user submitted the composer. |
| `reset` | — | Transcript cleared. |
| `conversation-select` | `{ conversation }` | A conversation row was clicked. |

## Methods

| Method | Description |
| --- | --- |
| `appendMessage(message)` | Push a message onto the transcript. |
| `updateMessageText(id, text)` | Replace message text while streaming. |
| `reset()` | Clear messages and composer. |
| `scrollToBottom()` | Jump to the latest message. |

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-chat-window>` and `<loomi-chat-message>` are standard custom elements, so the browser can use them in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/chat` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/chat lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/chat build
pnpm --filter @loomidev/chat typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="Plain HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/chat"></script>

<loomi-chat-window
  id="team-chat"
  current-user-id="you"
  show-avatars
  input-max-rows="5"
></loomi-chat-window>
<script type="module">
  const chat = document.getElementById("team-chat");
  chat.participants = [
    { id: "you", name: "You", label: "YO", color: "primary" },
    { id: "sara", name: "Sara", label: "SA", color: "success" },
  ];
  chat.addEventListener("send", (event) => {
    chat.appendMessage({
      senderId: "sara",
      text: `Reply to: ${event.detail.message.text}`,
    });
  });
</script>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/chat";
```


`<loomi-chat-window>` accepts `participants` and `messages` as JavaScript properties. Use HTML attributes only for simple strings; use a property when you pass arrays, objects, or functions.

```js
const chat = document.querySelector("loomi-chat-window");
chat.participants = [
  { id: "you", name: "You", label: "YO", color: "primary" },
  { id: "alex", name: "Alex", label: "AL", color: "warning" },
];
chat.addEventListener("send", (event) => {
  console.log(event.detail.message);
});
```

</loomi-tab>
<loomi-tab label="Laravel Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/chat lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/chat";
```

```blade
<loomi-chat-window id="team-chat" current-user-id="you" show-avatars></loomi-chat-window>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import { useEffect, useRef } from "react";
import "@loomidev/chat";

export function LoomiExample() {
  const chat = useRef(null);

  useEffect(() => {
    chat.current.participants = [
      { id: "you", name: "You", label: "YO", color: "primary" },
      { id: "sara", name: "Sara", label: "SA", color: "success" },
    ];
    chat.current.addEventListener("send", (event) => {
      chat.current.appendMessage({
        senderId: "sara",
        text: `Reply to: ${event.detail.message.text}`,
      });
    });
  }, []);

  return (
    <loomi-chat-window ref={chat} current-user-id="you" show-avatars></loomi-chat-window>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import { ref } from "vue";
import "@loomidev/chat";

const participants = ref([
  { id: "you", name: "You", label: "YO", color: "primary" },
  { id: "sara", name: "Sara", label: "SA", color: "success" },
]);
</script>

<template>
  <loomi-chat-window
    :participants="participants"
    current-user-id="you"
    show-avatars
  ></loomi-chat-window>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild } from "@angular/core";
import "@loomidev/chat";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-chat-window #chat current-user-id="you" show-avatars></loomi-chat-window>
  `,
})
export class AppComponent implements AfterViewInit {
  @ViewChild("chat") chat!: ElementRef<any>;

  ngAfterViewInit() {
    this.chat.nativeElement.participants = [
      { id: "you", name: "You", label: "YO", color: "primary" },
      { id: "sara", name: "Sara", label: "SA", color: "success" },
    ];
  }
}
```

</loomi-tab>
<loomi-tab label="Svelte and Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/chat";

  const participants = [
    { id: "you", name: "You", label: "YO", color: "primary" },
    { id: "sara", name: "Sara", label: "SA", color: "success" },
  ];
</script>

<loomi-chat-window {participants} current-user-id="you" show-avatars></loomi-chat-window>
```

```astro
---
import "@loomidev/chat";

const participants = [
  { id: "you", name: "You", label: "YO", color: "primary" },
  { id: "sara", name: "Sara", label: "SA", color: "success" },
];
---

<loomi-chat-window participants={participants} current-user-id="you" show-avatars client:load />
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/avatar`
- `@loomidev/button`
- `@loomidev/core`
- `@loomidev/dropmenu`
- `@loomidev/icon`
- `@loomidev/spinner`
- `@loomidev/tooltip`
