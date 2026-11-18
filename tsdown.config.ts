import { defineConfig } from "tsdown";

const shared = {
  format: "esm",
  dts: false,
  platform: "neutral",
  // The build script empties dist first; the builds share it.
  clean: false,
  // TanStack Form and Zod are peers of ./form and ./utils; keep them out of our bundle.
  deps: { neverBundle: [/^@tanstack\//u, "zod"] },
} as const;

export default defineConfig([
  {
    ...shared,
    entry: ["src/index.ts", "src/form.tsx"],
    outputOptions: { banner: '"use client";' },
  },
  // Server-safe: no "use client", so server actions and server components can call it.
  { ...shared, entry: ["src/utils.ts", "src/zod.ts"] },
  // Types build once per entry, so each .d.ts stands alone with no hashed chunk:
  // the build copies them to api/, where every public API change shows as a diff.
  ...["index.ts", "form.tsx", "utils.ts", "zod.ts"].map((file) => ({
    ...shared,
    entry: [`src/${file}`],
    dts: { emitDtsOnly: true },
  })),
]);
