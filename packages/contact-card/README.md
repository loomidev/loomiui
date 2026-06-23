# @loomi/contact-card

`<loomi-contact-card>` — a ready-made card for displaying a contact, with avatar, name, position and contact rows.

```bash
npm install @loomi/contact-card lit
```

```js
import "@loomi/contact-card/loomi-contact-card.js";
```

## Usage

```html
<loomi-contact-card
  name="Michael K. Ocansey"
  position="Senior Developer"
  department="Tech"
  email="mike@loomi.dev"
  mobile="+233 123 456 789"
  birthday="01 May"></loomi-contact-card>

<loomi-contact-card name="Sara Field" image="/sara.jpg" centered></loomi-contact-card>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Contact name (initials avatar when no image). |
| `position / department` | _(blank)_ | Shown under the name. |
| `image` | _(blank)_ | Avatar image URL. |
| `email / mobile / birthday` | _(blank)_ | Contact rows with icons. |
| `centered` | false | Vertically center the layout. _(boolean)_ |
| `has-shadow / has-hover` | true / false | Card styling. _(boolean)_ |
| `url` | _(blank)_ | Navigate on click. |

**Slot:** default (extra content below the details).
