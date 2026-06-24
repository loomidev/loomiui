# @loomi/contact-card

`<loomi-contact-card>` — a ready-made card for displaying a contact, with avatar, name,
position and contact rows. Saves you from manually building this layout out of
[`<loomi-card>`](../card) and [`<loomi-avatar>`](../avatar) every time.

```bash
npm install @loomi/contact-card lit
```

```js
import "@loomi/contact-card/loomi-contact-card.js";
```

## Basic Usage

A default avatar placeholder is used when `image` isn't set.

```html
<loomi-contact-card
  name="Michael K. Ocansey"
  position="Senior Developer"
  department="Tech"
  email="mike@loomiui.dev"
  mobile="+233 123 456 789"
  birthday="01 May"
></loomi-contact-card>
```

## Custom Image

```html
<loomi-contact-card name="Sara Field" image="/sara.jpg" position="Designer"></loomi-contact-card>
```

When no `image` is set, initials are derived from `name` and shown as a label avatar
instead — same fallback behavior as [`<loomi-avatar>`](../avatar).

## Centered Layout

`centered` reflows the card to stack the avatar above the details, vertically centered
— handy in a grid of team members.

```html
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem">
  <loomi-contact-card name="Michael K. Ocansey" position="Senior Developer" centered></loomi-contact-card>
  <loomi-contact-card name="Sara Field" image="/sara.jpg" position="Designer" centered></loomi-contact-card>
  <loomi-contact-card name="Ada Boateng" position="Product" centered></loomi-contact-card>
</div>
```

## Clickable Contact Cards

Same `url` semantics as [`<loomi-card>`](../card) — a path, full URL, or JS function
call.

```html
<loomi-contact-card name="Michael K. Ocansey" position="Senior Developer" has-hover url="/team/mike"></loomi-contact-card>
```

## Extra Content

The default slot renders below the contact details — useful for tags, a short bio, or
action buttons.

```html
<loomi-contact-card name="Michael K. Ocansey" position="Senior Developer">
  <loomi-tag label="On leave" color="orange"></loomi-tag>
</loomi-contact-card>
```

## Card Styling

`has-shadow` and `has-hover` work exactly like on [`<loomi-card>`](../card).

```html
<loomi-contact-card name="Michael K. Ocansey" has-shadow="false"></loomi-contact-card>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Contact name (initials avatar when no image). |
| `position` / `department` | _(blank)_ | Shown under the name. |
| `image` | _(blank)_ | Avatar image URL. |
| `email` / `mobile` / `birthday` | _(blank)_ | Contact rows with icons. |
| `centered` | `false` | Vertically center the layout. _(boolean)_ |
| `has-shadow` / `has-hover` | `true` / `false` | Card styling. _(boolean)_ |
| `url` | _(blank)_ | Navigate on click. |

**Slot:** default (extra content below the details).

## Full Example

```html
<loomi-contact-card
  name="Michael K. Ocansey"
  position="Senior Copywriter"
  department="Tech"
  email="mike@loomiui.dev"
  mobile="+233.123.456.789"
  birthday="01-May"
  has-hover
  centered
  url="/team/mike"
>
  <loomi-tag label="Available" color="green"></loomi-tag>
</loomi-contact-card>
```
