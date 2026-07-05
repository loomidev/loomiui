# @loomidev/bottom-nav

`<loomi-bottom-nav>` and `<loomi-bottom-nav-item>` — a mobile bottom navigation bar with
icons, labels, badges, eight active-state styles, and a routing-agnostic click event so
any router (or plain `<a>` links) can drive it.

```bash
npm install @loomidev/bottom-nav lit
```

```js
import "@loomidev/bottom-nav";
```

```html
<loomi-bottom-nav active="home" active-style="pill">
  <loomi-bottom-nav-item name="home" icon="home" href="/home">Home</loomi-bottom-nav-item>
  <loomi-bottom-nav-item name="orders" icon="archive-box" href="/orders">Orders</loomi-bottom-nav-item>
  <loomi-bottom-nav-item name="profile" icon="user" href="/profile">Profile</loomi-bottom-nav-item>
</loomi-bottom-nav>
```

## Accessibility

`<loomi-bottom-nav>` renders a real `<nav>` landmark (`label` sets its `aria-label`,
default `"Primary"`). Each item renders a real `<a>` (when `href` is set) or `<button>` —
never a clickable `<div>` — so screen readers and keyboard users get native semantics for
free. The active item gets `aria-current="page"`.

- `Tab` / `Shift+Tab` reach every item in document order, like any row of links/buttons.
- `←`/`→` (or `↑`/`↓`) move focus between items without navigating — manual activation,
  per the WAI-ARIA APG toolbar pattern, so arrowing through never triggers a page navigation
  by accident. `Home`/`End` jump to the first/last enabled item. `Enter`/`Space` (or a
  click) activate the focused item natively.
- Disabled items (`disabled`) are skipped by arrow-key roving focus and excluded from the
  tab order (`tabindex="-1"` for links, native `disabled` for buttons).
- Focus is visible via `:focus-visible`, ringed with the component's accent color.

## Responsive behavior

Designed for mobile: `<loomi-bottom-nav>` docks itself with `position: fixed` at the
viewport bottom (or floats, see `variant` below) so you don't need any wrapping layout.
Set `mobile-only` to hide it automatically at tablet width and up (768px), the common
pattern where a sidebar or top nav takes over on larger screens. Items share the available
width equally (`flex: 1`) and truncate long labels rather than wrapping — designed for
3–5 items.

## Dark mode

Uses semantic `--loomi-surface` / `--loomi-surface-border` / `--loomi-text-muted` tokens
for the bar background, divider, and inactive icon/label color, so it flips automatically
with `.dark` on `<html>` (via `@loomidev/theme-switcher` or your own theme toggle). The
active-state tokens (see **Styling hooks** below) default to the instance's `color`
accent, which is also dark-mode aware.

## Safe areas

The bar's own bottom padding (or, in `floating` mode, its distance from the viewport edge)
accounts for `env(safe-area-inset-bottom)`, so it clears the home indicator on notched
phones automatically — no extra configuration needed.

## Flexible navigation

Each item decides how it navigates from the attributes you give it:

- **`href` set** → renders a real `<a>`. Native/SPA-router links, Laravel routes, anchors —
  all just work, including `target="_blank"` (always preserved — never intercepted).
- **`href` omitted** → renders a `<button>`. Use this when a JS router owns navigation
  entirely; the item still needs a `value` (or `name`) to identify itself.
- **Either way**, clicking always fires `loomi-change` on the parent, so a client-side
  router can take over. Add `prevent-default` to always suppress the real anchor
  navigation (letting your router fully own it), or call `event.preventDefault()` inside
  your own `loomi-change` listener to suppress it dynamically, per click.

```js
document.querySelector("loomi-bottom-nav").addEventListener("loomi-change", (event) => {
  const { item, value } = event.detail;
  router.push(`/app/${value}`);
});
```

```html
<loomi-bottom-nav-item value="orders" href="/orders" prevent-default>Orders</loomi-bottom-nav-item>
```

`active` on the parent is the controlled identifier — set it from your router (e.g. on
every route change) and the matching item recomputes its active state. Clicking an
(enabled) item also updates `active` locally first, for immediate visual feedback, before
`loomi-change` reaches your listener.

## Active styles

`active-style` on `<loomi-bottom-nav>` picks the active item's visual treatment:
`pill` (default) · `underline` · `top-line` · `background` · `icon-only` · `dot` ·
`border` · `minimal`.

```html
<loomi-bottom-nav active="cart" active-style="dot">
  <loomi-bottom-nav-item name="home" icon="home">Home</loomi-bottom-nav-item>
  <loomi-bottom-nav-item name="cart" icon="shopping-cart" badge="3">Cart</loomi-bottom-nav-item>
  <loomi-bottom-nav-item name="account" icon="user">Account</loomi-bottom-nav-item>
</loomi-bottom-nav>
```

- `pill` / `background` / `border` fill or outline the whole link surface.
- `icon-only` recolors just the icon, leaving the label its normal muted color.
- `minimal` recolors both icon and label with no background/border/line.
- `underline` / `top-line` / `dot` add a small accent marker at the link's bottom/top edge
  or below the icon, in addition to recoloring icon + label.

## Badges

Set `badge` on any item for a small count/label pill anchored to its icon:

```html
<loomi-bottom-nav-item name="cart" icon="shopping-cart" badge="3">Cart</loomi-bottom-nav-item>
```

## Variant: floating

