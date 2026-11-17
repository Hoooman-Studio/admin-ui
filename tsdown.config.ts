import { defineConfig } from "tsdown";

const shared = {
  format: "esm",
  dts: true,
  platform: "neutral",
  // The build script empties dist first; the two builds share it.
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
  { ...shared, entry: ["src/utils.ts"] },
]);
