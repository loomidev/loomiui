# @loomidev/profile-menu

`<loomi-profile-menu>` — a compact profile trigger with avatar, name, description,
chevron, and a dropdown menu. It composes [`<loomi-card>`](../card),
[`<loomi-avatar>`](../avatar), and [`<loomi-dropmenu>`](../dropmenu), so avatar dots,
pulsing dots, verification badges, and menu-item behavior all come from the existing
Loomi primitives.

```bash
npm install @loomidev/profile-menu lit
```

```js
import "@loomidev/profile-menu";
```

## Basic Usage

Put `<loomi-dropmenu-item>` elements inside the profile menu. Clicking the card trigger
opens the dropdown.

```html
<loomi-profile-menu
  name="Alice Wonderland"
  description="alice@loomiui.com"
  avatar="/avatars/female.jpg"
>
  <loomi-dropmenu-item icon="user-circle">Profile</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="cog-6-tooth">Settings</loomi-dropmenu-item>
  <loomi-dropmenu-item divider></loomi-dropmenu-item>
  <loomi-dropmenu-item icon="arrow-right-start-on-rectangle" variant="destructive">
    Sign out
  </loomi-dropmenu-item>
</loomi-profile-menu>
```

## Avatar State

Avatar behavior is passed to the internal `<loomi-avatar>`.

```html
<loomi-profile-menu
  name="Alice Wonderland"
  description="alice@loomiui.com"
  avatar="/avatars/female.jpg"
  dotted
  pulse-dot
  verified
  dot-color="success"
  dot-position="top"
>
  <loomi-dropmenu-item>Account</loomi-dropmenu-item>
</loomi-profile-menu>
```

If `avatar` is blank, initials are derived from `name`. Set `avatar-label` to control
the fallback text yourself.

## Avatar on the Right

By default the avatar leads the trigger. Set `avatar-position="right"` to flip it: the
name and description lead, the avatar follows, and the chevron stays at the trailing
edge — so the menu still opens aligned under the chevron.

```html
<loomi-profile-menu
  avatar-position="right"
  name="Alice Wonderland"
  description="alice@loomiui.com"
  avatar="/avatars/female.jpg"
>
  <loomi-dropmenu-item icon="user-circle">Profile</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="cog-6-tooth">Settings</loomi-dropmenu-item>
</loomi-profile-menu>
```

This variant suits right-aligned app headers, where the avatar reads better closest to
the edge of the screen. Everything else — avatar dots, verification badge, transparent
trigger, and menu behavior — works exactly the same.

## Transparent Trigger

Use `transparent` when the profile menu sits on an existing surface and should not add
its own card fill. Add `has-hover` when you want a very subtle border on hover.

```html
<loomi-profile-menu
  transparent
  has-hover
  name="Alice Wonderland"
  description="alice@loomiui.com"
  avatar-label="AW"
>
  <loomi-dropmenu-item>Profile</loomi-dropmenu-item>
</loomi-profile-menu>
```

## Menu Behavior

The menu is powered by `<loomi-dropmenu>`, so the same placement, divided rows,
scrolling, keyboard navigation, and `hide-after-click` behavior apply.

```html
<loomi-profile-menu name="Alice Wonderland" placement="right" divided>
  <loomi-dropmenu-item icon="user-circle">Profile</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="cog-6-tooth">Settings</loomi-dropmenu-item>
</loomi-profile-menu>
```

## Accessibility

loomi-profile-menu uses a real dropmenu trigger button from `<loomi-dropmenu>`, and
menu rows keep the menu roles and keyboard behavior from `<loomi-dropmenu-item>`.

- Use a clear `name` and `description`; they become the visible trigger text.
- Use `avatar-alt` when the avatar image needs a specific accessible description.
- Keep destructive actions marked with `variant="destructive"` on the menu item.

For the library-wide baseline, see [Foundations — Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

The trigger is shrink-wrapped by default, with text truncation for long names and
descriptions. It works well in headers, sidebars, app shells, and compact account
menus.

For the shared container and viewport rules, see [Foundations — Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

loomi-profile-menu uses Loomi semantic tokens such as `--loomi-surface`,
`--loomi-surface-border`, `--loomi-text`, and `--loomi-text-muted`, so the trigger and
menu inherit your app theme.

For theme activation, token overrides, and contrast guidance, see [Foundations — Dark mode](https://loomiui.com/foundations/#dark-mode).

## Attributes

| Attribute          | Default   | Description                                                                                                              |
| ------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------ |
| `name`             | _(blank)_ | Main identity text. Also used for avatar initials when `avatar-label` is blank.                                          |
| `description`      | _(blank)_ | Secondary text under the name, often an email or role.                                                                   |
| `avatar`           | _(blank)_ | Avatar image URL.                                                                                                        |
| `avatar-label`     | derived   | Initials/fallback label for the internal `<loomi-avatar>`.                                                               |
| `avatar-alt`       | derived   | Accessible alt text for the avatar image.                                                                                |
| `avatar-size`      | `regular` | Avatar size — defers to the internal `<loomi-avatar>` `size`.                                                            |
| `avatar-bg-color`  | `gray`    | Initials background color passed to `<loomi-avatar>`.                                                                    |
| `avatar-position`  | `left`    | Where the avatar sits in the trigger. `left` \| `right`. With `right`, the copy leads and the chevron stays trailing.    |
| `dotted`           | `false`   | Show avatar status dot. _(boolean)_                                                                                      |
| `pulse-dot`        | `false`   | Animate the avatar status dot. _(boolean)_                                                                               |
| `dot-color`        | `success` | Status dot color.                                                                                                        |
| `dot-position`     | `bottom`  | `top` \| `bottom`.                                                                                                       |
| `verified`         | `false`   | Show the avatar verification badge. _(boolean)_                                                                          |
| `has-hover`        | `false`   | Show a subtle border on trigger hover/focus. _(boolean)_                                                                 |
| `transparent`      | `false`   | Remove the trigger card fill. _(boolean)_                                                                                |
| `placement`        | `right`   | Dropmenu placement. `auto` \| `left` \| `right`. Defaults to `right` so the menu opens right-aligned, under the chevron. |
| `divided`          | `false`   | Add dividers between menu items. _(boolean)_                                                                             |
| `scrollable`       | `false`   | Cap menu height and scroll overflow. _(boolean)_                                                                         |
| `height`           | `200`     | Scrollable menu height in pixels.                                                                                        |
| `hide-after-click` | `true`    | Close the menu after clicking a non-toggle item. _(boolean)_                                                             |

## Slots

| Slot        | Description                          |
| ----------- | ------------------------------------ |
| _(default)_ | Content placed inside the component. |

## Dependencies

- `@loomidev/avatar`
- `@loomidev/card`
- `@loomidev/core`
- `@loomidev/dropmenu`
- `@loomidev/icons`
- `@loomidev/theme`
