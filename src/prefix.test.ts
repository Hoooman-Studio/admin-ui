import { expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { __unstable__loadDesignSystem } from "@tailwindcss/node";

// Single words that are utilities but used as prop values, like `variant="outline"`.
const propValues = new Set(["outline"]);
const strings = /"(?<quoted>[^"\\\n]*)"|`(?<template>[^`]*)`/gu;
const comments = /\/\*[\s\S]*?\*\/|^\s*\/\/.*$/gmu;
const interpolations = /\$\{[^}]*\}/gu;
const whitespace = /\s+/u;

test("every Tailwind class in the package carries the au: prefix", async () => {
  // A plain Tailwind setup: a class it knows without our prefix would ship unstyled.
  const plain = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: import.meta.dir,
  });
  const isUtility = (token: string) =>
    Boolean(plain.candidatesToCss([token])[0]);
  const dir = path.join(import.meta.dir, "components");
  const files = [
    ...readdirSync(dir).map((name) => path.join(dir, name)),
    path.join(import.meta.dir, "form.tsx"),
  ];

  const unprefixed: string[] = [];
  for (const file of files) {
    const source = readFileSync(file, "utf8").replace(comments, "");
    for (const match of source.matchAll(strings)) {
      const tokens = (match.groups?.quoted ?? match.groups?.template ?? "")
        .replace(interpolations, " ")
        .split(whitespace)
        .filter(Boolean);
      const classLike =
        tokens.length > 0 &&
        tokens.every((t) => t.startsWith("au:") || isUtility(t));
      if (!classLike) {
        continue;
      }
      for (const token of tokens) {
        if (!(token.startsWith("au:") || propValues.has(token))) {
          unprefixed.push(`${path.basename(file)}: ${token}`);
        }
      }
    }
  }
  expect(unprefixed).toEqual([]);
});
