# admin-ui

`@hooman-studio/admin-ui`: React building blocks for Hooman Studio client admin panels. Hooman Studio's look (tokens and styles copied from `hooman-studio/packages/ui`) on top of [UI SDK](https://ui-sdk.dev) behaviors (keyboard, focus, ARIA, popups). It owns no data, routing or auth: apps pass in their own data, links and actions. The admin usually lives inside a client's own website (any React framework), so our CSS must never change the site and the site's CSS must not break the admin.

## Layout

- `src/components/*.tsx`: one file per component family. Everything public is exported from `src/index.ts`; typed forms from `src/form.tsx` (`./form`); plain functions and types that servers may import from `src/utils.ts` (`./utils`, built without "use client").
- `src/lib/`: shared helpers (`cn`) and pure logic.
- `src/styles.css`: tokens, the scoped reset and fonts. Built with Tailwind into `dist/styles.css`, which apps import; they need no Tailwind.
- `setup.md`: the one-time install guide that apps point their agent at. Keep it short: what code and types can't say (where to import the CSS, the AGENTS.md lines). Usage belongs in `README.md`, which ships in the package.
- `playground/`: a Vite app posing as a client's website (`site.css`: its own Tailwind plus hostile global styles) with the admin inside. Not published.

## Rules

- **Read the UI SDK docs before wrapping a component.** Follow `node_modules/@ui-sdk/core/skills/ui-sdk/SKILL.md`, read `node_modules/@ui-sdk/react/docs/llms.txt`, then only the component pages you need (`docs/components/<name>.md`). Never hand-roll a role, keyboard handling or focus logic that UI SDK ships.
- **Consumers never import `@ui-sdk/*`.** Wrap or re-export what they need, so we can upgrade the pinned beta in one place.
- **Every class is prefixed `au:`** (`au:flex au:hover:bg-alpha/5`), every variable `--au-*`. `src/prefix.test.ts` fails on an unprefixed class. Never add global selectors (`html`, `body`, bare elements) to `src/styles.css`; scope to `[data-admin-ui]`.
- **Style from state.** Use `data-slot` and state attributes (`data-open`, `data-disabled`, `data-starting-style`…) as Tailwind variants. No animation plugin: transitions on `data-starting-style` / `data-ending-style`. Avoid `divide-*` and `space-*`: Tailwind emits them at zero specificity, so the reset wins; use gap or `au:[&>*+*]:border-t`.
- **Look like the Hooman Studio dashboard.** Hairlines `au:border-alpha/10` (`/5` between rows), hover `au:bg-alpha/5`, one surface `au:bg-gray-50`, text `gray-950` / `gray-600` / `gray-500`, bars and rows `au:h-19 au:px-6`, focus and brand colour `accent`. When unsure, copy the matching component in `~/hooman/hooman-studio/packages/ui` or `packages/dashboard`.
- **Types first.** Strict TypeScript, no `any`. Make wrong use a type error (for example icon-only buttons require `aria-label`, table columns are keyed to the row type). Infer types from UI SDK props instead of redeclaring them.
- **Component shape.** Function components, `className?: string` merged with `cn`, other props passed through. Named exports at the end of the file.
- **Tests** only for our own pure logic (`bun test`, files next to the code as `*.test.ts`). UI SDK already tests its behaviors; don't render components to check props.

## Done means

- `bun run check` passes (typecheck, Biome/Ultracite, fallow, tests, build).
- New or changed components are shown in the playground, and checked in a browser with the `verify` skill at desktop and phone sizes, with the playground's hostile site styles in place.

## Never without asking

- Publish to npm, create release tags, or change the package name.
- Upgrade `@ui-sdk/*` (pinned exact; it is in beta).