```html
<loomi-bottom-nav active="cart" variant="floating" active-style="pill">
  <loomi-bottom-nav-item name="home" icon="home">Home</loomi-bottom-nav-item>
  <loomi-bottom-nav-item name="cart" icon="shopping-cart" badge="3">Cart</loomi-bottom-nav-item>
  <loomi-bottom-nav-item name="account" icon="user">Account</loomi-bottom-nav-item>
</loomi-bottom-nav>
```

`variant="floating"` detaches the bar from the viewport edge into a rounded, elevated,
inset island instead of an edge-to-edge dock.

## Icons

Icons render through `<loomi-icon>`. Set `icon-source` on the parent to change the icon
set for every item at once, or on an individual `<loomi-bottom-nav-item>` to override just
that one:

```html
<loomi-bottom-nav icon-source="iconsax" active="home">
  <loomi-bottom-nav-item name="home" icon="home-2">Home</loomi-bottom-nav-item>
  <loomi-bottom-nav-item name="star" icon="star" icon-source="heroicons">Star</loomi-bottom-nav-item>
</loomi-bottom-nav>
```

## Colors and disabled state

```html
<loomi-bottom-nav color="success" active="home">
  <loomi-bottom-nav-item name="home" icon="home">Home</loomi-bottom-nav-item>
  <loomi-bottom-nav-item name="orders" icon="archive-box" disabled>Orders</loomi-bottom-nav-item>
</loomi-bottom-nav>
```

## Attributes — `<loomi-bottom-nav>`

| Attribute | Default | Description |
| --- | --- | --- |
| `active` | _(blank)_ | The active item's `value`/`name`. Controlled — set it from your router. |
| `active-style` | `pill` | `pill` \| `underline` \| `top-line` \| `background` \| `icon-only` \| `dot` \| `border` \| `minimal`. |
| `variant` | `fixed` | `fixed` (edge-to-edge dock) \| `floating` (rounded, elevated island). |
| `color` | `primary` | Accent for the active item's color/background/border/dot. Any loomi color. |
| `icon-source` | `heroicons` | Default icon set for every item — see `<loomi-icon>`'s `source`. |
| `label` | `Primary` | `aria-label` for the `<nav>` landmark. |
| `mobile-only` | `false` | Hides the bar at 768px and up. _(boolean)_ |

## Attributes — `<loomi-bottom-nav-item>`

| Attribute | Default | Description |
| --- | --- | --- |
| `label` | _(blank)_ | Label text. Falls back to slotted text if empty. |
| `icon` | _(blank)_ | Built-in icon name. |
| `icon-source` | _(blank)_ | Per-item icon set override. Empty = inherit from the parent. |
| `badge` | _(blank)_ | Count/label shown as a small pill on the icon. Empty = no badge. |
| `disabled` | `false` | Blocks navigation, clicks, and arrow-key focus. _(boolean)_ |
| `value` | _(blank)_ | Identifier matched against the parent's `active`. Falls back to `name`, then slot text. |
| `href` | _(blank)_ | Renders a real `<a>` instead of a `<button>`. |
| `target` | _(blank)_ | Anchor `target`. `_blank` always keeps native new-tab behavior. |
| `rel` | _(blank)_ | Anchor `rel`. Defaults to `noopener noreferrer` when `target="_blank"`. |
| `prevent-default` | `false` | Always suppress real navigation, even with `href` set. _(boolean)_ |
| `active` | `false` | Normally set by the parent. Set directly only when using this element standalone. _(boolean)_ |

## Parts

| Part | Element |
| --- | --- |
| `nav` | The `<loomi-bottom-nav>`'s internal `<nav>`. |
| `link` | The item's underlying `<a>`/`<button>`. |
| `icon` | The item's `<loomi-icon>`. |
| `label` | The item's label wrapper. |
| `badge` | The badge pill (only rendered when `badge` is set). |
| `active-indicator` | The underline/top-line/dot marker (only visible for those `active-style`s). |

```css
loomi-bottom-nav-item::part(link) { }
loomi-bottom-nav-item::part(icon) { }
loomi-bottom-nav-item::part(label) { }
loomi-bottom-nav-item::part(badge) { }
loomi-bottom-nav-item::part(active-indicator) { }
```

## Styling hooks

| Variable | Default |
| --- | --- |
| `--loomi-bottom-nav-active-bg` | the `color` accent's soft tint |
| `--loomi-bottom-nav-active-color` | the `color` accent's foreground shade |
| `--loomi-bottom-nav-active-border` | the `color` accent |
| `--loomi-bottom-nav-active-radius` | `999px` |
| `--loomi-bottom-nav-active-dot-size` | `6px` |
| `--loomi-bottom-nav-badge-bg` | `var(--loomi-error-600)` |
| `--loomi-bottom-nav-badge-color` | `var(--loomi-white)` |

```css
loomi-bottom-nav {
  --loomi-bottom-nav-active-bg: var(--loomi-primary-100);
  --loomi-bottom-nav-active-color: var(--loomi-primary-700);
  --loomi-bottom-nav-active-border: var(--loomi-primary-600);
  --loomi-bottom-nav-active-radius: 999px;
  --loomi-bottom-nav-active-dot-size: 6px;
}
```

## Events

| Event | Detail |
| --- | --- |
| `loomi-change` | `{ item, value, name, href }`. Fired by the clicked item, bubbles through the parent. Cancelable — `event.preventDefault()` suppresses real anchor navigation for that click. |

## Dependencies

- `@loomidev/core`
- `@loomidev/icon`
- `@loomidev/icons`
