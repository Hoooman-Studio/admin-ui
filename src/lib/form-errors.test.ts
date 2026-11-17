import { describe, expect, test } from "bun:test";
import { formErrorText } from "./form-errors";

const rendered =
  (...names: string[]) =>
  (path: string) =>
    names.includes(path);

describe("formErrorText", () => {
  test("shows a schema issue without a path, like a refine across fields", () => {
    const issues = { "": [{ message: "End must follow start" }] };
    expect(formErrorText(issues, rendered("start", "end"))).toBe(
      "End must follow start"
    );
  });

  test("shows a schema issue for a path no field renders", () => {
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

  test("shows a refused field error for a field the form doesn't render", () => {
    expect(formErrorText({ slug: "Slug taken" }, rendered("title"))).toBe(
      "Slug taken"
    );
  });

  test("passes a plain message through", () => {
    expect(formErrorText("Not saved", rendered())).toBe("Not saved");
  });
});
