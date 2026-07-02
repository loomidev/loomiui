# @loomidev/chat

`<loomi-chat-window>` and message scroller primitives inspired by shadcn/ui's
[Message Scroller](https://ui.shadcn.com/docs/components/radix/message-scroller).

```bash
npm install @loomidev/chat lit
```

```js
import "@loomidev/chat";
```


## Accessibility
- Implements ARIA roles/states for custom interaction surfaces.
- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior
- Includes layout breakpoints for narrow viewports (see component CSS).

## Dark mode
- Uses semantic `--loomi-surface`, `--loomi-surface-border`, and `--loomi-text` tokens where applicable.
- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.
## Chat Window

The quickest way to get a shadcn-style chat card is `<loomi-chat-window>`:

```html
<loomi-chat-window
  title="New Chat"
  description="How can I help you today?"
  auto-scroll
></loomi-chat-window>
```

```js
const chat = document.querySelector("loomi-chat-window");

chat.addEventListener("send", (event) => {
  const userMessage = event.detail.message;

  const assistant = chat.appendMessage({
    role: "assistant",
    text: "I'll keep the viewport pinned while you stay at the bottom.",
  });

  // Update in place while streaming:
  chat.updateMessageText(assistant.id, "Done. Scroll up and the jump button appears.");
});
```

## Message Scroller Composition

For full control, compose the scroller primitives directly:

```html
<loomi-chat-scroller auto-scroll scroll-previous-item-peek="64" style="height: 24rem">
  <loomi-chat-viewport>
    <loomi-chat-content>
      <loomi-chat-item message-id="turn-1" scroll-anchor>
        <loomi-chat-message message-role="user" text="Anchor my turn near the top"></loomi-chat-message>
      </loomi-chat-item>
      <loomi-chat-item message-id="turn-2">
        <loomi-chat-message message-role="assistant" text="Replies stream below the anchor."></loomi-chat-message>
      </loomi-chat-item>
    </loomi-chat-content>
  </loomi-chat-viewport>
  <loomi-chat-scroll-button direction="end"></loomi-chat-scroll-button>
</loomi-chat-scroller>
```

### Scroll behavior

- `auto-scroll` follows new content only while the reader is already at the bottom.
- `scroll-anchor` on `<loomi-chat-item>` anchors a new turn near the top and keeps a
  peek of the previous row visible (`scroll-previous-item-peek`, default `64`).
- `<loomi-chat-scroll-button>` jumps back to the latest message when the reader scrolls up.

## Attributes

### `<loomi-chat-window>`

| Attribute | Default | Description |
| --- | --- | --- |
| `title` | `New Chat` | Card heading. |
| `description` | `How can I help you today?` | Card subheading. |
| `empty-title` | `Morning!` | Empty-state heading. |
| `empty-description` | … | Empty-state body copy. |
| `input-placeholder` | `Message…` | Composer placeholder. |
| `footer-note` | `""` | Optional note under the card. |
| `window-height` | `35rem` | Card height (`--loomi-chat-window-height`). |
| `auto-scroll` | `true` | Pin to bottom while the reader is at the live edge. |
| `busy` | `false` | Shows a spinner and sets `aria-busy` on the transcript. |
| `read-only` | `false` | Disables the composer. |
| `show-reset` | `true` | Shows the reset button in the header. |

### `<loomi-chat-scroller>`

| Attribute | Default | Description |
| --- | --- | --- |
| `auto-scroll` | `false` | Follow streamed output at the bottom edge. |
| `default-scroll-position` | `end` | `start` \| `end` \| `last-anchor` |
| `scroll-previous-item-peek` | `64` | Pixels of previous row kept visible when anchoring. |
| `scroll-margin` | `0` | Extra offset for scroll commands. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `send` | `{ message }` | User submitted the composer. |
| `reset` | — | Transcript cleared via reset. |

## Methods

| Method | Description |
| --- | --- |
| `appendMessage(message)` | Push a message onto the transcript. |
| `updateMessageText(id, text)` | Replace message text (streaming). |
| `reset()` | Clear messages and composer. |
| `scrollToEnd()` / `scrollToStart()` / `scrollToMessage(id)` | Imperative scroll controls on `<loomi-chat-scroller>`. |

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-chat-window>` is a standard custom element. Install the package, import it once before the tag is rendered, then compose it in your template.

### Where to run commands

Run install commands from the app where you want to use this component — the folder that contains that app's `package.json`.

```bash
cd /path/to/your-app
npm install @loomidev/chat lit
```

If you are contributing to LoomiUI itself:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/chat build
pnpm --filter @loomidev/chat typecheck
```

### Bundlers and single-page apps

```js
import "@loomidev/chat";
```

<!-- END loomi-framework-guide -->
