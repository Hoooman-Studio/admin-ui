import { describe, expect, test } from "bun:test";
import { z } from "zod";
import { required } from "./required";

describe("required", () => {
  const rent = required(
    z.number().positive("Rent must be above 0."),
    "Enter the rent."
  );

  test("reports its message for an empty field", () => {
    const result = rent.safeParse(null);
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      "Enter the rent.",
    ]);
  });

  test("still runs the inner schema", () => {
    const result = rent.safeParse(-5);
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      "Rent must be above 0.",
    ]);
  });

  test("passes a filled value through", () => {
    expect(rent.parse(1850)).toBe(1850);
  });
});
