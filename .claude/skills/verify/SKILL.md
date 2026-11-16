---
name: verify
description: Run the admin-ui playground and check components in a real browser with agent-browser. Use after any change to a component or styles.
---

# Verify admin-ui

1. `bun install` in a fresh worktree.
2. Start the playground: `PORT=<free port> bun run dev` (run it in the background; default port 5180). Each worktree or agent picks its own port.
3. Run `agent-browser skills get core` once, then use a session named `$(agent-browser session id --scope worktree --prefix admin-ui)`.
4. Open `http://localhost:<port>/#/<page>`. Pages are listed in `playground/src/app.tsx`.
5. Check each changed component:
   - Take screenshots at desktop (1280×900) and phone (390×844) sizes and look at them.
   - Use it with the keyboard (Tab, arrows, Enter, Escape) and check focus lands where it should.
   - Check dark mode from the account menu (the avatar at the top left).
   - `agent-browser errors` shows console errors. There should be none.
6. Close the browser session and stop the dev server when done.
