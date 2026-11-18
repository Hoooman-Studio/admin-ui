import { expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import * as form from "./form";
import * as main from "./index";

// Imports of the public entries (`../src`, `../src/form`); lint keeps unused imports out.
const publicImports =
  /import\s*\{(?<names>[^}]*)\}\s*from\s*"(?:\.\.\/)+src(?:\/form)?"/gu;

test("the playground shows every runtime export of . and ./form", () => {
  const dir = path.join(import.meta.dir, "../playground/src");
  const shown = new Set<string>();
  const files = readdirSync(dir, { recursive: true, encoding: "utf8" });
  for (const file of files.filter((name) => name.endsWith(".tsx"))) {
    const source = readFileSync(path.join(dir, file), "utf8");
    for (const match of source.matchAll(publicImports)) {
      for (const name of match.groups?.names?.split(",") ?? []) {
        shown.add(name.trim());
      }
    }
  }
  const missing = Object.keys({ ...main, ...form }).filter(
    (name) => !shown.has(name)
  );
  expect(missing).toEqual([]);
});
