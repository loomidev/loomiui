# @loomi/rating

`<loomi-rating>` — a 0–5 rating control as stars, hearts or thumbs-up. Form-associated: submits the rating under `name`.

```bash
npm install @loomi/rating lit
```

```js
import "@loomi/rating/loomi-rating.js";
```

## Usage

```html
<loomi-rating rating="3"></loomi-rating>
<loomi-rating type="heart" color="red" rating="4" size="medium"></loomi-rating>
<loomi-rating rating="5" clickable="false"></loomi-rating>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `rating` | 0 | Current rating (0–5). |
| `type` | star | `star` \| `heart` \| `thumbsup` |
| `color` | orange | Any loomi color. |
| `size` | small | `small` \| `medium` \| `big` |
| `clickable` | true | Allow changing the rating. _(boolean)_ |

**Event:** `change` (`detail: { rating }`).
