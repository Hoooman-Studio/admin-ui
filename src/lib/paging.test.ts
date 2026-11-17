import { describe, expect, test } from "bun:test";
import { pageBounds, paginate } from "./paging";

describe("pageBounds", () => {
  test("ends the last page at the total", () => {
    expect(pageBounds(7, 20, 128)).toEqual({ first: 121, last: 128 });
  });

  test("reads a page past the end as the last page", () => {
    expect(pageBounds(12, 20, 128)).toEqual({ first: 121, last: 128 });
  });

  test("is 0–0 when there is nothing", () => {
    expect(pageBounds(1, 20, 0)).toEqual({ first: 0, last: 0 });
  });
});

describe("paginate", () => {
  const rows = Array.from({ length: 45 }, (_, index) => index + 1);

  test("returns the rows of a page", () => {
    expect(paginate(rows, 2, 20)).toEqual(rows.slice(20, 40));
  });

  test("returns the last page when the page is past the end, like after a filter", () => {
    expect(paginate(rows, 9, 20)).toEqual([41, 42, 43, 44, 45]);
  });

  test("returns the first page for a page below 1", () => {
    expect(paginate(rows, 0, 20)).toEqual(rows.slice(0, 20));
  });
});
