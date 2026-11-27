# Changelog

## Unreleased

### New

- `confirm()` takes an `action`. The dialog stays open with the button pending while it runs; return `{ ok: false, message }` to show the message in the dialog, or `{ ok: true, message }` to close it with a toast. `confirm()` still resolves `true` or `false`.
- `FormResult`'s `ok: true` takes a `warning`, for an action that worked but had a side effect fail ("Saved, but the welcome email failed."). It shows as a warning toast that stays until dismissed, next to `message`'s success toast, from `useAdminForm`, `FormDialog`, `FormDrawer` and `confirm({ action })`.
- Toasts show their `cancel` button, like `toast("…", { cancel: { label: "Dismiss" } })`.
- `Button` and `MenuItem` take a `disabledReason`: it disables them and says why, in a tooltip on the button or under the item's label. Both stay focusable, so keyboard and screen reader users get the reason too.
- Closing a `FormDialog` or `FormDrawer` with unsaved changes or a file still uploading (Escape, the backdrop, the close button or Cancel) first asks "Discard changes?". Saving closes it without asking.
- A `Button` whose `onClick` returns or resolves to a `FormResult` shows it: `ok: false` opens an alert dialog named after the button with `message` (or a generic one), `ok: true` shows `message` and `warning` as toasts, like forms do. Handlers that return anything else work as before.
- A pending `Button` looks disabled and shows the loader in place of its content, at the same size. This includes `DialogClose` and `AlertDialogClose` rendered as a Button.
- A page that throws while rendering no longer takes down the admin: `AdminShell` shows "Something went wrong" with "Try again" in the page area, and the header and nav keep working. Going to another page tries again too. Wrap a part of a page in `ErrorBoundary` to catch its errors in place. Your router's own error page still wins when it sits closer to the page (like a Next.js `error.tsx` inside the admin's folder), and `redirect()` and `notFound()` pass through.

### Fixed

- `Loader` stays visible when the device asks for reduced motion: its dots hold still instead of fading to almost nothing.

## 0.3.1

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
