import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/form.tsx"],
  format: "esm",
  dts: true,
  // TanStack Form and Zod are peers of ./form; keep them (and form-core's types) out of our bundle.
  deps: { neverBundle: [/^@tanstack\//u, "zod"] },
  platform: "neutral",
  outputOptions: { banner: '"use client";' },
});
