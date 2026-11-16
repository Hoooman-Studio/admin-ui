# admin-ui

`@hooman-studio/admin-ui`: React building blocks for Hooman Studio client admin panels. Hooman Studio's look (tokens and styles copied from `hooman-studio/packages/ui`) on top of [UI SDK](https://ui-sdk.dev) behaviors (keyboard, focus, ARIA, popups). It owns no data, routing or auth: apps pass in their own data, links and actions.

## Layout

- `src/components/*.tsx`: one file per component family. Everything public is exported from `src/index.ts`.
- `src/lib/`: shared helpers (`cn`) and pure logic.
- `styles/styles.css`: tokens and base styles. Consumers import it after Tailwind v4, which compiles our class names from `dist`.
- `playground/`: a Vite app that shows every component in an example admin. Not published.

## Rules

- **Read the UI SDK docs before wrapping a component.** Follow `node_modules/@ui-sdk/core/skills/ui-sdk/SKILL.md`, read `node_modules/@ui-sdk/react/docs/llms.txt`, then only the component pages you need (`docs/components/<name>.md`). Never hand-roll a role, keyboard handling or focus logic that UI SDK ships.
- **Consumers never import `@ui-sdk/*`.** Wrap or re-export what they need, so we can upgrade the pinned beta in one place.
- **Style from state.** Use `data-slot` and state attributes (`data-open`, `data-disabled`, `data-starting-style`…) as Tailwind variants. No animation plugin: transitions on `data-starting-style` / `data-ending-style`.
- **Look like the Hooman Studio dashboard.** Hairlines `border-alpha/10` (`/5` between rows), hover `bg-alpha/5`, one surface `bg-gray-50`, text `gray-950` / `gray-600` / `gray-500`, bars and rows `h-19 px-6`, focus and brand colour `accent`. When unsure, copy the matching component in `~/hooman/hooman-studio/packages/ui` or `packages/dashboard`.
- **Types first.** Strict TypeScript, no `any`. Make wrong use a type error (for example icon-only buttons require `aria-label`, table columns are keyed to the row type). Infer types from UI SDK props instead of redeclaring them.
- **Component shape.** Function components, `className?: string` merged with `cn`, other props passed through. Named exports at the end of the file.
- **Tests** only for our own pure logic (`bun test`, files next to the code as `*.test.ts`). UI SDK already tests its behaviors; don't render components to check props.

## Done means

- `bun run check` passes (typecheck, Biome/Ultracite, fallow, tests, build).
- New or changed components are shown in the playground, and checked in a browser with the `verify` skill at desktop and phone sizes.

## Never without asking

- Publish to npm, create release tags, or change the package name.
- Upgrade `@ui-sdk/*` (pinned exact; it is in beta).
