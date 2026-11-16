# @hooman-studio/admin-ui

Building blocks for Hooman Studio client admin panels: the Hooman Studio dashboard's look on top of [UI SDK](https://ui-sdk.dev) behaviors. Bring your own data, router and auth.

## Use it

Needs React 19 and Tailwind CSS v4. In your global stylesheet:

```css
@layer ui-sdk;
@import "tailwindcss";
@import "@hooman-studio/admin-ui/styles.css";
@import "@hooman-studio/admin-ui/fonts.css";
```

```tsx
<AdminShell
  accent="hsl(20 100% 50%)"
  header={
    <AdminHeader>
      <AdminHeaderAccount name={user.name} email={user.email} image={user.image}>
        <MenuItem onClick={signOut}>Sign out</MenuItem>
      </AdminHeaderAccount>
      <AdminHeaderTitle>Porta Europa</AdminHeaderTitle>
      <AdminHeaderStudioLink />
    </AdminHeader>
  }
  nav={<NavItem href="/admin/listings" icon={<BuildingIcon />} label="Listings" active />}
>
  <PageHeader title="Listings" />
  <PageBody>…</PageBody>
</AdminShell>
```

### Command palette

`<CommandPalette>` opens with ⌘K / Ctrl+K, or its "Search…" button. Put it in `AdminHeaderActions` and fill it with `CommandGroup` and `CommandItem`s whose `onSelect` navigates or runs an action. Build the nav and the palette from one list of pages.

### Forms

`@hooman-studio/admin-ui/form` (needs `@tanstack/react-form`) gives `useAdminForm`: TanStack Form with our fields, typed from a Standard Schema like Zod. `onSubmit` can return `{ ok: true, message? }` or `{ ok: false, message?, fieldErrors? }`.

```tsx
const form = useAdminForm({
  defaultValues: listing,
  validators: { onSubmit: listingSchema },
  onSubmit: ({ value }) => updateListing(listingSchema.parse(value)),
});

<AdminForm form={form}>
  <form.AppField name="title">{(f) => <f.TextField label="Title" />}</form.AppField>
  <form.FormError />
  <form.SubmitButton>Save</form.SubmitButton>
</AdminForm>
```

`FormDialog` holds a form that starts fresh on every open and closes on `ok: true`. See `playground/src/pages/typed-forms.tsx`.

Set the client's brand colour with `--accent` on `:root`. Dark mode is `data-theme="dark"` on `<html>`; `AdminShell` sets it from the System / Light / Dark choice in `AdminHeaderAccount`'s menu.

## Develop

```sh
bun install
bun run dev     # playground on :5180
bun run check   # typecheck, lint, fallow, tests, build
```

See `AGENTS.md` for the rules.
