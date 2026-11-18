# Set up @hooman-studio/admin-ui in this project

You are adding a Hooman Studio admin panel to an existing React 19 website. The admin lives on the same site, usually at `/admin`. Keep the user's existing changes; don't touch the site's own pages or styles.

1. **Check the project.** Find the framework (Next.js App Router, TanStack Start, or a Vite React app) and whether the site uses Tailwind CSS v4 (`tailwindcss` 4.x in `package.json`). Stop and ask if it isn't React 19.
2. **Install** `@hooman-studio/admin-ui` with the project's package manager. If the admin needs forms, also install `@tanstack/react-form` and `zod`.
3. **Add the admin route** as its own layout without the site's header and footer, for example a Next.js route group with its own layout, or a TanStack Start / router layout route. Wrap every admin page in `AdminProvider` there, the login page too, and render `AdminShell` on the normal admin pages, as in the package README.
4. **Load the CSS in that route only:**
   - Site on Tailwind v4: create an admin CSS file next to the route with `@import "@hooman-studio/admin-ui/tailwind.css";` and `@source "./";`, and import that file in the route. Admin code can then use `au:` classes. Admin code in another folder, like `src/components/admin`, needs its own `@source` line, or its `au:` classes are missing.
   - Otherwise: `import "@hooman-studio/admin-ui/styles.css";` in the route.
5. **Point future agents at the docs.** Add to the project's `AGENTS.md` (create it if missing):

   ```md
   ## Admin panel
   The admin at `/admin` uses `@hooman-studio/admin-ui`. Before working on it, read `node_modules/@hooman-studio/admin-ui/README.md`. Build admin screens from its components; for your own styling in admin code use `au:` classes.
   ```

   Leave out the `au:` sentence if the site isn't on Tailwind v4.
6. **Check it works.** Run the project's typecheck. Start the dev server, open the admin route, and check the browser console: a warning from `@hooman-studio/admin-ui` means the CSS isn't loaded. Then open a page of the site and check it looks as before.

Report what you added and anything you couldn't check.
