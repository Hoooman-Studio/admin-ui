# Changelog

## Unreleased

### New

- `FormDialog` and `FormDrawer` can take `open` and `onOpenChange` instead of a `trigger`, to open them from your own state, like the URL.
- `ChecklistField`, `CheckboxGroup` and `RadioGroup` with more than 8 options flow into as many columns as fit.

## 0.3.0

### Breaking: upgrade steps

1. Wrap the admin layout route, login page included, in `<AdminProvider accent="…">`. Move `accent` there from `AdminShell`.
2. Replace `AdminScope` with `AdminProvider`. It takes `className` to place it on a site page.
3. Remove any `<Toaster />` and `<ConfirmDialog />` you mounted: `AdminProvider` mounts them, and they are no longer exported. Toasts now show at the top centre.

`AdminShell` is now layout only and throws outside an `AdminProvider`.

### New

- `RowMenu`: the "…" menu for `ListRow` / `SortableListRow` `actions`, the same as DataTable's.
- `FilePreview`: a tile for an image, video, audio or other file, with uploading and error states.
- `Progress`: a progress bar.
- `ListRow` `wrap`: shows a long title and subtitle in full.
- Form (`/form`):
  - `bindField` and `FieldProps` for writing your own fields.
  - `FileField`: uploads through your `upload(file, onProgress)` and holds the returned ID.
  - `ChecklistField` for `string[]` fields.
  - `FormDrawer`: `FormDialog` in a drawer.
  - `SelectField` `emptyLabel` for a "None" choice on a nullable field.

### Fixed

- NavItem, PageToolbar, and cards in drawer and dialog bodies no longer get squashed when the page scrolls.
- On phones, `ListRow` meta and actions move under the title, and `PageHeader`'s description wraps.
- Toasts no longer cover drawer footer buttons.
- Forms show every error on every submit, field checks and the form schema together.
- A failed upload blocks saving until you retry or remove it.
- Outline button hover and the DateField focus ring.

## 0.2.0

- `SortableList` and `SortableListRow`: reorder short lists by dragging a grip or with the keyboard.

## 0.1.0

- First release.
