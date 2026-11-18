# @hooman-studio/admin-ui

Building blocks for Hooman Studio client admin panels: the Hooman Studio dashboard's look on top of [UI SDK](https://ui-sdk.dev) behaviors. Bring your own data, router and auth.

It's made to live inside a client's existing website, like at `/admin`, in any React 19 app: Next.js, TanStack Start, Vite. Components are client components and render on the server without errors; all data comes from your own hooks.

## Use it

With a coding agent, point it at [setup.md](https://raw.githubusercontent.com/Hoooman-Studio/admin-ui/main/setup.md): "Set up the admin panel following this guide."

By hand:

Import the CSS in your admin route only, so the rest of the site never downloads it:

```ts
// Next.js: app/(admin)/admin/layout.tsx · TanStack Start: routes/admin.tsx · Vite: your admin entry or lazy admin route
import "@hooman-studio/admin-ui/styles.css";
```

No Tailwind needed. If your site uses Tailwind (v3 or v4), it keeps working as before, even after someone navigates from the admin back to the site with the CSS still loaded: every class we ship is prefixed (`au:flex`), every theme variable is `--au-*`, our animation names are `au-*`, and nothing styles `html`, `body` or your site's elements. (Like any Tailwind v4 build, it registers Tailwind's internal `--tw-*` properties.) Our font, reset and dark mode only apply inside the admin.

`styles.css` only has the `au:` classes our own components use, so your admin code can't count on other `au:` classes. To use any of them, build the CSS with your Tailwind v4 instead: `@import "@hooman-studio/admin-ui/tailwind.css";` in your admin CSS, with an `@source` for your admin code (see setup.md).

Put `AdminProvider` in your admin's layout route, around every admin page, login too. It gives everything inside the admin's font, theme and accent (`accent`, any CSS colour), and makes `toast()` and `confirm()` work. It's a plain block with the admin's background and text colour.

```tsx
<AdminProvider accent="hsl(20 100% 50%)">
  <Outlet />
</AdminProvider>
```

On a normal admin page, render `AdminShell` as the whole page, without your site's header and footer (it fills the viewport):

```tsx
<AdminShell
  header={
    <AdminHeader>
      <AdminHeaderAccount name={user.name} email={user.email} image={user.image}>
        <MenuItem onClick={signOut}>Sign out</MenuItem>
      </AdminHeaderAccount>
      <AdminHeaderTitle>Porta Europa</AdminHeaderTitle>
      <AdminHeaderStudioLink />
    </AdminHeader>
  }
  nav={<NavItem render={<Link to="/admin/listings" />} icon={<BuildingIcon />} label="Listings" active />}
>
  <PageHeader title="Listings" />
  <PageBody>…</PageBody>
</AdminShell>
```

- **Next.js:** put the admin under its own layout (for example a route group whose layout has no site header) with `AdminProvider` in it, and render `AdminShell` from a `"use client"` component.
- **TanStack Start / Vite:** render `AdminProvider` from the admin layout route's component.
- **Own layout** (login, a full-screen editor): skip `AdminShell` and build the page from our components inside `AdminProvider`. It paints the admin background as tall as your page, so make the page fill the screen.
- **Admin pieces on a site page:** wrap them in `AdminProvider` too, so they're readable in either theme, and place it with `className` (`mt-8`). Use one per page, or nest them, so toasts don't show twice.
- **Links:** pass your router's link to `render` on `NavItem`, `Button` and `PageHeader`'s `back`.
- **Your own content inside the admin** (custom pages) keeps your site's classes and styles. Build it from our components where you can, so it matches.
- **Overriding our styles:** your site's classes on our components lose to ours, because your site's CSS is on the admin page too and Tailwind v4 puts it in a cascade layer. Size components from a wrapper element, or use Tailwind's important modifier (`w-40!`).
- **Theme:** System / Light / Dark in `AdminHeaderAccount`'s menu, applied to the admin only.

### Command palette

`<CommandPalette>` opens with ⌘K / Ctrl+K, or its "Search…" button. Put it in `AdminHeaderActions` and fill it with `CommandGroup` and `CommandItem`s whose `onSelect` navigates or runs an action. Build the nav and the palette from one list of pages.

### Forms

`@hooman-studio/admin-ui/form` (needs `@tanstack/react-form`) gives `useAdminForm`: TanStack Form's `useForm` with our submit handling. `onSubmit` receives the output of the `validators.onSubmit` schema (any Standard Schema, like Zod), so values come in parsed. It returns `{ ok: true, message? }`, `{ ok: false, message?, fieldErrors? }` or nothing; a thrown error shows "Something went wrong. Try again." Fields take the TanStack field, and one whose value type doesn't fit the field is a type error.

```tsx
const form = useAdminForm({
  defaultValues: listing,
  validators: { onSubmit: listingSchema },
  onSubmit: (listing) => updateListing(listing),
});

<AdminForm form={form}>
  <form.Field name="title">{(field) => <TextField field={field} label="Title" />}</form.Field>
  <FormError />
  <SubmitButton>Save</SubmitButton>
</AdminForm>
```

Fields: `TextField`, `TextareaField`, `NumberField`, `DateField`, `SelectField`, `RadioGroupField`, `ChecklistField` (a `string[]`, like related IDs), `FormCheckboxField`, `FormSwitchField`, `TagsField`, `FileField`. Empty number, date, select and file fields are `null`; wrap their schema in `required(schema, message)` from `@hooman-studio/admin-ui/zod` so the parsed value isn't. A `SelectField` on a nullable field can take `emptyLabel="None"`, a choice that sets it back to `null`. Group fields under a heading with `FieldSet` and `FieldLegend`.

