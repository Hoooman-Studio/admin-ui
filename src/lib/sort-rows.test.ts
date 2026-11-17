import { describe, expect, test } from "bun:test";
import { sortRows } from "./sort-rows";

const titles = (rows: readonly { title: string }[]) =>
  rows.map((row) => row.title);

describe("sortRows", () => {
  test("sorts text in natural order, ignoring case", () => {
    const rows = [{ title: "unit 10" }, { title: "Unit 2" }, { title: "apt" }];
    expect(titles(sortRows(rows, { key: "title", direction: "asc" }))).toEqual([
      "apt",
      "Unit 2",
      "unit 10",
    ]);
  });

  test("sorts dates and numbers by value, descending", () => {
    const rows = [
      { title: "a", at: new Date("2026-01-02"), price: 9 },
      { title: "b", at: new Date("2026-03-01"), price: 100 },
      { title: "c", at: new Date("2025-12-31"), price: 20 },
    ];
    expect(titles(sortRows(rows, { key: "at", direction: "desc" }))).toEqual([
      "b",
      "a",
      "c",
    ]);
    expect(titles(sortRows(rows, { key: "price", direction: "desc" }))).toEqual(
      ["b", "c", "a"]
    );
  });

  test("puts empty values last in both directions", () => {
    const rows = [
      { title: "none", price: null },
      { title: "low", price: 1 },
      { title: "unset", price: undefined },
      { title: "high", price: 5 },
    ];
    expect(titles(sortRows(rows, { key: "price", direction: "asc" }))).toEqual([
      "low",
      "high",
      "none",
      "unset",
    ]);
    expect(titles(sortRows(rows, { key: "price", direction: "desc" }))).toEqual(
      ["high", "low", "none", "unset"]
    );
  });

  test("keeps the original order for ties", () => {
    const rows = [
      { title: "first", city: "Rome" },
      { title: "second", city: "Berlin" },
      { title: "third", city: "Rome" },
    ];
    expect(titles(sortRows(rows, { key: "city", direction: "desc" }))).toEqual([
      "first",
      "third",
      "second",
    ]);
  });
});
