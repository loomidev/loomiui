# @loomi/pagination

`<loomi-pagination>` — page controls driven by `total`, `page-size` and `page`. Emits `page-change`.

```bash
npm install @loomi/pagination lit
```

```js
import "@loomi/pagination/loomi-pagination.js";
```

## Usage

```html
<loomi-pagination total="240" page-size="25" pagination-style="numbers"></loomi-pagination>

<script type="module">
  document.querySelector("loomi-pagination")
    .addEventListener("page-change", (e) => console.log(e.detail.page));
</script>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `total` | 0 | Total number of items. |
| `page-size` | 10 | Items per page. |
| `page` | 1 | Current page (1-based). |
| `pagination-style` | arrows | `arrows` \| `numbers` \| `dropdown` |
| `show-total` | true | Show the "Showing :a to :b of :c" label. _(boolean)_ |
| `total-label` | Showing :a to :b of :c | Label format (`:a` start, `:b` end, `:c` total). |
| `color` | primary | Active-page color. |

**Event:** `page-change` (`detail: { page }`). **Property:** `pageCount` (read-only).