`FileField` uploads a file as soon as it's picked and holds the ID your `upload(file, onProgress)` returns, so any storage works. The picked file shows at once with its progress, a rejected upload shows as the field's error, and you can't submit until it's done. `preview` shows a saved file; `removable` adds Remove on a nullable field.

```tsx
<FileField field={field} label="Audio tour" accept="audio/*" upload={upload} removable
  preview={(id) => <StoredFile id={id} />} />

// Your component, so it can use hooks to load the URL:
function StoredFile({ id }: { id: Id<"_storage"> }) {
  const url = useQuery(api.files.url, { id }); // undefined while loading
  return <FilePreview kind="audio" url={url} name="Audio tour" />;
}
```

`FilePreview` is the tile: an image, a video that plays inline, an audio player, or a file with its type (`kind`: `"image" | "video" | "audio" | "file"`).

`FormDialog` holds a form that starts fresh on every open and closes on `ok: true`; render `DialogBody` and `DialogFooter` in its `AdminForm`. `FormDrawer` is the same as a side sheet, with `DrawerBody` and `DrawerFooter`; put extra buttons before the `SubmitButton`. To open either from your own state, like the URL, pass `open` and `onOpenChange` instead of `trigger`.

Your own field takes `FieldProps<Value>` and calls `bindField`, which gives the field's error and an `onChange` that also clears the server's error. Here `ColorPicker` stands for your own control:

```tsx
function ColorField({ field, label, description }: FieldProps<string>) {
  const { error, onChange } = bindField(field);
  return (
    <FormField label={label} description={description} error={error}>
      <ColorPicker value={field.state.value} onValueChange={onChange} onBlur={field.handleBlur} />
    </FormField>
  );
}
```

Pass `bindField(field, (input) => value)` when the control reports something other than what the field holds, like `null`. See `playground/src/pages/typed-forms.tsx`.

### Tables

`DataTable` shows rows from your own data hook (`undefined` while loading). A column's `key` names a field of the row, or brings its own `cell`. Sorting, selection and paging are yours to hold, so it works for client and server data; `sortRows` and `paginate` from `./utils` do it on the client.

```tsx
const [sort, setSort] = useState<SortState | null>(null);

<DataTable
  aria-label="Listings"
  rows={listings && sortRows(listings, sort)}
  getRowId={(listing) => listing.id}
  columns={[
    { key: "title", header: "Listing", sortable: true },
    { key: "price", header: "Rent", align: "end", cell: (listing) => `€${listing.price}` },
  ]}
  sort={sort}
  onSortChange={setSort}
  rowLink={(listing) => <Link to={`/admin/listings/${listing.id}`} />}
/>
```

### Row menus

`DataTable`'s `rowActions` gives each row a "…" menu. For `ListRow` and `SortableListRow`, put a `RowMenu` with `MenuItem`s in `actions`: `<RowMenu label={faq.question}>` reads "Actions for {question}" to screen readers.

### Reorderable lists

`SortableList` is for short lists people put in order (FAQs, team members, menu items): drag a grip, or focus it and use Space and the arrows. `onReorder` gets the new order, and as its second argument the moved row with its new neighbours (`{ row, previous, next }`) for a "move after" save. The list keeps showing the new order until `rows` comes back in a new order, and goes back if the returned promise rejects.

```tsx
<Card variant="flush">
  <SortableList
    aria-label="FAQ order"
    rows={faqs}
    getRowId={(faq) => faq.id}
    onReorder={(faqs) => saveOrder(faqs.map((faq) => faq.id))}
  >
    {(faq) => (
      <SortableListRow
        title={faq.question}
        actions={
          <RowMenu label={faq.question}>
            <MenuItem onSelect={() => editFaq(faq)}>Edit</MenuItem>
          </RowMenu>
        }
      />
    )}
  </SortableList>
</Card>
```

### Server-safe helpers

`@hooman-studio/admin-ui/utils` (`sortRows`, `paginate`, the `FormResult` type) and `@hooman-studio/admin-ui/zod` (`required`) have no `"use client"`, so server actions and server components can import them.

## Known limits

- Sizes are in `rem`, so any root font size other than 16px scales the admin: `html { font-size: 62.5% }`, or `:root { font: 18px/… }` from the default Vite template.
- Our classes have the specificity of one class. Site rules that are more specific still win inside the admin: descendant rules like `.content h1`, and element rules with a pseudo-class or attribute, like `input[type="text"]`, `a:visited` or `a:hover`. Render the admin outside such wrappers, and scope those site rules away from it: `input[type="text"]:not([data-admin-ui] *)`.
- Rules from your site with the same specificity as one class, like Tailwind v3's preflight `[type='button']`, win when your site's CSS loads after ours. Import the admin CSS after your site's CSS.
- The theme applies after hydration, so a dark-mode user can see the light theme for a moment on first load.

## Develop

```sh
bun install
bun run dev     # playground on :5180: an example host site (#/site) with the admin inside
bun run check   # typecheck, lint, fallow, tests, build
```

See `AGENTS.md` for the rules.

### Release

Bump `version` in `package.json` and rename `## Unreleased` in `CHANGELOG.md` to it, on `main`, then push a tag: `git tag v0.1.1 && git push origin v0.1.1`. The release workflow runs the checks and stages the release on npm with provenance, through npm trusted publishing (no token in GitHub). It goes live once a maintainer approves it with 2FA: `npm stage list`, then `npm stage approve <stage-id>` (npm 11.15+).
