import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/form.tsx"],
  format: "esm",
  dts: true,
  // TanStack Form is a peer of ./form; keep its types (and form-core's) out of our bundle.
  deps: { neverBundle: [/^@tanstack\//u] },
  platform: "neutral",
  outputOptions: { banner: '"use client";' },
});
