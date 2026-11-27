import { describe, expect, test } from "bun:test";
import { isFormResult } from "./form-result";

describe("isFormResult", () => {
  test("accepts a returned result", () => {
    expect(isFormResult({ ok: false, message: "Add a homepage first." })).toBe(
      true
    );
  });

  test("ignores a fetch Response, which also has a boolean ok", () => {
    expect(isFormResult(new Response(null, { status: 409 }))).toBe(false);
  });
});
