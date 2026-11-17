import { describe, expect, test } from "bun:test";
import { formErrorText, hiddenFieldError } from "./form-errors";

const rendered =
  (...names: string[]) =>
  (path: string) =>
    names.includes(path);

describe("formErrorText (a schema's path → issues map)", () => {
  test("shows an issue without a path, like a refine across fields", () => {
    const issues = { "": [{ message: "End must follow start" }] };
    expect(formErrorText(issues, rendered("start", "end"))).toBe(
      "End must follow start"
    );
  });

  test("shows an issue for a path no field renders", () => {
    const issues = {
      "tags[0]": [{ message: "Tags are at most 20 characters" }],
    };
    expect(formErrorText(issues, rendered("tags"))).toBe(
      "Tags are at most 20 characters"
    );
  });

  test("leaves issues of rendered fields to those fields", () => {
    const issues = { title: [{ message: "Too short" }] };
    expect(formErrorText(issues, rendered("title"))).toBeNull();
  });

  test("reads a field named message as a field, not as an issue", () => {
    const issues = {
      message: [{ message: "Too short" }],
      "": [{ message: "Dates conflict" }],
    };
    expect(formErrorText(issues, rendered("message"))).toBe("Dates conflict");
  });
});

describe("hiddenFieldError (a refused submit's field → message map)", () => {
  test("shows the error of a field the form doesn't render, even next to a field named message", () => {
    const fieldErrors = { message: "Too short", slug: "Slug taken" };
    expect(hiddenFieldError(fieldErrors, rendered("message"))).toBe(
      "Slug taken"
    );
  });

  test("ignores empty messages", () => {
    expect(hiddenFieldError({ slug: "" }, rendered())).toBeUndefined();
  });
});
