# @loomi/filepicker

`<loomi-filepicker>` — a drag-and-drop file picker with previews. Keeps a real
`<input type="file">` in sync, so it submits inside a `<form>` with
`enctype="multipart/form-data"`. A lightweight, dependency-free take on BladewindUI's
Filepond wrapper.

```bash
npm install @loomi/filepicker lit
```

```js
import "@loomi/filepicker/loomi-filepicker.js";
```

## Basic Usage

Supports both click-to-browse and drag-and-drop out of the box.

```html
<loomi-filepicker name="certs"></loomi-filepicker>
```

## Placeholder Text

The default placeholder shows "Browse or drag and drop files" with accepted file types
and max size on the second line. Customize either line — use `%s` in
`placeholder-line2` to inject the accepted types and max size dynamically.

```html
<loomi-filepicker
  placeholder-line1="Upload proof of payment"
  placeholder-line2="Only PDF files are allowed"
></loomi-filepicker>

<loomi-filepicker
  placeholder-line1="Drag and drop proof of payment here"
  placeholder-line2="Files allowed: %s up to %s"
></loomi-filepicker>
```

## Drag-and-Drop or Browse Only

```html
<!-- drag and drop only -->
<loomi-filepicker can-browse="false" placeholder-line1="Drag and drop files"></loomi-filepicker>

<!-- browse only -->
<loomi-filepicker can-drop="false" placeholder-line1="Click here to select your file"></loomi-filepicker>
```

## File Size Limits

```html
<loomi-filepicker max-file-size="15kb"></loomi-filepicker>
```

## File Type Restrictions

```html
<loomi-filepicker accepted-file-types="application/pdf,.doc,.docx"></loomi-filepicker>
```

## Multiple Files

When `max-files` is greater than `1`, the `name` is submitted as an array
(`name[]`).

```html
<loomi-filepicker name="photos" max-files="5"></loomi-filepicker>
```

## Image Previews

Thumbnails for selected images are shown by default; turn them off if you'd rather show
just file names.

```html
<loomi-filepicker max-files="3" show-image-preview="false"></loomi-filepicker>
```

## Disabled & Required

```html
<loomi-filepicker disabled></loomi-filepicker>
<loomi-filepicker required></loomi-filepicker>
```

## Reacting to a Selection

Listen for `change` to read the currently-selected files — useful for building your own
upload progress UI or client-side validation before the form is submitted.

```html
<loomi-filepicker name="docs" max-files="3"></loomi-filepicker>

<script type="module">
  document.querySelector("loomi-filepicker").addEventListener("change", (e) => {
    console.log(e.detail.files); // FileList-like array
  });
</script>
```

## Form Submission

Since the component keeps a real `<input type="file">` in sync internally, a normal
form submit with `enctype="multipart/form-data"` just works.

```html
<form method="POST" action="/upload" enctype="multipart/form-data">
  <loomi-filepicker name="attachments" max-files="3" max-file-size="2mb"></loomi-filepicker>
  <loomi-button can-submit>Upload</loomi-button>
</form>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | File input name (becomes `name[]` when `max-files > 1`). |
| `accepted-file-types` | `image/*,application/pdf` | Comma-separated MIME types / extensions. |
| `placeholder-line1` / `placeholder-line2` | … | Drop-zone text (`%s` → types, then max size). |
| `max-files` | `1` | Maximum number of files. |
| `max-file-size` | `5mb` | Max size per file (`kb` / `mb` / `gb`). |
| `can-browse` / `can-drop` | `true` | Allow click-to-browse / drag-and-drop. _(boolean)_ |
| `show-image-preview` | `true` | Thumbnail previews for images. _(boolean)_ |
| `disabled` / `required` | `false` | Disable / mark required. _(boolean)_ |

**Property:** `selectedFiles`. **Event:** `change` (`detail: { files }`).

> Not ported from BladewindUI's Filepond wrapper: built-in image cropping/resizing and
> auto-upload-to-route. Use the `change` event with your own upload logic, or submit the
> form for manual upload.

## Full Example

```html
<loomi-filepicker
  name="profile_pic"
  placeholder-line1="Choose a profile picture"
  placeholder-line2="Only jpg/png files allowed, up to %s"
  accepted-file-types=".jpg,.jpeg,.png"
  max-files="1"
  max-file-size="1mb"
  show-image-preview
  can-browse
  can-drop
></loomi-filepicker>
```
