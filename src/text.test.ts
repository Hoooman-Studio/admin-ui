import { expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const strings = /"(?<quoted>[^"\\\n]*)"|`(?<template>[^`]*)`/gu;
const comments = /\/\*[\s\S]*?\*\/|^\s*\/\/.*$/gmu;
// Errors and warnings for the app's developer, not the person using the admin.
const developerText = /(?:new Error|console\.\w+)\(\s*(?:"[^"]*"|`[^`]*`)/gu;
const interpolations = /\$\{[^}]*\}/gu;
const whitespace = /\s+/u;
const capitalized = /^[A-Z][a-z]+[.,:?!…]?$/u;
const word = /^[a-z]+[.,:?!…]?$/u;

/** Words for people: a capitalized word, or two words in a row, like "Close" or "${count} selected". */
function isText(value: string) {
  const tokens = value.replace(interpolations, " ").split(whitespace);
  return tokens.some(
    (token, index) =>
      capitalized.test(token) ||
      (word.test(token) && word.test(tokens[index + 1] ?? ""))
  );
}

test("text people read comes from the messages, so apps can translate it", () => {
  // JSX text is Biome's noJsxLiterals; this catches it in props and defaults.
  const files = [
    ...["components", "patterns"].flatMap((folder) => {
      const dir = path.join(import.meta.dir, folder);
      return readdirSync(dir).map((name) => path.join(dir, name));
    }),
    path.join(import.meta.dir, "form.tsx"),
  ].filter((file) => path.basename(file) !== "messages.ts");

  const hardCoded: string[] = [];
  for (const file of files) {
    const source = readFileSync(file, "utf8")
      .replace(comments, "")
      .replace(developerText, "");
    for (const match of source.matchAll(strings)) {
      const value = match.groups?.quoted ?? match.groups?.template ?? "";
      if (isText(value)) {
        hardCoded.push(`${path.basename(file)}: ${value}`);
      }
    }
  }
  expect(hardCoded).toEqual([]);
});
