# @loomi/pagination

`<loomi-pagination>` — page controls driven by `total`, `page-size` and `page`. The
component this very docs site uses to render its own [`<loomi-table>`](../table)
pagination — and the [bottom prev/next nav](../card) you see at the foot of every page
on this site is built from [`<loomi-card>`](../card), not this component, in case you're
looking for that pattern instead.

```bash
npm install @loomi/pagination lit
```

```js
import "@loomi/pagination/loomi-pagination.js";
```

## Basic Usage

```html
<loomi-pagination total="240" page-size="25"></loomi-pagination>
```

## Pagination Styles

Three visual styles are available — arrows (default), numbered pages, or a page-jump
dropdown.

```html
<loomi-pagination total="240" page-size="25" pagination-style="arrows"></loomi-pagination>
<loomi-pagination total="240" page-size="25" pagination-style="numbers"></loomi-pagination>
<loomi-pagination total="240" page-size="25" pagination-style="dropdown"></loomi-pagination>
```

## Starting on a Specific Page

```html
<loomi-pagination total="240" page-size="25" page="3"></loomi-pagination>
```

## The Total Label

By default a "Showing X to Y of Z" label appears alongside the controls. Customize the
wording with `total-label` (`:a`/`:b`/`:c` are replaced with the start, end, and total),
or hide it entirely.

```html
<loomi-pagination total="240" page-size="25" total-label="Showing :a–:b of :c results"></loomi-pagination>
<loomi-pagination total="240" page-size="25" show-total="false"></loomi-pagination>
```

## Color

`color` sets the active-page color in the `numbers` style.

```html
<loomi-pagination total="240" page-size="25" pagination-style="numbers" color="violet"></loomi-pagination>
```

## Reacting to Page Changes

```html
<loomi-pagination id="p" total="240" page-size="25"></loomi-pagination>

<script type="module">
  document.getElementById("p").addEventListener("page-change", (e) => {
    console.log(e.detail.page); // the new current page
    loadPage(e.detail.page);
  });
</script>
```

Read the total number of pages at any time via the `pageCount` property.

```js
document.getElementById("p").pageCount; // 10, for total=240 page-size=25
```

## Driving a Table

[`<loomi-table>`](../table) renders `<loomi-pagination>` internally when `paginated` is
set — see its README for the full composition. Use `<loomi-pagination>` directly when
you're paginating something other than a `<loomi-table>` (a custom list, a gallery, API
results you render yourself).

```html
<div id="results"></div>
<loomi-pagination id="results-pager" total="0" page-size="20"></loomi-pagination>

<script type="module">
  const pager = document.getElementById("results-pager");
  async function loadPage(page) {
    const { items, total } = await fetchResults(page, 20);
    pager.total = total;
    renderResults(items);
  }
  pager.addEventListener("page-change", (e) => loadPage(e.detail.page));
  loadPage(1);
</script>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `total` | `0` | Total number of items. |
| `page-size` | `10` | Items per page. |
| `page` | `1` | Current page (1-based). |
| `pagination-style` | `arrows` | `arrows` \| `numbers` \| `dropdown` |
| `show-total` | `true` | Show the "Showing :a to :b of :c" label. _(boolean)_ |
| `total-label` | `Showing :a to :b of :c` | Label format (`:a` start, `:b` end, `:c` total). |
| `color` | `primary` | Active-page color. |

**Event:** `page-change` (`detail: { page }`). **Property:** `pageCount` (read-only).

## Full Example

```html
<loomi-pagination
  total="240"
  page-size="25"
  page="1"
  pagination-style="numbers"
  color="violet"
  total-label="Showing :a–:b of :c results"
></loomi-pagination>
```
