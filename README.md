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

No Tailwind needed. If your site uses Tailwind (v3 or v4), it keeps working as before, even after someone navigates from the admin back to the site with the CSS still loaded: every class we ship is prefixed (`au:flex`), every variable is `--au-*`, and nothing styles `html`, `body` or your site's elements. Our font, reset and dark mode only apply inside the admin.

Render `AdminShell` as your admin route's whole page, without your site's header and footer (it fills the viewport):

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
  nav={<NavItem render={<Link to="/admin/listings" />} icon={<BuildingIcon />} label="Listings" active />}
>
  <PageHeader title="Listings" />
  <PageBody>…</PageBody>
</AdminShell>
```

- **Next.js:** put the admin under its own layout (for example a route group whose layout has no site header) and render `AdminShell` from a `"use client"` component.
- **TanStack Start / Vite:** render it from the admin route's component.
- **Links:** pass your router's link to `render` on `NavItem`, `Button` and `PageHeader`'s `back`.
- **Outside the shell:** wrap admin components in `<AdminScope>` to give them the admin's font, theme and accent on any other page.
- **Your own content inside the admin** (custom pages) keeps your site's classes and styles. Build it from our components where you can, so it matches.
- **Overriding our styles:** your site's classes on our components lose to ours, because your site's CSS is on the admin page too and Tailwind v4 puts it in a cascade layer. Size components from a wrapper element, or use Tailwind's important modifier (`w-40!`).
- **Brand colour:** `accent` on `AdminShell` (or `AdminScope`). **Theme:** System / Light / Dark in `AdminHeaderAccount`'s menu, applied to the admin only.

### Command palette

`<CommandPalette>` opens with ⌘K / Ctrl+K, or its "Search…" button. Put it in `AdminHeaderActions` and fill it with `CommandGroup` and `CommandItem`s whose `onSelect` navigates or runs an action. Build the nav and the palette from one list of pages.

### Forms

`@hooman-studio/admin-ui/form` (needs `@tanstack/react-form` and `zod`) gives `useAdminForm`: TanStack Form with our fields, typed from a Standard Schema like Zod. `onSubmit` can return `{ ok: true, message? }` or `{ ok: false, message?, fieldErrors? }`.

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

Empty number, date and select fields are `null`; wrap their schema in `required(schema, message)` so the parsed value isn't. `FormDialog` holds a form that starts fresh on every open and closes on `ok: true`. See `playground/src/pages/typed-forms.tsx`.

## Known limits

- A site that sets `html { font-size: 62.5% }` shrinks the admin, because sizes are in `rem`.
- The site's CSS can still reach the admin through selectors more specific than one class, like `.content h1`. Render the admin outside such wrappers.
- The theme applies after hydration, so a dark-mode user can see the light theme for a moment on first load.

## Develop

```sh
bun install
bun run dev     # playground on :5180: an example host site (#/site) with the admin inside
bun run check   # typecheck, lint, fallow, tests, build
```

See `AGENTS.md` for the rules.
