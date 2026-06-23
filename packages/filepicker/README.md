# @loomi/filepicker

`<loomi-filepicker>` — a drag-and-drop file picker with previews. Keeps a real `<input type="file">` in sync, so it submits inside a `<form>` with `enctype="multipart/form-data"`. A lightweight, dependency-free take on BladewindUI's Filepond wrapper.

```bash
npm install @loomi/filepicker lit
```

```js
import "@loomi/filepicker/loomi-filepicker.js";
```

## Usage

```html
<loomi-filepicker name="docs" max-files="3" max-file-size="2mb"
  accepted-file-types="image/*,.pdf"
  placeholder-line1="Drag & drop or click to upload"></loomi-filepicker>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | File input name (becomes `name[]` when `max-files > 1`). |
| `accepted-file-types` | image/*,application/pdf | Comma-separated MIME types / extensions. |
| `max-files` | 1 | Maximum number of files. |
| `max-file-size` | 5mb | Max size per file (`kb` / `mb` / `gb`). |
| `placeholder-line1 / placeholder-line2` | … | Drop-zone text (`%s` → types, then max size). |
| `can-browse / can-drop` | true | Allow click-to-browse / drag-and-drop. _(boolean)_ |
| `show-image-preview` | true | Thumbnail previews for images. _(boolean)_ |
| `disabled / required` | false | Disable / mark required. _(boolean)_ |

**Property:** `selectedFiles`. **Event:** `change` (`detail: { files }`).

> Not ported from BladewindUI's Filepond wrapper: built-in image cropping/resizing and auto-upload-to-route. Use the `change` event with your own upload logic, or submit the form for manual upload.
