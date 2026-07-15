# @loomidev/side-nav

`<loomi-side-nav>` is an in-container navigation rail that slides between a full
navigation, an icon-only rail, and a hidden state.

```bash
npm install @loomidev/side-nav lit
```

```js
import "@loomidev/side-nav";
```

## Basic Usage

Place it inside the layout column that should own the navigation space.

```html
<loomi-side-nav label="Workspace" collapsible>
  <loomi-side-nav-item icon="home" label="Home" href="/" active></loomi-side-nav-item>
  <loomi-side-nav-item icon="calendar" label="Calendar" href="/calendar"></loomi-side-nav-item>
  <loomi-side-nav-item icon="cog-6-tooth" label="Settings" href="/settings"></loomi-side-nav-item>
</loomi-side-nav>
```

`collapsible` is opt-in. Its top-right control smoothly collapses the navigation to an
icon-only rail and expands it again. Labels remain available to assistive technology and
as native tooltips while the rail is collapsed.

Choose a consistent icon scale with `icon-size`. Add `divided` when the navigation needs
subtle separators between its items.

```html
<loomi-side-nav label="Project" collapsible icon-size="medium" divided>
  <loomi-side-nav-item icon="home" label="Overview" href="/overview"></loomi-side-nav-item>
  <loomi-side-nav-item icon="users" label="Team" href="/team"></loomi-side-nav-item>
  <loomi-side-nav-item icon="cog-6-tooth" label="Settings" href="/settings"></loomi-side-nav-item>
</loomi-side-nav>
```

Use `collapse-mode="hidden"` only when the toggle should hide the whole navigation instead
of leaving its icons visible.

## Accessibility

loomi-side-nav uses an `<aside>` with a labelled `<nav>`. Items render as links when
`href` is present and buttons otherwise. Active links set `aria-current="page"`.

For the library-wide baseline, see [Component foundations — Accessibility](https://loomiui.com/customization/component-foundations/#accessibility).

## Responsive behavior

The component owns its width and animates it, so parent layouts can place it beside
content with flex or grid. Set `--loomi-side-nav-width` and
`--loomi-side-nav-icon-width` when the layout needs custom rails.

For the shared container and viewport rules, see [Component foundations — Responsive behavior](https://loomiui.com/customization/component-foundations/#responsive-behavior).

## Dark mode

loomi-side-nav uses Loomi semantic surface, border, text, and hover tokens, so it follows
the active theme.

For theme activation, token overrides, and contrast guidance, see [Component foundations — Dark mode](https://loomiui.com/customization/component-foundations/#dark-mode).

## Attributes

### `<loomi-side-nav>`

| Attribute       | Default      | Description                                                |
| --------------- | ------------ | ---------------------------------------------------------- |
| `state`         | `expanded`   | `expanded`, `icons`, or `hidden`.                          |
| `collapse-mode` | `icons`      | Toggle target when expanded: `icons` or `hidden`.          |
| `label`         | `Navigation` | Accessible label and visible header text.                  |
| `collapsible`   | `false`      | Shows the top-right control that collapses the navigation. |
| `icon-size`     | `regular`    | Item icon size: `small`, `regular`, `medium`, or `large`.  |
| `divided`       | `false`      | Adds a subtle divider between navigation items.            |

### `<loomi-side-nav-item>`

| Attribute | Default   | Description                                                   |
| --------- | --------- | ------------------------------------------------------------- |
| `href`    | _(blank)_ | Renders the item as a link. Without it, the item is a button. |
| `icon`    | _(blank)_ | Built-in Loomi icon name.                                     |
| `label`   | _(blank)_ | Item text. Also used as fallback slot content.                |
| `active`  | `false`   | Marks the item as the current page.                           |

## Methods

| Method        | Description                                      |
| ------------- | ------------------------------------------------ |
| `expand()`    | Shows the full navigation.                       |
| `collapse()`  | Moves to the configured `collapse-mode`.         |
| `hideNav()`   | Hides the navigation completely.                 |
| `showIcons()` | Shows the icon-only rail.                        |
| `toggle()`    | Switches between `expanded` and `collapse-mode`. |

## Dependencies

- `@loomidev/core`
- `@loomidev/icons`
